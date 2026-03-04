<template>
  <div class="dashboard-home">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">COMMAND_CORE</span>
        </div>
        <h1>Command <span class="text-gradient-primary">Center</span></h1>
        <p>Global Intelligence Orchestration & Ecosystem Monitoring.</p>
      </div>
      
      <div class="header-actions">
        <div class="system-integrity-premium">
          <div class="integrity-pulse">
            <svg viewBox="0 0 100 40" class="pulse-svg">
              <polyline points="0,20 20,20 25,10 35,30 40,20 60,20 65,5 75,35 80,20 100,20" class="pulse-line" />
            </svg>
          </div>
          <div class="integrity-details">
            <span class="label">System Integrity</span>
            <span class="status">OPTIMAL // 99.8%</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Essential Metrics Matrix -->
    <div class="metrics-matrix">
      <div v-for="stat in metrics" :key="stat.label" class="metric-node card-premium luxe">
        <div class="node-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
        <div class="node-info">
          <label class="node-label">{{ stat.label }}</label>
          <div class="node-val-row">
            <span class="val">{{ stat.value }}</span>
            <div class="momentum" :class="stat.trend > 0 ? 'up' : 'stable'">
              <span class="m-icon">{{ stat.trend > 0 ? '▲' : '▬' }}</span>
              {{ stat.trend }}%
            </div>
          </div>
        </div>
        <div class="node-pulse-bar">
          <div class="pulse-fill" :style="{ width: '70%', background: stat.bg.replace('0.1', '0.5') }"></div>
        </div>
      </div>
    </div>

    <!-- Dual Activity Hubs -->
    <div class="activity-hub-grid">
      <!-- Editorial Momentum (Left) -->
      <div class="card-premium hub-node editorial-momentum">
        <div class="hub-header">
          <div class="h-title">
            <span class="h-icon">✍️</span>
            <h3>Network Comms</h3>
          </div>
          <button class="nav-btn-mini" @click="$emit('switch', 'contacts')">Dispatch Hub</button>
        </div>

        <div class="hub-inventory-wheel">
          <div v-for="c in recentContacts" :key="c.id" class="inventory-item">
            <div class="i-core">
              <span class="i-title">{{ c.name }}</span>
              <span class="i-meta">{{ c.email }} // {{ c.subject }}</span>
            </div>
            <div class="i-status" :class="c.status">{{ c.status.toUpperCase() }}</div>
            <div class="i-date">{{ formatDateShort(c.createdAt) }}</div>
          </div>
          <div v-if="recentContacts.length === 0" class="empty-hub">No incoming transmissions.</div>
        </div>
      </div>

      <!-- Talent Acquisition (Right) -->
      <div class="card-premium hub-node talent-acquisition">
        <div class="hub-header">
          <div class="h-title">
            <span class="h-icon">👥</span>
            <h3>Talent Acquisition</h3>
          </div>
          <button class="nav-btn-mini" @click="$emit('switch', 'careers')">Review Pipeline</button>
        </div>

        <div class="talent-pipeline-stack">
          <div v-for="a in recentApplications" :key="a._id" class="pipeline-card">
            <div class="p-avatar">{{ a.name.charAt(0) }}</div>
            <div class="p-info">
              <span class="p-name">{{ a.name }}</span>
              <span class="p-role">{{ a.role }}</span>
            </div>
            <div class="p-status-pill" :class="a.status.toLowerCase()">{{ a.status }}</div>
          </div>
          <div v-if="recentApplications.length === 0" class="empty-hub">Talent pipeline dormant.</div>
        </div>
      </div>
    </div>

    <!-- Infrastructure Highlights -->
    <div class="infrastructure-footer">
      <div class="highlight-node showcase-highlight card-premium">
        <div class="h-context">
          <span class="pre">LATEST MUSEUM ADDITION</span>
          <h4 v-if="latestShowcase">{{ latestShowcase.title }}</h4>
          <h4 v-else>No showcase media available</h4>
        </div>
        <div class="h-visual" v-if="latestShowcase">
          <img v-if="latestShowcase.mediaType === 'image'" :src="latestShowcase.mediaUrl" alt="" />
          <div v-else class="vid-placeholder">🎬</div>
        </div>
        <div class="h-action">
          <button @click="$emit('switch', 'showcase')">Museum Curator →</button>
        </div>
      </div>

      <div class="maintenance-cluster card-premium">
        <div class="cluster-grid">
          <button class="cluster-tool">
            <span class="t-icon">⚡</span>
            <span>Flush Cache</span>
          </button>
          <button class="cluster-tool" @click="$emit('switch', 'settings')">
            <span class="t-icon">⚙️</span>
            <span>System Config</span>
          </button>
          <button class="cluster-tool">
            <span class="t-icon">🛡️</span>
            <span>Audit Trail</span>
          </button>
          <button class="cluster-tool">
            <span class="t-icon">📦</span>
            <span>Redundancy Export</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  insights: { type: Array, default: () => [] },
  applications: { type: Array, default: () => [] },
  showcase: { type: Array, default: () => [] },
  contacts: { type: Array, default: () => [] }
})

const emit = defineEmits(['switch'])

const metrics = computed(() => [
  { label: 'Intelligence Nodes', value: props.insights.length, icon: '💎', bg: 'rgba(99, 102, 241, 0.1)', trend: 12 },
  { label: 'Network Comms', value: props.contacts.length, icon: '📫', bg: 'rgba(16, 185, 129, 0.1)', trend: 0 },
  { label: 'Ecosystem Talent', value: props.applications.length, icon: '🚀', bg: 'rgba(168, 85, 247, 0.1)', trend: 2 },
  { label: 'Visual Masterpieces', value: props.showcase.length, icon: '✨', bg: 'rgba(236, 72, 153, 0.1)', trend: 5 }
])

const recentInsights = computed(() => [...props.insights].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6))
const recentContacts = computed(() => [...props.contacts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6))
const recentApplications = computed(() => [...props.applications].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4))
const latestShowcase = computed(() => props.showcase.length > 0 ? props.showcase[props.showcase.length - 1] : null)

const formatDateShort = (date) => new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
</script>

<style scoped>
.dashboard-home {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 5rem;
  animation: dashboardFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dashboardFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Command Header */
.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-light);
  padding: 3rem;
  border-radius: 40px;
  border: 1px solid var(--border-subtle);
  position: relative;
  overflow: hidden;
}

.command-header::after {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 60%);
  pointer-events: none;
}

.header-main { display: flex; gap: 2rem; align-items: center; }
.command-glyph {
  width: 70px; height: 70px;
  background: var(--primary-gradient);
  border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.2rem;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
}

.context h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 0.5rem; }
.context p { color: var(--text-muted); font-size: 1rem; font-weight: 500; }
.text-gradient { background: var(--primary-gradient); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

.system-integrity {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0,0,0,0.3);
  padding: 1rem 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-subtle);
}

.pulse-svg { width: 80px; height: 30px; }
.pulse-line {
  fill: none;
  stroke: var(--success);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: pulse-draw 3s linear infinite;
}

@keyframes pulse-draw {
  from { stroke-dashoffset: 200; }
  to { stroke-dashoffset: 0; }
}

.integrity-details { display: flex; flex-direction: column; }
.integrity-details .label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.integrity-details .status { font-size: 0.9rem; font-weight: 950; color: var(--success); }

/* Metrics Matrix */
.metrics-matrix {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.metric-node {
  padding: 2rem !important;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.node-icon {
  width: 54px; height: 54px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

.node-info { flex: 1; }
.node-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.node-val-row { display: flex; align-items: baseline; gap: 1rem; margin-top: 8px; }
.node-val-row .val { font-size: 2.5rem; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.05em; }

.momentum {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 900;
}
.momentum.up { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.momentum.stable { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }
.m-icon { font-size: 0.6rem; }

.node-pulse-bar { height: 4px; background: rgba(0,0,0,0.3); border-radius: 100px; overflow: hidden; }
.pulse-fill { height: 100%; transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1); }

/* Activity Hubs */
.activity-hub-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2.5rem;
}

.hub-node {
  padding: 2.5rem !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hub-header { display: flex; justify-content: space-between; align-items: center; }
.h-title { display: flex; align-items: center; gap: 1rem; }
.h-icon { font-size: 1.5rem; }
.h-title h3 { font-size: 1.25rem; font-weight: 850; color: white; }

.nav-btn-mini {
  padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted); font-size: 0.75rem; font-weight: 800;
  cursor: pointer; transition: all 0.2s;
}
.nav-btn-mini:hover { color: white; border-color: var(--primary); background: var(--bg-elevated); }

.hub-inventory-wheel { display: flex; flex-direction: column; gap: 0.75rem; }
.inventory-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem; background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-subtle); border-radius: 18px;
  transition: all 0.3s;
}
.inventory-item:hover { transform: translateX(8px); background: rgba(255,255,255,0.05); border-color: var(--primary); }

.i-core { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.i-title { font-size: 0.95rem; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
.i-meta { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); opacity: 0.6; }

.i-status {
  padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 900;
  background: rgba(148, 163, 184, 0.1); color: var(--text-muted); margin: 0 1.5rem;
}
.i-status.live { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.i-date { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); font-family: monospace; }

.talent-pipeline-stack { display: flex; flex-direction: column; gap: 1rem; }
.pipeline-card {
  display: flex; align-items: center; gap: 1.25rem;
  padding: 1.25rem; background: var(--bg-surface); border: 1px solid var(--border-subtle);
  border-radius: 20px; transition: all 0.3s;
}
.pipeline-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

.p-avatar {
  width: 44px; height: 44px; background: var(--primary-gradient);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  font-weight: 900; color: white; font-size: 1.2rem;
}

.p-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.p-name { font-size: 0.95rem; font-weight: 800; color: white; }
.p-role { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }

.p-status-pill {
  padding: 4px 12px; border-radius: 100px; font-size: 0.6rem; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.05em; background: rgba(255,255,255,0.05); color: var(--text-secondary);
}
.p-status-pill.selected { background: rgba(16, 185, 129, 0.1); color: var(--success); }

/* Infrastructure Footer */
.infrastructure-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.showcase-highlight {
  padding: 0 !important;
  display: flex;
  overflow: hidden;
  height: 200px;
}

.h-context { flex: 1.5; padding: 2rem; display: flex; flex-direction: column; justify-content: center; gap: 0.75rem; }
.h-context .pre { font-size: 0.65rem; font-weight: 900; color: var(--primary); letter-spacing: 0.15em; }
.h-context h4 { font-size: 1.25rem; font-weight: 850; color: white; margin: 0; }

.h-visual { flex: 1; position: relative; background: #000; }
.h-visual img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
.vid-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: #111; }

.h-action {
  position: absolute; bottom: 1.5rem; left: 2rem;
}
.h-action button {
  background: transparent; border: none; color: white; font-weight: 800; font-size: 0.85rem;
  cursor: pointer; padding: 0; transition: color 0.2s;
}
.h-action button:hover { color: var(--primary); }

.maintenance-cluster { padding: 2rem !important; }
.cluster-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 100%; }
.cluster-tool {
  background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 18px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; cursor: pointer; transition: all 0.2s;
}
.cluster-tool:hover { background: var(--bg-elevated); border-color: var(--primary); transform: scale(1.02); }
.cluster-tool .t-icon { font-size: 1.2rem; }
.cluster-tool span:not(.t-icon) { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }

.empty-hub { padding: 3rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; opacity: 0.5; }

@media (max-width: 1200px) {
  .activity-hub-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 1024px) {
  .metrics-matrix {
    grid-template-columns: repeat(2, 1fr);
  }
  .infrastructure-footer {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .metrics-matrix {
    grid-template-columns: 1fr;
  }
  .metric-node {
    padding: 1.5rem !important;
  }
  .hub-node {
    padding: 1.5rem !important;
  }
  .inventory-item {
    padding: 0.75rem 1rem;
  }
  .i-title {
    max-width: 150px;
  }
  .i-status {
    margin: 0 0.5rem;
  }
  .showcase-highlight {
    flex-direction: column;
    height: auto;
  }
  .h-visual {
    height: 200px;
  }
  .h-action {
    position: static;
    padding: 0 0 1.5rem 1.5rem;
  }
}
</style>
