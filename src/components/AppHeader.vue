<script setup>
import { Bell, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { currentUser } from '../services/auth'

const router = useRouter()
</script>

<template>
  <header class="app-header">
    <div>
      <div class="brand-mini">
        <span class="brand-dot"></span>
        OrgConnect
      </div>
    </div>

    <div class="header-actions">
      <button class="icon-button" aria-label="Search" @click="router.push('/search')">
        <Search :size="20" />
      </button>

      <button
        class="icon-button notification-button"
        aria-label="Notifications"
        @click="router.push('/announcements')"
      >
        <Bell :size="20" />
        <span class="notification-dot"></span>
      </button>

      <button
        class="avatar avatar-small"
        aria-label="Profile and account"
        @click="router.push('/profile')"
      >
        {{ currentUser?.avatar || 'AS' }}
      </button>
    </div>
  </header>
</template>
