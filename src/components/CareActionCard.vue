<script setup>
defineProps({title:String,duration:String,icon:String,steps:Array,active:Boolean})
defineEmits(['toggle'])
</script>
<template><article :class="['movement-card',{active}]"><button type="button" @click="$emit('toggle')"><span class="movement-icon">{{ icon }}</span><span><strong>{{ title }}</strong><small>{{ duration }}</small></span><b>{{ active?'−':'+' }}</b></button><Transition name="fade"><ol v-if="active"><li v-for="step in steps" :key="step">{{ step }}</li></ol></Transition></article></template>
