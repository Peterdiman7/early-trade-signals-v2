<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="pad">
				<div class="sec-head" style="margin-top:16px">
					<span class="sec-title">
						<span class="live-dot-sm"></span>
						{{ t('signals.title') }}
					</span>
					<span class="badge-sm">{{ nowStr }}</span>
				</div>

				<div class="ubar">{{ t('signals.lastUpdate') }}: {{ nowStr }} · {{ t('signals.autoUpdate') }}</div>

				<!-- Tabs -->
				<div class="tabs" style="margin-bottom:14px">
					<button :class="['tab buy', { on: sigStore.filterType === 'buy' }]"
						@click="sigStore.filterType = 'buy'">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="2.5" stroke-linecap="round">
							<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
							<polyline points="17 6 23 6 23 12" />
						</svg>
						{{ t('signals.buyTab') }} <span class="ct">{{ sigStore.buySignals.length }}</span>
					</button>
					<button :class="['tab hold', { on: sigStore.filterType === 'hold' }]"
						@click="sigStore.filterType = 'hold'">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="2.5" stroke-linecap="round">
							<circle cx="12" cy="12" r="10" />
							<line x1="10" y1="15" x2="10" y2="9" />
							<line x1="14" y1="15" x2="14" y2="9" />
						</svg>
						{{ t('signals.holdTab') }} <span class="ct">{{ sigStore.holdSignals.length }}</span>
					</button>
					<button :class="['tab sell', { on: sigStore.filterType === 'sell' }]"
						@click="sigStore.filterType = 'sell'">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="2.5" stroke-linecap="round">
							<polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
							<polyline points="17 18 23 18 23 12" />
						</svg>
						{{ t('signals.sellTab') }} <span class="ct">{{ sigStore.sellSignals.length }}</span>
					</button>
				</div>

				<!-- Filters -->
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
					<!-- Duration -->
					<div style="position:relative">
						<button :class="['fdd-btn', { active: sigStore.filterDuration !== 'all', open: durOpen }]"
							@click="durOpen = !durOpen; qualOpen = false">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.5" stroke-linecap="round">
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
							<span>{{ durLabel }}</span>
							<svg class="fdd-caret" width="10" height="10" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>
						<div :class="['fdd-menu', { open: durOpen }]">
							<div v-for="o in durOptions" :key="o.value"
								:class="['fdd-item', { on: sigStore.filterDuration === o.value }]"
								@click="sigStore.filterDuration = o.value as any; durOpen = false">{{ o.label }}</div>
						</div>
					</div>
					<!-- Quality -->
					<div style="position:relative">
						<button :class="['fdd-btn', { active: sigStore.filterQuality > 0, open: qualOpen }]"
							@click="qualOpen = !qualOpen; durOpen = false">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.5" stroke-linecap="round">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
							<span>{{ qualLabel }}</span>
							<svg class="fdd-caret" width="10" height="10" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>
						<div :class="['fdd-menu', { open: qualOpen }]">
							<div v-for="o in qualOptions" :key="o.value"
								:class="['fdd-item', { on: sigStore.filterQuality === o.value }]"
								@click="sigStore.filterQuality = o.value; qualOpen = false">{{ o.label }}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Signal cards -->
			<div style="padding:0 16px 80px">
				<div v-if="sigStore.loading" style="text-align:center;padding:48px;color:var(--mu)">
					<span class="loader"></span>
				</div>
				<template v-else>
					<SignalCard v-for="s in filtered" :key="s.id" :signal="s" @click="selected = s" />
					<div v-if="filtered.length === 0" style="text-align:center;padding:48px 24px;color:var(--mu)">
						<div style="font-size:13px;font-weight:700;margin-bottom:4px">{{ t('signals.noSignals') }}</div>
						<div style="font-size:11px">{{ t('signals.noSignalsHint') }}</div>
					</div>
				</template>
			</div>

			<SignalDetailSheet v-if="selected" :signal="selected" @close="selected = null" />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useSignalsStore } from '@/stores/signals'
import { useI18n } from '@/i18n'
import type { Signal } from '@/stores/signals'
import SignalCard from '@/components/SignalCard.vue'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'

const sigStore = useSignalsStore()
const { t, locale } = useI18n()
const selected = ref<Signal | null>(null)
const durOpen = ref(false)
const qualOpen = ref(false)

const nowStr = computed(() => {
	const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' }
	return new Date().toLocaleString(localeMap[locale.value] || 'de-DE', {
		day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
	})
})

const filtered = computed(() => sigStore.filteredSignals)

const durOptions = computed(() => [
	{ value: 'all', label: t('signals.allHorizons') },
	{ value: 'intraday', label: t('signals.intraday') },
	{ value: 'short', label: t('signals.short') },
	{ value: 'medium', label: t('signals.medium') },
	{ value: 'long', label: t('signals.long') },
])

const qualOptions = computed(() => [
	{ value: 0, label: t('signals.allQualities') },
	{ value: 5, label: t('signals.q5') },
	{ value: 4, label: t('signals.q4') },
	{ value: 3, label: t('signals.q3') },
])

const durLabel = computed(() => durOptions.value.find(o => o.value === sigStore.filterDuration)?.label || t('signals.allHorizons'))
const qualLabel = computed(() => qualOptions.value.find(o => o.value === sigStore.filterQuality)?.label || t('signals.allQualities'))
</script>

<style scoped>
.pad { padding: 16px 16px 0; }
.sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sec-title { font-size: 17px; font-weight: 800; letter-spacing: -.03em; display: flex; align-items: center; gap: 6px; }
.live-dot-sm { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--g); animation: blink 1.8s ease infinite; }
.badge-sm { font-family: var(--mono); font-size: 9px; color: var(--mu); background: var(--bg3); border: 1px solid var(--bdr); border-radius: 5px; padding: 2px 7px; }
.ubar { font-family: var(--mono); font-size: 9px; color: var(--mu2); text-align: center; padding: 5px 10px; background: var(--bg3); border-radius: 7px; margin-bottom: 10px; border: 1px solid var(--bdr); }
.tabs { display: flex; gap: 3px; background: var(--bg3); border-radius: 11px; padding: 3px; border: 1px solid var(--bdr); }
.tab { flex: 1; padding: 8px; border: none; border-radius: 8px; background: transparent; color: var(--mu); font-weight: 700; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; }
.tab.on.buy { background: var(--g); color: #000; }
.tab.on.hold { background: var(--y); color: #000; }
.tab.on.sell { background: var(--r); color: #fff; }
.ct { font-family: var(--mono); font-size: 9px; opacity: .75; }
.fdd-btn { width: 100%; background: var(--bg3); border: 1px solid var(--bdr); border-radius: 10px; padding: 9px 11px; color: var(--tx); font-size: 11px; font-weight: 600; font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 6px; text-align: left; }
.fdd-btn.active { border-color: var(--g); color: var(--g); }
.fdd-caret { flex-shrink: 0; color: var(--mu); }
.fdd-menu { position: absolute; top: calc(100% + 5px); left: 0; right: 0; background: var(--bg2); border: 1px solid var(--bdr2); border-radius: 11px; padding: 5px; z-index: 200; display: none; box-shadow: 0 8px 32px rgba(0,0,0,.5); }
.fdd-menu.open { display: block; }
.fdd-item { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; color: var(--mu); cursor: pointer; }
.fdd-item:hover { background: var(--bg3); color: var(--tx); }
.fdd-item.on { background: rgba(22,199,132,.1); color: var(--g); }
</style>
