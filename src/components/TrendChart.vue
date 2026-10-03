<script setup>
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick,onBeforeUnmount,onMounted,ref,watch } from 'vue'
echarts.use([LineChart,GridComponent,TooltipComponent,CanvasRenderer])
const props=defineProps({days:{type:Array,required:true},values:{type:Array,required:true}}); const chartEl=ref(null);let chart
function render(){if(!chartEl.value)return;chart||=echarts.init(chartEl.value);chart.setOption({animationDuration:700,grid:{left:36,right:18,top:25,bottom:36},tooltip:{trigger:'axis',backgroundColor:'#41394b',borderWidth:0,textStyle:{color:'#fff'},formatter:params=>{const p=params[0];return `${p.axisValue}<br>情绪强度 ${p.data??'暂无记录'}`}},xAxis:{type:'category',boundaryGap:false,data:props.days,axisLine:{lineStyle:{color:'#e9e3eb'}},axisTick:{show:false},axisLabel:{color:'#827a89',margin:13}},yAxis:{type:'value',min:0,max:10,interval:2,axisLabel:{color:'#aaa2ad'},splitLine:{lineStyle:{color:'#f0ecf1'}}},series:[{type:'line',data:props.values,connectNulls:false,smooth:.4,symbolSize:9,lineStyle:{width:3,color:'#8068c9'},itemStyle:{color:'#fff',borderColor:'#8068c9',borderWidth:3},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(128,104,201,.2)'},{offset:1,color:'rgba(128,104,201,0)'}])}}]})}
function resize(){chart?.resize()} onMounted(()=>{nextTick(render);window.addEventListener('resize',resize)});watch(()=>props.values,()=>nextTick(render),{deep:true});onBeforeUnmount(()=>{window.removeEventListener('resize',resize);chart?.dispose()})
</script><template><div ref="chartEl" class="chart" aria-label="最近 7 天情绪强度折线图"></div></template>
