<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content science-editor-quantum shadow-2xl">
      <header class="modal-header">
        <div class="header-vessel">
          <div class="header-glyph">🔬</div>
          <div class="header-text">
            <h2>{{ editing ? 'Modify Scientific Record' : 'Initialize Research Protocol' }}</h2>
            <p>Archiving foundational breakthroughs for the global academic network.</p>
          </div>
        </div>
        <button class="close-quantum-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-dual-surface">
        <div class="surface-form">
          <form @submit.prevent="handleSubmit" class="intelligence-form">
            <!-- Core Metadata -->
            <div class="form-section">
              <label class="section-label">Paper Identity</label>
              <div class="input-vessel">
                <input v-model="form.title" type="text" placeholder="Full Title of Publication" class="luxury-field" required />
              </div>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Journal / Conference</label>
                <input v-model="form.journal" type="text" placeholder="e.g. NeurIPS 2024" class="luxury-field" required />
              </div>
              <div class="form-section">
                <label class="section-label">Publication Year</label>
                <input v-model="form.year" type="text" placeholder="2024" class="luxury-field" required />
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Authorship Sequence</label>
              <input v-model="form.authors" type="text" placeholder="Lead Author, Co-Author, et al." class="luxury-field" required />
            </div>

            <div class="form-section">
              <label class="section-label">Executive Excerpt</label>
              <textarea v-model="form.excerpt" rows="2" placeholder="Brief summary for indexing..." class="luxury-field" required></textarea>
            </div>

            <div class="form-section">
              <label class="section-label">Core Abstract</label>
              <textarea v-model="form.abstract" rows="4" placeholder="Detailed scientific abstract..." class="luxury-field" required></textarea>
            </div>

            <!-- PDF Artifact -->
            <div class="form-section artifacts">
              <label class="section-label">Publication Artifact (PDF)</label>
              <div class="form-row-multi">
                <div class="input-vessel">
                  <input v-model="form.pdfUrl" type="text" placeholder="Direct URL to PDF" class="luxury-field" />
                </div>
                <div class="input-vessel">
                  <select v-model="form.linkType" class="luxury-field select">
                    <option value="download">Download Protocol</option>
                    <option value="preview">Native Preview</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Visual Asset -->
            <div class="form-section extraction">
              <label class="section-label">Visual Representation</label>
              <div class="extraction-input-cluster">
                <input v-model="form.imageUrl" type="text" placeholder="Cover image or diagram URL" class="luxury-field" />
              </div>
            </div>

            <div class="form-actions-strata">
              <div class="network-sync-toggle">
                <input type="checkbox" id="published" v-model="form.published" class="hidden-check" />
                <label for="published" class="sync-switch-label">
                  <span class="switch-ui"></span>
                  <span class="label-text">Synchronize with Public Library</span>
                </label>
              </div>
              
              <div class="main-actions">
                <button type="button" @click="$emit('close')" class="btn-cancel-quantum">Abort Mission</button>
                <button type="submit" class="btn-save-quantum" :disabled="loading" :style="{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }">
                  <span class="save-icon">{{ loading ? '⏳' : '✅' }}</span>
                  {{ loading ? 'Synchronizing Archive...' : (editing ? 'Apply Delta Changes' : 'Initialize Record') }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Preview Surface -->
        <div class="surface-preview">
          <label class="section-label sticky">Library Rendering</label>
          <div class="preview-vessel">
            <div class="preview-paper-card">
              <div class="paper-meta">
                <span class="p-year">{{ form.year || '202X' }}</span>
                <span class="p-type">RESEARCH PAPER</span>
              </div>
              <div class="p-journal">{{ form.journal || 'DREAMATIC Research' }}</div>
              <h3 class="p-title">{{ form.title || 'Untitled Research' }}</h3>
              <p class="p-authors">{{ form.authors || 'Principal Investigators' }}</p>
              
              <div class="p-actions">
                <span class="p-btn-mock">Abstract →</span>
                <span v-if="form.pdfUrl" class="p-btn-download">
                  {{ form.linkType === 'preview' ? '👁️ View Paper' : '📥 PDF Artifact' }}
                </span>
              </div>
            </div>
            
            <div class="abstract-render">
              <div class="render-header">ABSTRACT_PREVIEW</div>
              <div class="abstract-body">
                {{ form.abstract || 'Decoding scientific methodology...' }}
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
  loading: Boolean
})

const emit = defineEmits(['save', 'close'])

const form = ref({
  title: '',
  journal: '',
  year: new Date().getFullYear().toString(),
  authors: '',
  excerpt: '',
  abstract: '',
  content: '', // Required by backend Research model
  imageUrl: '',
  pdfUrl: '',
  linkType: 'download',
  published: true
})

onMounted(() => {
  if (props.editing) {
    form.value = { ...props.editing }
  }
})

const handleSubmit = () => {
  // Ensure content matches abstract if not separately edited
  if (!form.value.content) form.value.content = form.value.abstract
  emit('save', { data: form.value })
}
</script>

<style scoped>
/* Core Modal & Form Styles (Shared with InsightEditor) */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px); z-index: 1200;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-header {
  padding: 2rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.02);
}

.header-vessel { display: flex; gap: 1.5rem; align-items: center; }
.header-glyph { font-size: 1.8rem; }
.header-text h2 { font-size: 1.4rem; font-weight: 850; margin-bottom: 4px; color: white; letter-spacing: -0.02em; }
.header-text p { font-size: 0.85rem; color: #71717a; font-weight: 500; }

.close-quantum-btn {
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
  background: transparent; color: #71717a; font-size: 1.1rem; cursor: pointer;
  transition: all 0.2s;
}
.close-quantum-btn:hover { color: white; border-color: white; transform: rotate(90deg); }

.intelligence-form { display: flex; flex-direction: column; gap: 1.8rem; }
.form-section { display: flex; flex-direction: column; }
.section-label {
  display: block; font-size: 0.65rem; font-weight: 950; color: #10b981;
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.8rem;
}

.luxury-field {
  width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  padding: 1rem 1.25rem; border-radius: 14px; color: white; font-weight: 600; font-size: 0.9rem;
  transition: all 0.3s;
}
.luxury-field:focus { border-color: #10b981; outline: none; background: rgba(16, 185, 129, 0.03); }
.luxury-field.select { cursor: pointer; appearance: none; }

.form-row-multi { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

.form-actions-strata {
  display: flex; flex-direction: column; gap: 1.5rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 1rem;
}

.network-sync-toggle { display: flex; align-items: center; }
.hidden-check { display: none; }
.sync-switch-label { display: flex; align-items: center; gap: 15px; cursor: pointer; }

.switch-ui {
  width: 48px; height: 24px; background: #27272a; border-radius: 100px; position: relative; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.05);
}
.switch-ui::after {
  content: ''; position: absolute; left: 3px; top: 3px; width: 16px; height: 16px;
  background: #71717a; border-radius: 50%; transition: all 0.3s;
}
.hidden-check:checked + .sync-switch-label .switch-ui { background: #10b981; }
.hidden-check:checked + .sync-switch-label .switch-ui::after { left: 27px; background: white; }
.label-text { font-size: 0.85rem; font-weight: 700; color: #a1a1aa; }

.main-actions { display: flex; gap: 1rem; }
.btn-cancel-quantum {
  padding: 0.8rem 1.5rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);
  background: transparent; color: #71717a; font-weight: 800; cursor: pointer; transition: all 0.2s;
}

.btn-save-quantum {
  flex: 1; padding: 0.8rem; border-radius: 14px; border: none;
  color: white; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); transition: all 0.3s;
}
.btn-save-quantum:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }

.science-editor-quantum {
  max-width: 1100px; width: 95vw; border-radius: 40px;
  overflow: hidden; background: #080808; border: 1px solid rgba(255,255,255,0.05);
}

.editor-dual-surface { display: grid; grid-template-columns: 1fr 1fr; min-height: 700px; }
.surface-form { padding: 2.5rem; border-right: 1px solid rgba(255,255,255,0.05); max-height: 80vh; overflow-y: auto; }
.surface-preview { padding: 2.5rem; background: rgba(16, 185, 129, 0.02); max-height: 80vh; overflow-y: auto; }

.section-label { color: #10b981; }

.preview-paper-card {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  padding: 3rem; border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.p-year { font-size: 0.8rem; font-weight: 900; color: #10b981; background: rgba(16,185,129,0.1); padding: 4px 12px; border-radius: 100px; }
.p-type { font-size: 0.6rem; font-weight: 900; color: #52525b; letter-spacing: 0.1em; }
.paper-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.p-journal { font-size: 0.85rem; font-weight: 700; color: #71717a; margin-bottom: 1rem; }
.p-title { font-size: 1.5rem; font-weight: 900; color: white; margin-bottom: 1.5rem; line-height: 1.2; }
.p-authors { font-size: 0.9rem; color: #a1a1aa; line-height: 1.6; margin-bottom: 3rem; }

.p-actions { display: flex; gap: 1.5rem; }
.p-btn-mock { font-size: 0.85rem; font-weight: 800; color: #10b981; }
.p-btn-download { font-size: 0.8rem; font-weight: 800; background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 8px; color: #10b981; }

.abstract-render { margin-top: 3rem; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
.render-header { background: #111; padding: 10px 1.5rem; font-size: 0.65rem; font-weight: 900; color: #333; letter-spacing: 0.1em; }
.abstract-body { padding: 2rem; color: #71717a; font-size: 0.9rem; line-height: 1.7; font-style: italic; }

@keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

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
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  .science-editor-quantum {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
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
    gap: 1rem;
  }
  .preview-paper-card {
    padding: 1.5rem;
    border-radius: 20px;
  }
  .p-title {
    font-size: 1.2rem;
  }
  .main-actions {
    flex-direction: column;
  }
  .btn-save-quantum {
    order: -1;
  }
}
</style>
