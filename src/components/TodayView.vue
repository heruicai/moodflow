<script setup>
import { computed, ref } from 'vue'
import { createInsight } from '../utils/insight'
import InsightCard from './InsightCard.vue'

const emit = defineEmits(['saved', 'open-care'])
const moods = [
  { label: '很好', emoji: '😄', color: '#f6c75f' },
  { label: '不错', emoji: '🙂', color: '#edb567' },
  { label: '一般', emoji: '😐', color: '#a8a1b3' },
  { label: '低落', emoji: '😔', color: '#8a9bc5' },
  { label: '很难受', emoji: '😣', color: '#8d75bd' },
]
const needs = ['被理解', '安静一下', '找回动力', '理清思绪', '放松身体', '有人陪伴']
const mood = ref('')
const intensity = ref(5)
const note = ref('')
const need = ref('')
const insight = ref(null)
const error = ref('')

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
})

function analyze() {
  if (!mood.value || !need.value) {
    error.value = '先选择此刻的情绪和最需要的支持吧'
    return
  }
  error.value = ''
  insight.value = createInsight({ mood: mood.value, intensity: intensity.value, note: note.value, need: need.value })
  emit('saved', {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: new Date().toISOString(), mood: mood.value, intensity: intensity.value,
    note: note.value, need: need.value, trigger: insight.value.trigger,
  })
  window.setTimeout(() => document.querySelector('#insight')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
}
</script>

<template>
  <section class="today-view">
    <div class="welcome-row">
      <div>
        <p class="eyebrow">{{ new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date()) }}</p>
        <h1>{{ greeting }}，<br><span>今天过得怎么样？</span></h1>
      </div>
      <div class="daily-note">
        <span class="sparkle">✦</span>
        <p>不需要急着变好<br>先听听心里发生了什么</p>
      </div>
    </div>

    <div class="journal-grid">
      <section class="card mood-card">
        <div class="step-heading"><span>01</span><div><h2>此刻的心情</h2><p>选一个最接近的就好</p></div></div>
        <div class="mood-options">
          <button
            v-for="item in moods" :key="item.label"
            :class="['mood-option', { selected: mood === item.label }]"
            :aria-pressed="mood === item.label"
            @click="mood = item.label"
          >
            <span class="mood-emoji">{{ item.emoji }}</span><span>{{ item.label }}</span>
          </button>
        </div>
        <Transition name="fade">
          <div v-if="mood" class="intensity-wrap">
            <div class="slider-label"><label for="intensity">情绪强度</label><strong>{{ intensity }}<small>/10</small></strong></div>
            <input id="intensity" v-model.number="intensity" type="range" min="1" max="10" :style="{ '--value': `${(intensity - 1) / 9 * 100}%` }">
            <div class="scale"><span>轻微</span><span>强烈</span></div>
          </div>
        </Transition>
      </section>

      <section class="card story-card">
        <div class="step-heading"><span>02</span><div><h2>发生了什么？</h2><p>写多少都可以，这里只有你能看到</p></div></div>
        <textarea v-model="note" maxlength="500" placeholder="比如：今天的会议让我有点挫败，我好像一直在担心自己做得不够好……"></textarea>
        <div class="text-count">{{ note.length }} / 500</div>
      </section>

      <section class="card need-card">
        <div class="step-heading"><span>03</span><div><h2>现在，你更需要什么？</h2><p>感受背后，常常藏着一个未被满足的需要</p></div></div>
        <div class="need-options">
          <button v-for="item in needs" :key="item" :class="['need-chip', { selected: need === item }]" @click="need = item">
            <span>{{ item === '被理解' ? '♡' : item === '安静一下' ? '◌' : item === '找回动力' ? '↗' : item === '理清思绪' ? '≋' : item === '放松身体' ? '⌁' : '☺' }}</span>{{ item }}
          </button>
        </div>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="primary-button" @click="analyze"><span>✦</span> 帮我梳理一下</button>
        <p class="privacy-note">内容仅保存在你的设备上</p>
      </section>
    </div>

    <InsightCard v-if="insight" id="insight" :insight="insight" @open-care="emit('open-care')" />
  </section>
</template>
