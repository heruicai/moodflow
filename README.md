# MoodFlow

一个使用 Vue 3、Vite 与 ECharts 构建的纯前端情绪日记与自我关怀应用。

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

情绪记录保存在浏览器的 `localStorage` 中，不会上传到服务器。
