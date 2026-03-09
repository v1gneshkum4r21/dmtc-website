<template>
  <div class="company-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag" :style="{ backgroundColor: selectedPageInfo.color + '20', color: selectedPageInfo.color }">
            {{ selectedPageInfo.sub }}
          </span>
        </div>
        <h1>{{ selectedPageLabel }} <span class="text-gradient-primary">Overview</span></h1>
        <p>Overview of your company information for the {{ selectedPageLabel }} page.</p>
      </div>
      
      <div class="header-actions">
        <div class="actions-wrapper">
          <button v-if="selectedPage" class="btn-ghost" @click="$emit('configure-page')">
            <span class="icon">⚙️</span>
            Configure Page
          </button>
        </div>
      </div>
    </header>

    <!-- Dynamic Metrics Matrix -->
    <div class="metrics-row" v-if="selectedPage === 'leadership' && pageData">
      <div class="metric-pill">
        <span class="val">{{ pageData.team?.length ?? 0 }}</span>
        <span class="label">Core Team</span>
      </div>
      <div class="metric-pill">
        <span class="val">{{ pageData.advisors?.length ?? 0 }}</span>
        <span class="label">Strategic Advisors</span>
      </div>
    </div>

    <div class="metrics-row" v-else-if="selectedPage === 'about' && pageData">
      <div class="metric-pill">
        <span class="val">{{ pageData.approaches?.length ?? 0 }}</span>
        <span class="label">Approaches</span>
      </div>
      <div class="metric-pill">
        <span class="val">{{ pageData.values?.length ?? 0 }}</span>
        <span class="label">Values</span>
      </div>
    </div>

    <div class="metrics-row" v-else-if="selectedPage === 'careers' && pageData">
      <div class="metric-pill">
        <span class="val">{{ pageData.perks?.length ?? 0 }}</span>
        <span class="label">Perks Listed</span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="quantum-loader-vessel">
      <div class="pulse-ring"></div>
      <p>Loading...</p>
    </div>

    <!-- Main Viewport -->
    <div v-else class="card-premium structural-preview">
      <div class="preview-header">
        <span class="preview-label">Page Preview</span>
      </div>
      <div class="preview-content">
        <!-- Leadership Team Preview -->
        <div v-if="selectedPage === 'leadership' && pageData?.team?.length" class="team-preview-grid">
          <div v-for="member in pageData.team" :key="member.name" class="member-mini-card">
            <div class="member-avatar" :style="{ background: member.accent }">
              <img v-if="member.image" :src="member.image" :alt="member.name" />
              <span v-else>{{ member.initials }}</span>
            </div>
            <div class="member-details">
              <h4>{{ member.name }}</h4>
              <span class="member-role-tag">{{ member.role }}</span>
              <p>{{ member.bio }}</p>
            </div>
          </div>
        </div>

        <!-- About Approaches Preview -->
        <div v-else-if="selectedPage === 'about' && pageData?.approaches?.length" class="approaches-preview-grid">
          <div v-for="approach in pageData.approaches" :key="approach.title" class="approach-mini-card" :style="{ background: approach.accent }">
            <h4>{{ approach.title }}</h4>
            <p>{{ approach.description }}</p>
          </div>
        </div>

        <!-- Careers Perks Preview -->
        <div v-else-if="selectedPage === 'careers' && pageData?.perks?.length" class="perks-preview-grid">
          <div v-for="perk in pageData.perks" :key="perk.title" class="perk-mini-card">
            <h4>{{ perk.title }}</h4>
            <p>{{ perk.description }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-intelligence">
          <div class="empty-glyph">🏢</div>
          <h3>Page is active</h3>
          <p>This page is live on the website.</p>
          <p class="secondary-info">Use the <strong>Configure Page</strong> button to edit the content.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { pagesAPI } from '@/services/api'

const props = defineProps({
  selectedPage: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const pageData = ref(null)
const isFetching = ref(false)

const selectedPageInfo = computed(() => {
  const defaults = {
    'about': { label: 'About Us', sub: 'Company Info', color: '#6366f1' },
    'leadership': { label: 'Leadership', sub: 'Management Team', color: '#10b981' },
    'careers': { label: 'Careers', sub: 'Recruitment', color: '#f59e0b' }
  }
  return defaults[props.selectedPage] || { label: 'Company', sub: 'Company Orbit', color: '#94a3b8' }
})

const selectedPageLabel = computed(() => selectedPageInfo.value.label)

const loadPageData = async () => {
  if (!props.selectedPage) return
  isFetching.value = true
  try {
    pageData.value = await pagesAPI.getConfig(props.selectedPage)
  } catch (err) {
    console.error('Failed to load company page config:', err)
  } finally {
    isFetching.value = false
  }
}

watch(() => props.selectedPage, loadPageData, { immediate: true })

defineEmits(['configure-page'])
</script>

<style scoped>
.company-manager {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-actions { display: flex; align-items: center; gap: 2rem; }
.actions-wrapper { display: flex; align-items: center; gap: 1rem; }

.btn-ghost {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.7rem 1.2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border-color: var(--border-medium);
}

/* Metrics Row */
.metrics-row { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; }
.metric-pill { display: flex; align-items: baseline; gap: 10px; }
.metric-pill .val { font-size: 1.8rem; font-weight: 900; color: white; }
.metric-pill .label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

.structural-preview {
  padding: 0 !important;
  overflow: hidden;
}

.preview-header {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle);
}

.preview-label {
  font-size: 0.65rem;
  font-weight: 900;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.empty-intelligence { padding: 5rem !important; text-align: center; }
.empty-glyph { font-size: 4rem; margin-bottom: 2rem; opacity: 0.2; }
.secondary-info { font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem; }

/* Quantum Loader */
.quantum-loader-vessel { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  padding: 5rem; gap: 2rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 700;
}
.pulse-ring {
  width: 40px; height: 40px; border: 2px solid var(--primary); border-radius: 50%;
  animation: ripple 1.5s infinite ease-out;
}
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}

/* Leadership Preview Grid */
.team-preview-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.member-mini-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--border-subtle);
  transition: background 0.2s;
}
.member-mini-card:last-child { border-bottom: none; }
.member-mini-card:hover { background: rgba(255,255,255,0.02); }
.member-avatar {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
}
.member-avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-details h4 { font-size: 1rem; font-weight: 800; color: white; margin-bottom: 0.3rem; }
.member-role-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}
.member-details p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

/* About Approaches Preview */
.approaches-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.approach-mini-card {
  padding: 2rem 2.5rem;
  border-right: 1px solid var(--border-subtle);
  transition: opacity 0.2s;
}
.approach-mini-card:last-child { border-right: none; }
.approach-mini-card h4 { font-size: 1.1rem; font-weight: 800; color: white; margin-bottom: 0.75rem; }
.approach-mini-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

/* Careers Perks Preview */
.perks-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.perk-mini-card {
  padding: 2rem 2.5rem;
  border-right: 1px solid var(--border-subtle);
}
.perk-mini-card:last-child { border-right: none; }
.perk-mini-card h4 { font-size: 1rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
.perk-mini-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
</style>
