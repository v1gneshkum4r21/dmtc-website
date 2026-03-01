<template>
  <div class="resources-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag" :style="{ color: '#2563eb' }">KNOWLEDGE HUB</span>
        </div>
        <h1>System <span class="text-gradient-primary">Resources</span></h1>
        <p>Orchestrating the intellectual capital and strategic insights across the DREAMATIC network.</p>
      </div>

      <div class="header-actions">
        <div class="actions-wrapper">
          <button v-if="selectedPage" class="btn-ghost" @click="$emit('configure-page', selectedPage)">
            <span class="icon">⚙️</span>
            Architect {{ selectedPageLabel }}
          </button>
          <button class="btn-primary-luxe" @click="$emit('create')">
            + New Insight Node
          </button>
        </div>
      </div>
    </header>

    <!-- Resources Navigation Synapse -->
    <div class="resource-synapse">
      <div 
        v-for="tab in resourceTabs" 
        :key="tab.id"
        class="synapse-tab"
        :class="{ active: selectedPage === tab.id }"
        @click="$emit('switch-tab', tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <div class="tab-meta">
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-sub">{{ tab.sub }}</span>
        </div>
        <div class="tab-pulse" v-if="selectedPage === tab.id"></div>
      </div>
    </div>

    <!-- Active Viewport -->
    <div class="resources-viewport">
      <div v-if="loading" class="quantum-loader-vessel">
        <div class="pulse-ring"></div>
        <p>Synchronizing Knowledge Grid...</p>
      </div>

      <div v-else class="content-grid">
        <!-- Summary Matrix -->
        <div class="matrix-row">
          <div class="matrix-card">
            <span class="m-label">Active Nodes</span>
            <span class="m-val">{{ filteredItems.length }}</span>
          </div>
          <div class="matrix-card">
            <span class="m-label">Intelligence Units</span>
            <span class="m-val">34</span>
          </div>
          <div class="matrix-card">
            <span class="m-label">Sync Pulse</span>
            <span class="m-success">STABLE</span>
          </div>
        </div>

        <!-- Insights List -->
        <div class="insights-ledger card-premium">
          <div class="ledger-header">
            <h3>{{ selectedPageLabel }} Information Ledger</h3>
            <div class="ledger-search">
              <input type="text" placeholder="Filter nodes..." class="search-mini">
            </div>
          </div>

          <div class="ledger-table-wrap">
            <table class="ledger-table">
              <thead>
                <tr>
                  <th>Node Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Modified</th>
                  <th class="actions-cell">Protocols</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItems" :key="item._id" class="ledger-row">
                  <td>
                    <div class="node-info">
                      <div class="node-image" :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
                      <span class="node-title">{{ item.title }}</span>
                    </div>
                  </td>
                  <td><span class="node-meta">{{ selectedPage === 'research' ? (item.journal || 'Research Lab') : item.author }}</span></td>
                  <td>
                    <span :class="['status-badge', item.published ? 'active' : 'draft']">
                      {{ item.published ? 'LIVE' : 'DRAFT' }}
                    </span>
                  </td>
                  <td><span class="node-meta">{{ new Date(item.updatedAt).toLocaleDateString() }}</span></td>
                  <td class="actions-cell">
                    <div class="action-synapse">
                      <button class="btn-action" @click="$emit('edit', item)" title="Modify Protocol">✎</button>
                      <button class="btn-action danger" @click="$emit('delete', item._id)" title="Purge Node">✕</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredItems.length === 0">
                  <td colspan="5" class="empty-ledger">
                    No active intelligence nodes found in this sector.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  insights: { type: Array, default: () => [] },
  research: { type: Array, default: () => [] },
  selectedPage: { type: String, default: 'hub' },
  loading: { type: Boolean, default: false }
})

defineEmits(['switch-tab', 'edit', 'delete', 'create', 'configure-page'])

const resourceTabs = [
  { id: 'hub', label: 'Knowledge Hub', sub: 'Unified Landing', icon: '🏛️' },
  { id: 'blog', label: 'Agentic Blog', sub: 'Industry Insights', icon: '✍️' },
  { id: 'research', label: 'Research Lab', sub: 'Foundational Science', icon: '🔬' }
]

const selectedPageLabel = computed(() => {
  return resourceTabs.find(t => t.id === props.selectedPage)?.label || 'Sector'
})

const filteredItems = computed(() => {
  if (props.selectedPage === 'research') {
    return props.research
  }
  return props.insights.filter(i => i.page === props.selectedPage)
})
</script>

<style scoped>
.resources-manager {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.resource-synapse {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.02);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.03);
}

.synapse-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.synapse-tab:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.synapse-tab.active {
  background: rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.25);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.tab-icon { font-size: 1.5rem; }
.tab-label { display: block; font-size: 0.9rem; font-weight: 800; color: white; margin-bottom: 2px; }
.tab-sub { font-size: 0.65rem; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; }

.tab-pulse {
  position: absolute;
  top: 10px; right: 10px;
  width: 6px; height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px #3b82f6;
  animation: tabBlink 2s infinite;
}

@keyframes tabBlink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.matrix-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
.matrix-card {
  padding: 1.5rem; background: rgba(255,255,255,0.02); 
  border: 1px solid rgba(255,255,255,0.05); border-radius: 16px;
  display: flex; flex-direction: column; gap: 8px;
}
.m-label { font-size: 0.6rem; font-weight: 950; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; }
.m-val { font-size: 1.5rem; font-weight: 900; color: white; }
.m-success { color: #22c55e; font-size: 1.1rem; font-weight: 900; }

/* Table Styles */
.insights-ledger { padding: 0 !important; overflow: hidden; }
.ledger-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
.ledger-header h3 { font-size: 1rem; font-weight: 800; color: white; margin: 0; }
.search-mini { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.5rem 1rem; color: white; font-size: 0.8rem; width: 240px; }

.ledger-table-wrap { overflow-x: auto; }
.ledger-table { width: 100%; border-collapse: collapse; }
.ledger-table th { text-align: left; padding: 1.25rem 2rem; font-size: 0.65rem; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(255,255,255,0.01); }
.ledger-table td { padding: 1.25rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.03); }

.node-info { display: flex; align-items: center; gap: 1rem; }
.node-image { width: 44px; height: 32px; border-radius: 6px; background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.05); }
.node-title { font-size: 0.9rem; font-weight: 700; color: white; }
.node-meta { font-size: 0.8rem; font-weight: 600; color: #71717a; }

.status-badge { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 100px; }
.status-badge.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.status-badge.draft { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }

.action-synapse { display: flex; gap: 8px; }
.btn-action { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #a1a1aa; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-action:hover { background: rgba(255,255,255,0.05); color: white; border-color: rgba(255,255,255,0.1); }
.btn-action.danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }

.empty-ledger { padding: 4rem !important; text-align: center; color: #52525b; font-size: 0.9rem; font-weight: 600; }

/* Heavy Loader */
.quantum-loader-vessel { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8rem 2rem; gap: 2rem; color: #52525b; font-size: 0.9rem; font-weight: 700; }
.pulse-ring { width: 50px; height: 50px; border: 3px solid #3b82f6; border-radius: 50%; animation: ripple 1.5s infinite ease-out; }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
</style>
