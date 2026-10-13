<script setup>
defineProps({ title: String, message: String, buttonText: String })
const emit = defineEmits(['action'])
</script>
<template>
  <div class="empty-state">
    <div class="empty-icon"><slot name="icon" /></div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button v-if="buttonText" class="btn btn-primary" @click="emit('action')">{{ buttonText }}</button>
  </div>
</template>
