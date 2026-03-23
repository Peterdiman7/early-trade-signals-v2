<template>
	<ion-app>
		<ion-router-outlet />
		<div class="toast-container" id="toast-container"></div>
	</ion-app>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

function applyTheme(dark: boolean) {
	if (dark) {
		document.body.classList.remove('light-mode')
	} else {
		document.body.classList.add('light-mode')
	}
}

onMounted(() => applyTheme(appStore.darkMode))
watch(() => appStore.darkMode, (val) => applyTheme(val))
</script>

<style>
.toast-container {
	position: fixed;
	top: 70px;
	right: 16px;
	z-index: 9000;
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 320px;
	pointer-events: none;
}

.toast-container>* {
	pointer-events: all;
}
</style>
