<script setup>
import { ref } from 'vue'
import { ArrowLeft, UserRound, Mail, LockKeyhole, ShieldCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { registerAccount } from '../services/auth'

const router = useRouter()
const form = ref({ name: '', studentId: '', email: '', course: '', year: '', password: '', confirmPassword: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  success.value = ''
  const f = form.value
  if (![f.name, f.studentId, f.email, f.course, f.year, f.password, f.confirmPassword].every(value => String(value).trim())) {
    error.value = 'Please complete all fields.'; return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { error.value = 'Please enter a valid email address.'; return }
  if (f.password.length < 8) { error.value = 'Your password must contain at least 8 characters.'; return }
  if (f.password !== f.confirmPassword) { error.value = 'The passwords do not match.'; return }
  loading.value = true
  const result = registerAccount(f)
  loading.value = false
  if (!result.success) { error.value = result.message; return }
  success.value = 'Your account has been created. You can now sign in.'
  setTimeout(() => router.replace('/login'), 900)
}
</script>

<template>
  <div class="login-page"><div class="login-decoration decoration-one"></div><div class="login-decoration decoration-two"></div>
    <main class="login-card auth-card-wide">
      <button class="link-button auth-back" type="button" @click="router.push('/login')"><ArrowLeft :size="16" /> Back to sign in</button>
      <div class="login-brand"><div class="brand-mark"><ShieldCheck :size="30" /></div><div><strong>OrgConnect</strong><span>Student Organization Hub</span></div></div>
      <div class="login-copy"><span class="eyebrow">JOIN ORGCONNECT</span><h1>Create your account</h1><p>Enter your student details to get started.</p></div>
      <form class="login-form" @submit.prevent="submit">
        <div class="field"><label>Full name</label><div class="input-wrap"><UserRound :size="18" /><input v-model="form.name" autocomplete="name" placeholder="Your full name" /></div></div>
        <div class="field"><label>Student ID</label><div class="input-wrap"><UserRound :size="18" /><input v-model="form.studentId" placeholder="Your student ID" /></div></div>
        <div class="field"><label>Email address</label><div class="input-wrap"><Mail :size="18" /><input v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" /></div></div>
        <div class="field"><label>Course / Program</label><input v-model="form.course" placeholder="e.g. BS Information Technology" /></div>
        <div class="field"><label>Year level</label><select v-model="form.year"><option value="" disabled>Select year level</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>5th Year</option></select></div>
        <div class="field"><label>Password (at least 8 characters)</label><div class="input-wrap"><LockKeyhole :size="18" /><input v-model="form.password" type="password" autocomplete="new-password" placeholder="Create a password" /></div></div>
        <div class="field"><label>Confirm password</label><div class="input-wrap"><LockKeyhole :size="18" /><input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Re-enter your password" /></div></div>
        <div v-if="error" class="form-error">{{ error }}</div><div v-if="success" class="form-success">{{ success }}</div>
        <button class="btn btn-primary btn-full login-submit" type="submit" :disabled="loading">{{ loading ? 'Creating account...' : 'Create account' }}</button>
      </form>
      <p class="login-footer">This student-project version saves accounts in this browser only.</p>
    </main>
  </div>
</template>
