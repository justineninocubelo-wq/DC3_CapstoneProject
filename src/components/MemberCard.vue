<script setup>
import { Mail, MoreVertical } from 'lucide-vue-next'

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete', 'view'])

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
</script>

<template>
  <article class="data-card member-card">
    <div class="avatar avatar-member">
      {{ getInitials(member?.name) }}
    </div>

    <div class="card-main">
      <div class="card-title-row">
        <div>
          <h3>{{ member.name }}</h3>
          <span class="role-text">{{ member.position }}</span>
        </div>

        <button
          class="more-button"
          aria-label="View full member information"
          @click="emit('view', member)"
        >
          <MoreVertical :size="19" />
        </button>
      </div>

      <p>{{ member.course }} • {{ member.year }}</p>

      <div class="card-meta">
        <span>{{ member.studentId }}</span>
        <span>
          <Mail :size="14" />
          {{ member.email }}
        </span>
      </div>

      <div class="card-actions">
        <button class="text-button" @click="emit('edit', member)">
          Edit
        </button>
        <button class="text-button danger-text" @click="emit('delete', member)">
          Delete
        </button>
      </div>
    </div>
  </article>
</template>
