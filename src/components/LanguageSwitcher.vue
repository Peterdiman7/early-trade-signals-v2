<template>
  <div class="lang-switcher" :class="{ open: isOpen }">
    <!-- Trigger -->
    <button class="ls-trigger" @click="isOpen = !isOpen" :title="i18n.t('nav.changeLanguage')">
      <span class="ls-flag">{{ currentLang.flag }}</span>
      <span class="ls-code">{{ currentLang.code.toUpperCase() }}</span>
      <svg class="ls-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="ls-drop">
      <div v-if="isOpen" class="ls-dropdown">
        <button
          v-for="lang in i18n.languages"
          :key="lang.code"
          :class="['ls-item', { active: lang.code === i18n.locale }]"
          @click="select(lang.code)"
        >
          <span class="ls-item-flag">{{ lang.flag }}</span>
          <span class="ls-item-name">{{ lang.name }}</span>
          <svg v-if="lang.code === i18n.locale" class="ls-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Click-away overlay -->
    <div v-if="isOpen" class="ls-backdrop" @click="isOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/i18n'
import type { Lang } from '@/i18n'

const { i18n, locale } = (() => {
  const result = useI18n()
  return { i18n: { t: result.t, locale: result.locale, languages: result.languages, setLocale: result.setLocale }, locale: result.locale }
})()

// Re-import i18n object directly for reactive access
import { i18n as i18nObj } from '@/i18n'

const isOpen = ref(false)

const currentLang = computed(() => i18nObj.languages.find(l => l.code === i18nObj.locale) || i18nObj.languages[0])

function select(code: Lang) {
  i18nObj.setLocale(code)
  isOpen.value = false
}
</script>

<style scoped>
.lang-switcher {
  position: relative;
  z-index: 500;
}

.ls-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: var(--bg3);
  border: 1px solid var(--bdr);
  border-radius: 9px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  color: var(--tx);
  font-family: var(--mono);
  transition: border-color .2s;
}

.ls-trigger:hover {
  border-color: var(--bdr2);
}

.lang-switcher.open .ls-trigger {
  border-color: var(--g);
}

.ls-flag {
  font-size: 15px;
  line-height: 1;
}

.ls-code {
  letter-spacing: .06em;
}

.ls-caret {
  color: var(--mu);
  transition: transform .2s;
  flex-shrink: 0;
}

.lang-switcher.open .ls-caret {
  transform: rotate(180deg);
}

.ls-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
}

.ls-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 148px;
  background: var(--bg2);
  border: 1px solid var(--bdr2);
  border-radius: 12px;
  padding: 5px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .5);
  z-index: 600;
}

.ls-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--mu);
  font-family: var(--font);
  transition: all .15s;
  text-align: left;
}

.ls-item:hover {
  background: var(--bg3);
  color: var(--tx);
}

.ls-item.active {
  background: rgba(22, 199, 132, .08);
  color: var(--g);
}

.ls-item-flag {
  font-size: 17px;
  line-height: 1;
}

.ls-item-name {
  flex: 1;
}

/* Transition */
.ls-drop-enter-active,
.ls-drop-leave-active {
  transition: opacity .18s ease, transform .18s cubic-bezier(.34,1.2,.64,1);
}

.ls-drop-enter-from,
.ls-drop-leave-to {
  opacity: 0;
  transform: scale(.94) translateY(-6px);
}
</style>
