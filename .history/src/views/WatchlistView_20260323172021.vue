<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="pad">
				<div class="sec-head" style="margin-top:16px">
					<span class="sec-title">⭐ {{ t('watchlist.title') }}</span>
					<span class="badge-sm">{{ wlStore.tickers.length }}</span>
				</div>

				<div v-if="wlStore.items.length === 0" class="wl-empty">
					<span class="ico">⭐</span>
					{{ t('watchlist.empty') }}<br>{{ t('watchlist.emptyHint') }}
				</div>

				<div v-else>
					<div v-for="s in wlStore.items" :key="s.id" class="wl-item" @click="selected = s">
						<div class="wl-top">
							<div class="wl-left">
								<div class="wl-logo">
									<img :src="logoFor(s.ticker)" @error="imgFallback" alt="" />
								</div>
								<div>
									<div class="wl-ticker">{{ s.ticker }}</div>
									<div class="wl-name">{{ s.name }}</div>
								</div>
							</div>
							<button class="wl-remove" @click.stop="wlStore.remove(s.ticker)">{{ t('watchlist.removeX')
								}}</button>
						</div>
						<div class="wl-stats">
							<div class="wl-s"><label>{{ t('watchlist.currentPrice') }}</label>
								<div class="v">${{ s.price }}</div>
							</div>
							<div class="wl-s"><label>{{ t('watchlist.sinceSaved') }}</label>
								<div class="v" :style="{ color: sigChg(s) >= 0 ? 'var(--g)' : 'var(--r)' }">{{ sigChg(s)
									>= 0 ? '+' : '' }}{{ sigChg(s).toFixed(2) }}%</div>
							</div>
							<div class="wl-s"><label>{{ t('watchlist.holdDuration') }}</label>
								<div class="v">{{ daysSince(s.signalDate) }}d</div>
							</div>
						</div>
						<div class="wl-foot">
							<span>{{ t('watchlist.signalLabel') }}: {{ s.signalDate }}</span>
							<span
								:style="{ color: s.type === 'buy' ? 'var(--g)' : s.type === 'hold' ? 'var(--y)' : 'var(--r)' }">●
								{{ s.type.toUpperCase() }} Q{{ s.quality }}/5</span>
						</div>
					</div>
				</div>
			</div>

			<SignalDetailSheet v-if="selected" :signal="selected" @close="selected = null" />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useWatchlistStore } from '@/stores/watchlist'
import { LOGOS } from '@/stores/signals'
import { useI18n } from '@/i18n'
import type { Signal } from '@/stores/signals'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'

const wlStore = useWatchlistStore()
const { t } = useI18n()
const selected = ref<Signal | null>(null)

function logoFor(ticker: string) { return LOGOS[ticker] || '' }
function imgFallback(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }
function sigChg(s: Signal) { return (s.price - s.signalPrice) / s.signalPrice * 100 }
function daysSince(date: string) { return Math.max(1, Math.ceil((new Date('2026-02-22').getTime() - new Date(date).getTime()) / 86400000)) }
</script>

<style scoped>
.pad {
	padding: 16px 16px 80px;
}

.sec-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.sec-title {
	font-size: 17px;
	font-weight: 800;
	letter-spacing: -.03em;
}

.badge-sm {
	font-family: var(--mono);
	font-size: 9px;
	color: var(--mu);
	background: var(--bg3);
	border: 1px solid var(--bdr);
	border-radius: 5px;
	padding: 2px 7px;
}

.wl-empty {
	text-align: center;
	padding: 50px 20px;
	color: var(--mu);
	line-height: 1.8;
}

.wl-empty .ico {
	font-size: 40px;
	display: block;
	margin-bottom: 10px;
	opacity: .3;
}

.wl-item {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 12px;
	margin-bottom: 8px;
	cursor: pointer;
}

.wl-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 9px;
}

.wl-left {
	display: flex;
	align-items: center;
	gap: 8px;
}

.wl-logo {
	width: 34px;
	height: 34px;
	border-radius: 8px;
	background: var(--bg3);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.wl-logo img {
	width: 22px;
	height: 22px;
	object-fit: contain;
}

.wl-ticker {
	font-size: 14px;
	font-weight: 800;
}

.wl-name {
	font-size: 9px;
	color: var(--mu);
	margin-top: 1px;
}

.wl-remove {
	width: 22px;
	height: 22px;
	border-radius: 5px;
	border: 1px solid var(--bdr);
	background: transparent;
	cursor: pointer;
	font-size: 12px;
	color: var(--mu);
	display: flex;
	align-items: center;
	justify-content: center;
}

.wl-stats {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 5px;
	background: var(--bg);
	border-radius: 8px;
	padding: 8px;
	border: 1px solid var(--bdr);
}

.wl-s label {
	font-size: 7px;
	text-transform: uppercase;
	letter-spacing: .1em;
	color: var(--mu2);
	display: block;
}

.wl-s .v {
	font-family: var(--mono);
	font-size: 11px;
	font-weight: 700;
	margin-top: 2px;
}

.wl-foot {
	display: flex;
	justify-content: space-between;
	margin-top: 7px;
	font-family: var(--mono);
	font-size: 8px;
	color: var(--mu2);
}
</style>
