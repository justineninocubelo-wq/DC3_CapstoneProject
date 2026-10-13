<script setup>
import { computed } from 'vue'
import {
  Building2,
  CalendarDays,
  Users,
  Bell,
  ArrowUpRight,
  ChevronRight,
  Sparkles
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { currentUser } from '../services/auth'
import { loadData } from '../services/storage'

const router = useRouter()

const organizations = loadData('organizations') || []
const events = loadData('events') || []
const members = loadData('members') || []
const announcements = loadData('announcements') || []

const firstName = computed(() =>
  currentUser.value?.name?.split(' ')[0] || 'Student'
)

const upcoming = computed(() =>
  events
    .filter(event => event.status === 'Upcoming')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 2)
)

const stats = [
  {
    label: 'Organizations',
    value: organizations.length,
    icon: Building2,
    route: '/organizations'
  },
  {
    label: 'Upcoming Events',
    value: events.filter(event => event.status === 'Upcoming').length,
    icon: CalendarDays,
    route: '/events'
  },
  {
    label: 'Total Members',
    value: members.length,
    icon: Users,
    route: '/members'
  },
  {
    label: 'Announcements',
    value: announcements.length,
    icon: Bell,
    route: '/announcements'
  }
]

function openFromHome(path) {
  router.push({
    path,
    query: {
      ...router.currentRoute.value.query,
      from: 'home'
    }
  })
}

function eventDay(date) {
  if (!date) return '--'
  return new Date(`${date}T00:00:00`).getDate()
}

function eventMonth(date) {
  if (!date) return 'TBD'

  return new Date(`${date}T00:00:00`)
    .toLocaleDateString('en-US', { month: 'short' })
}
</script>

<template>
  <div class="page">
    <section class="welcome-section">
      <div>
        <span class="eyebrow">YOUR CAMPUS HUB</span>
        <h1>Good evening, {{ firstName }}.</h1>
        <p>
          Stay connected with the organizations and activities
          that matter to you.
        </p>
      </div>

      <div class="sparkle-badge">
        <Sparkles :size="19" />
      </div>
    </section>

    <section class="stats-grid">
      <button
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
        type="button"
        @click="openFromHome(stat.route)"
      >
        <div class="stat-icon">
          <component :is="stat.icon" :size="18" />
        </div>

        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>

        <ArrowUpRight class="stat-arrow" :size="16" />
      </button>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="eyebrow">STAY INVOLVED</span>
          <h2>Upcoming Events</h2>
        </div>

        <button
          class="link-button"
          type="button"
          @click="openFromHome('/events')"
        >
          View all
        </button>
      </div>

      <div v-if="upcoming.length" class="stack">
        <article
          v-for="event in upcoming"
          :key="event.id"
          class="mini-event"
          @click="openFromHome('/events')"
        >
          <div class="date-tile small">
            <strong>{{ eventDay(event.date) }}</strong>
            <span>{{ eventMonth(event.date) }}</span>
          </div>

          <div class="mini-event-main">
            <h3>{{ event.title }}</h3>
            <p>
              {{ event.time || 'Time to be announced' }}
              <template v-if="event.location">
                · {{ event.location }}
              </template>
            </p>
            <small>{{ event.organization }}</small>
          </div>

          <ChevronRight :size="19" />
        </article>
      </div>

      <div v-else class="empty-state home-empty">
        <div class="empty-icon">
          <CalendarDays :size="25" />
        </div>

        <h3>No upcoming events</h3>
        <p>Check back later for new campus activities.</p>

        <button
          class="btn btn-secondary"
          type="button"
          @click="openFromHome('/events')"
        >
          View all events
        </button>
      </div>
    </section>
  </div>
</template>