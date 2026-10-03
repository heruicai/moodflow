<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
const active = ref(false)
const elapsed = ref(0)
let timer
const total = 60
const remaining = computed(() => Math.max(0, total - elapsed.value))
const phase = computed(() => {
  const cycle = elapsed.value % 12
  return cycle < 4 ? '吸气' : cycle < 6 ? '保持' : '呼气'
})
const phaseClass = computed(() => phase.value === '吸气' ? 'inhale' : phase.value === '保持' ? 'hold' : 'exhale')

function toggle() {
  if (active.value) return stop()
  if (elapsed.value >= total) elapsed.value = 0
  active.value = true
  timer = window.setInterval(() => {
    elapsed.value += 1
    if (elapsed.value >= total) stop()
  }, 1000)
}
function stop() { active.value = false; window.clearInterval(timer) }
onBeforeUnmount(stop)
</script>

<template>
  <div class="breathing-panel">
    <div class="breathing-stage">
      <div :class="['breathing-orbit', { active }, phaseClass]">
        <div class="breathing-circle"><span>{{ active ? phase : '准备好了吗' }}</span><small>{{ active ? `${remaining} 秒` : '1 分钟' }}</small></div>
      </div>
    </div>
    <div class="breathing-copy">
      <p class="eyebrow">随呼吸回到此刻</p>
      <h2>1 分钟呼吸练习</h2>
      <p>找一个舒服的姿势，让肩膀自然放松。跟随圆圈的节奏，不必刻意控制。</p>
      <button class="primary-button" @click="toggle">{{ active ? '暂停练习' : elapsed >= total ? '再来一次' : '开始呼吸' }}</button>
    </div>
  </div>
</template>
