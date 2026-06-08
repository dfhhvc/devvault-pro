<div align="center">

# 🔒 DevVault Pro

**100% 离线开发者隐私工具箱**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/dfhhvc/devvault-pro/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-44%20passing-success.svg)](src/lib/__tests__)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

[在线演示](https://dfhhvc.github.io/devvault-pro) · [功能介绍](#-功能列表) · [快速开始](#-快速开始) · [贡献指南](#-贡献指南)

</div>

---

## 📸 截图

<div align="center">

| 桌面端 | 移动端 |
|--------|--------|
| ![桌面端](./public/screenshot-wide.png) | ![移动端](./public/screenshot-narrow.png) |

</div>

---

## ✨ 功能列表

### 📁 JSON 工具
- **JSON 格式化** — 美化、压缩、转义、去转义
- **JSON 验证** — 语法检查，精确到行号列号
- **JSON ↔ YAML** — 双向转换
- **JSON ↔ CSV** — 双向转换
- **JSONPath 查询** — 使用 JSONPath 表达式提取数据

### 🔐 编码解码
- **Base64** — 支持 UTF-8（含中文、Emoji）
- **URL 编码** — encodeURIComponent / decodeURIComponent
- **HTML 实体** — 安全纯 JS 实现，无 XSS 风险
- **Hex 编码** — 十六进制与文本互转

### 🎫 JWT 调试
- **JWT 解码** — 解析 Header、Payload、Signature
- **过期检测** — 自动计算并显示过期状态
- ⚠️ **安全提示**：仅解码显示，不验证签名（需要发行方密钥）

### 🎯 正则测试
- **实时匹配** — 输入即匹配，无延迟
- **高亮显示** — 正确高亮，支持捕获组
- **常用示例** — 内置邮箱、手机号、URL、IP 等 8 种常用正则

### #️⃣ 哈希与生成
- **哈希计算** — MD5 / SHA-1 / SHA-256 / SHA-512
- **UUID** — v1 / v4
- **NanoID** — 可配置长度
- **ULID** — 字典序唯一 ID
- **密码生成** — 密码学安全随机，无偏置

### ⏰ 时间工具
- **时间戳转换** — Unix 时间戳与日期互转
- **时区转换** — 10 个常用时区实时对照

---

## 🛡️ 安全承诺

| 承诺 | 状态 | 说明 |
|------|------|------|
| 100% 前端实现 | ✅ | 所有计算在浏览器完成 |
| 零数据上传 | ✅ | 无任何网络请求发送用户数据 |
| 无后端 API | ✅ | 纯静态站点 |
| 无追踪分析 | ✅ | 无 Google Analytics / 无埋点 |
| 可完全离线 | ✅ | PWA + Service Worker |
| 内存中处理 | ✅ | 不存储用户输入到 localStorage |
| 密码学安全 | ✅ | 使用 crypto.getRandomValues |
| XSS 防护 | ✅ | 纯 JS 实现，无 innerHTML |

### 如何验证？

1. 按 `F12` 打开开发者工具
2. 切换到 **Network** 面板
3. 使用任意工具处理数据
4. 确认：**没有任何请求发送你的数据**

---

## 🚀 快速开始

### 在线使用

直接访问：[https://dfhhvc.github.io/devvault-pro](https://dfhhvc.github.io/devvault-pro)

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/dfhhvc/devvault-pro.git
cd devvault-pro

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

### Docker 部署

```bash
# 构建镜像
docker build -t devvault-pro .

# 运行容器
docker run -p 3000:3000 devvault-pro
```

---

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 运行测试并显示 UI
pnpm test:ui

# 生成覆盖率报告
pnpm test:coverage
```

当前测试覆盖：
- ✅ 44 个测试用例全部通过
- ✅ 加密/编码算法验证
- ✅ JSON/YAML/CSV 转换验证
- ✅ HTML 实体编解码安全验证

---

## 🏗️ 技术栈

- **[Next.js](https://nextjs.org/)** 16+ — React 框架
- **[TypeScript](https://www.typescriptlang.org/)** 5.5+ — 类型安全
- **[Tailwind CSS](https://tailwindcss.com/)** 4 — 原子化 CSS
- **[shadcn/ui](https://ui.shadcn.com/)** — UI 组件
- **[Vitest](https://vitest.dev/)** — 单元测试
- **[Lucide](https://lucide.dev/)** — 图标

---

## 📦 部署

### GitHub Pages

项目已配置 GitHub Actions，推送至 `main` 分支自动部署。

### Vercel

```bash
pnpm add -g vercel
vercel --prod
```

### 静态导出

```bash
pnpm build
# 输出在 dist/ 目录
```

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + K` | 切换侧边栏 |
| `Ctrl + D` | 清空当前输入 |
| `Ctrl + Enter` | 执行处理 |
| `Ctrl + Shift + L` | 切换深色/浅色模式 |
| `Ctrl + /` | 显示快捷键帮助 |

---

## 🛠️ 与原版对比

| 特性 | DevVault (原版) | DevVault Pro |
|------|----------------|--------------|
| Service Worker | ⚠️ 缓存不完整 | ✅ Stale-While-Revalidate |
| JWT 提示 | ⚠️ 易误解 | ✅ 明确标注不验证签名 |
| 正则高亮 | ⚠️ 捕获组 Bug | ✅ 位置索引高亮 |
| 密码生成 | ⚠️ 有偏置 | ✅ Rejection Sampling |
| HTML 解码 | ⚠️ 使用 innerHTML | ✅ 纯 JS 实现 |
| TypeScript | ⚠️ 5.0.2 | ✅ 5.5+ |
| 单元测试 | ❌ 无 | ✅ 44 个测试 |
| Docker 支持 | ❌ 无 | ✅ 已配置 |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

- 使用 [Conventional Commits](https://www.conventionalcommits.org/)
- 示例：`feat: add new tool`, `fix: resolve regex highlight bug`

### 开发流程

1. Fork 本仓库
2. 创建分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m 'feat: add something'`
4. 推送分支：`git push origin feat/your-feature`
5. 打开 Pull Request

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 许可证

[MIT](LICENSE) © 2024 DevVault Pro Contributors

---

<div align="center">

**🔒 你的数据，你做主。**

[⭐ Star 这个项目](https://github.com/dfhhvc/devvault-pro) · [🐛 提交 Issue](https://github.com/dfhhvc/devvault-pro/issues) · [💡 提出建议](https://github.com/dfhhvc/devvault-pro/discussions)

</div>
