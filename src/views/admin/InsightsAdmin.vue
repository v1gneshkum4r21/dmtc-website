<template>
  <div class="admin-container">
    <!-- Authorization Layer -->
    <LoginPanel 
      ref="loginPanelRef"
      v-if="!isAuthenticated" 
      :loading="loading" 
      :error="error" 
      @login="handleLogin" 
    />

    <!-- Operational Dashboard -->
    <div v-else class="admin-dashboard">
      <AdminSidebar 
        v-model:activeModule="activeModule"
        v-model:selectedPage="selectedPage"
        :websitePages="websitePages"
        :isOpen="isSidebarOpen"
        @logout="handleLogout"
        @add-page="isPageModalOpen = true"
        @close="isSidebarOpen = false"
        @configure-page="id => { selectedPage = id; showPageEditor = true }"
      />

      <main class="admin-main">
        <AdminHeader 
          v-model:activeModule="activeModule"
          :selectedPage="selectedPage"
          :title="activeModuleTitle"
          :previewUrl="previewUrl"
          :createLabel="createButtonLabel"
          :searchData="searchData"
          @create="handleGlobalCreate"
          @search-select="handleSearchSelect"
          @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
          @switch="(m, p = '') => { activeModule = m; if (p) selectedPage = p }"
        />

        <div class="dashboard-content">
          <transition name="page-fade" mode="out-in">
            <component 
              :is="activeComponent" 
              v-bind="componentProps"
              @switch="(m, sub) => { activeModule = m; if (sub) selectedPage = sub }"
              @switch-tab="t => selectedPage = t"
              @create="handleGlobalCreate"
              @edit="startEdit"
              @delete="handleDelete"
              @edit-job="startEditJob"
              @archive-job="handleArchiveJob"
              @delete-job="handleDeleteJob"
              @restore-job="handleRestoreJob"
              @preview-app="openApplicationPreview"
              @update-app-status="handleUpdateStatus"
              @delete-app="handleDeleteApplication"
              @restore-app="handleRestoreApplication"
              @delete-app-permanent="handleDeleteApplicationPermanent"
              @edit-showcase="startEditShowcase"
              @delete-showcase="handleDeleteShowcase"
              @update-status="handleUpdateContactStatus"
              @delete-contact="handleDeleteContact"
              @configure-page="id => { if (id) selectedPage = id; showPageEditor = true }"
            />
          </transition>
        </div>
      </main>

      <!-- Modal Orchestration System -->
      <InsightEditor 
        v-if="showCreateForm || editingInsight"
        :editing="editingInsight"
        :websitePages="websitePages"
        :loading="loading"
        @save="handleInsightSubmit"
        @close="closeInsightForm"
      />

      <ShowcaseEditor 
        v-if="showShowcaseForm || editingShowcase"
        :editing="editingShowcase"
        :loading="loading"
        @save="handleShowcaseSubmit"
        @close="closeShowcaseForm"
      />

      <JobEditor 
        v-if="showJobForm || editingJob"
        :editing="editingJob"
        :loading="loading"
        @save="handleJobSubmit"
        @close="closeJobForm"
      />

      <ApplicationViewer 
        v-if="selectedApplication"
        :application="selectedApplication"
        @updateStatus="s => handleUpdateStatus(selectedApplication._id, s)"
        @restore="handleRestoreApplication(selectedApplication._id)"
        @deletePermanent="handleDeleteApplicationPermanent(selectedApplication._id)"
        @close="selectedApplication = null"
      />

      <SectionManager 
        v-if="isPageModalOpen"
        @create="handleCreatePage"
        @close="isPageModalOpen = false"
      />

      <SystemConfirm 
        v-if="showConfirm"
        v-bind="confirmConfig"
        :loading="loading"
        @confirm="confirmConfig.action"
        @cancel="showConfirm = false"
      />

      <ResearchEditor 
        v-if="showResearchForm || editingResearch"
        :editing="editingResearch"
        :loading="loading"
        @save="handleResearchSubmit"
        @close="closeResearchForm"
      />

      <PageEditor 
        v-if="showPageEditor && !['hub', 'research', 'blog'].includes(selectedPage) && !isModularPage"
        :pageId="selectedPage"
        @save="handlePageConfigSubmit"
        @close="showPageEditor = false"
      />

      <ModularPageEditor 
        v-if="showPageEditor && isModularPage"
        :pageId="selectedPage"
        @close="showPageEditor = false"
      />

      <ResourcePageEditor 
        v-if="showPageEditor && ['hub', 'research', 'blog'].includes(selectedPage)"
        :pageId="selectedPage"
        @save="handlePageConfigSubmit"
        @close="showPageEditor = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, markRaw } from 'vue'
import { authAPI, adminAPI } from '@/services/api'
import { navStore } from '@/store/navigation'

// Framework Layout
import AdminSidebar from './components/AdminSidebar.vue'
import AdminHeader from './components/AdminHeader.vue'
import LoginPanel from './components/LoginPanel.vue'

// Operational Modules
import DashboardHome from './modules/control/DashboardHome.vue'
import SettingsManager from './modules/settings/SettingsManager.vue'
import ServicesManager from './modules/services/ServicesManager.vue'
import ProductsManager from './modules/products/ProductsManager.vue'
import ShowcaseManager from './modules/showcase/ShowcaseManager.vue'
import HeroCarouselManager from './modules/hero/HeroCarouselManager.vue'
import CareersManager from './modules/careers/CareersManager.vue'
import ContactsManager from './modules/contacts/ContactsManager.vue'
import CompanyManager from './modules/company/CompanyManager.vue'
import ResourcesManager from './modules/resources/ResourcesManager.vue'

// Dialog Sub-systems
import InsightEditor from './modules/dialogs/InsightEditor.vue'
import ShowcaseEditor from './modules/dialogs/ShowcaseEditor.vue'
import JobEditor from './modules/dialogs/JobEditor.vue'
import ApplicationViewer from './modules/dialogs/ApplicationViewer.vue'
import SectionManager from './modules/dialogs/SectionManager.vue'
import ResearchEditor from './modules/dialogs/ResearchEditor.vue'
import SystemConfirm from './modules/dialogs/SystemConfirm.vue'
import PageEditor from './modules/services/page-editor/PageEditor.vue'
import ResourcePageEditor from './modules/resources/page-editor/ResourcePageEditor.vue'
import ModularPageEditor from './modules/services/page-editor/ModularPageEditor.vue'

// Core State
const isAuthenticated = ref(false)
const loading = ref(false)
const error = ref('')
const activeModule = ref('dashboard')
const selectedPage = ref('')
const isSidebarOpen = ref(false)

// Data Collections
const insights = ref([])
const showcaseItems = ref([])
const jobs = ref([])
const applications = ref([])
const research = ref([])
const contacts = ref([])

// Interaction State
const showCreateForm = ref(false)
const showShowcaseForm = ref(false)
const showConfirm = ref(false)
const confirmConfig = ref({ title: '', message: '', action: null, confirmLabel: '', isDanger: true })
const isPageModalOpen = ref(false)
const showJobForm = ref(false)
const showResearchForm = ref(false)

// Page Management
const hardcodedPages = [
  { id: 'ai-work', label: 'ai for work', icon: '💡' },
  { id: 'ai-service', label: 'ai for service', icon: '🎧' },
  { id: 'ai-enterprise', label: 'ai for enterprise', icon: '🏢' },
  { id: 'superfitter', label: 'superfitter', icon: '👕' },
  { id: 'echo-ai', label: 'echoai', icon: '🗣️' },
  { id: 'about', label: 'about us', icon: '📖' },
  { id: 'leadership', label: 'leadership', icon: '👥' },
  { id: 'careers', label: 'careers', icon: '💼' },
  { id: 'hub', label: 'knowledge hub', icon: '🏛️' },
  { id: 'blog', label: 'agentic blog', icon: '✍️' },
  { id: 'research', label: 'research lab', icon: '🔬' }
]

const websitePages = computed(() => {
  const modularPages = Object.values(navStore.matrix)
    .filter(p => p.isCustom)
    .map(p => ({
      id: p.id,
      label: p.label,
      icon: '✦',
      isModular: true,
      group: p.group
    }))
  return [...hardcodedPages, ...modularPages]
})

const isModularPage = computed(() => {
  return websitePages.value.find(p => p.id === selectedPage.value)?.isModular
})
const editingInsight = ref(null)
const editingShowcase = ref(null)
const editingJob = ref(null)
const editingResearch = ref(null)
const selectedApplication = ref(null)
const showPageEditor = ref(false)
let refreshTimer = null

// Computed Orchestrators
const activeComponent = computed(() => {
  const map = {
    dashboard: markRaw(DashboardHome),
    settings: markRaw(SettingsManager),
    services: markRaw(ServicesManager),
    products: markRaw(ProductsManager),
    showcase: markRaw(ShowcaseManager),
    hero: markRaw(HeroCarouselManager),
    careers: markRaw(CareersManager),
    contacts: markRaw(ContactsManager),
    company: markRaw(CompanyManager),
    resources: markRaw(ResourcesManager)
  }
  return map[activeModule.value] || null
})

const componentProps = computed(() => {
  if (activeModule.value === 'dashboard') return { insights: insights.value, applications: applications.value, showcase: showcaseItems.value, contacts: contacts.value }
  if (activeModule.value === 'company') return { selectedPage: selectedPage.value, loading: loading.value }
  if (['services', 'products'].includes(activeModule.value)) return { insights: insights.value, selectedPage: selectedPage.value, loading: loading.value }
  if (activeModule.value === 'showcase') return { showcaseItems: showcaseItems.value, loading: loading.value }
  if (activeModule.value === 'contacts') return { contacts: contacts.value, loading: loading.value }
  if (activeModule.value === 'careers') return { jobs: jobs.value, applications: applications.value, loading: loading.value, subTab: selectedPage.value || 'jds' }
  if (activeModule.value === 'resources') return { insights: insights.value, research: research.value, selectedPage: selectedPage.value || 'hub', loading: loading.value }
  return {}
})

const activeModuleTitle = computed(() => {
  if (activeModule.value === 'careers') {
    if (selectedPage.value === 'jds') return 'Deployment Protocols'
    if (selectedPage.value === 'applicants') return 'Candidate Network'
    if (selectedPage.value === 'history') return 'Immutable Ledger'
    return 'Talent Orbit'
  }
  const titles = {
    dashboard: 'Control Center', 
    settings: 'Global Settings', 
    services: 'Services Intelligence', 
    products: 'Product Inventory', 
    showcase: 'Museum Curator',
    hero: 'Hero Carousel',
    contacts: 'Network Comms',
    company: 'Corporate Strategy',
    resources: 'Intelligence Unit'
  }
  return titles[activeModule.value] || activeModule.value.toUpperCase()
})

const createButtonLabel = computed(() => {
  const labels = { 
    services: '+ Provision Node', 
    products: '+ Provision Node', 
    showcase: '+ Add Asset', 
    careers: '+ Initialize Protocol',
    resources: '+ Sync Insight' 
  }
  return labels[activeModule.value] || '+ Create'
})

const previewUrl = computed(() => '/')

const searchData = computed(() => ({ 
  insights: insights.value, 
  showcase: showcaseItems.value, 
  applications: applications.value,
  research: research.value
}))

// Handlers & Logic
const handleGlobalCreate = () => {
  if (['services', 'products'].includes(activeModule.value)) showCreateForm.value = true
  else if (activeModule.value === 'showcase') showShowcaseForm.value = true
  else if (activeModule.value === 'careers') showJobForm.value = true
  else if (activeModule.value === 'resources') {
    if (selectedPage.value === 'research') showResearchForm.value = true
    else showCreateForm.value = true
  }
}

const loginPanelRef = ref(null)

const handleLogin = async (credentials) => {
  loading.value = true; error.value = ''
  try {
    const res = await authAPI.login(credentials.username, credentials.password)
    if (res.mfa_required) {
      if (loginPanelRef.value) {
        loginPanelRef.value.handleMfaRequired(res.username)
      }
      return
    }
    isAuthenticated.value = true
    initDashboard()
  } catch (err) { error.value = 'Authorization failed: Invalid Credentials' }
  finally { loading.value = false }
}

const handleLogout = () => { authAPI.logout(); isAuthenticated.value = false }

const initDashboard = () => { 
  const fetchAll = () => {
    loadInsights(); 
    loadShowcase(); 
    loadJobs(); 
    loadApplications(); 
    loadResearch(); 
    loadContacts();
  }
  fetchAll()
  // Auto-refresh admin data every 60 seconds
  if (refreshTimer) clearInterval(refreshTimer)
  refreshTimer = setInterval(fetchAll, 60000)
}

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

const loadInsights = async () => { 
  loading.value = true
  try { insights.value = await adminAPI.getAllInsights(selectedPage.value) } 
  catch (err) { console.error('Insights Sync Error') } finally { loading.value = false }
}
const loadShowcase = async () => { showcaseItems.value = await adminAPI.getAllShowcase() }
const loadJobs = async () => { jobs.value = await adminAPI.getAllJobs({ active_only: false, include_archived: true }) }
const loadApplications = async () => { applications.value = await adminAPI.getApplications({ include_deleted: true }) }
const loadResearch = async () => { research.value = await adminAPI.getAllResearch() }
const loadContacts = async () => { contacts.value = await adminAPI.getContacts() }

const handleResearchSubmit = async ({ data }) => {
  loading.value = true
  try {
    if (editingResearch.value) await adminAPI.updateResearch(editingResearch.value._id, data)
    else await adminAPI.createResearch(data)
    closeResearchForm(); loadResearch()
  } finally { loading.value = false }
}
const closeResearchForm = () => { showResearchForm.value = false; editingResearch.value = null }

// Submission Logic
const handleInsightSubmit = async ({ data, file }) => {
  loading.value = true
  try {
    if (file) {
      const res = await adminAPI.uploadFile(file)
      data.imageUrl = res.url
    }
    if (editingInsight.value) await adminAPI.updateInsight(editingInsight.value._id, data)
    else await adminAPI.createInsight(data)
    closeInsightForm(); loadInsights()
  } finally { loading.value = false }
}
const closeInsightForm = () => { showCreateForm.value = false; editingInsight.value = null }
const startEdit = (i) => { 
  if (activeModule.value === 'resources' && selectedPage.value === 'research') {
    editingResearch.value = i
    showResearchForm.value = true
  } else {
    editingInsight.value = i
    showCreateForm.value = true
  }
}
const handleDelete = (id) => { 
  const isResearch = activeModule.value === 'resources' && selectedPage.value === 'research'
  confirmConfig.value = {
    title: isResearch ? 'Purge Scientific Record' : 'Purge Information Node',
    message: isResearch 
      ? 'TERMINATE PUBLICATION: Purge this research record from the system? This action is immutable.'
      : 'PERMANENT DELETION: Purge this information node from the core database? This action is immutable.',
    confirmLabel: isResearch ? 'Purge Record' : 'Delete Node',
    isDanger: true,
    action: async () => {
      loading.value = true
      try {
        if (isResearch) {
          await adminAPI.deleteResearch(id)
          loadResearch()
        } else {
          await adminAPI.deleteInsight(id)
          loadInsights()
        }
        showConfirm.value = false
      } finally { loading.value = false }
    }
  }
  showConfirm.value = true
}

const handleDeleteContact = (id) => {
  confirmConfig.value = {
    title: 'Purge Transmission',
    message: 'Remove this contact transmission? It cannot be recovered.',
    confirmLabel: 'Delete Contact',
    isDanger: true,
    action: async () => {
      loading.value = true
      try {
        await adminAPI.deleteContact(id)
        loadContacts()
        showConfirm.value = false
      } finally { loading.value = false }
    }
  }
  showConfirm.value = true
}

const handleUpdateContactStatus = async ({ id, status }) => {
  try {
    await adminAPI.updateContactStatus(id, status)
    loadContacts()
  } catch (err) { console.error('Failed to update status') }
}

const handleShowcaseSubmit = async ({ data, file }) => {
  loading.value = true
  try {
    if (file) {
      const res = await adminAPI.uploadFile(file)
      data.mediaUrl = res.url
    }
    if (editingShowcase.value) await adminAPI.updateShowcase(editingShowcase.value._id, data)
    else await adminAPI.createShowcase(data)
    closeShowcaseForm(); loadShowcase()
  } finally { loading.value = false }
}
const closeShowcaseForm = () => { showShowcaseForm.value = false; editingShowcase.value = null }
const startEditShowcase = (item) => { editingShowcase.value = item; showShowcaseForm.value = true }
const handleDeleteShowcase = (id) => { 
  confirmConfig.value = {
    title: 'Destroy Media Link',
    message: 'CRYPTO-PURGE: Destroy this media asset link? All associated metadata will be lost.',
    confirmLabel: 'Delete Asset',
    isDanger: true,
    action: async () => {
      loading.value = true
      try {
        await adminAPI.deleteShowcase(id)
        showConfirm.value = false
        loadShowcase()
      } finally { loading.value = false }
    }
  }
  showConfirm.value = true
}

const handleJobSubmit = async (jobData) => {
  loading.value = true
  try {
    if (editingJob.value) await adminAPI.updateJob(editingJob.value._id, jobData)
    else await adminAPI.createJob(jobData)
    closeJobForm(); loadJobs()
  } finally { loading.value = false }
}
const closeJobForm = () => { showJobForm.value = false; editingJob.value = null }
const startEditJob = (j) => { editingJob.value = j; showJobForm.value = true }
const handleArchiveJob = (id) => { 
  confirmConfig.value = {
    title: 'Archive Protocol',
    message: 'Move this role to the encrypted archive? It will no longer be visible on the public network.',
    confirmLabel: 'Archive Job',
    isDanger: false,
    action: async () => {
      await adminAPI.updateJob(id, { isArchived: true, active: false })
      showConfirm.value = false
      loadJobs()
    }
  }
  showConfirm.value = true
}

const handleDeleteJob = (id) => { 
  confirmConfig.value = {
    title: 'Terminate Job Descriptor',
    message: 'PERMANENT DELETION: Purge this Job Descriptor? This action cannot be undone.',
    confirmLabel: 'Delete JD',
    isDanger: true,
    action: async () => {
      await adminAPI.deleteJob(id, true)
      showConfirm.value = false
      loadJobs()
    }
  }
  showConfirm.value = true
}
const handleRestoreJob = (id) => {
  confirmConfig.value = {
    title: 'Restore Protocol',
    message: 'PROTOCOL REACTIVATION: Re-broadcast this Job Descriptor to the public network?',
    confirmLabel: 'Restore Job',
    isDanger: false,
    action: async () => {
      await adminAPI.updateJob(id, { isArchived: false, active: true })
      showConfirm.value = false
      loadJobs()
    }
  }
  showConfirm.value = true
}

const openApplicationPreview = (app) => { selectedApplication.value = app }
const handleUpdateStatus = (id, status) => { 
  confirmConfig.value = {
    title: 'Protocol Update',
    message: `SYSTEM LOG: Update candidate status to "${status.toUpperCase()}"?`,
    confirmLabel: 'Update Status',
    isDanger: status === 'Rejected',
    action: async () => {
      await adminAPI.updateApplicationStatus(id, status)
      if (selectedApplication.value) selectedApplication.value = null
      showConfirm.value = false
      loadApplications() 
    }
  }
  showConfirm.value = true
}

const handleDeleteApplication = (id) => { 
  confirmConfig.value = {
    title: 'Purge Applicant Node',
    message: 'PERMANENT DELETION: Purge applicant data from the system? This action is immutable.',
    confirmLabel: 'Delete Applicant',
    isDanger: true,
    action: async () => {
      await adminAPI.deleteApplication(id, false)
      showConfirm.value = false
      loadApplications()
    }
  }
  showConfirm.value = true
}

const handleRestoreApplication = (id) => {
  confirmConfig.value = {
    title: 'Restore Candidate',
    message: 'RECONSTITUTION: Restore this candidate node to the active recruitment flow? This will reset status to "Applied".',
    confirmLabel: 'Restore Candidate',
    isDanger: false,
    action: async () => {
      await adminAPI.restoreApplication(id)
      showConfirm.value = false
      loadApplications()
    }
  }
  showConfirm.value = true
}

const handleDeleteApplicationPermanent = (id) => {
  confirmConfig.value = {
    title: 'FINAL PURGE',
    message: 'CRITICAL: This will permanently destroy the candidate record from the database. This cannot be reversed.',
    confirmLabel: 'Destroy Permanently',
    isDanger: true,
    action: async () => {
      await adminAPI.deleteApplication(id, true)
      showConfirm.value = false
      loadApplications()
    }
  }
  showConfirm.value = true
}

const handleCreatePage = (pageData) => {
  const id = pageData.label.toLowerCase().replace(/\s+/g, '-')
  websitePages.value.push({ ...pageData, id })
  isPageModalOpen.value = false
}

const handlePageConfigSubmit = async (config) => {
  loading.value = true
  try {
    await adminAPI.updatePageConfig(selectedPage.value, config)
    showPageEditor.value = false
  } catch (err) {
    console.error('Failed to update page config:', err)
  } finally {
    loading.value = false
  }
}

const handleSearchSelect = (item) => {
  if (item.type === 'Insight') { 
    const isService = ['ai-work', 'ai-service', 'ai-enterprise'].includes(item.page)
    activeModule.value = isService ? 'services' : 'products'; 
    selectedPage.value = item.page || ''; 
    startEdit(item) 
  }
  else if (item.type === 'Showcase') { activeModule.value = 'showcase'; startEditShowcase(item) }
  else if (item.type === 'Careers') { activeModule.value = 'careers'; openApplicationPreview(item) }
  else if (item.type === 'Resources') { activeModule.value = 'resources'; selectedPage.value = item.page; startEdit(item) }
}

// Global Lifecycle
watch(selectedPage, () => { if (['services', 'products'].includes(activeModule.value)) loadInsights() })
watch(activeModule, (nv) => { 
  if (['services', 'products', 'resources'].includes(nv)) { loadInsights(); loadResearch() }
  if (nv === 'showcase') loadShowcase()
  if (nv === 'careers') { 
    if (!selectedPage.value) selectedPage.value = 'jds'
    loadJobs(); loadApplications() 
  }
})

onMounted(() => {
  isAuthenticated.value = authAPI.isAuthenticated()
  if (isAuthenticated.value) initDashboard()
})
</script>

<style>
@import './admin.css';
</style>
