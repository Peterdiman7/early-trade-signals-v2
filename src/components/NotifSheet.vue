<template>
	<div class="notif-sheet-ov open" @click.self="$emit('close')">
		<div class="notif-sheet">
			<div class="notif-sheet-handle"></div>
			<div class="notif-sheet-head">
				<div class="notif-sheet-title">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round">
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
					Benachrichtigungen
					<span v-if="appStore.unreadCount > 0" class="notif-badge">{{ appStore.unreadCount }}</span>
				</div>
				<button class="notif-sheet-close" @click="$emit('close')">×</button>
			</div>
			<div class="notif-tabs">
				<button :class="['ntab', { on: activeTab === 'all' }]" @click="activeTab = 'all'">Alle</button>
				<button :class="['ntab', { on: activeTab === 'signal' }]" @click="activeTab = 'signal'">Signale</button>
				<button :class="['ntab', { on: activeTab === 'watchlist' }]"
					@click="activeTab = 'watchlist'">Watchlist</button>
			</div>
			<div class="notif-list">
				<div v-if="filtered.length === 0" class="notif-empty">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
						stroke-linecap="round">
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
					Keine Benachrichtigungen
				</div>
				<div v-for="n in filtered" :key="n.id" :class="['nl-item', n.type]" @click="appStore.markRead(n.id)">
					<div class="nl-top">
						<div class="nl-info">
							<div class="nl-title">{{ n.title }}</div>
							<div class="nl-msg">{{ n.message }}</div>
						</div>
						<div v-if="!n.read" class="unread-dot"></div>
					</div>
					<div class="nl-time">{{ n.time }}</div>
				</div>
				<div v-if="appStore.unreadCount > 0" style="text-align:center;padding:12px">
					<button class="mark-all-btn" @click="appStore.markAllRead()">Alle als gelesen markieren</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'

defineEmits(['close'])
const appStore = useAppStore()
const activeTab = ref('all')

const filtered = computed(() => {
	if (activeTab.value === 'all') return appStore.notifications
	return appStore.notifications.filter(n => n.type === activeTab.value)
})
</script>

<style scoped>
.notif-sheet-ov {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, .6);
	z-index: 600;
	backdrop-filter: blur(4px);
	display: flex;
	align-items: flex-end;
}

.notif-sheet {
	background: var(--bg2);
	border-radius: 22px 22px 0 0;
	width: 100%;
	max-height: 82vh;
	display: flex;
	flex-direction: column;
	animation: sheetUp .32s cubic-bezier(.34, 1.2, .64, 1);
}

.notif-sheet-handle {
	width: 36px;
	height: 4px;
	border-radius: 2px;
	background: var(--bdr2);
	margin: 10px auto 0;
}

.notif-sheet-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14px 18px 10px;
}

.notif-sheet-title {
	font-size: 17px;
	font-weight: 800;
	letter-spacing: -.03em;
	display: flex;
	align-items: center;
	gap: 8px;
}

.notif-badge {
	background: var(--r);
	color: #fff;
	font-size: 9px;
	font-weight: 700;
	padding: 2px 7px;
	border-radius: 100px;
}

.notif-sheet-close {
	width: 28px;
	height: 28px;
	border-radius: 8px;
	background: var(--bg3);
	border: 1px solid var(--bdr);
	cursor: pointer;
	font-size: 15px;
	color: var(--mu);
	display: flex;
	align-items: center;
	justify-content: center;
}

.notif-tabs {
	display: flex;
	gap: 3px;
	padding: 0 14px 10px;
}

.ntab {
	flex: 1;
	padding: 7px;
	border: 1px solid var(--bdr);
	border-radius: 9px;
	background: var(--bg3);
	color: var(--mu);
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
}

.ntab.on {
	background: var(--bg4);
	color: var(--tx);
	border-color: var(--bdr2);
}

.notif-list {
	overflow-y: auto;
	padding: 0 14px 24px;
	flex: 1;
}

.notif-empty {
	text-align: center;
	padding: 40px 20px;
	color: var(--mu);
	font-size: 13px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	opacity: .5;
}

.nl-item {
	background: var(--bg3);
	border: 1px solid var(--bdr);
	border-radius: 13px;
	padding: 13px;
	margin-bottom: 8px;
	cursor: pointer;
}

.nl-item.signal {
	border-left: 3px solid var(--g);
}

.nl-item.watchlist {
	border-left: 3px solid var(--b);
}

.nl-item.system {
	border-left: 3px solid var(--mu);
}

.nl-top {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 4px;
}

.nl-title {
	font-size: 13px;
	font-weight: 700;
}

.nl-msg {
	font-size: 11px;
	color: var(--mu);
	margin-top: 2px;
	line-height: 1.4;
}

.nl-time {
	font-family: var(--mono);
	font-size: 9px;
	color: var(--mu2);
}

.unread-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--g);
	flex-shrink: 0;
	margin-top: 3px;
}

.mark-all-btn {
	background: transparent;
	border: 1px solid var(--bdr2);
	border-radius: 9px;
	padding: 8px 16px;
	color: var(--mu);
	font-size: 11px;
	cursor: pointer;
}
</style>
