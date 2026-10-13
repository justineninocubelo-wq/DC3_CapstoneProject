<script setup>
import { ref, computed } from 'vue'
import { Plus, Building2, SlidersHorizontal } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCrud } from '../composables/useCrud'
import SearchBar from '../components/SearchBar.vue'
import OrganizationCard from '../components/OrganizationCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()
const { items, add, update, remove } = useCrud('organizations')
const search = ref('')
const modalOpen = ref(false)
const editing = ref(null)
const deleting = ref(null)
const form = ref({ name:'', short:'', description:'', president:'', adviser:'', email:'', phone:'', members:0, established:new Date().getFullYear(), status:'Active', initials:'OR' })

const filtered = computed(() => items.value.filter(o => `${o.name} ${o.description} ${o.president}`.toLowerCase().includes(search.value.toLowerCase())))

function resetForm() { form.value = { name:'', short:'', description:'', president:'', adviser:'', email:'', phone:'', members:0, established:new Date().getFullYear(), status:'Active', initials:'OR' } }
function openAdd() { editing.value = null; resetForm(); modalOpen.value = true }
function openEdit(item) { editing.value = item; form.value = { ...item }; modalOpen.value = true }
function save() {
  if (!form.value.name.trim() || !form.value.description.trim()) return
  form.value.initials = form.value.name.split(/\s+/).slice(0,2).map(x => x[0]).join('').toUpperCase()
  if (editing.value) update(editing.value.id, form.value); else add(form.value)
  modalOpen.value = false
  if (window.__orgconnectToast) window.__orgconnectToast(editing.value ? 'Organization updated successfully.' : 'Organization added successfully.')
}
function confirmDelete() { remove(deleting.value.id); deleting.value = null; if (window.__orgconnectToast) window.__orgconnectToast('Organization deleted successfully.') }
</script>

<template>
  <div class="page">
    <section class="page-intro"><div><span class="eyebrow">DIRECTORY</span><h1>Organizations</h1><p>Discover and manage your campus communities.</p></div><button class="fab desktop-fab" @click="openAdd"><Plus :size="20" /><span>Add</span></button></section>
    <div class="toolbar"><SearchBar v-model="search" placeholder="Search organizations..." /><button class="filter-button" aria-label="Filters"><SlidersHorizontal :size="19" /></button></div>
    <div v-if="filtered.length" class="stack">
      <OrganizationCard v-for="org in filtered" :key="org.id" :organization="org" @view="router.push(`/organizations/${org.id}`)" @edit="openEdit" @delete="deleting = $event" />
    </div>
    <EmptyState v-else title="No organizations found" message="Try adjusting your search or add your first organization." button-text="Add organization" @action="openAdd"><template #icon><Building2 :size="28" /></template></EmptyState>
    <button class="floating-add" @click="openAdd" aria-label="Add organization"><Plus :size="25" /></button>

    <Modal :open="modalOpen" :title="editing ? 'Edit organization' : 'Add organization'" :subtitle="editing ? 'Update organization details.' : 'Create a new campus organization.'" @close="modalOpen = false">
      <form class="modal-form" @submit.prevent="save">
        <div class="field"><label>Organization name *</label><input v-model="form.name" required placeholder="e.g. Information Technology Club" /></div>
        <div class="form-grid"><div class="field"><label>President</label><input v-model="form.president" placeholder="Full name" /></div><div class="field"><label>Adviser</label><input v-model="form.adviser" placeholder="Full name" /></div></div>
        <div class="field"><label>Description *</label><textarea v-model="form.description" required rows="3" placeholder="What is this organization about?"></textarea></div>
        <div class="form-grid"><div class="field"><label>Email</label><input v-model="form.email" type="email" placeholder="organization@school.edu" /></div><div class="field"><label>Phone</label><input v-model="form.phone" placeholder="+63..." /></div></div>
        <div class="form-grid"><div class="field"><label>Members</label><input v-model.number="form.members" type="number" min="0" /></div><div class="field"><label>Established</label><input v-model.number="form.established" type="number" min="1900" /></div></div>
        <div class="modal-actions"><button type="button" class="btn btn-secondary" @click="modalOpen = false">Cancel</button><button class="btn btn-primary" type="submit">{{ editing ? 'Save changes' : 'Add organization' }}</button></div>
      </form>
    </Modal>
    <ConfirmDialog :open="!!deleting" title="Delete organization?" :message="`Are you sure you want to delete ${deleting?.name || 'this organization'}? This action cannot be undone.`" @close="deleting = null" @confirm="confirmDelete" />
  </div>
</template>
