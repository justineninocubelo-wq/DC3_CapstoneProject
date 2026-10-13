<script setup>
import { Bell, MoreVertical } from 'lucide-vue-next'
defineProps({ announcement: Object })
const emit = defineEmits(['edit', 'delete'])
</script>
<template>
  <article class="data-card announcement-card">
    <div class="announcement-icon"><Bell :size="19" /></div>
    <div class="card-main">
      <div class="card-title-row"><div><h3>{{ announcement.title }}</h3><span class="status-pill" :class="announcement.status === 'Important' ? 'status-important' : 'status-new'">{{ announcement.status }}</span></div><button class="more-button"><MoreVertical :size="19" /></button></div>
      <small>{{ announcement.organization }} • {{ new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</small>
      <p>{{ announcement.body }}</p>
      <div class="card-actions"><button class="text-button" @click="emit('edit', announcement)">Edit</button><button class="text-button danger-text" @click="emit('delete', announcement)">Delete</button></div>
    </div>
  </article>
</template>
