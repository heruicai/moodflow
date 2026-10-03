<script setup>
const props = defineProps({ modelValue: { type: Array, default: () => [] }, options: { type: Array, required: true }, max: { type: Number, default: Infinity }, single: Boolean })
const emit = defineEmits(['update:modelValue'])
function toggle(item) { if (props.single) return emit('update:modelValue', props.modelValue.includes(item) ? [] : [item]); if (props.modelValue.includes(item)) emit('update:modelValue', props.modelValue.filter(value => value !== item)); else if (props.modelValue.length < props.max) emit('update:modelValue', [...props.modelValue, item]) }
</script>
<template><div class="tag-list"><button v-for="item in options" :key="item" type="button" :class="['tag-chip', { selected: modelValue.includes(item), disabled: !modelValue.includes(item) && modelValue.length >= max }]" :aria-pressed="modelValue.includes(item)" @click="toggle(item)"><span v-if="modelValue.includes(item)">✓</span>{{ item }}</button></div></template>
