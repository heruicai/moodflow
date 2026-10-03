# MoodFlow

一个使用 Vue 3、Vite 与 ECharts 构建的纯前端情绪日记与自我关怀应用。

包含完整的情绪记录、规则化温和洞察、记录回看、七日趋势与可交互的自我关怀练习。所有记录和书写草稿仅保存在浏览器 `localStorage` 中。

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

构建产物位于 `dist/`。项目已包含 `vercel.json`，可直接导入 Vercel 部署，无需额外配置。

项目不会连接后端或真实大模型 API。情绪记录保存在浏览器的 `localStorage` 中，不会上传到服务器。
