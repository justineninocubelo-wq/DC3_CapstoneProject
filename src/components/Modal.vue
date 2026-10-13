<script setup>
import { X } from 'lucide-vue-next'
defineProps({ open: Boolean, title: String, subtitle: String })
const emit = defineEmits(['close'])
</script>
<template>
  <Transition name="modal">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <section class="modal-card">
        <div class="modal-header">
          <div>
            <h3>{{ title }}</h3>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
          <button class="icon-button" @click="emit('close')" aria-label="Close"><X :size="20" /></button>
        </div>
        <div class="modal-body"><slot /></div>
      </section>
    </div>
  </Transition>
</template>
