<script setup>
import { ref,watch } from 'vue'
import BreathingExercise from './BreathingExercise.vue'
import CareActionCard from './CareActionCard.vue'
import { loadWriting,saveWriting } from '../utils/storage'
const sounds=['雨声','海浪','森林','咖啡馆','轻钢琴']; const playing=ref('')
const movements=[
  {title:'2 分钟伸展',duration:'现在就能开始',icon:'↟',steps:['转动肩颈 20 秒','伸展手臂 20 秒','身体向两侧缓慢侧弯','做三次缓慢深呼吸']},
  {title:'10 分钟散步',duration:'换一换周围的空气',icon:'↝',steps:['穿上舒服的鞋','把手机暂时放进口袋','留意脚步与周围的声音','不追求步数，只走到身体稍微放松']},
  {title:'15 分钟轻运动',duration:'温和唤醒身体',icon:'⌁',steps:['原地踏步 3 分钟','做一组轻柔深蹲','伸展背部与腿部','放慢节奏，用呼吸收尾']},
]
const openMovement=ref(-1)
const prompts=['如果这件事发生在你的朋友身上，你会怎么安慰他？','今天有哪些事情虽然很小，但你已经处理好了？','现在最让你担心的是什么？其中哪些部分是你能控制的？']
const promptIndex=ref(Math.floor(Math.random()*prompts.length)); const writing=ref(loadWriting())
function nextPrompt(){promptIndex.value=(promptIndex.value+1)%prompts.length}
watch(writing,value=>saveWriting(value))
</script>
<template><section class="care-view"><div class="section-intro"><p class="eyebrow">自我关怀空间</p><h1>把一点温柔，<span>留给此刻的自己</span></h1><p>不用完成所有练习，选择一个当下愿意尝试的就好。</p></div>
  <section class="card breathing-card"><BreathingExercise/></section>
  <section class="care-section"><div class="section-heading"><div><p class="eyebrow">听一会儿</p><h2>给耳朵一片安静</h2></div><p v-if="playing" class="playing-status"><i></i>正在播放：{{ playing }}</p></div><div class="sound-grid"><button v-for="sound in sounds" :key="sound" :class="{active:playing===sound}" type="button" @click="playing=playing===sound?'':sound"><span>{{ sound==='雨声'?'♩':sound==='海浪'?'≈':sound==='森林'?'♧':sound==='咖啡馆'?'☕':'♫' }}</span><strong>{{ sound }}</strong><small>{{ playing===sound?'点击暂停':'播放氛围' }}</small></button></div><p class="sound-note">这是专注模式的轻量播放状态，不会连接外部音乐服务。</p></section>
  <section class="care-section"><div class="section-heading"><div><p class="eyebrow">动一动</p><h2>让身体松开一点</h2></div><p>选择一个，展开跟着做</p></div><div class="movement-grid"><CareActionCard v-for="(item,index) in movements" :key="item.title" v-bind="item" :active="openMovement===index" @toggle="openMovement=openMovement===index?-1:index"/></div></section>
  <section class="writing-card"><div class="writing-copy"><p class="eyebrow">写给自己</p><h2>{{ prompts[promptIndex] }}</h2><button class="text-button" type="button" @click="nextPrompt">换一个问题 ↻</button></div><div><textarea v-model="writing" maxlength="800" placeholder="不用组织语言，想到什么就写什么……"></textarea><div class="text-count">已自动保存在当前设备 · {{ writing.length }}/800</div></div></section>
</section></template>
