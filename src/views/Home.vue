<script setup>
import { computed } from 'vue'
import { Building2, CalendarDays, Users, Bell, ArrowUpRight, ChevronRight, Plus, Sparkles, Search } from 'lucide-vue-next'
import { ref } from 'vue'
import { currentUser } from '../services/auth'
import { loadData } from '../services/storage'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
function search(){router.push({path:'/search',query:{q:searchQuery.value}})}
const organizations = loadData('organizations')
const events = loadData('events')
const members = loadData('members')
const announcements = loadData('announcements')
const upcoming = computed(() => events.filter(e => e.status === 'Upcoming').slice(0, 2))
const firstName = computed(() => currentUser.value?.name?.split(' ')[0] || 'Student')
const stats = [
  { label: 'Organizations', value: organizations.length, icon: Building2, route: '/organizations' },
  { label: 'Upcoming events', value: events.filter(e => e.status === 'Upcoming').length, icon: CalendarDays, route: '/events' },
  { label: 'Total members', value: members.length, icon: Users, route: '/members' },
  { label: 'Announcements', value: announcements.length, icon: Bell, route: '/announcements' }
]
</script>

<template>
  <div class="page">
    <section class="welcome-section">
      <div><span class="eyebrow">YOUR CAMPUS HUB</span><h1>Good evening, {{ firstName }}.</h1><p>Stay connected with the organizations and activities that matter to you.</p></div>
      <div class="sparkle-badge"><Sparkles :size="19" /></div>
    </section>

    <form class="search-bar home-search" @submit.prevent="search"><Search :size="18"/><input v-model="searchQuery" placeholder="Search organizations, members, events..." aria-label="Search organizations, members, and events"/><button aria-label="Submit search"><ArrowUpRight :size="18"/></button></form>

    <section class="stats-grid">
      <button v-for="stat in stats" :key="stat.label" class="stat-card" @click="router.push(stat.route)">
        <div class="stat-icon"><component :is="stat.icon" :size="18" /></div>
        <strong>{{ stat.value }}</strong><span>{{ stat.label }}</span>
        <ArrowUpRight class="stat-arrow" :size="16" />
      </button>
    </section>

    <section class="section-block">
      <div class="section-heading"><div><span class="eyebrow">STAY INVOLVED</span><h2>Upcoming events</h2></div><button class="link-button" @click="router.push('/events')">View all</button></div>
      <div class="stack">
        <article v-for="event in upcoming" :key="event.id" class="mini-event" @click="router.push('/events')">
          <div class="date-tile small"><strong>{{ new Date(event.date + 'T00:00:00').getDate() }}</strong><span>{{ new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }) }}</span></div>
          <div class="mini-event-main"><h3>{{ event.title }}</h3><p>{{ event.time }} • {{ event.location }}</p><small>{{ event.organization }}</small></div><ChevronRight :size="19" />
        </article>
      </div>
    </section>

    <section class="quick-action-card">
      <div><span class="eyebrow light">QUICK ACTION</span><h2>Build your campus community.</h2><p>Explore organizations and discover where your interests can take you.</p></div>
      <button class="round-action" @click="router.push('/organizations')"><Plus :size="21" /></button>
    </section>
  </div>
</template>
