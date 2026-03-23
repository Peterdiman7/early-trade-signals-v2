<template>
  <ion-page class="landing-page">
    <ion-content :fullscreen="true" :scroll-y="true">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg" />
        <div class="hero-grid" />

        <nav class="top-nav fade-up">
          <div class="brand">
            <span class="brand-icon">⚡</span>
            <span class="brand-name">EarlyTrade</span>
          </div>
          <div class="nav-actions">
            <button class="btn-ghost" @click="openModal('login')">Login</button>
            <button class="btn-primary" @click="openModal('register')">Get Started</button>
          </div>
        </nav>

        <div class="hero-content">
          <div class="live-badge fade-up" style="animation-delay:0.1s">
            <span class="live-dot" />
            Live · 17 Markets · AI-Powered
          </div>

          <h1 class="hero-title fade-up" style="animation-delay:0.2s">
            Professional Signals<br />
            for <em>Smart Traders</em>
          </h1>

          <p class="hero-sub fade-up" style="animation-delay:0.3s">
            Real-time trading signals for Forex & Stocks — AI-driven,<br class="hide-sm" />
            daily updated, personalized to your risk profile.
          </p>

          <div class="hero-cta fade-up" style="animation-delay:0.4s">
            <button class="btn-large" @click="openModal('register')">
              Start for free →
            </button>
            <p class="cta-sub">Already have an account? <a @click="openModal('login')">Login</a></p>
          </div>

          <div class="social-proof fade-up" style="animation-delay:0.5s">
            <div class="avatars">
              <span>👨‍💼</span><span>👩‍💼</span><span>🧑‍💼</span>
            </div>
            <span class="proof-text"><strong>2,400+</strong> active traders</span>
          </div>

          <!-- Live signal preview -->
          <div class="signal-preview fade-up stagger" style="animation-delay:0.6s">
            <div v-for="s in previewSignals" :key="s.ticker"
                 class="preview-card"
                 :class="s.type.toLowerCase()">
              <img :src="s.logo" :alt="s.ticker" @error="imgFallback" />
              <div class="preview-info">
                <span class="preview-ticker">{{ s.ticker }}</span>
                <span class="preview-name">{{ s.shortName }}</span>
              </div>
              <div class="preview-right">
                <span class="preview-price">${{ s.price }}</span>
                <span :class="['signal-badge', s.type.toLowerCase()]">
                  {{ s.type }} {{ s.changePct > 0 ? '+' : '' }}{{ s.changePct }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="section-label">What We Offer</div>
        <h2 class="section-title">Everything for success — <em>at a glance</em></h2>

        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card et-card">
            <span class="feature-icon">{{ f.icon }}</span>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>

        <!-- Stats bar -->
        <div class="stats-bar">
          <div v-for="s in stats" :key="s.label" class="stats-item">
            <span class="stats-value font-mono">{{ s.value }}</span>
            <span class="stats-label">{{ s.label }}</span>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <div class="section-label">What Traders Say</div>
        <div class="testimonials-grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card et-card">
            <div class="stars">★★★★★</div>
            <p>"{{ t.quote }}"</p>
            <div class="testimonial-author">
              <span class="author-avatar">{{ t.avatar }}</span>
              <div>
                <div class="author-name">{{ t.name }}</div>
                <div class="author-role">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="pricing">
        <div class="section-label">Simple Pricing</div>
        <h2 class="section-title">Cancel anytime. No hidden fees.</h2>

        <div class="pricing-grid">
          <div class="plan-card et-card">
            <div class="plan-name">Basic</div>
            <div class="plan-price">€0 <span>/month</span></div>
            <ul class="plan-features">
              <li>5 signals daily</li>
              <li>Watchlist (5 positions)</li>
              <li>Backtracking</li>
              <li class="disabled">AI Analysis & News</li>
            </ul>
            <button class="btn-outline" @click="openModal('register')">Start free →</button>
          </div>

          <div class="plan-card et-card plan-popular">
            <div class="plan-badge">Most Popular</div>
            <div class="plan-name">Pro</div>
            <div class="plan-price">€29 <span>/month</span></div>
            <div class="plan-yearly">or €249/year — save 28%</div>
            <ul class="plan-features">
              <li>Unlimited signals</li>
              <li>Full backtracking</li>
              <li>AI Analysis & News sentiment</li>
              <li>Portfolio tracking</li>
              <li>Push notifications</li>
            </ul>
            <button class="btn-primary" @click="openModal('register')">14 days free →</button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-name">EarlyTrade</span>
        </div>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
        <div class="footer-copy">© 2026 Early Trade Signals · info@early-trade-signals.com</div>
      </footer>
    </ion-content>

    <!-- Auth Modal -->
    <AuthModal v-if="showModal" :mode="modalMode" @close="showModal = false" @success="handleAuthSuccess" />
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

function handleAuthSuccess() {
  showModal.value = false
  if (!authStore.user?.onboardingComplete) {
    router.push('/onboarding')
  } else {
    router.push('/app/dashboard')
  }
}

function imgFallback(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const previewSignals = [
  { ticker: 'AAPL', shortName: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com', type: 'BUY', price: '264.58', changePct: 2.1 },
  { ticker: 'NVDA', shortName: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com', type: 'BUY', price: '822.33', changePct: 3.4 },
  { ticker: 'AMD', shortName: 'Advanced Micro', logo: 'https://logo.clearbit.com/amd.com', type: 'SELL', price: '200.15', changePct: -2.3 }
]

const features = [
  { icon: '📊', title: 'Live Signals', desc: 'BUY, HOLD & SELL in real-time.' },
  { icon: '🎯', title: 'Signal Quality', desc: '5-star rating with our algorithm.' },
  { icon: '🔬', title: 'AI Analysis', desc: 'News sentiment & fundamentals.' },
  { icon: '⏱', title: 'Backtracking', desc: 'Historical signal performance.' },
  { icon: '⭐', title: 'Watchlist', desc: 'Track price changes & duration.' },
  { icon: '🔔', title: 'Push Signals', desc: 'Notifications for new signals.' }
]

const stats = [
  { value: '500+', label: 'Signals/month' },
  { value: '73%', label: 'Avg. Win Rate' },
  { value: '2.4k', label: 'Active Users' },
  { value: '17', label: 'Markets' }
]

const testimonials = [
  {
    quote: 'The backtracking feature helped me truly trust my strategy.',
    name: 'Marcus H.',
    role: 'Pro Member since 2024',
    avatar: '👨‍💼'
  },
  {
    quote: 'The news sentiment analysis is a real game-changer for my decisions.',
    name: 'Sandra K.',
    role: 'Forex Trader · Pro',
    avatar: '👩‍💼'
  }
]
</script>

<style scoped>
.landing-page {
  --ion-background-color: var(--et-bg);
}

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,179,237,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.07) 0%, transparent 50%);
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* Nav */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  position: relative;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  color: var(--et-text-primary);
}

.brand-icon { font-size: 20px; }

.nav-actions {
  display: flex;
  gap: 10px;
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--et-border);
  color: var(--et-text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-ghost:hover { border-color: var(--et-accent); color: var(--et-accent); }

.btn-primary {
  background: var(--et-accent);
  border: none;
  color: #080c14;
  padding: 8px 18px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-primary:hover { filter: brightness(1.1); }

/* Hero content */
.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 24px 48px;
  position: relative;
  z-index: 5;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99,179,237,0.1);
  border: 1px solid rgba(99,179,237,0.2);
  border-radius: 100px;
  padding: 6px 14px;
  font-size: 12px;
  color: var(--et-accent);
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  margin-bottom: 24px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 8vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: var(--et-text-primary);
  margin: 0 0 18px;
  letter-spacing: -0.02em;
}

.hero-title em {
  font-style: normal;
  color: var(--et-accent);
}

.hero-sub {
  font-size: 16px;
  color: var(--et-text-secondary);
  line-height: 1.6;
  margin: 0 0 32px;
  max-width: 420px;
}

.btn-large {
  background: var(--et-accent);
  border: none;
  color: #080c14;
  padding: 14px 32px;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 280px;
}
.btn-large:hover { filter: brightness(1.1); transform: translateY(-1px); }

.cta-sub {
  font-size: 13px;
  color: var(--et-text-muted);
  margin-top: 12px;
}
.cta-sub a {
  color: var(--et-accent);
  cursor: pointer;
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
}

.avatars { display: flex; gap: 4px; font-size: 22px; }
.proof-text { font-size: 13px; color: var(--et-text-secondary); }
.proof-text strong { color: var(--et-text-primary); }

/* Signal preview */
.signal-preview {
  width: 100%;
  max-width: 380px;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--et-surface);
  border: 1px solid var(--et-border);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.preview-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
}

.preview-card.buy::before { background: var(--et-buy); }
.preview-card.sell::before { background: var(--et-sell); }

.preview-card img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
  background: var(--et-surface-3);
  padding: 4px;
}

.preview-info { flex: 1; text-align: left; }
.preview-ticker { display: block; font-family: var(--font-display); font-weight: 700; font-size: 14px; }
.preview-name { font-size: 11px; color: var(--et-text-muted); }

.preview-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.preview-price { font-family: var(--font-mono); font-size: 14px; font-weight: 600; }

/* Features */
.features, .testimonials, .pricing {
  padding: 64px 24px;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--et-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 6vw, 36px);
  font-weight: 800;
  color: var(--et-text-primary);
  margin: 0 0 40px;
  line-height: 1.2;
}

.section-title em {
  font-style: normal;
  color: var(--et-accent);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 40px;
}

.feature-card {
  padding: 20px 16px;
}

.feature-icon { font-size: 24px; display: block; margin-bottom: 10px; }
.feature-card h3 { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin: 0 0 6px; }
.feature-card p { font-size: 13px; color: var(--et-text-secondary); margin: 0; line-height: 1.5; }

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: var(--et-surface);
  border: 1px solid var(--et-border);
  border-radius: 12px;
  padding: 20px;
}

.stats-item { text-align: center; }
.stats-value { display: block; font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--et-accent); }
.stats-label { font-size: 11px; color: var(--et-text-muted); margin-top: 4px; display: block; }

/* Testimonials */
.testimonials-grid { display: flex; flex-direction: column; gap: 14px; }

.testimonial-card { }
.stars { color: #f6c90e; font-size: 14px; margin-bottom: 10px; }
.testimonial-card p { font-size: 15px; color: var(--et-text-secondary); line-height: 1.6; margin: 0 0 16px; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 10px; }
.author-avatar { font-size: 28px; }
.author-name { font-weight: 600; font-size: 14px; }
.author-role { font-size: 12px; color: var(--et-text-muted); }

/* Pricing */
.pricing-grid { display: flex; flex-direction: column; gap: 16px; }

.plan-card {
  position: relative;
}

.plan-popular {
  border-color: var(--et-accent) !important;
  background: linear-gradient(135deg, var(--et-surface) 0%, rgba(99,179,237,0.05) 100%);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--et-accent);
  color: #080c14;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 14px;
  border-radius: 100px;
  white-space: nowrap;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}

.plan-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
}

.plan-price {
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 700;
  color: var(--et-text-primary);
  margin-bottom: 4px;
}
.plan-price span { font-size: 16px; color: var(--et-text-secondary); }
.plan-yearly { font-size: 12px; color: var(--et-accent); margin-bottom: 20px; }

.plan-features { list-style: none; padding: 0; margin: 0 0 24px; }
.plan-features li {
  padding: 8px 0;
  font-size: 14px;
  color: var(--et-text-secondary);
  border-bottom: 1px solid var(--et-border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.plan-features li::before { content: '✓'; color: var(--et-buy); font-size: 12px; }
.plan-features li.disabled { color: var(--et-text-muted); }
.plan-features li.disabled::before { content: '✕'; color: var(--et-text-muted); }

.btn-outline {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid var(--et-border);
  color: var(--et-text-secondary);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-outline:hover { border-color: var(--et-accent); color: var(--et-accent); }

.plan-popular .btn-primary {
  width: 100%;
  padding: 12px;
  font-size: 15px;
}

/* Footer */
.landing-footer {
  padding: 32px 24px 48px;
  border-top: 1px solid var(--et-border);
  text-align: center;
}
.footer-brand { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; font-family: var(--font-display); font-size: 16px; font-weight: 700; }
.footer-links { display: flex; gap: 20px; justify-content: center; margin-bottom: 12px; }
.footer-links a { font-size: 13px; color: var(--et-text-muted); text-decoration: none; }
.footer-copy { font-size: 12px; color: var(--et-text-muted); }

.hide-sm { display: none; }
</style>