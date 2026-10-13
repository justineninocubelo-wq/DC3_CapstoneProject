<script setup>
import { Search, X } from 'lucide-vue-next'
defineProps({ modelValue: String, placeholder: { type: String, default: 'Search...' } })
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <div class="search-bar">
    <Search :size="19" />
    <input :value="modelValue" :placeholder="placeholder" @input="emit('update:modelValue', $event.target.value)" />
    <button v-if="modelValue" class="search-clear" @click="emit('update:modelValue', '')"><X :size="16" /></button>
  </div>
</template>
