<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="pad">
        <div class="sec-head" style="margin-top:16px">
          <span class="sec-title">📉 Marktanalyse</span>
          <span class="badge-sm">{{ nowStr }}</span>
        </div>

        <!-- Signal distribution -->
        <div class="ma-section">
          <div class="ma-title">Signal-Verteilung (30 Tage)</div>
          <div class="ma-box">
            <div class="sig-dist">
              <div class="sd-bar">
                <div class="sd-seg buy" :style="{ width: buyPct + '%' }"></div>
                <div class="sd-seg hold" :style="{ width: holdPct + '%' }"></div>
                <div class="sd-seg sell" :style="{ width: sellPct + '%' }"></div>
              </div>
              <div class="sd-legend">
                <span><span class="dot" style="background:var(--g)"></span>BUY {{ buyPct.toFixed(0) }}%</span>
                <span><span class="dot" style="background:var(--y)"></span>HOLD {{ holdPct.toFixed(0) }}%</span>
                <span><span class="dot" style="background:var(--r)"></span>SELL {{ sellPct.toFixed(0) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sectors -->
        <div class="ma-section">
          <div class="ma-title">Sektoren — klickbar für Details</div>
          <div class="sector-grid">
            <div v-for="sec in sectors" :key="sec.name" class="sector-card"
                 @click="activeSector = activeSector === sec.name ? null : sec.name">
              <div class="sector-name">{{ sec.name }}</div>
              <div class="sbar-bg"><div :class="['sbar', sec.change >= 0 ? 'up' : 'down']" :style="{ width: sec.perc + '%' }"></div></div>
              <div class="sector-stats">
                <span>{{ sec.perc }}% bullish</span>
                <span :style="{ color: sec.change >= 0 ? 'var(--g)' : 'var(--r)' }">{{ sec.change >= 0 ? '+' : '' }}{{ sec.change }}%</span>
              </div>
            </div>
          </div>

          <!-- Sector detail -->
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

        <!-- Index performance table -->
        <div class="ma-section">
          <div class="ma-title">Index-Performance % (6M)</div>
          <div class="ma-box">
            <div class="index-table">
              <div v-for="idx in indices" :key="idx.name" class="idx-row">
                <span class="idx-name">{{ idx.name }}</span>
                <div class="idx-bar-wrap">
                  <div class="idx-bar" :style="{ width: Math.abs(idx.change) * 5 + '%', background: idx.change >= 0 ? 'var(--g)' : 'var(--r)' }"></div>
                </div>
                <span class="idx-val" :style="{ color: idx.change >= 0 ? 'var(--g)' : 'var(--r)' }">{{ idx.change >= 0 ? '+' : '' }}{{ idx.change }}%</span>
              </div>
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
import type { Signal } from '@/stores/signals'
import SignalCard from '@/components/SignalCard.vue'
import SignalDetailSheet from '@/components/SignalDetailSheet.vue'

const sigStore = useSignalsStore()
const activeSector = ref<string | null>(null)
const selected = ref<Signal | null>(null)
const sectors = SECTORS

const nowStr = computed(() => new Date().toLocaleString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }))

const total = computed(() => sigStore.signals.length)
const buyPct = computed(() => sigStore.buySignals.length / total.value * 100)
const holdPct = computed(() => sigStore.holdSignals.length / total.value * 100)
const sellPct = computed(() => sigStore.sellSignals.length / total.value * 100)

const sectorSignals = computed(() => {
  if (!activeSector.value) return []
  return sigStore.signals.filter(s => s.sector === activeSector.value)
})

const indices = [
  { name: 'S&P 500', change: 8.2 },
  { name: 'NASDAQ', change: 12.1 },
  { name: 'DOW', change: 6.4 },
  { name: 'DAX', change: 5.8 },
  { name: 'FTSE 100', change: 3.2 },
  { name: 'Nikkei 225', change: 9.7 }
]
</script>

<style scoped>
.pad { padding: 16px 16px 80px; }
.sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sec-title { font-size: 17px; font-weight: 800; letter-spacing: -.03em; }
.badge-sm { font-family: var(--mono); font-size: 9px; color: var(--mu); background: var(--bg3); border: 1px solid var(--bdr); border-radius: 5px; padding: 2px 7px; }
.ma-section { margin-bottom: 18px; }
.ma-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--mu); margin-bottom: 9px; padding-left: 8px; border-left: 2px solid var(--g); }
.ma-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; }

.sig-dist {}
.sd-bar { height: 8px; border-radius: 4px; overflow: hidden; display: flex; margin-bottom: 10px; }
.sd-seg { height: 100%; transition: width .8s; }
.sd-seg.buy { background: var(--g); }
.sd-seg.hold { background: var(--y); }
.sd-seg.sell { background: var(--r); }
.sd-legend { display: flex; gap: 16px; font-family: var(--mono); font-size: 11px; color: var(--mu); }
.sd-legend span { display: flex; align-items: center; gap: 5px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

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

.index-table { display: flex; flex-direction: column; gap: 10px; }
.idx-row { display: flex; align-items: center; gap: 10px; }
.idx-name { font-size: 12px; font-weight: 600; width: 90px; flex-shrink: 0; }
.idx-bar-wrap { flex: 1; background: var(--bg); border-radius: 3px; height: 6px; overflow: hidden; }
.idx-bar { height: 100%; border-radius: 3px; transition: width .8s; }
.idx-val { font-family: var(--mono); font-size: 11px; font-weight: 700; width: 52px; text-align: right; flex-shrink: 0; }
</style>
