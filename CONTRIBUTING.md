# 贡献指南

感谢您对 DevVault Pro 的兴趣！本文档将帮助您了解如何参与项目。

## 🚀 快速开始

1. Fork 本仓库
2. 克隆您的 Fork：`git clone https://github.com/YOUR_USERNAME/devvault-pro.git`
3. 安装依赖：`pnpm install`
4. 创建分支：`git checkout -b feat/your-feature`

## 📋 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链

### 示例

```bash
feat(tools): add SQL formatter tool
fix(jwt): correct expiration time calculation
docs(readme): update installation guide
test(crypto): add edge case tests for base64
```

## 🧪 测试要求

- 所有新功能必须包含测试
- 测试覆盖率不应下降
- 运行 `pnpm test` 确保全部通过

## 🎨 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化

## 📝 Issue 报告

### Bug 报告

请包含：
- 问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息（浏览器、操作系统）
- 截图（如适用）

### 功能请求

请包含：
- 功能描述
- 使用场景
- 可能的实现方案

## 🔒 安全报告

如发现安全漏洞，请通过 [Security Advisories](https://github.com/dfhhvc/devvault-pro/security/advisories) 私下报告，**不要**公开创建 Issue。

## 🏷️ 发布流程

1. 更新 `CHANGELOG.md`
2. 更新版本号（遵循 SemVer）
3. 创建 Git Tag：`git tag v1.0.0`
4. 推送 Tag：`git push origin v1.0.0`
5. GitHub Actions 自动构建和发布

## 💬 社区

- 讨论区：[GitHub Discussions](https://github.com/dfhhvc/devvault-pro/discussions)
- 问题追踪：[GitHub Issues](https://github.com/dfhhvc/devvault-pro/issues)

## 📜 行为准则

参与本项目即表示您同意遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

---

再次感谢您的贡献！🎉
