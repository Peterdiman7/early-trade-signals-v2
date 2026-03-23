<template>
  <div class="drawer-ov" @click.self="$emit('close')">
    <div class="drawer open">
      <div class="dr-close" @click="$emit('close')">×</div>

      <!-- Profile -->
      <div class="dr-profile" @click="$emit('close')">
        <div class="dr-profile-top">
          <div class="dr-avatar">👤</div>
          <div style="flex:1">
            <div class="dr-pname">{{ authStore.user?.firstName || 'Trader' }}</div>
            <div class="dr-prole">{{ t('common.proMember') }}</div>
          </div>
        </div>
        <div class="dr-profile-tags">
          <span class="dr-tag risk">{{ riskLabel }}</span>
          <span class="dr-tag horizon">{{ horizonLabel }}</span>
        </div>
        <div style="margin-top:8px;font-size:9px;color:var(--mu);font-family:var(--mono)">{{ t('nav.editProfile') }}</div>
      </div>

      <!-- Nav -->
      <nav class="dr-nav">
        <router-link to="/app/home" @click="$emit('close')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {{ t('nav.home') }}
        </router-link>
        <router-link to="/app/signals" @click="$emit('close')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          {{ t('nav.signals') }}
        </router-link>
        <router-link to="/app/watchlist" @click="$emit('close')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {{ t('nav.watchlist') }}
        </router-link>
        <router-link to="/app/portfolio" @click="$emit('close')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          {{ t('nav.portfolio') }}
        </router-link>
        <router-link to="/app/market" @click="$emit('close')">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          {{ t('nav.market') }}
        </router-link>
      </nav>

      <div class="dr-divider"></div>

      <!-- Settings -->
      <div style="padding:4px 0">
        <div class="dr-settings-label">{{ t('nav.settings') }}</div>

        <!-- Language Switcher row -->
        <div class="dr-toggle-row" style="cursor:default">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span class="dr-toggle-label">{{ t('nav.changeLanguage') }}</span>
          <LanguageSwitcher />
        </div>

        <!-- Theme -->
        <div class="dr-toggle-row" @click="appStore.toggleDarkMode()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          </svg>
          <span class="dr-toggle-label">{{ appStore.darkMode ? t('nav.lightMode') : t('nav.darkMode') }}</span>
          <label class="ios-toggle" @click.stop>
            <input type="checkbox" :checked="!appStore.darkMode" @change="appStore.toggleDarkMode()" />
            <span class="ios-track"></span>
            <span class="ios-thumb"></span>
          </label>
        </div>

        <!-- Notifications -->
        <div class="dr-toggle-row" @click="appStore.toggleNotif()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="dr-toggle-label">{{ appStore.notifEnabled ? t('nav.notifOn') : t('nav.notifOff') }}</span>
          <label class="ios-toggle" @click.stop>
            <input type="checkbox" :checked="appStore.notifEnabled" @change="appStore.toggleNotif()" />
            <span class="ios-track"></span>
            <span class="ios-thumb"></span>
          </label>
        </div>
      </div>

      <div class="dr-divider"></div>

      <!-- Logout -->
      <nav class="dr-nav">
        <a href="#" @click.prevent="logout">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {{ t('nav.logout') }}
        </a>
      </nav>

      <div style="flex:1"></div>
      <div class="dr-contact">
        <h4>{{ t('nav.contact') }}</h4>
        <p>1125 E Broadway Blvd #14<br>Glendale, CA 91205<br>+1-747-250-0014</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useI18n } from '@/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t, locale } = useI18n()

const riskMapDE: Record<string, string> = { conservative: 'Konservativ', moderate: 'Moderat', aggressive: 'Aggressiv', speculative: 'Spekulativ' }
const riskMapEN: Record<string, string> = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive', speculative: 'Speculative' }
const riskMapFR: Record<string, string> = { conservative: 'Conservateur', moderate: 'Modéré', aggressive: 'Agressif', speculative: 'Spéculatif' }

const hzMapDE: Record<string, string> = { intraday: 'Intraday', short: 'Kurzfristig', medium: 'Mittelfristig', long: 'Langfristig' }
const hzMapEN: Record<string, string> = { intraday: 'Intraday', short: 'Short-term', medium: 'Medium-term', long: 'Long-term' }
const hzMapFR: Record<string, string> = { intraday: 'Intraday', short: 'Court terme', medium: 'Moyen terme', long: 'Long terme' }

const riskLabel = computed(() => {
  const maps = { de: riskMapDE, en: riskMapEN, fr: riskMapFR }
  const map = maps[locale.value] || riskMapDE
  return map[authStore.user?.riskProfile || 'moderate'] || 'Moderat'
})

const horizonLabel = computed(() => {
  const maps = { de: hzMapDE, en: hzMapEN, fr: hzMapFR }
  const map = maps[locale.value] || hzMapDE
  return map[authStore.user?.horizon || 'medium'] || 'Mittelfristig'
})

function logout() {
  authStore.logout()
  router.push('/landing')
}
</script>

<style scoped>
.drawer-ov { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 300; backdrop-filter: blur(4px); }
.drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: 272px;
  background: var(--bg2); z-index: 400; padding: 16px;
  border-left: 1px solid var(--bdr); display: flex; flex-direction: column;
  animation: slideIn .3s cubic-bezier(.4,0,.2,1);
  overflow-y: auto;
}
@keyframes slideIn { from { transform: translateX(110%) } to { transform: translateX(0) } }
.dr-close {
  width: 30px; height: 30px; background: var(--bg3); border: 1px solid var(--bdr);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 16px; margin-bottom: 16px; color: var(--mu);
}
.dr-profile { background: var(--bg3); border-radius: 11px; padding: 12px; margin-bottom: 14px; cursor: pointer; }
.dr-profile-top { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; }
.dr-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--g); display: flex; align-items: center; justify-content: center; font-size: 16px; }
.dr-pname { font-size: 13px; font-weight: 700; }
.dr-prole { font-size: 9px; color: var(--mu); margin-top: 1px; }
.dr-profile-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.dr-tag { font-size: 9px; padding: 3px 8px; border-radius: 100px; font-weight: 600; }
.dr-tag.risk { background: rgba(240,185,11,.12); color: var(--y); border: 1px solid rgba(240,185,11,.2); }
.dr-tag.horizon { background: rgba(79,142,247,.12); color: var(--b); border: 1px solid rgba(79,142,247,.2); }
.dr-nav a {
  display: flex; align-items: center; gap: 10px; padding: 11px 10px;
  border-radius: 10px; text-decoration: none; color: var(--mu);
  font-size: 13px; font-weight: 600; transition: all .2s;
}
.dr-nav a:hover, .dr-nav a.router-link-active { background: var(--bg3); color: var(--tx); }
.dr-divider { height: 1px; background: var(--bdr); margin: 6px 0; }
.dr-settings-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--mu2); padding: 6px 10px 4px; font-family: var(--mono); }
.dr-toggle-row { display: flex; align-items: center; gap: 10px; padding: 11px 10px; border-radius: 10px; color: var(--mu); font-size: 13px; font-weight: 600; cursor: pointer; }
.dr-toggle-row:hover { background: var(--bg3); color: var(--tx); }
.dr-toggle-label { flex: 1; }
.ios-toggle { position: relative; width: 38px; height: 22px; flex-shrink: 0; display: inline-block; }
.ios-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.ios-track { position: absolute; inset: 0; border-radius: 11px; background: var(--bg4); border: 1px solid var(--bdr2); cursor: pointer; transition: background .25s; }
.ios-toggle input:checked + .ios-track { background: var(--g); border-color: var(--g); }
.ios-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform .25s; pointer-events: none; }
.ios-toggle input:checked ~ .ios-thumb { transform: translateX(16px); }
.dr-contact { padding: 12px; background: var(--bg3); border-radius: 10px; margin-top: 8px; }
.dr-contact h4 { font-size: 9px; font-weight: 700; color: var(--g); margin-bottom: 5px; text-transform: uppercase; letter-spacing: .1em; }
.dr-contact p { font-size: 9px; color: var(--mu); line-height: 1.8; }
</style>
