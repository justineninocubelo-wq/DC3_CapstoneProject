<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, Mail, Phone, Users, CalendarDays, Megaphone, Pencil } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { loadData, saveData } from '../services/storage'
import Modal from '../components/Modal.vue'

const route = useRoute()
const router = useRouter()
const org = computed(() => loadData('organizations').find(o => Number(o.id) === Number(route.params.id)))
const members = computed(() => loadData('members').filter(m => m.organization === org.value?.name))
const events = computed(() => loadData('events').filter(e => e.organization === org.value?.name))
const editOpen = ref(false)
const form = ref({})
function openEdit(){form.value={...org.value};editOpen.value=true}
function saveEdit(){if(!form.value.name?.trim()||!form.value.description?.trim())return;const all=loadData('organizations');const oldName=org.value.name;const idx=all.findIndex(o=>Number(o.id)===Number(org.value.id));if(idx<0)return;form.value.initials=form.value.name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();all[idx]={...all[idx],...form.value};saveData('organizations',all);if(oldName!==form.value.name){const membersAll=loadData('members').map(m=>m.organization===oldName?{...m,organization:form.value.name}:m);const eventsAll=loadData('events').map(e=>e.organization===oldName?{...e,organization:form.value.name}:e);saveData('members',membersAll);saveData('events',eventsAll)}editOpen.value=false;window.__orgconnectToast?.('Organization updated successfully.');router.go(0)}
</script>
<template>
  <div class="page detail-page" v-if="org">
    <button class="back-button" @click="router.back()"><ArrowLeft :size="18" /> Back</button>
    <section class="detail-hero"><div class="org-avatar large">{{ org.initials }}</div><span class="status-pill status-active">{{ org.status }}</span><h1>{{ org.name }}</h1><p>{{ org.description }}</p></section>
    <div class="contact-grid"><div><Mail :size="17" /><span>{{ org.email || 'No email' }}</span></div><div><Phone :size="17" /><span>{{ org.phone || 'No phone' }}</span></div></div>
    <section class="detail-section"><div class="section-heading"><div><span class="eyebrow">OVERVIEW</span><h2>Organization details</h2></div><button class="icon-button" aria-label="Edit organization" @click="openEdit"><Pencil :size="18" /></button></div><div class="detail-list"><div><span>President</span><strong>{{ org.president || 'Not assigned' }}</strong></div><div><span>Adviser</span><strong>{{ org.adviser || 'Not assigned' }}</strong></div><div><span>Members</span><strong>{{ org.members }}</strong></div><div><span>Established</span><strong>{{ org.established }}</strong></div></div></section>
    <section class="detail-section"><div class="section-heading"><div><span class="eyebrow">COMMUNITY</span><h2>Members</h2></div><button class="link-button" @click="router.push('/members')">View all</button></div><div class="avatar-stack"><div v-for="member in members.slice(0,5)" :key="member.id" class="avatar avatar-member">{{ member.name.split(' ').map(x=>x[0]).slice(0,2).join('') }}</div><span>{{ members.length }} members</span></div></section>
    <section class="detail-section"><div class="section-heading"><div><span class="eyebrow">ACTIVITIES</span><h2>Upcoming events</h2></div><CalendarDays :size="20" /></div><div class="stack"><div v-for="event in events" :key="event.id" class="simple-row"><div class="row-icon"><CalendarDays :size="18" /></div><div><strong>{{ event.title }}</strong><span>{{ event.date }} • {{ event.time }}</span></div></div><p v-if="!events.length" class="muted">No upcoming events.</p></div></section>
    <Modal :open="editOpen" title="Edit organization" subtitle="Update this organization’s information." @close="editOpen=false"><form class="modal-form" @submit.prevent="saveEdit"><div class="field"><label>Name *</label><input v-model="form.name" required/></div><div class="field"><label>Description *</label><textarea v-model="form.description" rows="3" required/></div><div class="form-grid"><div class="field"><label>President</label><input v-model="form.president"/></div><div class="field"><label>Adviser</label><input v-model="form.adviser"/></div></div><div class="form-grid"><div class="field"><label>Email</label><input v-model="form.email" type="email"/></div><div class="field"><label>Phone</label><input v-model="form.phone"/></div></div><div class="form-grid"><div class="field"><label>Members</label><input v-model.number="form.members" type="number" min="0"/></div><div class="field"><label>Established</label><input v-model.number="form.established" type="number" min="1900"/></div></div><div class="modal-actions"><button type="button" class="btn btn-secondary" @click="editOpen=false">Cancel</button><button class="btn btn-primary">Save changes</button></div></form></Modal>
  </div>
  <div v-else class="page"><EmptyState title="Organization not found" message="This organization may have been removed." button-text="Back to organizations" @action="router.push('/organizations')"><template #icon><Users :size="28" /></template></EmptyState></div>
</template>
