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
import { insightsAPI, jobsAPI } from '@/services/api' // Fetch titles for query-based pages

const updateSEO = async (newPath, query) => {
  // 1. Dynamic check from navStore
  const page = Object.values(navStore.matrix).find(p => p.path === newPath)
  
  // 2. Base Defaults
  let title = 'DREAMACTIC | The Future of AI'
  let description = 'DREAMACTIC (formerly Dreamatic) provides autonomous AI infrastructure, multi-agent swarms, and neural orchestration for global enterprises.'
  let keywords = 'dreamactic, dreamatic, agentic ai, autonomous ai, neural orchestration, ai platform'

  // 3. Static metadata mapping for core routes
  const staticMeta = {
    '/': {
      title: 'DREAMACTIC | Autonomous AI Orchestration & Agentic Systems',
      description: 'DREAMACTIC (formerly Dreamatic) is the leading platform for enterprise-grade autonomous AI. Orchestrate swarms, secure neural nodes, and scale intelligence.',
      keywords: 'dreamactic, dreamatic, autonomous ai, enterprise ai, ai orchestration, ai agents'
    },
    '/services/ai-work': {
      title: 'AI for Work | Intelligent Workforce Orchestration',
      description: 'Transform your workforce with DREAMACTIC AI for Work. Deploy autonomous agents that handle complex reasoning, deep research, and process automation.',
      keywords: 'ai for work, agentic workforce, intelligent automation, dreamactic work'
    },
    '/services/ai-service': {
      title: 'AI for Service | Autonomous Customer Experience',
      description: 'Scale your support and service operations with sovereign AI agents that understand context, resolve issues, and learn your business logic.',
      keywords: 'ai customer service, autonomous support, ai agents for service, dreamactic service'
    },
    '/services/ai-enterprise': {
      title: 'AI for Enterprise | Sovereign Neural Infrastructure',
      description: 'The secure backbone for global AI operations. Private cloud architecture, custom weights, and cross-border data compliance for Fortune 500s.',
      keywords: 'enterprise ai, sovereign ai, private cloud ai, ai infrastructure, dreamactic enterprise'
    },
    '/products/superfitter': {
      title: 'SuperFiitter | Precision AI Tuning Platform',
      description: 'The ultimate environment for fine-tuning and optimizing agentic weights for specialized enterprise tasks.',
      keywords: 'ai fine-tuning, superfitter, model optimization, dreamactic products'
    },
    '/products/echoai': {
      title: 'EchoAI | Real-time Neural Communication',
      description: 'Sovereign voice and text communication platform powered by low-latency agentic reasoning.',
      keywords: 'echoai, real-time ai, conversational ai, dreamactic voice'
    },
    '/resources/blog': {
      title: 'Insights & AI Engineering Blog | DREAMACTIC',
      description: 'Deep dives into neural architecture, multi-agent swarms, and the future of sovereign intelligence.',
      keywords: 'ai blog, engineering insights, dreamactic research, tech blog'
    },
    '/resources/research': {
      title: 'Neural Research & Whitepapers | DREAMACTIC',
      description: 'Scientific publications and strategic case studies on the impact of agentic AI in modern systems.',
      keywords: 'ai research, whitepapers, case studies, neural science, dreamactic research'
    },
    '/company/careers': {
      title: 'Join the Vision | Careers at DREAMACTIC',
      description: 'Help build the sovereign intelligence layer of the future. Join our team of neural engineers and visionaries.',
      keywords: 'ai jobs, tech careers, dreamactic careers, work at dreamactic'
    },
    '/showcase': {
      title: 'Agentic Showcase | Real-world AI Implementations',
      description: 'Explore the portfolio of autonomous workflows and neural nodes currently operational in the DREAMACTIC ecosystem.',
      keywords: 'ai showcase, agentic portfolio, ai examples, dreamactic showcase'
    }
  }

  // 4. Apply Logic
  if (staticMeta[newPath]) {
    title = staticMeta[newPath].title
    description = staticMeta[newPath].description
    keywords = staticMeta[newPath].keywords
  } else if (page) {
    title = `${page.label} | DREAMACTIC`
    if (page.hero_subtitle) description = page.hero_subtitle
    keywords += `, ${page.label.toLowerCase()}`
  }

  // 5. Handle Query-based pages (Blog/Research/Jobs) to get specific titles
  if (query.id) {
    try {
      if (newPath === '/resources/blog' || newPath === '/resources/research') {
        const item = await insightsAPI.getById(query.id)
        if (item) {
          title = `${item.title} | DREAMACTIC Insights`
          if (item.excerpt) description = item.excerpt
        }
      } else if (newPath === '/company/careers') {
        const job = await jobsAPI.getById(query.id)
        if (job) {
          title = `${job.title} | Career Opening`
          description = `Apply for the ${job.title} position in the ${job.team} team at DREAMACTIC.`
        }
      }
    } catch (e) {
      console.warn('SEO Dynamic Fetch failed:', e)
    }
  }

  // 6. Update DOM Elements
  document.title = title
  
  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', description)

  // Meta Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.setAttribute('name', 'keywords')
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.setAttribute('content', keywords)

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', `https://dreamactic.com${newPath === '/' ? '' : newPath}`)
}

// Watch both path and query for SEO updates
watch(() => [route.path, route.query], ([newPath, query]) => {
  updateSEO(newPath, query)
}, { immediate: true, deep: true })
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
</style>
