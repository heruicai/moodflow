<script setup>
defineProps({ insight: { type: Object, required: true } })
defineEmits(['open-care'])
</script>

<template>
  <section class="insight-card">
    <div class="insight-top">
      <div><p class="eyebrow">你的情绪小结</p><h2>谢谢你愿意停下来，听见自己</h2></div>
      <span class="insight-badge">✦ 温柔洞察</span>
    </div>
    <div class="insight-facts">
      <div><span>我听到的情绪</span><strong>{{ insight.emotion }}</strong></div>
      <div><span>可能的触发因素</span><strong>{{ insight.trigger }}</strong></div>
      <div><span>当前可能的心理需求</span><strong>{{ insight.need }}</strong></div>
    </div>
    <blockquote>“{{ insight.summary }}”</blockquote>
    <div class="action-section">
      <div><p class="eyebrow">现在可以做的事</p><h3>从一个微小行动开始</h3></div>
      <div class="action-list">
        <button v-for="(action, index) in insight.actions" :key="action" @click="$emit('open-care')"><span>{{ index + 1 }}</span>{{ action }}</button>
      </div>
    </div>
  </section>
</template>
