<template>
  <ion-page class="landing-page">
    <ion-content :fullscreen="true" :scroll-y="true">

      <!-- NAV -->
      <nav class="lnav">
        <div class="brand">
          <div class="brand-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round">
              <polyline points="3 17 8 12 13 15 21 7" />
              <polyline points="17 7 21 7 21 11" />
            </svg>
          </div>
          <div class="brand-name">Early<span>Trade</span> Signals</div>
        </div>
        <div class="lnav-btns">
          <button class="btn-ghost" @click="openModal('login')">Login</button>
          <button class="btn-solid" @click="openModal('register')">Kostenlos starten</button>
        </div>
      </nav>

      <!-- HERO -->
      <section class="hero-sec">
        <div class="hbg-grid"></div>
        <div class="hbg-g1"></div>
        <div class="hbg-g2"></div>
        <div class="hero-content">
          <div class="hero-tag">
            <span class="live-dot"></span>
            <span>Live · 17 Märkte · KI-gestützt</span>
          </div>
          <h1 class="hero-h">Professionelle<br>Signale für <span class="italic">smarte</span><br>Trader</h1>
          <p class="hero-p">Echtzeit-Handelssignale für Forex & Aktien — KI-gestützt, täglich aktualisiert,
            personalisiert nach deinem Risikoprofil.</p>
          <div class="hero-actions">
            <button class="hero-main-btn" @click="openModal('register')">
              Jetzt kostenlos registrieren <span class="arr">→</span>
            </button>
            <button class="hero-sec-btn" @click="openModal('login')">Ich habe bereits ein Konto</button>
          </div>
          <div class="hero-proof">
            <div class="proof-avs">
              <div class="pav">👨‍💼</div>
              <div class="pav">👩‍💼</div>
              <div class="pav">🧑‍💼</div>
            </div>
            <span><strong>2.400+</strong> aktive Trader</span>
          </div>
          <div class="hero-preview">
            <div class="pv-cards">
              <div v-for="s in previewSignals" :key="s.ticker" class="pvc">
                <div class="pvc-logo">
                  <img :src="s.logo" @error="imgFallback" alt="" />
                </div>
                <div class="pvc-info">
                  <div class="pvc-ticker">{{ s.ticker }}</div>
                  <div class="pvc-name">{{ s.name }}</div>
                </div>
                <div class="pvc-right">
                  <div class="pvc-price">${{ s.price }}</div>
                  <div :class="['sig-chip', s.type]">{{ s.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MARQUEE -->
      <div class="marquee-wrap">
        <div class="marquee-inner">
          <div v-for="(s, i) in [...marqueeItems, ...marqueeItems]" :key="i" :class="['mi', s.up ? 'up' : 'down']">
            <img :src="s.logo" @error="imgFallback" alt="" />
            <span>{{ s.ticker }}</span>
            <span class="mp">${{ s.price }}</span>
            <span :style="{ color: s.up ? 'var(--g)' : 'var(--r)' }">{{ s.up ? '+' : '' }}{{ s.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- FEATURES -->
      <section class="feat-sec">
        <div class="feat-label">Was wir bieten</div>
        <h2 class="feat-h">Alles für den<br>Erfolg — <em>auf einen Blick</em></h2>
        <div class="feat-grid">
          <div v-for="f in features" :key="f.title" class="feat-card">
            <div :class="['feat-icon', f.color]">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <div class="stats-bar">
        <div class="stats-inner">
          <div v-for="s in statsItems" :key="s.label" class="si">
            <div class="si-n">{{ s.value }}</div>
            <div class="si-l">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- REVIEWS -->
      <section class="reviews-sec">
        <div class="reviews-h">Was Trader sagen</div>
        <div v-for="r in reviews" :key="r.name" class="review">
          <div class="rev-stars">★★★★★</div>
          <p class="rev-text">"{{ r.text }}"</p>
          <div class="rev-author">
            <div class="rev-av">{{ r.av }}</div>
            <div>
              <div class="rev-name">{{ r.name }}</div>
              <div class="rev-role">{{ r.role }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICING -->
      <section class="pricing-sec">
        <div class="pricing-h">Einfache Preise</div>
        <p class="pricing-sub">Jederzeit kündbar. Keine versteckten Kosten.</p>
        <div class="price-cards">
          <div class="price-card">
            <div class="price-name">Basis</div>
            <div class="price-amt">€0 <span>/ Monat</span></div>
            <div class="price-period">Kostenlos starten</div>
            <ul class="price-feats">
              <li>5 Signale täglich</li>
              <li>Watchlist (5 Positionen)</li>
              <li class="no">Backtracking</li>
              <li class="no">KI-Analyse & News</li>
            </ul>
            <button class="price-btn-ghost" @click="openModal('register')">Jetzt starten →</button>
          </div>
          <div class="price-card featured">
            <div class="feat-tag">Beliebteste</div>
            <div class="price-name">Pro</div>
            <div class="price-amt">€29 <span>/ Monat</span></div>
            <div class="price-period">Oder €249/Jahr — spare 28%</div>
            <ul class="price-feats">
              <li>Unbegrenzte Signale</li>
              <li>Vollständiges Backtracking</li>
              <li>KI-Analyse & News-Sentiment</li>
              <li>Portfolio-Tracking</li>
              <li>Push-Benachrichtigungen</li>
            </ul>
            <button class="price-btn-main" @click="openModal('register')">14 Tage kostenlos →</button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="land-footer">
        <div class="brand" style="margin-bottom:12px">
          <div class="brand-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round">
              <polyline points="3 17 8 12 13 15 21 7" />
              <polyline points="17 7 21 7 21 11" />
            </svg>
          </div>
          <div class="brand-name">Early<span>Trade</span></div>
        </div>
        <p>Pulse Entertainment Services LTD · 1125 E Broadway Blvd #14, Glendale, CA 91205</p>
        <div class="land-footer-links">
          <a href="#">Datenschutz</a>
          <a href="#">AGB</a>
          <a href="#">Impressum</a>
          <a href="#">Kontakt</a>
        </div>
        <div class="land-footer-copy">© 2026 Early Trade Signals · info@early-trade-signals.com</div>
      </footer>

    </ion-content>

    <!-- AUTH MODAL -->
    <AuthModal v-if="showModal" :mode="modalMode" @close="showModal = false" @success="handleSuccess" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthModal from '@/components/AuthModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const showModal = ref(false)
const modalMode = ref<'login' | 'register'>('register')

function openModal(mode: 'login' | 'register') {
  modalMode.value = mode
  showModal.value = true
}

function handleSuccess() {
  showModal.value = false
  if (!authStore.user?.onboardingComplete) router.push('/onboarding')
  else router.push('/app/home')
}

function imgFallback(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}

const previewSignals = [
  { ticker: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com', price: '264.58', type: 'buy', label: 'BUY +2.1%' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com', price: '822.33', type: 'buy', label: 'BUY +3.4%' },
  { ticker: 'AMD', name: 'Advanced Micro', logo: 'https://logo.clearbit.com/amd.com', price: '200.15', type: 'sell', label: 'SELL −2.3%' }
]

const marqueeItems = [
  { ticker: 'AAPL', logo: 'https://logo.clearbit.com/apple.com', price: '264.58', pct: 2.14, up: true },
  { ticker: 'NVDA', logo: 'https://logo.clearbit.com/nvidia.com', price: '822.33', pct: 3.42, up: true },
  { ticker: 'MSFT', logo: 'https://logo.clearbit.com/microsoft.com', price: '391.45', pct: 0.95, up: true },
  { ticker: 'AMD', logo: 'https://logo.clearbit.com/amd.com', price: '200.15', pct: -2.31, up: false },
  { ticker: 'TSLA', logo: 'https://logo.clearbit.com/tesla.com', price: '348.12', pct: 1.55, up: true },
  { ticker: 'META', logo: 'https://logo.clearbit.com/meta.com', price: '541.22', pct: 2.03, up: true }
]

const features = [
  { icon: '📊', title: 'Live-Signale', desc: 'BUY, HOLD & SELL in Echtzeit.', color: 'g' },
  { icon: '🎯', title: 'Signal-Qualität', desc: '5-Sterne Bewertung mit Algorithmus.', color: 'p' },
  { icon: '🔬', title: 'KI-Analyse', desc: 'News-Sentiment & Fundamentaldaten.', color: 'b' },
  { icon: '⏱', title: 'Backtracking', desc: 'Historische Performance der Signale.', color: 'y' },
  { icon: '⭐', title: 'Watchlist', desc: 'Kursveränderung & Haltedauer live.', color: 'r' },
  { icon: '🔔', title: 'Push-Signale', desc: 'Benachrichtigungen bei neuen Signalen.', color: 'g' }
]

const statsItems = [
  { value: '500+', label: 'Signale/Monat' },
  { value: '73%', label: 'Ø Win Rate' },
  { value: '2.4k', label: 'Aktive Nutzer' },
  { value: '17', label: 'Märkte' }
]

const reviews = [
  { text: 'Das Backtracking-Feature hat mir geholfen, meiner Strategie wirklich zu vertrauen.', name: 'Marcus H.', role: 'Pro-Mitglied seit 2024', av: '👨‍💼' },
  { text: 'Die News-Sentiment-Analyse ist ein echter Gamechanger für meine Entscheidungen.', name: 'Sandra K.', role: 'Forex-Traderin · Pro', av: '👩‍💼' }
]
</script>

<style scoped>
.landing-page {
  --ion-background-color: var(--bg);
}

/* NAV */
.lnav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid var(--bdr);
  background: rgba(11, 14, 17, .92);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(20px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.brand-dot {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--g);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-dot svg {
  width: 17px;
  height: 17px;
}

.brand-name {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -.03em;
  color: var(--tx);
}

.brand-name span {
  color: var(--g);
}

.lnav-btns {
  display: flex;
  gap: 7px;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--bdr2);
  border-radius: 9px;
  padding: 8px 15px;
  color: var(--tx);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-solid {
  background: var(--g);
  border: none;
  border-radius: 9px;
  padding: 8px 15px;
  color: #000;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

/* HERO */
.hero-sec {
  flex: 1;
  padding: 52px 22px 36px;
  position: relative;
  overflow: hidden;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hbg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, .035) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.hbg-g1 {
  position: absolute;
  top: -10%;
  left: -5%;
  width: 60%;
  height: 60%;
  background: radial-gradient(ellipse, rgba(22, 199, 132, .09), transparent 65%);
  pointer-events: none;
}

.hbg-g2 {
  position: absolute;
  bottom: -5%;
  right: -5%;
  width: 45%;
  height: 55%;
  background: radial-gradient(ellipse, rgba(79, 142, 247, .07), transparent 65%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  max-width: 520px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--gg);
  border: 1px solid rgba(22, 199, 132, .22);
  border-radius: 100px;
  padding: 5px 13px 5px 7px;
  margin-bottom: 24px;
}

.hero-tag .live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--g);
  animation: blink 1.8s ease infinite;
}

.hero-tag span {
  font-size: 10px;
  color: var(--g);
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.hero-h {
  font-size: clamp(34px, 8vw, 54px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.04em;
  margin-bottom: 12px;
}

.hero-h .italic {
  font-family: var(--serif);
  font-style: italic;
  color: var(--g);
  font-weight: 400;
}

.hero-p {
  font-size: 15px;
  color: var(--mu);
  line-height: 1.7;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 36px;
}

.hero-main-btn {
  background: var(--g);
  border: none;
  border-radius: 13px;
  padding: 17px 26px;
  color: #000;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: all .2s;
}

.hero-main-btn:active {
  transform: translateY(-2px);
}

.hero-sec-btn {
  background: transparent;
  border: 1px solid var(--bdr2);
  border-radius: 13px;
  padding: 17px 26px;
  color: var(--tx);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.hero-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--mu);
}

.proof-avs {
  display: flex;
}

.pav {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--bg);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg3);
  margin-left: -7px;
}

.pav:first-child {
  margin-left: 0;
}

.hero-preview {
  margin-top: 36px;
  background: var(--bg2);
  border: 1px solid var(--bdr2);
  border-radius: 18px;
  padding: 14px;
}

.pv-cards {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pvc {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border-radius: 10px;
  background: var(--bg3);
}

.pvc-logo {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--bg4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pvc-logo img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.pvc-info {
  flex: 1;
}

.pvc-ticker {
  font-weight: 800;
  font-size: 13px;
}

.pvc-name {
  font-size: 9px;
  color: var(--mu);
  margin-top: 1px;
}

.pvc-right {
  text-align: right;
}

.pvc-price {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
}

.sig-chip {
  font-size: 8px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 2px;
}

.sig-chip.buy {
  background: rgba(22, 199, 132, .12);
  color: var(--g);
}

.sig-chip.sell {
  background: rgba(234, 57, 67, .12);
  color: var(--r);
}

/* MARQUEE */
.marquee-wrap {
  background: var(--bg2);
  border-top: 1px solid var(--bdr);
  border-bottom: 1px solid var(--bdr);
  padding: 11px 0;
  overflow: hidden;
}

.marquee-inner {
  display: inline-flex;
  gap: 36px;
  animation: marquee 28s linear infinite;
  white-space: nowrap;
}

.mi {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--mu);
}

.mi img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 2px;
}

.mi .mp {
  color: var(--tx);
  font-weight: 700;
}

.mi.up .mp {
  color: var(--g);
}

.mi.down .mp {
  color: var(--r);
}

/* FEATURES */
.feat-sec {
  padding: 56px 22px;
}

.feat-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--g);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.feat-label::before {
  content: '';
  width: 20px;
  height: 1px;
  background: var(--g);
}

.feat-h {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 800;
  letter-spacing: -.04em;
  margin-bottom: 36px;
  line-height: 1.15;
}

.feat-h em {
  font-family: var(--serif);
  font-style: italic;
  color: var(--g);
  font-weight: 400;
}

.feat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.feat-card {
  background: var(--bg2);
  border: 1px solid var(--bdr);
  border-radius: 16px;
  padding: 18px;
}

.feat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  margin-bottom: 12px;
}

.feat-icon.g {
  background: rgba(22, 199, 132, .1);
}

.feat-icon.b {
  background: rgba(79, 142, 247, .1);
}

.feat-icon.y {
  background: rgba(240, 185, 11, .1);
}

.feat-icon.r {
  background: rgba(234, 57, 67, .1);
}

.feat-icon.p {
  background: rgba(168, 85, 247, .1);
}

.feat-card h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.feat-card p {
  font-size: 11px;
  color: var(--mu);
  line-height: 1.6;
}

/* STATS */
.stats-bar {
  background: var(--bg2);
  border-top: 1px solid var(--bdr);
  border-bottom: 1px solid var(--bdr);
  padding: 28px 22px;
}

.stats-inner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.si {
  text-align: center;
}

.si-n {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--g);
}

.si-l {
  font-size: 11px;
  color: var(--mu);
  margin-top: 3px;
}

/* REVIEWS */
.reviews-sec {
  padding: 44px 22px;
}

.reviews-h {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -.03em;
  margin-bottom: 18px;
  text-align: center;
}

.review {
  background: var(--bg2);
  border: 1px solid var(--bdr);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 10px;
}

.rev-stars {
  color: var(--y);
  font-size: 12px;
  margin-bottom: 7px;
}

.rev-text {
  font-size: 12px;
  color: var(--mu);
  line-height: 1.65;
  margin-bottom: 9px;
  font-style: italic;
}

.rev-author {
  display: flex;
  align-items: center;
  gap: 7px;
}

.rev-av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.rev-name {
  font-size: 11px;
  font-weight: 700;
}

.rev-role {
  font-size: 9px;
  color: var(--mu);
}

/* PRICING */
.pricing-sec {
  padding: 44px 22px;
}

.pricing-h {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -.03em;
  margin-bottom: 5px;
  text-align: center;
}

.pricing-sub {
  font-size: 12px;
  color: var(--mu);
  text-align: center;
  margin-bottom: 24px;
}

.price-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-card {
  background: var(--bg2);
  border: 1px solid var(--bdr);
  border-radius: 18px;
  padding: 22px;
}

.price-card.featured {
  border-color: var(--g);
  background: linear-gradient(135deg, rgba(22, 199, 132, .05), transparent);
}

.feat-tag {
  background: var(--g);
  color: #000;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.price-name {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 3px;
}

.price-amt {
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 700;
  margin: 8px 0 3px;
}

.price-amt span {
  font-size: 14px;
  font-weight: 400;
  color: var(--mu);
}

.price-period {
  font-size: 10px;
  color: var(--mu);
  margin-bottom: 16px;
}

.price-feats {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.price-feats li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--mu);
}

.price-feats li::before {
  content: '✓';
  color: var(--g);
  font-weight: 700;
}

.price-feats li.no {
  color: var(--mu2);
}

.price-feats li.no::before {
  content: '×';
  color: var(--mu2);
}

.price-btn-main {
  width: 100%;
  background: var(--g);
  border: none;
  border-radius: 11px;
  padding: 14px;
  color: #000;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.price-btn-ghost {
  width: 100%;
  background: transparent;
  border: 1px solid var(--bdr2);
  border-radius: 11px;
  padding: 14px;
  color: var(--tx);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

/* FOOTER */
.land-footer {
  background: var(--bg2);
  border-top: 1px solid var(--bdr);
  padding: 28px 22px 36px;
}

.land-footer p {
  font-size: 11px;
  color: var(--mu);
  line-height: 1.8;
}

.land-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 14px 0;
}

.land-footer-links a {
  font-size: 11px;
  color: var(--mu);
  text-decoration: none;
}

.land-footer-copy {
  font-size: 10px;
  color: var(--mu2);
  font-family: var(--mono);
}
</style>