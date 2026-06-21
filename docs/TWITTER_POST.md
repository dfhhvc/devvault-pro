# Twitter / X 推文线程

## 推文 1 (主推)
做了个 100% 离线的开发者工具箱 DevVault Pro。

18 个工具，全部在浏览器本地运行。没有后端，没有追踪，没有数据上传。

可安装为 PWA 桌面应用，断网也能用。

杀手级功能：JSON → TypeScript 接口自动生成 🧵

🔗 https://dfhhvc.github.io/devvault-pro

## 推文 2
为什么做这个？

每天都在往各种在线工具里粘贴 JWT token、API key、客户 JSON 数据。这些"免费"工具到底拿数据做了什么？

DevVault Pro 的承诺：打开 F12 → Network → 用任何工具 → 网络请求为零。

你的数据永远不离开浏览器。

## 推文 3
三个差异化功能（it-tools 和 CyberChef 都没有的）：

1️⃣ JSON → TypeScript：粘贴 JSON 自动生成 TS 接口
2️⃣ 颜色转换器：HEX/RGB/HSL/OKLCH 四格式互转 + 实时预览
3️⃣ 文本 Diff：LCS 算法逐行对比

## 推文 4
技术栈：

▪️ Next.js 16 + React 19 + TypeScript
▪️ Tailwind 4 + shadcn/ui
▪️ Vitest（测试 import 实际源码）
▪️ 纯 JS 实现 MD5、Diff、颜色转换
▪️ Web Crypto API（crypto.getRandomValues）
▪️ PWA Service Worker 离线缓存

## 推文 5
完整功能列表：

🔧 JSON 工具（格式化/验证/YAML/CSV/JSONPath/→TS）
🔐 编码（Base64/URL/HTML/Hex）
🎫 JWT 解码
🔍 正则测试
#️⃣ 哈希/UUID/密码生成
⏰ 时间戳/时区
🎨 颜色转换
📝 文本 Diff

源码：https://github.com/dfhhvc/devvault-pro

如果觉得有用，给个 ⭐ 吧！
