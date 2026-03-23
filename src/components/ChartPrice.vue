<template>
	<div class="chart-wrap">
		<canvas ref="canvasEl"></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps<{
	price: number
	type: 'buy' | 'hold' | 'sell'
	period: string
	height?: number
}>()

const canvasEl = ref<HTMLCanvasElement>()
const appStore = useAppStore()
let chart: any = null

function genPrice(base: number, days: number, type: string) {
	const d = []; let p = base * .92
	for (let i = 0; i < days; i++) {
		const tr = type === 'buy' ? .0009 : type === 'sell' ? -.0009 : .0001
		p *= (1 + tr + (Math.random() - .47) * .018)
		d.push(parseFloat(p.toFixed(2)))
	}
	d[d.length - 1] = base
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

function buildChart() {
	if (!canvasEl.value) return
	const Chart = (window as any).Chart
	if (!Chart) return

	if (chart) { chart.destroy(); chart = null }

	const days = props.period === '3M' ? 90 : props.period === '6M' ? 180 : props.period === '1J' ? 365 : 30
	const prices = genPrice(props.price, days, props.type)
	const labels = genLabels(days)

	const isUp = props.type !== 'sell'
	const color = isUp ? '#16c784' : '#ea3943'
	const ctx = canvasEl.value.getContext('2d')!

	const grad = ctx.createLinearGradient(0, 0, 0, props.height || 210)
	grad.addColorStop(0, isUp ? 'rgba(22,199,132,.18)' : 'rgba(234,57,67,.18)')
	grad.addColorStop(1, 'rgba(0,0,0,0)')

	const gc = appStore.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'
	const tc = appStore.darkMode ? '#4a5568' : '#8a9ab5'

	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [{
				data: prices,
				borderColor: color,
				borderWidth: 2,
				fill: true,
				backgroundColor: grad,
				tension: .35,
				pointRadius: 0,
				pointHoverRadius: 5
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: { intersect: false, mode: 'index' },
			plugins: {
				legend: { display: false },
				tooltip: {
					backgroundColor: appStore.darkMode ? '#131720' : '#ffffff',
					borderColor: appStore.darkMode ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.1)',
					borderWidth: 1,
					titleColor: tc,
					bodyColor: appStore.darkMode ? '#e8edf2' : '#0d1117',
					callbacks: { label: (c: any) => `$${c.parsed.y.toFixed(2)}` }
				}
			},
			scales: {
				x: { grid: { color: gc }, ticks: { color: tc, font: { size: 8 }, maxTicksLimit: 6 } },
				y: {
					grid: { color: gc },
					ticks: { color: tc, font: { size: 8 }, callback: (v: any) => `$${v.toFixed(0)}` },
					position: 'right'
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
watch(() => [props.period, appStore.darkMode], () => buildChart())
onUnmounted(() => { if (chart) chart.destroy() })
</script>

<style scoped>
.chart-wrap {
	position: relative;
	height: v-bind("(props.height || 210) + 'px'");
}

canvas {
	width: 100% !important;
}
</style>
