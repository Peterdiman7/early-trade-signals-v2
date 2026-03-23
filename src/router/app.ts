import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'signal' | 'watchlist' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

export const useAppStore = defineStore('app', () => {
  const darkMode = ref(true)
  const notifications = ref<Notification[]>([
    {
      id: '1',
      type: 'signal',
      title: 'New BUY Signal',
      message: 'AAPL — Quality Q5, Strong momentum detected',
      time: '2m ago',
      read: false
    },
    {
      id: '2',
      type: 'signal',
      title: 'New SELL Signal',
      message: 'AMD — Bearish reversal pattern confirmed',
      time: '18m ago',
      read: false
    },
    {
      id: '3',
      type: 'watchlist',
      title: 'Watchlist Alert',
      message: 'NVDA hit your target price of $825',
      time: '1h ago',
      read: true
    }
  ])

  const unreadCount = ref(notifications.value.filter(n => !n.read).length)

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark', darkMode.value)
  }

  function markAllRead() {
    notifications.value.forEach(n => (n.read = true))
    unreadCount.value = 0
  }

  function markRead(id: string) {
    const n = notifications.value.find(n => n.id === id)
    if (n && !n.read) {
      n.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  return { darkMode, notifications, unreadCount, toggleDarkMode, markAllRead, markRead }
})