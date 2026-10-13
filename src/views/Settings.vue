<script setup>
    import { ref } from 'vue'
    import { Bell, Moon, Shield, Info, ChevronRight, RotateCcw } from 'lucide-vue-next'
    import { useRouter } from 'vue-router'
    import { resetAllData } from '../services/storage'
    import Modal from '../components/Modal.vue'
    const router=useRouter()
    const dark=ref(localStorage.getItem('orgconnect_dark')==='true')
    const notifications=ref(localStorage.getItem('orgconnect_notifications')!=='false')
    const aboutOpen=ref(false)
    function toggleDark(){dark.value=!dark.value;localStorage.setItem('orgconnect_dark',dark.value);document.documentElement.classList.toggle('dark',dark.value)}
    function toggleNotifications(){notifications.value=!notifications.value;localStorage.setItem('orgconnect_notifications',notifications.value)}
    function reset(){resetAllData();window.__orgconnectToast?.('Demo data has been reset.');setTimeout(()=>location.reload(),500)}
</script>
    <template>
    <div class="page">
        <section class="page-intro"><div><span class="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Customize your OrgConnect experience.</p></div></section>
    <div class="settings-group"><span class="settings-label">Preferences</span>
    <div class="settings-card">
        <button class="setting-row" @click="toggleNotifications"><div class="setting-icon"><Bell :size="19"/></div><div><strong>Notifications</strong><span>Receive campus updates</span></div><span class="switch" :class="{on:notifications}"><i></i></span></button>
        <button class="setting-row" @click="toggleDark"><div class="setting-icon"><Moon :size="19"/></div><div><strong>Dark mode</strong><span>Use a darker appearance</span></div><span class="switch" :class="{on:dark}"><i></i></span></button>
    </div></div>
    <div class="settings-group"><span class="settings-label">Application</span>
    <div class="settings-card">
    <button class="setting-row" @click="aboutOpen=true"><div class="setting-icon"><Info :size="19"/></div><div><strong>About OrgConnect</strong><span>Version 1.0.0</span></div><ChevronRight :size="18"/></button>
    <button class="setting-row" @click="router.push('/profile')"><div class="setting-icon"><Shield :size="19"/></div><div><strong>Privacy & security</strong><span>Manage your account</span></div><ChevronRight :size="18"/></button>
    </div></div>
    <div class="settings-group"><span class="settings-label">Demo tools</span><div class="settings-card"><button class="setting-row danger-row" @click="reset"><div class="setting-icon danger"><RotateCcw :size="19"/></div><div><strong>Reset sample data</strong><span>Restore the original demo records</span></div></button></div></div>
    <Modal :open="aboutOpen" title="About OrgConnect" @close="aboutOpen=false"><div class="about-modal"><div class="brand-mark"><Shield :size="26"/></div><h2>OrgConnect</h2><p>A mobile-first Student Organization Management System built with Vue 3 fundamentals.</p><small>Version 1.0.0 • Demo application</small><button class="btn btn-primary btn-full" @click="aboutOpen=false">Close</button></div></Modal>
    </div>
</template>
