<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content insight-editor-quantum">
      <header class="modal-header">
        <div class="header-vessel">
          <div class="header-glyph">📝</div>
          <div class="header-text">
            <h2>{{ editing ? 'Modify Intelligence Node' : 'Initialize Intelligence Node' }}</h2>
            <p>Drafting cognitive architectural data for the global knowledge grid.</p>
          </div>
        </div>
        <button class="close-quantum-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-dual-surface">
        <!-- Form Surface -->
        <div class="surface-form">
          <form @submit.prevent="handleSubmit" class="intelligence-form">
            <div class="form-section">
              <label class="section-label">Identity Metadata</label>
              <div class="input-vessel">
                <input v-model="form.title" type="text" placeholder="Entry Title (e.g., Neural Networks in Retail)" class="luxury-field" required />
              </div>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Lead Analyst</label>
                <input v-model="form.author" type="text" placeholder="Analyst Name" class="luxury-field" />
              </div>
              <div class="form-section">
                <label class="section-label">Neural Node Assignment</label>
                <select v-model="form.page" class="luxury-field select">
                  <option v-for="p in websitePages" :key="p.id" :value="p.id">{{ p.label }}</option>
                  <option value="uncategorized">Uncategorized</option>
                </select>
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Metadata Excerpt</label>
              <textarea v-model="form.excerpt" rows="2" placeholder="Brief summary for search indexing & card display..." class="luxury-field" required></textarea>
            </div>

            <div class="form-section contents">
              <label class="section-label">Core Logic Implementation (Markdown)</label>
              <textarea v-model="form.content" rows="12" placeholder="# Start typing with Markdown support..." class="luxury-field code-font" required></textarea>
            </div>

            <div class="form-section extraction">
              <label class="section-label">Asset Extraction Method</label>
              <div class="method-toggles">
                <button type="button" :class="{ active: mediaSource === 'url' }" @click="mediaSource = 'url'">Network URL</button>
                <button type="button" :class="{ active: mediaSource === 'upload' }" @click="mediaSource = 'upload'">Physical Upload</button>
              </div>
              
              <div v-if="mediaSource === 'url'" class="extraction-input-cluster">
                <input v-model="form.imageUrl" type="text" placeholder="https://cdn.dreamatic.com/assets/visual-01.jpg" class="luxury-field" />
              </div>

              <div v-else class="extraction-upload-surface">
                <div class="upload-zone-quantum" :class="{ 'has-file': selectedFile }">
                  <input type="file" @change="onFile" class="hidden-input" id="insight-upload-quantum" accept="image/*" />
                  <label for="insight-upload-quantum" class="upload-label">
                    <div class="upload-icon">{{ selectedFile ? '⚙️' : '🚀' }}</div>
                    <div class="upload-text">
                      <strong>{{ selectedFile ? selectedFile.name : 'Select or Drop Visual Asset' }}</strong>
                      <span>{{ selectedFile ? 'Click to replace file' : 'Optimized for high-fidelity PNG/JPG' }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions-strata">
              <div class="network-sync-toggle">
                <input type="checkbox" id="published" v-model="form.published" class="hidden-check" />
                <label for="published" class="sync-switch-label">
                  <span class="switch-ui"></span>
                  <span class="label-text">Synchronize Live to Network</span>
                </label>
              </div>
              
              <div class="main-actions">
                <button type="button" @click="$emit('close')" class="btn-cancel-quantum">Abort Mission</button>
                <button type="submit" class="btn-save-quantum" :disabled="loading">
                  <span class="save-icon">{{ loading ? '⏳' : '✅' }}</span>
                  {{ loading ? 'Synchronizing Node...' : (editing ? 'Apply Delta Changes' : 'Initialize Node') }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Preview Surface -->
        <div class="surface-preview">
          <label class="section-label sticky">Neural Grid Rendering</label>
          <div class="preview-vessel">
            <!-- Card Replica -->
            <div class="preview-card-replica">
              <div class="replica-chamber">
                <img v-if="previewUrl" :src="previewUrl" class="card-img" />
                <div v-else class="empty-placeholder">
                  <div class="empty-icon">🖼️</div>
                  <span>No Visual Asset Linked</span>
                </div>
                <div class="replica-status" :class="{ online: form.published }">
                  {{ form.published ? 'ONLINE' : 'STAGED' }}
                </div>
              </div>
              <div class="replica-content">
                <div class="domain">{{ form.page.toUpperCase() }}</div>
                <h4 class="replica-title">{{ form.title || 'Untitled Intelligence Node' }}</h4>
                <p class="replica-excerpt">{{ form.excerpt || 'Waiting for metadata input...' }}</p>
                <div class="replica-footer">
                  <span class="analyst">👤 {{ form.author }}</span>
                  <span class="read-more">Analyze Node →</span>
                </div>
              </div>
            </div>
            
            <!-- Content Rendering Preview -->
            <div class="content-rendering">
              <div class="render-header">RAW_LOG_PREVIEW</div>
              <div class="rendered-markdown">
                <h1 v-if="form.title">{{ form.title }}</h1>
                <p class="analyst-byline">By {{ form.author }}</p>
                <div class="markdown-body">
                  {{ form.content || 'Synthesizing core logic...' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  editing: { type: Object, default: null },
  websitePages: { type: Array, default: () => [] },
  loading: Boolean
})

const emit = defineEmits(['save', 'close'])

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  author: 'DREAMATIC Team',
  imageUrl: '',
  page: 'ai-work',
  published: true
})

const mediaSource = ref('url')
const selectedFile = ref(null)
const previewUrl = ref('')

onMounted(() => {
  if (props.editing) {
    form.value = { ...props.editing }
    previewUrl.value = form.value.imageUrl
  }
})

const onFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  selectedFile.value = file
  
  if (previewUrl.value && mediaSource.value === 'upload') {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

const handleSubmit = () => {
  emit('save', { data: form.value, file: selectedFile.value })
}
</script>

<style scoped>
.insight-editor-quantum {
  max-width: 1100px !important;
  width: 95vw !important;
  border-radius: 40px !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-subtle) !important;
}

.modal-header {
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-light);
}

.header-vessel { display: flex; gap: 1.5rem; align-items: center; }
.header-glyph { font-size: 1.8rem; }
.header-text h2 { font-size: 1.4rem; font-weight: 850; margin-bottom: 4px; color: white; letter-spacing: -0.02em; }
.header-text p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }

.close-quantum-btn {
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border-subtle);
  background: transparent; color: var(--text-muted); font-size: 1.1rem; cursor: pointer;
  transition: all 0.2s;
}
.close-quantum-btn:hover { color: white; border-color: white; transform: rotate(90deg); }

.editor-dual-surface {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 700px;
}

.surface-form {
  padding: 2.5rem;
  border-right: 1px solid var(--border-subtle);
  max-height: 75vh;
  overflow-y: auto;
}

.surface-preview {
  padding: 2.5rem;
  background: rgba(0,0,0,0.2);
  max-height: 75vh;
  overflow-y: auto;
}

.intelligence-form { display: flex; flex-direction: column; gap: 1.8rem; }

.section-label {
  display: block; font-size: 0.65rem; font-weight: 950; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.8rem;
}

.section-label.sticky { position: sticky; top: 0; background: transparent; z-index: 10; margin-top: -1rem; padding: 1rem 0; }

.luxury-field {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  padding: 1rem 1.25rem;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}
.luxury-field:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
.luxury-field.select { cursor: pointer; appearance: none; }
.luxury-field.code-font { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; line-height: 1.6; }

.form-row-multi { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

.form-actions-strata {
  display: flex; flex-direction: column; gap: 1.5rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle); margin-top: 1rem;
}

.network-sync-toggle { display: flex; align-items: center; }
.hidden-check { display: none; }
.sync-switch-label { display: flex; align-items: center; gap: 15px; cursor: pointer; }

.switch-ui {
  width: 48px; height: 24px; background: #27272a; border-radius: 100px; position: relative; transition: all 0.3s; border: 1px solid var(--border-subtle);
}
.switch-ui::after {
  content: ''; position: absolute; left: 3px; top: 3px; width: 16px; height: 16px;
  background: #71717a; border-radius: 50%; transition: all 0.3s;
}
.hidden-check:checked + .sync-switch-label .switch-ui { background: var(--primary); }
.hidden-check:checked + .sync-switch-label .switch-ui::after { left: 27px; background: white; }
.label-text { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }

.main-actions { display: flex; gap: 1rem; }

.btn-cancel-quantum {
  padding: 0.8rem 1.5rem; border-radius: 14px; border: 1px solid var(--border-subtle);
  background: transparent; color: var(--text-muted); font-weight: 800; cursor: pointer; transition: all 0.2s;
}
.btn-save-quantum {
  flex: 1; padding: 0.8rem; border-radius: 14px; border: none; background: var(--primary-gradient);
  color: white; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2); transition: all 0.3s;
}

/* Extraction Styles */
.method-toggles {
  display: flex; gap: 4px; background: var(--bg-surface); padding: 4px; border-radius: 14px;
  border: 1px solid var(--border-subtle); width: fit-content; margin-bottom: 1.5rem;
}
.method-toggles button {
  padding: 8px 18px; border: none; background: transparent; color: var(--text-muted);
  font-size: 0.75rem; font-weight: 800; border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.method-toggles button.active { background: var(--bg-elevated); color: white; box-shadow: var(--shadow-sm); }

.upload-zone-quantum {
  border: 2px dashed var(--border-medium); border-radius: 16px; padding: 2rem;
  text-align: center; transition: all 0.3s; background: rgba(255,255,255,0.02);
}
.upload-zone-quantum:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
.upload-zone-quantum.has-file { border-color: var(--success); background: rgba(16, 185, 129, 0.05); }

.upload-label { cursor: pointer; display: flex; align-items: center; gap: 1.5rem; text-align: left; }
.upload-icon { font-size: 2rem; opacity: 0.5; transition: all 0.3s; }
.upload-zone-quantum:hover .upload-icon { transform: scale(1.1) rotate(15deg); opacity: 1; }
.upload-text strong { display: block; font-size: 0.9rem; color: white; margin-bottom: 2px; }
.upload-text span { font-size: 0.7rem; color: var(--text-muted); }
.hidden-input { display: none; }
.btn-save-quantum:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3); }

/* Preview Card Rendering */
.preview-vessel { display: flex; flex-direction: column; gap: 2.5rem; }

.preview-card-replica {
  background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 20px;
  overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.4); width: 100%;
}

.replica-chamber { height: 180px; background: #000; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.empty-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); opacity: 0.3; }
.empty-icon { font-size: 2rem; }

.replica-status {
  position: absolute; top: 1rem; right: 1rem; padding: 3px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 900;
  background: rgba(0,0,0,0.8); color: var(--text-muted); border: 1px solid var(--border-subtle);
}
.replica-status.online { color: var(--success); border-color: var(--success); }

.replica-content { padding: 1.5rem; }
.domain { font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 0.1em; margin-bottom: 0.8rem; }
.replica-title { font-size: 1.15rem; font-weight: 850; margin-bottom: 0.8rem; color: white; line-height: 1.3; }
.replica-excerpt { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; }

.replica-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-subtle); }
.analyst { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }
.read-more { font-size: 0.7rem; font-weight: 900; color: var(--primary); }

/* Content Rendering */
.content-rendering {
  background: rgba(0,0,0,0.4); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;
}
.render-header { background: #111; padding: 10px 1.5rem; font-size: 0.65rem; font-weight: 900; color: #555; letter-spacing: 0.1em; }
.rendered-markdown { padding: 2rem; color: var(--text-secondary); }
.rendered-markdown h1 { font-size: 1.8rem; color: white; margin-bottom: 0.5rem; }
.analyst-byline { font-size: 0.8rem; font-weight: 700; color: var(--primary); margin-bottom: 2rem; }
.markdown-body { font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap; }

@media (max-width: 1024px) {
  .editor-dual-surface {
    grid-template-columns: 1fr;
    max-height: 80vh;
    overflow-y: auto;
  }
  .surface-form, .surface-preview {
    max-height: none;
    overflow-y: visible;
  }
  .surface-form {
    border-right: none;
    border-bottom: 1px solid var(--border-subtle);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  .insight-editor-quantum {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0 !important;
  }
  .modal-header {
    padding: 1.5rem;
  }
  .header-vessel {
    gap: 1rem;
  }
  .header-glyph {
    font-size: 1.4rem;
  }
  .header-text h2 {
    font-size: 1.1rem;
  }
  .header-text p {
    font-size: 0.75rem;
  }
  .surface-form, .surface-preview {
    padding: 1.5rem;
  }
  .form-row-multi {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .main-actions {
    flex-direction: column;
  }
  .btn-save-quantum {
    order: -1;
  }
  .upload-label {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
