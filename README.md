# ForumMate (论坛增强助手)

ForumMate 是一个面向论坛场景的浏览器辅助工具。当前已支持 [2libra.com](https://2libra.com/)、[middlefun.com](https://middlefun.com/)、[v2ex.com](https://v2ex.com/) 与 [linux.do](https://linux.do/)（均支持子域名），后续会继续扩展更多论坛。

当前项目已同时支持两种分发形态：

- Tampermonkey 油猴脚本
- Chromium 扩展版（支持 Microsoft Edge，也可兼容其他 Chromium 浏览器）

## 📥 安装方式

### 方式一：Tampermonkey 油猴脚本
1. 点击 [GreasyFork一键安装](https://greasyfork.org/en/scripts/562089)
2. 点击“安装此脚本”
3. 脚本会自动在 Tampermonkey 中打开，点击保存

### 方式二：GitHub 直接安装油猴脚本
1. **安装扩展**：确保你的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. **安装脚本**：
   - 点击 [forummate-tampermonkey.user.js](https://raw.githubusercontent.com/twocold0451/forum-mate/main/forummate-tampermonkey.user.js) 链接。
   - Tampermonkey 会自动识别并提示安装，点击“安装”即可。
3. **开始使用**：刷新已支持的论坛页面即可生效。

### 方式三：Chromium 扩展版

适用于 Microsoft Edge 以及其他兼容 Manifest V3 的 Chromium 浏览器。

#### Edge 商店安装
- 如已上架，可优先通过官方 Edge 商店页面安装。

#### 本地手动加载
1. 克隆或下载本仓库。
2. 运行 `npm run build` 生成扩展产物。
3. 打开 Edge 的 `扩展` 页面，开启 `开发人员模式`。
4. 选择 `加载解压缩的扩展`，指向仓库中的 `dist-extension/` 目录。

## 🧱 项目结构

ForumMate 采用“核心逻辑 + 平台适配层”的结构，方便同时维护油猴脚本和浏览器扩展版本。

- `src/core.js`：站点能力、UI、设置逻辑等核心实现
- `src/adapter-tampermonkey.js`：Tampermonkey 适配层
- `src/adapter-extension.js`：浏览器扩展适配层
- `build.js`：构建脚本，输出油猴脚本与扩展产物
- `dist-extension/`：浏览器扩展构建产物
- `forummate-tampermonkey.user.js`：油猴脚本构建产物

## 🌐 支持的网站

### [2libra.com](https://2libra.com/auth/signup/BDuSGDY5Sl)
- 当前能力：点击标题快速查看、通知快速查看、返回顶部按钮

#### 功能说明
- **快速预览**：点击标题在弹窗中预览内容。
- **通知快速查看**：点击通知入口可在弹窗中快速查看通知内容。
- **返回顶部按钮**：滚动后显示悬浮按钮。

### [middlefun.com](https://www.middlefun.com/invite/two%20cold)
- 当前能力：点击标题快速查看、返回顶部按钮

#### 功能说明
- **快速预览**：点击标题在弹窗中预览内容。
- **返回顶部按钮**：滚动后显示悬浮按钮。

### [v2ex.com](https://v2ex.com/)
- 当前能力：点击标题快速查看、按频道与标题关键字屏蔽帖子、返回顶部按钮

#### 功能说明
- **快速预览**：点击标题在弹窗中预览内容。
- **频道屏蔽**：可按频道中文名或英文 slug 屏蔽帖子，支持多个频道。
- **频道/标题独立屏蔽**：`屏蔽频道` 与 `标题关键字` 都可单独生效，不再要求必须同时填写。
- **规则关系可选**：当两项都填写时，可在设置里选择 `and` 或 `or` 关系决定命中方式。
- **返回顶部按钮**：滚动后显示悬浮按钮。

### [linux.do](https://linux.do/)
- 当前能力：点击标题快速查看、返回顶部按钮

#### 功能说明
- **快速预览**：点击标题在弹窗中预览内容。
- **返回顶部按钮**：滚动后显示悬浮按钮。

## ⚙️ 设置说明

- 设置项按站点分组展示（2libra / middlefun / v2ex / linux.do）。
- 默认行为为：**当前访问站点展开，其他站点折叠**。
- 支持站点分组手动展开/收起。
- 支持按站点分别设置预览弹窗宽度。
- 支持一键 **展开全部 / 收起全部**。

## 更新日志

- 完整更新日志请见 [CHANGELOG.md](./CHANGELOG.md)

## 📄 发布相关文档

- 隐私政策：[`docs/privacy-policy.md`](./docs/privacy-policy.md)
- Edge 商店文案包：[`docs/edge-store-submission.md`](./docs/edge-store-submission.md)
- Edge 审核备注：[`docs/edge-certification-notes.md`](./docs/edge-certification-notes.md)

## 赞赏支持

如果 ForumMate 对你有帮助，欢迎扫码支持继续更新。

<img src="wx_appreciation_code.jpg" alt="微信赞赏码" width="240" />

---
Author: [twocold0451](https://github.com/twocold0451)
License: MIT

