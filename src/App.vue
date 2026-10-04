<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import TodayView from './components/TodayView.vue'
import Toast from './components/Toast.vue'
import { deleteRecord, deleteWritingRecord, loadCareCompletions, loadRecords, loadWritingRecords, saveCareCompletion, saveRecord, saveWritingRecord, updateRecordAction } from './utils/storage'
import { getAction, sectionForAction } from './utils/actions.js'
const CareView=defineAsyncComponent(()=>import('./components/CareView.vue'))
const TrendsView=defineAsyncComponent(()=>import('./components/TrendsView.vue'))
const tabs=[{id:'today',label:'今天',icon:'○'},{id:'care',label:'关怀',icon:'♡'},{id:'trends',label:'趋势',icon:'⌁'}]
const activeTab=ref('today'); const records=ref(loadRecords()); const completions=ref(loadCareCompletions());const writings=ref(loadWritingRecords());const toast=ref(''); const targetCareSection=ref('');const targetCareAction=ref('');const sourceRecordId=ref('')
const currentTitle=computed(()=>tabs.find(tab=>tab.id===activeTab.value)?.label)
function notify(message){toast.value=''; requestAnimationFrame(()=>toast.value=message); window.setTimeout(()=>toast.value='',2400)}
function addRecord(record){records.value=saveRecord(record);notify('已记录今天的这一刻')}
function removeRecord(id){records.value=deleteRecord(id);writings.value=loadWritingRecords();notify('情绪记录已删除，关联书写仍为你保留')}
function navigate(id){targetCareSection.value='';targetCareAction.value='';sourceRecordId.value='';activeTab.value=id;window.scrollTo({top:0,behavior:'smooth'})}
function openCare(actionId,recordId=''){const action=getAction(actionId);if(recordId)records.value=updateRecordAction(recordId,action);if(action.instant){notify(actionId==='water'?'好，那就先去喝点水。':actionId==='nothing'?'什么都不用做也可以，就让这一刻待一会。':`好，就先${action.label}。`);return}targetCareSection.value=sectionForAction(actionId);targetCareAction.value=actionId;sourceRecordId.value=recordId;activeTab.value='care'}
function clearCareTarget(){targetCareSection.value=''}
function completeCare(item){if(item.actionId==='writing'){const result=saveWritingRecord({prompt:item.writingPrompt,answer:item.writingAnswer,sourceRecordId:sourceRecordId.value||null});writings.value=result.writings;records.value=result.records}completions.value=saveCareCompletion({...item,writingPrompt:undefined,writingAnswer:undefined,sourceRecordId:sourceRecordId.value});records.value=loadRecords();notify(item.actionId==='writing'?'写下来了，这一刻已经被好好保存。':item.actionId==='sound'?'听好了，看看现在有没有松一点。':'完成了。看看现在有没有一点不同。')}
function removeWriting(id){const result=deleteWritingRecord(id);writings.value=result.writings;records.value=result.records;notify('这条书写记录已删除')}
</script>
<template><div class="app-shell">
  <header class="topbar"><button class="brand" aria-label="MoodFlow 首页" @click="navigate('today')"><span class="brand-mark">M</span><span><strong>MoodFlow</strong><small>记录此刻，理解自己。</small></span></button><nav class="tabs desktop-tabs" aria-label="主要页面"><button v-for="tab in tabs" :key="tab.id" :class="['tab-button',{active:activeTab===tab.id}]" @click="navigate(tab.id)">{{ tab.label }}</button></nav><div class="date-chip">{{ currentTitle }}</div></header>
  <main><Transition name="page" mode="out-in"><TodayView v-if="activeTab==='today'" key="today" @saved="addRecord" @open-care="openCare"/><CareView v-else-if="activeTab==='care'" key="care" :target-section="targetCareSection" :target-action="targetCareAction" :source-record="records.find(item=>item.id===sourceRecordId)" :writing-records="writings" @target-reached="clearCareTarget" @completed="completeCare" @delete-writing="removeWriting"/><TrendsView v-else key="trends" :records="records" :completions="completions" :writing-records="writings" @delete="removeRecord" @start-record="navigate('today')"/></Transition></main>
  <footer><div class="footer-mark">MF</div><p>MoodFlow 用于情绪记录和日常自我关怀，不替代专业医疗或心理咨询。如果你正经历持续或强烈的心理困扰，请考虑寻求专业支持。</p></footer>
  <nav class="mobile-tabs" aria-label="移动端主要页面"><button v-for="tab in tabs" :key="tab.id" :class="{active:activeTab===tab.id}" @click="navigate(tab.id)"><span>{{ tab.icon }}</span>{{ tab.label }}</button></nav><Toast :message="toast"/>
</div></template>
