const fs = require('fs');
const path = require('path');

const corePath = path.join('src', 'core.js');
const tmAdapterPath = path.join('src', 'adapter-tampermonkey.js');
const extAdapterPath = path.join('src', 'adapter-extension.js');
const appreciationImagePath = 'wx_appreciation_code.jpg';
const extensionIconSizes = [16, 32, 48, 128];
const brandingDir = path.join('assets', 'branding', 'png');

const coreSrc = fs.readFileSync(corePath, 'utf-8');
const tmAdapterSrc = fs.readFileSync(tmAdapterPath, 'utf-8');
const extAdapterSrc = fs.readFileSync(extAdapterPath, 'utf-8');
const appreciationImageDataUrl = `data:image/jpeg;base64,${fs.readFileSync(appreciationImagePath).toString('base64')}`;
const compiledCoreSrc = coreSrc.replace(/__FORUMMATE_APPRECIATION_IMAGE_DATA_URL__/g, appreciationImageDataUrl);

// Ensure directories exist
['src', 'dist-extension', 'dist-extension/icons'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Build Tampermonkey Userscript
const tmOutput = `${tmAdapterSrc}\n\n${compiledCoreSrc}`;
fs.writeFileSync('forummate-tampermonkey.user.js', tmOutput, 'utf-8');
console.log('✅ Built forummate-tampermonkey.user.js');

// 2. Build Extension Content Script
let extCore = compiledCoreSrc;
// Export openSettingsModal to window for popup access
extCore = extCore.replace('function openSettingsModal(forcedHostname)', 'window.openForumMateSettings = openSettingsModal; function openSettingsModal(forcedHostname)');
extCore = extCore.replace(/\(function\s*\(\)\s*\{/, 'ForumMateAdapter._init(function() {');
const extOutput = `${extAdapterSrc}\n\n${extCore}`;
fs.writeFileSync(path.join('dist-extension', 'content.js'), extOutput, 'utf-8');
console.log('✅ Built dist-extension/content.js');

// 3. Copy extension icons
for (const size of extensionIconSizes) {
    const iconFileName = `forummate-icon-${size}.png`;
    const sourcePath = path.join(brandingDir, iconFileName);
    const targetPath = path.join('dist-extension', 'icons', iconFileName);

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Missing extension icon asset: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, targetPath);
}
console.log('✅ Copied dist-extension/icons assets');

// 4. Build Extension manifest.json
const manifest = {
    "manifest_version": 3,
    "name": "ForumMate 论坛增强助手",
    "version": "1.10.2",
    "description": "面向论坛场景的浏览器辅助工具，支持 2libra.com、middlefun.com、v2ex.com 与 linux.do。",
    "icons": {
        "16": "icons/forummate-icon-16.png",
        "32": "icons/forummate-icon-32.png",
        "48": "icons/forummate-icon-48.png",
        "128": "icons/forummate-icon-128.png"
    },
    "permissions": ["storage", "activeTab"],
    "content_scripts": [
        {
            "matches": [
                "*://*.2libra.com/*",
                "*://*.middlefun.com/*",
                "*://*.v2ex.com/*",
                "*://linux.do/*",
                "*://*.linux.do/*"
            ],
            "js": ["content.js"],
            "run_at": "document_idle"
        }
    ],
    "action": {
        "default_title": "ForumMate 设置",
        "default_popup": "popup.html",
        "default_icon": {
            "16": "icons/forummate-icon-16.png",
            "32": "icons/forummate-icon-32.png",
            "48": "icons/forummate-icon-48.png"
        }
    }
};

fs.writeFileSync(path.join('dist-extension', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('✅ Built dist-extension/manifest.json');

// 5. Create popup.html
const popupHtml = `<!DOCTYPE html>
<html style="overflow: hidden;">
<head>
    <meta charset="UTF-8">
    <style>
        html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 480px; 
            height: 600px; 
            overflow: hidden !important; 
            background: #fff;
        }
        
        #forummate-settings-modal {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: transparent !important;
            display: flex !important;
            flex-direction: column !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            z-index: 1 !important;
            padding: 0 !important;
        }
        
        #forummate-settings-modal .settings-panel {
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            margin: 0 !important;
        }

        #forummate-settings-modal .settings-body {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 12px 16px 24px 16px !important;
        }

        #forummate-settings-modal .settings-header {
            padding: 12px 16px !important;
        }

        #forummate-settings-modal .btn-close-settings {
            display: none !important;
        }
        
        #forummate-settings-modal .settings-footer {
            margin-top: auto !important;
            background: #f9fafb !important;
            border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
            padding: 10px 16px !important;
        }
    </style>
</head>
<body style="overflow: hidden;">
    <script src="content.js"></script>
    <script src="popup.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join('dist-extension', 'popup.html'), popupHtml, 'utf-8');

// 6. Create popup.js (Enhanced to detect active tab hostname)
const popupJs = `
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    let hostname = null;
    const activeTab = tabs[0];
    if (activeTab && activeTab.url) {
        try {
            const url = new URL(activeTab.url);
            hostname = url.hostname;
        } catch (e) {}
    }

    // Ensure settings are loaded and then open the modal with hostname context
    const tryOpen = () => {
        if (window.openForumMateSettings) {
            window.openForumMateSettings(hostname);
        } else {
            setTimeout(tryOpen, 20);
        }
    };
    tryOpen();
});
`;
fs.writeFileSync(path.join('dist-extension', 'popup.js'), popupJs, 'utf-8');
console.log('✅ Built dist-extension popup files (Context-Aware)');
