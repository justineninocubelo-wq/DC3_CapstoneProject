<script setup>
import { ref } from 'vue'
import { ArrowLeft, Mail, LockKeyhole, ShieldCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { resetPassword } from '../services/auth'
const router = useRouter()
const form = ref({ email: '', studentId: '', password: '', confirmPassword: '' })
const error = ref('')
const success = ref('')
function submit() {
  error.value = ''; success.value = ''
  const f = form.value
  if (![f.email, f.studentId, f.password, f.confirmPassword].every(value => String(value).trim())) { error.value = 'Please complete all fields.'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { error.value = 'Please enter a valid email address.'; return }
  if (f.password.length < 8) { error.value = 'Your new password must contain at least 8 characters.'; return }
  if (f.password !== f.confirmPassword) { error.value = 'The passwords do not match.'; return }
  const result = resetPassword(f.email, f.studentId, f.password)
  if (!result.success) { error.value = result.message; return }
  success.value = 'Password updated. You can now sign in with your new password.'
  form.value.password = ''; form.value.confirmPassword = ''
}
</script>

<template>
  <div class="login-page"><div class="login-decoration decoration-one"></div><div class="login-decoration decoration-two"></div>
    <main class="login-card">
      <button class="link-button auth-back" type="button" @click="router.push('/login')"><ArrowLeft :size="16" /> Back to sign in</button>
      <div class="login-brand"><div class="brand-mark"><ShieldCheck :size="30" /></div><div><strong>OrgConnect</strong><span>Student Organization Hub</span></div></div>
      <div class="login-copy"><span class="eyebrow">ACCOUNT RECOVERY</span><h1>Reset your password</h1><p>Enter the email and student ID associated with your account, then choose a new password.</p></div>
      <form class="login-form" @submit.prevent="submit">
        <div class="field"><label>Email address</label><div class="input-wrap"><Mail :size="18" /><input v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" /></div></div>
        <div class="field"><label>Student ID</label><input v-model="form.studentId" placeholder="Your student ID" /></div>
        <div class="field"><label>New password</label><div class="input-wrap"><LockKeyhole :size="18" /><input v-model="form.password" type="password" autocomplete="new-password" placeholder="At least 8 characters" /></div></div>
        <div class="field"><label>Confirm new password</label><div class="input-wrap"><LockKeyhole :size="18" /><input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Re-enter new password" /></div></div>
        <div v-if="error" class="form-error">{{ error }}</div><div v-if="success" class="form-success">{{ success }}</div>
        <button class="btn btn-primary btn-full login-submit" type="submit">Update password</button>
      </form>
      <p class="login-footer">This local prototype does not send email. Student ID is a basic match, not secure identity verification.</p>
    </main>
  </div>
</template>
