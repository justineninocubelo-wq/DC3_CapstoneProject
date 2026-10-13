<script setup>
import { computed } from 'vue'
import { ArrowLeft, Mail, UserRound, GraduationCap, Building2, BadgeCheck } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { loadData } from '../services/storage'

const route = useRoute()
const router = useRouter()

const member = computed(() =>
  (loadData('members') || []).find(
    item => Number(item.id) === Number(route.params.id)
  )
)
</script>

<template>
  <div class="page">
    <button class="back-button" type="button" @click="router.push('/members')">
      <ArrowLeft :size="18" />
      Back to Members
    </button>

    <template v-if="member">
      <section class="member-profile-hero">
        <div class="avatar member-profile-avatar">
          {{ member.name.split(' ').map(part => part[0]).slice(0, 2).join('') }}
        </div>
        <h1>{{ member.name }}</h1>
        <p>{{ member.position || 'Member' }}</p>
        <span class="status-pill status-active">Student Member</span>
      </section>

      <section class="detail-section">
        <h2>Personal Information</h2>

        <div class="member-information-row">
          <Mail :size="19" />
          <div>
            <small>Email address</small>
            <strong>{{ member.email || 'Not provided' }}</strong>
          </div>
        </div>

        <div class="member-information-row">
          <UserRound :size="19" />
          <div>
            <small>Student ID</small>
            <strong>{{ member.studentId || 'Not provided' }}</strong>
          </div>
        </div>

        <div class="member-information-row">
          <GraduationCap :size="19" />
          <div>
            <small>Course / Program</small>
            <strong>{{ member.course || 'Not provided' }}</strong>
          </div>
        </div>

        <div class="member-information-row">
          <BadgeCheck :size="19" />
          <div>
            <small>Year level</small>
            <strong>{{ member.year || 'Not provided' }}</strong>
          </div>
        </div>

        <div class="member-information-row">
          <UserRound :size="19" />
          <div>
            <small>Position</small>
            <strong>{{ member.position || 'Member' }}</strong>
          </div>
        </div>

        <div class="member-information-row">
          <Building2 :size="19" />
          <div>
            <small>Organization</small>
            <strong>{{ member.organization || 'Not assigned' }}</strong>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="empty-state">
      <h3>Member not found</h3>
      <p>This member may have been removed.</p>
      <button class="btn btn-primary" @click="router.push('/members')">
        Return to Members
      </button>
    </div>
  </div>
</template>