import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // 窗口控制
      minimize: () => Promise<void>
      close: () => Promise<void>

      // 番茄钟控制
      startTimer: () => Promise<void>
      pauseTimer: () => Promise<void>
      resetTimer: () => Promise<void>
      skipTimer: () => Promise<void>

      // 设置
      saveSettings: (settings: any) => Promise<void>

      // 通知
      showNotification: (title: string, body: string) => Promise<void>

      // 监听事件
      onTimerUpdate: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => void
      onSettingsUpdate: (callback: (event: Electron.IpcRendererEvent, settings: any) => void) => void
      onRequestNotificationPermission: (callback: (event: Electron.IpcRendererEvent) => void) => void
      onShowContextMenu: (callback: (event: Electron.IpcRendererEvent) => void) => void
    }
  }
}

export {}