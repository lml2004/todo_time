<template>
  <div class="settings-container">
    <div class="settings-header">
      <h3>设置</h3>
    </div>

    <div class="settings-content">
      <div class="setting-item">
        <label for="work-duration">工作时长（分钟）</label>
        <div class="input-group">
          <input
            id="work-duration"
            type="number"
            v-model.number="workMinutes"
            min="1"
            max="60"
            class="setting-input"
          />
          <span class="input-unit">分钟</span>
        </div>
      </div>

      <div class="setting-item">
        <label for="break-duration">休息时长（分钟）</label>
        <div class="input-group">
          <input
            id="break-duration"
            type="number"
            v-model.number="breakMinutes"
            min="1"
            max="30"
            class="setting-input"
          />
          <span class="input-unit">分钟</span>
        </div>
      </div>

      <div class="setting-item">
        <label for="sound-enabled">启用提醒声音</label>
        <div class="toggle-switch">
          <input
            id="sound-enabled"
            type="checkbox"
            v-model="soundEnabled"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
        </div>
      </div>

      <div class="setting-item">
        <label for="notifications-enabled">启用桌面通知</label>
        <div class="toggle-switch">
          <input
            id="notifications-enabled"
            type="checkbox"
            v-model="notificationsEnabled"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="save-btn" @click="saveSettings" :disabled="!hasChanges">
        保存设置
      </button>
      <button class="reset-btn" @click="resetToDefaults">
        恢复默认
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useTimerStore } from '@/stores/timer'

const timerStore = useTimerStore()

// 本地状态
const workMinutes = ref(25)
const breakMinutes = ref(5)
const soundEnabled = ref(true)
const notificationsEnabled = ref(true)

// 默认值
const DEFAULT_WORK = 25
const DEFAULT_BREAK = 5

// 计算属性
const hasChanges = computed(() => {
  return workMinutes.value !== Math.floor(timerStore.workDuration / 60) ||
         breakMinutes.value !== Math.floor(timerStore.breakDuration / 60)
})

// 方法
const loadCurrentSettings = () => {
  workMinutes.value = Math.floor(timerStore.workDuration / 60)
  breakMinutes.value = Math.floor(timerStore.breakDuration / 60)
}

const saveSettings = () => {
  timerStore.updateDurations(workMinutes.value, breakMinutes.value)
  timerStore.saveSettings()

  // 显示保存成功提示
  showNotification('设置已保存成功！')

  // 请求通知权限
  if (notificationsEnabled.value && 'Notification' in window) {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }
}

const resetToDefaults = () => {
  workMinutes.value = DEFAULT_WORK
  breakMinutes.value = DEFAULT_BREAK
  soundEnabled.value = true
  notificationsEnabled.value = true
}

const showNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.className = 'notification'
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add('show')
  }, 100)

  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

// 监听通知设置变化
watch(notificationsEnabled, (enabled) => {
  if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
})

// 生命周期
onMounted(() => {
  loadCurrentSettings()
})
</script>

<style scoped>
.settings-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 320px;
}

.settings-header {
  margin-bottom: 24px;
  text-align: center;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.settings-content {
  margin-bottom: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.setting-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.input-unit {
  font-size: 12px;
  color: #666;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #4CAF50;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.settings-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.save-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: #4CAF50;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #45a049;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.reset-btn:hover {
  background: #e0e0e0;
}

/* 通知样式 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.notification.show {
  transform: translateX(0);
}
</style>