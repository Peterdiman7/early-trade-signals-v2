<template>
  <div class="detail-overlay">
    <div id="detail-page" style="display:block">
      <!-- Header -->
      <div class="detail-hdr">
        <div class="back-btn" @click="$emit('close')">←</div>
        <div class="dh-logo">
          <img v-if="logo && !fbLogo" :src="logo" @error="fbLogo = true" alt="" />
          <span v-else style="font-size:10px;font-weight:800;color:var(--mu)">{{ signal.ticker.slice(0,4) }}</span>
        </div>
        <div class="dh-title">
          <div class="dh-ticker">{{ signal.ticker }}</div>
          <div class="dh-name">{{ signal.name }}</div>
        </div>
        <div :class="['d-badge', signal.type]">{{ signal.type.toUpperCase() }}</div>
      </div>

      <!-- WL Banner -->
      <div :class="['wl-banner', { saved: inWl }]">
        <div>
          <div class="wl-banner-text">{{ inWl ? '✓ In deiner Watchlist' : '📌 Zur Watchlist hinzufügen' }}</div>
          <div class="wl-banner-sub">{{ inWl ? 'Performance wird verfolgt — klicken zum Entfernen' : 'Kursveränderung & Haltedauer verfolgen' }}</div>
        </div>
        <button :class="['wl-banner-btn', { saved: inWl }]" @click="wlStore.toggle(signal.ticker)">
          {{ inWl ? 'Entfernen' : '+ Watchlist' }}
        </button>
      </div>

      <div class="detail-body">
        <!-- Price hero -->
        <div class="price-hero">
          <div class="ph-main">
            <div class="ph-price">${{ signal.price.toFixed(2) }}</div>
            <div :class="['ph-change', signal.change >= 0 ? 'up' : 'down']">
              {{ signal.change >= 0 ? '+' : '' }}{{ signal.change }}%
            </div>
          </div>
          <div class="ph-since">
            Seit Signal {{ signal.signalDate }} (${{ signal.signalPrice }}):
            <strong :style="{ color: sigUp ? 'var(--g)' : 'var(--r)' }">
              {{ sigUp ? '+' : '' }}{{ sigChg }}%
            </strong>
            — ${{ Math.abs(signal.price - signal.signalPrice).toFixed(2) }} {{ sigUp ? 'Gewinn' : 'Verlust' }}
          </div>
        </div>

        <!-- Tabs -->
        <div class="d-tabs">
          <button :class="['d-tab', { on: tab === 'overview' }]" @click="tab = 'overview'">Übersicht</button>
          <button :class="['d-tab', { on: tab === 'analysis' }]" @click="tab = 'analysis'">Analyse & News</button>
          <button :class="['d-tab', { on: tab === 'backtrack' }]" @click="tab = 'backtrack'">Performance</button>
        </div>

        <!-- Overview -->
        <div v-if="tab === 'overview'">
          <div class="info-grid">
            <div class="i-cell"><label>Signal-Datum</label><div class="v">{{ signal.signalDate }}</div></div>
            <div class="i-cell"><label>Signalstärke</label><div class="v" :style="{ color: signal.strength === 'Strong' ? 'var(--g)' : signal.strength === 'Moderate' ? 'var(--y)' : 'var(--r)' }">{{ signal.strength }}</div></div>
            <div class="i-cell"><label>Qualität</label><div class="v" :style="{ color: signal.quality >= 4 ? 'var(--g)' : signal.quality >= 3 ? 'var(--y)' : 'var(--r)' }">Q{{ signal.quality }}/5</div></div>
            <div class="i-cell"><label>Horizont</label><div class="v"><span :class="['dur-badge', signal.duration]">{{ durLabels[signal.duration] }}</span></div></div>
            <div class="i-cell"><label>Sektor</label><div class="v">{{ signal.sector }}</div></div>
            <div class="i-cell"><label>Signal-Zeit</label><div class="v">{{ signal.signalTime }}</div></div>
          </div>

          <!-- Signal History -->
          <div class="hist-box">
            <div class="ab-title" style="margin-bottom:9px">Signal-Historie</div>
            <div v-for="(h, i) in histItems" :key="i" class="hist-item">
              <div :class="['hist-dot', h.type]"></div>
              <div class="hist-info">
                <div class="hist-date">{{ h.date }}</div>
                <div :class="['hist-type', h.type]">{{ h.type.toUpperCase() }}-Signal</div>
              </div>
              <div class="hist-right">
                <div class="hist-price">${{ h.price }}</div>
                <div :class="['hist-perf', h.perf >= 0 ? 'up' : 'down']">{{ h.perf >= 0 ? '+' : '' }}{{ h.perf }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analysis -->
        <div v-else-if="tab === 'analysis'">
          <div class="analysis-box">
            <div class="ab-title">Unternehmensanalyse</div>
            <div class="ab-text">{{ analysis }}</div>
          </div>
          <div class="news-box">
            <div class="ab-title">News-Sentiment</div>
            <div class="news-counts">
              <div class="nc-item"><div class="nc-num pos">{{ news.filter(n=>n.s==='pos').length }}</div><div class="nc-lbl">Positiv</div></div>
              <div class="nc-item"><div class="nc-num neg">{{ news.filter(n=>n.s==='neg').length }}</div><div class="nc-lbl">Negativ</div></div>
              <div class="nc-item"><div class="nc-num neu">{{ news.filter(n=>n.s==='neu').length }}</div><div class="nc-lbl">Neutral</div></div>
            </div>
            <div class="nm-bar">
              <div class="nm-seg pos" :style="{ width: (news.filter(n=>n.s==='pos').length/news.length*100) + '%' }"></div>
              <div class="nm-seg neg" :style="{ width: (news.filter(n=>n.s==='neg').length/news.length*100) + '%' }"></div>
              <div class="nm-seg neu" :style="{ width: (news.filter(n=>n.s==='neu').length/news.length*100) + '%' }"></div>
            </div>
            <div class="news-list">
              <div v-for="(n, i) in news" :key="i" class="news-item">
                <div :class="['news-dot', n.s]"></div>
                <div class="news-text">
                  <strong>{{ n.headline }}</strong>
                  {{ n.impact }}<span style="font-size:8px;color:var(--mu2)"> · {{ n.age }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Backtracking -->
        <div v-else>
          <div class="bt-box">
            <div class="ab-title">Signal Backtracking</div>
            <div class="bt-summary">
              <div class="bts-i"><label>Gesamtrendite</label><div class="v" style="color:var(--g)">+{{ totalReturn.toFixed(1) }}%</div></div>
              <div class="bts-i"><label>Win Rate</label><div class="v">{{ winRate }}%</div></div>
              <div class="bts-i"><label>Trades</label><div class="v">{{ trades.length }}</div></div>
              <div class="bts-i"><label>Zeitraum</label><div class="v" style="font-size:10px">6 Monate</div></div>
            </div>
            <div v-for="(t, i) in trades" :key="i" class="bt-trade">
              <span :class="['type', t.type]">{{ t.type.toUpperCase() }}</span>
              <span class="dates">Ein: ${{ t.entry.toFixed(2) }} → Aus: ${{ t.exit.toFixed(2) }}<br>{{ t.entryD }} → {{ t.exitD }}</span>
              <span :class="['perf', t.pct >= 0 ? 'up' : 'down']">{{ t.pct >= 0 ? '+' : '' }}{{ t.pct.toFixed(1) }}%</span>
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

const props = defineProps<{ signal: Signal }>()
defineEmits(['close'])

const wlStore = useWatchlistStore()
const tab = ref('overview')
const fbLogo = ref(false)

const logo = computed(() => LOGOS[props.signal.ticker] || '')
const inWl = computed(() => wlStore.isInWatchlist(props.signal.ticker))
const sigChg = computed(() => ((props.signal.price - props.signal.signalPrice) / props.signal.signalPrice * 100).toFixed(2))
const sigUp = computed(() => parseFloat(sigChg.value) >= 0)

const durLabels: Record<string, string> = { intraday: '⚡ Intraday', short: '📅 Kurzfristig', medium: '📆 Mittelfristig', long: '🏔️ Langfristig' }

const histItems = [
  { date: 'Feb 22, 2026 09:58', type: props.signal.type, price: props.signal.price.toFixed(2), perf: props.signal.change },
  { date: 'Feb 15, 2026 10:12', type: 'hold', price: (props.signal.price * .98).toFixed(2), perf: 0.83 },
  { date: 'Feb 01, 2026 09:45', type: 'buy', price: (props.signal.price * .95).toFixed(2), perf: 3.21 },
  { date: 'Jan 18, 2026 11:03', type: 'sell', price: (props.signal.price * .92).toFixed(2), perf: -1.44 },
  { date: 'Jan 05, 2026 09:30', type: 'buy', price: (props.signal.price * .88).toFixed(2), perf: 4.72 }
]

const ANALYSIS_MAP: Record<string, string> = {
  AAPL: 'Apple Inc. bleibt strukturell stark. Services-Sparte wächst zweistellig. Apple Intelligence und Vision Pro als neue Wachstumstreiber. KGV ~28x im fairen Bereich.',
  NVDA: 'Dominiert den KI-Chip-Markt mit 70%+ Marktanteil. Außergewöhnliche Blackwell-Nachfrage. Hohe Bewertung durch massives Wachstum gerechtfertigt.',
  AMD: 'Schwächeres Servergeschäft. MI-Chips gewinnen im KI-Markt zu langsam. Technisch in Abwärtskorrektur. Sell-Signal durch JPMorgan Downgrade bestätigt.',
  DEFAULT: 'Signalstärke basiert auf Kombination aus technischer Analyse, Fundamentaldaten und Sentiment. Im Kontext des eigenen Risikoprofils bewerten.'
}
const analysis = computed(() => ANALYSIS_MAP[props.signal.ticker] || ANALYSIS_MAP.DEFAULT)

const NEWS_MAP: Record<string, any[]> = {
  AAPL: [
    { s: 'pos', headline: 'Apple Intelligence übertrifft iPhone 17 Vorbestellungen', age: '2h', impact: 'Positiv — Nachfrage' },
    { s: 'pos', headline: 'Goldman Sachs erhöht Kursziel auf $310', age: '5h', impact: 'Positiv — Upgrade' },
    { s: 'neg', headline: 'EU-Kartellbehörde untersucht App Store', age: '2d', impact: 'Negativ — Regulierung' },
    { s: 'neu', headline: 'Apple kündigt WWDC 2026 an', age: '12h', impact: 'Neutral' }
  ],
  AMD: [
    { s: 'neg', headline: 'AMD Q4 verfehlt Konsensus', age: '1d', impact: 'Negativ' },
    { s: 'neg', headline: 'JPMorgan stuft auf Underweight herunter', age: '3d', impact: 'Negativ — Downgrade' },
    { s: 'pos', headline: 'PC-Markt Erholung begünstigt Ryzen', age: '3d', impact: 'Positiv' },
    { s: 'neu', headline: 'MI350 für H2 2026 angekündigt', age: '2d', impact: 'Neutral' }
  ]
}
const news = computed(() => NEWS_MAP[props.signal.ticker] || [
  { s: 'pos', headline: 'Starke Quartalszahlen übertreffen Erwartungen', age: '1d', impact: 'Positiv' },
  { s: 'pos', headline: 'Neues Produkt erhält positive Reaktion', age: '2d', impact: 'Positiv' },
  { s: 'neu', headline: 'Management hält an Jahresprognose fest', age: '2d', impact: 'Neutral' },
  { s: 'neg', headline: 'Margendruck durch steigende Kosten', age: '3d', impact: 'Negativ' }
])

const trades = computed(() => [
  { type: 'buy', entry: props.signal.signalPrice * .82, exit: props.signal.signalPrice * .91, entryD: '2025-10-01', exitD: '2025-10-18', pct: 10.9 },
  { type: 'sell', entry: props.signal.signalPrice * .93, exit: props.signal.signalPrice * .89, entryD: '2025-10-22', exitD: '2025-11-05', pct: 4.3 },
  { type: 'buy', entry: props.signal.signalPrice * .88, exit: props.signal.signalPrice * .96, entryD: '2025-11-10', exitD: '2025-11-28', pct: 9.1 },
  { type: 'hold', entry: props.signal.signalPrice * .95, exit: props.signal.signalPrice * .97, entryD: '2025-12-01', exitD: '2025-12-15', pct: 2.1 },
  { type: 'buy', entry: props.signal.signalPrice * .96, exit: props.signal.price, entryD: '2025-12-20', exitD: '2026-02-22', pct: ((props.signal.price - props.signal.signalPrice * .96) / (props.signal.signalPrice * .96) * 100) }
])
const totalReturn = computed(() => trades.value.reduce((a, t) => a + t.pct, 0))
const winRate = computed(() => Math.round(trades.value.filter(t => t.pct > 0).length / trades.value.length * 100))
</script>

<style scoped>
.detail-overlay {
  position: fixed; inset: 0; z-index: 200; overflow-y: auto;
  background: var(--bg);
}
#detail-page { min-height: 100vh; }

.detail-hdr {
  padding: 12px 16px; display: flex; align-items: center; gap: 9px;
  border-bottom: 1px solid var(--bdr); position: sticky; top: 0;
  background: rgba(11,14,17,.96); backdrop-filter: blur(16px); z-index: 10;
}
.back-btn {
  width: 32px; height: 32px; border-radius: 8px; background: var(--bg3);
  border: 1px solid var(--bdr); display: flex; align-items: center;
  justify-content: center; cursor: pointer; font-size: 15px; flex-shrink: 0; color: var(--tx);
}
.dh-logo {
  width: 36px; height: 36px; border-radius: 9px; background: var(--bg3);
  border: 1px solid var(--bdr); display: flex; align-items: center;
  justify-content: center; overflow: hidden; flex-shrink: 0;
}
.dh-logo img { width: 24px; height: 24px; object-fit: contain; }
.dh-title { flex: 1; }
.dh-ticker { font-size: 19px; font-weight: 800; letter-spacing: -.03em; }
.dh-name { font-size: 10px; color: var(--mu); }
.d-badge { padding: 4px 10px; border-radius: 7px; font-weight: 700; font-size: 9px; flex-shrink: 0; }
.d-badge.buy { background: rgba(22,199,132,.12); color: var(--g); }
.d-badge.hold { background: rgba(240,185,11,.12); color: var(--y); }
.d-badge.sell { background: rgba(234,57,67,.12); color: var(--r); }

/* WL Banner */
.wl-banner {
  margin: 12px 14px 0; background: rgba(79,142,247,.07); border: 1px solid rgba(79,142,247,.25);
  border-radius: 12px; padding: 11px 14px; display: flex; align-items: center;
  justify-content: space-between; gap: 10px;
}
.wl-banner.saved { background: rgba(22,199,132,.06); border-color: rgba(22,199,132,.2); }
.wl-banner-text { font-size: 12px; color: var(--tx); font-weight: 600; }
.wl-banner-sub { font-size: 10px; color: var(--mu); margin-top: 1px; }
.wl-banner-btn {
  background: var(--b); border: none; border-radius: 9px; padding: 8px 14px;
  color: #fff; font-weight: 700; font-size: 11px; cursor: pointer; white-space: nowrap; flex-shrink: 0;
}
.wl-banner-btn.saved { background: rgba(22,199,132,.15); color: var(--g); border: 1px solid rgba(22,199,132,.3); }

.detail-body { padding: 14px 14px 60px; }

/* Price */
.price-hero { margin-bottom: 14px; }
.ph-main { display: flex; align-items: flex-end; gap: 9px; margin-bottom: 3px; }
.ph-price { font-family: var(--mono); font-size: 34px; font-weight: 700; }
.ph-change { font-family: var(--mono); font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
.ph-change.up { background: rgba(22,199,132,.12); color: var(--g); }
.ph-change.down { background: rgba(234,57,67,.12); color: var(--r); }
.ph-since { font-family: var(--mono); font-size: 10px; color: var(--mu); margin-top: 3px; }

/* Tabs */
.d-tabs { display: flex; gap: 3px; background: var(--bg3); border-radius: 9px; padding: 3px; margin-bottom: 14px; border: 1px solid var(--bdr); }
.d-tab { flex: 1; padding: 7px; border: none; border-radius: 7px; background: transparent; color: var(--mu); font-weight: 600; font-size: 10px; cursor: pointer; }
.d-tab.on { background: var(--bg4); color: var(--tx); }

/* Info grid */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 13px; }
.i-cell { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 10px; padding: 10px; }
.i-cell label { font-size: 7px; text-transform: uppercase; letter-spacing: .12em; color: var(--mu2); display: block; margin-bottom: 2px; }
.i-cell .v { font-family: var(--mono); font-size: 13px; font-weight: 700; }

/* History */
.hist-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; margin-bottom: 12px; }
.ab-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--mu); margin-bottom: 9px; }
.hist-item { display: flex; align-items: center; gap: 9px; padding: 9px 0; border-bottom: 1px solid var(--bdr); }
.hist-item:last-child { border-bottom: none; }
.hist-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.hist-dot.buy { background: var(--g); }
.hist-dot.hold { background: var(--y); }
.hist-dot.sell { background: var(--r); }
.hist-info { flex: 1; }
.hist-date { font-family: var(--mono); font-size: 8px; color: var(--mu); }
.hist-type { font-size: 11px; font-weight: 700; }
.hist-type.buy { color: var(--g); }
.hist-type.hold { color: var(--y); }
.hist-type.sell { color: var(--r); }
.hist-right { text-align: right; }
.hist-price { font-family: var(--mono); font-size: 11px; font-weight: 700; }
.hist-perf { font-family: var(--mono); font-size: 9px; }
.hist-perf.up { color: var(--g); }
.hist-perf.down { color: var(--r); }

/* Analysis */
.analysis-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; margin-bottom: 12px; }
.ab-text { font-size: 12px; line-height: 1.72; color: rgba(232,237,242,.75); }

/* News */
.news-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; margin-bottom: 12px; }
.news-counts { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-bottom: 9px; }
.nc-item { background: var(--bg); border-radius: 8px; padding: 8px; text-align: center; border: 1px solid var(--bdr); }
.nc-num { font-family: var(--mono); font-size: 18px; font-weight: 700; }
.nc-num.pos { color: var(--g); }
.nc-num.neg { color: var(--r); }
.nc-num.neu { color: var(--mu); }
.nc-lbl { font-size: 8px; text-transform: uppercase; letter-spacing: .08em; color: var(--mu2); margin-top: 2px; }
.nm-bar { height: 6px; border-radius: 3px; overflow: hidden; background: var(--bg); display: flex; margin-bottom: 9px; }
.nm-seg { height: 100%; }
.nm-seg.pos { background: var(--g); }
.nm-seg.neg { background: var(--r); }
.nm-seg.neu { background: var(--mu2); }
.news-list { display: flex; flex-direction: column; gap: 6px; }
.news-item { display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: var(--bg); border-radius: 8px; border: 1px solid var(--bdr); }
.news-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.news-dot.pos { background: var(--g); }
.news-dot.neg { background: var(--r); }
.news-dot.neu { background: var(--mu2); }
.news-text { font-size: 10px; color: var(--mu); line-height: 1.5; }
.news-text strong { color: var(--tx); font-size: 11px; display: block; margin-bottom: 1px; }

/* Backtracking */
.bt-box { background: var(--bg2); border: 1px solid var(--bdr); border-radius: 13px; padding: 13px; }
.bt-summary { display: grid; grid-template-columns: repeat(2,1fr); gap: 6px; margin-bottom: 11px; }
.bts-i { background: var(--bg); border-radius: 8px; padding: 9px; border: 1px solid var(--bdr); }
.bts-i label { font-size: 7px; text-transform: uppercase; letter-spacing: .1em; color: var(--mu2); display: block; margin-bottom: 2px; }
.bts-i .v { font-family: var(--mono); font-size: 14px; font-weight: 700; }
.bt-trade {
  display: flex; align-items: center; gap: 7px; padding: 8px; background: var(--bg);
  border-radius: 8px; font-size: 10px; border: 1px solid var(--bdr); margin-bottom: 5px;
}
.bt-trade .type { font-weight: 700; min-width: 32px; font-size: 9px; }
.bt-trade .type.buy { color: var(--g); }
.bt-trade .type.sell { color: var(--r); }
.bt-trade .type.hold { color: var(--y); }
.bt-trade .dates { color: var(--mu2); flex: 1; font-family: var(--mono); font-size: 8px; }
.bt-trade .perf { font-family: var(--mono); font-weight: 700; font-size: 10px; margin-left: auto; }
.bt-trade .perf.up { color: var(--g); }
.bt-trade .perf.down { color: var(--r); }
</style>
