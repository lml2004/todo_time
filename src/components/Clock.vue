<template>
  <div class="clock-container">
    <div class="clock-time">{{ currentTime }}</div>
    <div class="clock-date">{{ currentDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentDate = ref('')

let interval: number | null = null

const updateTime = () => {
  const now = new Date()

  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

onMounted(() => {
  updateTime()
  interval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.clock-time {
  font-size: 24px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  margin-bottom: 4px;
}

.clock-date {
  font-size: 12px;
  opacity: 0.8;
}
</style>