<script setup>
import { ref } from 'vue'
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!email.value.trim()) return error.value = 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return error.value = 'Please enter a valid email address.'
  if (!password.value) return error.value = 'Please enter your password.'

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 250))
  const result = login(email.value, password.value, remember.value)
  loading.value = false

  if (!result.success) return error.value = result.message
  router.replace('/home')
}
</script>

<template>
  <div class="login-page">
    <div class="login-decoration decoration-one"></div>
    <div class="login-decoration decoration-two"></div>

    <main class="login-card">
      <div class="login-brand">
        <div class="brand-mark"><ShieldCheck :size="30" /></div>
        <div>
          <strong>OrgConnect</strong>
          <span>Student Organization Hub</span>
        </div>
      </div>

      <div class="login-copy">
        <span class="eyebrow">WELCOME BACK</span>
        <h1>Connect. Organize. Lead.</h1>
        <p>Sign in to manage your organizations, events, members, and campus updates.</p>
      </div>

      <form @submit.prevent="submit" class="login-form">
        <div class="field">
          <label for="login-email">Email address</label>
          <div class="input-wrap">
            <Mail :size="18" />
            <input id="login-email" v-model="email" type="email" autocomplete="email" placeholder="Enter your email address" required />
          </div>
        </div>

        <div class="field">
          <label for="login-password">Password</label>
          <div class="input-wrap">
            <LockKeyhole :size="18" />
            <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" required />
            <button type="button" class="input-action" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>

        <div class="login-options">
          <label class="check-label"><input v-model="remember" type="checkbox" /> <span>Remember me</span></label>
          <button type="button" class="link-button" @click="router.push('/forgot-password')">Forgot password?</button>
        </div>

        <div v-if="error" class="form-error" role="alert">{{ error }}</div>

        <button class="btn btn-primary btn-full login-submit" type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
          <ArrowRight v-if="!loading" :size="18" />
        </button>
      </form>

      <div class="auth-register-prompt">
        New to OrgConnect?
        <button type="button" class="link-button" @click="router.push('/register')">Create account</button>
      </div>

      <p class="login-footer">Create an account to get started with OrgConnect.</p>
    </main>
  </div>
</template>