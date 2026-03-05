<template>
  <div class="app" :class="{ 'dark-theme': isDarkMode }">
    <FloatingNavbar v-if="!isAdminPage" @toggle-theme="toggleTheme" :is-dark-mode="isDarkMode" />
    <router-view />
    <Footer v-if="!isAdminPage" :is-dark-mode="isDarkMode" />
    <ContactModal 
      :is-open="isContactModalOpen" 
      :initial-subject="contactModalData.subject"
      :initial-message="contactModalData.message"
      @close="closeContactModal" 
    />
    <JobApplicationModal :is-open="isJobModalOpen" :role-title="selectedRole" @close="closeJobModal" />
    <SolutionModal 
      :is-open="isSolutionModalOpen"
      :solution-title="solutionModalData.title"
      :initial-message="solutionModalData.message"
      :accent-color="solutionModalData.accent"
      @close="closeSolutionModal"
    />
    <DemoModal 
      :is-open="isDemoModalOpen"
      :modal-type="demoModalType"
      :dynamic-title="demoModalData.title"
      :dynamic-subtitle="demoModalData.subtitle"
      :initial-message="demoModalData.message"
      @close="closeDemoModal"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { navStore } from './store/navigation'
import FloatingNavbar from './components/FloatingNavbar.vue'
import Footer from './components/Footer.vue'
import ContactModal from './components/ContactModal.vue'
import JobApplicationModal from './components/JobApplicationModal.vue'
import SolutionModal from './components/SolutionModal.vue'
import DemoModal from './components/DemoModal.vue'

const isDarkMode = ref(true)
const isContactModalOpen = ref(false)
const contactModalData = ref({ subject: '', message: '' })
const isJobModalOpen = ref(false)
const selectedRole = ref('')
const isSolutionModalOpen = ref(false)
const solutionModalData = ref({ title: '', message: '', accent: '' })
const isDemoModalOpen = ref(false)
const demoModalType = ref('demo')
const demoModalData = ref({ title: '', subtitle: '', message: '' })
const route = useRoute()

const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

const openContactModal = (data = {}) => {
  contactModalData.value = {
    subject: data.subject || '',
    message: data.message || ''
  }
  isContactModalOpen.value = true
}

const closeContactModal = () => {
  isContactModalOpen.value = false
  contactModalData.value = { subject: '', message: '' }
}

const openJobModal = (roleTitle) => {
  selectedRole.value = roleTitle || ''
  isJobModalOpen.value = true
}

const closeJobModal = () => {
  isJobModalOpen.value = false
}

const openSolutionModal = (data = {}) => {
  solutionModalData.value = {
    title: data.title || '',
    message: data.message || '',
    accent: data.accent || ''
  }
  isSolutionModalOpen.value = true
}

const closeSolutionModal = () => {
  isSolutionModalOpen.value = false
  solutionModalData.value = { title: '', message: '', accent: '' }
}

const openDemoModal = (type = 'demo', data = {}) => {
  demoModalType.value = type
  demoModalData.value = {
    title: data.title || '',
    subtitle: data.subtitle || '',
    message: data.message || ''
  }
  isDemoModalOpen.value = true
}

const closeDemoModal = () => {
  isDemoModalOpen.value = false
  demoModalData.value = { title: '', subtitle: '', message: '' }
}

// Global refresh signal (incremented by heartbeat)
const refreshCount = ref(0)
provide('refreshCount', refreshCount)

// Provide global access to trigger modals
provide('openContactModal', openContactModal)
provide('openJobModal', openJobModal)
provide('openSolutionModal', openSolutionModal)
provide('openDemoModal', openDemoModal)

// Global Sync Heartbeat (syncs navigation and signals view refresh)
let globalSyncTimer = null
const startGlobalHeartbeat = () => {
  globalSyncTimer = setInterval(async () => {
    // 1. Sync Modular Pages / Navigation
    await navStore.syncFromDB()
    // 2. Increment signal for active views to re-fetch
    refreshCount.value++
  }, 60000) // Poll every 60 seconds
}

// Set default theme on mount
onMounted(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme')
  }
  startGlobalHeartbeat()
})

onUnmounted(() => {
  if (globalSyncTimer) clearInterval(globalSyncTimer)
})

// SEO & Title Management
import { watch } from 'vue'
watch(() => route.path, (newPath) => {
  // 1. Check if it's a dynamic page from navStore
  const page = Object.values(navStore.matrix).find(p => p.path === newPath)
  let title = 'DREAMACTIC | The Future of AI'
  let description = 'Building the next generation of autonomous AI infrastructure for enterprises.'

  if (page) {
    title = `${page.label} | DREAMACTIC`
    if (page.hero_subtitle) description = page.hero_subtitle
  } else {
    // 2. Fallback for static routes
    const staticTitles = {
      '/': 'DREAMACTIC | Autonomous AI Orchestration',
      '/services/ai-work': 'AI for Work | DREAMACTIC',
      '/services/ai-enterprise': 'Enterprise AI | DREAMACTIC',
      '/resources/blog': 'Insights & Engineering | DREAMACTIC',
      '/resources/research': 'Neural Research | DREAMACTIC',
      '/company/careers': 'Join the Vision | DREAMACTIC CAREERS',
      '/showcase': 'Agentic Showcase | DREAMACTIC'
    }
    if (staticTitles[newPath]) title = staticTitles[newPath]
  }

  // Update DOM
  document.title = title
  
  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', description)
}, { immediate: true })
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
</style>
