# V2EX / 掘金 / SegmentFault 帖子

## 标题
用 Next.js 16 做了一个 100% 离线的开发者工具箱 DevVault Pro，18 个工具，零数据上传

## 正文

### 背景

每天开发都在往各种在线工具里粘贴 JWT token、JSON 数据、密码——这些数据到底去了哪里？大多数"免费"工具都在记录、分析甚至出售用户数据。

所以我做了 DevVault Pro：18 个开发者工具，全部在浏览器本地运行，没有后端，没有网络请求，没有追踪。

### 功能

**差异化功能（it-tools 和 CyberChef 都没有的）：**
- **JSON → TypeScript**：粘贴 JSON，自动生成 TS 接口定义。支持嵌套对象、数组、联合类型、可选字段
- **颜色转换器**：HEX / RGB / HSL / OKLCH 四种格式互转，带实时预览
- **文本 Diff**：逐行对比两段文本，基于 LCS 算法，高亮增删行

**基础工具：**
- JSON 格式化/验证/YAML/CSV/JSONPath
- Base64 / URL / HTML实体 / Hex 编码
- JWT 解码（带过期检测）
- 正则测试器（捕获组高亮）
- 哈希计算（MD5/SHA-1/256/512）
- UUID / NanoID / ULID / 密码生成器
- 时间戳转换 / 时区对比

### 技术栈

- Next.js 16 + React 19 + TypeScript 5.5
- Tailwind CSS 4 + shadcn/ui
- Vitest 测试（所有测试 import 实际源码，不是复制品）
- 纯 JS 实现 MD5、Diff、颜色转换，零外部依赖
- PWA 支持，可安装为桌面应用，完全离线使用

### 隐私验证

打开 F12 → Network → 使用任何工具 → 网络请求为零。localStorage 只存主题偏好（暗色/亮色），不存任何用户数据。

### 与同类项目对比

| | DevVault Pro | it-tools | CyberChef |
|---|---|---|---|
| JSON → TS | 有 | 无 | 无 |
| OKLCH 颜色 | 有 | 部分 | 无 |
| 文本 Diff | 有 | 无 | 无 |
| 离线 PWA | 有 | 无 | 无 |
| 工具数量 | 18 | 40+ | 300+ |

it-tools 和 CyberChef 工具更多，但 DevVault Pro 有 JSON→TS 生成器和离线 PWA 安装。

### 链接
- 在线使用：https://dfhhvc.github.io/devvault-pro
- 源码：https://github.com/dfhhvc/devvault-pro

### 下一步计划
- Cron 表达式解析器
- 二维码生成器
- Markdown 预览
- HTTP 状态码速查

大家对 JSON→TS 的生成逻辑有什么建议吗？或者想要什么新工具？
