<template>
	<div class="chart-wrap" ref="wrapEl">
		<canvas ref="canvasEl"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps<{ height?: number }>()
const wrapEl = ref<HTMLElement>()
const canvasEl = ref<HTMLCanvasElement>()
const appStore = useAppStore()
let chart: any = null

function genReturn(days: number, vol: number, trend: number) {
	const d = [0]; let v = 0
	for (let i = 1; i < days; i++) {
		v += trend + (Math.random() - .48) * vol
		d.push(parseFloat(v.toFixed(2)))
	}
	return d
}

function genLabels(days: number) {
	const lb = [], now = new Date()
	for (let i = days - 1; i >= 0; i--) {
		const dd = new Date(now); dd.setDate(dd.getDate() - i)
		lb.push(dd.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }))
	}
	return lb
}

function getGridColor() {
	return appStore.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'
}
function getTickColor() {
	return appStore.darkMode ? '#4a5568' : '#8a9ab5'
}

function buildChart() {
	if (!canvasEl.value) return
	const Chart = (window as any).Chart
	if (!Chart) return

	if (chart) { chart.destroy(); chart = null }

	const days = 180
	const lb = genLabels(days)
	const sp = genReturn(days, .8, .06)
	const nq = genReturn(days, 1.1, .09)
	const dow = genReturn(days, .65, .05)

	const gc = getGridColor(); const tc = getTickColor()

	chart = new Chart(canvasEl.value.getContext('2d'), {
		type: 'line',
		data: {
			labels: lb,
			datasets: [
				{ label: 'S&P 500', data: sp, borderColor: '#16c784', borderWidth: 2, tension: .35, pointRadius: 0, fill: false },
				{ label: 'NASDAQ', data: nq, borderColor: '#4f8ef7', borderWidth: 2, tension: .35, pointRadius: 0, fill: false },
				{ label: 'DOW', data: dow, borderColor: '#f0b90b', borderWidth: 2, tension: .35, pointRadius: 0, fill: false }
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: true, labels: { color: tc, font: { size: 9 }, boxWidth: 10 } },
				tooltip: { backgroundColor: appStore.darkMode ? '#131720' : '#ffffff', titleColor: tc, bodyColor: tc }
			},
			scales: {
				x: { grid: { color: gc }, ticks: { color: tc, font: { size: 8 }, maxTicksLimit: 6 } },
				y: {
					grid: { color: gc },
					ticks: { color: tc, font: { size: 8 }, callback: (v: any) => v.toFixed(1) + '%' },
					title: { display: true, text: '% Veränderung', color: tc, font: { size: 8 } }
				}
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
	height: v-bind("(props.height || 190) + 'px'");
}

canvas {
	width: 100% !important;
}
</style>
