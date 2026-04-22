<template>
	<ion-page>
		<!-- Navbar -->
		<div class="navbar">
			<div class="nav-top">
				<div class="nav-logo">
					<div class="nldot">
						<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"
							width="16" height="16">
							<polyline points="3 17 8 12 13 15 21 7" />
							<polyline points="17 7 21 7 21 11" />
						</svg>
					</div>
					<div class="nl-text">Early<span>Trade</span></div>
				</div>
				<div style="display:flex;align-items:center;gap:7px">
					<button class="bell-wrap" @click="showNotifSheet = true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="2"
							stroke-linecap="round">
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
							<path d="M13.73 21a2 2 0 0 1-3.46 0" />
						</svg>
						<div v-if="appStore.unreadCount > 0 && appStore.notifEnabled" class="bell-dot show"></div>
					</button>
					<button class="hamburger" @click="showDrawer = true">
						<span></span><span></span><span></span>
					</button>
				</div>
			</div>

			<!-- Ticker -->
			<div class="nav-ticker-row">
				<div class="ticker-inner">
					<div v-for="headlineTicker in headlineTickers" :key="headlineTicker.id" :class="[
						'tick',
						headlineTicker.snapshot && headlineTicker.snapshot.change >= 0 ? 'up' : 'down'
					]">
						<span>{{ headlineTicker.id }}</span>
						<span class="p">
							${{ headlineTicker.snapshot?.open }}
						</span>
						<span :style="{
							color: headlineTicker.snapshot && headlineTicker.snapshot?.change >= 0
								? 'var(--g)'
								: 'var(--r)'
						}">
							{{ headlineTicker.snapshot && headlineTicker.snapshot?.change >= 0 ? '+' : '' }}
							{{ headlineTicker.snapshot?.changePercent }}%
						</span>
					</div>
				</div>
			</div>
		</div>

		<ion-content :fullscreen="true">
			<ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
				<ion-refresher-content />
			</ion-refresher>

			<!-- HERO -->
			<div class="home-hero">
				<div class="home-hero-bg"></div>
				<div class="home-hero-glow"></div>
				<div class="home-hero-content">
					<div class="home-tag">
						<span class="ldot"></span>
						<span>{{ t('home.liveLabel') }} · {{ today }}</span>
					</div>
					<h1 class="home-h">{{ greeting }}, <span class="serif">{{ firstName }}</span></h1>
					<p class="home-p">{{ subText }}</p>
				</div>
			</div>

			<!-- Market Strip -->
			<div class="market-strip">
				<div v-for="m in marketItems" :key="m.label" class="ms-item">
					<div class="ms-label">{{ m.label }}</div>
					<div :class="['ms-val', { 'c-buy': m.up, 'c-sell': !m.up && !m.neutral, 'c-hold': m.neutral }]">{{
						m.val }}</div>
				</div>
			</div>

			<!-- Top Signals -->
			<div class="pad">
				<div class="sec-head" style="margin-top:16px">
					<span class="sec-title">{{ t('home.topSignals') }}</span>
					<span class="badge-sm">{{ today }}</span>
				</div>
				<div class="top-signals-table">
					<div class="ts-col">
						<div class="ts-col-head">
							<div class="ch-dot" style="background:var(--g)"></div>
							<span style="color:var(--g)">{{ t('home.topBuy') }}</span>
						</div>
						<div v-for="ticker in topBuy" :key="ticker.id" class="ts-row" @click="openTickerDetail(ticker)">
							<div class="ts-logo"><img :src="ticker.imageUrl" @error="imgFallback" alt="" /></div>
							<div style="flex:1">
								<div class="ts-ticker">{{ ticker.id }}</div>
								<div style="font-family:var(--mono);font-size:8px;color:var(--mu)">{{ ticker.name }}
								</div>
							</div>
							<div class="ts-chg"
								:style="{ color: (ticker.snapshot?.change ?? 0) >= 0 ? 'var(--g)' : 'var(--r)' }">
								{{ (ticker.snapshot?.change ?? 0) >= 0 ? '+' : '' }}{{
									ticker.snapshot?.change?.toFixed(2) }}%
							</div>
						</div>
					</div>
					<div class="ts-col">
						<div class="ts-col-head">
							<div class="ch-dot" style="background:var(--r)"></div>
							<span style="color:var(--r)">{{ t('home.topSell') }}</span>
						</div>
						<div v-for="ticker in topSell" :key="ticker.id" class="ts-row"
							@click="openTickerDetail(ticker)">
							<div class="ts-logo"><img :src="ticker.imageUrl" @error="imgFallback" alt="" /></div>
							<div style="flex:1">
								<div class="ts-ticker">{{ ticker.id }}</div>
								<div style="font-family:var(--mono);font-size:8px;color:var(--mu)">{{ ticker.name }}
								</div>
							</div>
							<div class="ts-chg"
								:style="{ color: (ticker.snapshot?.change ?? 0) >= 0 ? 'var(--g)' : 'var(--r)' }">
								{{ (ticker.snapshot?.change ?? 0) >= 0 ? '+' : '' }}{{
									ticker.snapshot?.change?.toFixed(2) }}%
							</div>
						</div>
					</div>
				</div>

				<!-- Signal count buttons -->
				<div style="margin-top:14px">
					<div
						style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:9px;display:flex;align-items:center;gap:8px">
						<span
							style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g);animation:blink 1.8s ease infinite"></span>
						{{ t('home.liveSignals') }}
					</div>
					<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px">
						<button class="sig-count-btn buy" @click="goSignals('buy')">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.2" stroke-linecap="round">
								<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
								<polyline points="17 6 23 6 23 12" />
							</svg>
							<span>{{ t('home.buy') }}</span>
							<span class="count-num">{{ sigStore.buySignals.length }}</span>
						</button>
						<button class="sig-count-btn hold" @click="goSignals('hold')">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.2" stroke-linecap="round">
								<circle cx="12" cy="12" r="10" />
								<line x1="10" y1="15" x2="10" y2="9" />
								<line x1="14" y1="15" x2="14" y2="9" />
							</svg>
							<span>{{ t('home.hold') }}</span>
							<span class="count-num">{{ sigStore.holdSignals.length }}</span>
						</button>
						<button class="sig-count-btn sell" @click="goSignals('sell')">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.2" stroke-linecap="round">
								<polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
								<polyline points="17 18 23 18 23 12" />
							</svg>
							<span>{{ t('home.sell') }}</span>
							<span class="count-num">{{ sigStore.sellSignals.length }}</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Marktanalyse Accordion -->
			<div class="pad" style="margin-top:6px;padding-bottom:16px">
				<div class="sec-head" style="margin-bottom:10px">
					<span class="sec-title">📉 {{ t('home.marketAnalysis') }}</span>
				</div>

				<!-- Accordion: Index Chart -->
				<div class="acc-block">
					<div class="acc-head" @click="accIndex = !accIndex">
						<span class="acc-title">{{ t('home.indexPerf6m') }}</span>
						<span class="acc-chg" style="color:var(--g)">{{ t('home.indexPerfStats') }}</span>
						<span class="acc-arrow">{{ accIndex ? '▼' : '▶' }}</span>
					</div>
					<div class="acc-body" :class="{ 'acc-closed': !accIndex }">
						<div class="acc-body-inner">
							<ChartIndex :height="190" />
						</div>
					</div>
				</div>

				<!-- Accordion: Signal Distribution -->
				<div class="acc-block" style="margin-top:8px">
					<div class="acc-head" @click="accSig = !accSig">
						<span class="acc-title">{{ t('home.signalDist30d') }}</span>
						<span class="acc-chg" style="color:var(--mu)">{{ t('home.signalDistStats') }}</span>
						<span class="acc-arrow">{{ accSig ? '▼' : '▶' }}</span>
					</div>
					<div class="acc-body" :class="{ 'acc-closed': !accSig }">
						<div class="acc-body-inner">
							<ChartSignalDist :height="170" />
						</div>
					</div>
				</div>

				<!-- Accordion: Sektoren -->
				<div class="acc-block" style="margin-top:8px">
					<div class="acc-head" @click="accSec = !accSec">
						<span class="acc-title">{{ t('home.sectorPerf') }}</span>
						<span class="acc-chg" style="color:var(--mu)">{{ t('home.sectorCount') }}</span>
						<span class="acc-arrow">{{ accSec ? '▼' : '▶' }}</span>
					</div>
					<div class="acc-body" :class="{ 'acc-closed': !accSec }">
						<div class="acc-body-inner">
							<div class="sector-grid">
								<div v-for="sec in sectors" :key="sec.name" class="sector-card">
									<div class="sector-name">{{ sec.name }}</div>
									<div class="sbar-bg">
										<div :class="['sbar', sec.change >= 0 ? 'up' : 'down']"
											:style="{ width: sec.perc + '%' }"></div>
									</div>
									<div class="sector-stats">
										<span>{{ sec.perc }}% {{ t('home.sectorBullish') }}</span>
										<span :style="{ color: sec.change >= 0 ? 'var(--g)' : 'var(--r)' }">{{
											sec.change >= 0 ? '+' : '' }}{{ sec.change }}%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</ion-content>

		<!-- Detail Sheet -->
		<SignalDetailSheet v-if="detailSignal" :signal="detailSignal" @close="detailSignal = null" />

		<!-- Drawer -->
		<DrawerMenu v-if="showDrawer" @close="showDrawer = false" />

		<!-- Notif Sheet -->
		<NotifSheet v-if="showNotifSheet" @close="showNotifSheet = false" />
	</ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSignalsStore, SECTORS } from '@/stores/signals'
import { useAppStore } from '@/stores/app'
import { useI18n } from '@/i18n'
import type { Signal } from '@/stores/signals'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'
import DrawerMenu from '@/components/DrawerMenu.vue'
import NotifSheet from '@/components/NotifSheet.vue'
import ChartIndex from '@/components/ChartIndex.vue'
import ChartSignalDist from '@/components/ChartSignalDist.vue'
import { useQuery } from '@urql/vue'
import { GetTopMoversDocument, GetTopMoversQuery, GetTopMoversQueryVariables, HeadlineTickersDocument, HeadlineTickersQuery, HeadlineTickersQueryVariables } from '@/generated/graphql'
import { companies } from "../assets/companies.json"

const router = useRouter()
const authStore = useAuthStore()
const sigStore = useSignalsStore()
const appStore = useAppStore()
const { t, locale } = useI18n()

const showDrawer = ref(false)
const showNotifSheet = ref(false)
const detailSignal = ref<Signal | null>(null)
const accIndex = ref(true)
const accSig = ref(false)
const accSec = ref(false)

const firstName = computed(() => authStore.user?.firstName || 'Trader')

const today = computed(() => {
	const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' }
	return new Date().toLocaleDateString(localeMap[locale.value] || 'de-DE', {
		weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
	})
})

const greeting = computed(() => {
	const h = new Date().getHours()
	return h < 12 ? t('home.greetingMorning') : h < 18 ? t('home.greetingDay') : t('home.greetingEvening')
})

const subText = computed(() => {
	const todaySignals = sigStore.signals.filter(s => s.signalDate === '2026-02-22').length
	const q4plus = sigStore.signals.filter(s => s.quality >= 4).length
	return `${todaySignals} ${t('home.newSignalsToday')} · ${sigStore.buySignals.length} ${t('home.buy')} · ${q4plus}× ${t('home.subTextSuffix')}`
})

const sectors = SECTORS

const marketItems = computed(() => [
	{ label: 'S&P 500', val: '+8.2%', up: true },
	{ label: 'NASDAQ', val: '+12.1%', up: true },
	{ label: 'DOW', val: '+6.4%', up: true },
	{ label: t('home.vixLabel'), val: '18.4', up: false, neutral: true },
	{ label: t('home.sentiment'), val: t('home.sentimentBullish'), up: true }
])

const getHeadlineTickersResult = useQuery<HeadlineTickersQuery, HeadlineTickersQueryVariables>({
	query: HeadlineTickersDocument
})

const getTopMovers = useQuery<GetTopMoversQuery, GetTopMoversQueryVariables>({
	query: GetTopMoversDocument
})

const headlineTickers = computed(() => getHeadlineTickersResult.data.value?.headlineTickers ?? [])
// map companies by symbol
const companyMap = computed(() => {
	return Object.fromEntries(
		companies.map(c => [c.symbol, c])
	)
})

// enrich movers
const topMoversEnriched = computed(() => {
	const data = getTopMovers.data.value?.topMovers ?? []

	return data.map(t => {
		const company = companyMap.value[t.id]

		return {
			...t,
			symbol: t.id,
			name: company?.name ?? t.name,
			imageUrl: company?.imageUrl ?? ''
		}
	})
})

// buy / sell
const topBuy = computed(() =>
	topMoversEnriched.value
		.filter(t => (t.snapshot?.change ?? 0) >= 0)
		.sort((a, b) => (b.snapshot?.change ?? 0) - (a.snapshot?.change ?? 0))
		.slice(0, 5)
)

const topSell = computed(() =>
	topMoversEnriched.value
		.filter(t => (t.snapshot?.change ?? 0) < 0)
		.sort((a, b) => (a.snapshot?.change ?? 0) - (b.snapshot?.change ?? 0))
		.slice(0, 5)
)

// fallback image
function imgFallback(e: Event) {
	const el = e.target as HTMLImageElement
	el.style.display = 'none'
}

function openTickerDetail(ticker: (typeof headlineTickers.value)[number]) {
	const match = sigStore.signals.find(s => s.ticker === ticker.id)
	if (match) detailSignal.value = match
}

function goSignals(type: string) {
	sigStore.filterType = type as any
	router.push('/app/signals')
}

async function doRefresh(event: any) {
	await sigStore.refresh()
	event.target.complete()
}
</script>

<style scoped>
.navbar {
	background: rgba(11, 14, 17, .94);
	border-bottom: 1px solid var(--bdr);
	padding: 0 16px;
	position: sticky;
	top: 0;
	z-index: 100;
	backdrop-filter: blur(20px);
}

.nav-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
}

.nav-logo {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.nldot {
	width: 30px;
	height: 30px;
	border-radius: 8px;
	background: var(--g);
	display: flex;
	align-items: center;
	justify-content: center;
}

.nl-text {
	font-weight: 800;
	font-size: 14px;
	letter-spacing: -.03em;
	color: var(--tx);
}

.nl-text span {
	color: var(--g);
}

.hamburger {
	background: #fff;
	border: none;
	border-radius: 8px;
	width: 34px;
	height: 34px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	cursor: pointer;
}

.hamburger span {
	width: 14px;
	height: 2px;
	background: #0b0e11;
	border-radius: 1px;
	display: block;
}

.bell-wrap {
	position: relative;
	cursor: pointer;
	background: transparent;
	border: none;
	display: flex;
	align-items: center;
	padding: 4px;
}

.bell-dot {
	position: absolute;
	top: -3px;
	right: -3px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--r);
	border: 2px solid var(--bg2);
}

.nav-ticker-row {
	padding: 4px 0 7px;
	overflow: hidden;
}

.ticker-inner {
	display: flex;
	gap: 14px;
	overflow-x: auto;
	scrollbar-width: none;
	animation: marquee 60s linear infinite;
	white-space: nowrap;
}

.tick {
	font-family: var(--mono);
	font-size: 10px;
	color: var(--mu);
	display: inline-flex;
	gap: 5px;
	align-items: center;
	flex-shrink: 0;
	padding: 6px 12px;
	border-right: 1px solid var(--bdr);
}

.tick-logo {
	width: 12px;
	height: 12px;
	object-fit: contain;
	border-radius: 2px;
}

.tick .p {
	color: var(--tx);
}

.tick.up .p {
	color: var(--g);
}

.tick.down .p {
	color: var(--r);
}

.home-hero {
	background: linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%);
	padding: 22px 16px 16px;
	position: relative;
	overflow: hidden;
}

.home-hero-bg {
	position: absolute;
	inset: 0;
	background-image: radial-gradient(circle, rgba(255, 255, 255, .025) 1px, transparent 1px);
	background-size: 28px 28px;
}

.home-hero-glow {
	position: absolute;
	top: -50px;
	left: -20px;
	width: 280px;
	height: 280px;
	background: radial-gradient(ellipse, rgba(22, 199, 132, .07), transparent 65%);
	pointer-events: none;
}

.home-hero-content {
	position: relative;
}

.home-tag {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: var(--gg);
	border: 1px solid rgba(22, 199, 132, .18);
	border-radius: 100px;
	padding: 4px 11px 4px 6px;
	margin-bottom: 14px;
}

.ldot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--g);
	animation: blink 1.8s ease infinite;
}

.home-tag span {
	font-size: 9px;
	color: var(--g);
	font-weight: 600;
	letter-spacing: .07em;
	text-transform: uppercase;
}

.home-h {
	font-size: 26px;
	font-weight: 800;
	letter-spacing: -.04em;
	line-height: 1.1;
	margin-bottom: 7px;
}

.home-h .serif {
	font-family: var(--serif);
	font-style: italic;
	color: var(--g);
	font-weight: 400;
}

.home-p {
	font-size: 12px;
	color: var(--mu);
}

.market-strip {
	background: var(--bg2);
	border-bottom: 1px solid var(--bdr);
	padding: 8px 16px;
	display: flex;
	gap: 0;
	overflow-x: auto;
	scrollbar-width: none;
}

.ms-item {
	padding: 5px 14px;
	border-right: 1px solid var(--bdr);
	text-align: center;
	flex-shrink: 0;
}

.ms-item:last-child {
	border-right: none;
}

.ms-label {
	font-size: 7px;
	text-transform: uppercase;
	letter-spacing: .1em;
	color: var(--mu2);
	font-family: var(--mono);
}

.ms-val {
	font-family: var(--mono);
	font-size: 11px;
	font-weight: 700;
}

.c-buy {
	color: var(--g);
}

.c-sell {
	color: var(--r);
}

.c-hold {
	color: var(--y);
}

.pad {
	padding: 16px 16px 0;
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

.top-signals-table {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
}

.ts-col {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	overflow: hidden;
}

.ts-col-head {
	padding: 9px 11px;
	display: flex;
	align-items: center;
	gap: 7px;
	border-bottom: 1px solid var(--bdr);
}

.ch-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.ts-col-head span {
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: .08em;
}

.ts-row {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 11px;
	border-bottom: 1px solid var(--bdr);
	cursor: pointer;
}

.ts-row:last-child {
	border-bottom: none;
}

.ts-logo {
	width: 24px;
	height: 24px;
	border-radius: 6px;
	background: var(--bg3);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	flex-shrink: 0;
}

.ts-logo img {
	width: 16px;
	height: 16px;
	object-fit: contain;
}

.ts-ticker {
	font-size: 11px;
	font-weight: 800;
}

.ts-chg {
	font-family: var(--mono);
	font-size: 10px;
	font-weight: 700;
}

.sig-count-btn {
	border-radius: 11px;
	padding: 13px 6px;
	font-weight: 700;
	font-size: 11px;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	transition: all .2s;
	border: 1.5px solid;
}

.sig-count-btn.buy {
	background: rgba(22, 199, 132, .08);
	border-color: rgba(22, 199, 132, .3);
	color: var(--g);
}

.sig-count-btn.hold {
	background: rgba(240, 185, 11, .08);
	border-color: rgba(240, 185, 11, .3);
	color: var(--y);
}

.sig-count-btn.sell {
	background: rgba(234, 57, 67, .08);
	border-color: rgba(234, 57, 67, .3);
	color: var(--r);
}

.count-num {
	font-family: var(--mono);
	font-size: 14px;
	color: var(--tx);
	font-weight: 700;
}

.acc-block {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	overflow: hidden;
	margin-bottom: 8px;
}

.acc-head {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 14px;
	cursor: pointer;
}

.acc-title {
	font-size: 12px;
	font-weight: 700;
	flex: 0 0 auto;
}

.acc-chg {
	font-family: var(--mono);
	font-size: 9px;
	flex: 1;
	text-align: right;
}

.acc-arrow {
	font-size: 10px;
	color: var(--mu);
	flex-shrink: 0;
	transition: transform .25s;
}

.acc-body {
	max-height: 600px;
	overflow: hidden;
	transition: max-height .35s;
}

.acc-body.acc-closed {
	max-height: 0;
}

.acc-body-inner {
	padding: 0 12px 12px;
}

.sector-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 7px;
}

.sector-card {
	background: var(--bg2);
	border: 1px solid var(--bdr);
	border-radius: 12px;
	padding: 11px;
	cursor: pointer;
	margin-bottom: 8px;
}

.sector-name {
	font-size: 11px;
	font-weight: 700;
	margin-bottom: 5px;
}

.sbar-bg {
	background: var(--bg);
	border-radius: 3px;
	height: 4px;
	overflow: hidden;
}

.sbar {
	height: 4px;
	border-radius: 3px;
}

.sbar.up {
	background: var(--g);
}

.sbar.down {
	background: var(--r);
}

.sector-stats {
	display: flex;
	justify-content: space-between;
	margin-top: 5px;
	font-family: var(--mono);
	font-size: 8px;
	color: var(--mu);
}
</style>