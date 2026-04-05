# ForumMate Edge 审核备注

以下内容可直接粘贴到 Partner Center 的 `Notes for certification`。

---

This extension is a forum browsing helper for supported websites only.

Supported sites in the current submission:

- `*.2libra.com`
- `*.middlefun.com`
- `*.v2ex.com`
- `linux.do`
- `*.linux.do`

Main features to verify:

1. Open any supported site homepage or topic list page.
2. The extension injects quick-view UI for supported post lists.
3. Click a supported topic title or quick-view entry to open the preview modal.
4. Open the extension popup to view and edit per-site settings.
5. On V2EX, test channel filtering and title keyword filtering in settings.
6. Scroll the page to verify the back-to-top button behavior on supported sites.

Additional notes:

- No account or login is required.
- No external backend service is required.
- User settings are stored locally in `chrome.storage.local`.
- The extension does not upload browsing content to the developer.
- The `activeTab` permission is used only to detect the current tab hostname in the popup and show the relevant site settings.

Support page:

- <https://github.com/twocold0451/forum-mate/issues>

Privacy policy:

- Please use the public privacy policy URL corresponding to this repository before submission.
