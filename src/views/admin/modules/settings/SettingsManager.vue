<template>
  <div class="settings-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag">SYSTEM_CORE</span>
        </div>
        <h1>Global <span class="text-gradient-primary">Configuration</span></h1>
        <p>Orchestrating site-wide parameters, SEO intelligence, and infrastructure integrity.</p>
      </div>
      
      <div class="header-actions">
        <div class="sync-status">
          <span class="pulsating-dot"></span>
          <span class="status-text">Cloud Sync Ready</span>
        </div>
        <button class="btn-primary-luxe" @click="saveSettings">
          <span class="save-icon">💾</span>
          <span class="btn-text">Commit Changes</span>
        </button>
      </div>
    </header>

    <div class="settings-quantum-grid">
      <!-- Navigation Axis -->
      <aside class="settings-nav-axis card-premium">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="axis-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="btn-glyph">{{ tab.icon }}</span>
          <div class="btn-info">
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-sub text-muted">{{ tab.sub }}</span>
          </div>
          <span class="axis-arrow">→</span>
        </button>
      </aside>

      <!-- Content Viewport -->
      <main class="settings-viewport-surface card-premium">
        <transition name="quantum-page" mode="out-in">
          <div :key="activeTab" class="pane-chamber">
            
            <!-- General -->
            <div v-if="activeTab === 'general'" class="pane-stack">
              <div class="pane-header">
                <h3>Core Brand Identity</h3>
                <p>Define the high-level identity nodes for the public network.</p>
              </div>
              <div class="settings-field-cluster">
                <div class="field-item">
                  <label class="luxe-label">Site Brand Designation</label>
                  <input v-model="settings.siteTitle" type="text" class="luxe-input" />
                  <p class="field-tip">Appears in global title tags and navigational headers.</p>
                </div>
                <div class="field-item">
                  <label class="luxe-label">Intelligence Tagline</label>
                  <input v-model="settings.tagline" type="text" class="luxe-input" />
                </div>
                <div class="field-item">
                  <label class="luxe-label">Administrative Contact Node</label>
                  <input v-model="settings.contactEmail" type="email" class="luxe-input" />
                </div>
              </div>
            </div>

            <!-- SEO -->
            <div v-if="activeTab === 'seo'" class="pane-stack">
              <div class="pane-header">
                <h3>Search Engine Optimization</h3>
                <p>Configure how neural indexers interact with your platform.</p>
              </div>
              <div class="settings-field-cluster">
                <div class="field-item">
                  <label class="luxe-label">Global Meta Narrative</label>
                  <textarea v-model="settings.seoDescription" class="luxe-input" rows="4"></textarea>
                  <p class="field-tip">Optimal length for indexers: 155 characters.</p>
                </div>
                <div class="field-item">
                  <label class="luxe-label">Intelligence Keywords</label>
                  <input v-model="settings.keywords" type="text" class="luxe-input" placeholder="AI, Agents, Future..." />
                </div>
                <div class="luxe-toggle-box">
                  <div class="toggle-meta">
                    <label>Indexer Permission</label>
                    <p>Allow crawlers to index and rank the current node.</p>
                  </div>
                  <div class="luxe-switch" :class="{ on: settings.indexRobots }" @click="settings.indexRobots = !settings.indexRobots"></div>
                </div>
              </div>
            </div>

            <!-- Social -->
            <div v-if="activeTab === 'social'" class="pane-stack">
              <div class="pane-header">
                <h3>Network Presence</h3>
                <p>Bind external social nodes to the primary matrix.</p>
              </div>
              <div class="settings-field-cluster">
                <div class="social-binding">
                  <div class="binding-icon in">in</div>
                  <input v-model="settings.social.linkedin" type="text" class="luxe-input" placeholder="LinkedIn Data Path..." />
                </div>
                <div class="social-binding">
                  <div class="binding-icon x">𝕏</div>
                  <input v-model="settings.social.twitter" type="text" class="luxe-input" placeholder="X / Twitter Data Path..." />
                </div>
              </div>
            </div>

            <!-- Infrastructure -->
            <div v-if="activeTab === 'infra'" class="pane-stack">
              <div class="pane-header">
                <h3>System Architecture</h3>
                <p>Real-time status of critical infrastructure components.</p>
              </div>
              
              <div class="infra-dashboard">
                <div class="infra-node card-premium">
                  <div class="node-pulse active"></div>
                  <div class="node-data">
                    <span class="node-label">Database Cluster</span>
                    <span class="node-status text-success">OPERATIONAL</span>
                  </div>
                </div>
                <div class="infra-node card-premium">
                  <div class="node-pulse active"></div>
                  <div class="node-data">
                    <span class="node-label">Asset CDN</span>
                    <span class="node-status text-success">EDGE_ACTIVE</span>
                  </div>
                </div>
                <div class="infra-node card-premium">
                  <div class="node-pulse"></div>
                  <div class="node-data">
                    <span class="node-label">SSL Layer</span>
                    <span class="node-status text-muted">TLS 1.3 SYNC</span>
                  </div>
                </div>
              </div>

              <div class="danger-zone">
                <div class="luxe-toggle-box large warn">
                  <div class="toggle-meta">
                    <label>System Maintenance Protocol</label>
                    <p>Redirect all external traffic to a splash page. ONLY FOR EMERGENCY UPDATES.</p>
                  </div>
                  <div class="luxe-switch warn" :class="{ on: settings.maintenanceMode }" @click="settings.maintenanceMode = !settings.maintenanceMode"></div>
                </div>
              </div>
            </div>

            <!-- Navigation Matrix -->
            <div v-if="activeTab === 'navigation'" class="pane-stack">
              <div class="pane-header">
                <h3>Navigation & View Control</h3>
                <p>Manage the visibility of all site modules and their presence in the global navbar.</p>
              </div>

              <div class="navigation-matrix">
                <div v-for="(routes, group) in groupedRoutes" :key="group" class="matrix-group">
                  <div class="group-header-row">
                    <h4 class="group-title">{{ group.toUpperCase() }}</h4>
                    <button class="btn-add-mini" @click="prepNewPage(group)">
                      <span>+</span> New Page
                    </button>
                  </div>
                  <div class="matrix-list">
                    <div v-for="route in routes" :key="route.id" class="matrix-item card-premium">
                      <div class="item-info">
                        <div class="label-row">
                          <span class="item-label">{{ route.label }}</span>
                          <span v-if="route.isCustom" class="custom-badge" title="Dynamic Custom Page">MODULAR</span>
                        </div>
                        <span class="item-path">{{ route.path }}</span>
                      </div>
                      <div class="item-actions">
                        <button v-if="route.isCustom" class="btn-icon-danger" @click="navStore.removeCustomPage(route.id)" title="Delete Page">
                          🗑️
                        </button>
                        <div class="luxe-switch" :class="{ on: route.visible }" @click="navStore.toggleVisibility(route.id)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- New Page Modal -->
              <div v-if="showNewPageModal" class="settings-modal-overlay">
                <div class="settings-modal card-premium">
                  <h3>Initialize <span class="text-gradient-primary">New Node</span></h3>
                  <p>Define a new segment for the DREAMATIC network architecture.</p>
                  
                  <div class="modal-form">
                    <div class="field-item">
                      <label class="luxe-label">Page Title</label>
                      <input v-model="newPageTitle" type="text" class="luxe-input" placeholder="e.g. Quantum Computing" />
                    </div>
                    <div class="field-item">
                      <label class="luxe-label">Assignment Block</label>
                      <select v-model="newPageGroup" class="luxe-input">
                        <option v-for="group in navStore.groups" :key="group" :value="group">
                          {{ group.toUpperCase() }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="modal-actions">
                    <button class="btn-text" @click="showNewPageModal = false">Abort</button>
                    <button class="btn-primary-luxe" @click="createPage" :disabled="!newPageTitle">Deploy Node</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { navStore } from '@/store/navigation'

const activeTab = ref('general')
const tabs = [
  { id: 'general', label: 'Identity', sub: 'Core Brand Metadata', icon: '🏛️' },
  { id: 'navigation', label: 'Sitemap', sub: 'View Visibility Control', icon: '🗺️' },
  { id: 'seo', label: 'SEO Engine', sub: 'Search Intelligence', icon: '🔍' },
  { id: 'social', label: 'Social Graph', sub: 'Network Presence', icon: '🌐' },
  { id: 'infra', label: 'Infrastructure', sub: 'System Integrity', icon: '⚙️' }
]

const settings = ref({
  siteTitle: 'DREAMATIC',
  tagline: 'The Future of Agentic AI',
  contactEmail: 'hello@dreamatic.ai',
  seoDescription: 'Leading the bridge between human intuition and agentic automation.',
  keywords: 'AI, Agents, Enterprise AI, Future Tech',
  indexRobots: true,
  maintenanceMode: false,
  social: {
    linkedin: 'linkedin.com/company/dreamatic',
    twitter: 'x.com/dreamatic',
  }
})

const groupedRoutes = computed(() => {
  const groups = {}
  navStore.groups.forEach(g => groups[g] = [])
  Object.values(navStore.matrix).forEach(route => {
    if (!groups[route.group]) groups[route.group] = []
    groups[route.group].push(route)
  })
  return groups
})

// New Page Logic
const showNewPageModal = ref(false)
const newPageTitle = ref('')
const newPageGroup = ref('services')

const prepNewPage = (group) => {
  newPageGroup.value = group
  newPageTitle.value = ''
  showNewPageModal.value = true
}

const createPage = () => {
  if (navStore.addCustomPage(newPageTitle.value, newPageGroup.value)) {
    showNewPageModal.value = false
  } else {
    alert('Node ID already exists in the matrix.')
  }
}

const saveSettings = (event) => {
  const btn = event.currentTarget
  btn.classList.add('loading')
  const originalHtml = btn.innerHTML
  
  btn.innerHTML = '<span>⏳</span> Synchronizing...'
  
  setTimeout(() => {
    btn.innerHTML = '<span>🚀</span> Matrix Updated'
    btn.classList.remove('loading')
    btn.classList.add('success')
    
    setTimeout(() => { 
      btn.innerHTML = originalHtml
      btn.classList.remove('success')
    }, 2000)
  }, 1200)
}
</script>

<style scoped>
.settings-manager {
  animation: quantumIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes quantumIn {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}


.sync-status { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); padding: 0.5rem 1rem; background: var(--glass-light); border-radius: 100px; border: 1px solid var(--border-subtle); margin-right: 1.5rem; }
.pulsating-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px var(--success); animation: pulseDot 2s infinite; }

@keyframes pulseDot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.settings-quantum-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3rem;
  align-items: start;
}

.settings-nav-axis { padding: 1rem !important; }
.axis-btn {
  width: 100%; display: flex; align-items: center; gap: 1.25rem;
  padding: 1.25rem; background: transparent; border: none; border-radius: 20px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left; position: relative;
  margin-bottom: 0.5rem;
}

.btn-glyph { font-size: 1.5rem; filter: grayscale(1) opacity(0.5); transition: 0.3s; }
.btn-info { display: flex; flex-direction: column; }
.tab-label { font-size: 0.95rem; font-weight: 850; color: var(--text-secondary); }
.tab-sub { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.axis-arrow { margin-left: auto; opacity: 0; transform: translateX(-10px); transition: 0.3s; font-weight: 950; color: var(--primary); }

.axis-btn:hover { background: var(--glass-light); }
.axis-btn.active { background: var(--bg-surface); box-shadow: var(--shadow-sm); }
.axis-btn.active .btn-glyph { filter: grayscale(0) opacity(1); transform: scale(1.1); }
.axis-btn.active .tab-label { color: white; }
.axis-btn.active .axis-arrow { opacity: 1; transform: translateX(0); }

.settings-viewport-surface {
  min-height: 600px; padding: 3rem !important;
}

.pane-header { margin-bottom: 3rem; }
.pane-header h3 { font-size: 1.6rem; font-weight: 850; color: white; margin-bottom: 0.5rem; }
.pane-header p { font-size: 0.95rem; color: var(--text-muted); }

.settings-field-cluster { display: flex; flex-direction: column; gap: 2.5rem; }

.field-item { display: flex; flex-direction: column; gap: 0.75rem; }
.luxe-label { font-size: 0.75rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
.luxe-input {
  width: 100%; background: var(--bg-surface); border: 1px solid var(--border-subtle);
  padding: 1.1rem 1.4rem; border-radius: 16px; color: white;
  font-weight: 600; font-size: 0.95rem; transition: 0.3s;
}
.luxe-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); outline: none; }
.field-tip { font-size: 0.75rem; color: var(--text-muted); }

.luxe-toggle-box {
  display: flex; justify-content: space-between; align-items: center;
  padding: 2rem; background: var(--glass-light); border-radius: 24px; border: 1px solid var(--border-subtle);
}
.toggle-meta label { display: block; font-size: 1rem; font-weight: 800; color: white; margin-bottom: 4px; }
.toggle-meta p { font-size: 0.8rem; color: var(--text-muted); }

.luxe-switch {
  width: 54px; height: 28px; background: #27272a; border-radius: 100px; position: relative; cursor: pointer; transition: 0.4s;
}
.luxe-switch::after { content: ''; position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #71717a; border-radius: 50%; transition: 0.4s; }
.luxe-switch.on { background: var(--primary); }
.luxe-switch.on::after { left: 30px; background: white; }
.luxe-switch.on.warn { background: var(--error); }

.social-binding { display: flex; align-items: center; gap: 1.25rem; }
.binding-icon {
  width: 48px; height: 48px; min-width: 48px; background: var(--bg-surface); border-radius: 14px;
  display: flex; align-items: center; justify-content: center; font-weight: 950; color: white; border: 1px solid var(--border-subtle);
}
.binding-icon.in { background: #0077b5; border: none; }

.infra-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
.infra-node { padding: 1.5rem !important; display: flex; align-items: center; gap: 1.25rem; background: var(--bg-surface) !important; }
.node-pulse { width: 10px; height: 10px; border-radius: 50%; background: #27272a; }
.node-pulse.active { background: var(--success); box-shadow: 0 0 10px var(--success); animation: pulseDot 1.5s infinite; }
.node-data { display: flex; flex-direction: column; }
.node-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
.node-status { font-size: 0.9rem; font-weight: 900; }

.danger-zone { border-top: 1px solid var(--border-subtle); padding-top: 3rem; }
.warn label { color: var(--error) !important; }

.quantum-page-enter-active, .quantum-page-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.quantum-page-enter-from { opacity: 0; transform: translateY(10px); }
.quantum-page-leave-to { opacity: 0; transform: translateY(-10px); }

/* Navigation Matrix Styles */
.navigation-matrix {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.group-title {
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: 0.2em;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}

.matrix-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.matrix-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem !important;
  transition: 0.3s;
}

.matrix-item:hover {
  background: var(--bg-surface) !important;
  border-color: var(--primary);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 1rem;
  font-weight: 800;
  color: white;
}

.item-path {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: monospace;
}

.group-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.group-header-row .group-title {
  margin-bottom: 0px !important;
  border-bottom: none !important;
  padding-bottom: 0px !important;
}

.btn-add-mini {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 850;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add-mini span { color: var(--primary); font-size: 1.1rem; }
.btn-add-mini:hover { background: var(--bg-surface); border-color: var(--primary); color: white; }

.label-row { display: flex; align-items: center; gap: 0.75rem; }

.custom-badge {
  font-size: 10px;
  padding: 2px 8px;
  background: var(--primary);
  color: white;
  border-radius: 4px;
  font-weight: 950;
  letter-spacing: 0.05em;
}

.item-actions { display: flex; align-items: center; gap: 1rem; }

.btn-icon-danger {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.5;
  transition: 0.2s;
}
.btn-icon-danger:hover { opacity: 1; transform: scale(1.2); }

/* Modal Styles */
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.settings-modal {
  width: 100%;
  max-width: 500px;
  padding: 3rem !important;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2.5rem 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  align-items: center;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-weight: 800;
  cursor: pointer;
}

.btn-text:hover { color: white; }

</style>
