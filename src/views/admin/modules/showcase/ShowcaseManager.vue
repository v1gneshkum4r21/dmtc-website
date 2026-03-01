<template>
  <div class="showcase-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">CREATIVE_CORE</span>
        </div>
        <h1>Creative <span class="text-gradient-primary">Showcase</span></h1>
        <p>Global architectural visualization cluster management and asset orchestration.</p>
      </div>
      
      <div class="header-actions">
        <div class="intelligence-stats">
          <div class="stat-node">
            <span class="val">{{ showcaseItems.length }}</span>
            <span class="label">Total Nodes</span>
          </div>
          <div class="stat-node primary">
            <span class="val">{{ activeItemsCount }}</span>
            <span class="label">Broadcast Live</span>
          </div>
        </div>
        <button class="btn-primary-luxe" @click="$emit('create')">
          <span class="plus-glyph">+</span>
          <span class="btn-text">Add Asset</span>
        </button>
      </div>
    </header>

    <!-- Interface Controls Cluster -->
    <div class="controls-cluster-luxury">
      <div class="search-vessel">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Scan by title or identifier..." 
          class="glass-input"
        />
      </div>

      <div class="filter-orchestrator">
        <button 
          v-for="cat in ['All', 'SuperFiitter', 'EchoAI', 'Solutions', 'Enterprise']" 
          :key="cat"
          :class="['filter-btn', { active: filterProduct === cat }]"
          @click="filterProduct = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="view-toggles-quantum">
        <button :class="{ active: viewDensity === 'cozy' }" @click="viewDensity = 'cozy'">▦</button>
        <button :class="{ active: viewDensity === 'compact' }" @click="viewDensity = 'compact'">≣</button>
      </div>
    </div>

    <!-- Dynamic Surface -->
    <div v-if="loading && filteredItems.length === 0" class="loading-state-quantum">
      <div class="quantum-loader"></div>
      <span>Synchronizing Asset Nodes...</span>
    </div>

    <div v-else-if="filteredItems.length === 0" class="empty-state-quantum">
      <div class="empty-glyph">🧊</div>
      <h3>Null Vector Detected</h3>
      <p>No asset nodes match your current search parameters or category filter.</p>
      <button @click="resetFilters" class="btn-ghost-cyan">Clear Search Filter</button>
    </div>

    <div v-else :class="['assets-dynamic-grid', viewDensity]">
      <div
        v-for="item in filteredItems"
        :key="item._id"
        class="asset-node-card"
        :class="{ 'inactive-node': !item.active }"
      >
        <div class="asset-preview-chamber">
          <div class="preview-overlay">
            <div class="overlay-actions">
              <button class="action-btn zoom" @click="zoomImage(item.mediaUrl)" title="Expand Node">⛶</button>
              <button class="action-btn edit" @click="$emit('edit-showcase', item)" title="Edit Node">✏️</button>
              <button class="action-btn terminate" @click="$emit('delete-showcase', item._id)" title="Terminate Node">✕</button>
            </div>
          </div>
          
          <img v-if="item.mediaType === 'image'" :src="item.mediaUrl" alt="" loading="lazy" />
          <div v-else class="video-preview-vessel">
            <div class="play-glyph">▶</div>
            <span class="file-name">{{ item.mediaUrl.split('/').pop() }}</span>
          </div>

          <div class="asset-meta-tags">
            <span class="tag-meta order">#{{ item.order }}</span>
            <span :class="['tag-meta type', item.mediaType]">{{ item.mediaType.toUpperCase() }}</span>
          </div>
        </div>

        <div class="asset-content-strata">
          <div class="main-info">
            <h3 class="asset-title">{{ item.title }}</h3>
            <div class="asset-domain">
              <span class="domain-dot"></span>
              {{ item.product }}
            </div>
          </div>
          
          <div class="asset-tag-row">
            <span class="meta-particle">{{ item.tag || 'Uncategorized' }}</span>
            <span class="meta-particle">{{ item.size }}</span>
          </div>

          <div class="node-health">
            <div class="health-bar">
              <div class="fill" :class="{ active: item.active }"></div>
            </div>
            <span class="health-label">{{ item.active ? 'OPERATIONAL' : 'DECOMMISSIONED' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quantum Image Zoom -->
    <transition name="quantum-expand">
      <div v-if="zoomedImageUrl" class="quantum-zoom-overlay" @click="zoomedImageUrl = null">
        <div class="zoom-vessel" @click.stop>
          <img :src="zoomedImageUrl" />
          <button class="close-quantum" @click="zoomedImageUrl = null">✕</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  showcaseItems: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})

const searchQuery = ref('')
const filterProduct = ref('All')
const viewDensity = ref('cozy')
const zoomedImageUrl = ref(null)

const activeItemsCount = computed(() => props.showcaseItems.filter(s => s.active).length)

const filteredItems = computed(() => {
  return props.showcaseItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.tag && item.tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesProduct = filterProduct.value === 'All' || item.product === filterProduct.value
    return matchesSearch && matchesProduct
  }).sort((a, b) => a.order - b.order)
})

const resetFilters = () => {
  searchQuery.value = ''
  filterProduct.value = 'All'
}

const zoomImage = (url) => {
  zoomedImageUrl.value = url
}

defineEmits(['edit-showcase', 'delete-showcase'])
</script>

<style scoped>
/* Module Layout */
.showcase-manager {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 4rem;
}

/* Intelligence Stats */
.intelligence-stats { display: flex; gap: 2rem; margin-right: 2rem; }
.stat-node { display: flex; align-items: baseline; gap: 8px; }
.stat-node .val { font-size: 1.5rem; font-weight: 900; color: white; }
.stat-node .label { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-node.primary .val { color: var(--primary); }

/* Controls Cluster */
.controls-cluster-luxury {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  background: rgba(0,0,0,0.2);
  padding: 1rem 2rem;
  border-radius: 24px;
  border: 1px solid var(--border-subtle);
}

.search-vessel {
  flex: 1;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon { position: absolute; left: 1.25rem; color: var(--text-muted); opacity: 0.5; }
.glass-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  color: white;
  font-weight: 600;
  transition: all 0.3s;
}
.glass-input:focus { border-color: var(--primary); background: var(--bg-elevated); outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

.filter-orchestrator { display: flex; gap: 0.5rem; }
.filter-btn {
  padding: 10px 18px;
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { background: rgba(255,255,255,0.05); color: white; }
.filter-btn.active { background: var(--primary); border-color: var(--primary); color: white; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2); }

.view-toggles-quantum { display: flex; gap: 4px; padding: 4px; background: rgba(0,0,0,0.3); border-radius: 12px; }
.view-toggles-quantum button {
  width: 40px; height: 40px; border: none; background: transparent; color: var(--text-muted);
  font-size: 1.25rem; border-radius: 8px; cursor: pointer; transition: all 0.2s;
}
.view-toggles-quantum button.active { background: var(--bg-elevated); color: white; }

/* Grid Stratum */
.assets-dynamic-grid {
  display: grid;
  gap: 2.5rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.assets-dynamic-grid.cozy { grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); }
.assets-dynamic-grid.compact { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

.asset-node-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.asset-node-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
}

.asset-preview-chamber {
  aspect-ratio: 16/10;
  position: relative;
  background: #000;
  overflow: hidden;
}

.asset-preview-chamber img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
.asset-node-card:hover .asset-preview-chamber img { transform: scale(1.08); }

.preview-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.3s; z-index: 5;
  backdrop-filter: blur(4px);
}

.asset-node-card:hover .preview-overlay { opacity: 1; }

.overlay-actions { display: flex; gap: 1rem; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.asset-node-card:hover .overlay-actions { transform: translateY(0); }

.action-btn {
  width: 50px; height: 50px; border-radius: 16px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 1.25rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-btn.zoom { background: white; color: black; }
.action-btn.edit { background: var(--primary); color: white; }
.action-btn.terminate { background: #ef4444; color: white; }
.action-btn:hover { transform: scale(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

.asset-meta-tags {
  position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  pointer-events: none;
}

.tag-meta {
  padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 850;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
  color: white; letter-spacing: 0.05em;
}

.tag-meta.type.image { color: #818cf8; }
.tag-meta.type.video { color: #fbbf24; }

.video-preview-vessel {
  height: 100%; width: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted);
}

.play-glyph {
  width: 60px; height: 60px; border-radius: 50%; border: 2px solid currentColor;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem; padding-left: 4px;
}

.asset-content-strata { padding: 2rem; position: relative; }

.asset-title { font-size: 1.2rem; font-weight: 850; margin-bottom: 0.5rem; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.asset-domain { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.domain-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }

.asset-tag-row { display: flex; gap: 0.75rem; margin: 1.5rem 0; }
.meta-particle {
  font-size: 0.7rem; font-weight: 700; padding: 6px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); color: var(--text-secondary);
}

.node-health { display: flex; align-items: center; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem; }
.health-bar { flex: 1; height: 6px; background: rgba(0,0,0,0.3); border-radius: 100px; overflow: hidden; }
.health-bar .fill { height: 100%; width: 0; background: #4b5563; transition: all 1s ease; }
.health-bar .fill.active { width: 100%; background: var(--success); }
.health-label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.1em; }

.inactive-node { opacity: 0.6; filter: grayscale(0.5); }

/* Quantum Zoom */
.quantum-zoom-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 5000;
  backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center;
}

.zoom-vessel { position: relative; max-width: 90vw; max-height: 90vh; }
.zoom-vessel img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 24px; box-shadow: 0 50px 100px rgba(0,0,0,0.8); }

.close-quantum {
  position: absolute; top: -3rem; right: 0;
  background: transparent; border: none; color: white; font-size: 2rem; cursor: pointer;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.quantum-expand-enter-active, .quantum-expand-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.quantum-expand-enter-from, .quantum-expand-leave-to { opacity: 0; transform: scale(0.9); }

.loading-state-quantum { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; padding: 10rem 0; color: var(--text-muted); }
.quantum-loader {
  width: 50px; height: 50px; border: 3px solid var(--border-subtle); border-top-color: var(--primary);
  border-radius: 50%; animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state-quantum {
  text-align: center; padding: 10rem 0; background: var(--glass-light); border-radius: 40px;
  border: 1px dashed var(--border-medium);
}
.empty-glyph { font-size: 4rem; margin-bottom: 2rem; opacity: 0.2; }
.empty-state-quantum h3 { font-size: 1.5rem; font-weight: 850; margin-bottom: 1rem; }
.empty-state-quantum p { color: var(--text-muted); margin-bottom: 2.5rem; }

.btn-ghost-cyan {
  padding: 12px 24px; border: 1px solid var(--primary); background: transparent;
  color: var(--primary); border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-ghost-cyan:hover { background: var(--primary); color: white; }

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
  .intelligence-stats {
    margin-right: 0;
    width: 100%;
  }
  .stat-node {
    flex: 1;
    justify-content: center;
  }
  .btn-primary-luxe {
    width: 100%;
  }
  .controls-cluster-luxury {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  .search-vessel {
    max-width: none;
  }
  .filter-orchestrator {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .assets-dynamic-grid.cozy, .assets-dynamic-grid.compact {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .asset-node-card {
    border-radius: 20px;
  }
  .asset-content-strata {
    padding: 1.5rem;
  }
}
</style>
