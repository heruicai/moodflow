<script setup>
import{computed,ref}from'vue'
import TrendChart from'./TrendChart.vue'
import HistoryList from'./HistoryList.vue'
import{buildTrend,completionsInRange,dayKey}from'../utils/trend'
const props=defineProps({records:{type:Array,default:()=>[]},completions:{type:Array,default:()=>[]},writingRecords:{type:Array,default:()=>[]}})
const emit=defineEmits(['delete','start-record'])
const scale=ref('today'),options=[['today','1 天'],['7d','7 天'],['30d','30 天'],['90d','3 个月']]
const days=Array.from({length:14},(_,i)=>{const d=new Date();d.setHours(23,59,59,999);d.setDate(d.getDate()-i);return d}),selectedDay=ref(dayKey(new Date()));const selectedDate=computed(()=>days.find(x=>dayKey(x)===selectedDay.value)||days[0]);const isToday=computed(()=>selectedDay.value===dayKey(new Date()))
const result=computed(()=>buildTrend(props.records,scale.value,scale.value==='today'?selectedDate.value:new Date()))
const title=computed(()=>scale.value==='today'?(isToday.value?'今天的变化':`${selectedDate.value.getMonth()+1}月${selectedDate.value.getDate()}日的变化`):({ '7d':'最近 7 天','30d':'最近 30 天','90d':'最近 3 个月'}[scale.value]))
const careCount=computed(()=>scale.value==='today'?props.completions.filter(item=>dayKey(item.completedAt)===selectedDay.value).length:completionsInRange(props.completions,scale.value==='7d'?7:scale.value==='30d'?30:90).length)
const emptyCopy=computed(()=>scale.value==='today'?(isToday.value?'今天的第一条记录会出现在这里。':'这一天还没有情绪数据。'):'在这个时间范围内还没有记录，新的变化会从下一次记录开始。')
const observation=computed(()=>scale.value==='today'&&!isToday.value?result.value.observation.replaceAll('今天','当天'):result.value.observation)
function selectDay(day){selectedDay.value=dayKey(day);scale.value='today'}
</script>
<template><section class="trends-view"><div class="trends-head"><div class="section-intro"><p class="eyebrow">情绪趋势</p><h1>看见情绪的<span>流动</span></h1><p>在不同时间里回看，细小的变化也会慢慢清晰。</p></div><div class="trend-scale-control" aria-label="趋势时间范围"><button v-for="option in options" :key="option[0]" :class="{active:scale===option[0]}" :aria-pressed="scale===option[0]" @click="scale=option[0]">{{option[1]}}</button></div></div>
<Transition name="accordion"><section v-if="scale==='today'" class="day-trend-picker"><div class="day-trend-copy"><span>选择一天</span><small>查看当天从早到晚的情绪趋势</small></div><div class="date-pills" aria-label="选择趋势日期"><button v-for="(day,index) in days" :key="dayKey(day)" :class="{active:selectedDay===dayKey(day)}" type="button" @click="selectDay(day)"><small>{{index===0?'今天':`周${'日一二三四五六'[day.getDay()]}`}}</small><strong>{{day.getMonth()+1}}月{{day.getDate()}}日</strong></button></div></section></Transition>
<section class="card chart-card trend-primary-card"><div class="chart-heading trend-chart-heading"><div><p class="eyebrow">状态变化</p><h2>{{title}}</h2></div><div class="legend"><i></i>越高代表状态越积极</div></div>
<template v-if="result.hasData"><div class="trend-inline-summary"><span><strong>{{result.stats.average}}</strong><small>平均状态</small></span><span><strong>{{result.stats.count}}</strong><small>情绪记录</small></span><span><strong>{{result.stats.min===result.stats.max?result.stats.min:`${result.stats.min}–${result.stats.max}`}}</strong><small>状态范围</small></span><span v-if="careCount"><strong>{{careCount}}</strong><small>关怀行动</small></span></div><TrendChart :points="result.points" :scale="scale" :moving-average="result.movingAverage"/><p v-if="scale==='30d'" class="moving-average-note"><i></i>虚线为 7 日移动平均，仅用于观察整体方向。</p><div class="scale-observation"><span>✦</span><p>{{observation}}</p></div></template>
<div v-else class="trend-chart-empty"><span>◌</span><h2>变化会慢慢出现在这里</h2><p>{{emptyCopy}}</p><button class="secondary-button" @click="emit('start-record')">记录此刻</button></div></section>
<HistoryList :records="records" :writing-records="writingRecords" title="最近记录" @delete="emit('delete',$event)"/></section></template>
