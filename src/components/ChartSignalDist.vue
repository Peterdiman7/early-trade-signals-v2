<template>
	<div class="chart-wrap" ref="wrapEl">
		<canvas ref="canvasEl"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps<{ height?: number }>()
const canvasEl = ref<HTMLCanvasElement>()
const appStore = useAppStore()
let chart: any = null

function genLabels(days: number) {
	const lb = [], now = new Date()
	for (let i = days - 1; i >= 0; i--) {
		const dd = new Date(now); dd.setDate(dd.getDate() - i)
		lb.push(dd.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }))
	}
	return lb
}

function buildChart() {
	if (!canvasEl.value) return
	const Chart = (window as any).Chart
	if (!Chart) return

	if (chart) { chart.destroy(); chart = null }

	const days = 30, lb = genLabels(days)
	const bd: number[] = [], hd: number[] = [], sd: number[] = []
	for (let i = 0; i < days; i++) {
		const t = 22 + Math.floor(Math.random() * 8)
		const b = Math.floor(t * .38 + Math.random() * 4)
		const s = Math.floor(t * .22 + Math.random() * 3)
		bd.push(b); hd.push(t - b - s); sd.push(s)
	}

	const gc = appStore.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'
	const tc = appStore.darkMode ? '#4a5568' : '#8a9ab5'

	chart = new Chart(canvasEl.value.getContext('2d'), {
		type: 'bar',
		data: {
			labels: lb,
			datasets: [
				{ label: 'BUY', data: bd, backgroundColor: 'rgba(22,199,132,.7)', borderRadius: 2 },
				{ label: 'HOLD', data: hd, backgroundColor: 'rgba(240,185,11,.55)', borderRadius: 2 },
				{ label: 'SELL', data: sd, backgroundColor: 'rgba(234,57,67,.55)', borderRadius: 2 }
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: { backgroundColor: appStore.darkMode ? '#131720' : '#ffffff', titleColor: tc, bodyColor: tc }
			},
			scales: {
				x: { stacked: true, grid: { color: gc }, ticks: { color: tc, font: { size: 8 }, maxTicksLimit: 6 } },
				y: { stacked: true, grid: { color: gc }, ticks: { color: tc, font: { size: 8 } } }
			}
		}
	})
}

function loadChartJs(cb: () => void) {
	if ((window as any).Chart) { cb(); return }
	const s = document.createElement('script')
	s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js'
	s.onload = cb
	document.head.appendChild(s)
}

onMounted(() => loadChartJs(() => buildChart()))
watch(() => appStore.darkMode, () => buildChart())
onUnmounted(() => { if (chart) chart.destroy() })
</script>

<style scoped>
.chart-wrap {
	position: relative;
	height: v-bind("(props.height || 170) + 'px'");
}

canvas {
	width: 100% !important;
}
</style>
