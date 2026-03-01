<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button class="mobile-menu-toggle" @click="$emit('toggle-sidebar')">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <div class="header-breadcrumb-luxury">
        <div class="sync-pulse">
          <span class="pulse-dot"></span> System Live • {{ lastSync }}
        </div>
        <div class="path-navigation">
          <span class="path-root">Command</span>
          <span class="path-sep">/</span>
          <span class="path-current">{{ title }}</span>
        </div>
      </div>
    </div>
    
    <div class="header-search-container">
      <SearchManager 
        :searchData="searchData"
        @select="item => $emit('search-select', item)"
      />
    </div>

    <div class="header-actions-luxury">
      <div class="action-group">
        <button class="nav-icon-btn" title="System Logs">
          <i>▤</i>
        </button>
        <button class="nav-icon-btn" title="Media Library">
          <i>🖼</i>
        </button>
      </div>
      
      <div class="divider"></div>
      
      <a :href="previewUrl" target="_blank" class="preview-link-btn">
        <span>Website Preview</span>
        <span class="icon">↗</span>
      </a>
      
      <button class="btn-primary-luxe" @click="$emit('create')">
        <template v-if="createLabel.startsWith('+')">
          <span class="plus-glyph">+</span>
          <span class="btn-text">{{ createLabel.slice(1).trim() }}</span>
        </template>
        <template v-else>
          <span class="btn-text">{{ createLabel }}</span>
        </template>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import SearchManager from './SearchManager.vue'

const props = defineProps({
  activeModule: { type: String, required: true },
  title: { type: String, required: true },
  previewUrl: { type: String, default: '/' },
  createLabel: { type: String, default: '+ New Item' },
  searchData: { type: Object, default: () => ({ insights: [], showcase: [], applications: [] }) }
})

const lastSync = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

defineEmits(['update:activeModule', 'create', 'search-select', 'toggle-sidebar'])
</script>

<style scoped>
.header-breadcrumb-luxury {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sync-pulse {
  font-size: 0.65rem;
  color: var(--success);
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.path-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.path-root { color: var(--text-muted); font-weight: 500; }
.path-sep { color: var(--border-medium); font-size: 0.8rem; }
.path-current { color: white; font-weight: 800; }

.header-search-container {
  flex: 1;
  max-width: 480px;
  margin: 0 4rem;
}

.header-actions-luxury {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-group {
  display: flex;
  gap: 0.5rem;
}

.nav-icon-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  transition: all 0.2s;
}

.nav-icon-btn:hover { background: var(--glass-heavy); color: white; border-color: var(--border-medium); }

.divider { width: 1px; height: 24px; background: var(--border-subtle); }

.preview-link-btn {
  color: var(--text-secondary);
  text-decoration: none;
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.preview-link-btn:hover { color: white; background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); }

.btn-primary-header {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  transition: all 0.2s;
}

.btn-primary-header:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3); }

/* Mobile Adaptations */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-left: -10px;
}

.mobile-menu-toggle .bar {
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 10px;
  transition: 0.3s;
}

@media (max-width: 1024px) {
  .mobile-menu-toggle { display: flex; }
  .header-breadcrumb-luxury { display: none; }
  .header-search-container { margin: 0 1rem; }
  
  .header-actions-luxury .action-group,
  .header-actions-luxury .divider,
  .header-actions-luxury .preview-link-btn {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-search-container {
    display: none;
  }
}
</style>
