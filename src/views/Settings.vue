<script setup>
import { ref, watch, onMounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import {
  Bell,
  Moon,
  Info,
  Shield,
  ChevronRight
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Modal from '../components/Modal.vue'

const router = useRouter()
const dark = ref(localStorage.getItem('orgconnect_dark') === 'true')
const notifications = ref(
  localStorage.getItem('orgconnect_notifications') !== 'false'
)
const aboutOpen = ref(false)

function applyDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled)
  document.body.classList.toggle('dark', enabled)
  localStorage.setItem('orgconnect_dark', String(enabled))
}

function toggleDark() {
  dark.value = !dark.value
}

function toggleNotifications() {
  notifications.value = !notifications.value
  localStorage.setItem(
    'orgconnect_notifications',
    String(notifications.value)
  )
}

watch(dark, applyDarkMode)

onMounted(() => {
  applyDarkMode(dark.value)
})
</script>

<template>
  <div class="page">
    <button
        class="back-button"
        type="button"
        @click="router.push('/more')"
        >
        <ArrowLeft :size="18" />
        Back
    </button>
    <section class="page-intro">
      <div>
        <span class="eyebrow">PREFERENCES</span>
        <h1>Settings</h1>
        <p>Customize your OrgConnect experience.</p>
      </div>
    </section>

    <div class="settings-group">
      <span class="settings-label">Preferences</span>

      <div class="settings-card">
        <button class="setting-row" type="button" @click="toggleNotifications">
          <div class="setting-icon"><Bell :size="19" /></div>
          <div>
            <strong>Notifications</strong>
            <span>Receive campus updates</span>
          </div>
          <span class="switch" :class="{ on: notifications }"><i></i></span>
        </button>

        <button class="setting-row" type="button" @click="toggleDark">
          <div class="setting-icon"><Moon :size="19" /></div>
          <div>
            <strong>Dark mode</strong>
            <span>{{ dark ? 'Dark appearance is enabled' : 'Use a darker appearance' }}</span>
          </div>
          <span class="switch" :class="{ on: dark }"><i></i></span>
        </button>
      </div>
    </div>

    <div class="settings-group">
      <span class="settings-label">Application</span>

      <div class="settings-card">
        <button class="setting-row" type="button" @click="router.push('/about')">
          <div class="setting-icon"><Info :size="19" /></div>
          <div>
            <strong>About OrgConnect</strong>
            <span>Version 1.0.0</span>
          </div>
          <ChevronRight :size="18" />
        </button>

        <button class="setting-row" type="button" @click="router.push('/profile')">
          <div class="setting-icon"><Shield :size="19" /></div>
          <div>
            <strong>Privacy &amp; security</strong>
            <span>Manage your account</span>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>

    <Modal :open="aboutOpen" title="About OrgConnect" @close="aboutOpen = false">
      <div class="about-modal">
        <h2>OrgConnect</h2>
        <p>
          A student organization management system for discovering
          organizations, managing members, and keeping up with events.
        </p>
        <small>Version 1.0.0</small>
        <button class="btn btn-primary btn-full" @click="aboutOpen = false">
          Close
        </button>
      </div>
    </Modal>
  </div>
</template>