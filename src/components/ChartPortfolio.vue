<template>
	<div class="chart-wrap">
		<canvas ref="canvasEl"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps<{ totalVal: number; height?: number }>()
const canvasEl = ref<HTMLCanvasElement>()
const appStore = useAppStore()
let chart: any = null

function buildChart() {
	if (!canvasEl.value) return
	const Chart = (window as any).Chart
	if (!Chart) return

	if (chart) { chart.destroy(); chart = null }

	const days = 90
	const lb: string[] = [], d: number[] = []
	const now = new Date()
	let v = props.totalVal * .85
	for (let i = days - 1; i >= 0; i--) {
		const dd = new Date(now); dd.setDate(dd.getDate() - i)
		lb.push(dd.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }))
		v *= (1 + .0008 + (Math.random() - .46) * .015)
		d.push(parseFloat(v.toFixed(2)))
	}
	d[d.length - 1] = props.totalVal

	const ctx = canvasEl.value.getContext('2d')!
	const g = ctx.createLinearGradient(0, 0, 0, props.height || 160)
	g.addColorStop(0, 'rgba(22,199,132,.18)')
	g.addColorStop(1, 'rgba(0,0,0,0)')

	const gc = appStore.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'
	const tc = appStore.darkMode ? '#4a5568' : '#8a9ab5'

	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: lb,
			datasets: [{ data: d, borderColor: '#16c784', borderWidth: 2, fill: true, backgroundColor: g, tension: .4, pointRadius: 0 }]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				x: { display: false },
				y: { grid: { color: gc }, ticks: { color: tc, font: { size: 8 }, callback: (v: any) => `$${v.toFixed(0)}` }, position: 'right' }
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
watch(() => [props.totalVal, appStore.darkMode], () => buildChart())
onUnmounted(() => { if (chart) chart.destroy() })
</script>

<style scoped>
.chart-wrap {
	position: relative;
	height: v-bind("(props.height || 160) + 'px'");
}

canvas {
	width: 100% !important;
}
</style>
