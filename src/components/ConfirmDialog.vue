<script setup>
import Modal from './Modal.vue'
import { AlertTriangle } from 'lucide-vue-next'
defineProps({ open: Boolean, title: String, message: String })
const emit = defineEmits(['close', 'confirm'])
</script>
<template>
  <Modal :open="open" :title="title" @close="emit('close')">
    <div class="confirm-content">
      <div class="warning-icon"><AlertTriangle :size="23" /></div>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="emit('close')">Cancel</button>
        <button class="btn btn-danger" @click="emit('confirm')">Delete</button>
      </div>
    </div>
  </Modal>
</template>
