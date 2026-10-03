<script setup>
import { computed, onMounted, ref } from 'vue'
import TodayView from './components/TodayView.vue'
import CareView from './components/CareView.vue'
import TrendsView from './components/TrendsView.vue'
import { loadRecords, saveRecord, seedRecords } from './utils/storage'

const tabs = [
  { id: 'today', label: '今天' },
  { id: 'care', label: '关怀' },
  { id: 'trends', label: '趋势' },
]
const activeTab = ref('today')
const records = ref(loadRecords())
const toast = ref('')
const currentTitle = computed(() => tabs.find(tab => tab.id === activeTab.value)?.label)

function addRecord(record) {
  records.value = saveRecord(record)
  toast.value = '已收好今天的心情'
  window.setTimeout(() => (toast.value = ''), 2400)
}

function showCare() {
  activeTab.value = 'care'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  records.value = seedRecords()
})
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <button class="brand" aria-label="MoodFlow 首页" @click="activeTab = 'today'">
        <span class="brand-mark">M</span>
        <span>MoodFlow</span>
      </button>
      <nav class="tabs" aria-label="主要页面">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
      <div class="date-chip">{{ currentTitle }}</div>
    </header>

    <main>
      <Transition name="page" mode="out-in">
        <TodayView v-if="activeTab === 'today'" key="today" @saved="addRecord" @open-care="showCare" />
        <CareView v-else-if="activeTab === 'care'" key="care" />
        <TrendsView v-else key="trends" :records="records" />
      </Transition>
    </main>

    <footer>
      <div class="footer-mark">MF</div>
      <p>MoodFlow 用于情绪记录和日常自我关怀，不替代专业医疗或心理咨询。如果你正经历持续或强烈的心理困扰，请考虑寻求专业支持。</p>
    </footer>

    <Transition name="toast">
      <div v-if="toast" class="toast" role="status">✓ {{ toast }}</div>
    </Transition>
  </div>
</template>
