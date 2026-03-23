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
	const notifEnabled = ref(true)

	try {
		const t = localStorage.getItem('ets_theme')
		if (t) darkMode.value = t !== 'light'
		const n = localStorage.getItem('ets_notif')
		if (n !== null) notifEnabled.value = n === 'true'
	} catch (e) { }

	const notifications = ref<Notification[]>([
		{ id: '1', type: 'signal', title: 'New BUY Signal', message: 'AAPL — Q5, Strong momentum', time: '2m ago', read: false },
		{ id: '2', type: 'signal', title: 'New SELL Signal', message: 'AMD — Bearish reversal', time: '18m ago', read: false },
		{ id: '3', type: 'watchlist', title: 'Watchlist Alert', message: 'NVDA hit target $825', time: '1h ago', read: true }
	])

	const unreadCount = ref(notifications.value.filter(n => !n.read).length)

	function toggleDarkMode() {
		darkMode.value = !darkMode.value
		try { localStorage.setItem('ets_theme', darkMode.value ? 'dark' : 'light') } catch (e) { }
	}

	function toggleNotif() {
		notifEnabled.value = !notifEnabled.value
		try { localStorage.setItem('ets_notif', String(notifEnabled.value)) } catch (e) { }
	}

	function markAllRead() {
		notifications.value.forEach(n => (n.read = true))
		unreadCount.value = 0
	}

	function markRead(id: string) {
		const n = notifications.value.find(n => n.id === id)
		if (n && !n.read) { n.read = true; unreadCount.value = Math.max(0, unreadCount.value - 1) }
	}

	function addNotification(notif: Omit<Notification, 'id' | 'read' | 'time'>) {
		const id = 'n' + Date.now()
		notifications.value.unshift({ ...notif, id, read: false, time: 'Just now' })
		unreadCount.value++
	}

	return { darkMode, notifEnabled, notifications, unreadCount, toggleDarkMode, toggleNotif, markAllRead, markRead, addNotification }
})
