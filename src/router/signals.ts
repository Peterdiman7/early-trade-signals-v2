import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type SignalType = 'BUY' | 'HOLD' | 'SELL'
export type Horizon = 'intraday' | 'short' | 'medium' | 'long'
export type Quality = 'Q3' | 'Q4' | 'Q5'

export interface Signal {
  id: string
  ticker: string
  name: string
  logo: string
  type: SignalType
  price: number
  change: number
  changePct: number
  quality: Quality
  horizon: Horizon
  sector: string
  sentiment: 'bullish' | 'neutral' | 'bearish'
  winRate: number
  targetPrice: number
  stopLoss: number
  time: string
}

const mockSignals: Signal[] = [
  {
    id: '1', ticker: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com',
    type: 'BUY', price: 264.58, change: 5.42, changePct: 2.1, quality: 'Q5',
    horizon: 'short', sector: 'Technology', sentiment: 'bullish', winRate: 78,
    targetPrice: 285, stopLoss: 252, time: '09:32'
  },
  {
    id: '2', ticker: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com',
    type: 'BUY', price: 822.33, change: 27.11, changePct: 3.4, quality: 'Q5',
    horizon: 'intraday', sector: 'Technology', sentiment: 'bullish', winRate: 82,
    targetPrice: 865, stopLoss: 795, time: '09:15'
  },
  {
    id: '3', ticker: 'AMD', name: 'Advanced Micro Devices', logo: 'https://logo.clearbit.com/amd.com',
    type: 'SELL', price: 200.15, change: -4.72, changePct: -2.3, quality: 'Q4',
    horizon: 'short', sector: 'Technology', sentiment: 'bearish', winRate: 71,
    targetPrice: 185, stopLoss: 210, time: '10:04'
  },
  {
    id: '4', ticker: 'MSFT', name: 'Microsoft Corp.', logo: 'https://logo.clearbit.com/microsoft.com',
    type: 'HOLD', price: 415.20, change: 1.85, changePct: 0.45, quality: 'Q3',
    horizon: 'medium', sector: 'Technology', sentiment: 'neutral', winRate: 65,
    targetPrice: 430, stopLoss: 400, time: '08:55'
  },
  {
    id: '5', ticker: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com',
    type: 'BUY', price: 178.40, change: 8.92, changePct: 5.3, quality: 'Q4',
    horizon: 'intraday', sector: 'Automotive', sentiment: 'bullish', winRate: 69,
    targetPrice: 195, stopLoss: 168, time: '10:22'
  },
  {
    id: '6', ticker: 'JPM', name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/jpmorganchase.com',
    type: 'BUY', price: 198.70, change: 2.30, changePct: 1.17, quality: 'Q5',
    horizon: 'long', sector: 'Finance', sentiment: 'bullish', winRate: 76,
    targetPrice: 220, stopLoss: 188, time: '09:41'
  },
  {
    id: '7', ticker: 'META', name: 'Meta Platforms', logo: 'https://logo.clearbit.com/meta.com',
    type: 'SELL', price: 512.30, change: -15.60, changePct: -2.96, quality: 'Q4',
    horizon: 'short', sector: 'Technology', sentiment: 'bearish', winRate: 73,
    targetPrice: 480, stopLoss: 530, time: '11:08'
  },
  {
    id: '8', ticker: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com',
    type: 'HOLD', price: 175.50, change: 0.85, changePct: 0.49, quality: 'Q3',
    horizon: 'medium', sector: 'Technology', sentiment: 'neutral', winRate: 62,
    targetPrice: 185, stopLoss: 165, time: '09:58'
  }
]

export const useSignalsStore = defineStore('signals', () => {
  const signals = ref<Signal[]>(mockSignals)
  const loading = ref(false)
  const filterHorizon = ref<Horizon | 'all'>('all')
  const filterQuality = ref<Quality | 'all'>('all')
  const filterType = ref<SignalType | 'all'>('all')

  const filteredSignals = computed(() => {
    return signals.value.filter(s => {
      if (filterHorizon.value !== 'all' && s.horizon !== filterHorizon.value) return false
      if (filterQuality.value !== 'all' && s.quality !== filterQuality.value) return false
      if (filterType.value !== 'all' && s.type !== filterType.value) return false
      return true
    })
  })

  const buySignals = computed(() => signals.value.filter(s => s.type === 'BUY'))
  const sellSignals = computed(() => signals.value.filter(s => s.type === 'SELL'))
  const holdSignals = computed(() => signals.value.filter(s => s.type === 'HOLD'))

  const marketStats = ref({
    sp500: { value: 5842.1, change: 8.2 },
    nasdaq: { value: 18432.5, change: 12.1 },
    dow: { value: 43580.2, change: 6.4 },
    vix: { value: 18.4, change: -2.1 },
    sentiment: 'Bullish'
  })

  async function refresh() {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1200))
    // Simulate small price changes
    signals.value = signals.value.map(s => ({
      ...s,
      price: +(s.price * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2)
    }))
    loading.value = false
  }

  return {
    signals, filteredSignals, buySignals, sellSignals, holdSignals,
    loading, filterHorizon, filterQuality, filterType,
    marketStats, refresh
  }
})