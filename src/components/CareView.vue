<script setup>
import BreathingExercise from './BreathingExercise.vue'
const careItems = [
  { icon: '♫', theme: 'lavender', tag: '声音', title: '给耳朵一片安静', text: '雨声、壁炉声或舒缓钢琴，选一种不会打扰你的声音。', action: '播放环境音' },
  { icon: '↝', theme: 'peach', tag: '身体', title: '让身体轻轻动起来', text: '散步十分钟，或做一组肩颈拉伸，让积压的紧绷慢慢松开。', action: '开始轻运动' },
  { icon: '✎', theme: 'blue', tag: '书写', title: '写给此刻的自己', text: '如果不需要表现得坚强，我现在最想对自己说什么？', action: '开始书写' },
]
</script>

<template>
  <section class="care-view">
    <div class="section-intro"><p class="eyebrow">自我关怀空间</p><h1>把一点温柔，<span>留给此刻的自己</span></h1><p>不用完成所有练习，选择一个当下愿意尝试的就好。</p></div>
    <section class="card breathing-card"><BreathingExercise /></section>
    <div class="care-grid">
      <article v-for="item in careItems" :key="item.title" :class="['care-card', item.theme]">
        <div class="care-icon">{{ item.icon }}</div><span class="care-tag">{{ item.tag }}</span>
        <h2>{{ item.title }}</h2><p>{{ item.text }}</p>
        <button>{{ item.action }} <span>›</span></button>
      </article>
    </div>
    <div class="gentle-reminder"><span>☼</span><div><strong>今天已经做得很好了</strong><p>照顾自己不是一项待办，也没有标准答案。哪怕只是停下来做一次深呼吸，也算数。</p></div></div>
  </section>
</template>
