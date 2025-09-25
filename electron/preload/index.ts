import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 窗口控制
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),

  // 番茄钟控制
  startTimer: () => ipcRenderer.invoke('timer-start'),
  pauseTimer: () => ipcRenderer.invoke('timer-pause'),
  resetTimer: () => ipcRenderer.invoke('timer-reset'),
  skipTimer: () => ipcRenderer.invoke('timer-skip'),

  // 设置
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // 通知
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),

  // 监听事件
  onTimerUpdate: (callback) => ipcRenderer.on('timer-update', callback),
  onSettingsUpdate: (callback) => ipcRenderer.on('settings-update', callback),
  onRequestNotificationPermission: (callback) => ipcRenderer.on('request-notification-permission', callback),
  onShowContextMenu: (callback) => ipcRenderer.on('show-context-menu', callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}