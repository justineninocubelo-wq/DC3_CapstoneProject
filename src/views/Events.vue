<script setup>
import { computed, ref } from 'vue'
import { CalendarDays, Plus, SlidersHorizontal, ArrowLeft } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useCrud } from '../composables/useCrud'
import SearchBar from '../components/SearchBar.vue'
import EventCard from '../components/EventCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { loadData } from '../services/storage'

const route = useRoute()
const router = useRouter()

const { items, add, update, remove } = useCrud('events')
const organizations = loadData('organizations') || []

const search = ref('')
const activeTab = ref('All')
const filtersOpen = ref(false)
const filters = ref({ name: '', status: '' })

const modalOpen = ref(false)
const editing = ref(null)
const deleting = ref(null)

const tabs = ['All', 'Upcoming', 'Cancelled', 'Completed']

const defaultForm = () => ({
  title: '',
  date: '',
  time: '09:00',
  endTime: '10:00',
  location: '',
  organization: organizations[0]?.name || '',
  status: 'Upcoming',
  description: ''
})

const form = ref(defaultForm())

const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const nameFilter = filters.value.name.trim().toLowerCase()

  return items.value.filter(event => {
    const matchesTab =
      activeTab.value === 'All' ||
      event.status === activeTab.value

    const searchable = [
      event.title,
      event.organization,
      event.location,
      event.description,
      event.status
    ].filter(Boolean).join(' ').toLowerCase()

    const matchesSearch = !keyword || searchable.includes(keyword)
    const matchesName = !nameFilter ||
      (event.title || '').toLowerCase().includes(nameFilter)

    const matchesStatus =
      !filters.value.status ||
      event.status === filters.value.status

    return matchesTab && matchesSearch && matchesName && matchesStatus
  })
})

function countFor(status) {
  if (status === 'All') return items.value.length

  return items.value.filter(event => event.status === status).length
}

function openAdd() {
  editing.value = null
  form.value = defaultForm()
  modalOpen.value = true
}

function openEdit(event) {
  editing.value = event
  form.value = { ...event }
  modalOpen.value = true
}

function save() {
  if (!form.value.title.trim() || !form.value.date) {
    window.__orgconnectToast?.('Please enter an event title and date.', 'error')
    return
  }

  const wasEditing = Boolean(editing.value)

  if (wasEditing) {
    update(editing.value.id, { ...form.value })
  } else {
    add({ ...form.value })
  }

  modalOpen.value = false
  editing.value = null

  window.__orgconnectToast?.(
    wasEditing
      ? 'Event changes saved successfully.'
      : 'Event added successfully.'
  )
}

function changeStatus({ event, status }) {
  if (!event || event.status === status) return

  update(event.id, { ...event, status })

  window.__orgconnectToast?.(
    status === 'Completed'
      ? 'Event marked as completed and moved to Completed.'
      : status === 'Cancelled'
        ? 'Event cancelled and moved to Cancelled.'
        : 'Event status changed to Upcoming.'
  )
}

function confirmDelete() {
  if (!deleting.value) return

  remove(deleting.value.id)
  deleting.value = null

  window.__orgconnectToast?.('Event deleted successfully.')
}

function clearFilters() {
  filters.value = { name: '', status: '' }
  search.value = ''
}

function goBack() {
  if (route.query.from === 'home') {
    router.push('/home')
  } else {
    router.push('/home')
  }
}
</script>

<template>
  <div class="page">
    <button
      v-if="route.query.from === 'home'"
      class="back-button"
      type="button"
      @click="goBack"
    >
      <ArrowLeft :size="18" />
      Back to Home
    </button>

    <section class="page-intro">
      <div>
        <span class="eyebrow">CAMPUS CALENDAR</span>
        <h1>Events</h1>
        <p>Keep track of activities and organization events.</p>
      </div>

      <button class="fab desktop-fab" type="button" @click="openAdd">
        <Plus :size="20" />
        <span>Add</span>
      </button>
    </section>

    <div class="toolbar">
      <SearchBar v-model="search" placeholder="Search events..." />

      <button
        class="filter-button"
        type="button"
        aria-label="Open event filters"
        @click="filtersOpen = !filtersOpen"
      >
        <SlidersHorizontal :size="19" />
      </button>
    </div>

    <div v-if="filtersOpen" class="filter-panel">
      <div class="field">
        <label>Event name</label>
        <input
          v-model="filters.name"
          placeholder="Filter by event name"
        />
      </div>

      <div class="field">
        <label>Status</label>
        <select v-model="filters.status">
          <option value="">All statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button class="text-button" type="button" @click="clearFilters">
        Clear filters
      </button>
    </div>

    <div class="segmented event-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
        <span class="tab-count">{{ countFor(tab) }}</span>
      </button>
    </div>

    <div v-if="filtered.length" class="stack">
      <EventCard
        v-for="event in filtered"
        :key="event.id"
        :event="event"
        @edit="openEdit"
        @delete="deleting = $event"
        @status-change="changeStatus"
      />
    </div>

    <EmptyState
      v-else
      title="No events found"
      message="There are no events matching your current search or filters."
      button-text="Add event"
      @action="openAdd"
    >
      <template #icon>
        <CalendarDays :size="28" />
      </template>
    </EmptyState>

    <button
      class="floating-add"
      type="button"
      aria-label="Add event"
      @click="openAdd"
    >
      <Plus :size="25" />
    </button>

    <Modal
      :open="modalOpen"
      :title="editing ? 'Edit event' : 'Add event'"
      @close="modalOpen = false"
    >
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
              <option
                v-for="org in organizations"
                :key="org.id"
                :value="org.name"
              >
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

        <div class="field">
          <label>Status</label>
          <select v-model="form.status">
            <option value="Upcoming">Upcoming</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="modalOpen = false"
          >
            Cancel
          </button>

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