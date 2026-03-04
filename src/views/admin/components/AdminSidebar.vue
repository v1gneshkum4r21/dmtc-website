<template>
  <div :class="['sidebar-mobile-overlay', { show: isOpen }]" @click="$emit('close')"></div>
  <aside :class="['admin-sidebar', 'shadow-2xl', { open: isOpen }]">
    <button class="mobile-close-btn" @click="$emit('close')">✕</button>
    <!-- Branding Orbit -->
    <div class="sidebar-brand-orbit">
      <div class="brand-wrapper">
        <div class="brand-core-cube">
          <div class="cube-face"></div>
        </div>
        <div class="brand-meta">
          <h2 class="brand-title">DREAMATIC</h2>
          <div class="brand-pulse">
            <span class="status-indicator"></span>
            <span class="pulse-label">NEURAL_ADMIN_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav Synapse -->
    <nav class="sidebar-synapse">
      <!-- SYSTEM COMMAND -->
      <div class="synapse-group">
        <label class="synapse-label">Command Center</label>
        <div 
          class="synapse-link"
          :class="{ active: activeModule === 'dashboard' }"
          @click="resetToModule('dashboard')"
        >
          <div class="link-glow"></div>
          <span class="link-icon">📊</span>
          <span class="link-text">Global Snapshot</span>
        </div>
        <div 
          class="synapse-link"
          :class="{ active: activeModule === 'settings' }"
          @click="resetToModule('settings')"
        >
          <div class="link-glow"></div>
          <span class="link-icon">⚙️</span>
          <span class="link-text">System Config</span>
        </div>
      </div>

      <!-- INSIGHT NODES -->
      <div class="synapse-group">
        <label class="synapse-label">Intelligence Units</label>
        
        <!-- Services Sub-group -->
        <div class="sub-synapse">
          <header class="sub-header">SERVICES</header>
          <div 
            v-for="service in services" 
            :key="service.id"
            class="synapse-link mini" 
            :class="{ active: activeModule === 'insights' && selectedPage === service.id }" 
            @click="setPage(service.id)"
          >
            <div class="link-content">
              <span class="link-icon">{{ service.icon }}</span>
              <span class="link-text">{{ service.label }}</span>
            </div>
            <button 
              class="context-config-btn" 
              @click.stop="$emit('configure-page', service.id)"
              title="Architect Page"
            >
              ⚙️
            </button>
          </div>
        </div>

        <!-- Products Sub-group -->
        <div class="sub-synapse">
          <header class="sub-header">PRODUCTS</header>
          <div 
            v-for="product in products" 
            :key="product.id"
            class="synapse-link mini" 
            :class="{ active: activeModule === 'insights' && selectedPage === product.id }" 
            @click="setPage(product.id)"
          >
            <div class="link-content">
              <span class="link-icon">{{ product.icon }}</span>
              <span class="link-text">{{ product.label }}</span>
            </div>
            <button 
              class="context-config-btn" 
              @click.stop="$emit('configure-page', product.id)"
              title="Architect Page"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      <!-- CREATIVE CORE -->
      <div class="synapse-group">
        <label class="synapse-label">Creative Assets</label>
        <div 
          class="synapse-link"
          :class="{ active: activeModule === 'showcase' }"
          @click="resetToModule('showcase')"
        >
          <div class="link-glow"></div>
          <span class="link-icon">🎨</span>
          <span class="link-text">Media Showcase</span>
        </div>
      </div>

      <!-- CORPORATE ORBIT -->
      <div class="synapse-group">
        <label class="synapse-label">Corporate Orbit</label>
        
        <!-- Company Pages -->
        <div class="sub-synapse">
          <header class="sub-header">STRATEGY</header>
          <div 
            v-for="page in companyPages" 
            :key="page.id"
            class="synapse-link mini" 
            :class="{ active: activeModule === 'company' && selectedPage === page.id }" 
            @click="setPage(page.id)"
          >
            <div class="link-content">
              <span class="link-icon">{{ page.icon }}</span>
              <span class="link-text">{{ page.label }}</span>
            </div>
            <button 
              class="context-config-btn" 
              @click.stop="$emit('configure-page', page.id)"
              title="Architect Page"
            >
              ⚙️
            </button>
          </div>
        </div>

        <!-- Careers Sub-group -->
        <div class="sub-synapse">
          <header class="sub-header">TALENT</header>
          <div 
            class="synapse-link mini"
            :class="{ active: activeModule === 'careers' && selectedPage === 'jds' }"
            @click="setSubModule('careers', 'jds')"
          >
            <div class="link-content">
              <span class="link-icon">💼</span>
              <span class="link-text">Active Protocols</span>
            </div>
          </div>
          <div 
            class="synapse-link mini"
            :class="{ active: activeModule === 'careers' && selectedPage === 'applicants' }"
            @click="setSubModule('careers', 'applicants')"
          >
            <div class="link-content">
              <span class="link-icon">👥</span>
              <span class="link-text">Candidate Mesh</span>
            </div>
          </div>
          <div 
            class="synapse-link mini"
            :class="{ active: activeModule === 'careers' && selectedPage === 'history' }"
            @click="setSubModule('careers', 'history')"
          >
            <div class="link-content">
              <span class="link-icon">📜</span>
              <span class="link-text">Audit History</span>
            </div>
          </div>
        </div>
      </div>

      <!-- KNOWLEDGE UNITS -->
      <div class="synapse-group">
        <label class="synapse-label">Knowledge Hub</label>
        
        <div class="sub-synapse">
          <header class="sub-header">RESOURCES</header>
          <div 
            v-for="unit in knowledgeUnits" 
            :key="unit.id"
            class="synapse-link mini" 
            :class="{ active: activeModule === 'resources' && selectedPage === unit.id }" 
            @click="setPage(unit.id)"
          >
            <div class="link-content">
              <span class="link-icon">{{ unit.icon }}</span>
              <span class="link-text">{{ unit.label }}</span>
            </div>
            <button 
              class="context-config-btn" 
              @click.stop="$emit('configure-page', unit.id)"
              title="Architect Page"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Core Footer -->
    <div class="synapse-footer card-premium">
      <div class="operator-pill">
        <div class="operator-avatar">
          <span class="avatar-glow"></span>
          AD
        </div>
        <div class="operator-info">
          <span class="op-name">Administrator</span>
          <span class="op-status">System_Root</span>
        </div>
      </div>
      <button class="terminal-exit-btn" @click="$emit('logout')" title="Terminate Session">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeModule: { type: String, required: true },
  selectedPage: { type: String, default: '' },
  websitePages: { type: Array, default: () => [] },
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['update:activeModule', 'update:selectedPage', 'add-page', 'logout', 'close', 'configure-page'])

const services = computed(() => props.websitePages.filter(p => p.group === 'services' || ['ai-work', 'ai-service', 'ai-enterprise'].includes(p.id)))
const products = computed(() => props.websitePages.filter(p => p.group === 'products' || ['superfitter', 'echo-ai'].includes(p.id)))
const companyPages = computed(() => props.websitePages.filter(p => p.group === 'company' || ['about', 'leadership'].includes(p.id)))
const knowledgeUnits = computed(() => props.websitePages.filter(p => p.group === 'resources' || ['hub', 'blog', 'research'].includes(p.id)))

const setPage = (pageId) => {
  const page = props.websitePages.find(p => p.id === pageId)
  let module = 'products'
  
  if (page?.group) {
    module = page.group
  } else {
    const isService = ['ai-work', 'ai-service', 'ai-enterprise'].includes(pageId)
    const isCompany = ['about', 'leadership'].includes(pageId)
    const isKnowledge = ['hub', 'blog', 'research'].includes(pageId)
    
    if (isService) module = 'services'
    else if (isCompany) module = 'company'
    else if (isKnowledge) module = 'resources'
  }
  
  emit('update:activeModule', module)
  emit('update:selectedPage', pageId)
}

const resetToModule = (module) => {
  emit('update:activeModule', module)
  emit('update:selectedPage', '')
}

const setSubModule = (module, sub) => {
  emit('update:activeModule', module)
  emit('update:selectedPage', sub)
}
</script>

<style scoped>
.admin-sidebar {
  width: 300px;
  height: 100vh;
  background: #09090b;
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  z-index: 100;
  position: sticky;
  top: 0;
}

/* Branding Orbit */
.sidebar-brand-orbit {
  padding: 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

.brand-wrapper { display: flex; align-items: center; gap: 1.25rem; }
.brand-core-cube {
  width: 40px; height: 40px;
  background: var(--primary-gradient);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  position: relative;
  animation: cubeRotate 4s infinite ease-in-out;
}

@keyframes cubeRotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.brand-title { font-size: 1.1rem; font-weight: 950; letter-spacing: 0.05em; margin: 0; color: white; }
.brand-pulse { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.status-indicator { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 8px var(--success); }
.pulse-label { font-size: 0.55rem; color: #71717a; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }

/* Nav Synapse */
.sidebar-synapse {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.synapse-group { display: flex; flex-direction: column; gap: 4px; }
.synapse-label {
  font-size: 0.65rem; font-weight: 900; color: #52525b;
  text-transform: uppercase; letter-spacing: 0.15em;
  margin-bottom: 0.75rem; padding-left: 1rem;
}

.synapse-link {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 16px; border-radius: 14px;
  color: #a1a1aa; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; overflow: hidden;
}

.synapse-link .link-icon { font-size: 1.2rem; opacity: 0.6; transition: 0.3s; }
.link-glow {
  position: absolute; inset: 0; 
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15), transparent 70%);
  opacity: 0; transition: 0.3s;
}

.synapse-link:hover { color: white; background: rgba(255,255,255,0.03); }
.synapse-link:hover .link-icon { opacity: 1; transform: scale(1.1); }

.synapse-link.active {
  color: #818cf8; background: rgba(99, 102, 241, 0.08); font-weight: 800;
}
.synapse-link.active .link-icon { opacity: 1; filter: drop-shadow(0 0 8px var(--primary)); }
.synapse-link.active .link-glow { opacity: 1; }
.synapse-link.active::after {
  content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px;
  background: var(--primary); border-radius: 0 4px 4px 0;
  box-shadow: 0 0 15px var(--primary);
}

/* Sub Synapse */
.sub-synapse { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 2px; }
.sub-header {
  font-size: 0.6rem; font-weight: 950; color: #3f3f46;
  margin-bottom: 0.5rem; padding-left: 1rem; border-left: 1px solid #27272a; margin-left: 6px;
}
.synapse-link.mini { padding: 8px 16px 8px 1.5rem; font-size: 0.8rem; justify-content: space-between; }
.link-content { display: flex; align-items: center; gap: 14px; }

.context-config-btn {
  background: transparent;
  border: none;
  font-size: 0.9rem;
  opacity: 0;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  border-radius: 6px;
}

.synapse-link:hover .context-config-btn {
  opacity: 0.4;
}

.context-config-btn:hover {
  opacity: 1 !important;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}

/* Footer Core */
.synapse-footer {
  margin: 1rem 1.5rem 1.5rem;
  padding: 1.25rem !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 15, 18, 0.6) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.03) !important;
  flex-shrink: 0;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.synapse-footer:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.operator-pill { display: flex; align-items: center; gap: 12px; }
.operator-avatar {
  width: 36px; height: 36px; background: #18181b; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 900; color: #818cf8;
  position: relative; border: 1px solid rgba(255,255,255,0.05);
}
.avatar-glow {
  position: absolute; inset: -2px; border-radius: 12px;
  background: var(--primary-gradient); opacity: 0.2; filter: blur(4px);
}

.op-name { font-size: 0.85rem; font-weight: 800; color: white; display: block; }
.op-status { font-size: 0.6rem; color: #71717a; font-weight: 700; text-transform: uppercase; }

.terminal-exit-btn {
  background: transparent; border: none; color: #ef4444; 
  cursor: pointer; opacity: 0.6; transition: 0.3s; padding: 6px;
}
.terminal-exit-btn:hover { opacity: 1; transform: translateX(3px); }

/* Responsive Adaptations */
@media (max-width: 1024px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 20px 0 50px rgba(0,0,0,0.5);
  }
  
  .admin-sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar-mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 90;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  
  .sidebar-mobile-overlay.show {
    opacity: 1;
    pointer-events: auto;
  }
  
  .mobile-close-btn {
    display: block;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: white;
    cursor: pointer;
    z-index: 10;
  }
}

@media (min-width: 1025px) {
  .mobile-close-btn { display: none; }
  .sidebar-mobile-overlay { display: none; }
}
</style>
