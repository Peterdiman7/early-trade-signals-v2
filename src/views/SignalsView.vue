<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <ion-toolbar>
                <div class="signals-header">
                    <h1 class="font-display">Live Signals</h1>
                    <div class="header-right">
                        <span class="live-dot" />
                        <span class="update-text font-mono">Auto-update 30s</span>
                    </div>
                </div>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
                <ion-refresher-content />
            </ion-refresher>

            <!-- Filter chips -->
            <div class="filter-section">
                <div class="filter-row">
                    <ion-chip v-for="t in typeFilters" :key="t.value"
                        :class="{ active: signalsStore.filterType === t.value }"
                        @click="signalsStore.filterType = t.value">
                        {{ t.label }}
                    </ion-chip>
                </div>
                <div class="filter-row">
                    <ion-chip v-for="h in horizonFilters" :key="h.value"
                        :class="{ active: signalsStore.filterHorizon === h.value }"
                        @click="signalsStore.filterHorizon = h.value">
                        {{ h.label }}
                    </ion-chip>
                </div>
                <div class="filter-row">
                    <ion-chip v-for="q in qualityFilters" :key="q.value"
                        :class="{ active: signalsStore.filterQuality === q.value }"
                        @click="signalsStore.filterQuality = q.value">
                        {{ q.label }}
                    </ion-chip>
                </div>
            </div>

            <!-- Count -->
            <div class="count-bar">
                <span class="font-mono count-text">
                    {{ signalsStore.filteredSignals.length }} signals
                </span>
                <span class="count-breakdown">
                    <span class="text-buy">{{ signalsStore.buySignals.length }} BUY</span> ·
                    <span class="text-hold">{{ signalsStore.holdSignals.length }} HOLD</span> ·
                    <span class="text-sell">{{ signalsStore.sellSignals.length }} SELL</span>
                </span>
            </div>

            <!-- Loading -->
            <div v-if="signalsStore.loading" class="loading-state">
                <div class="loading-spinner" />
                <p>Loading signals…</p>
            </div>

            <!-- Signal list -->
            <div v-else class="signal-list-container stagger">
                <div v-for="signal in signalsStore.filteredSignals" :key="signal.id"
                    :class="['signal-card', signal.type.toLowerCase(), 'fade-up']" @click="select(signal)">
                    <div class="ticker-logo">
                        <img :src="signal.logo" :alt="signal.ticker" @error="imgFallback" />
                    </div>

                    <div class="ticker-info">
                        <div class="top-row">
                            <span class="ticker-symbol">{{ signal.ticker }}</span>
                            <span :class="['signal-badge', signal.type.toLowerCase()]">{{ signal.type }}</span>
                        </div>
                        <div class="ticker-name">{{ signal.name }}</div>
                        <div class="meta-row">
                            <span :class="['quality-badge', signal.quality.toLowerCase()]">{{ signal.quality }}</span>
                            <span class="horizon-tag font-mono">{{ horizonLabel(signal.horizon) }}</span>
                            <span class="sector-tag">{{ signal.sector }}</span>
                        </div>
                    </div>

                    <div class="price-info">
                        <div class="price font-mono">${{ signal.price.toFixed(2) }}</div>
                        <div :class="['change font-mono', signal.changePct >= 0 ? 'text-buy' : 'text-sell']">
                            {{ signal.changePct >= 0 ? '+' : '' }}{{ signal.changePct }}%
                        </div>
                        <div class="win-rate font-mono">{{ signal.winRate }}% WR</div>
                    </div>
                </div>

                <div v-if="signalsStore.filteredSignals.length === 0" class="empty-state">
                    <span>🔍</span>
                    <p>No signals match your filters</p>
                    <button @click="resetFilters">Reset filters</button>
                </div>
            </div>
        </ion-content>

        <SignalDetail v-if="showDetail && selectedSignal" :signal="selectedSignal" @close="showDetail = false" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonContent, IonRefresher, IonRefresherContent, IonChip } from '@ionic/vue'
import { useSignalsStore } from '@/stores/signals'
import type { Signal } from '@/stores/signals'
import SignalDetail from '@/components/SignalDetail.vue'

const signalsStore = useSignalsStore()
const showDetail = ref(false)
const selectedSignal = ref<Signal | null>(null)

function select(signal: Signal) {
    selectedSignal.value = signal
    showDetail.value = true
}

function imgFallback(e: Event) {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'
}

function horizonLabel(h: string) {
    const map: Record<string, string> = { intraday: 'Intraday', short: 'Short', medium: 'Mid', long: 'Long' }
    return map[h] || h
}

function resetFilters() {
    signalsStore.filterType = 'all'
    signalsStore.filterHorizon = 'all'
    signalsStore.filterQuality = 'all'
}

async function refresh(event: any) {
    await signalsStore.refresh()
    event.target.complete()
}

const typeFilters = [
    { value: 'all', label: 'All' },
    { value: 'BUY', label: '🟢 Buy' },
    { value: 'HOLD', label: '🟡 Hold' },
    { value: 'SELL', label: '🔴 Sell' }
]

const horizonFilters = [
    { value: 'all', label: 'All Horizons' },
    { value: 'intraday', label: '⚡ Intraday' },
    { value: 'short', label: '📅 Short' },
    { value: 'medium', label: '📆 Medium' },
    { value: 'long', label: '🏔️ Long' }
]

const qualityFilters = [
    { value: 'all', label: 'All Quality' },
    { value: 'Q5', label: '⭐ Q5 Perfect' },
    { value: 'Q4', label: 'Q4 Top' },
    { value: 'Q3', label: 'Q3 Good' }
]
</script>

<style scoped>
.signals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px 12px;
}

.signals-header h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 6px;
}

.update-text {
    font-size: 11px;
    color: var(--et-text-muted);
}

/* Filters */
.filter-section {
    padding: 8px 16px 0;
}

.filter-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: none;
}

.filter-row::-webkit-scrollbar {
    display: none;
}

/* Count bar */
.count-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid var(--et-border);
}

.count-text {
    font-size: 13px;
    color: var(--et-text-secondary);
}

.count-breakdown {
    font-size: 12px;
    color: var(--et-text-muted);
}

/* Signal list */
.signal-list-container {
    padding: 12px 16px 80px;
}

.top-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}

.meta-row {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 4px;
    flex-wrap: wrap;
}

.horizon-tag {
    font-size: 10px;
    color: var(--et-text-muted);
    background: var(--et-surface-3);
    padding: 2px 6px;
    border-radius: 3px;
}

.sector-tag {
    font-size: 10px;
    color: var(--et-text-muted);
}

.win-rate {
    font-size: 11px;
    color: var(--et-accent);
    margin-top: 3px;
}

/* Loading */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: var(--et-text-muted);
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid var(--et-border);
    border-top-color: var(--et-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Empty */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--et-text-muted);
}

.empty-state span {
    font-size: 40px;
    display: block;
    margin-bottom: 12px;
}

.empty-state p {
    font-size: 15px;
    margin-bottom: 20px;
}

.empty-state button {
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    color: var(--et-accent);
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}
</style>