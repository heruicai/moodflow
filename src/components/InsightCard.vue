<script setup>
defineProps({ insight:{type:Object,required:true} })
defineEmits(['open-care','new-record'])
</script>
<template><section class="insight-card">
  <div class="insight-top"><div><p class="eyebrow">此刻的小结</p><h2>一起看看，这份感受在说什么</h2></div><span class="insight-badge">✦ 情绪洞察</span></div>
  <div class="insight-sections">
    <div class="insight-part"><span class="part-number">01</span><div><h3>你现在可能正在经历</h3><p>{{ insight.experience }}</p></div></div>
    <div class="insight-part"><span class="part-number">02</span><div><h3>这件事可能触发了</h3><div class="insight-tags"><span v-for="tag in insight.triggers" :key="tag">{{ tag }}</span></div></div></div>
    <div class="insight-part"><span class="part-number">03</span><div><h3>你此刻更需要的也许是</h3><p>{{ insight.needText }}</p></div></div>
    <div class="insight-part action-part"><span class="part-number">04</span><div><h3>{{ insight.primaryAction?'现在可以先做一件小事':'现在，不做什么也很好' }}</h3><template v-if="insight.primaryAction"><button class="primary-action" type="button" @click="$emit('open-care',insight.primaryAction.id)"><span>{{ insight.primaryAction.icon }}</span><strong>{{ insight.primaryAction.label }}</strong><small>现在试试</small></button><div class="secondary-actions"><button v-for="action in insight.secondaryActions" :key="action.id" type="button" @click="$emit('open-care',action.id)">{{ action.icon }} {{ action.label }}</button></div></template><p v-else>就留在这份好心情里，不必把它变成另一项任务。</p></div></div>
  </div>
  <div class="insight-save"><p>这一刻已经自动保存，可以在趋势页回看。</p><button class="secondary-button" type="button" @click="$emit('new-record')">记录新的一刻</button></div>
</section></template>
