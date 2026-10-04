<script setup>
import { computed,onBeforeUnmount,ref } from 'vue'
const emit=defineEmits(['complete'])
const active=ref(false); const elapsed=ref(0); let timer
const total=60; const remaining=computed(()=>Math.max(0,total-elapsed.value)); const cycleSecond=computed(()=>elapsed.value%12)
const phase=computed(()=>cycleSecond.value<4?'吸气':cycleSecond.value<6?'保持':'呼气')
const phaseRemaining=computed(()=>phase.value==='吸气'?4-cycleSecond.value:phase.value==='保持'?6-cycleSecond.value:12-cycleSecond.value)
function start(){if(elapsed.value>=total)elapsed.value=0;if(active.value)return;active.value=true;timer=window.setInterval(()=>{elapsed.value++;if(elapsed.value>=total)pause()},1000)}
function pause(){active.value=false;window.clearInterval(timer)}
function reset(){pause();elapsed.value=0}
onBeforeUnmount(pause)
</script>
<template><div class="breathing-panel"><div class="breathing-stage"><div :class="['breathing-orbit',{active},phase==='吸气'?'inhale':phase==='保持'?'hold':'exhale']"><div class="breathing-circle"><span>{{elapsed>=total?'完成':active?phase:'准备好了吗'}}</span><strong>{{active?phaseRemaining:'1 分钟'}}<small v-if="active"> 秒</small></strong></div></div><div class="breathing-total">总剩余时间 {{remaining}} 秒</div></div><div class="breathing-copy"><p class="eyebrow">随呼吸回到此刻</p><h2>1 分钟呼吸练习</h2><p>吸气 4 秒，保持 2 秒，再用 6 秒缓缓呼气。让肩膀自然放松，不必刻意做得完美。</p><div class="breathing-controls"><button v-if="elapsed<total" class="primary-button" type="button" @click="active?pause():start()">{{active?'暂停':elapsed?'继续':'开始'}}</button><button v-if="elapsed<total" class="secondary-button" type="button" @click="reset">重新开始</button><button v-else class="care-done-button" type="button" @click="emit('complete',{actionId:'breathing',actionName:'1 分钟呼吸'});reset()">我做完了</button></div></div></div></template>
