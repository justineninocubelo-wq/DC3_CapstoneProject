<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Building2, CalendarDays, Users, MoreHorizontal } from 'lucide-vue-next'
import AppHeader from './AppHeader.vue'
import BottomNavigation from './BottomNavigation.vue'

const route = useRoute()
const router = useRouter()
const noHeader = computed(() => ['organization-details', 'profile', 'member-details', 'help', 'about', 'search'].includes(route.name))

const tabs = [
  { label: 'Home', icon: Home, route: '/home' },
  { label: 'Organizations', icon: Building2, route: '/organizations' },
  { label: 'Events', icon: CalendarDays, route: '/events' },
  { label: 'Members', icon: Users, route: '/members' },
  { label: 'More', icon: MoreHorizontal, route: '/more' }
]
</script>

<template>
  <div class="app-frame">
    <AppHeader v-if="!noHeader" />
    <main class="app-content" :class="{ 'content-no-header': noHeader }">
      <slot />
    </main>
    <BottomNavigation :tabs="tabs" />
  </div>
</template>