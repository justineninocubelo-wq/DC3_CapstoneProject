<script setup>
import { ref, computed } from 'vue'
import { Plus, Bell } from 'lucide-vue-next'
import { useCrud } from '../composables/useCrud'
import AnnouncementCard from '../components/AnnouncementCard.vue'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { loadData } from '../services/storage'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const {items,add,update,remove}=useCrud('announcements')
const organizations=loadData('organizations')
const search=ref(''), modalOpen=ref(false), editing=ref(null), deleting=ref(null)
const form=ref({title:'',organization:organizations[0]?.name||'',date:new Date().toISOString().slice(0,10),body:'',status:'New'})
const filtered=computed(()=>items.value.filter(a=>`${a.title} ${a.organization} ${a.body}`.toLowerCase().includes(search.value.toLowerCase())))
function reset(){form.value={title:'',organization:organizations[0]?.name||'',date:new Date().toISOString().slice(0,10),body:'',status:'New'}}
function openAdd(){editing.value=null;reset();modalOpen.value=true}
function openEdit(a){editing.value=a;form.value={...a};modalOpen.value=true}
function save(){if(!form.value.title||!form.value.body)return;if(editing.value)update(editing.value.id,form.value);else add(form.value);modalOpen.value=false;window.__orgconnectToast?.(editing.value?'Announcement updated successfully.':'Announcement published successfully.')}
function confirmDelete(){remove(deleting.value.id);deleting.value=null;window.__orgconnectToast?.('Announcement deleted successfully.')}
</script>
<template>
<div class="page">
<button class="back-button" @click="router.back()">
      <ArrowLeft :size="18" /> Back
</button>
<section class="page-intro"><div><span class="eyebrow">CAMPUS UPDATES</span><h1>Announcements</h1><p>Important updates from your student community.</p></div><button class="fab desktop-fab" @click="openAdd"><Plus :size="20"/><span>New</span></button></section>
<div class="search-only"><div class="search-bar"><input v-model="search" placeholder="Search announcements..."/></div></div>
<div v-if="filtered.length" class="stack"><AnnouncementCard v-for="a in filtered" :key="a.id" :announcement="a" @edit="openEdit" @delete="deleting=$event"/></div>
<EmptyState v-else title="No announcements found" message="There are no announcements matching your search." button-text="Create announcement" @action="openAdd"><template #icon><Bell :size="28"/></template></EmptyState>
<button class="floating-add" @click="openAdd"><Plus :size="25"/></button>
<Modal :open="modalOpen" :title="editing?'Edit announcement':'Create announcement'" @close="modalOpen=false">
<form class="modal-form" @submit.prevent="save">
<div class="field"><label>Title *</label><input v-model="form.title" required placeholder="Announcement title"/></div>
<div class="form-grid"><div class="field"><label>Organization</label><select v-model="form.organization"><option v-for="o in organizations" :key="o.id">{{o.name}}</option><option>Student Affairs Office</option></select></div><div class="field"><label>Date</label><input v-model="form.date" type="date"/></div></div>
<div class="field"><label>Type</label><select v-model="form.status"><option>New</option><option>Important</option></select></div>
<div class="field"><label>Message *</label><textarea v-model="form.body" required rows="5" placeholder="Write the announcement..."></textarea></div>
<div class="modal-actions"><button type="button" class="btn btn-secondary" @click="modalOpen=false">Cancel</button><button class="btn btn-primary" type="submit">{{editing?'Save changes':'Publish announcement'}}</button></div>
</form></Modal>
<ConfirmDialog :open="!!deleting" title="Delete announcement?" :message="`Are you sure you want to delete ${deleting?.title||'this announcement'}?`" @close="deleting=null" @confirm="confirmDelete"/>
</div>
</template>
