# 2libra-enhance (2libra 论坛增强插件)

这是一个为 [2libra.com](https://2libra.com/) 论坛开发的浏览器辅助工具

主要功能：
1.  **快速预览 (Quick View)**：在帖子列表页，鼠标悬停时显示“快速查看”按钮，点击即可弹窗阅读帖子内容并直接回复，无需跳转页面。
2.  **纯净模式**：弹窗自动过滤掉侧边栏、页眉页脚等干扰元素，提供沉浸式阅读体验。
3.  **智能返回顶部**：全新的悬浮返回顶部按钮，智能吸附在内容区右侧。

## 📥 快速开始

### 方式一：油猴脚本 (Tampermonkey)
#### 一键安装
1. 点击 [GreasyFork一键安装](https://greasyfork.org/en/scripts/562089)
2. 点击 "安装此脚本"
3. 脚本会自动在Tampermonkey中打开，点击保存

#### GitHub 直接安装
1.  **安装扩展**：确保你的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展 (Chrome / Edge / Firefox)。
2.  **安装脚本**：
    *   点击 [2libra-enhance-tampermonkey.user.js](https://raw.githubusercontent.com/twocold0451/2libra-enhance/main/2libra-enhance-tampermonkey.user.js) 链接。
    *   Tampermonkey 会自动识别并提示安装，点击“安装”即可。
3.  **开始使用**：刷新 2libra.com 页面即可生效。

### 方式二：Chrome / Edge 开发者模式 (本地加载)

1.  **下载源码**：下载本项目代码到本地文件夹。
2.  **打开扩展管理**：
    *   Chrome: 输入 `chrome://extensions`
    *   Edge: 输入 `edge://extensions`
3.  **开启开发者模式**：打开右上角的“开发者模式”开关。
4.  **加载扩展**：点击左上角的“加载已解压的扩展程序”，选择本项目文件夹。
5.  **开始使用**：刷新 2libra.com 页面即可生效。

## ✨ 功能特性详情

### ⚡ 快速查看 (Quick View)
*   **触发方式**：鼠标悬停在帖子列表的任一行，按钮会自动出现在“最后回复时间”的右侧。
*   **无缝阅读**：点击按钮弹出全屏模态框，直接加载帖子详情。

### 🚀 智能返回顶部
*   **自适应布局**：按钮会自动计算位置，始终紧贴内容列表的右侧边缘（支持列表页和详情页）。

## 🛠️ 开发说明

*   **manifest.json**: 浏览器扩展的配置文件 (Manifest V3)。
*   **content.js**: 浏览器扩展的核心逻辑代码。
*   **2libra-enhance-tampermonkey.user.js**: Tampermonkey 油猴脚本，逻辑与 content.js 保持同步。

---
Author: [twocold0451](https://github.com/twocold0451)  
License: MIT