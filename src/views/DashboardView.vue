<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <ion-toolbar>
                <div class="header-inner">
                    <div>
                        <p class="header-date font-mono">{{ today }}</p>
                        <h1 class="header-greeting font-display">Good morning, {{ firstName }}</h1>
                    </div>
                    <div class="header-actions">
                        <button class="notif-btn" @click="showNotifs = true">
                            <ion-icon name="notifications-outline" />
                            <span v-if="appStore.unreadCount > 0" class="notif-badge">{{ appStore.unreadCount }}</span>
                        </button>
                        <button class="profile-btn" @click="$router.push('/app/profile')">
                            <ion-icon name="person-circle-outline" />
                        </button>
                    </div>
                </div>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
                <ion-refresher-content />
            </ion-refresher>

            <div class="dash-content">
                <!-- Market stats -->
                <div class="market-stats">
                    <div v-for="s in stats" :key="s.label" class="stat-tile">
                        <div class="stat-value font-mono">{{ s.value }}</div>
                        <div :class="['stat-change font-mono', s.up ? 'text-buy' : 'text-sell']">
                            {{ s.up ? '+' : '' }}{{ s.change }}%
                        </div>
                        <div class="stat-label">{{ s.label }}</div>
                    </div>
                </div>

                <!-- Sentiment -->
                <div class="sentiment-bar">
                    <span class="live-dot" />
                    <span class="sentiment-label font-mono">Market Sentiment</span>
                    <span class="sentiment-value text-buy">{{ signalsStore.marketStats.sentiment }}</span>
                </div>

                <!-- Summary cards -->
                <div class="summary-row">
                    <div class="summary-card buy" @click="goToSignals('BUY')">
                        <div class="summary-count font-mono">{{ signalsStore.buySignals.length }}</div>
                        <div class="summary-label">Buy</div>
                    </div>
                    <div class="summary-card hold" @click="goToSignals('HOLD')">
                        <div class="summary-count font-mono">{{ signalsStore.holdSignals.length }}</div>
                        <div class="summary-label">Hold</div>
                    </div>
                    <div class="summary-card sell" @click="goToSignals('SELL')">
                        <div class="summary-count font-mono">{{ signalsStore.sellSignals.length }}</div>
                        <div class="summary-label">Sell</div>
                    </div>
                </div>

                <!-- Top signals -->
                <div class="section-header">
                    <h2 class="section-heading font-display">Top Signals</h2>
                    <button class="see-all" @click="$router.push('/app/signals')">See all →</button>
                </div>

                <div class="signal-list stagger">
                    <div v-for="signal in topSignals" :key="signal.id"
                        :class="['signal-card', signal.type.toLowerCase(), 'fade-up']"
                        @click="selectedSignal = signal; showSignalDetail = true">
                        <div class="ticker-logo">
                            <img :src="signal.logo" :alt="signal.ticker" @error="imgFallback" />
                        </div>
                        <div class="ticker-info">
                            <div class="ticker-symbol">{{ signal.ticker }}</div>
                            <div class="ticker-name">{{ signal.name }}</div>
                            <div class="badge-row">
                                <span :class="['signal-badge', signal.type.toLowerCase()]">{{ signal.type }}</span>
                                <span :class="['quality-badge', signal.quality.toLowerCase()]">{{ signal.quality
                                    }}</span>
                            </div>
                        </div>
                        <div class="price-info">
                            <div class="price font-mono">${{ signal.price.toFixed(2) }}</div>
                            <div :class="['change font-mono', signal.changePct >= 0 ? 'text-buy' : 'text-sell']">
                                {{ signal.changePct >= 0 ? '+' : '' }}{{ signal.changePct }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>

        <!-- Notifications panel -->
        <NotificationPanel v-if="showNotifs" @close="showNotifs = false" />

        <!-- Signal detail -->
        <SignalDetail v-if="showSignalDetail && selectedSignal" :signal="selectedSignal"
            @close="showSignalDetail = false" />
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonContent, IonRefresher, IonRefresherContent, IonIcon } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { addIcons } from 'ionicons'
import { notificationsOutline, personCircleOutline } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { useSignalsStore } from '@/stores/signals'
import { useAppStore } from '@/stores/app'
import type { Signal } from '@/stores/signals'
import NotificationPanel from '@/components/NotificationPanel.vue'
import SignalDetail from '@/components/SignalDetail.vue'

addIcons({ 'notifications-outline': notificationsOutline, 'person-circle-outline': personCircleOutline })

const router = useRouter()
const authStore = useAuthStore()
const signalsStore = useSignalsStore()
const appStore = useAppStore()

const showNotifs = ref(false)
const showSignalDetail = ref(false)
const selectedSignal = ref<Signal | null>(null)

const firstName = computed(() => authStore.user?.firstName || 'Trader')

const today = computed(() => new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
}))

const topSignals = computed(() => signalsStore.signals.slice(0, 5))

const stats = computed(() => {
    const m = signalsStore.marketStats
    return [
        { label: 'S&P 500', value: m.sp500.value.toLocaleString(), change: m.sp500.change, up: m.sp500.change >= 0 },
        { label: 'NASDAQ', value: m.nasdaq.value.toLocaleString(), change: m.nasdaq.change, up: m.nasdaq.change >= 0 },
        { label: 'DOW', value: m.dow.value.toLocaleString(), change: m.dow.change, up: m.dow.change >= 0 },
        { label: 'VIX', value: m.vix.value, change: m.vix.change, up: m.vix.change >= 0 }
    ]
})

function goToSignals(type: string) {
    signalsStore.filterType = type as any
    router.push('/app/signals')
}

function imgFallback(e: Event) {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'
}

async function refresh(event: any) {
    await signalsStore.refresh()
    event.target.complete()
}
</script>

<style scoped>
.header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px 12px;
}

.header-date {
    font-size: 11px;
    color: var(--et-text-muted);
    margin: 0 0 4px;
    letter-spacing: 0.05em;
}

.header-greeting {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
    color: var(--et-text-primary);
}

.header-actions {
    display: flex;
    gap: 8px;
}

.notif-btn,
.profile-btn {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--et-surface-2);
    border: 1px solid var(--et-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--et-text-secondary);
    cursor: pointer;
}

.notif-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--et-sell);
    color: white;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
}

.dash-content {
    padding: 16px 16px 24px;
}

/* Market stats */
.market-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
}

.stat-tile {
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 10px;
    padding: 10px 8px;
    text-align: center;
}

.stat-value {
    font-size: 13px;
    font-weight: 700;
    color: var(--et-text-primary);
}

.stat-change {
    font-size: 11px;
    margin: 2px 0;
}

.stat-label {
    font-size: 10px;
    color: var(--et-text-muted);
    letter-spacing: 0.04em;
}

/* Sentiment */
.sentiment-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 10px;
    margin-bottom: 16px;
}

.sentiment-label {
    font-size: 12px;
    color: var(--et-text-secondary);
    flex: 1;
}

.sentiment-value {
    font-size: 13px;
    font-weight: 700;
}

/* Summary row */
.summary-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
}

.summary-card {
    padding: 16px 12px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    border: 1px solid;
    transition: all 0.18s;
}

.summary-card:active {
    transform: scale(0.96);
}

.summary-card.buy {
    background: var(--et-buy-bg);
    border-color: var(--et-buy-border);
}

.summary-card.hold {
    background: var(--et-hold-bg);
    border-color: var(--et-hold-border);
}

.summary-card.sell {
    background: var(--et-sell-bg);
    border-color: var(--et-sell-border);
}

.summary-count {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
}

.summary-card.buy .summary-count {
    color: var(--et-buy);
}

.summary-card.hold .summary-count {
    color: var(--et-hold);
}

.summary-card.sell .summary-count {
    color: var(--et-sell);
}

.summary-label {
    font-size: 12px;
    color: var(--et-text-secondary);
    font-weight: 500;
}

/* Section */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.section-heading {
    font-size: 18px;
    font-weight: 800;
    margin: 0;
}

.see-all {
    font-size: 13px;
    color: var(--et-accent);
    background: none;
    border: none;
    cursor: pointer;
}

.badge-row {
    display: flex;
    gap: 6px;
    margin-top: 5px;
}
</style>