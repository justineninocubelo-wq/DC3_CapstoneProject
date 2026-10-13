<script setup>
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Hash,
  LogOut,
  Mail,
  Pencil,
  Save,
  X,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { currentUser, logout, updateCurrentUser } from '../services/auth'
import { loadData } from '../services/storage'

const showLogoutConfirm = ref(false)


const router = useRouter()
const editOpen = ref(false)

const organizations = loadData('organizations') ?? []
const events = loadData('events') ?? []

const profile = computed(() => currentUser.value ?? {})
const myOrgs = organizations.slice(0, 2)
const upcoming = events.filter((event) => event.status === 'Upcoming').slice(0, 2)

const form = ref({
  name: '',
  email: '',
  studentId: '',
  course: '',
  year: '',
})

const getInitials = (value = '') =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function confirmLogout() {
  logout()
  showLogoutConfirm.value = false
  router.replace('/login')
}

function openEdit() {
  const user = currentUser.value

  form.value = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    studentId: user?.studentId ?? '',
    course: user?.course ?? '',
    year: user?.year ?? '',
  }

  editOpen.value = true
}

function save() {
  const name = form.value.name.trim()
  const email = form.value.email.trim()

  if (!name || !email) return

  updateCurrentUser({
    ...form.value,
    name,
    email,
    avatar: getInitials(name),
  })

  editOpen.value = false
  window.__orgconnectToast?.('Profile updated successfully.')
}

function signOut() {
  logout()
  router.replace('/login')
}
</script>

<template>
  <div class="page profile-page">
    <button class="back-button" @click="router.back()">
      <ArrowLeft :size="18" /> Back
    </button>

    <section class="profile-hero">
      <div class="avatar profile-avatar">{{ profile.avatar || 'AS' }}</div>
      <span class="eyebrow">STUDENT PROFILE</span>
      <h1>{{ profile.name }}</h1>
      <p>{{ profile.email }}</p>
      <button class="btn btn-primary" @click="openEdit">
        <Pencil :size="16" /> Edit profile
      </button>
    </section>

    <div class="profile-details">
      <div>
        <Hash :size="18" />
        <span>
          <small>Student ID</small>
          <strong>{{ profile.studentId || 'Not provided' }}</strong>
        </span>
      </div>
      <div>
        <GraduationCap :size="18" />
        <span>
          <small>Program</small>
          <strong>{{ profile.course || 'Not provided' }}</strong>
        </span>
      </div>
      <div>
        <CalendarDays :size="18" />
        <span>
          <small>Year level</small>
          <strong>{{ profile.year || 'Not provided' }}</strong>
        </span>
      </div>
      <div>
        <Mail :size="18" />
        <span>
          <small>Email</small>
          <strong>{{ profile.email }}</strong>
        </span>
      </div>
    </div>

    <section class="detail-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">MY COMMUNITY</span>
          <h2>Organizations</h2>
        </div>
        <button class="link-button" @click="router.push('/organizations')">Explore</button>
      </div>

      <div class="profile-list">
        <button
          v-for="organization in myOrgs"
          :key="organization.id"
          class="simple-row clickable"
          @click="router.push(`/organizations/${organization.id}`)"
        >
          <div class="org-avatar small">{{ organization.initials }}</div>
          <div>
            <strong>{{ organization.name }}</strong>
            <span>{{ organization.members }} members</span>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>
    </section>

    <section class="detail-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">CALENDAR</span>
          <h2>Upcoming events</h2>
        </div>
      </div>

      <div class="profile-list">
        <div v-for="event in upcoming" :key="event.id" class="simple-row">
          <div class="row-icon">
            <CalendarDays :size="18" />
          </div>
          <div>
            <strong>{{ event.title }}</strong>
            <span>{{ event.date }} • {{ event.time }}</span>
          </div>
        </div>
      </div>
    </section>

    <button class="logout-button" @click="showLogoutConfirm = true">
      <LogOut :size="18" /> Log out
    </button>

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

    <div v-if="editOpen" class="modal-backdrop" @click.self="editOpen = false">
      <section class="modal-card">
        <header class="modal-header">
          <div>
            <h2>Edit profile</h2>
            <p>Update your student information.</p>
          </div>
          <button class="icon-button" @click="editOpen = false">
            <X :size="19" />
          </button>
        </header>

        <form class="modal-form" @submit.prevent="save">
          <div class="field">
            <label>Full name *</label>
            <input v-model="form.name" required />
          </div>

          <div class="field">
            <label>Email *</label>
            <input v-model="form.email" type="email" required />
          </div>

          <div class="field">
            <label>Student ID</label>
            <input v-model="form.studentId" />
          </div>

          <div class="field">
            <label>Course / Program</label>
            <input v-model="form.course" />
          </div>

          <div class="field">
            <label>Year level</label>
            <select v-model="form.year">
              <option value="">Select year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="editOpen = false">Cancel</button>
            <button class="btn btn-primary">
              <Save :size="16" /> Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

