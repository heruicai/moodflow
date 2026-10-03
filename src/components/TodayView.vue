<script setup>
import { computed, ref } from 'vue'
import { createInsight, hasCrisisLanguage } from '../utils/insight'
import TagSelector from './TagSelector.vue'
import InsightCard from './InsightCard.vue'
import CrisisCard from './CrisisCard.vue'

const emit = defineEmits(['saved', 'open-care'])
const moods = [{label:'很好',emoji:'😄'},{label:'不错',emoji:'🙂'},{label:'一般',emoji:'😐'},{label:'低落',emoji:'😔'},{label:'很难受',emoji:'😣'}]
const emotionOptions = ['焦虑','疲惫','烦躁','委屈','孤独','挫败','自我怀疑','压力','平静','满足','开心','期待']
const triggerOptions = ['学业','工作','人际关系','亲密关系','家庭','睡眠','身体状态','未来规划','自我期待','金钱','其他']
const needOptions = ['被理解','安静一下','找回动力','理清思绪','放松身体','有人陪伴','获得肯定','解决问题']
const mood = ref(''); const intensity = ref(5); const note = ref(''); const emotionTags = ref([]); const triggerTags = ref([]); const needSelection = ref([])
const insight = ref(null); const crisis = ref(false); const error = ref(''); const draftId = ref(''); const saved = ref(false)
const greeting = computed(() => { const h = new Date().getHours(); return h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好' })
const need = computed(() => needSelection.value[0] || '')

function analyze() {
  if (!mood.value || !need.value) { error.value = '先选择此刻的主情绪和最需要的支持吧'; return }
  error.value = ''; saved.value = false; draftId.value = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  crisis.value = hasCrisisLanguage(note.value)
  insight.value = crisis.value ? null : createInsight({ mood:mood.value, intensity:intensity.value, emotionTags:emotionTags.value, triggerTags:triggerTags.value, need:need.value, note:note.value })
  window.setTimeout(() => document.querySelector('#result')?.scrollIntoView({behavior:'smooth',block:'center'}), 80)
}
function save() {
  if (!insight.value || saved.value) return
  emit('saved', { id:draftId.value, createdAt:new Date().toISOString(), mood:mood.value, intensity:intensity.value, emotionTags:[...emotionTags.value], triggerTags:[...triggerTags.value], need:need.value, note:note.value.trim(), insightSummary:insight.value.experience, primaryAction:insight.value.primaryAction.label })
  saved.value = true
}
</script>
<template>
  <section class="today-view">
    <section class="product-hero"><div class="hero-copy"><p class="hero-kicker">记录此刻，理解自己。</p><h1>{{ greeting }}，<br><span>今天过得怎么样？</span></h1><p class="hero-value">从记录情绪，到理解触发因素、看见当下需要，再做一件适合自己的小事。</p></div><div class="hero-aside"><p class="eyebrow">{{ new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(new Date()) }}</p><span class="sparkle">✦</span><p>不用急着变好<br>先听听此刻的自己</p></div></section>
    <div class="flow-strip" aria-label="MoodFlow 产品流程"><span>记录情绪</span><i>·</i><span>理解原因</span><i>·</i><span>看见需求</span><i>·</i><span>做一件小事</span></div>
    <div class="journal-layout">
      <section class="card form-card mood-section"><div class="step-heading"><span>01</span><div><h2>此刻的心情</h2><p>选一个最接近的就好</p></div></div><div class="mood-options"><button v-for="item in moods" :key="item.label" type="button" :class="['mood-option',{selected:mood===item.label}]" @click="mood=item.label"><span class="mood-emoji">{{ item.emoji }}</span><span>{{ item.label }}</span></button></div><div class="intensity-wrap"><div class="slider-label"><label for="intensity">情绪强度</label><strong>{{ intensity }}<small>/10</small></strong></div><input id="intensity" v-model.number="intensity" type="range" min="1" max="10" :style="{'--value':`${(intensity-1)/9*100}%`}"><div class="scale"><span>轻微</span><span>强烈</span></div></div></section>
      <section class="card form-card story-section"><div class="step-heading"><span>02</span><div><h2>发生了什么？</h2><p>写多少都可以，内容只保存在这里</p></div></div><textarea v-model="note" maxlength="500" placeholder="比如：今天的会议让我有点挫败……"></textarea><div class="text-count">{{ note.length }} / 500</div></section>
      <section class="card form-card detail-section"><div class="selector-block"><div class="compact-heading"><h2>此刻更接近哪些感受？</h2><span>{{ emotionTags.length }}/3</span></div><TagSelector v-model="emotionTags" :options="emotionOptions" :max="3" /></div><div class="selector-block"><div class="compact-heading"><h2>这件事主要和什么有关？</h2><span>可多选</span></div><TagSelector v-model="triggerTags" :options="triggerOptions" :max="3" /></div><div class="selector-block"><div class="compact-heading"><h2>我现在更需要什么？</h2><span>选一项</span></div><TagSelector v-model="needSelection" :options="needOptions" :max="1" single /></div><p v-if="error" class="form-error" role="alert">{{ error }}</p><button class="primary-button analyze-button" type="button" @click="analyze">✦ 帮我梳理一下</button><p class="privacy-note">记录只会保存在你的设备上</p></section>
    </div>
    <CrisisCard v-if="crisis" id="result" />
    <InsightCard v-else-if="insight" id="result" :insight="insight" :saved="saved" @save="save" @open-care="emit('open-care',$event)" />
  </section>
</template>
