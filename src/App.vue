<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import TodayView from './components/TodayView.vue'
import Toast from './components/Toast.vue'
import { deleteRecord, loadRecords, saveRecord } from './utils/storage'
import { sectionForAction } from './utils/actions.js'
const CareView=defineAsyncComponent(()=>import('./components/CareView.vue'))
const TrendsView=defineAsyncComponent(()=>import('./components/TrendsView.vue'))
const tabs=[{id:'today',label:'今天',icon:'○'},{id:'care',label:'关怀',icon:'♡'},{id:'trends',label:'趋势',icon:'⌁'}]
const activeTab=ref('today'); const records=ref(loadRecords()); const toast=ref(''); const targetCareSection=ref('')
const currentTitle=computed(()=>tabs.find(tab=>tab.id===activeTab.value)?.label)
function notify(message){toast.value=''; requestAnimationFrame(()=>toast.value=message); window.setTimeout(()=>toast.value='',2400)}
function addRecord(record){records.value=saveRecord(record);notify('已收好这次心情')}
function removeRecord(id){records.value=deleteRecord(id);notify('记录已删除')}
function navigate(id){targetCareSection.value='';activeTab.value=id;window.scrollTo({top:0,behavior:'smooth'})}
function openCare(actionId){targetCareSection.value=sectionForAction(actionId);activeTab.value='care'}
function clearCareTarget(){targetCareSection.value=''}
</script>
<template><div class="app-shell">
  <header class="topbar"><button class="brand" aria-label="MoodFlow 首页" @click="navigate('today')"><span class="brand-mark">M</span><span><strong>MoodFlow</strong><small>记录此刻，理解自己。</small></span></button><nav class="tabs desktop-tabs" aria-label="主要页面"><button v-for="tab in tabs" :key="tab.id" :class="['tab-button',{active:activeTab===tab.id}]" @click="navigate(tab.id)">{{ tab.label }}</button></nav><div class="date-chip">{{ currentTitle }}</div></header>
  <main><Transition name="page" mode="out-in"><TodayView v-if="activeTab==='today'" key="today" @saved="addRecord" @open-care="openCare"/><CareView v-else-if="activeTab==='care'" key="care" :target-section="targetCareSection" @target-reached="clearCareTarget"/><TrendsView v-else key="trends" :records="records" @delete="removeRecord" @start-record="navigate('today')"/></Transition></main>
  <footer><div class="footer-mark">MF</div><p>MoodFlow 用于情绪记录和日常自我关怀，不替代专业医疗或心理咨询。如果你正经历持续或强烈的心理困扰，请考虑寻求专业支持。</p></footer>
  <nav class="mobile-tabs" aria-label="移动端主要页面"><button v-for="tab in tabs" :key="tab.id" :class="{active:activeTab===tab.id}" @click="navigate(tab.id)"><span>{{ tab.icon }}</span>{{ tab.label }}</button></nav><Toast :message="toast"/>
</div></template>
