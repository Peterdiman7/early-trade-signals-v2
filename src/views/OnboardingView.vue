<template>
	<ion-page style="--ion-background-color:var(--bg)">
		<ion-content :fullscreen="true">
			<div class="modal" style="max-width:480px;margin:20px auto;padding:28px 24px">
				<!-- Step dots -->
				<div class="step-indicator">
					<div v-for="i in 3" :key="i" :class="['step-dot', { active: obStep === i - 1 }]"></div>
				</div>

				<!-- Step 0: Welcome -->
				<div v-if="obStep === 0">
					<div class="onboard-h">Willkommen! 👋</div>
					<div class="onboard-sub">Lass uns dein Profil einrichten, damit wir dir die besten Signale zeigen
						können.<br><br>Es dauert nur 60 Sekunden.</div>
					<div class="fg"><label>Wie möchtest du genannt werden?</label><input v-model="profile.name"
							type="text" placeholder="Dein Name" /></div>
					<div class="fg">
						<label>Trading-Erfahrung</label>
						<select v-model="profile.exp">
							<option value="beginner">Einsteiger (0–1 Jahr)</option>
							<option value="intermediate">Fortgeschritten (1–5 Jahre)</option>
							<option value="expert">Experte (5+ Jahre)</option>
						</select>
					</div>
					<button class="onboard-next" @click="obStep = 1">Weiter →</button>
				</div>

				<!-- Step 1: Risk -->
				<div v-else-if="obStep === 1">
					<div class="onboard-h">Deine Risikobereitschaft</div>
					<div class="onboard-sub">Wähle deinen Risikotyp — wir passen die Signalauswahl an.</div>
					<div class="risk-grid">
						<div v-for="r in riskOptions" :key="r.value"
							:class="['risk-card', { selected: profile.risk === r.value }]"
							@click="profile.risk = r.value">
							<span class="risk-ico">{{ r.icon }}</span>
							<div class="risk-name">{{ r.name }}</div>
							<div class="risk-desc">{{ r.desc }}</div>
						</div>
					</div>
					<button class="onboard-next" @click="obStep = 2">Weiter →</button>
					<button class="onboard-back" @click="obStep = 0">← Zurück</button>
				</div>

				<!-- Step 2: Horizon -->
				<div v-else>
					<div class="onboard-h">Dein Anlagehorizont</div>
					<div class="onboard-sub">Welche Signaltypen passen zu deinem Handelsstil?</div>
					<div class="horizon-btns">
						<div v-for="h in horizonOptions" :key="h.value"
							:class="['horizon-btn', { selected: profile.horizon === h.value }]"
							@click="profile.horizon = h.value">
							<span class="h-ico">{{ h.icon }}</span>
							<div>
								<div class="h-name">{{ h.name }}</div>
								<div class="h-desc">{{ h.desc }}</div>
							</div>
						</div>
					</div>
					<button class="onboard-next" @click="finish">Profil speichern ✓</button>
					<button class="onboard-back" @click="obStep = 1">← Zurück</button>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const obStep = ref(0)

const profile = ref({ name: authStore.user?.firstName || '', exp: 'intermediate', risk: 'conservative', horizon: 'medium' })

const riskOptions = [
	{ value: 'conservative', icon: '🛡️', name: 'Konservativ', desc: 'Geringe Volatilität, stabile Werte' },
	{ value: 'moderate', icon: '⚖️', name: 'Moderat', desc: 'Balance aus Sicherheit & Rendite' },
	{ value: 'aggressive', icon: '🚀', name: 'Aggressiv', desc: 'Hohe Rendite, höheres Risiko' },
	{ value: 'speculative', icon: '⚡', name: 'Spekulativ', desc: 'Maximale Chancen, hohes Risiko' }
]

const horizonOptions = [
	{ value: 'intraday', icon: '⚡', name: 'Intraday', desc: 'Eröffnung bis Börsenschluss · Min–Stunden' },
	{ value: 'short', icon: '📅', name: 'Kurzfristig', desc: '1–14 Tage · Swing Trading' },
	{ value: 'medium', icon: '📆', name: 'Mittelfristig', desc: '2–12 Wochen · Trendfolge' },
	{ value: 'long', icon: '🏔️', name: 'Langfristig', desc: '3+ Monate · Fundamentals' }
]

function finish() {
	authStore.updateProfile({
		firstName: profile.value.name || authStore.user?.firstName,
		experience: profile.value.exp as any,
		riskProfile: profile.value.risk as any,
		horizon: profile.value.horizon as any,
		onboardingComplete: true
	})
	router.push('/app/home')
}
</script>

<style scoped>
.step-indicator {
	display: flex;
	justify-content: center;
	gap: 6px;
	margin-bottom: 20px;
}

.step-dot {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: var(--bdr2);
	transition: all .3s;
}

.step-dot.active {
	background: var(--g);
	width: 20px;
	border-radius: 4px;
}

.onboard-h {
	font-size: 18px;
	font-weight: 800;
	letter-spacing: -.03em;
	text-align: center;
	margin-bottom: 6px;
}

.onboard-sub {
	font-size: 12px;
	color: var(--mu);
	text-align: center;
	margin-bottom: 20px;
	line-height: 1.6;
}

.fg {
	margin-bottom: 13px;
}

.fg label {
	font-size: 9px;
	text-transform: uppercase;
	letter-spacing: .1em;
	color: var(--mu);
	display: block;
	margin-bottom: 6px;
	font-family: var(--mono);
}

.fg input,
.fg select {
	width: 100%;
	background: var(--bg3);
	border: 1px solid var(--bdr);
	border-radius: 10px;
	padding: 12px 14px;
	color: var(--tx);
	font-family: var(--font);
	font-size: 13px;
	outline: none;
}

.fg select option {
	background: var(--bg3);
}

.risk-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
	margin-bottom: 18px;
}

.risk-card {
	background: var(--bg3);
	border: 2px solid var(--bdr);
	border-radius: 12px;
	padding: 14px;
	cursor: pointer;
	text-align: center;
}

.risk-card.selected {
	border-color: var(--g);
	background: rgba(22, 199, 132, .06);
}

.risk-ico {
	font-size: 24px;
	display: block;
	margin-bottom: 7px;
}

.risk-name {
	font-size: 12px;
	font-weight: 700;
	margin-bottom: 3px;
}

.risk-desc {
	font-size: 10px;
	color: var(--mu);
}

.horizon-btns {
	display: flex;
	flex-direction: column;
	gap: 7px;
	margin-bottom: 18px;
}

.horizon-btn {
	background: var(--bg3);
	border: 2px solid var(--bdr);
	border-radius: 11px;
	padding: 12px 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 12px;
	color: var(--tx);
}

.horizon-btn.selected {
	border-color: var(--g);
	background: rgba(22, 199, 132, .06);
}

.h-ico {
	font-size: 20px;
}

.h-name {
	font-size: 13px;
	font-weight: 700;
}

.h-desc {
	font-size: 10px;
	color: var(--mu);
	margin-top: 1px;
}

.onboard-next {
	width: 100%;
	background: var(--g);
	border: none;
	border-radius: 10px;
	padding: 14px;
	color: #000;
	font-weight: 700;
	font-size: 14px;
	cursor: pointer;
}

.onboard-back {
	width: 100%;
	background: transparent;
	border: 1px solid var(--bdr);
	border-radius: 10px;
	padding: 12px;
	color: var(--mu);
	font-weight: 600;
	font-size: 13px;
	cursor: pointer;
	margin-top: 8px;
}
</style>
