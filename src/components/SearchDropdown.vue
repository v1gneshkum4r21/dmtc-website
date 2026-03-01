<template>
  <div class="mega-menu" :class="{ show: isOpen }">
    <!-- Loader -->
    <div v-if="isSearching" class="search-loader">
      <div class="loader-line"></div>
      <span>Searching across silos...</span>
    </div>

    <!-- Results -->
    <template v-else-if="results.length > 0">
      <router-link 
        v-for="result in results" 
        :key="result.id" 
        :to="result.url" 
        class="mega-row"
        :class="getRowColor(result.type)"
        @click="$emit('close')"
      >
        <span class="mega-watermark">{{ result.category }}</span>
        <div class="row-content">
          <div class="row-main">
            <div class="result-icon">
              <!-- Icon based on type -->
              <svg v-if="result.type === 'insight'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <svg v-else-if="result.type === 'research'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              <svg v-else-if="result.type === 'job'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div class="row-text">
              <h3>{{ result.title }}</h3>
              <p>{{ result.description }}</p>
            </div>
          </div>
          <!-- Animated Arrow -->
          <div class="row-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </router-link>
    </template>

    <!-- No Results -->
    <div v-else-if="query.length >= 2" class="no-results">
       <p>No results found for "<span class="highlight">{{ query }}</span>"</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  results: Array,
  isSearching: Boolean,
  query: String
})

defineEmits(['close'])

const getRowColor = (type) => {
  switch(type) {
    case 'insight': return 'row-lavender'
    case 'research': return 'row-green'
    case 'job': return 'row-blue'
    default: return 'row-lavender'
  }
}
</script>

<style scoped>
.mega-menu {
  position: fixed;
  top: 85px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  width: 95%;
  max-width: 1026px;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 
    0 50px 100px -20px rgba(50, 50, 93, 0.25), 
    0 30px 60px -30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 2000;
}

.mega-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.mega-row {
  padding: 1.1rem 2.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: block;
  text-decoration: none !important;
  position: relative;
  overflow: hidden;
}

.mega-row:last-child {
  border-bottom: none;
}

.mega-watermark {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 4.5rem;
  font-weight: 950;
  color: rgba(0, 0, 0, 0.04);
  pointer-events: none;
  user-select: none;
  z-index: 1;
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.row-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.row-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.result-icon {
  width: 40px;
  height: 40px;
  background: rgba(10, 37, 64, 0.08); /* Dark subtle contrast on pastel background */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a2540;
  flex-shrink: 0;
}

.result-icon svg {
  width: 20px;
  height: 20px;
}

.row-text h3 {
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0a2540;
  font-family: var(--font-heading);
}

.row-text p {
  margin: 0;
  font-size: 0.8rem;
  color: #425466;
  line-height: 1.4;
}

.row-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: #0a2540;
  display: flex;
  align-items: center;
}

.mega-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

.row-lavender { background-color: #C4B5F7; }
.row-lavender:hover { background-color: #B09EED !important; }

.row-blue { background-color: #A8D8F0; }
.row-blue:hover { background-color: #8CCCE8 !important; }

.row-green { background-color: #A8E6C8; }
.row-green:hover { background-color: #8CDDB5 !important; }

.search-loader {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-primary);
}

.loader-line {
  width: 200px;
  height: 2px;
  background: var(--glass-border);
  position: relative;
  overflow: hidden;
}

.loader-line::after {
  content: '';
  position: absolute;
  left: -50%;
  width: 50%;
  height: 100%;
  background: #10b981;
  animation: loadingSlide 1.5s infinite;
}

@keyframes loadingSlide {
  to { left: 100%; }
}

.no-results {
  padding: 3rem;
  text-align: center;
  background: var(--bg-primary);
  color: var(--text-secondary);
}

.highlight {
  color: #10b981;
  font-weight: 700;
}
</style>
