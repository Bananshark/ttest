# AR 文物介绍 Web 程序

基于 **Vue 3 + Vite + MindAR.js + Three.js** 的响应式 AR 文物体验页面。摄像头识别 MindAR 目标图后自动渲染 3D 模型，并提供 AI 讲解入口，遵循现代极简与渐变美学。

## 快速开始

```bash
pnpm install # 或 npm install / yarn
pnpm dev     # 启动项目 http://localhost:5173
```

> AR 功能需要 HTTPS 或 `localhost`，并需在 `public/targets/` 中放置 `.mind` 目标文件（默认 `museum.mind`）。3D 模型需放在 `public/models/` 下，例如 `bronze.glb`。

## 目录结构

```
ar-museum/
├── src/
│   ├── components/        # Hero / AR / Library / AI Drawer 等
│   ├── views/             # Home / Dashboard
│   ├── router/            # 路由配置
│   ├── store/             # Pinia 状态
│   ├── utils/             # AR 辅助函数
│   └── assets/styles/     # 全局样式
├── public/
│   ├── models/            # glTF/GLB 模型
│   ├── targets/           # MindAR 目标
│   └── placeholder.svg
├── package.json
└── vite.config.js
```

## 主要特性

- 📸 MindAR.js 图像识别 + Three.js 渲染
- 🧠 AI 讲解抽屉（演示版，可接真实 API）
- 📚 文物卡片、知识卡片、时间轴信息架构
- 🎨 渐变配色、玻璃态卡片、细腻微交互
- 📱 完全响应式布局

## 自定义

- 将 `public/models/bronze.glb` 替换为自己的 glTF/GLB 模型
- 使用 `npx mindar create-image-target` 生成 `.mind` 文件
- 在 `ArExperience.vue` 中调整 `imageTargetSrc`、模型路径、识别回调

Enjoy the immersive AR artifact experience!

