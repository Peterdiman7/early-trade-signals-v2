import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSignalsStore } from './signals'

export const useWatchlistStore = defineStore('watchlist', () => {
	const tickers = ref<string[]>([])

	try {
		const stored = localStorage.getItem('ets_wl')
		if (stored) tickers.value = JSON.parse(stored)
	} catch (e) { }

	const save = () => {
		try { localStorage.setItem('ets_wl', JSON.stringify(tickers.value)) } catch (e) { }
	}

	const items = computed(() => {
		const store = useSignalsStore()
		return tickers.value
			.map(t => store.signals.find(s => s.ticker === t))
			.filter(Boolean) as any[]
	})

	function toggle(ticker: string) {
		const idx = tickers.value.indexOf(ticker)
		if (idx >= 0) tickers.value.splice(idx, 1)
		else tickers.value.push(ticker)
		save()
	}

	function isInWatchlist(ticker: string) {
		return tickers.value.includes(ticker)
	}

	function remove(ticker: string) {
		const idx = tickers.value.indexOf(ticker)
		if (idx >= 0) { tickers.value.splice(idx, 1); save() }
	}

	return { tickers, items, toggle, isInWatchlist, remove }
})
