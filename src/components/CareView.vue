<script setup>
import { nextTick,onBeforeUnmount,onMounted,ref,watch } from 'vue'
import BreathingExercise from './BreathingExercise.vue'
import CareActionCard from './CareActionCard.vue'
import { loadWriting,saveWriting } from '../utils/storage'
import { createAmbientAudio } from '../utils/audio.js'
const props=defineProps({targetSection:{type:String,default:''}});const emit=defineEmits(['target-reached'])
const sounds=['雨声','海浪','森林','咖啡馆','轻钢琴'];const playing=ref('');const volume=ref(22);const audioError=ref('');const highlighted=ref('');let highlightTimer
const audio=createAmbientAudio(value=>playing.value=value)
async function toggleSound(sound){audioError.value='';try{await audio.play(sound)}catch{audioError.value='当前浏览器暂时无法播放声音，请检查声音权限后重试。'}}
watch(volume,value=>audio.setVolume(value/100))
const movements=[
  {title:'2 分钟伸展',duration:'现在就能开始',icon:'↟',steps:['转动肩颈 20 秒','伸展手臂 20 秒','身体向两侧缓慢侧弯','做三次缓慢深呼吸']},
  {title:'10 分钟散步',duration:'换一换周围的空气',icon:'↝',steps:['穿上舒服的鞋','把手机暂时放进口袋','留意脚步与周围的声音','不追求步数，只走到身体稍微放松']},
  {title:'15 分钟轻运动',duration:'温和唤醒身体',icon:'⌁',steps:['原地踏步 3 分钟','做一组轻柔深蹲','伸展背部与腿部','放慢节奏，用呼吸收尾']},
]
const openMovement=ref(-1);const prompts=['如果这件事发生在你的朋友身上，你会怎么安慰他？','今天有哪些事情虽然很小，但你已经处理好了？','现在最让你担心的是什么？其中哪些部分是你能控制的？'];const promptIndex=ref(Math.floor(Math.random()*prompts.length));const writing=ref(loadWriting())
function nextPrompt(){promptIndex.value=(promptIndex.value+1)%prompts.length}watch(writing,value=>saveWriting(value))
async function locate(section){if(!section)return;await nextTick();requestAnimationFrame(()=>{const element=document.getElementById(section);if(!element)return;element.scrollIntoView({behavior:'smooth',block:'center'});highlighted.value=section;clearTimeout(highlightTimer);highlightTimer=window.setTimeout(()=>highlighted.value='',1800);emit('target-reached')})}
onMounted(()=>locate(props.targetSection));watch(()=>props.targetSection,value=>locate(value));onBeforeUnmount(()=>{clearTimeout(highlightTimer);audio.destroy()})
</script>
<template><section class="care-view"><div class="section-intro"><p class="eyebrow">自我关怀空间</p><h1>把一点温柔，<span>留给此刻的自己</span></h1><p>不用完成所有练习，选择一个当下愿意尝试的就好。</p></div>
  <section id="care-breathing" :class="['card','breathing-card','care-target',{ 'care-highlight':highlighted==='care-breathing' }]"><div class="care-title"><div><span>01</span><div><h2>呼吸一下</h2><p>让身体先慢下来一点。</p></div></div></div><BreathingExercise/></section>
  <section id="care-sound" :class="['care-section','care-target',{ 'care-highlight':highlighted==='care-sound' }]"><div class="section-heading"><div><p class="eyebrow">02 · 听点声音</p><h2>给注意力一个暂时停靠的地方</h2></div><p v-if="playing" class="playing-status"><i></i>正在播放：{{ playing }}</p><p v-else>选择一种舒服的声音</p></div><div class="sound-grid"><button v-for="sound in sounds" :key="sound" :class="{active:playing===sound}" type="button" @click="toggleSound(sound)"><span>{{ sound==='雨声'?'♩':sound==='海浪'?'≈':sound==='森林'?'♧':sound==='咖啡馆'?'☕':'♫' }}</span><strong>{{ sound }}</strong><small>{{ playing===sound?'点击暂停':'播放声音' }}</small></button></div><div class="volume-row"><label for="ambient-volume">音量</label><input id="ambient-volume" v-model.number="volume" type="range" min="0" max="60" :style="{'--value':`${volume/60*100}%`}"><span>{{ volume }}%</span></div><p v-if="audioError" class="audio-error" role="status">{{ audioError }}</p><p class="sound-note">声音由浏览器在本地合成，不会连接外部服务。</p></section>
  <section id="care-movement" :class="['care-section','care-target',{ 'care-highlight':highlighted==='care-movement' }]"><div class="section-heading"><div><p class="eyebrow">03 · 动一动</p><h2>身体活动一点，情绪也可能松一点</h2></div><p>选一个，展开跟着做</p></div><div class="movement-grid"><CareActionCard v-for="(item,index) in movements" :key="item.title" v-bind="item" :active="openMovement===index" @toggle="openMovement=openMovement===index?-1:index"/></div></section>
  <section id="care-writing" :class="['writing-card','care-target',{ 'care-highlight':highlighted==='care-writing' }]"><div class="writing-copy"><p class="eyebrow">04 · 写下来</p><h2>有些感受，写出来会更容易看清。</h2><p class="writing-question">{{ prompts[promptIndex] }}</p><button class="text-button" type="button" @click="nextPrompt">换一个问题 ↻</button></div><div><textarea v-model="writing" maxlength="800" placeholder="不用组织语言，想到什么就写什么……"></textarea><div class="text-count">已自动保存在当前设备 · {{ writing.length }}/800</div></div></section>
</section></template>
