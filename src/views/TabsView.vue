<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet />

            <ion-tab-bar slot="bottom">
                <ion-tab-button tab="dashboard" href="/app/dashboard">
                    <ion-icon name="home-outline" />
                    <ion-label>Home</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="signals" href="/app/signals">
                    <ion-icon name="trending-up-outline" />
                    <ion-label>Signals</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="watchlist" href="/app/watchlist">
                    <ion-icon name="star-outline" />
                    <ion-label>Watchlist</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="portfolio" href="/app/portfolio">
                    <ion-icon name="briefcase-outline" />
                    <ion-label>Portfolio</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="analysis" href="/app/analysis">
                    <ion-icon name="bar-chart-outline" />
                    <ion-label>Analysis</ion-label>
                </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage, IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonLabel, IonRouterOutlet
} from '@ionic/vue'
import { addIcons } from 'ionicons'
import {
    homeOutline, trendingUpOutline, starOutline,
    briefcaseOutline, barChartOutline
} from 'ionicons/icons'

addIcons({
    'home-outline': homeOutline,
    'trending-up-outline': trendingUpOutline,
    'star-outline': starOutline,
    'briefcase-outline': briefcaseOutline,
    'bar-chart-outline': barChartOutline
})
</script>