<script setup>
import { computed } from 'vue'
import { ArrowLeft, Mail, Hash, GraduationCap, Building2, BriefcaseBusiness } from 'lucide-vue-next'
import { useRoute,useRouter } from 'vue-router'
import { loadData } from '../services/storage'
const route=useRoute(),router=useRouter()
const member=computed(()=>loadData('members').find(m=>Number(m.id)===Number(route.params.id)))
</script>
<template><div class="page"><button class="back-button" @click="router.back()"><ArrowLeft :size="18"/> Back</button><section v-if="member" class="profile-hero"><div class="avatar profile-avatar">{{member.name.split(' ').map(x=>x[0]).slice(0,2).join('')}}</div><span class="eyebrow">MEMBER DETAILS</span><h1>{{member.name}}</h1><p>{{member.position}}</p></section><div v-if="member" class="profile-details"><div><Hash/><span><small>Student ID</small><strong>{{member.studentId||'Not provided'}}</strong></span></div><div><Mail/><span><small>Email</small><strong>{{member.email||'Not provided'}}</strong></span></div><div><GraduationCap/><span><small>Course / Program</small><strong>{{member.course||'Not provided'}}</strong></span></div><div><BriefcaseBusiness/><span><small>Year level</small><strong>{{member.year||'Not provided'}}</strong></span></div><div><Building2/><span><small>Organization</small><strong>{{member.organization||'Not assigned'}}</strong></span></div></div><div v-else class="empty-state"><h2>Member not found</h2><button class="btn btn-primary" @click="router.push('/members')">Back to members</button></div></div></template>