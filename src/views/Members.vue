<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { Plus, Users, SlidersHorizontal, ArrowLeft } from 'lucide-vue-next'
import { useCrud } from '../composables/useCrud'
import SearchBar from '../components/SearchBar.vue'
import MemberCard from '../components/MemberCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { loadData } from '../services/storage'

const route = useRoute()
const router = useRouter()
const { items, add, update, remove } = useCrud('members')
const organizations = loadData('organizations')
const search = ref('')
const filtersOpen = ref(false)
const filters = ref({course:'',year:'',position:'',organization:''})
const modalOpen = ref(false)
const editing = ref(null)
const deleting = ref(null)
const form = ref({ name:'', studentId:'', course:'', year:'1st Year', position:'Member', organization:organizations[0]?.name || '', email:'' })
const courses = computed(() => [...new Set(items.value.map(m=>m.course).filter(Boolean))])
const positions = computed(() => [...new Set(items.value.map(m=>m.position).filter(Boolean))])
const years = computed(() => [...new Set(items.value.map(m=>m.year).filter(Boolean))])
const filtered = computed(() => items.value.filter(m => `${m.name} ${m.studentId} ${m.course} ${m.organization}`.toLowerCase().includes(search.value.toLowerCase()) && (!filters.value.course || m.course===filters.value.course) && (!filters.value.year || m.year===filters.value.year) && (!filters.value.position || m.position===filters.value.position) && (!filters.value.organization || m.organization===filters.value.organization)))
function reset() { form.value = { name:'', studentId:'', course:'', year:'1st Year', position:'Member', organization:organizations[0]?.name || '', email:'' } }
function openAdd(){ editing.value=null; reset(); modalOpen.value=true }
function openEdit(item){ editing.value=item; form.value={...item}; modalOpen.value=true }
function save(){ if(!form.value.name.trim() || !form.value.studentId.trim()) return; if(editing.value) update(editing.value.id,form.value); else add(form.value); modalOpen.value=false; window.__orgconnectToast?.(editing.value?'Member updated successfully.':'Member added successfully.') }
function confirmDelete(){ remove(deleting.value.id); deleting.value=null; window.__orgconnectToast?.('Member deleted successfully.') }
</script>
<template>
  <div class="page">
    <button
      v-if="route.query.from === 'home'"
      class="back-button"
      type="button"
      @click="router.push('/home')"
    >
      <ArrowLeft :size="18" />
      Back to Home
    </button>
    <section class="page-intro"><div><span class="eyebrow">DIRECTORY</span><h1>Members</h1><p>Manage students across your organizations.</p></div><button class="fab desktop-fab" @click="openAdd"><Plus :size="20" /><span>Add</span></button></section>
    <div class="toolbar"><SearchBar v-model="search" placeholder="Search name, ID, course..." /><button class="filter-button" aria-label="Filter members" @click="filtersOpen=!filtersOpen"><SlidersHorizontal :size="19" /></button></div>
    <div v-if="filtersOpen" class="filter-panel"><div class="field"><label>Course / Program</label><select v-model="filters.course"><option value="">All courses</option><option v-for="course in courses" :key="course">{{course}}</option></select></div><div class="field"><label>Year level</label><select v-model="filters.year"><option value="">All year levels</option><option v-for="year in years" :key="year">{{year}}</option></select></div><div class="field"><label>Position</label><select v-model="filters.position"><option value="">All positions</option><option v-for="position in positions" :key="position">{{position}}</option></select></div><div class="field"><label>Organization</label><select v-model="filters.organization"><option value="">All organizations</option><option v-for="org in organizations" :key="org.id">{{org.name}}</option></select></div><button class="text-button" @click="filters={course:'',year:'',position:'',organization:''}">Clear filters</button></div>
    <div v-if="filtered.length" class="stack"><MemberCard v-for="member in filtered" :key="member.id" :member="member" @edit="openEdit" @delete="deleting=$event" @view="router.push(`/members/${$event.id}`)" /></div>
    <EmptyState v-else title="No members found" message="Try another search or add a new member." button-text="Add member" @action="openAdd"><template #icon><Users :size="28" /></template></EmptyState>
    <button class="floating-add" @click="openAdd"><Plus :size="25" /></button>
    <Modal :open="modalOpen" :title="editing?'Edit member':'Add member'" @close="modalOpen=false">
      <form class="modal-form" @submit.prevent="save">
        <div class="field"><label>Full name *</label><input v-model="form.name" required placeholder="Student full name" /></div>
        <div class="form-grid"><div class="field"><label>Student ID *</label><input v-model="form.studentId" required placeholder="2026-00000" /></div><div class="field"><label>Email</label><input v-model="form.email" type="email" /></div></div>
        <div class="field"><label>Course / Program</label><input v-model="form.course" placeholder="BS Information Technology" /></div>
        <div class="form-grid"><div class="field"><label>Year level</label><select v-model="form.year"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div><div class="field"><label>Position</label><select v-model="form.position"><option>Member</option><option>President</option><option>Vice President</option><option>Secretary</option><option>Treasurer</option><option>Auditor</option></select></div></div>
        <div class="field"><label>Organization</label><select v-model="form.organization"><option v-for="org in organizations" :key="org.id">{{ org.name }}</option></select></div>
        <div class="modal-actions"><button type="button" class="btn btn-secondary" @click="modalOpen=false">Cancel</button><button class="btn btn-primary" type="submit">{{ editing?'Save changes':'Add member' }}</button></div>
      </form>
    </Modal>
    <ConfirmDialog :open="!!deleting" title="Delete member?" :message="`Are you sure you want to delete ${deleting?.name || 'this member'}?`" @close="deleting=null" @confirm="confirmDelete" />
  </div>
</template>
