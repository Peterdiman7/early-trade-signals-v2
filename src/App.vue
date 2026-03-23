<template>
  <ion-app :class="{ 'dark-theme': isDark }">
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { computed } from 'vue'
import { useAppStore } from '@/stores/auth'

const appStore = useAppStore()
const isDark = computed(() => appStore.darkMode)
</script>