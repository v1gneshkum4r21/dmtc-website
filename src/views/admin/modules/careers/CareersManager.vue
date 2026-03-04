<template>
  <div class="careers-manager">
    <transition name="page-fade" mode="out-in">
      <!-- Dashboard Sub-Tab -->
      <div v-if="subTab === 'dashboard'" class="careers-dashboard-vibe">
        <header class="module-header luxury-page-title">
          <div class="header-vessel">
            <div class="section-context">
              <span class="context-tag">RECRUITMENT_OPS</span>
            </div>
            <h1>Talent <span class="text-gradient-primary">Orbit</span></h1>
            <p>Global intelligence overview of your recruitment infrastructure.</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary-luxe" @click="$emit('switch-tab', 'jds')">
              Manage Protocols
            </button>
          </div>
        </header>

        <div class="orbit-grid">
          <!-- Funnel Visualization -->
          <div class="funnel-card card-premium">
            <div class="card-aura"></div>
            <label class="section-label">Recruitment Funnel</label>
            <div class="funnel-visualization">
              <div class="funnel-stage" style="width: 100%;">
                <div class="stage-bar applied"></div>
                <div class="stage-info">
                  <span class="label">Applied</span>
                  <span class="val">{{ appliedCount }}</span>
                </div>
              </div>
              <div class="funnel-stage" :style="{ width: funnelWidths.waiting }">
                <div class="stage-bar waiting"></div>
                <div class="stage-info">
                  <span class="label">Waiting</span>
                  <span class="val">{{ waitingCount }}</span>
                </div>
              </div>
              <div class="funnel-stage" :style="{ width: funnelWidths.selected }">
                <div class="stage-bar selected"></div>
                <div class="stage-info">
                  <span class="label">Selected</span>
                  <span class="val">{{ selectedCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Roles Summary -->
          <div class="roles-summary card-premium">
            <div class="card-aura secondary"></div>
            <label class="section-label">Top Talent Magnets</label>
            <div class="roles-list">
              <div v-for="role in topRoles" :key="role.title" class="role-stat-item">
                <div class="role-info">
                  <span class="title">{{ role.title }}</span>
                  <span class="meta">{{ role.count }} Applicants</span>
                </div>
                <div class="role-progress">
                  <div class="progress-bar" :style="{ width: role.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Panel -->
          <div class="quick-ops-panel card-premium">
            <label class="section-label">Orbital Commands</label>
            <div class="ops-grid">
              <button class="op-card" @click="$emit('create')">
                <span class="icon">✨</span>
                <span class="text">New Protocol</span>
              </button>
              <button class="op-card" @click="$emit('configure-page', 'careers')">
                <span class="icon">⚙️</span>
                <span class="text">Page Config</span>
              </button>
              <button class="op-card" @click="$emit('switch-tab', 'applicants')">
                <span class="icon">👥</span>
                <span class="text">Scan Nodes</span>
              </button>
              <button class="op-card" @click="$emit('switch-tab', 'history')">
                <span class="icon">📜</span>
                <span class="text">Audit Ledger</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="recent-mesh-activity card-premium">
          <label class="section-label">Live Transmission Feed</label>
          <div class="activity-list" v-if="recentApplications.length > 0">
            <div v-for="app in recentApplications" :key="app._id" class="activity-node" @click="$emit('preview-app', app)">
              <div class="node-avatar">{{ app.name.charAt(0) }}</div>
              <div class="node-content">
                <p><strong>{{ app.name }}</strong> linked to <strong>{{ app.role }}</strong></p>
                <span class="time">{{ formatRelativeTime(app.createdAt) }}</span>
              </div>
              <div class="node-status-badge" :class="app.status.toLowerCase()">{{ app.status }}</div>
            </div>
          </div>
          <div v-else class="empty-state">No recent transmissions detected.</div>
        </div>
      </div>

      <CareersJDList 
        v-else-if="subTab === 'jds'"
        :jobs="jobs"
        :loading="loading"
        @create="$emit('create')"
        @edit="j => $emit('edit-job', j)"
        @archive="id => $emit('archive-job', id)"
        @delete="id => $emit('delete-job', id)"
        @restore="id => $emit('restore-job', id)"
        @configure-page="$emit('configure-page', 'careers')"
      />
      
      <CareersApplications 
        v-else-if="subTab === 'applicants'"
        :applications="applications"
        :loading="loading"
        @preview="a => $emit('preview-app', a)"
        @updateStatus="(id, s) => $emit('update-app-status', id, s)"
        @delete="id => $emit('delete-app', id)"
        @restore="id => $emit('restore-app', id)"
        @deletePermanent="id => $emit('delete-app-permanent', id)"
      />

      <CareersAuditLog 
        v-else-if="subTab === 'history'"
        :applications="applications"
      />
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CareersJDList from './CareersJDList.vue'
import CareersApplications from './CareersApplications.vue'
import CareersAuditLog from './CareersAuditLog.vue'

const props = defineProps({
  jobs: { type: Array, required: true },
  applications: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  subTab: { type: String, default: 'dashboard' } // Changed default to dashboard
})

const emit = defineEmits(['edit-job', 'archive-job', 'delete-job', 'restore-job', 'preview-app', 'update-app-status', 'delete-app', 'restore-app', 'delete-app-permanent', 'switch-tab', 'create', 'configure-page'])

// Dashboard Computations
const appliedCount = computed(() => props.applications.filter(a => !a.isDeleted).length)
const waitingCount = computed(() => props.applications.filter(a => a.status === 'Waiting List' && !a.isDeleted).length)
const selectedCount = computed(() => props.applications.filter(a => a.status === 'Selected' && !a.isDeleted).length)

const funnelWidths = computed(() => {
  const total = appliedCount.value || 1
  return {
    waiting: (waitingCount.value / total * 100 + 40) + '%',
    selected: (selectedCount.value / total * 100 + 20) + '%'
  }
})

const topRoles = computed(() => {
  const counts = {}
  props.applications.forEach(a => {
    if (a.isDeleted) return
    counts[a.role] = (counts[a.role] || 0) + 1
  })
  const totalApps = appliedCount.value || 1
  return Object.entries(counts)
    .map(([title, count]) => ({ title, count, percentage: (count / totalApps * 100) }))
    .sort((a,b) => b.count - a.count)
    .slice(0, 4)
})

const recentApplications = computed(() => {
  return [...props.applications]
    .filter(a => !a.isDeleted)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const formatRelativeTime = (ds) => {
  const diff = Date.now() - new Date(ds).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours/24)}d ago`
}
</script>

<style scoped>
.careers-manager {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-fade-enter-active, .page-fade-leave-active {
  transition: all 0.25s ease;
}
.page-fade-enter-from, .page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Dashboard Styles */
.orbit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.section-label {
  display: block; font-size: 0.65rem; font-weight: 950; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1.5rem;
}

/* Funnel */
.funnel-visualization {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.funnel-stage {
  position: relative; height: 40px; border-radius: 8px; overflow: hidden;
  background: rgba(255,255,255,0.03);
}
.stage-bar { position: absolute; inset: 0; opacity: 0.2; }
.stage-bar.applied { background: var(--primary); }
.stage-bar.waiting { background: var(--warning); }
.stage-bar.selected { background: var(--success); }

.stage-info {
  position: relative; z-index: 2; height: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 1.25rem;
}
.stage-info .label { font-size: 0.75rem; font-weight: 800; color: white; }
.stage-info .val { font-size: 0.9rem; font-weight: 950; color: white; }

/* Roles List */
.roles-list { display: flex; flex-direction: column; gap: 1.25rem; }
.role-stat-item { display: flex; flex-direction: column; gap: 6px; }
.role-info { display: flex; justify-content: space-between; align-items: baseline; }
.role-info .title { font-size: 0.85rem; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.role-info .meta { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); }

.role-progress { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
.role-progress .progress-bar { height: 100%; background: var(--primary-gradient); border-radius: 10px; }

/* Quick Ops */
.ops-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.op-card {
  padding: 1.5rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);
  border-radius: 16px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px;
  transition: all 0.2s;
}
.op-card:hover { background: var(--bg-elevated); border-color: var(--primary); transform: translateY(-3px); }
.op-card .icon { font-size: 1.25rem; }
.op-card .text { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; }

/* Recent Activity */
.recent-mesh-activity { padding: 2rem !important; }
.activity-list { display: flex; flex-direction: column; gap: 1rem; }
.activity-node {
  display: flex; align-items: center; gap: 1.25rem; padding: 1rem;
  background: rgba(0,0,0,0.1); border-radius: 14px; border: 1px solid transparent;
  cursor: pointer; transition: 0.2s;
}
.activity-node:hover { border-color: var(--border-subtle); background: rgba(255,255,255,0.02); }

.node-avatar {
  width: 36px; height: 36px; background: var(--bg-elevated); border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--primary);
  border: 1px solid var(--border-subtle);
}

.node-content { flex: 1; }
.node-content p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
.node-content p strong { color: white; }
.node-content .time { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); }

.node-status-badge {
  font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;
}
.node-status-badge.applied { color: var(--primary); background: rgba(99,102,241,0.1); }
.node-status-badge.selected { color: var(--success); background: rgba(16,185,129,0.1); }
.node-status-badge.rejected { color: var(--error); background: rgba(239,68,68,0.1); }

@media (max-width: 1200px) {
  .orbit-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .orbit-grid { grid-template-columns: 1fr; }
}
</style>
