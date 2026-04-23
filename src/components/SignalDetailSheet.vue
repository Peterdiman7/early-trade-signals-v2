<template>
	<div class="detail-ov" @click.self="$emit('close')">
		<div class="detail-page">
			<div class="detail-hdr">
				<div class="back-btn" @click="$emit('close')">←</div>
				<div class="dh-logo">
					<img v-if="logoUrl && !showFb" :src="logoUrl" @error="showFb = true" alt="" />
					<span v-else class="dh-logo-fb">{{ ticker }}</span>
				</div>
				<div class="dh-title">
					<div class="dh-ticker">{{ ticker }}</div>
					<div class="dh-name">{{ signal.instrument.name }}</div>
				</div>
				<div :class="['d-badge', actionClass]">{{ signal.action }}</div>
			</div>

			<div class="wl-banner"
				:style="inWl ? 'background:rgba(22,199,132,.06);border-color:rgba(22,199,132,.2)' : ''">
				<div>
					<div class="wl-banner-text">{{ inWl ? t('detail.inWatchlist') : t('detail.addToWatchlist') }}</div>
					<div class="wl-banner-sub">{{ inWl ? t('detail.trackSaved') : t('detail.trackDesc') }}</div>
				</div>
				<button :class="['wl-banner-btn', { saved: inWl }]" @click="wlStore.toggle(ticker)">
					{{ inWl ? t('detail.removeBtn') : t('detail.addBtn') }}
				</button>
			</div>

			<div class="detail-body">
				<div class="price-hero">
					<div class="ph-main">
						<div class="ph-price">${{ close.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</div>
						<div :class="['ph-change', changePercent >= 0 ? 'up' : 'down']">
							{{ changePercent >= 0 ? '+' : '' }}{{ changePercent.toFixed(2) }}%
						</div>
					</div>
					<div class="ph-since">
						{{ t('detail.since') }} {{ signalDate }} (${{ signal.targetPrice.toFixed(2) }}):
						<strong :style="{ color: perfUp ? 'var(--g)' : 'var(--r)' }">{{ perfUp ? '+' : '' }}{{ perfChg
						}}%</strong>
					</div>
				</div>

				<div class="d-tabs">
					<button :class="['d-tab', { on: dTab === 'overview' }]" @click="dTab = 'overview'">{{
						t('detail.tabOverview') }}</button>
					<button :class="['d-tab', { on: dTab === 'analysis' }]" @click="dTab = 'analysis'">{{
						t('detail.tabAnalysis') }}</button>
					<button :class="['d-tab', { on: dTab === 'backtrack' }]" @click="dTab = 'backtrack'">{{
						t('detail.tabBacktrack') }}</button>
				</div>

				<!-- Overview -->
				<div v-if="dTab === 'overview'">
					<div class="info-grid">
						<div class="i-cell">
							<label>{{ t('detail.signalDate') }}</label>
							<div class="v">{{ signalDate }}</div>
						</div>
						<div class="i-cell">
							<label>{{ t('detail.quality') }}</label>
							<div class="v"
								:style="{ color: signal.quality >= 4 ? 'var(--g)' : signal.quality >= 3 ? 'var(--y)' : 'var(--r)' }">
								Q{{ signal.quality }}/5 {{ stars }}
							</div>
						</div>
						<div class="i-cell">
							<label>{{ t('signals.state') }}</label>
							<div class="v">{{ stateLabel }}</div>
						</div>
						<div class="i-cell">
							<label>{{ t('signals.target') }}</label>
							<div class="v">${{ signal.targetPrice.toFixed(2) }}</div>
						</div>
						<div class="i-cell" v-if="signal.stopLoss">
							<label>{{ t('signals.stopLoss') }}</label>
							<div class="v" style="color:var(--r)">${{ signal.stopLoss.toFixed(2) }}</div>
						</div>
						<div class="i-cell" v-if="signal.targetDate">
							<label>{{ t('signals.targetDate') }}</label>
							<div class="v" style="font-size:11px">{{ signal.targetDate }}</div>
						</div>
					</div>

					<div class="chart-box">
						<div class="cb-head">
							<span class="cb-title">{{ t('detail.priceCourse') }}</span>
							<div class="period-btns">
								<button v-for="p in periodOptions" :key="p.value"
									:class="['pb', { on: activePeriod === p.value }]" @click="activePeriod = p.value">{{
										p.label }}</button>
							</div>
						</div>
						<ChartPrice :chartData="signal.instrument.chart" :type="actionClass" :height="210" />
					</div>
				</div>

				<!-- Analysis (static/placeholder — no schema field) -->
				<div v-else-if="dTab === 'analysis'">
					<div class="analysis-box">
						<div class="ab-title">{{ t('detail.companyAnalysis') }}</div>
						<div class="ab-text">{{ analysisText }}</div>
					</div>
				</div>

				<!-- Backtrack (static/placeholder) -->
				<div v-else>
					<div class="bt-box">
						<div class="ab-title">{{ t('detail.backtracking') }}</div>
						<div class="bt-summary">
							<div class="bts-i">
								<label>{{ t('detail.btWinRate') }}</label>
								<div class="v">{{ signal.quality * 15 }}%</div>
							</div>
							<div class="bts-i">
								<label>{{ t('detail.btTrades') }}</label>
								<div class="v">—</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Signal, Period } from '@/generated/graphql'
import { useWatchlistStore } from '@/stores/watchlist'
import { useI18n } from '@/i18n'
import ChartPrice from '@/components/ChartPrice.vue'

const props = defineProps<{ signal: Signal; period: Period }>()
defineEmits(['close'])

const wlStore = useWatchlistStore()
const { t } = useI18n()
const showFb = ref(false)
const dTab = ref<'overview' | 'analysis' | 'backtrack'>('overview')
const activePeriod = ref(props.period)

const periodOptions = [
	{ value: 'D1', label: '1D' },
	{ value: 'M1', label: '1M' },
	{ value: 'M3', label: '3M' },
	{ value: 'M6', label: '6M' },
	{ value: 'Y1', label: '1Y' },
]

const ticker = computed(() => props.signal.instrument.id)

const logos = import.meta.glob('@/assets/images/logos/*', {
	eager: true,
	import: 'default'
})

const normalizeTicker = (t: string) => t.replace('.', '-')

const logoUrl = computed(() => {
	const key = `/src/assets/images/logos/${normalizeTicker(ticker.value)}.png`
	return logos[key] ?? ''
})

const inWl = computed(() => wlStore.isInWatchlist(ticker.value))
const close = computed(() => props.signal.instrument.snapshot?.close ?? 0)
const changePercent = computed(() => props.signal.instrument.snapshot?.changePercent ?? 0)

const perfChg = computed(() =>
	((close.value - props.signal.targetPrice) / props.signal.targetPrice * 100).toFixed(2)
)
const perfUp = computed(() => parseFloat(perfChg.value) >= 0)

const actionClass = computed(() => props.signal.action.toLowerCase())

const stateLabel = computed(() => {
	const map: Record<string, string> = {
		IN_PROGRESS: t('signals.stateInProgress'),
		PROFIT: t('signals.stateProfit'),
		LOSS: t('signals.stateLoss'),
		EXPIRED: t('signals.stateExpired'),
	}
	return map[props.signal.state] ?? props.signal.state
})

const signalDate = computed(() => {
	if (!props.signal.when) return '—'
	return new Date(props.signal.when).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

const stars = computed(() => {
	let s = ''
	for (let i = 1; i <= 5; i++) s += i <= props.signal.quality ? '★' : '☆'
	return s
})

const analysisText = computed(() =>
	t('detail.companyAnalysisText')
		.replace('{name}', props.signal.instrument.name)
		.replace('{sector}', '')
		.replace('{strength}', '')
		.replace('{quality}', String(props.signal.quality))
)
</script>

<style scoped>
.detail-ov {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, .5);
	z-index: 500;
	display: flex;
	align-items: flex-end;
	backdrop-filter: blur(4px);
}

.detail-page {
	background: var(--bg);
	border-radius: 22px 22px 0 0;
	width: 100%;
	max-height: 92vh;
	overflow-y: auto;
	animation: sheetUp .32s cubic-bezier(.34, 1.2, .64, 1);
}

.detail-hdr {
	display: flex;
	align-items: center;
	gap: 9px;
	padding: 12px 16px;
	border-bottom: 1px solid var(--bdr);
	position: sticky;
	top: 0;
	background: rgba(11, 14, 17, .96);
	backdrop-filter: blur(16px);
	z-index: 10;
}

.back-btn {
	width: 32px;
	height: 32px;
	border-radius: 8px;
	background: var(--bg3);
	border: 1px solid var(--bdr);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 15px;
	flex-shrink: 0;
	color: var(--tx);
}

.dh-logo {
	width: 36px;
	height: 36px;
	border-radius: 9px;
	background: var(--bg3);
	border: 1px solid var(--bdr);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	flex-shrink: 0;
}

.dh-logo img {
	width: 24px;
	height: 24px;
	object-fit: contain;
}

.dh-logo-fb {
	font-size: 10px;
	font-weight: 800;
	color: var(--mu);
}

.dh-title {
	flex: 1;
}

.dh-ticker {
	font-size: 19px;
	font-weight: 800;
	letter-spacing: -.03em;
}

.dh-name {
	font-size: 10px;
	color: var(--mu);
}

.d-badge {
	padding: 4px 10px;
	border-radius: 7px;
	font-weight: 700;
	font-size: 9px;
}

.d-badge.buy {
	background: rgba(22, 199, 132, .12);
	color: var(--g);
}

.d-badge.hold {
	background: rgba(240, 185, 11, .12);
	color: var(--y);
}

.d-badge.sell {
	background: rgba(234, 57, 67, .12);
	color: var(--r);
}

.wl-banner {
	margin: 12px 14px 0;
	background: rgba(79, 142, 247, .07);
	border: 1px solid rgba(79, 142, 247, .25);
	border-radius: 12px;
	padding: 11px 14px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	transition: all .2s;
}

.wl-banner-text {
	font-size: 12px;
	color: var(--tx);
	font-weight: 600;
}

.wl-banner-sub {
	font-size: 10px;
	color: var(--mu);
	margin-top: 1px;
}

.wl-banner-btn {
	background: var(--b);
	border: none;
	border-radius: 9px;
	padding: 8px 14px;
	color: #fff;
	font-weight: 700;
	font-size: 11px;
	cursor: pointer;
	white-space: nowrap;
	flex-shrink: 0;
}

.wl-banner-btn.saved {
	background: rgba(22, 199, 132, .15);
	color: var(--g);
	border: 1px solid rgba(22, 199, 132, .3);
}

.detail-body {
	padding: 14px 14px 40px;
}

.price-hero {
	margin-bottom: 14px;
}

.ph-main {
	display: flex;
	align-items: flex-end;
	gap: 9px;
	margin-bottom: 3px;
}

.ph-price {
	font-family: var(--mono);
	font-size: 34px;
	font-weight: 700;
}

.ph-change {
	font-family: var(--mono);
	font-size: 12px;
	font-weight: 700;
	padding: 3px 8px;
	border-radius: 6px;
}

.ph-change.up {
	background: rgba(22, 199, 132, .12);
	color: var(--g);
}

.ph-change.down {
	background: rgba(234, 57, 67, .12);
	color: var(--r);
}

.ph-since {
	font-family: var(--mono);
	font-size: 10px;
	color: var(--mu);
	margin-top: 3px;
}

.d-tabs {
	display: flex;
	gap: 3px;
	background: var(--bg3);
	border-radius: 9px;
	padding: 3px;
	margin-bottom: 14px;
	border: 1px solid var(--bdr);
}

.d-tab {
	flex: 1;
	padding: 7px;
	border: none;
	border-radius: 7px;
	background: transparent;
	color: var(--mu);
	font-weight: 600;
	font-size: 10px;
	cursor: pointer;
	transition: all .2s;
}

.d-tab.on {
	background: var(--bg4);
	color: var(--tx);
}

.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px;
	margin-bottom: 13px;
}

.i-cell {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 10px;
	padding: 10px;
}

.i-cell label {
	font-size: 7px;
	text-transform: uppercase;
	letter-spacing: .12em;
	color: var(--mu2);
	display: block;
	margin-bottom: 2px;
}

.i-cell .v {
	font-family: var(--mono);
	font-size: 13px;
	font-weight: 700;
}

.chart-box {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 13px;
}

.cb-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
}

.cb-title {
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: .09em;
	color: var(--mu);
}

.period-btns {
	display: flex;
	gap: 3px;
}

.pb {
	background: transparent;
	border: 1px solid var(--bdr);
	border-radius: 6px;
	padding: 3px 8px;
	font-size: 9px;
	font-weight: 700;
	color: var(--mu);
	cursor: pointer;
	font-family: var(--mono);
	transition: all .15s;
}

.pb.on {
	background: var(--bg4);
	border-color: var(--bdr2);
	color: var(--tx);
}

.hist-box {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 12px;
}

.hist-item {
	display: flex;
	align-items: center;
	gap: 9px;
	padding: 9px 0;
	border-bottom: 1px solid var(--bdr);
}

.hist-item:last-child {
	border-bottom: none;
}

.hist-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	flex-shrink: 0;
}

.hist-dot.buy {
	background: var(--g);
}

.hist-dot.hold {
	background: var(--y);
}

.hist-dot.sell {
	background: var(--r);
}

.hist-info {
	flex: 1;
}

.hist-date {
	font-family: var(--mono);
	font-size: 8px;
	color: var(--mu);
}

.hist-type {
	font-size: 11px;
	font-weight: 700;
}

.hist-type.buy {
	color: var(--g);
}

.hist-type.hold {
	color: var(--y);
}

.hist-type.sell {
	color: var(--r);
}

.hist-right {
	text-align: right;
}

.hist-price {
	font-family: var(--mono);
	font-size: 11px;
	font-weight: 700;
}

.hist-perf {
	font-family: var(--mono);
	font-size: 9px;
}

.hist-perf.up {
	color: var(--g);
}

.hist-perf.down {
	color: var(--r);
}

.ab-title {
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: .09em;
	color: var(--mu);
	margin-bottom: 9px;
}

.analysis-box {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 12px;
}

.ab-text {
	font-size: 12px;
	line-height: 1.72;
	color: rgba(232, 237, 242, .75);
}

.news-box {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 12px;
}

.news-counts {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 5px;
	margin-bottom: 9px;
}

.nc-item {
	background: var(--bg);
	border-radius: 8px;
	padding: 8px;
	text-align: center;
	border: 1px solid var(--bdr);
}

.nc-num {
	font-family: var(--mono);
	font-size: 18px;
	font-weight: 700;
}

.nc-num.pos {
	color: var(--g);
}

.nc-num.neg {
	color: var(--r);
}

.nc-num.neu {
	color: var(--mu);
}

.nc-lbl {
	font-size: 8px;
	text-transform: uppercase;
	letter-spacing: .08em;
	color: var(--mu2);
	margin-top: 2px;
}

.nm-bar {
	height: 6px;
	border-radius: 3px;
	overflow: hidden;
	background: var(--bg);
	display: flex;
	margin-bottom: 9px;
}

.nm-seg.pos {
	background: var(--g);
}

.nm-seg.neg {
	background: var(--r);
}

.nm-seg.neu {
	background: var(--mu2);
}

.news-list {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.news-item {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 8px;
	background: var(--bg);
	border-radius: 8px;
	border: 1px solid var(--bdr);
}

.news-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	flex-shrink: 0;
	margin-top: 4px;
}

.news-dot.pos {
	background: var(--g);
}

.news-dot.neg {
	background: var(--r);
}

.news-dot.neu {
	background: var(--mu2);
}

.news-text {
	font-size: 10px;
	color: var(--mu);
	line-height: 1.5;
}

.news-text strong {
	color: var(--tx);
	font-size: 11px;
	display: block;
	margin-bottom: 1px;
}

.bt-box {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 12px;
}

.bt-summary {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 6px;
	margin-bottom: 11px;
}

.bts-i {
	background: var(--bg);
	border-radius: 8px;
	padding: 9px;
	border: 1px solid var(--bdr);
}

.bts-i label {
	font-size: 7px;
	text-transform: uppercase;
	letter-spacing: .1em;
	color: var(--mu2);
	display: block;
	margin-bottom: 2px;
}

.bts-i .v {
	font-family: var(--mono);
	font-size: 14px;
	font-weight: 700;
}

.bt-trade {
	display: flex;
	align-items: center;
	gap: 7px;
	padding: 8px;
	background: var(--bg);
	border-radius: 8px;
	font-size: 10px;
	border: 1px solid var(--bdr);
	margin-bottom: 5px;
}

.bt-trade .type {
	font-weight: 700;
	min-width: 32px;
	font-size: 9px;
}

.bt-trade .type.buy {
	color: var(--g);
}

.bt-trade .type.sell {
	color: var(--r);
}

.bt-trade .type.hold {
	color: var(--y);
}

.bt-trade .dates {
	color: var(--mu2);
	flex: 1;
	font-family: var(--mono);
	font-size: 8px;
}

.bt-trade .perf {
	font-family: var(--mono);
	font-weight: 700;
	font-size: 10px;
	margin-left: auto;
}

.bt-trade .perf.up {
	color: var(--g);
}

.bt-trade .perf.down {
	color: var(--r);
}
</style>
