<template>
  <div class="careers-audit-page">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">IMMUTABLE_LEDGER</span>
        </div>
        <h1>Intelligence <span class="text-gradient-primary">Audit Log</span></h1>
        <p>Full cryptographically-tracked immutable record of all candidate interactions.</p>
      </div>
      
      <div class="header-actions">
        <div class="sync-indicator">
          <span class="pulsating-dot"></span>
          <span class="label">LEDGER_SYNCED</span>
        </div>
      </div>
    </header>

    <div class="audit-synapse-mesh">
      <div v-for="app in sortedApplications" :key="app._id" class="audit-node-wrapper">
        <div class="audit-node card-premium" :class="{ expanded: app.showAudit }" @click="app.showAudit = !app.showAudit">
          <div class="node-main-strata">
            <div class="node-identity">
              <div class="avatar-quantum">
                {{ app.name.charAt(0) }}
                <div class="avatar-ring"></div>
              </div>
              <div class="identity-meta">
                <span class="name">{{ app.name }}</span>
                <span class="role text-muted">{{ app.role }}</span>
              </div>
            </div>
            
            <div class="node-status-vessel">
              <span class="status-label">CURRENT_STATE</span>
              <div :class="['status-pip', app.isDeleted ? 'deleted' : app.status.toLowerCase().replace(' ', '-')]">
                {{ app.isDeleted ? 'PURGED' : app.status.toUpperCase() }}
              </div>
            </div>

            <div class="node-metrics">
              <div class="metric-item">
                <span class="m-label">Last Delta</span>
                <span class="m-val">{{ formatRelativeTime(app.updatedAt || app.createdAt) }}</span>
              </div>
            </div>

            <div class="node-expansive-toggle">
              <span class="chevron" :class="{ open: app.showAudit }">▼</span>
            </div>
          </div>

          <transition name="quantum-expand">
            <div v-if="app.showAudit" class="node-ledger-expansion">
              <div class="ledger-spine"></div>
              <div class="ledger-track">
                <div v-for="(entry, idx) in app.history" :key="idx" class="ledger-entry">
                  <div class="entry-node"></div>
                  <div class="entry-content-box">
                    <div class="entry-meta">
                      <span class="entry-time">{{ formatDate(entry.timestamp) }}</span>
                      <span class="entry-signature">SIGNATURE_VALIDATED</span>
                    </div>
                    <div class="entry-action-badge">{{ entry.status }}</div>
                    <p v-if="entry.note" class="entry-note">{{ entry.note }}</p>
                  </div>
                </div>
                
                <!-- Origin Node -->
                <div class="ledger-entry origin">
                  <div class="entry-node origin"></div>
                  <div class="entry-content-box">
                    <div class="entry-meta">
                      <span class="entry-time">{{ formatDate(app.createdAt) }}</span>
                      <span class="entry-signature">ORIGIN_PROTOCOL</span>
                    </div>
                    <div class="entry-action-badge origin">Initial Submission Received</div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  applications: { type: Array, required: true }
})

const sortedApplications = computed(() => {
  return [...props.applications].sort((a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

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
.careers-audit-page {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}


.sync-indicator {
  display: flex; align-items: center; gap: 10px;
  background: var(--glass-light); padding: 8px 1.5rem; border-radius: 100px;
  border: 1px solid var(--border-subtle);
}
.pulsating-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px var(--success); animation: pulseDot 2s infinite; }
.sync-indicator .label { font-size: 0.65rem; font-weight: 850; color: var(--text-muted); letter-spacing: 0.1em; }

@keyframes pulseDot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.audit-synapse-mesh { display: flex; flex-direction: column; gap: 1.25rem; }

.audit-node {
  padding: 0 !important;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.audit-node:hover { transform: scale(1.005); border-color: var(--primary); }
.audit-node.expanded { border-color: var(--primary); background: var(--bg-surface) !important; }

.node-main-strata {
  padding: 1.5rem 2.5rem;
  display: grid;
  grid-template-columns: 320px 200px 1fr 60px;
  align-items: center;
}

.node-identity { display: flex; align-items: center; gap: 1.25rem; }
.avatar-quantum {
  width: 44px; height: 44px; background: var(--bg-surface); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 950; color: var(--primary); position: relative; border: 1px solid var(--border-subtle);
}
.avatar-ring { position: absolute; inset: -3px; border-radius: 15px; border: 1.5px solid var(--primary); opacity: 0.15; }

.identity-meta { display: flex; flex-direction: column; }
.identity-meta .name { font-size: 1rem; font-weight: 850; color: white; margin-bottom: 2px; }
.identity-meta .role { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em; }

.node-status-vessel { display: flex; flex-direction: column; gap: 6px; }
.status-label { font-size: 0.6rem; font-weight: 950; color: var(--text-muted); letter-spacing: 0.1em; }
.status-pip {
  font-size: 0.65rem; font-weight: 900; padding: 4px 12px; border-radius: 6px;
  display: inline-block; width: fit-content; text-transform: uppercase;
}
.status-pip.applied { background: rgba(99,102,241,0.1); color: var(--primary); }
.status-pip.selected { background: rgba(16,185,129,0.1); color: var(--success); }
.status-pip.rejected { background: rgba(239,68,68,0.1); color: var(--error); }
.status-pip.deleted { background: rgba(239,68,68,0.2); color: var(--error); border: 1px solid rgba(239,68,68,0.3); }

.node-metrics { display: flex; gap: 2rem; }
.metric-item { display: flex; flex-direction: column; gap: 4px; }
.m-label { font-size: 0.6rem; font-weight: 850; color: var(--text-muted); text-transform: uppercase; }
.m-val { font-size: 0.85rem; font-weight: 700; color: white; }

.node-expansive-toggle { display: flex; justify-content: flex-end; }
.chevron { font-size: 0.7rem; color: var(--text-muted); transition: 0.3s; }
.chevron.open { transform: rotate(180deg); color: var(--primary); }

.node-ledger-expansion {
  background: rgba(0,0,0,0.3);
  border-top: 1px solid var(--border-subtle);
  padding: 3rem 4rem 4rem 6rem;
  position: relative;
}

.ledger-spine {
  position: absolute; left: 3.5rem; top: 3.5rem; bottom: 4.5rem;
  width: 1px; background: linear-gradient(180deg, var(--primary), transparent);
}

.ledger-track { display: flex; flex-direction: column; gap: 3rem; }

.ledger-entry { position: relative; }
.entry-node {
  position: absolute; left: -2.85rem; top: 10px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--bg-surface); border: 2.5px solid var(--primary);
  box-shadow: 0 0 10px var(--primary); z-index: 2;
}

.entry-node.origin { border-color: #52525b; box-shadow: none; }

.entry-content-box {
  background: var(--glass-light); border: 1px solid var(--border-subtle);
  padding: 1.5rem 2rem; border-radius: 20px; position: relative;
}

.entry-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.entry-time { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
.entry-signature { font-size: 0.55rem; font-weight: 950; color: var(--primary); letter-spacing: 0.15em; border: 1px solid rgba(99, 102, 241, 0.2); padding: 3px 8px; border-radius: 4px; }

.entry-action-badge {
  font-size: 0.95rem; font-weight: 900; color: white; margin-bottom: 8px;
}
.entry-action-badge.origin { color: var(--text-secondary); opacity: 0.7; }

.entry-note { font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); }

.quantum-expand-enter-active, .quantum-expand-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); max-height: 2000px; }
.quantum-expand-enter-from, .quantum-expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-10px); }
</style>
