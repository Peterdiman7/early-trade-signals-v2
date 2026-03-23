<!-- PortfolioView.vue -->
<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="pad">
				<div class="sec-head" style="margin-top:16px">
					<span class="sec-title">💼 {{ t('portfolio.title') }}</span>
				</div>
				<div class="ptf-header">
					<div class="ptf-sub">{{ t('portfolio.totalValue') }}</div>
					<div class="ptf-val">${{ totalVal.toFixed(2) }}</div>
					<div class="ptf-perf">
						<div class="ptf-p">
							<label>{{ t('portfolio.performance') }}</label>
							<div class="v" :style="{ color: perf >= 0 ? 'var(--g)' : 'var(--r)' }">{{ perf >= 0 ? '+' : '' }}{{ perf.toFixed(2) }}%</div>
						</div>
						<div class="ptf-p">
							<label>{{ t('portfolio.unrealPnl') }}</label>
							<div class="v" :style="{ color: pnl >= 0 ? 'var(--g)' : 'var(--r)' }">{{ pnl >= 0 ? '+' : '' }}${{ pnl.toFixed(2) }}</div>
						</div>
					</div>
					<div style="margin-top:12px">
						<ChartPortfolio :totalVal="totalVal" :height="130" />
					</div>
				</div>

				<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--mu);margin:16px 0 8px">
					{{ t('portfolio.positionsLabel') }}
				</div>
				<div v-for="p in positions" :key="p.ticker" class="pos-item" @click="selected = p.sig">
					<div class="pos-top">
						<div class="pos-left">
							<div class="pos-logo"><img :src="logoFor(p.ticker)" @error="imgFallback" alt="" /></div>
							<div>
								<div class="pos-ticker">{{ p.ticker }}</div>
								<div class="pos-name">{{ p.name }}</div>
							</div>
						</div>
						<div>
							<div class="pos-value">${{ p.val.toFixed(2) }}</div>
							<div class="pos-change" :style="{ color: p.pnlPct >= 0 ? 'var(--g)' : 'var(--r)' }">{{ p.pnlPct >= 0 ? '+' : '' }}{{ p.pnlPct.toFixed(2) }}%</div>
						</div>
					</div>
					<div class="pos-data">
						<div class="pos-d"><label>{{ t('portfolio.shares') }}</label>
							<div class="v">{{ p.sh }}</div>
						</div>
						<div class="pos-d"><label>{{ t('portfolio.costBasis') }}</label>
							<div class="v">${{ p.entry }}</div>
						</div>
						<div class="pos-d"><label>{{ t('portfolio.pnl') }}</label>
							<div class="v" :style="{ color: p.pnl >= 0 ? 'var(--g)' : 'var(--r)' }">{{ p.pnl >= 0 ? '+' : '' }}${{ p.pnl.toFixed(0) }}</div>
						</div>
					</div>
				</div>
			</div>
			<SignalDetailSheet v-if="selected" :signal="selected" @close="selected = null" />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useSignalsStore, LOGOS } from '@/stores/signals'
import { useWatchlistStore } from '@/stores/watchlist'
import { useI18n } from '@/i18n'
import type { Signal } from '@/stores/signals'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'
import ChartPortfolio from '@/components/ChartPortfolio.vue'

const sigStore = useSignalsStore()
const wlStore = useWatchlistStore()
const { t } = useI18n()
const selected = ref<Signal | null>(null)

function logoFor(ticker: string) { return LOGOS[ticker] || '' }
function imgFallback(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }

const positions = computed(() => {
	const tickers = wlStore.tickers.length > 0 ? wlStore.tickers : ['AAPL', 'MSFT', 'NVDA']
	return tickers.map(ticker => {
		const s = sigStore.signals.find(x => x.ticker === ticker)
		if (!s) return null
		const sh = Math.floor(Math.random() * 15) + 5
		const cost = s.signalPrice * sh
		const val = s.price * sh
		return { ticker, name: s.name, sh, val, entry: s.signalPrice, pnl: val - cost, pnlPct: (val - cost) / cost * 100, sig: s }
	}).filter(Boolean) as any[]
})

const totalVal = computed(() => positions.value.reduce((a, p) => a + p.val, 0))
const totalCost = computed(() => positions.value.reduce((a, p) => a + p.entry * p.sh, 0))
const pnl = computed(() => totalVal.value - totalCost.value)
const perf = computed(() => totalCost.value > 0 ? pnl.value / totalCost.value * 100 : 0)
</script>

<style scoped>
.pad { padding: 16px 16px 80px; }
.sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sec-title { font-size: 17px; font-weight: 800; letter-spacing: -.03em; }
.ptf-header { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 15px; padding: 16px; margin-bottom: 12px; position: relative; overflow: hidden; }
.ptf-sub { font-size: 10px; color: var(--mu); }
.ptf-val { font-family: var(--mono); font-size: 30px; font-weight: 700; margin-bottom: 2px; }
.ptf-perf { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 10px; }
.ptf-p { background: var(--bg); border-radius: 9px; padding: 9px; border: 1px solid var(--bdr); }
.ptf-p label { font-size: 7px; text-transform: uppercase; letter-spacing: .1em; color: var(--mu2); display: block; margin-bottom: 2px; }
.ptf-p .v { font-family: var(--mono); font-size: 13px; font-weight: 700; }
.pos-item { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 12px; padding: 11px; cursor: pointer; margin-bottom: 7px; }
.pos-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
.pos-left { display: flex; align-items: center; gap: 8px; }
.pos-logo { width: 32px; height: 32px; border-radius: 8px; background: var(--bg3); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pos-logo img { width: 20px; height: 20px; object-fit: contain; }
.pos-ticker { font-size: 13px; font-weight: 800; }
.pos-name { font-size: 9px; color: var(--mu); margin-top: 1px; }
.pos-value { font-family: var(--mono); font-size: 13px; font-weight: 700; text-align: right; }
.pos-change { font-family: var(--mono); font-size: 9px; text-align: right; }
.pos-data { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; background: var(--bg); border-radius: 8px; padding: 8px; border: 1px solid var(--bdr); }
.pos-d label { font-size: 7px; text-transform: uppercase; letter-spacing: .1em; color: var(--mu2); display: block; }
.pos-d .v { font-family: var(--mono); font-size: 10px; font-weight: 700; margin-top: 2px; }
</style>
