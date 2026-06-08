# 🔒 DevVault Pro — 100% 离线开发者隐私工具箱

> **你的数据，永远不出浏览器。**

DevVault Pro 是 DevVault 的增强版本，一个纯前端、零后端、完全离线可用的开发者工具箱。所有处理均在浏览器本地完成，**没有任何数据上传到任何服务器**。

本项目在原版基础上修复了所有已知问题，添加了完整的单元测试，并增强了离线使用能力。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![100% Local](https://img.shields.io/badge/100%25-Local%20Only-brightgreen)]()
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple)]()
[![Tests](https://img.shields.io/badge/Tests-Passing-success)]()

---

## 🛡️ 安全承诺

- ✅ **100% 前端实现** — 所有功能在浏览器本地用 JavaScript 处理
- ✅ **零数据上传** — 不向任何服务器发送用户输入的任何数据
- ✅ **无后端 API 调用** — 除了 CDN 静态资源，没有任何网络请求
- ✅ **无追踪、无分析、无埋点、无广告**
- ✅ **可完全断网使用** — 首次加载后，拔掉网线也能用
- ✅ **输入数据只在内存中处理** — 不存入 localStorage（除用户设置外）
- ✅ **密码学安全** — 使用 rejection sampling 消除随机数偏置
- ✅ **XSS 防护** — 纯 JavaScript HTML 实体解码，无 innerHTML 风险

### 如何验证？

1. 打开浏览器开发者工具（F12）
2. 切换到 **Network（网络）** 面板
3. 刷新页面，使用任意工具
4. 确认：**没有任何用户输入的数据被发送到外部**

---

## 📸 截图演示

![桌面端截图](./public/screenshot-wide.png)
![移动端截图](./public/screenshot-narrow.png)

---

## ✨ 功能列表

### 📁 JSON 工具
- JSON 格式化 / 压缩 / 转义 / 去转义
- JSON 语法验证（精确到行号错误提示）
- JSON ↔ YAML 互转
- JSON ↔ CSV 互转
- JSONPath 查询

### 🔐 编码解码
- Base64 编码 / 解码（支持 UTF-8）
- URL 编码 / 解码
- HTML 实体编码 / 解码（安全纯 JS 实现）
- Hex 十六进制编码 / 解码

### 🎫 JWT 调试器
- JWT 完整解码（Header + Payload + Signature）
- 过期时间自动计算和提示
- ⚠️ **安全提示**：签名显示但不验证（需要发行方密钥）

### 🎯 正则表达式测试器
- 正则输入 + 标志位选择（g/i/m/s）
- 实时匹配结果高亮（支持捕获组）
- 匹配组提取显示
- 常用正则示例库

### #️⃣ 哈希与生成器
- MD5 / SHA-1 / SHA-256 / SHA-512 哈希
- UUID v1 / v4 生成
- NanoID / ULID 生成
- 随机密码生成器（密码学安全，无偏置）

### ⏰ 时间工具
- Unix 时间戳 ↔ 日期时间互转
- 各种格式时间转换
- 多时区转换显示

---

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/dfhhvc/devvault-pro.git
cd devvault-pro

# 安装依赖（使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

### 在线访问

直接访问 GitHub Pages 部署地址即可使用。

---

## 🔧 技术栈

- **框架**: Next.js 16+ App Router
- **样式**: Tailwind CSS v4 + shadcn/ui
- **图标**: Lucide React
- **语言**: TypeScript 5.5+ 严格模式
- **测试**: Vitest + jsdom
- **包管理**: pnpm

---

## 📦 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署工作流，推送到 `main` 分支即可自动构建并部署。

### Vercel

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 部署
vercel --prod
```

---

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + K` | 切换侧边栏 |
| `Ctrl + D` | 清空当前输入 |
| `Ctrl + Enter` | 执行处理/转换 |
| `Ctrl + Shift + L` | 切换深色/浅色模式 |
| `Ctrl + /` | 显示快捷键帮助 |

---

## 🛠️ 修复与改进

### 原版问题修复

| 问题 | 修复方案 |
|------|---------|
| Service Worker 缓存不完整 | 使用 Stale-While-Revalidate 策略，缓存所有资源 |
| JWT 签名验证误导 | 添加明确的安全提示，说明仅解码不验证签名 |
| 正则高亮 Bug（捕获组冲突） | 使用位置索引高亮，避免正则嵌套问题 |
| 密码生成器随机偏置 | 使用 rejection sampling 消除 modulo bias |
| HTML Entity 解码 XSS 风险 | 纯 JavaScript 实现，完全移除 innerHTML |
| TypeScript 版本过旧 | 升级到 5.5+ |
| 缺少单元测试 | 添加完整测试覆盖 |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 License

本项目基于 [MIT](LICENSE) 许可证开源。

---

<p align="center">
  <strong>🔒 你的数据，你做主。</strong>
</p>
