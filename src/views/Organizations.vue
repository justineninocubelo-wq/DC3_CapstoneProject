<script setup>
import { ref, computed } from 'vue'
import { Plus, Building2, SlidersHorizontal, ArrowLeft, Users } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useCrud } from '../composables/useCrud'
import { loadData } from '../services/storage'
import SearchBar from '../components/SearchBar.vue'
import OrganizationCard from '../components/OrganizationCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()
const route = useRoute()
const { items, add, update, remove } = useCrud('organizations')
const memberCrud = useCrud('members')

const search = ref('')
const filtersOpen = ref(false)
const filters = ref({ established: '', president: '', adviser: '' })
const modalOpen = ref(false)
const membersOpen = ref(false)
const editing = ref(null)
const deleting = ref(null)
const selectedOrganization = ref(null)
const selectedMembers = ref([])

const form = ref({})

const emptyForm = () => ({
  name: '',
  short: '',
  description: '',
  president: '',
  adviser: '',
  email: '',
  phone: '',
  members: 0,
  established: new Date().getFullYear(),
  status: 'Active',
  initials: 'OR'
})

const years = computed(() =>
  [...new Set(items.value.map(org => String(org.established)).filter(Boolean))]
    .sort((a, b) => Number(b) - Number(a))
)

const presidents = computed(() =>
  [...new Set(items.value.map(org => org.president).filter(Boolean))].sort()
)

const advisers = computed(() =>
  [...new Set(items.value.map(org => org.adviser).filter(Boolean))].sort()
)

const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return items.value.filter(org => {
    const matchesSearch = [
      org.name,
      org.short,
      org.description,
      org.president,
      org.adviser,
      org.established
    ].filter(Boolean).join(' ').toLowerCase().includes(keyword)

    return matchesSearch &&
      (!filters.value.established || String(org.established) === filters.value.established) &&
      (!filters.value.president || org.president === filters.value.president) &&
      (!filters.value.adviser || org.adviser === filters.value.adviser)
  })
})

function resetForm() {
  form.value = emptyForm()
}

function openAdd() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(item) {
  editing.value = item
  form.value = { ...item }
  modalOpen.value = true
}

function save() {
  if (!form.value.name.trim() || !form.value.description.trim()) {
    window.__orgconnectToast?.('Please complete the organization name and description.', 'error')
    return
  }

  const wasEditing = Boolean(editing.value)

  form.value.initials = form.value.name
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  if (wasEditing) {
    update(editing.value.id, form.value)
  } else {
    add(form.value)
  }

  modalOpen.value = false
  window.__orgconnectToast?.(
    wasEditing ? 'Organization changes saved successfully.' : 'Organization added successfully.'
  )
}

function openAddMembers(org) {
  selectedOrganization.value = org
  selectedMembers.value = memberCrud.items.value
    .filter(member => member.organization === org.name)
    .map(member => member.id)

  membersOpen.value = true
}

function saveMembers() {
  if (!selectedOrganization.value) return

  const org = selectedOrganization.value

  memberCrud.items.value.forEach(member => {
    const isSelected = selectedMembers.value.includes(member.id)

    if (isSelected) {
      memberCrud.update(member.id, { organization: org.name })
    } else if (member.organization === org.name) {
      memberCrud.update(member.id, { organization: '' })
    }
  })

  const total = memberCrud.items.value.filter(
    member => member.organization === org.name
  ).length

  update(org.id, { members: total })
  membersOpen.value = false
  window.__orgconnectToast?.('Organization members updated successfully.')
}

function confirmDelete() {
  if (!deleting.value) return

  const name = deleting.value.name
  remove(deleting.value.id)
  deleting.value = null
  window.__orgconnectToast?.(`${name} was deleted successfully.`)
}

function clearFilters() {
  filters.value = { established: '', president: '', adviser: '' }
  search.value = ''
}
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

    <section class="page-intro">
      <div>
        <span class="eyebrow">DIRECTORY</span>
        <h1>Organizations</h1>
        <p>Discover and manage your campus communities.</p>
      </div>

      <button class="fab desktop-fab" type="button" @click="openAdd">
        <Plus :size="20" />
        <span>Add</span>
      </button>
    </section>

    <div class="toolbar">
      <SearchBar v-model="search" placeholder="Search organizations..." />
      <button
        class="filter-button"
        type="button"
        aria-label="Toggle organization filters"
        @click="filtersOpen = !filtersOpen"
      >
        <SlidersHorizontal :size="19" />
      </button>
    </div>

    <div v-if="filtersOpen" class="filter-panel">
      <div class="field">
        <label>Established year</label>
        <select v-model="filters.established">
          <option value="">All years</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div class="field">
        <label>President</label>
        <select v-model="filters.president">
          <option value="">All presidents</option>
          <option v-for="person in presidents" :key="person" :value="person">{{ person }}</option>
        </select>
      </div>

      <div class="field">
        <label>Adviser</label>
        <select v-model="filters.adviser">
          <option value="">All advisers</option>
          <option v-for="person in advisers" :key="person" :value="person">{{ person }}</option>
        </select>
      </div>

      <button class="text-button" type="button" @click="clearFilters">
        Clear filters
      </button>
    </div>

    <div v-if="filtered.length" class="stack">
      <div v-for="org in filtered" :key="org.id" class="organization-wrapper">
        <OrganizationCard
          :organization="org"
          @view="router.push({ path: `/organizations/${org.id}`, query: route.query })"
          @edit="openEdit"
          @delete="deleting = $event"
        />

        <button
          class="text-button add-members-button"
          type="button"
          @click="openAddMembers(org)"
        >
          <Users :size="16" />
          Add Members
        </button>
      </div>
    </div>

    <EmptyState
      v-else
      title="No organizations found"
      message="Try adjusting your search or filters, or add an organization."
      button-text="Add organization"
      @action="openAdd"
    >
      <template #icon><Building2 :size="28" /></template>
    </EmptyState>

    <button
      class="floating-add"
      type="button"
      aria-label="Add organization"
      @click="openAdd"
    >
      <Plus :size="25" />
    </button>

    <Modal
      :open="modalOpen"
      :title="editing ? 'Edit organization' : 'Add organization'"
      @close="modalOpen = false"
    >
      <form class="modal-form" @submit.prevent="save">
        <div class="field">
          <label>Organization name *</label>
          <input v-model="form.name" required />
        </div>

        <div class="form-grid">
          <div class="field">
            <label>President</label>
            <input v-model="form.president" />
          </div>
          <div class="field">
            <label>Adviser</label>
            <input v-model="form.adviser" />
          </div>
        </div>

        <div class="field">
          <label>Description *</label>
          <textarea v-model="form.description" required rows="3"></textarea>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="form.phone" />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Established year</label>
            <input v-model.number="form.established" type="number" min="1900" />
          </div>
          <div class="field">
            <label>Status</label>
            <select v-model="form.status">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="modalOpen = false">
            Cancel
          </button>
          <button class="btn btn-primary" type="submit">
            {{ editing ? 'Save changes' : 'Add organization' }}
          </button>
        </div>
      </form>
    </Modal>

    <Modal
      :open="membersOpen"
      :title="`Manage members${selectedOrganization ? ` — ${selectedOrganization.name}` : ''}`"
      subtitle="Select the members who belong to this organization."
      @close="membersOpen = false"
    >
      <div class="organization-members-list">
        <label
          v-for="member in memberCrud.items.value"
          :key="member.id"
          class="organization-member-option"
        >
          <input
            v-model="selectedMembers"
            type="checkbox"
            :value="member.id"
          />
          <span>
            <strong>{{ member.name }}</strong>
            <small>{{ member.studentId }} · {{ member.position }}</small>
          </span>
        </label>

        <p v-if="!memberCrud.items.value.length" class="muted">
          There are no members yet. Add members from the Members page first.
        </p>
      </div>

      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" @click="membersOpen = false">
          Cancel
        </button>
        <button class="btn btn-primary" type="button" @click="saveMembers">
          Save members
        </button>
      </div>
    </Modal>

    <ConfirmDialog
      :open="!!deleting"
      title="Delete organization?"
      :message="`Are you sure you want to delete ${deleting?.name || 'this organization'}? This action cannot be undone.`"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>