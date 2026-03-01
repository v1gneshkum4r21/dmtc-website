<template>
  <div class="services-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag" :style="{ backgroundColor: selectedPageInfo.color + '20', color: selectedPageInfo.color }">
            {{ selectedPageInfo.sub }}
          </span>
        </div>
        <h1>{{ selectedPageLabel }} <span class="text-gradient-primary">Intelligence</span></h1>
        <p>Provisioning cognitive architectural data for the {{ selectedPageLabel }} node.</p>
      </div>
      
      <div class="header-actions">
        <div class="filter-cluster-glass">
          <div class="search-vessel">
            <span class="search-icon">🔍</span>
            <input v-model="localQuery" type="text" placeholder="Filter insights..." class="search-input-mini">
          </div>
          <div class="density-toggles">
            <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }" class="toggle-btn">
              <span>⊞</span>
            </button>
            <button @click="viewMode = 'table'" :class="{ active: viewMode === 'table' }" class="toggle-btn">
              <span>≡</span>
            </button>
          </div>
        </div>
        <div class="actions-wrapper">
          <button v-if="selectedPage" class="btn-ghost" @click="$emit('configure-page')">
            <span class="icon">⚙️</span>
            Configure Page
          </button>
          <button class="btn-primary-luxe" @click="$emit('create')">
            <span class="plus-glyph">+</span>
            <span class="btn-text">Provision Node</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Metrics Matrix -->
    <div class="metrics-row">
      <div class="metric-pill">
        <span class="val">{{ insights.length }}</span>
        <span class="label">Total Insights</span>
      </div>
      <div class="metric-pill">
        <span class="val success">{{ publishedCount }}</span>
        <span class="label">Broadcast Active</span>
      </div>
      <div class="metric-pill">
        <span class="val warning">{{ insights.length - publishedCount }}</span>
        <span class="label">Encrypted Drafts</span>
      </div>
    </div>

    <!-- Main Viewport -->
    <div v-if="loading" class="intelligence-shimmer">
      <div v-for="n in 3" :key="n" class="shimmer-card"></div>
    </div>

    <div v-else-if="filteredInsights.length === 0" class="empty-intelligence card-premium">
      <div class="empty-glyph">🔭</div>
      <h3>No insights identified</h3>
      <p>The neural grid returned no matches for your current query.</p>
      <button class="btn-ghost" @click="localQuery = ''">Reset Search</button>
    </div>

    <!-- High-Fidelity Grid -->
    <div v-else-if="viewMode === 'grid'" class="intelligence-grid">
      <div v-for="insight in filteredInsights" :key="insight._id" class="intelligence-card card-premium" :class="{ draft: !insight.published }">
        <div class="card-aura"></div>
        <div class="card-status-pip" :class="insight.published ? 'online' : 'staged'">
          {{ insight.published ? 'ONLINE' : 'STAGED' }}
        </div>
        
        <div class="card-body">
          <div class="card-domain">{{ insight.page || 'SERVICES' }}</div>
          <h3 class="card-title">{{ insight.title }}</h3>
          <p class="card-excerpt">{{ insight.excerpt }}</p>
          
          <div class="card-footer-strata">
            <div class="author-vessel">
              <div class="avatar-mini">{{ (insight.author || 'A').charAt(0) }}</div>
              <span class="name">{{ insight.author || 'ROOT' }}</span>
            </div>
            <div class="node-actions">
              <button class="node-btn" @click="$emit('edit', insight)" title="Edit Logic">✎</button>
              <button class="node-btn delete" @click="$emit('delete', insight._id)" title="Purge Data">🗑</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Futuristic Table -->
    <div v-else class="intelligence-table-vessel card-premium">
      <table class="futuristic-table">
        <thead>
          <tr>
            <th>Insight Signature</th>
            <th>Neural Node</th>
            <th>Broadcast Status</th>
            <th>Lead Analyst</th>
            <th>Last Sequence</th>
            <th class="text-right">Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="insight in filteredInsights" :key="insight._id">
            <td class="col-main">
              <span class="primary-text">{{ insight.title }}</span>
              <span class="secondary-text">{{ insight.excerpt.slice(0, 50) }}...</span>
            </td>
            <td><span class="domain-tag">{{ insight.page || 'GENERAL' }}</span></td>
            <td>
              <div class="status-indicator" :class="insight.published ? 'online' : 'staged'">
                <span class="glow-dot"></span>
                {{ insight.published ? 'Broadcast' : 'Encrypted' }}
              </div>
            </td>
            <td><span class="operator-id">{{ insight.author || 'ADMIN' }}</span></td>
            <td><span class="delta-time">{{ formatDate(insight.updatedAt) }}</span></td>
            <td class="text-right">
              <div class="ops-cluster">
                <button class="ops-btn" @click="$emit('edit', insight)">✎</button>
                <button class="ops-btn delete" @click="$emit('delete', insight._id)">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  insights: { type: Array, required: true },
  selectedPage: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const viewMode = ref('grid')
const localQuery = ref('')

const publishedCount = computed(() => props.insights.filter(i => i.published).length)

const selectedPageInfo = computed(() => {
  const defaults = {
    'ai-work': { label: 'ai for work', sub: 'Workspace Intelligence', color: '#6366f1' },
    'ai-service': { label: 'ai for service', sub: 'Customer Experience', color: '#10b981' },
    'ai-enterprise': { label: 'ai for enterprice', sub: 'Scale Solutions', color: '#a855f7' },
    'echo-ai': { label: 'echoai', sub: 'Voice Framework', color: '#f59e0b' },
    'superfiitter': { label: 'superfitter', sub: 'Fashion Intelligence', color: '#ec4899' }
  }
  return defaults[props.selectedPage] || { label: 'Network wide', sub: 'Global Inventory', color: '#94a3b8' }
})

const selectedPageLabel = computed(() => selectedPageInfo.value.label)

const filteredInsights = computed(() => {
  let list = props.insights
  if (localQuery.value) {
    const q = localQuery.value.toLowerCase()
    list = list.filter(i => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q))
  }
  return [...list].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

const formatDate = (ds) => new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })

defineEmits(['create', 'edit', 'delete'])
</script>

<style scoped>
.services-manager {
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

.filter-cluster-glass {
  display: flex; align-items: center; gap: 1rem;
  background: var(--glass-light); padding: 6px; border-radius: 18px;
  border: 1px solid var(--border-subtle);
}

.search-vessel { display: flex; align-items: center; gap: 10px; padding: 0 1rem; }
.search-icon { font-size: 0.9rem; opacity: 0.5; }
.search-input-mini {
  background: transparent; border: none; color: white;
  font-size: 0.85rem; font-weight: 600; width: 140px; outline: none;
}

.density-toggles { display: flex; gap: 4px; padding-left: 10px; border-left: 1px solid var(--border-subtle); }
.toggle-btn {
  width: 34px; height: 34px; border: none; background: transparent;
  color: var(--text-muted); border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.toggle-btn.active { background: var(--bg-elevated); color: white; box-shadow: var(--shadow-sm); }


/* Metrics Row */
.metrics-row { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; }
.metric-pill { display: flex; align-items: baseline; gap: 10px; }
.metric-pill .val { font-size: 1.8rem; font-weight: 900; color: white; }
.metric-pill .val.success { color: var(--success); }
.metric-pill .val.warning { color: var(--warning); }
.metric-pill .label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* Intelligence Grid */
.intelligence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
}

.intelligence-card {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.intelligence-card:hover { transform: translateY(-8px); border-color: var(--primary); }

.card-aura {
  position: absolute; top: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.05), transparent);
  pointer-events: none;
}

.card-status-pip {
  position: absolute; top: 1.5rem; right: 1.5rem; padding: 3px 10px;
  border-radius: 6px; font-size: 0.6rem; font-weight: 900;
}
.card-status-pip.online { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.card-status-pip.staged { background: rgba(0,0,0,0.3); color: var(--text-muted); border: 1px solid var(--border-subtle); }

.card-body { padding: 2.5rem; flex: 1; display: flex; flex-direction: column; }
.card-domain { font-size: 0.65rem; font-weight: 900; color: var(--primary); letter-spacing: 0.15em; margin-bottom: 1rem; }
.card-title { font-size: 1.4rem; font-weight: 850; color: white; margin-bottom: 1rem; line-height: 1.3; }
.card-excerpt { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; flex: 1; }

.card-footer-strata {
  padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);
  display: flex; justify-content: space-between; align-items: center;
}

.author-vessel { display: flex; align-items: center; gap: 10px; }
.avatar-mini {
  width: 28px; height: 28px; border-radius: 50%; background: var(--bg-surface);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 900; color: var(--primary); border: 1px solid var(--border-subtle);
}
.author-vessel .name { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }

.node-actions { display: flex; gap: 8px; }
.node-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted); cursor: pointer; transition: all 0.2s;
}
.node-btn:hover { color: white; border-color: white; background: var(--bg-elevated); }
.node-btn.delete:hover { border-color: var(--error); color: var(--error); background: rgba(239, 68, 68, 0.1); }

/* Table Vibe */
.intelligence-table-vessel { padding: 1rem !important; }
.futuristic-table { width: 100%; border-collapse: collapse; }
.futuristic-table th {
  padding: 1.5rem; text-align: left; font-size: 0.7rem; font-weight: 900;
  color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-medium);
}
.futuristic-table td { padding: 1.5rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
.futuristic-table tr:hover { background: rgba(255,255,255,0.02); }

.col-main { max-width: 400px; }
.primary-text { display: block; font-size: 0.95rem; font-weight: 800; color: white; margin-bottom: 4px; }
.secondary-text { font-size: 0.75rem; color: var(--text-muted); }

.domain-tag {
  font-size: 0.65rem; font-weight: 800; color: var(--text-secondary);
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  padding: 4px 10px; border-radius: 6px; text-transform: uppercase;
}

.status-indicator { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 700; }
.glow-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-indicator.online { color: var(--success); }
.status-indicator.online .glow-dot { background: var(--success); box-shadow: 0 0 12px var(--success); }
.status-indicator.staged { color: var(--text-muted); }
.status-indicator.staged .glow-dot { background: var(--text-muted); }

.ops-cluster { display: flex; gap: 10px; justify-content: flex-end; }
.ops-btn {
  width: 38px; height: 38px; border-radius: 12px; border: 1px solid var(--border-subtle);
  background: var(--bg-elevated); color: white; cursor: pointer; transition: all 0.2s;
}
.ops-btn.delete:hover { background: var(--error); border-color: var(--error); }

.empty-intelligence { padding: 5rem !important; text-align: center; }
.empty-glyph { font-size: 4rem; margin-bottom: 2rem; opacity: 0.2; }

@media (max-width: 1024px) {
  .intelligence-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .filter-cluster-glass, .actions-wrapper {
    width: 100%;
    justify-content: space-between;
  }
  .search-input-mini {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .metrics-row {
    flex-direction: column;
    gap: 1rem;
  }
  .metric-pill .val {
    font-size: 1.4rem;
  }
  .card-body {
    padding: 1.5rem;
  }
  .intelligence-table-vessel {
    overflow-x: auto;
  }
  .actions-wrapper {
    flex-direction: column;
  }
  .actions-wrapper button {
    width: 100%;
  }
}
</style>
