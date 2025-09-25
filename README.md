# 番茄钟悬浮时钟

一款跨平台的番茄钟时间管理工具，支持 Windows 桌面端悬浮窗和 Android 平板 PWA 应用。

## 功能特性

- 🕐 实时时间显示
- ⏱️ 番茄钟倒计时（工作/休息模式）
- 🖥️ 桌面悬浮窗（Electron）
- 📱 移动端 PWA 支持
- 🔔 通知提醒（系统通知 + 提示音）
- ⚙️ 可配置工作/休息时长
- 💾 本地数据存储

## 技术栈

- Vue 3 + TypeScript
- Vite 构建工具
- Pinia 状态管理
- Electron 桌面应用
- PWA 渐进式 Web 应用

## 开发环境

### 前置要求

- Node.js >= 18
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# Web 开发模式
npm run dev

# 桌面应用开发模式
npm run app:dev
```

### 构建应用

```bash
# 构建 Web 应用
npm run build

# 构建桌面应用
npm run app:build
```

## 使用说明

### Web 应用

1. 访问应用网址
2. 点击"开始"按钮开始工作计时
3. 工作时间结束后会自动切换到休息模式
4. 可通过设置调整工作/休息时长

### 桌面应用

1. 运行桌面应用
2. 应用会以悬浮窗形式显示在桌面
3. 点击托盘图标可显示/隐藏应用
4. 右键托盘图标可快速控制番茄钟

## 项目结构

```
├── src/              # Vue 前端源码
│   ├── components/   # 组件
│   ├── stores/       # Pinia 状态管理
│   ├── views/        # 页面视图
│   └── router/       # 路由配置
├── electron/         # Electron 桌面应用
│   ├── main.ts       # 主进程
│   ├── preload/      # 预加载脚本
│   └── window-state.ts # 窗口状态管理
├── public/           # 静态资源
└── dist/             # 构建输出
```

## 跨平台支持

### Windows 桌面

- 使用 Electron 构建
- 支持系统托盘
- 悬浮窗显示
- 开机自启（待实现）

### Android 平板

- PWA 渐进式 Web 应用
- 支持添加到主屏幕
- 离线运行
- 推送通知

## 待办事项

- [ ] 开机自启功能
- [ ] 数据统计面板
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 云同步设置

## 许可证

MIT