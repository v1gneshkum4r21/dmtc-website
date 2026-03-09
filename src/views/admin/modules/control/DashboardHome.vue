<template>
  <div class="dashboard-home">

    <!-- ── WELCOME BANNER ──────────────────────────────── -->
    <div class="hero-banner">
      <div class="hero-bg-glow"></div>
      <div class="hero-content">
        <div class="hero-left">
          <div class="command-badge">
            <span class="badge-dot"></span>
            ADMIN DASHBOARD
          </div>
          <h1>Welcome <span class="text-gradient-primary">Back</span></h1>
          <p>Everything is running smoothly. Manage your website below.</p>
        </div>
        <div class="hero-right">
          <div class="time-block">
            <span class="time-label">LOCAL TIME</span>
            <span class="time-val">{{ currentTime }}</span>
          </div>
          <div class="integrity-block">
            <svg viewBox="0 0 100 40" class="pulse-svg">
              <polyline points="0,20 20,20 25,10 35,30 40,20 60,20 65,5 75,35 80,20 100,20" class="pulse-line" />
            </svg>
            <div>
              <span class="int-label">System Status</span>
              <span class="int-status">Running Smoothly</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── METRICS ──────────────────────────────────── -->
    <div class="metrics-matrix">
      <div
        v-for="stat in metrics" :key="stat.label"
        class="metric-node card-premium"
        @click="$emit('switch', stat.module)"
        style="cursor:pointer"
      >
        <div class="node-icon-wrap" :style="{ background: stat.bg }">
          <span class="node-emoji">{{ stat.icon }}</span>
        </div>
        <div class="node-body">
          <span class="node-label">{{ stat.label }}</span>
          <div class="node-val-row">
            <span class="node-val">{{ stat.value }}</span>
            <div class="momentum" :class="stat.trend > 0 ? 'up' : 'stable'">
              {{ stat.trend > 0 ? '▲' : '▬' }} {{ stat.trend }}%
            </div>
          </div>
        </div>
        <div class="node-bar-bg">
          <div class="node-bar-fill" :style="{ width: Math.min((stat.value / 20) * 100, 100) + '%', background: stat.color }"></div>
        </div>
        <div class="node-arrow">→</div>
      </div>
    </div>

    <!-- ── QUICK ACCESS GRID ──────────────────────────────── -->
    <div class="section-divider">
      <span class="divider-label">⚡ QUICK ACTIONS</span>
    </div>
    <div class="quick-access-grid">
      <div v-for="nav in quickLinks" :key="nav.label"
        class="quick-tile"
        :style="{ '--tile-color': nav.color }"
        @click="nav.sub ? $emit('switch', nav.module, nav.sub) : $emit('switch', nav.module)"
      >
        <div class="tile-icon-ring">{{ nav.icon }}</div>
        <div class="tile-body">
          <span class="tile-title">{{ nav.label }}</span>
          <span class="tile-desc">{{ nav.desc }}</span>
        </div>
        <div class="tile-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- ── INSIGHTS BY PAGE ─────────────────────────── -->
    <div class="section-divider">
      <span class="divider-label">📁 PAGE OVERVIEWS</span>
    </div>
    <div class="inventory-grid">
      <div 
        v-for="p in pageInventory" 
        :key="p.id" 
        class="inventory-card card-premium"
        @click="$emit('switch', 'insights', p.id)"
      >
        <div class="inv-header">
          <div class="inv-title">
            <span class="inv-icon">{{ p.icon }}</span>
            <h4>{{ p.label }}</h4>
          </div>
          <div class="inv-date">Updated: {{ formatDateShort(p.updatedAt) }}</div>
        </div>
        <div class="inv-metrics">
          <div class="inv-stat">
            <span class="is-label">Total Insights</span>
            <span class="is-val">{{ p.total }}</span>
          </div>
          <div class="inv-stat">
            <span class="is-label">Published</span>
            <span class="is-val success">{{ p.live }}</span>
          </div>
          <div class="inv-stat">
            <span class="is-label">Drafts</span>
            <span class="is-val warning">{{ p.draft }}</span>
          </div>
        </div>
        <div class="inv-progress">
          <div class="inv-bar" :style="{ width: (p.live / p.total) * 100 + '%' }"></div>
        </div>
        <div class="inv-footer">
          Open Page →
        </div>
      </div>
      <div v-if="pageInventory.length === 0" class="empty-inventory">
        <p>No insights found across the website pages.</p>
      </div>
    </div>

    <!-- ── LIVE FEED GRID ─────────────────────────────────── -->
    <div class="live-feed-grid">
      <div class="section-divider full-width">
        <span class="divider-label">🕒 RECENT ACTIVITY</span>
      </div>

      <!-- Contacts Feed -->
      <div class="card-premium feed-card">
        <div class="feed-header">
          <div class="feed-title">
            <div class="feed-badge" style="background: rgba(34,211,238,0.15); color: #22d3ee;">📫</div>
            <div>
              <h3>Contacts</h3>
              <span class="feed-subtitle">{{ unseenContacts }} new messages</span>
            </div>
          </div>
          <button class="feed-action-btn" @click="$emit('switch', 'contacts')">
            View All →
          </button>
        </div>
        <div class="feed-list">
          <div v-for="c in recentContacts" :key="c.id" class="feed-item" @click="$emit('switch', 'contacts')">
            <div class="fi-avatar" :style="{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }">
              {{ c.name.charAt(0).toUpperCase() }}
            </div>
            <div class="fi-body">
              <span class="fi-name">{{ c.name }}</span>
              <span class="fi-meta">{{ c.email }} · {{ c.subject || 'general' }}</span>
            </div>
            <div class="fi-status" :class="c.status">{{ c.status.toUpperCase() }}</div>
            <div class="fi-date">{{ formatDateShort(c.createdAt) }}</div>
          </div>
          <div v-if="recentContacts.length === 0" class="feed-empty">
            <span>📭</span> No messages yet
          </div>
        </div>
      </div>

      <!-- Applicants Feed -->
      <div class="card-premium feed-card">
        <div class="feed-header">
          <div class="feed-title">
            <div class="feed-badge" style="background: rgba(59,130,246,0.15); color: #3b82f6;">👥</div>
            <div>
              <h3>Applicants</h3>
              <span class="feed-subtitle">{{ recentApplications.length }} recent candidates</span>
            </div>
          </div>
          <button class="feed-action-btn" @click="$emit('switch', 'careers', 'applicants')">
            View Candidates →
          </button>
        </div>
        <div class="feed-list">
          <div v-for="a in recentApplications" :key="a._id" class="feed-item" @click="$emit('switch', 'careers', 'applicants')">
            <div class="fi-avatar" :style="{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }">
              {{ a.name.charAt(0).toUpperCase() }}
            </div>
            <div class="fi-body">
              <span class="fi-name">{{ a.name }}</span>
              <span class="fi-meta">{{ a.role || 'Open Role' }}</span>
            </div>
            <div class="fi-status" :class="a.status.toLowerCase()">{{ a.status }}</div>
            <div class="fi-date">{{ formatDateShort(a.createdAt) }}</div>
          </div>
          <div v-if="recentApplications.length === 0" class="feed-empty">
            <span>💼</span> No applications yet
          </div>
        </div>
      </div>
    </div>

    <!-- ── BOTTOM ROW ─────────────────────────────────────── -->
    <div class="bottom-row">

      <!-- Latest Showcase -->
      <div class="card-premium showcase-card" @click="$emit('switch', 'showcase')" style="cursor:pointer">
        <div class="sc-label">NEWEST SHOWCASE ITEM</div>
        <div class="sc-body" v-if="latestShowcase">
          <div class="sc-image">
            <img v-if="latestShowcase.mediaType === 'image'" :src="latestShowcase.mediaUrl" alt="" />
            <div v-else class="sc-placeholder">🎬</div>
          </div>
          <div class="sc-info">
            <h4>{{ latestShowcase.title }}</h4>
            <p>{{ latestShowcase.description || latestShowcase.tag }}</p>
            <span class="sc-link">View Showcase →</span>
          </div>
        </div>
        <div v-else class="sc-empty">No showcase items yet. Add your first item.</div>
      </div>

      <!-- System Quick Tools -->
      <div class="card-premium tools-card">
        <div class="tools-header">
          <h3>⚙️ Settings & Tools</h3>
          <span class="tools-sub">Manage your system.</span>
        </div>
        <div class="tools-grid">
          <button class="tool-btn" @click="$emit('switch', 'settings')">
            <span class="tb-icon">⚙️</span>
            <span class="tb-label">Settings</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'showcase')">
            <span class="tb-icon">🎨</span>
            <span class="tb-label">Showcase</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'careers', 'jds')">
            <span class="tb-icon">💼</span>
            <span class="tb-label">Active Jobs</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'careers', 'history')">
            <span class="tb-icon">📜</span>
            <span class="tb-label">Activity Log</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'hero')">
            <span class="tb-icon">🎬</span>
            <span class="tb-label">Carousel</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'contacts')">
            <span class="tb-icon">📫</span>
            <span class="tb-label">Contacts</span>
          </button>
          <button class="tool-btn" @click="$emit('switch', 'careers', 'applicants')">
            <span class="tb-icon">👥</span>
            <span class="tb-label">Candidates</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  insights: { type: Array, default: () => [] },
  applications: { type: Array, default: () => [] },
  showcase: { type: Array, default: () => [] },
  contacts: { type: Array, default: () => [] },
  websitePages: { type: Array, default: () => [] }
})

const emit = defineEmits(['switch'])

// Node Inventory (Categorized stats)
const pageInventory = computed(() => {
  const pageMap = {}
  
  // Only include pages that are either in insights or explicitly listed
  const allKnownPages = [...new Set([
    ...props.insights.map(i => i.page),
    ...props.websitePages.filter(p => !p.isModular).map(p => p.id)
  ])].filter(Boolean)

  allKnownPages.forEach(pId => {
    const nodes = props.insights.filter(i => i.page === pId)
    const pageData = props.websitePages.find(wp => wp.id === pId)
    
    if (nodes.length > 0) {
      const mostRecent = [...nodes].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
      pageMap[pId] = {
        id: pId,
        label: pageData?.label || pId,
        icon: pageData?.icon || '✦',
        total: nodes.length,
        live: nodes.filter(n => n.published).length,
        draft: nodes.filter(n => !n.published).length,
        updatedAt: mostRecent?.updatedAt || mostRecent?.createdAt
      }
    }
  })

  return Object.values(pageMap).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

// Live time clock
const currentTime = ref('')
let timer
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

// Metrics
const metrics = computed(() => [
  { label: 'Insights', value: props.insights.length, icon: '💎', bg: 'rgba(14,165,233,0.12)', color: '#0ea5e9', trend: 12, module: 'insights' },
  { label: 'Contacts', value: props.contacts.length, icon: '📫', bg: 'rgba(34,211,238,0.12)', color: '#22d3ee', trend: 0, module: 'contacts' },
  { label: 'Applicants', value: props.applications.length, icon: '🚀', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', trend: 2, module: 'careers' },
  { label: 'Showcase', value: props.showcase.length, icon: '✨', bg: 'rgba(6,182,212,0.12)', color: '#06b6d4', trend: 5, module: 'showcase' }
])

// Quick access links
const quickLinks = [
  { label: 'Services', desc: 'AI Work · Service · Enterprise', icon: '💡', color: '#0ea5e9', module: 'insights' },
  { label: 'Products', desc: 'Superfitter · EchoAI pages', icon: '📦', color: '#3b82f6', module: 'insights' },
  { label: 'Company', desc: 'About Us · Leadership pages', icon: '🏢', color: '#22d3ee', module: 'company' },
  { label: 'Jobs', desc: 'Manage open job listings', icon: '💼', color: '#0ea5e9', module: 'careers', sub: 'jds' },
  { label: 'Applicants', desc: 'Review applications & talent', icon: '👥', color: '#06b6d4', module: 'careers', sub: 'applicants' },
  { label: 'Knowledge Hub', desc: 'Blog · Research · Resources', icon: '📚', color: '#3b82f6', module: 'resources' },
  { label: 'Hero Carousel', desc: 'Landing page carousel', icon: '🎬', color: '#22d3ee', module: 'hero' },
  { label: 'Showcase', desc: 'Website showcase items', icon: '🎨', color: '#0ea5e9', module: 'showcase' },
  { label: 'Contacts', desc: 'Incoming contact messages', icon: '📫', color: '#22d3ee', module: 'contacts' },
  { label: 'Settings', desc: 'SEO · Identity · Social settings', icon: '⚙️', color: '#94a3b8', module: 'settings' },
]

// Live data
const unseenContacts = computed(() => props.contacts.filter(c => c.status === 'unseen').length)
const recentContacts = computed(() => [...props.contacts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5))
const recentApplications = computed(() => [...props.applications].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5))
const latestShowcase = computed(() => props.showcase.length > 0 ? props.showcase[props.showcase.length - 1] : null)

const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 5rem;
  animation: dashboardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dashboardIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── HERO BANNER ─────────────────────────── */
.hero-banner {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 28px;
  padding: 2.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.hero-bg-glow {
  position: absolute;
  top: -60px; right: -60px;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.command-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.65rem;
  font-weight: 900;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.2);
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 1rem;
}

.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 8px #22d3ee;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-left h1 {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: white;
  margin: 0 0 0.5rem;
}

.hero-left p {
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
  max-width: 500px;
}

.hero-right {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.time-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.time-val {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.integrity-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0,0,0,0.3);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
}

.pulse-svg { width: 80px; height: 30px; }
.pulse-line {
  fill: none;
  stroke: #22d3ee;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: pulse-draw 2.5s linear infinite;
}

@keyframes pulse-draw {
  from { stroke-dashoffset: 200; }
  to { stroke-dashoffset: 0; }
}

.int-label { display: block; font-size: 0.6rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.int-status { display: block; font-size: 0.85rem; font-weight: 900; color: #22d3ee; }

/* ── METRICS MATRIX ──────────────────────── */
.metrics-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.metric-node {
  padding: 1.75rem !important;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.metric-node:hover {
  transform: translateY(-6px) !important;
  border-color: var(--primary) !important;
}

.metric-node:hover .node-arrow { opacity: 1; transform: translateX(4px); }

.node-icon-wrap {
  width: 50px; height: 50px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}

.node-emoji { font-size: 1.4rem; }

.node-body { flex: 1; }
.node-label { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.node-val-row { display: flex; align-items: baseline; gap: 0.75rem; margin-top: 6px; }
.node-val { font-size: 2.5rem; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.04em; }

.momentum {
  font-size: 0.65rem; font-weight: 900;
  padding: 3px 8px; border-radius: 6px;
}
.momentum.up { background: rgba(34, 211, 238, 0.1); color: #22d3ee; }
.momentum.stable { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

.node-bar-bg { height: 3px; background: rgba(0,0,0,0.3); border-radius: 100px; overflow: hidden; }
.node-bar-fill { height: 100%; border-radius: 100px; transition: width 1.5s cubic-bezier(0.16,1,0.3,1); }

.node-arrow {
  position: absolute; top: 1.75rem; right: 1.75rem;
  font-size: 1rem; color: var(--text-muted);
  opacity: 0; transition: all 0.3s;
}

/* ── SECTION DIVIDER ─────────────────────── */
.section-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-divider::before, .section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}

.divider-label {
  font-size: 0.65rem;
  font-weight: 900;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  white-space: nowrap;
  padding: 0 1rem;
}

/* ── QUICK ACCESS GRID ───────────────────── */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.quick-tile {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.quick-tile::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--tile-color);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 0 2px 2px 0;
}

.quick-tile:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.12);
  transform: translateX(4px);
}

.quick-tile:hover::before { opacity: 1; }
.quick-tile:hover .tile-arrow { opacity: 1; color: var(--tile-color); }

.tile-icon-ring {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: all 0.3s;
}

.quick-tile:hover .tile-icon-ring {
  background: color-mix(in srgb, var(--tile-color) 15%, transparent);
  border-color: color-mix(in srgb, var(--tile-color) 30%, transparent);
}

.tile-body { flex: 1; min-width: 0; }
.tile-title { display: block; font-size: 0.9rem; font-weight: 800; color: white; margin-bottom: 2px; }
.tile-desc { display: block; font-size: 0.7rem; color: var(--text-muted); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.tile-arrow {
  opacity: 0;
  color: var(--text-muted);
  transition: all 0.3s;
  flex-shrink: 0;
}

/* ── INVENTORY GRID ──────────────────────── */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.inventory-card {
  padding: 1.5rem !important;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.inventory-card:hover {
  transform: translateY(-4px) !important;
  border-color: var(--primary) !important;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.inv-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.inv-icon {
  font-size: 1.2rem;
  width: 32px; height: 32px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.inv-title h4 {
  font-size: 0.95rem;
  font-weight: 850;
  color: white;
  margin: 0;
  text-transform: capitalize;
}

.inv-date {
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.inv-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.inv-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.is-label {
  font-size: 0.55rem;
  font-weight: 800;
  color: #52525b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.is-val {
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
}

.is-val.success { color: #22c55e; }
.is-val.warning { color: #f59e0b; }

.inv-progress {
  height: 4px;
  background: rgba(0,0,0,0.3);
  border-radius: 100px;
  overflow: hidden;
}

.inv-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 100px;
}

.inv-footer {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--primary);
  margin-top: auto;
  opacity: 0.6;
}

.empty-inventory {
  grid-column: 1 / -1;
  padding: 4rem;
  text-align: center;
  color: var(--text-muted);
  font-weight: 600;
  background: rgba(255,255,255,0.01);
  border: 1px dashed var(--border-subtle);
  border-radius: 20px;
}

/* ── LIVE FEED GRID ──────────────────────── */
.live-feed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.feed-card {
  padding: 2rem !important;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feed-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feed-badge {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.feed-title h3 { font-size: 1.05rem; font-weight: 850; color: white; margin: 0 0 2px; }
.feed-subtitle { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }

.feed-action-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.feed-action-btn:hover { color: white; border-color: var(--primary); background: var(--bg-elevated); }

.feed-list { display: flex; flex-direction: column; gap: 0.6rem; }

.feed-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.feed-item:hover { background: rgba(255,255,255,0.04); border-color: var(--primary); transform: translateX(4px); }

.fi-avatar {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 900; color: white;
  flex-shrink: 0;
}

.fi-body { flex: 1; min-width: 0; }
.fi-name { display: block; font-size: 0.85rem; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fi-meta { display: block; font-size: 0.65rem; color: var(--text-muted); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.fi-status {
  font-size: 0.55rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;
  padding: 3px 8px; border-radius: 5px;
  background: rgba(148,163,184,0.1); color: var(--text-muted);
  flex-shrink: 0;
}
.fi-status.unseen { background: rgba(239,68,68,0.1); color: #ef4444; }
.fi-status.reviewed { background: rgba(245,158,11,0.1); color: #f59e0b; }
.fi-status.actioned { background: rgba(34,211,238,0.1); color: #22d3ee; }
.fi-status.applied { background: rgba(59,130,246,0.1); color: #3b82f6; }
.fi-status.selected { background: rgba(34,211,238,0.1); color: #22d3ee; }
.fi-status.rejected { background: rgba(239,68,68,0.1); color: #ef4444; }
.fi-status.interviewed { background: rgba(168,85,247,0.1); color: #a855f7; }

.fi-date { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); font-family: monospace; flex-shrink: 0; }

.feed-empty {
  padding: 2.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* ── BOTTOM ROW ──────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
}

/* Showcase Card */
.showcase-card {
  padding: 0 !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.showcase-card:hover { border-color: var(--primary) !important; transform: translateY(-4px) !important; }

.sc-label {
  font-size: 0.6rem; font-weight: 900; color: var(--primary);
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 1.5rem 2rem 0;
}

.sc-body {
  display: flex;
  height: 180px;
}

.sc-image {
  width: 200px;
  flex-shrink: 0;
  background: #000;
  overflow: hidden;
}

.sc-image img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.sc-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: #111; }

.sc-info {
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.sc-info h4 { font-size: 1.05rem; font-weight: 850; color: white; margin: 0; }
.sc-info p { font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.4; }
.sc-link { font-size: 0.8rem; font-weight: 800; color: var(--primary); margin-top: 0.5rem; }

.sc-empty {
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.5;
}

/* Tools Card */
.tools-card {
  padding: 1.75rem !important;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tools-header h3 { font-size: 1rem; font-weight: 850; color: white; margin: 0 0 4px; }
.tools-sub { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  flex: 1;
}

.tool-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 1rem 0.5rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 72px;
}

.tool-btn:hover {
  background: var(--bg-elevated);
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.tb-icon { font-size: 1.2rem; }
.tb-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; text-align: center; line-height: 1.2; }
.tool-btn:hover .tb-label { color: white; }

/* ── RESPONSIVE ──────────────────────────── */
@media (max-width: 1280px) {
  .quick-access-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 1100px) {
  .metrics-matrix { grid-template-columns: repeat(2, 1fr); }
  .live-feed-grid { grid-template-columns: 1fr; }
  .bottom-row { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .quick-access-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-right { display: none; }
  .hero-left h1 { font-size: 2rem; }
}

@media (max-width: 640px) {
  .metrics-matrix { grid-template-columns: 1fr; }
  .quick-access-grid { grid-template-columns: 1fr; }
  .tools-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-banner { padding: 1.5rem; }
}
</style>
