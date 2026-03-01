<template>
  <div class="search-manager" v-click-outside="closeSearch">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Quick command or search..." 
        class="luxury-search-input"
        @focus="isDropdownOpen = true"
        @input="handleInput"
      />
      <div v-if="searchQuery" class="clear-search" @click="searchQuery = ''; results = []">✕</div>
    </div>

    <!-- Results Dropdown -->
    <transition name="page-fade">
      <div v-if="isDropdownOpen && results.length > 0" class="search-dropdown-luxury">
        <div v-for="(group, type) in groupedResults" :key="type" class="result-group">
          <label class="group-label">{{ type }}</label>
          <div 
            v-for="item in group" 
            :key="item._id" 
            class="result-row"
            @click="selectResult(item)"
          >
            <div class="result-type-icon">{{ getIcon(type) }}</div>
            <div class="result-content">
              <span class="title">{{ item.title || item.name }}</span>
              <span class="snippet">{{ item.excerpt || item.role || item.product }}</span>
            </div>
            <div class="result-arrow">→</div>
          </div>
        </div>
      </div>
      <div v-else-if="isDropdownOpen && searchQuery.length > 2" class="search-dropdown-luxury no-results">
        No matches for <span class="query-text">"{{ searchQuery }}"</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  searchData: { type: Object, default: () => ({ insights: [], showcase: [], applications: [] }) }
})

const emit = defineEmits(['select'])

const searchQuery = ref('')
const isDropdownOpen = ref(false)
const results = ref([])

const handleInput = () => {
  if (searchQuery.value.length < 2) {
    results.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  const matches = []

  // Search Insights
  props.searchData.insights.forEach(item => {
    if (item.title?.toLowerCase().includes(query) || item.excerpt?.toLowerCase().includes(query)) {
      matches.push({ ...item, type: 'Insights' })
    }
  })

  // Search Showcase
  props.searchData.showcase.forEach(item => {
    if (item.title?.toLowerCase().includes(query) || item.product?.toLowerCase().includes(query)) {
      matches.push({ ...item, type: 'Showcase' })
    }
  })

  // Search Careers
  props.searchData.applications.forEach(item => {
    if (item.name?.toLowerCase().includes(query) || item.role?.toLowerCase().includes(query)) {
      matches.push({ ...item, type: 'Careers' })
    }
  })

  results.value = matches.slice(0, 6)
}

const groupedResults = computed(() => {
  const groups = {}
  results.value.forEach(item => {
    if (!groups[item.type]) groups[item.type] = []
    groups[item.type].push(item)
  })
  return groups
})

const getIcon = (type) => {
  const icons = { 'Insights': '📄', 'Showcase': '🎨', 'Careers': '🧬' }
  return icons[type] || '🔍'
}

const selectResult = (item) => {
  emit('select', item)
  isDropdownOpen.value = false
  searchQuery.value = ''
}

const closeSearch = () => { isDropdownOpen.value = false }

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) { document.removeEventListener('click', el.clickOutsideEvent) }
}
</script>

<style scoped>
.search-manager { position: relative; width: 100%; }

.luxury-search-input {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 100px;
  padding: 0.85rem 1.5rem 0.85rem 3.5rem;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.luxury-search-input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-elevated);
  box-shadow: 0 0 0 10px rgba(99, 102, 241, 0.05);
}

.search-icon { position: absolute; left: 1.5rem; top: 1.1rem; opacity: 0.5; font-size: 1.1rem; }
.clear-search { position: absolute; right: 1.5rem; top: 1.1rem; opacity: 0.4; cursor: pointer; }

.search-dropdown-luxury {
  position: absolute;
  top: calc(100% + 1rem);
  left: 0; right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
  backdrop-filter: blur(40px);
}

.result-group { padding: 8px 0; border-bottom: 1px solid var(--border-subtle); }
.result-group:last-child { border-bottom: none; }

.group-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--text-muted);
  padding: 8px 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.result-row:hover { background: var(--glass-heavy); }
.result-row:hover .result-arrow { transform: translateX(8px); opacity: 1; }

.result-type-icon {
  width: 40px; height: 40px;
  background: var(--bg-surface);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}

.result-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.result-content .title { font-size: 0.95rem; font-weight: 700; color: white; margin-bottom: 2px; }
.result-content .snippet { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.result-arrow { opacity: 0; transition: all 0.3s; color: var(--primary); font-weight: 900; }

.no-results { padding: 3rem; text-align: center; color: var(--text-muted); }
.query-text { color: white; font-weight: 700; }
</style>
