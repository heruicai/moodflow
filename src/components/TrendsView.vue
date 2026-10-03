<script setup>
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps({ records: { type: Array, default: () => [] } })
const chartEl = ref(null)
let chart

function dayKey(date) { const d = new Date(date); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` }
const last7 = computed(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - (6 - i)); return d }))
const recentRecords = computed(() => { const start = last7.value[0]; return props.records.filter(r => new Date(r.date) >= start) })
const series = computed(() => last7.value.map(day => {
  const values = recentRecords.value.filter(r => dayKey(r.date) === dayKey(day)).map(r => Number(r.intensity))
  return values.length ? +(values.reduce((a,b) => a+b,0) / values.length).toFixed(1) : null
}))
const average = computed(() => recentRecords.value.length ? (recentRecords.value.reduce((sum,r) => sum + Number(r.intensity), 0) / recentRecords.value.length).toFixed(1) : '—')
const commonTrigger = computed(() => {
  const counts = recentRecords.value.reduce((map,r) => ((map[r.trigger] = (map[r.trigger] || 0) + 1), map), {})
  return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || '暂无'
})

function renderChart() {
  if (!chartEl.value) return
  chart ||= echarts.init(chartEl.value)
  chart.setOption({
    grid: { left: 38, right: 20, top: 30, bottom: 32 },
    tooltip: { trigger: 'axis', backgroundColor: '#3f3652', borderWidth: 0, textStyle: { color: '#fff' }, formatter: p => `${p[0].axisValue}<br/>情绪强度 ${p[0].data ?? '暂无记录'}` },
    xAxis: { type: 'category', boundaryGap: false, data: last7.value.map(d => ['日','一','二','三','四','五','六'][d.getDay()]), axisLine: { lineStyle: { color: '#e9e3ef' } }, axisTick: { show: false }, axisLabel: { color: '#8c8497', margin: 14 } },
    yAxis: { type: 'value', min: 0, max: 10, interval: 2, axisLabel: { color: '#aaa1b1' }, splitLine: { lineStyle: { color: '#f1edf3' } } },
    series: [{ type: 'line', data: series.value, connectNulls: true, smooth: .45, symbolSize: 9, lineStyle: { width: 4, color: '#8068c9' }, itemStyle: { color: '#fff', borderColor: '#8068c9', borderWidth: 3 }, areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(128,104,201,.28)'},{offset:1,color:'rgba(128,104,201,0)'}]) } }]
  })
}
function resize() { chart?.resize() }
onMounted(() => { nextTick(renderChart); window.addEventListener('resize', resize) })
watch(() => props.records, () => nextTick(renderChart), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('resize', resize); chart?.dispose() })
</script>

<template>
  <section class="trends-view">
    <div class="section-intro"><p class="eyebrow">最近 7 天</p><h1>看见情绪的<span>流动</span></h1><p>趋势不是评判，它只是帮你更了解自己。</p></div>
    <div class="stat-grid">
      <div class="stat-card"><span>平均情绪</span><strong>{{ average }}<small>/10</small></strong><p>最近七天的平均强度</p></div>
      <div class="stat-card"><span>记录次数</span><strong>{{ recentRecords.length }}<small>次</small></strong><p>每一次记录都很珍贵</p></div>
      <div class="stat-card"><span>最常见触发因素</span><strong class="trigger-value">{{ commonTrigger }}</strong><p>留意它出现时的感受</p></div>
    </div>
    <section class="card chart-card">
      <div class="chart-heading"><div><p class="eyebrow">情绪强度</p><h2>一周趋势</h2></div><div class="legend"><i></i>我的记录</div></div>
      <div ref="chartEl" class="chart" aria-label="最近 7 天情绪强度折线图"></div>
    </section>
    <section class="weekly-insight">
      <div class="insight-symbol">✦</div>
      <div><p class="eyebrow">本周情绪洞察</p><h2>你的感受在告诉你什么？</h2><p>这周你在<strong>{{ commonTrigger === '暂无' ? '生活节奏变化' : commonTrigger }}</strong>时更容易出现情绪波动。睡眠和身体状态可能会进一步放大这种感受，忙碌的时候，也别忘了为自己留一点恢复的时间。</p></div>
    </section>
  </section>
</template>
