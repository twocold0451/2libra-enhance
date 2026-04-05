// --- Extension Adapter ---
const _extensionStorageCache = {};

const ForumMateAdapter = {
    getValue: (key, defaultValue) => {
        if (Object.prototype.hasOwnProperty.call(_extensionStorageCache, key)) {
            return _extensionStorageCache[key];
        }
        return defaultValue;
    },
    setValue: (key, value) => {
        _extensionStorageCache[key] = value;
        chrome.storage.local.set({ [key]: value });
    },
    registerMenuCommand: (name, fn) => {
        // In the extension, we can expose a way to trigger the menu.
        // For example, by listening to messages from the background script or a popup.
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'open_settings') {
                fn();
            }
        });
    },
    
    // Asynchronous initialization for extension
    _init: async function(callback) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(null, (data) => {
                Object.assign(_extensionStorageCache, data);
                callback();
            });

            // Listen for changes from other contexts (e.g., popup changing settings)
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName !== 'local') return;
                for (let key in changes) {
                    _extensionStorageCache[key] = changes[key].newValue;
                    if (typeof window.onForumMateSettingChanged === 'function') {
                        window.onForumMateSettingChanged(key, changes[key].newValue);
                    }
                }
            });
        } else {
            callback();
        }
    }
};
