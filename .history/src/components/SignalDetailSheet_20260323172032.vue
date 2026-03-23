<template>
	<div class="detail-ov" @click.self="$emit('close')">
		<div class="detail-page">
			<div class="detail-hdr">
				<div class="back-btn" @click="$emit('close')">←</div>
				<div class="dh-logo">
					<img v-if="!showFb" :src="logoUrl" @error="showFb = true" alt="" />
					<span v-else class="dh-logo-fb">{{ signal.ticker.slice(0, 4) }}</span>
				</div>
				<div class="dh-title">
					<div class="dh-ticker">{{ signal.ticker }}</div>
					<div class="dh-name">{{ signal.name }}</div>
				</div>
				<div :class="['d-badge', signal.type]">{{ signal.type.toUpperCase() }}</div>
			</div>

			<div class="wl-banner"
				:style="inWl ? 'background:rgba(22,199,132,.06);border-color:rgba(22,199,132,.2)' : ''">
				<div>
					<div class="wl-banner-text">{{ inWl ? t('detail.inWatchlist') : t('detail.addToWatchlist') }}</div>
					<div class="wl-banner-sub">{{ inWl ? t('detail.trackSaved') : t('detail.trackDesc') }}</div>
				</div>
				<button :class="['wl-banner-btn', { saved: inWl }]" @click="wlStore.toggle(signal.ticker)">
					{{ inWl ? t('detail.removeBtn') : t('detail.addBtn') }}
				</button>
			</div>

			<div class="detail-body">
				<div class="price-hero">
					<div class="ph-main">
						<div class="ph-price">${{ signal.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
						</div>
						<div :class="['ph-change', signal.change >= 0 ? 'up' : 'down']">{{ signal.change >= 0 ? '+' : ''
							}}{{ signal.change }}%</div>
					</div>
					<div class="ph-since">
						{{ t('detail.since') }} {{ signal.signalDate }} (${{ signal.signalPrice }}):
						<strong :style="{ color: sigUp ? 'var(--g)' : 'var(--r)' }">{{ sigUp ? '+' : '' }}{{ sigChg
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

				<div v-if="dTab === 'overview'">
					<div class="info-grid">
						<div class="i-cell"><label>{{ t('detail.signalDate') }}</label>
							<div class="v">{{ signal.signalDate }}</div>
						</div>
						<div class="i-cell"><label>{{ t('detail.strength') }}</label>
							<div class="v"
								:style="{ color: signal.strength === 'Strong' ? 'var(--g)' : signal.strength === 'Moderate' ? 'var(--y)' : 'var(--r)' }">
								{{ strengthLabel }}
							</div>
						</div>
						<div class="i-cell"><label>{{ t('detail.quality') }}</label>
							<div class="v"
								:style="{ color: signal.quality >= 4 ? 'var(--g)' : signal.quality >= 3 ? 'var(--y)' : 'var(--r)' }">
								Q{{ signal.quality }}/5 {{ stars }}
							</div>
						</div>
						<div class="i-cell"><label>{{ t('detail.horizon') }}</label>
							<div class="v"><span :class="['dur-badge', signal.duration]">{{ durLabel }}</span></div>
						</div>
						<div class="i-cell"><label>{{ t('detail.sector') }}</label>
							<div class="v">{{ signal.sector }}</div>
						</div>
						<div class="i-cell"><label>{{ t('signals.entry') }}</label>
							<div class="v">${{ signal.signalPrice }}</div>
						</div>
					</div>

					<!-- Price chart with period buttons -->
					<div class="chart-box">
						<div class="cb-head">
							<span class="cb-title">{{ t('detail.priceCourse') }}</span>
							<div class="period-btns">
								<button v-for="p in periods" :key="p" :class="['pb', { on: activePeriod === p }]"
									@click="activePeriod = p">{{ p }}</button>
							</div>
						</div>
						<ChartPrice :price="signal.price" :type="signal.type" :period="activePeriod" :height="210" />
					</div>

					<div class="hist-box">
						<div class="ab-title" style="margin-bottom:9px">{{ t('detail.signalHistory') }}</div>
						<div v-for="(h, i) in histItems" :key="i" class="hist-item">
							<div :class="['hist-dot', h.type]"></div>
							<div class="hist-info">
								<div class="hist-date">{{ h.date }}</div>
								<div :class="['hist-type', h.type]">{{ h.type.toUpperCase() }}-{{
									t('signals.title').includes('Signal') ? 'Signal' : 'Signal' }}</div>
							</div>
							<div class="hist-right">
								<div class="hist-price">${{ h.price }}</div>
								<div :class="['hist-perf', h.perf >= 0 ? 'up' : 'down']">{{ h.perf >= 0 ? '+' : '' }}{{
									h.perf }}%</div>
							</div>
						</div>
					</div>
				</div>

				<div v-else-if="dTab === 'analysis'">
					<div class="analysis-box">
						<div class="ab-title">{{ t('detail.companyAnalysis') }}</div>
						<div class="ab-text">{{ analysisText }}</div>
					</div>
					<div class="news-box">
						<div class="ab-title">{{ t('detail.newsSentiment') }}</div>
						<div class="news-counts">
							<div class="nc-item">
								<div class="nc-num pos">4</div>
								<div class="nc-lbl">{{ t('detail.positive') }}</div>
							</div>
							<div class="nc-item">
								<div class="nc-num neg">2</div>
								<div class="nc-lbl">{{ t('detail.negative') }}</div>
							</div>
							<div class="nc-item">
								<div class="nc-num neu">2</div>
								<div class="nc-lbl">{{ t('detail.neutral') }}</div>
							</div>
						</div>
						<div class="nm-bar">
							<div class="nm-seg pos" style="width:50%"></div>
							<div class="nm-seg neg" style="width:25%"></div>
							<div class="nm-seg neu" style="width:25%"></div>
						</div>
						<div class="news-list">
							<div v-for="n in newsItems" :key="n.headline" class="news-item">
								<div :class="['news-dot', n.s]"></div>
								<div class="news-text"><strong>{{ n.headline }}</strong>{{ n.impact }} <span
										style="font-size:8px;color:var(--mu2)">· {{ n.age }}</span></div>
							</div>
						</div>
					</div>
				</div>

				<div v-else>
					<div class="bt-box">
						<div class="ab-title">{{ t('detail.backtracking') }}</div>
						<div class="bt-summary">
							<div class="bts-i"><label>{{ t('detail.btTotalReturn') }}</label>
								<div class="v" style="color:var(--g)">+18.4%</div>
							</div>
							<div class="bts-i"><label>{{ t('detail.btWinRate') }}</label>
								<div class="v">{{ signal.quality * 15 }}%</div>
							</div>
							<div class="bts-i"><label>{{ t('detail.btTrades') }}</label>
								<div class="v">5</div>
							</div>
							<div class="bts-i"><label>{{ t('detail.btPeriod') }}</label>
								<div class="v" style="font-size:10px">{{ t('detail.btMonths6') }}</div>
							</div>
						</div>
						<div style="margin-bottom:11px">
							<ChartPortfolio :totalVal="signal.price" :height="140" />
						</div>
						<div v-for="(tr, i) in btTrades" :key="i" class="bt-trade">
							<span :class="['type', tr.type]">{{ tr.type.toUpperCase() }}</span>
							<span class="dates">{{ t('signals.entry') }}: ${{ tr.entry }} → {{ t('signals.entry') }}:
								${{ tr.exit }}<br>{{ tr.from }} → {{ tr.to }}</span>
							<span :class="['perf', tr.pnl >= 0 ? 'up' : 'down']">{{ tr.pnl >= 0 ? '+' : '' }}{{
								tr.pnl.toFixed(1) }}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Signal } from '@/stores/signals'
import { LOGOS } from '@/stores/signals'
import { useWatchlistStore } from '@/stores/watchlist'
import { useI18n } from '@/i18n'
import ChartPrice from '@/components/ChartPrice.vue'
import ChartPortfolio from '@/components/ChartPortfolio.vue'

const props = defineProps<{ signal: Signal }>()
defineEmits(['close'])

const wlStore = useWatchlistStore()
const { t } = useI18n()
const showFb = ref(false)
const dTab = ref<'overview' | 'analysis' | 'backtrack'>('overview')
const activePeriod = ref('1M')
const periods = ['1M', '3M', '6M', '1J']

const logoUrl = computed(() => LOGOS[props.signal.ticker] || '')
const inWl = computed(() => wlStore.isInWatchlist(props.signal.ticker))
const sigChg = computed(() => ((props.signal.price - props.signal.signalPrice) / props.signal.signalPrice * 100).toFixed(2))
const sigUp = computed(() => parseFloat(sigChg.value) >= 0)

const strengthLabel = computed(() => {
	const map: Record<string, string> = {
		Strong: t('common.strong'),
		Moderate: t('common.moderate'),
		Weak: t('common.weak'),
	}
	return map[props.signal.strength] || props.signal.strength
})

const durLabel = computed(() => {
	const map: Record<string, string> = {
		intraday: t('signals.intraday'),
		short: t('signals.short'),
		medium: t('signals.medium'),
		long: t('signals.long'),
	}
	return map[props.signal.duration] || props.signal.duration
})

const stars = computed(() => { let s = ''; for (let i = 1; i <= 5; i++) s += i <= props.signal.quality ? '★' : '☆'; return s })

const analysisText = computed(() =>
	t('detail.companyAnalysisText')
		.replace('{name}', props.signal.name)
		.replace('{sector}', props.signal.sector)
		.replace('{strength}', strengthLabel.value)
		.replace('{quality}', String(props.signal.quality))
)

const histItems = computed(() => [
	{ date: 'Feb 22, 2026 09:58', type: props.signal.type, price: props.signal.price, perf: props.signal.change },
	{ date: 'Feb 15, 2026 10:12', type: 'hold', price: +(props.signal.price * .98).toFixed(2), perf: 0.83 },
	{ date: 'Feb 01, 2026 09:45', type: 'buy', price: +(props.signal.price * .95).toFixed(2), perf: 3.21 },
	{ date: 'Jan 18, 2026 11:03', type: 'sell', price: +(props.signal.price * .92).toFixed(2), perf: -1.44 },
	{ date: 'Jan 05, 2026 09:30', type: 'buy', price: +(props.signal.price * .88).toFixed(2), perf: 4.72 }
])

const newsItems = computed(() => [
	{ s: 'pos', headline: t('detail.newsList.headline1'), age: '1d', impact: t('detail.newsList.impact1') },
	{ s: 'pos', headline: t('detail.newsList.headline2'), age: '2d', impact: t('detail.newsList.impact2') },
	{ s: 'neu', headline: t('detail.newsList.headline3'), age: '2d', impact: t('detail.newsList.impact3') },
	{ s: 'neg', headline: t('detail.newsList.headline4'), age: '3d', impact: t('detail.newsList.impact4') },
])

const btTrades = computed(() => [
	{ type: 'buy', entry: +(props.signal.signalPrice * .82).toFixed(2), exit: +(props.signal.signalPrice * .91).toFixed(2), from: '2025-10-01', to: '2025-10-18', pnl: 10.9 },
	{ type: 'sell', entry: +(props.signal.signalPrice * .93).toFixed(2), exit: +(props.signal.signalPrice * .89).toFixed(2), from: '2025-10-22', to: '2025-11-05', pnl: 4.3 },
	{ type: 'buy', entry: +(props.signal.signalPrice * .88).toFixed(2), exit: +(props.signal.signalPrice * .96).toFixed(2), from: '2025-11-10', to: '2025-11-28', pnl: 9.1 },
	{ type: 'buy', entry: +(props.signal.signalPrice * .96).toFixed(2), exit: props.signal.price, from: '2025-12-20', to: '2026-02-22', pnl: parseFloat(sigChg.value) }
])
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
