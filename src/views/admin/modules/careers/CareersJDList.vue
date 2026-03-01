<template>
  <div class="careers-jd-page">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">RECRUITMENT_OPS</span>
        </div>
        <h1>Deployment <span class="text-gradient-primary">Protocols</span></h1>
        <p>Architecting targeted nodes in the global talent acquisition mesh.</p>
      </div>
      
      <div class="header-actions">
        <div class="actions-wrapper">
          <button class="btn-ghost" @click="$emit('configure-page')">
            <span class="icon">⚙️</span>
            Configure Page
          </button>
        </div>
        <div class="stats-glass-row">
          <div class="glass-pill">
            <span class="val">{{ activeJobsCount }}</span>
            <span class="label">Active Signals</span>
          </div>
          <div class="glass-pill">
            <span class="val secondary">{{ archivedJobsCount }}</span>
            <span class="label">Archived Cubes</span>
          </div>
        </div>
        <button class="btn-primary-luxe" @click="$emit('create')">
          <span class="plus-glyph">+</span>
          <span class="btn-text">Initialize Protocol</span>
        </button>
      </div>
    </header>

    <div v-if="loading && jobs.length === 0" class="quantum-loader-vessel">
      <div class="pulse-ring"></div>
      <p>Synchronizing Recruitment Grid...</p>
    </div>

    <div v-else-if="jobs.length === 0" class="empty-intelligence card-premium">
      <div class="empty-glyph">💼</div>
      <h3>No Active Protocols</h3>
      <p>Initialize a new recruitment sequence to begin talent acquisition.</p>
      <button class="btn-ghost" @click="$emit('create')">Provision First Node</button>
    </div>

    <div v-else class="protocol-grid">
      <div
        v-for="job in jobs"
        :key="job._id"
        class="protocol-card card-premium"
        :class="{ archived: job.isArchived }"
      >
        <div class="card-aura"></div>
        <div class="card-header-ops">
          <div class="type-capsule" :class="job.type.toLowerCase().replace(' ', '-')">
            {{ job.type }}
          </div>
          <div class="ops-cluster">
            <button class="op-btn" @click="$emit('edit', job)" title="Refine Protocol">✎</button>
            <button class="op-btn" @click="$emit('archive', job._id)" v-if="!job.isArchived" title="Deactivate Signal">📦</button>
            <button class="op-btn" @click="$emit('restore', job._id)" v-if="job.isArchived" title="Reactivate Signal">🔓</button>
            <button class="op-btn delete" @click="$emit('delete', job._id)" title="Terminate Protocol">🗑</button>
          </div>
        </div>
        
        <h3 class="protocol-title">{{ job.title }}</h3>
        
        <div class="protocol-meta-strata">
          <div class="meta-node">
            <span class="label">HUB_LOC</span>
            <span class="val">{{ job.location }}</span>
          </div>
          <div class="meta-node">
            <span class="label">SUB_SYS</span>
            <span class="val">{{ job.team }}</span>
          </div>
        </div>

        <div class="protocol-footer">
          <div class="status-indicator">
            <span class="glow-dot" :class="{ active: job.active && !job.isArchived }"></span>
            <span class="status-text">{{ job.isArchived ? 'OFFLINE' : (job.active ? 'SIGNAL_ACTIVE' : 'STAGED') }}</span>
          </div>
          <div v-if="job.isArchived" class="archive-glyph">ENCRYPTED_ARCHIVE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  jobs: { type: Array, required: true },
  loading: Boolean
})

const emit = defineEmits(['create', 'edit', 'archive', 'delete', 'restore', 'configure-page'])

const activeJobsCount = computed(() => props.jobs.filter(j => j.active && !j.isArchived).length)
const archivedJobsCount = computed(() => props.jobs.filter(j => j.isArchived).length)
</script>

<style scoped>
.careers-jd-page {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
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


.stats-glass-row { display: flex; gap: 1.5rem; margin-right: 2rem; }
.glass-pill {
  padding: 8px 1.5rem; background: var(--glass-light); border-radius: 100px;
  border: 1px solid var(--border-subtle); display: flex; align-items: baseline; gap: 10px;
}
.glass-pill .val { font-size: 1.25rem; font-weight: 950; color: white; }
.glass-pill .val.secondary { color: var(--text-muted); }
.glass-pill .label { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }


.protocol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2.5rem;
}

.protocol-card {
  padding: 2.5rem !important;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.protocol-card:hover { transform: translateY(-8px); border-color: var(--primary); }

.card-aura {
  position: absolute; top: 0; left: 0; right: 0; height: 120px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.05), transparent);
  pointer-events: none;
}

.card-header-ops {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
}

.type-capsule {
  font-size: 0.6rem; font-weight: 950; padding: 4px 12px;
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  color: var(--text-secondary); border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em;
}

.ops-cluster { display: flex; gap: 8px; }
.op-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted); cursor: pointer; transition: all 0.2s;
}
.op-btn:hover { color: white; border-color: white; background: var(--bg-elevated); }
.op-btn.delete:hover { border-color: var(--error); color: var(--error); background: rgba(239, 68, 68, 0.1); }

.protocol-title { font-size: 1.5rem; font-weight: 850; color: white; margin-bottom: 2rem; line-height: 1.3; }

.protocol-meta-strata {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem;
}
.meta-node { display: flex; flex-direction: column; gap: 4px; }
.meta-node .label { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.meta-node .val { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); }

.protocol-footer {
  padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);
  display: flex; justify-content: space-between; align-items: center;
}

.status-indicator { display: flex; align-items: center; gap: 10px; }
.glow-dot { width: 8px; height: 8px; border-radius: 50%; background: #27272a; }
.glow-dot.active { background: var(--success); box-shadow: 0 0 12px var(--success); animation: pulseDot 2s infinite; }
.status-text { font-size: 0.65rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.1em; }

.archive-glyph { font-size: 0.55rem; font-weight: 950; color: var(--error); letter-spacing: 0.05em; opacity: 0.6; }

.archived { opacity: 0.5; filter: grayscale(0.8); }
.archived:hover { filter: grayscale(0.4); opacity: 0.8; }

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

@keyframes pulseDot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

@media (max-width: 1024px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .stats-glass-row {
    margin-right: 0;
    width: 100%;
  }
  .glass-pill {
    flex: 1;
    justify-content: center;
  }
  .btn-primary-luxe {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .protocol-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .protocol-card {
    padding: 1.5rem !important;
  }
  .protocol-title {
    font-size: 1.3rem;
  }
  .stats-glass-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
