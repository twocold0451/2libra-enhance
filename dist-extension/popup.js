
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
