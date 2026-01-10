(function() {
    'use strict';

    // 2libra-enhance 浏览器扩展核心逻辑
    // 保持与 2libra-enhance-tampermonkey.js 逻辑同步

    const CONFIG = {
        btnText: '快速查看',
        modalId: 'libra-quick-view-modal',
        iframeId: 'libra-quick-view-iframe'
    };

    const style = document.createElement('style');
    style.textContent = `
        .libra-quick-btn {
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 10px;
            white-space: nowrap;
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 4px;
            background-color: var(--color-primary, #4a00ff);
            color: #fff;
            border: none;
            display: none;
            transition: opacity 0.2s;
        }
        .libra-post-item:hover .libra-quick-btn {
            display: inline-block;
        }
        .libra-quick-btn:hover {
            opacity: 0.9;
        }
        #custom-back-to-top {
            position: fixed;
            z-index: 9990;
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            color: var(--color-primary, #4a00ff);
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            display: none;
            justify-content: center;
            align-items: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px);
        }
        #custom-back-to-top.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        #custom-back-to-top:hover {
            background: var(--color-primary, #4a00ff);
            color: #fff;
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(74, 0, 255, 0.2);
            border-color: transparent;
        }
        #custom-back-to-top svg {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
        }
        #custom-back-to-top:hover svg {
            transform: translateY(-2px);
        }
        #${CONFIG.modalId} {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        #${CONFIG.modalId}.active { opacity: 1; pointer-events: auto; }
        #${CONFIG.modalId} .modal-content {
            width: 90%; max-width: 1000px; height: 90%;
            background: var(--base-100, #fff); border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex; flex-direction: column; overflow: hidden; position: relative;
        }
        #${CONFIG.modalId} .modal-header {
            padding: 10px 20px; border-bottom: 1px solid rgba(0,0,0,0.1);
            display: flex; justify-content: space-between; align-items: center;
            background: var(--base-200, #f0f0f0);
        }
        #${CONFIG.modalId} .modal-title { font-weight: bold; font-size: 16px; }
        #${CONFIG.modalId} .modal-actions { display: flex; gap: 12px; align-items: center; }
        #${CONFIG.modalId} .btn-go-thread {
            padding: 6px 16px; background-color: var(--color-primary, #4a00ff);
            color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;
        }
        #${CONFIG.modalId} .btn-close-large {
            padding: 6px 16px; background-color: #e5e7eb;
            color: #374151; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
        }
        #${CONFIG.modalId} iframe { width: 100%; height: 100%; border: none; background: var(--base-100, #fff); }
    `;
    document.head.appendChild(style);

    function createModal() {
        if (document.getElementById(CONFIG.modalId)) return;
        const modal = document.createElement('div');
        modal.id = CONFIG.modalId;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">快速预览</span>
                    <div class="modal-actions">
                        <button class="btn-go-thread">进入帖子 ↗</button>
                        <button class="btn-close-large">关闭</button>
                    </div>
                </div>
                <iframe id="${CONFIG.iframeId}" src=""></iframe>
            </div>
        `;
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        modal.querySelector('.btn-close-large').addEventListener('click', closeModal);
        document.body.appendChild(modal);
    }

    function openModal(url, title) {
        createModal();
        const modal = document.getElementById(CONFIG.modalId);
        const iframe = document.getElementById(CONFIG.iframeId);
        const goBtn = modal.querySelector('.btn-go-thread');
        iframe.src = url;
        modal.querySelector('.modal-title').textContent = title || '快速预览';
        goBtn.onclick = () => { window.location.href = url; };
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument;
                const css = `
                    header, .navbar, footer, aside, .menu, [role="banner"], [role="contentinfo"] { display: none !important; }
                    div.flex.items-center.justify-between { display: none !important; }
                    [data-main-left="true"], .flex-1, .w-full {
                        position: fixed !important; top: 0 !important; left: 0 !important;
                        width: 100vw !important; height: 100vh !important;
                        z-index: 2147483647 !important; background: var(--base-100, #fff) !important;
                        overflow-y: auto !important; padding: 20px !important; margin: 0 !important; border: none !important;
                    }
                    body, html { overflow: hidden !important; }
                `;
                const style = doc.createElement('style');
                style.textContent = css;
                doc.head.appendChild(style);
            } catch (e) {}
        };
    }

    function closeModal() {
        const modal = document.getElementById(CONFIG.modalId);
        const iframe = document.getElementById(CONFIG.iframeId);
        if (modal) {
            modal.classList.remove('active');
            iframe.src = '';
            document.body.style.overflow = '';
        }
    }

    function processListItem(li) {
        if (!li || li.dataset.libraQuickBtnAdded) return;
        const timeEl = li.querySelector('time');
        if (!timeEl) return;
        const metaRow = timeEl.parentElement;
        const titleLink = metaRow ? metaRow.previousElementSibling : null;
        if (!titleLink || titleLink.tagName !== 'A') return;
        li.dataset.libraQuickBtnAdded = 'true';
        li.classList.add('libra-post-item');
        const parent = timeEl.parentElement; 
        if (parent) {
            parent.style.position = 'relative';
            const btn = document.createElement('button');
            btn.className = 'libra-quick-btn';
            btn.textContent = CONFIG.btnText;
            btn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                openModal(titleLink.href, titleLink.textContent);
            };
            parent.appendChild(btn);
        }
    }

    document.body.addEventListener('mouseover', (e) => {
        const li = e.target.closest('li');
        if (li) processListItem(li);
    }, { passive: true });

    const topButton = document.createElement('button');
    topButton.id = 'custom-back-to-top';
    topButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    document.body.appendChild(topButton);
    topButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    function updateTopButtonPosition() {
        const card = document.querySelector('ul.card') || document.querySelector('[data-main-left="true"]') || document.querySelector('.flex-1');
        if (!card) {
            topButton.classList.remove('visible');
            setTimeout(() => { if(!topButton.classList.contains('visible')) topButton.style.display = 'none'; }, 300);
            return;
        }
        const cardRect = card.getBoundingClientRect();
        if (window.innerWidth < cardRect.width + 60 || window.scrollY <= 100) {
            if (topButton.classList.contains('visible')) {
                topButton.classList.remove('visible');
                setTimeout(() => { if(!topButton.classList.contains('visible')) topButton.style.display = 'none'; }, 300);
            }
            return;
        }
        topButton.style.display = 'flex';
        requestAnimationFrame(() => { topButton.classList.add('visible'); });
        topButton.style.left = `${cardRect.right + 16}px`;
        topButton.style.right = 'auto';
        const bh = topButton.offsetHeight;
        topButton.style.top = `${Math.min(window.innerHeight - bh - 24, cardRect.bottom - bh)}px`;
    }

    let ticking = false;
    function throttledUpdater() {
        if (!ticking) {
            window.requestAnimationFrame(() => { updateTopButtonPosition(); ticking = false; });
            ticking = true;
        }
    }
    window.addEventListener('scroll', throttledUpdater);
    window.addEventListener('resize', throttledUpdater);
    setTimeout(throttledUpdater, 500);

})();