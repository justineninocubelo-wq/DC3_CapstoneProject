<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Bell,
  Search,
  ShieldCheck,
  X,
  Building2,
  CalendarDays,
  Users,
  Megaphone,
  ArrowUpRight
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { currentUser } from '../services/auth'
import { loadData } from '../services/storage'

const router = useRouter()

const searchOpen = ref(false)
const searchQuery = ref('')

const searchItems = computed(() => {
  const organizations = loadData('organizations') || []
  const events = loadData('events') || []
  const members = loadData('members') || []
  const announcements = loadData('announcements') || []

  return [
    ...organizations.map(item => ({
      id: `organization-${item.id}`,
      title: item.name,
      subtitle: `Organization · President: ${item.president || 'Not assigned'}`,
      icon: Building2,
      route: `/organizations/${item.id}`,
      searchable: [
        item.name,
        item.short,
        item.description,
        item.president,
        item.adviser,
        item.established,
        item.email
      ].filter(Boolean).join(' ')
    })),

    ...events.map(item => ({
      id: `event-${item.id}`,
      title: item.title,
      subtitle: `Event · ${item.date || 'Date not set'} · ${item.status || ''}`,
      icon: CalendarDays,
      route: '/events',
      searchable: [
        item.title,
        item.date,
        item.time,
        item.location,
        item.organization,
        item.status,
        item.description
      ].filter(Boolean).join(' ')
    })),

    ...members.map(item => ({
      id: `member-${item.id}`,
      title: item.name,
      subtitle: `Member · ${item.studentId || ''} · ${item.organization || ''}`,
      icon: Users,
      route: '/members',
      searchable: [
        item.name,
        item.studentId,
        item.email,
        item.course,
        item.year,
        item.position,
        item.organization
      ].filter(Boolean).join(' ')
    })),

    ...announcements.map(item => ({
      id: `announcement-${item.id}`,
      title: item.title,
      subtitle: `Announcement · ${item.organization || ''}`,
      icon: Megaphone,
      route: '/announcements',
      searchable: [
        item.title,
        item.organization,
        item.date,
        item.body,
        item.status
      ].filter(Boolean).join(' ')
    }))
  ]
})

const searchResults = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) return []

  return searchItems.value
    .filter(item => item.searchable.toLowerCase().includes(keyword))
    .slice(0, 20)
})

function openSearch() {
  searchOpen.value = true
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function openResult(item) {
  closeSearch()
  router.push(item.route)
}

function goHome() {
  router.push('/home')
}

function handleEscape(event) {
  if (event.key === 'Escape') closeSearch()
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <header class="app-header">
    <button
      class="brand-mini"
      type="button"
      aria-label="Go to OrgConnect home"
      @click="goHome"
    >
      <span class="brand-mark-mini">
        <ShieldCheck :size="21" />
      </span>
      <span class="brand-name">OrgConnect</span>
    </button>

    <div class="header-actions">
      <button
        class="icon-button"
        type="button"
        aria-label="Search OrgConnect"
        @click="openSearch"
      >
        <Search :size="20" />
      </button>

      <button
        class="icon-button notification-button"
        type="button"
        aria-label="View announcements"
        @click="router.push('/announcements')"
      >
        <Bell :size="20" />
        <span class="notification-dot"></span>
      </button>

      <button
        class="avatar avatar-small"
        type="button"
        aria-label="Open profile"
        @click="router.push('/profile')"
      >
        {{
          currentUser?.avatar ||
          currentUser?.name
            ?.split(' ')
            .map(part => part[0])
            .slice(0, 2)
            .join('') ||
          'ST'
        }}
      </button>
    </div>
  </header>

  <div
    v-if="searchOpen"
    class="global-search-backdrop"
    @click.self="closeSearch"
  >
    <section
      class="global-search-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Search OrgConnect"
    >
      <div class="global-search-top">
        <div class="global-search-input">
          <Search :size="19" />

          <input
            v-model="searchQuery"
            autofocus
            type="search"
            placeholder="Search organizations, events, members..."
          />

          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <X :size="17" />
          </button>
        </div>

        <button
          type="button"
          class="global-search-close"
          @click="closeSearch"
        >
          Close
        </button>
      </div>

      <p class="global-search-caption">
        <template v-if="searchQuery.trim()">
          {{ searchResults.length }} result(s) found
        </template>
        <template v-else>
          Search across all OrgConnect sections using a keyword.
        </template>
      </p>

      <div
        v-if="searchResults.length"
        class="global-search-results"
      >
        <button
          v-for="item in searchResults"
          :key="item.id"
          type="button"
          class="global-search-result"
          @click="openResult(item)"
        >
          <span class="search-result-icon">
            <component :is="item.icon" :size="18" />
          </span>

          <span class="search-result-copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.subtitle }}</small>
          </span>

          <ArrowUpRight :size="17" />
        </button>
      </div>

      <div
        v-else-if="searchQuery.trim()"
        class="global-search-empty"
      >
        <Search :size="25" />
        <strong>No results found</strong>
        <span>Try another keyword or check your spelling.</span>
      </div>

      <div
        v-else
        class="global-search-categories"
      >
        <span><Building2 :size="15" /> Organizations</span>
        <span><CalendarDays :size="15" /> Events</span>
        <span><Users :size="15" /> Members</span>
        <span><Megaphone :size="15" /> Announcements</span>
      </div>
    </section>
  </div>
</template>