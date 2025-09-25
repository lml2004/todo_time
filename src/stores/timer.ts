import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTimerStore = defineStore('timer', () => {
  // 状态定义
  const isRunning = ref(false)
  const timeLeft = ref(0)
  const workDuration = ref(25 * 60) // 25分钟
  const breakDuration = ref(5 * 60) // 5分钟
  const isWorkMode = ref(true)
  const currentCycle = ref(0)
  let interval: number | null = null

  // 计算属性
  const minutes = computed(() => Math.floor(timeLeft.value / 60))
  const seconds = computed(() => timeLeft.value % 60)
  const formattedTime = computed(() => {
    const mins = String(minutes.value).padStart(2, '0')
    const secs = String(seconds.value).padStart(2, '0')
    return `${mins}:${secs}`
  })

  const currentMode = computed(() => isWorkMode.value ? '工作' : '休息')
  const progress = computed(() => {
    const total = isWorkMode.value ? workDuration.value : breakDuration.value
    return ((total - timeLeft.value) / total) * 100
  })

  // 私有方法
  const tick = () => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      // 时间到，切换模式
      switchMode()
    }
  }

  const switchMode = () => {
    stopTimer()
    isWorkMode.value = !isWorkMode.value

    if (isWorkMode.value) {
      currentCycle.value++
      timeLeft.value = workDuration.value
    } else {
      timeLeft.value = breakDuration.value
    }

    // 触发通知
    triggerNotification()
  }

  const triggerNotification = () => {
    const message = isWorkMode.value ? '休息结束，开始工作！' : '工作时间结束，休息一下！'

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('番茄钟提醒', {
        body: message,
        icon: '/favicon.ico'
      })
    }

    // 播放提示音
    try {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => {})
    } catch {
      // 忽略音频播放错误
    }
  }

  // 公开方法
  const startTimer = () => {
    if (timeLeft.value === 0) {
      timeLeft.value = isWorkMode.value ? workDuration.value : breakDuration.value
    }

    isRunning.value = true
    interval = window.setInterval(tick, 1000)
  }

  const pauseTimer = () => {
    isRunning.value = false
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  const stopTimer = () => {
    isRunning.value = false
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    timeLeft.value = isWorkMode.value ? workDuration.value : breakDuration.value
  }

  const skipToNext = () => {
    switchMode()
  }

  const updateDurations = (work: number, break_: number) => {
    workDuration.value = work * 60
    breakDuration.value = break_ * 60

    if (!isRunning.value && timeLeft.value > 0) {
      timeLeft.value = isWorkMode.value ? workDuration.value : breakDuration.value
    }
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('pomodoro-settings')
    if (saved) {
      try {
        const { work, break: break_ } = JSON.parse(saved)
        workDuration.value = work * 60
        breakDuration.value = break_ * 60
      } catch {
        // 忽略解析错误，使用默认值
      }
    }
  }

  const saveSettings = () => {
    localStorage.setItem('pomodoro-settings', JSON.stringify({
      work: Math.floor(workDuration.value / 60),
      break: Math.floor(breakDuration.value / 60)
    }))
  }

  // 初始化
  loadSettings()
  timeLeft.value = workDuration.value

  return {
    // 状态
    isRunning,
    timeLeft,
    workDuration,
    breakDuration,
    isWorkMode,
    currentCycle,

    // 计算属性
    minutes,
    seconds,
    formattedTime,
    currentMode,
    progress,

    // 方法
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    skipToNext,
    updateDurations,
    saveSettings
  }
})