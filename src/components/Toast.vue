<script setup>
defineProps({ visible: Boolean, message: String, type: { type: String, default: 'success' } })
</script>
<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="`toast-${type}`">{{ message }}</div>
  </Transition>
</template>
