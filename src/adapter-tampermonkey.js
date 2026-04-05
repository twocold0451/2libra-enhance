// ==UserScript==
// @name         ForumMate 论坛增强助手
// @namespace    http://tampermonkey.net/
// @version      1.10.2
// @description  ForumMate 论坛增强助手：当前支持 2libra.com、middlefun.com、v2ex.com、linux.do 的帖子快速查看与筛选
// @author       twocold0451
// @homepage     https://github.com/twocold0451/forum-mate
// @supportURL   https://github.com/twocold0451/forum-mate/issues
// @match        https://*.2libra.com/*
// @match        https://*.middlefun.com/*
// @match        https://*.v2ex.com/*
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// --- Tampermonkey Adapter ---
const ForumMateAdapter = {
    getValue: (key, defaultValue) => {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue(key, defaultValue);
        }
        return defaultValue;
    },
    setValue: (key, value) => {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(key, value);
        }
    },
    registerMenuCommand: (name, fn) => {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand(name, fn);
        }
    }
};
