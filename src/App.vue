<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from './components/AppShell.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const toast = ref({ visible: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { visible: true, message, type }
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => {
    toast.value.visible = false
  }, 2800)
}

provideToast(showToast)

function provideToast(fn) {
  window.__orgconnectToast = fn
}

const isLogin = computed(() => route.name === 'login')
</script>

<template>
  <AppShell v-if="!isLogin">
    <router-view />
  </AppShell>
  <router-view v-else />
  <Toast :visible="toast.visible" :message="toast.message" :type="toast.type" />
</template>
