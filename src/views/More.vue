<script setup>
import {
  Bell,
  UserRound,
  Settings,
  CircleHelp,
  Info,
  LogOut,
  ChevronRight
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { logout, currentUser } from '../services/auth'
import { ref } from 'vue'

const showLogoutConfirm = ref(false)

const router = useRouter()

function signOut() {
  logout()
  router.replace('/login')
}

function confirmLogout() {
  logout()
  showLogoutConfirm.value = false
  router.replace('/login')
}
</script>

<template>
  <div class="page">
    <section class="more-profile" @click="router.push('/profile')">
      <div class="avatar">{{ currentUser?.avatar || 'AS' }}</div>

      <div>
        <span class="eyebrow">SIGNED IN AS</span>
        <h2>{{ currentUser?.name || 'Student' }}</h2>
        <p>{{ currentUser?.course || 'Student' }}</p>
      </div>

      <ChevronRight :size="19" />
    </section>

    <section class="menu-section">
      <span class="settings-label">Menu</span>

      <div class="menu-card">
        <button class="menu-row" @click="router.push('/announcements')">
          <div class="menu-icon"><Bell :size="20" /></div>
          <div>
            <strong>Announcements</strong>
            <span>Latest organization updates</span>
          </div>
          <ChevronRight :size="18" />
        </button>

        <button class="menu-row" @click="router.push('/profile')">
          <div class="menu-icon"><UserRound :size="20" /></div>
          <div>
            <strong>Profile</strong>
            <span>Edit your student information</span>
          </div>
          <ChevronRight :size="18" />
        </button>

        <button class="menu-row" @click="router.push('/settings')">
          <div class="menu-icon"><Settings :size="20" /></div>
          <div>
            <strong>Settings</strong>
            <span>Preferences and appearance</span>
          </div>
          <ChevronRight :size="18" />
        </button>

        <button class="menu-row" @click="router.push('/help')">
          <div class="menu-icon"><CircleHelp :size="20" /></div>
          <div>
            <strong>Help &amp; Support</strong>
            <span>Get help using OrgConnect</span>
          </div>
          <ChevronRight :size="18" />
        </button>

        <button class="menu-row" @click="router.push('/about')">
          <div class="menu-icon"><Info :size="20" /></div>
          <div>
            <strong>About</strong>
            <span>Learn more about the app</span>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>
    </section>

    <button class="logout-button" @click="showLogoutConfirm = true">
        <LogOut :size="19" />
        Log out
    </button>

    <div class="app-version">OrgConnect · v1.0.0</div>
    <div v-if="showLogoutConfirm" class="logout-overlay">
    <div class="logout-dialog">
        <h2>Log out?</h2>
        <p>Are you sure you want to log out of your OrgConnect account?</p>

        <div class="logout-dialog-actions">
        <button
            class="logout-cancel"
            @click="showLogoutConfirm = false"
        >
            Cancel
        </button>

        <button class="logout-confirm" @click="confirmLogout">
            Log Out
        </button>
        </div>
    </div>
    </div>
  </div>
</template>