import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type SignalType = 'buy' | 'hold' | 'sell'
export type Horizon = 'intraday' | 'short' | 'medium' | 'long'

export interface HistoryEntry {
	time: string
	type: SignalType
	price: number
	note: string
}

export interface Signal {
	id: string
	ticker: string
	name: string
	type: SignalType
	price: number
	change: number
	strength: 'Strong' | 'Moderate' | 'Weak'
	sector: string
	signalDate: string
	signalTime: string
	signalPrice: number
	duration: Horizon
	quality: number
	dayHistory: HistoryEntry[]
}

const SIGNALS_DATA: Signal[] = [
	{
		id: '1', ticker: 'AAPL', name: 'Apple Inc.', type: 'buy', price: 264.58, change: 2.14,
		strength: 'Strong', sector: 'Technology', signalDate: '2026-02-22', signalTime: '09:32',
		signalPrice: 258.90, duration: 'short', quality: 5,
		dayHistory: [
			{ time: '09:32', type: 'buy', price: 258.90, note: 'Ausbruch über Widerstand' },
			{ time: '11:15', type: 'hold', price: 261.20, note: 'Konsolidierung' },
			{ time: '14:47', type: 'buy', price: 262.80, note: 'Momentum bestätigt' }
		]
	},
	{
		id: '2', ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'buy', price: 210.11, change: 1.87,
		strength: 'Strong', sector: 'Consumer', signalDate: '2026-02-22', signalTime: '10:04',
		signalPrice: 206.20, duration: 'medium', quality: 4,
		dayHistory: [
			{ time: '10:04', type: 'buy', price: 206.20, note: 'Trendfortsetzung' },
			{ time: '15:30', type: 'buy', price: 208.55, note: 'Volumen Anstieg' }
		]
	},
	{
		id: '3', ticker: 'MSFT', name: 'Microsoft Corp.', type: 'buy', price: 391.45, change: 0.95,
		strength: 'Strong', sector: 'Technology', signalDate: '2026-02-20', signalTime: '09:45',
		signalPrice: 385.10, duration: 'long', quality: 5,
		dayHistory: [{ time: '09:45', type: 'buy', price: 385.10, note: 'Breakout Copilot-Daten' }]
	},
	{
		id: '4', ticker: 'NVDA', name: 'NVIDIA Corp.', type: 'buy', price: 822.33, change: 3.42,
		strength: 'Strong', sector: 'Semiconductors', signalDate: '2026-02-19', signalTime: '13:22',
		signalPrice: 795.00, duration: 'short', quality: 5,
		dayHistory: [
			{ time: '09:31', type: 'hold', price: 790.00, note: 'Eröffnung abwarten' },
			{ time: '13:22', type: 'buy', price: 795.00, note: 'Blackwell-Nachfrage stark' },
			{ time: '15:55', type: 'buy', price: 812.40, note: 'Schlusskurs-Momentum' }
		]
	},
	{
		id: '5', ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'buy', price: 175.20, change: 1.11,
		strength: 'Moderate', sector: 'Technology', signalDate: '2026-02-21', signalTime: '11:08',
		signalPrice: 173.10, duration: 'medium', quality: 4,
		dayHistory: [{ time: '11:08', type: 'buy', price: 173.10, note: 'KI-Werbeumsatz übertrifft' }]
	},
	{
		id: '6', ticker: 'META', name: 'Meta Platforms', type: 'buy', price: 541.22, change: 2.03,
		strength: 'Strong', sector: 'Social Media', signalDate: '2026-02-22', signalTime: '09:31',
		signalPrice: 530.80, duration: 'intraday', quality: 5,
		dayHistory: [
			{ time: '09:31', type: 'buy', price: 530.80, note: 'Gap-Up Eröffnung' },
			{ time: '10:45', type: 'buy', price: 535.10, note: 'Threads MAU-Daten' },
			{ time: '12:03', type: 'hold', price: 537.40, note: 'Mittagspause' },
			{ time: '14:20', type: 'buy', price: 539.00, note: 'Nachmittags-Momentum' }
		]
	},
	{
		id: '7', ticker: 'TSLA', name: 'Tesla Inc.', type: 'buy', price: 348.12, change: 1.55,
		strength: 'Moderate', sector: 'EV / Auto', signalDate: '2026-02-18', signalTime: '10:33',
		signalPrice: 338.40, duration: 'short', quality: 3,
		dayHistory: [{ time: '10:33', type: 'buy', price: 338.40, note: 'Produktionszahlen Q1' }]
	},
	{
		id: '8', ticker: 'ABBV', name: 'AbbVie Inc.', type: 'hold', price: 224.81, change: -0.22,
		strength: 'Moderate', sector: 'Pharma', signalDate: '2026-02-15', signalTime: '12:17',
		signalPrice: 226.00, duration: 'long', quality: 3,
		dayHistory: [{ time: '12:17', type: 'hold', price: 226.00, note: 'FDA-Entscheidung ausstehend' }]
	},
	{
		id: '9', ticker: 'ADBE', name: 'Adobe Inc.', type: 'hold', price: 258.61, change: 0.38,
		strength: 'Moderate', sector: 'Software', signalDate: '2026-02-14', signalTime: '09:48',
		signalPrice: 257.40, duration: 'medium', quality: 3,
		dayHistory: [
			{ time: '09:48', type: 'hold', price: 257.40, note: 'Firefly-Update abwarten' },
			{ time: '14:05', type: 'hold', price: 258.10, note: 'Neutrales Sentiment' }
		]
	},
	{
		id: '10', ticker: 'JNJ', name: 'Johnson & Johnson', type: 'hold', price: 157.44, change: -0.10,
		strength: 'Weak', sector: 'Healthcare', signalDate: '2026-02-10', signalTime: '11:00',
		signalPrice: 158.20, duration: 'long', quality: 2,
		dayHistory: [{ time: '11:00', type: 'hold', price: 158.20, note: 'Litigation-Risiko bestehend' }]
	},
	{
		id: '11', ticker: 'KO', name: 'Coca-Cola Co.', type: 'hold', price: 63.11, change: 0.05,
		strength: 'Moderate', sector: 'Beverages', signalDate: '2026-02-12', signalTime: '10:22',
		signalPrice: 62.80, duration: 'medium', quality: 3,
		dayHistory: [{ time: '10:22', type: 'hold', price: 62.80, note: 'Defensiver Wert, stabil' }]
	},
	{
		id: '12', ticker: 'AMD', name: 'Advanced Micro Dev.', type: 'sell', price: 200.15, change: -2.31,
		strength: 'Weak', sector: 'Semiconductors', signalDate: '2026-02-22', signalTime: '09:33',
		signalPrice: 204.90, duration: 'intraday', quality: 4,
		dayHistory: [
			{ time: '09:33', type: 'sell', price: 204.90, note: 'JPMorgan Downgrade' },
			{ time: '10:58', type: 'sell', price: 203.10, note: 'Volumen-Bestätigung' },
			{ time: '13:41', type: 'sell', price: 201.80, note: 'Unterstützung gebrochen' }
		]
	},
	{
		id: '13', ticker: 'AVGO', name: 'Broadcom Inc.', type: 'sell', price: 332.65, change: -1.77,
		strength: 'Weak', sector: 'Semiconductors', signalDate: '2026-02-21', signalTime: '14:15',
		signalPrice: 338.10, duration: 'short', quality: 4,
		dayHistory: [{ time: '14:15', type: 'sell', price: 338.10, note: 'Überkauft RSI 78' }]
	},
	{
		id: '14', ticker: 'BA', name: 'Boeing Co.', type: 'sell', price: 178.90, change: -3.12,
		strength: 'Weak', sector: 'Aerospace', signalDate: '2026-02-20', signalTime: '10:10',
		signalPrice: 184.60, duration: 'medium', quality: 4,
		dayHistory: [
			{ time: '10:10', type: 'sell', price: 184.60, note: 'Produktionsprobleme' },
			{ time: '15:20', type: 'sell', price: 181.20, note: 'Analyst-Kürzung' }
		]
	},
	{
		id: '15', ticker: 'INTC', name: 'Intel Corp.', type: 'sell', price: 22.45, change: -4.03,
		strength: 'Weak', sector: 'Semiconductors', signalDate: '2026-02-19', signalTime: '11:44',
		signalPrice: 23.40, duration: 'short', quality: 3,
		dayHistory: [
			{ time: '11:44', type: 'sell', price: 23.40, note: 'Marktanteilsverlust AMD' },
			{ time: '14:30', type: 'sell', price: 22.90, note: 'Trendbruch bestätigt' }
		]
	},
	{
		id: '16', ticker: 'NKE', name: 'Nike Inc.', type: 'sell', price: 74.80, change: -1.55,
		strength: 'Weak', sector: 'Consumer', signalDate: '2026-02-18', signalTime: '09:38',
		signalPrice: 76.40, duration: 'medium', quality: 3,
		dayHistory: [{ time: '09:38', type: 'sell', price: 76.40, note: 'China-Umsatz schwach' }]
	}
]

export const LOGOS: Record<string, string> = {
	AAPL: 'https://logo.clearbit.com/apple.com',
	AMZN: 'https://logo.clearbit.com/amazon.com',
	MSFT: 'https://logo.clearbit.com/microsoft.com',
	NVDA: 'https://logo.clearbit.com/nvidia.com',
	GOOGL: 'https://logo.clearbit.com/google.com',
	META: 'https://logo.clearbit.com/meta.com',
	TSLA: 'https://logo.clearbit.com/tesla.com',
	ABBV: 'https://logo.clearbit.com/abbvie.com',
	ADBE: 'https://logo.clearbit.com/adobe.com',
	JNJ: 'https://logo.clearbit.com/jnj.com',
	KO: 'https://logo.clearbit.com/cocacola.com',
	AMD: 'https://logo.clearbit.com/amd.com',
	AVGO: 'https://logo.clearbit.com/broadcom.com',
	BA: 'https://logo.clearbit.com/boeing.com',
	INTC: 'https://logo.clearbit.com/intel.com',
	NKE: 'https://logo.clearbit.com/nike.com'
}

export const SECTORS = [
	{ name: 'Technology', change: 2.4, perc: 78 },
	{ name: 'Semiconductors', change: -1.2, perc: 38 },
	{ name: 'Consumer', change: 0.8, perc: 62 },
	{ name: 'Healthcare', change: -0.3, perc: 48 },
	{ name: 'Software', change: 1.5, perc: 70 },
	{ name: 'Aerospace', change: -2.1, perc: 30 },
	{ name: 'Social Media', change: 3.1, perc: 85 },
	{ name: 'Beverages', change: 0.2, perc: 55 }
]

export const useSignalsStore = defineStore('signals', () => {
	const signals = ref<Signal[]>(SIGNALS_DATA)
	const loading = ref(false)
	const filterType = ref<SignalType | 'all'>('all')
	const filterDuration = ref<Horizon | 'all'>('all')
	const filterQuality = ref(0)

	const filteredSignals = computed(() => {
		return signals.value.filter(s => {
			if (filterType.value !== 'all' && s.type !== filterType.value) return false
			if (filterDuration.value !== 'all' && s.duration !== filterDuration.value) return false
			if (filterQuality.value > 0 && s.quality < filterQuality.value) return false
			return true
		})
	})

	const buySignals = computed(() => signals.value.filter(s => s.type === 'buy'))
	const holdSignals = computed(() => signals.value.filter(s => s.type === 'hold'))
	const sellSignals = computed(() => signals.value.filter(s => s.type === 'sell'))

	async function refresh() {
		loading.value = true
		await new Promise(r => setTimeout(r, 1000))
		signals.value = signals.value.map(s => ({
			...s,
			price: +(s.price * (1 + (Math.random() - 0.5) * 0.003)).toFixed(2)
		}))
		loading.value = false
	}

	return { signals, filteredSignals, buySignals, holdSignals, sellSignals, loading, filterType, filterDuration, filterQuality, refresh }
})
