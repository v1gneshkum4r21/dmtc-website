<template>
  <div class="app" :class="{ 'dark-theme': isDarkMode }">
    <FloatingNavbar v-if="!isAdminPage" @toggle-theme="toggleTheme" :is-dark-mode="isDarkMode" />
    <router-view />
    <Footer v-if="!isAdminPage" />
    <ContactModal :is-open="isContactModalOpen" @close="closeContactModal" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import FloatingNavbar from './components/FloatingNavbar.vue'
import Footer from './components/Footer.vue'
import ContactModal from './components/ContactModal.vue'

const isDarkMode = ref(false)
const isContactModalOpen = ref(false)
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

// Provide global access to trigger modal
provide('openContactModal', openContactModal)

// Check for system preference
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Optional: Start with dark if system is dark
    // toggleTheme() 
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
