<script setup>
import { CalendarDays, Clock3, MapPin, CheckCircle2 } from 'lucide-vue-next'
defineProps({ event: Object })
const emit = defineEmits(['edit', 'delete', 'complete'])
const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>
<template>
  <article class="data-card event-card">
    <div class="date-tile"><strong>{{ formatDate(event.date).split(' ')[1] }}</strong><span>{{ formatDate(event.date).split(' ')[0] }}</span></div>
    <div class="card-main">
      <div class="card-title-row"><div><h3>{{ event.title }}</h3><span class="status-pill" :class="event.status === 'Completed' ? 'status-completed' : 'status-upcoming'">{{ event.status }}</span></div></div>
      <div class="event-info"><span><Clock3 :size="14" /> {{ event.time }}–{{ event.endTime }}</span><span><MapPin :size="14" /> {{ event.location }}</span></div>
      <small>{{ event.organization }}</small>
      <div class="card-actions"><button v-if="event.status !== 'Completed'" class="text-button" @click="emit('complete', event)"><CheckCircle2 :size="14"/> Completed</button><button class="text-button" @click="emit('edit', event)">Edit</button><button class="text-button danger-text" @click="emit('delete', event)">Delete</button></div>
    </div>
  </article>
</template>