// Service Worker for PWA support
const CACHE_NAME = 'pomodoro-timer-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/notification.mp3'
]

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// 获取事件 - 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有响应，直接返回
        if (response) {
          return response
        }

        // 否则发起网络请求
        return fetch(event.request).then((response) => {
          // 检查是否是有效的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // 克隆响应并缓存
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
    )
  )
})

// 推送通知事件
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const title = data.title || '番茄钟提醒'
    const options = {
      body: data.body || '时间到了！',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico'
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    )
  }
})

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  // 可以在这里添加点击通知后的操作
  event.waitUntil(
    clients.openWindow('/')
  )
})