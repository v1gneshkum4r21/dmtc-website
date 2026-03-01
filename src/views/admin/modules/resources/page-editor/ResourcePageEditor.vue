<template>
  <div class="page-editor-overlay" @click.self="$emit('close')">
    <div class="resource-editor-container card-premium shadow-2xl">
      <header class="editor-header">
        <div class="header-meta">
          <span class="context-tag">{{ pageId.toUpperCase() }} ARCHITECT</span>
          <h2>Knowledge <span class="text-gradient-primary">Designer</span></h2>
        </div>
        <div class="view-toggle">
          <span class="view-label">Dynamic Preview Active</span>
          <div class="pulse-dot"></div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-shell">
        <!-- Controls Column -->
        <div class="editor-controls">
          <!-- Hero Section Config -->
          <section class="config-section">
            <div class="section-badge">HERO UNIVERSE</div>
            <div class="form-grid">
              <div class="form-group full">
                <label>Context Badge</label>
                <input v-model="config.hero_badge" type="text" placeholder="e.g. RESOURCE HUB" class="input-premium">
              </div>
              <div class="form-group full">
                <label>Main Narrative</label>
                <input v-model="config.hero_title" type="text" placeholder="The Complete..." class="input-premium">
              </div>
              <div class="form-group full">
                <label>Sector Description</label>
                <textarea v-model="config.hero_subtitle" rows="3" placeholder="From technical implementation..." class="input-premium"></textarea>
              </div>
            </div>
          </section>

          <!-- Categories Config (Hub Specific) -->
          <section class="config-section" v-if="pageId === 'hub'">
            <div class="section-badge">CORE CATEGORIES</div>
            <div class="section-header">
              <p class="section-sub">Define the structural domains for the Resource Hub explorer.</p>
              <button class="btn-ghost mini" @click="addItem('categories')">+ Add Category</button>
            </div>
            
            <div class="items-stack">
              <div v-for="(cat, index) in config.stats" :key="index" class="config-item-card card-premium">
                <div class="item-header">
                  <h4>Category: {{ cat.name || 'Untitled' }}</h4>
                  <button class="remove-btn" @click="config.stats.splice(index, 1)">Purge</button>
                </div>
                <div class="form-grid">
                  <div class="form-group"><label>Name</label><input v-model="cat.name" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Count Label</label><input v-model="cat.count" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Definition</label><textarea v-model="cat.desc" rows="2" class="input-premium"></textarea></div>
                  <div class="form-group full"><label>Icon Glyph (SVG)</label><textarea v-model="cat.icon" rows="2" class="input-premium mini-text"></textarea></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Research Areas (Research Specific) -->
          <section class="config-section" v-if="pageId === 'research'">
            <div class="section-badge">RESEARCH DOMAINS</div>
            <div class="section-header">
              <p class="section-sub">Define focus areas for the foundational science team.</p>
              <button class="btn-ghost mini" @click="addItem('approaches')">+ Add Area</button>
            </div>
            
            <div class="items-stack">
              <div v-for="(area, index) in config.approaches" :key="index" class="config-item-card card-premium">
                <div class="item-header">
                  <h4>Area: {{ area.name || 'Untitled' }}</h4>
                  <button class="remove-btn" @click="config.approaches.splice(index, 1)">Purge</button>
                </div>
                <div class="form-grid">
                  <div class="form-group"><label>Name</label><input v-model="area.name" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Classification</label><input v-model="area.tag" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Abstract</label><textarea v-model="area.desc" rows="2" class="input-premium"></textarea></div>
                  <div class="form-group full"><label>Icon Glyph (SVG)</label><textarea v-model="area.icon" rows="2" class="input-premium mini-text"></textarea></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Live Preview Pane -->
        <aside class="editor-preview">
          <div class="preview-stage" v-if="config">
            <div class="preview-scroll-area">
              <!-- Hero Preview -->
              <div class="preview-hero-block" :class="pageId + '-preview-theme'">
                <span class="p-badge">{{ config.hero_badge }}</span>
                <h1 class="p-title" v-html="formatGradientTitle(config.hero_title)"></h1>
                <p class="p-subtitle">{{ config.hero_subtitle }}</p>
              </div>

              <!-- Content Structure Preview -->
              <div class="structure-preview" v-if="pageId === 'hub'">
                <header class="p-section-header"><span>CORE CATEGORIES</span></header>
                <div class="p-card-grid">
                  <div v-for="cat in config.stats" :key="cat.name" class="p-resource-card">
                    <div class="p-icon" v-html="cat.icon"></div>
                    <span class="p-card-title">{{ cat.name }}</span>
                    <span class="p-card-count">{{ cat.count }} Resources</span>
                  </div>
                </div>
              </div>

              <div class="structure-preview" v-if="pageId === 'research'">
                <header class="p-section-header"><span>FOCUS AREAS</span></header>
                <div class="p-card-grid">
                  <div v-for="area in config.approaches" :key="area.name" class="p-resource-card research-theme">
                    <div class="p-icon" v-html="area.icon"></div>
                    <span class="p-card-title">{{ area.name }}</span>
                    <span class="p-card-tag">{{ area.tag }}</span>
                  </div>
                </div>
              </div>
              
              <div class="structure-preview" v-if="pageId === 'blog'">
                <header class="p-section-header"><span>FEED PREVIEW</span></header>
                <div class="p-blog-skeleton">
                  <div class="skeleton-item" v-for="i in 2" :key="i">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text sub"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer class="editor-footer">
        <button class="btn-ghost" @click="$emit('close')">Abandon Config</button>
        <button class="btn-primary-luxe" :disabled="loading" @click="saveConfig">
          <span class="btn-text">{{ loading ? 'Syncing...' : 'Deploy Configuration' }}</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pagesAPI } from '@/services/api'

const props = defineProps({
  pageId: { type: String, required: true }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const config = ref({
  hero_badge: '',
  hero_title: '',
  hero_subtitle: '',
  stats: [], // Used for categories in Hub
  approaches: [], // Used for areas in Research
  values: [],
  team: [],
  perks: []
})

const loadConfig = async () => {
  loading.value = true
  try {
    const data = await pagesAPI.getConfig(props.pageId)
    if (data) config.value = data
  } catch (err) {
    console.error('Failed to load resource page config:', err)
  } finally {
    loading.value = false
  }
}

const addItem = (type) => {
  if (type === 'categories') {
    config.value.stats.push({ name: 'New Domain', desc: 'Strategy and...', count: '0', icon: '' })
  } else if (type === 'approaches') {
    config.value.approaches.push({ name: 'Focus Area', desc: 'Advancing...', tag: 'Foundational', icon: '' })
  }
}

const saveConfig = async () => {
  loading.value = true
  try {
    emit('save', config.value)
  } finally {
    loading.value = false
  }
}

const formatGradientTitle = (title) => {
  if (!title) return ''
  const words = title.split(' ')
  if (words.length > 2) {
    const lastPart = words.splice(-2).join(' ')
    return `${words.join(' ')} <span class="text-gradient-primary">${lastPart}</span>`
  }
  return title
}

onMounted(loadConfig)
</script>

<style scoped>
.page-editor-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px); z-index: 1100;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
}

.resource-editor-container {
  width: 95vw; max-width: 1400px; height: 92vh;
  display: flex; flex-direction: column; background: #050505;
  border-radius: 32px; overflow: hidden;
  animation: modalScale 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.9) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.editor-header {
  padding: 1.5rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center;
}

.header-meta h2 { font-size: 1.5rem; font-weight: 900; color: white; margin: 0; }
.context-tag { font-size: 0.6rem; font-weight: 950; color: #3b82f6; letter-spacing: 0.3em; margin-bottom: 0.5rem; display: block; }

.view-toggle { display: flex; align-items: center; gap: 12px; padding: 8px 16px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 100px; }
.view-label { font-size: 0.7rem; font-weight: 800; color: #3b82f6; text-transform: uppercase; }
.pulse-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; animation: editorPulse 2s infinite; }

@keyframes editorPulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }

.editor-shell { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
.editor-controls { padding: 2.5rem; overflow-y: auto; border-right: 1px solid rgba(255,255,255,0.05); }
.editor-preview { background: #020202; padding: 2rem; display: flex; flex-direction: column; height: 100%; overflow: hidden; }

.preview-stage {
  flex: 1; display: flex; flex-direction: column;
  background: #080808; border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.03); overflow: hidden;
  position: relative;
}

.preview-scroll-area { flex: 1; overflow-y: auto; padding: 3rem 2.5rem; }

/* Config Section Styles */
.config-section { margin-bottom: 4rem; }
.section-badge {
  display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.05);
  border-radius: 6px; font-size: 0.6rem; font-weight: 900; color: #52525b;
  letter-spacing: 0.15em; margin-bottom: 2rem;
}

.section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.section-sub { font-size: 0.8rem; color: #71717a; max-width: 300px; line-height: 1.5; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group.full { grid-column: span 2; }
.form-group label { display: block; font-size: 0.65rem; font-weight: 900; color: #52525b; margin-bottom: 0.75rem; text-transform: uppercase; }

.input-premium {
  width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; padding: 0.8rem 1.25rem; color: white; font-weight: 500; font-size: 0.9rem;
  transition: all 0.3s;
}
.input-premium:focus { border-color: #3b82f6; background: rgba(59, 130, 246, 0.03); outline: none; }
.mini-text { font-family: monospace; font-size: 0.75rem; }

.config-item-card { padding: 2rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 20px; margin-bottom: 1.5rem; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.item-header h4 { font-size: 0.85rem; font-weight: 900; color: #3b82f6; }

/* Preview Styling */
.preview-hero-block { text-align: center; margin-bottom: 5rem; }
.hub-preview-theme .p-badge { color: #2563eb; background: rgba(37,99,235,0.1); }
.research-preview-theme .p-badge { color: #10b981; background: rgba(16,185,129,0.1); }
.p-badge { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.2em; padding: 4px 12px; border-radius: 4px; display: inline-block; margin-bottom: 1.5rem; }
.p-title { font-size: 2.5rem; font-weight: 900; color: white; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.04em; }
.p-subtitle { font-size: 1rem; color: #71717a; line-height: 1.6; max-width: 440px; margin: 0 auto; }

.p-section-header { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; margin-bottom: 2rem; }
.p-section-header span { font-size: 0.6rem; font-weight: 900; color: #3f3f46; letter-spacing: 0.2em; }

.p-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.p-resource-card { background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.03); }
.p-icon { width: 24px; height: 24px; color: #3b82f6; margin-bottom: 1rem; }
.research-theme .p-icon { color: #10b981; }
.p-card-title { display: block; font-size: 0.85rem; font-weight: 800; color: white; margin-bottom: 4px; }
.p-card-count { font-size: 0.7rem; color: #3b82f6; font-weight: 700; }
.p-card-tag { font-size: 0.65rem; color: #10b981; font-weight: 800; text-transform: uppercase; }

.p-blog-skeleton { display: flex; flex-direction: column; gap: 1.5rem; }
.skeleton-item { display: flex; gap: 1rem; }
.skeleton-img { width: 80px; height: 60px; background: rgba(255,255,255,0.02); border-radius: 8px; }
.skeleton-text { height: 12px; background: rgba(255,255,255,0.02); border-radius: 4px; margin-bottom: 8px; width: 140px; }
.skeleton-text.sub { width: 80px; opacity: 0.5; }

.editor-footer { padding: 1.5rem 2.5rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end; gap: 1.25rem; background: rgba(0,0,0,0.3); }
.close-btn { background: none; border: none; color: #3f3f46; font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: white; transform: rotate(90deg); }
.remove-btn { font-size: 0.6rem; font-weight: 900; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 4px 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; }
.remove-btn:hover { background: #ef4444; color: white; }

@media (max-width: 1024px) {
  .editor-shell {
    grid-template-columns: 1fr;
  }
  .editor-controls {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .editor-preview {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .page-editor-overlay {
    padding: 0;
  }
  .resource-editor-container {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  .editor-header {
    padding: 1.5rem;
  }
  .header-meta h2 {
    font-size: 1.1rem;
  }
  .view-toggle {
    display: none;
  }
  .editor-controls {
    padding: 1.5rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full {
    grid-column: span 1;
  }
  .p-card-grid {
    grid-template-columns: 1fr;
  }
  .p-title {
    font-size: 1.8rem;
  }
  .editor-footer {
    padding: 1.5rem;
    flex-direction: column-reverse;
  }
  .editor-footer button {
    width: 100%;
  }
}
</style>
