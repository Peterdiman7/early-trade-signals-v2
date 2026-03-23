<!-- MarketView.vue -->
<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="pad">
				<div class="sec-head" style="margin-top:16px">
					<span class="sec-title">📉 {{ t('market.title') }}</span>
					<span class="badge-sm">{{ nowStr }}</span>
				</div>

				<div class="ma-section">
					<div class="ma-title">{{ t('market.indexPerf') }}</div>
					<div class="ma-box">
						<ChartIndex :height="180" />
					</div>
				</div>

				<div class="ma-section">
					<div class="ma-title">{{ t('market.signalDist') }}</div>
					<div class="ma-box">
						<ChartSignalDist :height="180" />
					</div>
				</div>

				<div class="ma-section">
					<div class="ma-title">{{ t('market.sectors') }}</div>
					<div class="sector-grid">
						<div v-for="sec in sectors" :key="sec.name" class="sector-card"
							@click="activeSector = activeSector === sec.name ? null : sec.name">
							<div class="sector-name">{{ sec.name }}</div>
							<div class="sbar-bg">
								<div :class="['sbar', sec.change >= 0 ? 'up' : 'down']"
									:style="{ width: sec.perc + '%' }"></div>
							</div>
							<div class="sector-stats">
								<span>{{ sec.perc }}% {{ t('market.bullish') }}</span>
								<span :style="{ color: sec.change >= 0 ? 'var(--g)' : 'var(--r)' }">{{ sec.change >= 0 ? '+' : '' }}{{ sec.change }}%</span>
							</div>
						</div>
					</div>
					<div v-if="activeSector" class="sector-detail">
						<div class="sd-head">
							<span class="sd-title">{{ activeSector }}</span>
							<button class="sd-close" @click="activeSector = null">✕</button>
						</div>
						<div v-for="s in sectorSignals" :key="s.id" style="margin-bottom:8px">
							<SignalCard :signal="s" @click="selected = s" />
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
import { useSignalsStore, SECTORS } from '@/stores/signals'
import { useI18n } from '@/i18n'
import type { Signal } from '@/stores/signals'
import SignalCard from '@/components/SignalCard.vue'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'
import ChartIndex from '@/components/ChartIndex.vue'
import ChartSignalDist from '@/components/ChartSignalDist.vue'

const sigStore = useSignalsStore()
const { t, locale } = useI18n()
const activeSector = ref<string | null>(null)
const selected = ref<Signal | null>(null)
const sectors = SECTORS

const nowStr = computed(() => {
	const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' }
	return new Date().toLocaleString(localeMap[locale.value] || 'de-DE', {
		day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
	})
})

const sectorSignals = computed(() => activeSector.value ? sigStore.signals.filter(s => s.sector === activeSector.value) : [])
</script>

<style scoped>
.pad { padding: 16px 16px 80px; }
.sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sec-title { font-size: 17px; font-weight: 800; letter-spacing: -.03em; }
.badge-sm { font-family: var(--mono); font-size: 9px; color: var(--mu); background: var(--bg3); border: 1px solid var(--bdr); border-radius: 5px; padding: 2px 7px; }
.ma-section { margin-bottom: 18px; }
.ma-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--mu); margin-bottom: 9px; padding-left: 8px; border-left: 2px solid var(--g); }
.ma-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; }
.sector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.sector-card { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 12px; padding: 11px; cursor: pointer; transition: all .2s; }
.sector-card:hover { border-color: var(--bdr2); }
.sector-name { font-size: 11px; font-weight: 700; margin-bottom: 5px; }
.sbar-bg { background: var(--bg); border-radius: 3px; height: 4px; overflow: hidden; }
.sbar { height: 4px; border-radius: 3px; }
.sbar.up { background: var(--g); }
.sbar.down { background: var(--r); }
.sector-stats { display: flex; justify-content: space-between; margin-top: 5px; font-family: var(--mono); font-size: 8px; color: var(--mu); }
.sector-detail { background: var(--bg2); border: 1px solid var(--bdr2); border-radius: 13px; padding: 13px; margin-top: 12px; }
.sd-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sd-title { font-size: 16px; font-weight: 800; }
.sd-close { background: var(--bg3); border: 1px solid var(--bdr); border-radius: 8px; width: 28px; height: 28px; cursor: pointer; color: var(--mu); font-size: 14px; display: flex; align-items: center; justify-content: center; }
</style>
