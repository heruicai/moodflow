<script setup>
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick,onBeforeUnmount,onMounted,ref,watch } from 'vue'
echarts.use([LineChart,GridComponent,TooltipComponent,CanvasRenderer])
const props=defineProps({days:{type:Array,required:true},values:{type:Array,required:true}}); const chartEl=ref(null);let chart
function render(){if(!chartEl.value)return;chart||=echarts.init(chartEl.value);chart.setOption({animationDuration:350,grid:{left:34,right:12,top:22,bottom:34},tooltip:{trigger:'axis',confine:true,backgroundColor:'#41394b',borderWidth:0,textStyle:{color:'#fff',fontSize:12},formatter:params=>{const p=params[0];return `${p.axisValue}<br>情绪强度 ${p.data??'尚未记录'}`}},xAxis:{type:'category',boundaryGap:false,data:props.days,axisLine:{lineStyle:{color:'#e9e3eb'}},axisTick:{show:false},axisLabel:{color:'#827a89',fontSize:11,margin:11,hideOverlap:true}},yAxis:{type:'value',min:0,max:10,interval:2,axisLabel:{color:'#aaa2ad',fontSize:11},splitLine:{lineStyle:{color:'#f0ecf1'}}},series:[{type:'line',data:props.values,connectNulls:false,smooth:.4,symbolSize:8,lineStyle:{width:3,color:'#8068c9'},itemStyle:{color:'#fff',borderColor:'#8068c9',borderWidth:3},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(128,104,201,.14)'},{offset:1,color:'rgba(128,104,201,0)'}])}}]})}
function resize(){chart?.resize()} onMounted(()=>{nextTick(render);window.addEventListener('resize',resize)});watch(()=>props.values,()=>nextTick(render),{deep:true});onBeforeUnmount(()=>{window.removeEventListener('resize',resize);chart?.dispose()})
</script><template><div ref="chartEl" class="chart" aria-label="最近 7 天情绪强度折线图"></div></template>
