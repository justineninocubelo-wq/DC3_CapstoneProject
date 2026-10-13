<script setup>
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({ tabs: { type: Array, required: true } })
const route = useRoute()
const router = useRouter()
</script>

<template>
  <nav class="bottom-nav">
    <button v-for="tab in props.tabs" :key="tab.route" class="nav-item" :class="{ active: route.path === tab.route || (tab.route === '/organizations' && route.path.startsWith('/organizations')) }" @click="router.push(tab.route)">
      <component :is="tab.icon" :size="21" :stroke-width="route.path === tab.route ? 2.4 : 1.8" />
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>
