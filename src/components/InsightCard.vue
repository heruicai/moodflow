<script setup>
defineProps({ insight:{type:Object,required:true}, saved:Boolean })
defineEmits(['save','open-care'])
</script>
<template><section class="insight-card">
  <div class="insight-top"><div><p class="eyebrow">此刻的小结</p><h2>一起看看，这份感受在说什么</h2></div><span class="insight-badge">✦ 情绪洞察</span></div>
  <div class="insight-sections">
    <div class="insight-part"><span class="part-number">01</span><div><h3>你现在可能正在经历</h3><p>{{ insight.experience }}</p></div></div>
    <div class="insight-part"><span class="part-number">02</span><div><h3>这件事可能触发了</h3><div class="insight-tags"><span v-for="tag in insight.triggers" :key="tag">{{ tag }}</span></div></div></div>
    <div class="insight-part"><span class="part-number">03</span><div><h3>你此刻更需要的也许是</h3><p>{{ insight.needText }}</p></div></div>
    <div class="insight-part action-part"><span class="part-number">04</span><div><h3>现在可以先做一件小事</h3><button class="primary-action" type="button" @click="$emit('open-care',insight.primaryAction.id)"><span>{{ insight.primaryAction.icon }}</span><strong>{{ insight.primaryAction.label }}</strong><small>现在试试</small></button><div class="secondary-actions"><button v-for="action in insight.secondaryActions" :key="action.id" type="button" @click="$emit('open-care',action.id)">{{ action.icon }} {{ action.label }}</button></div></div></div>
  </div>
  <div class="insight-save"><p>保存后，可以在趋势页回看这次记录。</p><button :class="['save-button',{saved}]" type="button" :disabled="saved" @click="$emit('save')">{{ saved ? '✓ 已保存' : '保存这次记录' }}</button></div>
</section></template>
