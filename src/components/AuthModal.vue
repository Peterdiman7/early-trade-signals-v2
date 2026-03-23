<template>
  <div class="modal-ov open" @click.self="$emit('close')">
    <div class="modal">
      <button class="modal-x" @click="$emit('close')">×</button>

      <!-- Language Step -->
      <div v-if="step === 'lang'" class="auth-lang-step">
        <div style="text-align:center;margin-bottom:20px">
          <div class="mico" style="margin:0 auto 10px">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" width="26" height="26">
              <polyline points="3 17 8 12 13 15 21 7"/><polyline points="17 7 21 7 21 11"/>
            </svg>
          </div>
          <h2>Early Trade Signals</h2>
          <p style="font-size:11px;color:var(--mu)">Wähle deine Sprache · Choose your language</p>
        </div>
        <div class="auth-lang-grid">
          <button v-for="l in langs" :key="l.code"
            :class="['auth-lang-card', { active: selectedLang === l.code }]"
            @click="selectedLang = l.code">
            <span class="alang-flag">{{ l.flag }}</span>
            <span class="alang-name">{{ l.name }}</span>
            <div :class="['alang-check', { hidden: selectedLang !== l.code }]">✓</div>
          </button>
        </div>
        <button class="msubmit" style="margin-top:20px" @click="step = 'form'">Weiter →</button>
      </div>

      <!-- Form Step -->
      <div v-else>
        <div class="modal-logo">
          <div class="mico">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" width="26" height="26">
              <polyline points="3 17 8 12 13 15 21 7"/><polyline points="17 7 21 7 21 11"/>
            </svg>
          </div>
          <h2>Early Trade Signals</h2>
          <p>{{ activeTab === 'register' ? 'Konto erstellen' : 'Willkommen zurück' }}</p>
        </div>

        <div class="modal-tabs">
          <button :class="['mtab', { on: activeTab === 'register' }]" @click="activeTab = 'register'">Registrieren</button>
          <button :class="['mtab', { on: activeTab === 'login' }]" @click="activeTab = 'login'">Einloggen</button>
        </div>

        <!-- Register -->
        <div v-if="activeTab === 'register'">
          <div class="form-row">
            <div class="fg"><label>Vorname</label><input v-model="form.firstName" type="text" placeholder="Max" /></div>
            <div class="fg"><label>Nachname</label><input v-model="form.lastName" type="text" placeholder="Müller" /></div>
          </div>
          <div class="fg"><label>E-Mail</label><input v-model="form.email" type="email" placeholder="max@email.com" /></div>
          <div class="fg"><label>Passwort</label><input v-model="form.password" type="password" placeholder="Mind. 8 Zeichen" /></div>
          <button class="msubmit" :disabled="loading" @click="doRegister">
            <span v-if="loading" class="loader"></span>
            <span v-else>Kostenlos registrieren →</span>
          </button>
        </div>

        <!-- Login -->
        <div v-else>
          <div class="fg"><label>E-Mail</label><input v-model="form.email" type="email" value="demo@early-trade-signals.com" /></div>
          <div class="fg"><label>Passwort</label><input v-model="form.password" type="password" value="Demo1234!" /></div>
          <button class="msubmit" :disabled="loading" @click="doLogin">
            <span v-if="loading" class="loader"></span>
            <span v-else>Einloggen →</span>
          </button>
        </div>

        <div v-if="error" style="color:var(--r);font-size:12px;text-align:center;margin-top:8px">{{ error }}</div>

        <div style="text-align:center;margin-top:12px">
          <button @click="step = 'lang'" style="background:none;border:none;color:var(--mu);font-size:10px;cursor:pointer;text-decoration:underline">
            Sprache ändern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const step = ref<'lang' | 'form'>('lang')
const activeTab = ref(props.mode)
const selectedLang = ref('de')
const loading = ref(false)
const error = ref('')

const form = ref({ firstName: '', lastName: '', email: 'demo@early-trade-signals.com', password: 'Demo1234!' })

const langs = [
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

async function doRegister() {
  if (!form.value.firstName) { error.value = 'Bitte Vorname eingeben.'; return }
  error.value = ''; loading.value = true
  try {
    await authStore.register(form.value.firstName, form.value.lastName, form.value.email, form.value.password)
    emit('success')
  } catch { error.value = 'Registrierung fehlgeschlagen.' }
  finally { loading.value = false }
}

async function doLogin() {
  error.value = ''; loading.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
    emit('success')
  } catch { error.value = 'Ungültige Zugangsdaten.' }
  finally { loading.value = false }
}
</script>

<style scoped>
.modal-ov {
  position: fixed; inset: 0; background: rgba(0,0,0,.72); z-index: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; backdrop-filter: blur(6px);
}
.modal {
  background: var(--bg2); border: 1px solid var(--bdr2); border-radius: 22px;
  padding: 28px 24px; width: 100%; max-width: 420px; position: relative;
  animation: modalIn .28s cubic-bezier(.34,1.56,.64,1);
}
.modal-x {
  position: absolute; top: 14px; right: 14px; width: 30px; height: 30px;
  border-radius: 8px; background: var(--bg3); border: 1px solid var(--bdr);
  cursor: pointer; font-size: 16px; color: var(--mu); display: flex;
  align-items: center; justify-content: center;
}
.mico {
  width: 48px; height: 48px; background: var(--g); border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.modal-logo { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 20px; text-align: center; }
.modal-logo h2 { font-size: 18px; font-weight: 800; letter-spacing: -.03em; }
.modal-logo p { font-size: 11px; color: var(--mu); }
.modal-tabs { display: flex; gap: 3px; background: var(--bg3); border-radius: 9px; padding: 3px; margin-bottom: 18px; }
.mtab { flex: 1; padding: 8px; border: none; border-radius: 7px; background: transparent; color: var(--mu); font-weight: 600; font-size: 12px; cursor: pointer; }
.mtab.on { background: var(--bg4); color: var(--tx); }
.fg { margin-bottom: 13px; }
.fg label { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--mu); display: block; margin-bottom: 6px; font-family: var(--mono); }
.fg input {
  width: 100%; background: var(--bg3); border: 1px solid var(--bdr);
  border-radius: 10px; padding: 12px 14px; color: var(--tx);
  font-family: var(--font); font-size: 13px; outline: none; transition: border-color .2s;
}
.fg input:focus { border-color: var(--g); }
.msubmit {
  width: 100%; background: var(--g); border: none; border-radius: 10px;
  padding: 14px; color: #000; font-weight: 700; font-size: 14px; cursor: pointer;
  margin-top: 4px; display: flex; align-items: center; justify-content: center;
}
.msubmit:disabled { opacity: .6; cursor: not-allowed; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* Lang cards */
.auth-lang-grid { display: flex; flex-direction: column; gap: 8px; }
.auth-lang-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg3); border: 2px solid var(--bdr);
  border-radius: 14px; padding: 14px 18px; cursor: pointer; text-align: left; width: 100%;
}
.auth-lang-card.active { border-color: var(--g); background: rgba(22,199,132,.07); }
.alang-flag { font-size: 28px; }
.alang-name { flex: 1; font-size: 15px; font-weight: 700; color: var(--tx); }
.alang-check {
  width: 22px; height: 22px; border-radius: 50%; background: var(--g);
  color: #000; font-size: 12px; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}
.alang-check.hidden { background: var(--bg4); color: transparent; }
</style>
