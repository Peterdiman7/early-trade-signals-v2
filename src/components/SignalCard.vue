<template>
  <div :class="['s-card', signal.type]" @click="$emit('click')">
    <!-- ROW 1 -->
    <div class="sc-row1">
      <div class="sc-left">
        <div class="sc-logo">
          <img v-if="logoUrl" :src="logoUrl" @error="showFb = true" alt="" :style="showFb ? 'display:none' : ''" />
          <span v-if="!logoUrl || showFb" class="sc-logo-fb">{{ signal.ticker.slice(0,4) }}</span>
        </div>
        <div>
          <div class="sc-ticker">{{ signal.ticker }}</div>
          <div class="sc-name">{{ signal.name }}</div>
        </div>
      </div>
      <div class="sc-right">
        <!-- Bell -->
        <button :class="['sc-icon-btn', { subscribed: notifStore.isSubscribed(signal.ticker) }]"
                @click.stop="notifStore.toggleSubscription(signal.ticker)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <!-- Star -->
        <button :class="['sc-icon-btn', { 'wl-saved': inWatchlist }]" @click.stop="wlStore.toggle(signal.ticker)">
          <svg width="15" height="15" viewBox="0 0 24 24"
               :fill="inWatchlist ? 'var(--y)' : 'none'"
               :stroke="inWatchlist ? 'var(--y)' : 'currentColor'"
               stroke-width="2.2" stroke-linecap="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <!-- Type badge -->
        <button :class="['sig-btn', signal.type]" @click.stop>
          {{ signal.type === 'buy' ? 'BUY' : signal.type === 'hold' ? 'HOLD' : 'SELL' }}
        </button>
      </div>
    </div>

    <!-- ROW 2: Perf + Price -->
    <div class="sc-row2">
      <div>
        <div class="sc-row2-label">Perf. seit Beobachtung</div>
        <div :class="['sc-pct', sigUp ? 'up' : 'dn']">{{ sigUp ? '+' : '' }}{{ sigChg }}%</div>
      </div>
      <div class="sc-price-block">
        <div class="sc-price">${{ signal.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
        <div class="sc-entry">Einstieg: ${{ signal.signalPrice }}</div>
      </div>
    </div>

    <!-- ROW 4: Meta -->
    <div class="sc-data3">
      <div class="sd3">
        <label>Sektor</label>
        <div class="v">{{ signal.sector }}</div>
      </div>
      <div class="sd3">
        <label>Stärke</label>
        <div :class="['v', `str-${signal.strength.toLowerCase()}`]">{{ signal.strength }}</div>
      </div>
      <div class="sd3">
        <label>Qualität</label>
        <div :class="['v', signal.quality >= 4 ? 'q-hi' : signal.quality >= 3 ? 'q-mid' : 'q-lo']">Q{{ signal.quality }}/5</div>
      </div>
      <div class="sd3">
        <label>Horizont</label>
        <div class="v"><span :class="['dur-badge', signal.duration]">{{ durLabel }}</span></div>
      </div>
    </div>

    <!-- ROW 5: History footer -->
    <div class="sc-footer" @click.stop>
      <button :class="['sc-hist-toggle', { 'no-expand': !multiDay, open: histOpen }]"
              @click="multiDay && (histOpen = !histOpen)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span class="sc-hist-count">{{ multiDay ? `${signal.dayHistory.length} Signale heute` : '1 Signal heute' }}</span>
        <span class="sc-hist-sub">· zuletzt <span style="color:var(--tx)">{{ signal.signalTime }}</span></span>
        <span v-if="multiDay" class="sc-hist-arrow">▾</span>
      </button>
    </div>

    <!-- History body -->
    <div v-if="multiDay" :class="['sc-hist-body', { open: histOpen }]">
      <div class="sc-hist-inner">
        <div v-for="(h, i) in signal.dayHistory" :key="i" class="sc-hist-row">
          <span class="sc-hist-time">{{ h.time }}</span>
          <span :class="['sc-hist-type', h.type]">{{ h.type.toUpperCase() }}</span>
          <span class="sc-hist-price">${{ h.price }}</span>
          <span class="sc-hist-note">{{ h.note }}</span>
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
import { useNotifStore } from '@/stores/notif'

const props = defineProps<{ signal: Signal }>()
defineEmits(['click'])

const wlStore = useWatchlistStore()
const notifStore = useNotifStore()

const showFb = ref(false)
const histOpen = ref(false)

const logoUrl = computed(() => LOGOS[props.signal.ticker] || '')
const inWatchlist = computed(() => wlStore.isInWatchlist(props.signal.ticker))
const multiDay = computed(() => props.signal.dayHistory.length > 1)

const sigChg = computed(() => ((props.signal.price - props.signal.signalPrice) / props.signal.signalPrice * 100).toFixed(2))
const sigUp = computed(() => parseFloat(sigChg.value) >= 0)

const durLabels: Record<string, string> = { intraday: '⚡ Intraday', short: '📅 Kurzfristig', medium: '📆 Mittelfristig', long: '🏔️ Langfristig' }
const durLabel = computed(() => durLabels[props.signal.duration] || props.signal.duration)
</script>

<style scoped>
/* ROW 1 */
.sc-row1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 11px; }
.sc-left { display: flex; align-items: center; gap: 10px; }
.sc-logo {
  width: 42px; height: 42px; border-radius: 10px; background: var(--bg3);
  border: 1px solid var(--bdr); display: flex; align-items: center;
  justify-content: center; overflow: hidden; flex-shrink: 0;
}
.sc-logo img { width: 28px; height: 28px; object-fit: contain; }
.sc-logo-fb { font-size: 10px; font-weight: 800; color: var(--mu); }
.sc-ticker { font-size: 17px; font-weight: 800; letter-spacing: -.03em; line-height: 1.1; }
.sc-name { font-size: 9px; color: var(--mu); margin-top: 1px; }
.sc-right { display: flex; align-items: center; gap: 7px; }
.sc-icon-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--bdr);
  background: var(--bg3); cursor: pointer; display: flex; align-items: center;
  justify-content: center; flex-shrink: 0; color: var(--mu);
}
.sc-icon-btn.subscribed { background: rgba(22,199,132,.12); border-color: rgba(22,199,132,.4); color: var(--g); }
.sc-icon-btn.wl-saved { background: rgba(240,185,11,.12); border-color: rgba(240,185,11,.4); }

/* ROW 2 */
.sc-row2 { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; }
.sc-row2-label { font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--mu2); font-family: var(--mono); margin-bottom: 3px; }
.sc-pct { font-family: var(--mono); font-size: 32px; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
.sc-pct.up { color: var(--g); }
.sc-pct.dn { color: var(--r); }
.sc-price-block { text-align: right; }
.sc-price { font-family: var(--mono); font-size: 20px; font-weight: 700; letter-spacing: -.02em; }
.sc-entry { font-family: var(--mono); font-size: 10px; color: var(--mu); margin-top: 1px; }

/* ROW 4 */
.sc-data3 { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--bdr); padding: 10px 0; }
.sd3 { padding: 0 4px; }
.sd3 label { font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--mu2); display: block; margin-bottom: 3px; font-family: var(--mono); }
.sd3 .v { font-size: 11px; font-weight: 700; color: var(--tx); }
.sd3 .v.str-strong { color: var(--g); }
.sd3 .v.str-moderate { color: var(--y); }
.sd3 .v.str-weak { color: var(--r); }
.sd3 .v.q-hi { color: var(--g); }
.sd3 .v.q-mid { color: var(--y); }
.sd3 .v.q-lo { color: var(--r); }

/* FOOTER */
.sc-footer { display: flex; padding: 8px 0 10px; border-top: 1px solid var(--bdr); }
.sc-hist-toggle {
  display: flex; align-items: center; gap: 7px; padding: 0; width: 100%;
  background: transparent; border: none; cursor: pointer;
  font-family: var(--mono); font-size: 10px; color: var(--mu);
}
.sc-hist-toggle.no-expand { cursor: default; }
.sc-hist-count { font-weight: 700; color: var(--tx); }
.sc-hist-sub { color: var(--mu); }
.sc-hist-arrow { font-size: 8px; color: var(--mu); transition: transform .2s; margin-left: auto; }
.sc-hist-toggle.open .sc-hist-arrow { transform: rotate(180deg); }

/* History */
.sc-hist-body { max-height: 0; overflow: hidden; transition: max-height .25s ease; }
.sc-hist-body.open { max-height: 300px; }
.sc-hist-inner { padding-bottom: 8px; display: flex; flex-direction: column; gap: 5px; }
.sc-hist-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; background: var(--bg); border-radius: 7px;
  border: 1px solid var(--bdr); font-size: 9px;
}
.sc-hist-time { font-family: var(--mono); font-weight: 700; color: var(--tx); flex-shrink: 0; min-width: 36px; }
.sc-hist-type { font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.sc-hist-type.buy { background: rgba(22,199,132,.1); color: var(--g); }
.sc-hist-type.hold { background: rgba(240,185,11,.1); color: var(--y); }
.sc-hist-type.sell { background: rgba(234,57,67,.1); color: var(--r); }
.sc-hist-price { font-family: var(--mono); font-size: 9px; font-weight: 700; flex-shrink: 0; }
.sc-hist-note { font-size: 9px; color: var(--mu); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
