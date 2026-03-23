import { reactive, computed } from 'vue'
import de from './locales/de'
import en from './locales/en'
import fr from './locales/fr'

// ─── Types ───────────────────────────────────────────────────────────────────
export type Lang = 'de' | 'en' | 'fr'

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }
type Locale = typeof de

// ─── Locale map ──────────────────────────────────────────────────────────────
const locales: Record<Lang, Locale> = { de, en, fr }

// ─── Storage ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ets_lang'

function loadLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (saved && saved in locales) return saved
  } catch (_) {}
  // Detect browser language
  const browser = navigator.language?.slice(0, 2).toLowerCase()
  if (browser === 'fr') return 'fr'
  if (browser === 'de') return 'de'
  return 'de' // default
}

function saveLang(lang: Lang) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch (_) {}
}

// ─── Reactive state ──────────────────────────────────────────────────────────
const state = reactive({
  current: loadLang(),
})

// ─── Deep get helper ─────────────────────────────────────────────────────────
function deepGet(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : path), obj)
}

// ─── Public API ──────────────────────────────────────────────────────────────
export const i18n = {
  /** Reactive current locale key */
  get locale(): Lang {
    return state.current
  },

  /** All supported languages with metadata */
  languages: [
    { code: 'de' as Lang, flag: '🇩🇪', name: 'Deutsch' },
    { code: 'en' as Lang, flag: '🇬🇧', name: 'English' },
    { code: 'fr' as Lang, flag: '🇫🇷', name: 'Français' },
  ],

  /** Switch language and persist to localStorage */
  setLocale(lang: Lang) {
    if (!(lang in locales)) return
    state.current = lang
    saveLang(lang)
  },

  /**
   * Translate a dot-notation key.
   * e.g. t('nav.home'), t('auth.register')
   */
  t(key: string): string {
    const locale = locales[state.current]
    const result = deepGet(locale, key)
    // Fallback to DE if key not found in current locale
    if (result === key) {
      const fallback = deepGet(locales.de, key)
      return fallback !== key ? fallback : key
    }
    return result
  },

  /** Check if current locale is a specific language */
  is(lang: Lang): boolean {
    return state.current === lang
  },
}

// ─── Vue Plugin ──────────────────────────────────────────────────────────────
export const I18nPlugin = {
  install(app: any) {
    // Make $t and $i18n available in all components
    app.config.globalProperties.$t = (key: string) => i18n.t(key)
    app.config.globalProperties.$i18n = i18n
    // Provide for Composition API usage
    app.provide('i18n', i18n)
  },
}

// ─── Composable for Composition API ──────────────────────────────────────────
export function useI18n() {
  const t = (key: string) => i18n.t(key)
  const locale = computed(() => i18n.locale)
  const setLocale = (lang: Lang) => i18n.setLocale(lang)
  const languages = i18n.languages

  return { t, locale, setLocale, languages }
}
