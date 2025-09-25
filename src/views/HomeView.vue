<template>
  <div class="home-container">
    <!-- 时钟显示 -->
    <div class="clock-section">
      <Clock />
    </div>

    <!-- 番茄钟 -->
    <div class="timer-section">
      <Timer />
    </div>

    <!-- 设置面板 -->
    <div class="settings-section" v-if="showSettings">
      <Settings />
    </div>
  </div>

  <!-- 设置按钮 -->
  <button class="settings-toggle" @click="toggleSettings">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.8 2.2a1.65 1.65 0 0 1 0 2.2l-1.8 2.2a1.65 1.65 0 0 0-.33 1.82V23a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2v-1.18a1.65 1.65 0 0 0-.33-1.82l-1.8-2.2a1.65 1.65 0 0 1 0-2.2l1.8-2.2a1.65 1.65 0 0 0 .33-1.82V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.18zm-7.6-14a1.65 1.65 0 0 0-.33-1.82L5.6 2.18a1.65 1.65 0 0 1 0-2.2l1.8-2.2A1.65 1.65 0 0 0 8.33.18V1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.18a1.65 1.65 0 0 0 .33 1.82l1.8 2.2a1.65 1.65 0 0 1 0 2.2l-1.8 2.2a1.65 1.65 0 0 0-.33 1.82V15a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9.18z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Clock from '@/components/Clock.vue'
import Timer from '@/components/Timer.vue'
import Settings from '@/components/Settings.vue'

const showSettings = ref(false)

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  position: relative;
}

.clock-section,
.timer-section,
.settings-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.settings-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.settings-toggle:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 悬浮窗口样式 */
@media (min-width: 1024px) {
  .home-container {
    background: transparent;
    min-height: auto;
    padding: 0;
  }

  .timer-section {
    margin-bottom: 20px;
  }
}
</style>