<template>
    <ion-page class="onboarding-page">
        <ion-content :fullscreen="true">
            <div class="onboarding-container">
                <!-- Progress bar -->
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${(step / totalSteps) * 100}%` }" />
                </div>

                <div class="step-counter font-mono">
                    {{ step }} / {{ totalSteps }}
                </div>

                <!-- Step 1: Name + Experience -->
                <Transition name="slide">
                    <div v-if="step === 1" key="step1" class="step">
                        <div class="step-icon">👋</div>
                        <h1 class="step-title">Welcome!</h1>
                        <p class="step-sub">Let's set up your profile. It only takes 60 seconds.</p>

                        <div class="form-group">
                            <label>How should we call you?</label>
                            <input v-model="profile.firstName" type="text" placeholder="Your first name"
                                class="et-input" />
                        </div>

                        <div class="form-group">
                            <label>Trading Experience</label>
                            <div class="option-list">
                                <button v-for="exp in experiences" :key="exp.value"
                                    :class="['option-btn', { active: profile.experience === exp.value }]"
                                    @click="profile.experience = exp.value">
                                    <span class="option-icon">{{ exp.icon }}</span>
                                    <div class="option-text">
                                        <span class="option-label">{{ exp.label }}</span>
                                        <span class="option-sub">{{ exp.sub }}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Step 2: Risk Profile -->
                <Transition name="slide">
                    <div v-if="step === 2" key="step2" class="step">
                        <div class="step-icon">⚖️</div>
                        <h1 class="step-title">Your Risk Tolerance</h1>
                        <p class="step-sub">We'll tailor signal quality and selection accordingly.</p>

                        <div class="risk-grid">
                            <button v-for="risk in riskProfiles" :key="risk.value"
                                :class="['risk-card', { active: profile.riskProfile === risk.value }]"
                                @click="profile.riskProfile = risk.value">
                                <span class="risk-icon">{{ risk.icon }}</span>
                                <span class="risk-label">{{ risk.label }}</span>
                                <span class="risk-sub">{{ risk.sub }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>

                <!-- Step 3: Horizon -->
                <Transition name="slide">
                    <div v-if="step === 3" key="step3" class="step">
                        <div class="step-icon">📅</div>
                        <h1 class="step-title">Your Investment Horizon</h1>
                        <p class="step-sub">Which signal types match your trading style?</p>

                        <div class="option-list">
                            <button v-for="h in horizons" :key="h.value"
                                :class="['option-btn', { active: profile.horizon === h.value }]"
                                @click="profile.horizon = h.value">
                                <span class="option-icon">{{ h.icon }}</span>
                                <div class="option-text">
                                    <span class="option-label">{{ h.label }}</span>
                                    <span class="option-sub">{{ h.sub }}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </Transition>

                <!-- Nav buttons -->
                <div class="step-nav">
                    <button v-if="step > 1" class="btn-back" @click="step--">← Back</button>
                    <button class="btn-next" :disabled="!canProceed" @click="handleNext">
                        {{ step === totalSteps ? 'Save Profile ✓' : 'Continue →' }}
                    </button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const totalSteps = 3

const profile = ref({
    firstName: authStore.user?.firstName || '',
    experience: '' as string,
    riskProfile: '' as string,
    horizon: '' as string
})

const canProceed = computed(() => {
    if (step.value === 1) return profile.value.firstName && profile.value.experience
    if (step.value === 2) return profile.value.riskProfile
    if (step.value === 3) return profile.value.horizon
    return false
})

async function handleNext() {
    if (step.value < totalSteps) {
        step.value++
    } else {
        authStore.updateProfile({
            firstName: profile.value.firstName,
            experience: profile.value.experience as any,
            riskProfile: profile.value.riskProfile as any,
            horizon: profile.value.horizon as any,
            onboardingComplete: true
        })
        router.push('/app/dashboard')
    }
}

const experiences = [
    { value: 'beginner', icon: '🌱', label: 'Beginner', sub: '0–1 year' },
    { value: 'intermediate', icon: '📈', label: 'Intermediate', sub: '1–5 years' },
    { value: 'expert', icon: '🎯', label: 'Expert', sub: '5+ years' }
]

const riskProfiles = [
    { value: 'conservative', icon: '🛡️', label: 'Conservative', sub: 'Low volatility, stable assets' },
    { value: 'moderate', icon: '⚖️', label: 'Moderate', sub: 'Balance of safety & return' },
    { value: 'aggressive', icon: '🚀', label: 'Aggressive', sub: 'Higher risk, more return' },
    { value: 'speculative', icon: '⚡', label: 'Speculative', sub: 'Maximum chance, high risk' }
]

const horizons = [
    { value: 'intraday', icon: '⚡', label: 'Intraday', sub: 'Open to close · Minutes–Hours' },
    { value: 'short', icon: '📅', label: 'Short-term', sub: '1–14 days · Swing trading' },
    { value: 'medium', icon: '📆', label: 'Medium-term', sub: '2–12 weeks · Trend following' },
    { value: 'long', icon: '🏔️', label: 'Long-term', sub: '3+ months · Fundamentals' }
]
</script>

<style scoped>
.onboarding-page {
    --ion-background-color: var(--et-bg);
}

.onboarding-container {
    min-height: 100vh;
    padding: 24px 24px 48px;
    display: flex;
    flex-direction: column;
}

.progress-bar {
    height: 3px;
    background: var(--et-surface-3);
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 12px;
}

.progress-fill {
    height: 100%;
    background: var(--et-accent);
    border-radius: 100px;
    transition: width 0.4s ease;
}

.step-counter {
    font-size: 12px;
    color: var(--et-text-muted);
    margin-bottom: 32px;
}

.step {
    flex: 1;
}

.step-icon {
    font-size: 40px;
    margin-bottom: 16px;
}

.step-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 10px;
    color: var(--et-text-primary);
}

.step-sub {
    font-size: 15px;
    color: var(--et-text-secondary);
    margin: 0 0 32px;
    line-height: 1.5;
}

/* Form */
.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--et-text-secondary);
    margin-bottom: 10px;
}

.et-input {
    width: 100%;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 16px;
    color: var(--et-text-primary);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.18s;
}

.et-input:focus {
    border-color: var(--et-accent);
}

.et-input::placeholder {
    color: var(--et-text-muted);
}

/* Options */
.option-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.18s;
}

.option-btn.active {
    border-color: var(--et-accent);
    background: var(--et-accent-glow);
}

.option-icon {
    font-size: 22px;
    flex-shrink: 0;
}

.option-text {
    display: flex;
    flex-direction: column;
}

.option-label {
    font-weight: 600;
    font-size: 15px;
    color: var(--et-text-primary);
}

.option-sub {
    font-size: 13px;
    color: var(--et-text-muted);
}

/* Risk grid */
.risk-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.risk-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 14px;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.18s;
    gap: 6px;
}

.risk-card.active {
    border-color: var(--et-accent);
    background: var(--et-accent-glow);
}

.risk-icon {
    font-size: 26px;
}

.risk-label {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 15px;
    color: var(--et-text-primary);
}

.risk-sub {
    font-size: 12px;
    color: var(--et-text-muted);
    line-height: 1.4;
}

/* Navigation */
.step-nav {
    display: flex;
    gap: 12px;
    margin-top: 32px;
}

.btn-back {
    padding: 14px 20px;
    background: var(--et-surface);
    border: 1px solid var(--et-border);
    color: var(--et-text-secondary);
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
}

.btn-next {
    flex: 1;
    padding: 14px;
    background: var(--et-accent);
    border: none;
    color: #080c14;
    border-radius: 10px;
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
}

.btn-next:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Transition */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>