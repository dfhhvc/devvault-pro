# Changelog

所有 notable 变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [1.0.0] - 2024-06-08

### Added
- 初始发布 DevVault Pro
- 15 个开发者工具（JSON、编码、JWT、正则、哈希、时间等）
- 完整的单元测试（44 个测试用例）
- PWA 支持（Service Worker 离线缓存）
- 深色/浅色主题切换
- 键盘快捷键支持
- Docker 部署支持

### Fixed（相比原版 DevVault）
- Service Worker 缓存策略升级为 Stale-While-Revalidate
- JWT 工具添加明确的安全提示（标注不验证签名）
- 正则高亮修复捕获组冲突问题
- 密码生成器使用 Rejection Sampling 消除随机偏置
- HTML Entity 解码改为纯 JavaScript 实现，移除 innerHTML
- TypeScript 升级到 5.5+

### Security
- 消除 XSS 风险（移除 innerHTML）
- 密码学安全随机数生成
- 纯前端实现，零数据上传

---

## 版本说明

### 版本号格式

`MAJOR.MINOR.PATCH`

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向下兼容的功能添加
- **PATCH**：向下兼容的问题修复

### 标签说明

- `Added`：新功能
- `Changed`：现有功能的变更
- `Deprecated`：即将移除的功能
- `Removed`：已移除的功能
- `Fixed`：Bug 修复
- `Security`：安全相关的修复
