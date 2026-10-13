<script setup>
import { CalendarDays, Clock3, MapPin, MoreVertical } from 'lucide-vue-next'

defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'status-change'])

function formatDate(date) {
  if (!date) return 'Date not set'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <article class="data-card event-card">
    <div class="date-tile">
      <strong>{{ formatDate(event.date).split(' ')[1] }}</strong>
      <span>{{ formatDate(event.date).split(' ')[0] }}</span>
    </div>

    <div class="card-main">
      <div class="card-title-row">
        <div>
          <h3>{{ event.title }}</h3>

          <span
            class="status-pill"
            :class="{
              'status-upcoming': event.status === 'Upcoming',
              'status-completed': event.status === 'Completed',
              'status-cancelled': event.status === 'Cancelled'
            }"
          >
            {{ event.status }}
          </span>
        </div>
      </div>

      <div class="event-info">
        <span>
          <Clock3 :size="14" />
          {{ event.time || 'TBD' }}–{{ event.endTime || 'TBD' }}
        </span>

        <span>
          <MapPin :size="14" />
          {{ event.location || 'Location not set' }}
        </span>
      </div>

      <small>{{ event.organization }}</small>

      <div class="card-actions event-card-actions">
        <label class="status-select-label">
          <span>Status</span>

          <select
            :value="event.status"
            aria-label="Change event status"
            @change="emit('status-change', {
              event,
              status: $event.target.value
            })"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <button
          class="text-button"
          type="button"
          @click="emit('edit', event)"
        >
          Edit
        </button>

        <button
          class="text-button danger-text"
          type="button"
          @click="emit('delete', event)"
        >
          Delete
        </button>
      </div>
    </div>
  </article>
</template>