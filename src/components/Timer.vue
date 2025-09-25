<template>
  <div class="timer-container">
    <div class="timer-header">
      <span class="mode-badge" :class="{ 'work': timerStore.isWorkMode, 'break': !timerStore.isWorkMode }">
        {{ timerStore.currentMode }}
      </span>
      <span class="cycle-counter">第 {{ timerStore.currentCycle }} 轮</span>
    </div>

    <div class="timer-display">
      <div class="time-text">{{ timerStore.formattedTime }}</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: timerStore.progress + '%' }"></div>
      </div>
    </div>

    <div class="timer-controls">
      <button
        class="control-btn primary"
        @click="handleStartPause"
        :disabled="timerStore.timeLeft === 0"
      >
        {{ timerStore.isRunning ? '暂停' : '开始' }}
      </button>
      <button
        class="control-btn secondary"
        @click="handleReset"
      >
        重置
      </button>
      <button
        class="control-btn tertiary"
        @click="handleSkip"
      >
        跳过
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from '@/stores/timer'

const timerStore = useTimerStore()

const handleStartPause = () => {
  if (timerStore.isRunning) {
    timerStore.pauseTimer()
  } else {
    timerStore.startTimer()
  }
}

const handleReset = () => {
  timerStore.resetTimer()
}

const handleSkip = () => {
  timerStore.skipToNext()
}
</script>

<style scoped>
.timer-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.mode-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.mode-badge.work {
  background: #4CAF50;
}

.mode-badge.break {
  background: #FF9800;
}

.cycle-counter {
  font-size: 12px;
  color: #666;
}

.timer-display {
  text-align: center;
  margin-bottom: 20px;
}

.time-text {
  font-size: 48px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #333;
  margin-bottom: 12px;
}

.progress-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #81C784);
  transition: width 0.3s ease;
}

.timer-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: #4CAF50;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: #45a049;
}

.control-btn.secondary {
  background: #f5f5f5;
  color: #333;
}

.control-btn.secondary:hover {
  background: #e0e0e0;
}

.control-btn.tertiary {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.control-btn.tertiary:hover {
  background: #fafafa;
}
</style>