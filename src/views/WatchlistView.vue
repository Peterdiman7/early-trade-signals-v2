<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <ion-toolbar>
                <div class="page-header">
                    <h1 class="font-display">Watchlist</h1>
                    <span class="count-chip font-mono">{{ watchlistStore.items.length }}</span>
                </div>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div v-if="watchlistStore.items.length === 0" class="empty-state">
                <span>⭐</span>
                <h3>Your watchlist is empty</h3>
                <p>Add signals from the Signals tab to track them here.</p>
                <button @click="$router.push('/app/signals')">Browse Signals →</button>
            </div>

            <div v-else class="watchlist-content">
                <div v-for="item in watchlistStore.items" :key="item.id" class="watchlist-item fade-up">
                    <div class="item-logo">
                        <img :src="item.logo" :alt="item.ticker" @error="imgFallback" />
                    </div>

                    <div class="item-info">
                        <div class="item-ticker font-display">{{ item.ticker }}</div>
                        <div class="item-name">{{ item.name }}</div>
                        <div v-if="item.targetPrice" class="item-target font-mono">
                            Target: ${{ item.targetPrice }}
                        </div>
                    </div>

                    <div class="item-price">
                        <div class="price font-mono">${{ item.price.toFixed(2) }}</div>
                        <div :class="['change font-mono', item.changePct >= 0 ? 'text-buy' : 'text-sell']">
                            {{ item.changePct >= 0 ? '+' : '' }}{{ item.changePct }}%
                        </div>
                        <div class="added-date">Added {{ formatDate(item.addedAt) }}</div>
                    </div>

                    <button class="remove-btn" @click="remove(item.id)">✕</button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent } from '@ionic/vue'
import { useWatchlistStore } from '@/stores/watchlist'

const watchlistStore = useWatchlistStore()

function remove(id: string) {
    watchlistStore.removeFromWatchlist(id)
}

function imgFallback(e: Event) {
    const img = e.target as HTMLImageElement
    img.style.display = 'none'
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px 12px;
}

.page-header h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
}

.count-chip {
    background: var(--et-accent-glow);
    border: 1px solid rgba(99, 179, 237, 0.3);
    color: var(--et-accent);
    font-size: 13px;
    padding: 2px 10px;
    border-radius: 100px;
}

.watchlist-content {
    padding: 12px 16px 80px;
}

.watchlist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 12px;
    margin-bottom: 10px;
}

.item-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--et-surface-3);
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-logo img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.item-info {
    flex: 1;
}

.item-ticker {
    font-size: 15px;
    font-weight: 700;
}

.item-name {
    font-size: 12px;
    color: var(--et-text-muted);
}

.item-target {
    font-size: 11px;
    color: var(--et-accent);
    margin-top: 3px;
}

.item-price {
    text-align: right;
}

.price {
    font-size: 15px;
    font-weight: 600;
}

.change {
    font-size: 12px;
}

.added-date {
    font-size: 10px;
    color: var(--et-text-muted);
    margin-top: 3px;
}

.remove-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--et-surface-3);
    border: none;
    color: var(--et-text-muted);
    font-size: 11px;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 32px;
    text-align: center;
    color: var(--et-text-muted);
}

.empty-state span {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--et-text-primary);
    margin: 0 0 8px;
}

.empty-state p {
    font-size: 14px;
    margin: 0 0 24px;
    line-height: 1.5;
}

.empty-state button {
    background: var(--et-accent);
    border: none;
    color: #080c14;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}
</style>