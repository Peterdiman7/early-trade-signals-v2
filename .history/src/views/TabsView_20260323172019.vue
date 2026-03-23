<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet />
			<ion-tab-bar slot="bottom" class="bottom-nav">
				<ion-tab-button tab="home" href="/app/home" class="bni">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
					<ion-label>Home</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="signals" href="/app/signals" class="bni">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
						<polyline points="16 7 22 7 22 13" />
					</svg>
					<ion-label>Signale</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="watchlist" href="/app/watchlist" class="bni">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<polygon
							points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
					<ion-label>Watchlist</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="portfolio" href="/app/portfolio" class="bni">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="7" width="20" height="14" rx="2" />
						<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
						<line x1="12" y1="12" x2="12" y2="16" />
						<line x1="10" y1="14" x2="14" y2="14" />
					</svg>
					<ion-label>Portfolio</ion-label>
				</ion-tab-button>
				<ion-tab-button tab="market" href="/app/market" class="bni">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="20" x2="18" y2="10" />
						<line x1="12" y1="20" x2="12" y2="4" />
						<line x1="6" y1="20" x2="6" y2="14" />
					</svg>
					<ion-label>Analyse</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from '@ionic/vue'
</script>

<style scoped>
.bottom-nav {
	background: rgba(17, 23, 32, .97) !important;
	border-top: 1px solid var(--bdr) !important;
	backdrop-filter: blur(20px);
}

.bni {
	--color: var(--mu);
	--color-selected: var(--g);
	font-size: 8px;
	font-weight: 600;
	letter-spacing: .04em;
	text-transform: uppercase;
}
</style>
