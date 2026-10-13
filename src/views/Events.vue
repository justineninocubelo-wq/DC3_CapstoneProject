<script setup>
import { computed, ref } from 'vue'
import { CalendarDays, Plus } from 'lucide-vue-next'

import { useCrud } from '../composables/useCrud'
import SearchBar from '../components/SearchBar.vue'
import EventCard from '../components/EventCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { loadData } from '../services/storage'

const { items, add, update, remove } = useCrud('events')
const organizations = loadData('organizations')

const search = ref('')
const filter = ref('All')
const modalOpen = ref(false)
const editing = ref(null)
const deleting = ref(null)

const defaultForm = () => ({
  title: '',
  date: '',
  time: '09:00',
  endTime: '10:00',
  location: '',
  organization: organizations[0]?.name || '',
  status: 'Upcoming',
  description: '',
})

const form = ref(defaultForm())

const filtered = computed(() =>
  items.value.filter((event) => {
    const matchesFilter = filter.value === 'All' || event.status === filter.value
    const searchableText = `${event.title} ${event.organization} ${event.location}`.toLowerCase()
    const matchesSearch = searchableText.includes(search.value.toLowerCase())

    return matchesFilter && matchesSearch
  })
)

const filterOptions = ['All', 'Upcoming', 'Completed']

function reset() {
  form.value = defaultForm()
}

function openAdd() {
  editing.value = null
  reset()
  modalOpen.value = true
}

function openEdit(event) {
  editing.value = event
  form.value = { ...event }
  modalOpen.value = true
}

function save() {
  if (!form.value.title || !form.value.date) return

  if (editing.value) {
    update(editing.value.id, form.value)
  } else {
    add(form.value)
  }

  modalOpen.value = false
  window.__orgconnectToast?.(
    editing.value ? 'Event updated successfully.' : 'Event added successfully.'
  )
}

function markCompleted(event) {
  update(event.id, { ...event, status: 'Completed' })
  window.__orgconnectToast?.('Event marked as completed.')
}

function confirmDelete() {
  remove(deleting.value.id)
  deleting.value = null
  window.__orgconnectToast?.('Event deleted successfully.')
}
</script>
<template>
  <div class="page">
    <section class="page-intro">
      <div>
        <span class="eyebrow">CAMPUS CALENDAR</span>
        <h1>Events</h1>
        <p>Keep track of activities and organization events.</p>
      </div>

      <button class="fab desktop-fab" @click="openAdd">
        <Plus :size="20" />
        <span>Add</span>
      </button>
    </section>

    <div class="toolbar">
      <SearchBar v-model="search" placeholder="Search events..." />
    </div>

    <div class="segmented">
      <button
        v-for="item in filterOptions"
        :key="item"
        :class="{ active: filter === item }"
        @click="filter = item"
      >
        {{ item }}
      </button>
    </div>

    <div v-if="filtered.length" class="stack">
      <EventCard
        v-for="event in filtered"
        :key="event.id"
        :event="event"
        @edit="openEdit"
        @delete="deleting = $event"
        @complete="markCompleted"
      />
    </div>

    <EmptyState
      v-else
      title="No events found"
      message="There are no events matching your current view."
      button-text="Add event"
      @action="openAdd"
    >
      <template #icon>
        <CalendarDays :size="28" />
      </template>
    </EmptyState>

    <button class="floating-add" @click="openAdd">
      <Plus :size="25" />
    </button>

    <Modal :open="modalOpen" :title="editing ? 'Edit event' : 'Add event'" @close="modalOpen = false">
      <form class="modal-form" @submit.prevent="save">
        <div class="field">
          <label>Event title *</label>
          <input v-model="form.title" required placeholder="Event title" />
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Date *</label>
            <input v-model="form.date" required type="date" />
          </div>

          <div class="field">
            <label>Organization</label>
            <select v-model="form.organization">
              <option v-for="org in organizations" :key="org.id">
                {{ org.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Start time</label>
            <input v-model="form.time" type="time" />
          </div>

          <div class="field">
            <label>End time</label>
            <input v-model="form.endTime" type="time" />
          </div>
        </div>

        <div class="field">
          <label>Location</label>
          <input v-model="form.location" placeholder="Venue" />
        </div>

        <div class="field">
          <label>Description</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="modalOpen = false">Cancel</button>
          <button class="btn btn-primary" type="submit">
            {{ editing ? 'Save changes' : 'Add event' }}
          </button>
        </div>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleting"
      title="Delete event?"
      :message="`Are you sure you want to delete ${deleting?.title || 'this event'}?`"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>