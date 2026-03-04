<template>
  <div class="careers-applications-page">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">CANDIDATE_MESH</span>
        </div>
        <h1>Candidate <span class="text-gradient-primary">Intelligence</span></h1>
        <p>Orchestrating the recruitment flow for the global neural network.</p>
      </div>
      
      <div class="header-actions">
        <div class="filter-cluster-glass">
          <div class="flow-nexus">
            <button 
              v-for="s in statuses" 
              :key="s" 
              class="nexus-btn"
              :class="{ active: statusFilter === s }"
              @click="statusFilter = s"
            >
              {{ s }}
            </button>
          </div>
          <div class="density-toggles">
            <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }" class="toggle-btn">
              <span>⊞</span>
            </button>
            <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }" class="toggle-btn">
              <span>≡</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Metrics Matrix -->
    <div class="metrics-row">
      <div class="metric-pill">
        <span class="val">{{ totalApplications }}</span>
        <span class="label">Total Nodes</span>
      </div>
      <div class="metric-pill">
        <span class="val success">{{ selectedCount }}</span>
        <span class="label">Admitted</span>
      </div>
      <div class="metric-pill">
        <span class="val warning">{{ waitingCount }}</span>
        <span class="label">In Queue</span>
      </div>
    </div>

    <div v-if="filteredApplications.length === 0" class="empty-intelligence card-premium">
      <div class="empty-glyph">👥</div>
      <h3>No Candidate Nodes Found</h3>
      <p>The mesh returned no matching data for the selected flow state.</p>
      <button class="btn-ghost" @click="statusFilter = 'All'">Reset Nexus Filter</button>
    </div>

    <!-- High-Fidelity Grid -->
    <div v-else :class="['mesh-view', viewMode]">
      <div 
        v-for="app in filteredApplications" 
        :key="app._id" 
        class="candidate-node card-premium"
        :class="{ 'purged-node': app.isDeleted }"
        @click="$emit('preview', app)"
      >
        <div class="node-aura"></div>
        <div class="status-marker" :class="app.isDeleted ? 'deleted' : app.status.toLowerCase().replace(' ', '-')">
          {{ app.isDeleted ? 'PURGED_DRAFT' : app.status.toUpperCase() }}
        </div>

        <div class="node-header">
          <div class="avatar-quantum">
            <span class="glyph">{{ app.name.charAt(0) }}</span>
            <div class="avatar-ring"></div>
          </div>
          <div class="node-identity">
            <h3>{{ app.name }}</h3>
            <p class="designation-tag">{{ app.role }}</p>
          </div>
        </div>

        <div class="node-strata">
          <div class="strata-item">
            <label>EXPERIENCE_LOG</label>
            <span>{{ formatExperience(app.experience) }}</span>
          </div>
          <div class="strata-item">
            <label>CONTACT_PAYLOAD</label>
            <span>{{ app.email }}</span>
          </div>
          <div class="strata-item">
            <label>HUB_LOC</label>
            <span>{{ app.location }}</span>
          </div>
          <div class="strata-item">
            <label>SALARY_SPEC</label>
            <span>{{ app.salary || 'N/A' }}</span>
          </div>
        </div>

        <div class="node-actions-strata">
          <template v-if="!app.isDeleted">
            <button @click.stop="$emit('updateStatus', app._id, 'Selected')" class="node-btn admit">
              <span class="btn-icon">⚡</span> Admit
            </button>
            <button @click.stop="$emit('updateStatus', app._id, 'Waiting List')" class="node-btn-icon" title="Queue">
              ⏳
            </button>
            <button @click.stop="$emit('updateStatus', app._id, 'Rejected')" class="node-btn restrict">
              Restrict
            </button>
            <button @click.stop="$emit('delete', app._id)" class="node-btn-icon delete" title="Soft Purge">
              🗑
            </button>
          </template>
          <template v-else>
            <button @click.stop="$emit('restore', app._id)" class="node-btn restore">
              Restore Node
            </button>
            <button @click.stop="$emit('deletePermanent', app._id)" class="node-btn-icon purge-perm" title="Permanent Purge">
              ⚠️
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  applications: { type: Array, required: true },
  loading: Boolean
})

const emit = defineEmits(['preview', 'updateStatus', 'delete', 'restore', 'deletePermanent'])

const statusFilter = ref('All')
const viewMode = ref('grid')
const statuses = ['All', 'Applied', 'Selected', 'Waiting List', 'Rejected', 'Deleted']

const totalApplications = computed(() => props.applications.length)
const selectedCount = computed(() => props.applications.filter(a => a.status === 'Selected' && !a.isDeleted).length)
const waitingCount = computed(() => props.applications.filter(a => a.status === 'Waiting List' && !a.isDeleted).length)

const filteredApplications = computed(() => {
  if (statusFilter.value === 'Deleted') return props.applications.filter(app => app.isDeleted)
  let list = props.applications.filter(app => !app.isDeleted)
  if (statusFilter.value === 'All') return list
  return list.filter(app => app.status === statusFilter.value)
})

const formatExperience = (exp) => {
  const map = {
    'junior': 'Jr (0-2y)',
    'mid': 'Mid (3-5y)',
    'senior': 'Sr (5-8y)',
    'staff': 'Staff (8y+)'
  }
  return map[exp] || exp || 'N/A'
}
</script>

<style scoped>
.careers-applications-page {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}


.filter-cluster-glass {
  display: flex; align-items: center; gap: 1.5rem;
  background: var(--glass-light); padding: 6px; border-radius: 18px;
  border: 1px solid var(--border-subtle);
}

.flow-nexus { display: flex; gap: 4px; padding: 0 10px; }
.nexus-btn {
  padding: 8px 16px; border: none; background: transparent; color: var(--text-muted);
  font-size: 0.75rem; font-weight: 800; border-radius: 10px; cursor: pointer; transition: 0.2s;
}
.nexus-btn.active { background: var(--bg-elevated); color: white; box-shadow: var(--shadow-sm); }

.density-toggles { display: flex; gap: 4px; padding-left: 10px; border-left: 1px solid var(--border-subtle); }
.toggle-btn {
  width: 36px; height: 36px; border: none; background: transparent;
  color: var(--text-muted); border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.toggle-btn.active { background: var(--primary); color: white; box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3); }

/* Metrics Row */
.metrics-row { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; }
.metric-pill { display: flex; align-items: baseline; gap: 10px; }
.metric-pill .val { font-size: 1.8rem; font-weight: 900; color: white; }
.metric-pill .val.success { color: var(--success); }
.metric-pill .val.warning { color: var(--warning); }
.metric-pill .label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* Grid/List View */
.mesh-view.grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2.5rem;
}

.candidate-node {
  padding: 2.5rem !important;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
}

.candidate-node:hover { transform: translateY(-8px); border-color: var(--primary); }

.node-aura {
  position: absolute; top: 0; left: 0; right: 0; height: 120px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.05), transparent);
  pointer-events: none;
}

.status-marker {
  position: absolute; top: 1.5rem; right: 1.5rem;
  font-size: 0.55rem; font-weight: 950; padding: 4px 10px; border-radius: 6px;
  background: rgba(0,0,0,0.3); letter-spacing: 0.05em; border: 1px solid var(--border-subtle);
}
.status-marker.applied { color: var(--primary); border-color: rgba(99, 102, 241, 0.2); }
.status-marker.selected { color: var(--success); border-color: rgba(16, 185, 129, 0.2); }
.status-marker.rejected { color: var(--error); border-color: rgba(239, 68, 68, 0.2); }
.status-marker.deleted { background: rgba(239, 68, 68, 0.1); color: var(--error); border-color: var(--error); }

.node-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }

.avatar-quantum {
  width: 56px; height: 56px; background: var(--bg-surface); border-radius: 16px;
  display: flex; align-items: center; justify-content: center; position: relative;
  border: 1px solid var(--border-subtle);
}
.avatar-quantum .glyph { font-size: 1.25rem; font-weight: 950; color: var(--primary); z-index: 2; }
.avatar-ring {
  position: absolute; inset: -4px; border-radius: 20px;
  border: 2px solid var(--primary); opacity: 0.15;
}

.node-identity h3 { font-size: 1.3rem; font-weight: 850; color: white; margin-bottom: 4px; }
.designation-tag { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }

.node-strata {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 20px; margin-bottom: 2.5rem;
  border: 1px solid rgba(255,255,255,0.02);
}
.strata-item { display: flex; flex-direction: column; gap: 4px; }
.strata-item label { font-size: 0.6rem; font-weight: 950; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.strata-item span { font-size: 0.9rem; font-weight: 700; color: white; }

.node-actions-strata { display: flex; gap: 10px; align-items: center; }
.node-btn {
  flex: 1; padding: 12px; border-radius: 12px; border: none;
  font-size: 0.75rem; font-weight: 900; cursor: pointer; transition: all 0.3s;
  text-transform: uppercase; letter-spacing: 0.05em;
}

.node-btn.admit { background: var(--primary-gradient); color: white; box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2); }
.node-btn.admit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); }

.node-btn.restrict { background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border-subtle); }
.node-btn.restrict:hover { background: var(--error); color: white; border-color: var(--error); }

.node-btn.restore { background: var(--success); color: white; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2); }

.node-btn-icon {
  width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted); cursor: pointer; transition: 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.node-btn-icon:hover { color: white; background: var(--bg-elevated); }
.node-btn-icon.delete:hover { border-color: var(--error); color: var(--error); background: rgba(239, 68, 68, 0.1); }
.node-btn-icon.purge-perm { border-color: var(--error); color: var(--error); }

.purged-node { opacity: 0.6; filter: grayscale(0.6); }

/* List View Vibe */
.mesh-view.list { display: flex; flex-direction: column; gap: 1rem; }
.mesh-view.list .candidate-node { padding: 1.5rem 2.5rem !important; flex-direction: row; align-items: center; }
.mesh-view.list .node-header { margin-bottom: 0; min-width: 300px; }
.mesh-view.list .node-strata { margin-bottom: 0; padding: 0; background: transparent; border: none; flex: 1; margin: 0 3rem; }
.mesh-view.list .node-actions-strata { min-width: 300px; }
.mesh-view.list .status-marker { position: static; margin-left: auto; margin-right: 2rem; }

@media (max-width: 1024px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .header-actions {
    width: 100%;
  }
  .filter-cluster-glass {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
  .flow-nexus {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  .density-toggles {
    border-left: none;
    border-top: 1px solid var(--border-subtle);
    padding-top: 1rem;
    padding-left: 0;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .metrics-row {
    flex-direction: column;
    gap: 1rem;
  }
  .mesh-view.grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .candidate-node {
    padding: 1.5rem !important;
  }
  .node-header {
    margin-bottom: 1.5rem;
  }
  .node-strata {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .node-actions-strata {
    flex-wrap: wrap;
  }
  .node-btn {
    width: 100%;
    flex: none;
  }
  .mesh-view.list .candidate-node {
    flex-direction: column;
    align-items: flex-start;
  }
  .mesh-view.list .node-strata {
    margin: 1.5rem 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(0,0,0,0.1);
    padding: 1rem;
    border-radius: 12px;
  }
  .mesh-view.list .status-marker {
    margin: 0 0 1rem 0;
  }
}
</style>
