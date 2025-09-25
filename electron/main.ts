import { app, BrowserWindow, screen, ipcMain, Tray, Menu, shell } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { windowState } from './window-state'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow(): void {
  // 窗口状态管理
  const savedState = windowState.get()
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: savedState.width || 320,
    height: savedState.height || 280,
    x: savedState.x || width - 340,
    y: savedState.y || 20,
    show: false,
    autoHideMenuBar: true,
    frame: false, // 无边框
    transparent: true, // 透明背景
    alwaysOnTop: true, // 窗口置顶
    skipTaskbar: false, // 显示在任务栏
    resizable: true,
    minimizable: true,
    maximizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: join(__dirname, '../../resources/icon.png')
  })

  // 设置窗口样式 - 悬浮透明效果
  if (mainWindow) {
    mainWindow.setBackgroundColor('#00000000') // 完全透明

    // 开发环境：允许打开开发者工具
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    // 请求通知权限
    mainWindow?.webContents.send('request-notification-permission')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 窗口移动时保存状态
  mainWindow.on('moved', () => {
    saveWindowState()
  })

  mainWindow.on('resized', () => {
    saveWindowState()
  })

  // 右键菜单
  mainWindow.webContents.on('context-menu', () => {
    if (mainWindow) {
      mainWindow.webContents.send('show-context-menu')
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 保存窗口状态
function saveWindowState() {
  if (mainWindow) {
    const bounds = mainWindow.getBounds()
    windowState.save({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    })
  }
}

// 创建系统托盘
function createTray() {
  tray = new Tray(join(__dirname, '../../resources/tray-icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示番茄钟',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: '开始工作',
      click: () => {
        mainWindow?.webContents.send('timer-start')
      }
    },
    {
      label: '暂停',
      click: () => {
        mainWindow?.webContents.send('timer-pause')
      }
    },
    {
      label: '重置',
      click: () => {
        mainWindow?.webContents.send('timer-reset')
      }
    },
    { type: 'separator' },
    {
      label: '关于',
      click: () => {
        shell.openExternal('https://github.com/your-repo/pomodoro-timer')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('番茄钟悬浮时钟')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标显示窗口
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

// 当窗口关闭时，只隐藏窗口而不是退出应用
function handleWindowClose() {
  mainWindow?.hide()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.yourcompany.pomodoro-timer')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 在窗口创建前设置事件处理
try {
  app.setAboutPanelOptions({
    applicationName: '番茄钟悬浮时钟',
    applicationVersion: app.getVersion(),
    copyright: '© 2024 Your Company',
    website: 'https://github.com/your-repo/pomodoro-timer'
  })
} catch {
  // 忽略浏览器不支持的情况
}

// 重写关闭行为，改为隐藏窗口
app.on('before-quit', (event) => {
  // 检查是否需要强制退出（如开发环境或用户明确要求）
  if (process.env.FORCE_QUIT === 'true') {
    return // 允许退出
  }

  // 阻止默认退出行为
  event.preventDefault()

  // 隐藏窗口而不是退出
  mainWindow?.hide()
})

// 托盘右键时显示菜单
try {
  ipcMain.handle('show-tray-menu', (event) => {
    tray?.popUpContextMenu()
  })
} catch {
  // 忽略 IPC 错误
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// set-up code as you prefer or split it off into separate files, and that
// was required when nwjs was required.