<template>
  <div class="app" :class="{ 'dark-theme': isDarkMode }">
    <FloatingNavbar v-if="!isAdminPage" @toggle-theme="toggleTheme" :is-dark-mode="isDarkMode" />
    <router-view />
    <Footer v-if="!isAdminPage" :is-dark-mode="isDarkMode" />
    <ContactModal :is-open="isContactModalOpen" @close="closeContactModal" />
    <JobApplicationModal :is-open="isJobModalOpen" :role-title="selectedRole" @close="closeJobModal" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import FloatingNavbar from './components/FloatingNavbar.vue'
import Footer from './components/Footer.vue'
import ContactModal from './components/ContactModal.vue'
import JobApplicationModal from './components/JobApplicationModal.vue'

const isDarkMode = ref(true)
const isContactModalOpen = ref(false)
const isJobModalOpen = ref(false)
const selectedRole = ref('')
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

const openContactModal = () => {
  isContactModalOpen.value = true
}

const closeContactModal = () => {
  isContactModalOpen.value = false
}

const openJobModal = (roleTitle) => {
  selectedRole.value = roleTitle || ''
  isJobModalOpen.value = true
}

const closeJobModal = () => {
  isJobModalOpen.value = false
}

// Provide global access to trigger modals
provide('openContactModal', openContactModal)
provide('openJobModal', openJobModal)

// Set default theme on mount
onMounted(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme')
  }
})
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
</style>
