import { app } from 'electron'
import { join } from 'node:path'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'

const CONFIG_FILE = join(app.getPath('userData'), 'window-state.json')

interface WindowState {
  x?: number
  y?: number
  width?: number
  height?: number
}

let state: WindowState = {
  x: undefined,
  y: undefined,
  width: 320,
  height: 280
}

export const windowState = {
  get(): WindowState {
    try {
      if (existsSync(CONFIG_FILE)) {
        const data = readFileSync(CONFIG_FILE, 'utf8')
        const savedState = JSON.parse(data)
        state = { ...state, ...savedState }
      }
    } catch (error) {
      console.error('Failed to load window state:', error)
    }
    return state
  },

  save(newState: WindowState): void {
    try {
      state = { ...state, ...newState }
      writeFileSync(CONFIG_FILE, JSON.stringify(state), 'utf8')
    } catch (error) {
      console.error('Failed to save window state:', error)
    }
  }
}