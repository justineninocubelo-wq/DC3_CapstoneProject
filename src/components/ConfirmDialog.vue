<script setup>
import Modal from './Modal.vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  open: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Modal :open="open" :title="title" @close="emit('close')">
    <div class="confirm-content">
      <div class="warning-icon">
        <AlertTriangle :size="23" />
      </div>

      <p>{{ message }}</p>

      <div class="modal-actions confirm-actions">
        <button
          type="button"
          class="btn btn-secondary confirm-no"
          @click="emit('close')"
        >
          NO
        </button>

        <button
          type="button"
          class="btn btn-danger confirm-delete"
          @click="emit('confirm')"
        >
          DELETE
        </button>
      </div>
    </div>
  </Modal>
</template>