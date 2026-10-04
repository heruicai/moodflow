<script setup>
import{ref}from'vue';import{ALL_ACTIONS}from'../utils/actions'
defineProps({insight:{type:Object,required:true}});defineEmits(['open-care','new-record']);const showAll=ref(false)
</script>
<template><section class="insight-card">
  <div class="insight-top"><div><p class="eyebrow">此刻的小结</p><h2>一起看看，这份感受在说什么</h2></div><span class="insight-badge">✦ 情绪洞察</span></div>
  <div class="insight-sections">
    <div class="insight-part"><span class="part-number">01</span><div><h3>你现在可能正在经历</h3><p>{{insight.experience}}</p></div></div>
    <div class="insight-part"><span class="part-number">02</span><div><h3>这件事可能触发了</h3><div class="insight-tags"><span v-for="tag in insight.triggers" :key="tag">{{tag}}</span></div></div></div>
    <div class="insight-part"><span class="part-number">03</span><div><h3>你此刻更需要的也许是</h3><p>{{insight.needText}}</p></div></div>
    <div class="insight-part action-part"><span class="part-number">04</span><div><h3>现在可以先做一件小事</h3><template v-if="insight.primaryAction"><button class="primary-action" type="button" @click="$emit('open-care',insight.primaryAction.id)"><span>{{insight.primaryAction.icon}}</span><strong>{{insight.primaryAction.label}}</strong><small>选择这个</small></button><div class="secondary-actions"><button v-for="action in insight.secondaryActions" :key="action.id" type="button" @click="$emit('open-care',action.id)">{{action.icon}} {{action.label}}</button></div></template><p v-else>不做什么也很好，你仍然可以看看其他适合此刻的方式。</p><button class="more-actions-trigger" type="button" @click="showAll=true">看看其他方式</button></div></div>
  </div>
  <div class="insight-save"><p>推荐只是选项；只有你点击后，才会记为实际选择。</p><button class="secondary-button" type="button" @click="$emit('new-record')">记录新的时刻</button></div>
  <Teleport to="body"><Transition name="modal"><div v-if="showAll" class="modal-backdrop action-sheet-backdrop" @click.self="showAll=false"><section class="action-sheet" role="dialog" aria-modal="true" aria-label="选择其他关怀方式"><header><div><p class="eyebrow">更多关怀方式</p><h2>此刻你更想做什么？</h2></div><button type="button" aria-label="关闭" @click="showAll=false">×</button></header><div class="all-actions"><button v-for="action in ALL_ACTIONS" :key="action.id" type="button" @click="$emit('open-care',action.id);showAll=false"><span>{{action.icon}}</span><strong>{{action.label}}</strong></button></div></section></div></Transition></Teleport>
</section></template>
