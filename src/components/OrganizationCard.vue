<script setup>
import { Users, ChevronRight, MoreVertical } from 'lucide-vue-next'
defineProps({ organization: Object })
const emit = defineEmits(['view', 'edit', 'delete'])
</script>
<template>
  <article class="data-card organization-card">
    <div class="org-avatar">{{ organization.initials }}</div>
    <div class="card-main">
      <div class="card-title-row">
        <div>
          <h3>{{ organization.name }}</h3>
          <span class="status-pill status-active">{{ organization.status }}</span>
        </div>
        <button class="more-button" @click.stop="emit('view', organization)"><ChevronRight :size="19" /></button>
      </div>
      <p>{{ organization.description }}</p>
      <div class="card-meta"><span><Users :size="15" /> {{ organization.members }} members</span><span>{{ organization.established }}</span></div>
      <div class="card-actions">
        <button class="text-button" @click="emit('edit', organization)">Edit</button>
        <button class="text-button danger-text" @click="emit('delete', organization)">Delete</button>
      </div>
    </div>
  </article>
</template>
