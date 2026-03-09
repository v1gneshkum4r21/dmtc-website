<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content showcase-editor-quantum">
      <header class="modal-header">
        <div class="header-vessel">
          <div class="header-glyph">💎</div>
          <div class="header-text">
            <h2>{{ editing ? 'Edit Showcase Item' : 'Add New Item' }}</h2>
            <p>Upload an image or video to the showcase.</p>
          </div>
        </div>
        <button class="close-quantum-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-dual-surface">
        <!-- Form Surface -->
        <div class="surface-form">
          <form @submit.prevent="handleSubmit" class="intelligence-form">
            <div class="form-section">
              <label class="section-label">Item Name</label>
              <div class="input-vessel">
                <input v-model="form.title" type="text" placeholder="Visual name (e.g. App Mockup)" class="luxury-field" required />
              </div>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Page/Product</label>
                <select v-model="form.product" class="luxury-field select">
                  <option>SuperFiitter</option>
                  <option>EchoAI</option>
                  <option>Solutions</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <div class="form-section">
                <label class="section-label">Display Size</label>
                <select v-model="form.size" class="luxury-field select">
                  <option value="small">Small (33%)</option>
                  <option value="medium">Medium (66%)</option>
                  <option value="large">Large (100%)</option>
                </select>
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Display Order</label>
              <div class="order-control">
                <input v-model.number="form.order" type="number" placeholder="Order Index" class="luxury-field small" />
                <span class="helper-text">Higher numbers appear first.</span>
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Category Tag</label>
              <input v-model="form.tag" type="text" placeholder="e.g., Core Logic / Design Evolution" class="luxury-field" />
            </div>

            <div class="form-section extraction">
              <label class="section-label">Media Upload</label>
              <div class="method-toggles">
                <button type="button" :class="{ active: mediaSource === 'url' }" @click="mediaSource = 'url'">Image/Video URL</button>
                <button type="button" :class="{ active: mediaSource === 'upload' }" @click="mediaSource = 'upload'">Upload File</button>
              </div>
              
              <div v-if="mediaSource === 'url'" class="extraction-input-cluster">
                <input v-model="form.mediaUrl" type="text" placeholder="https://media.dreamactic.com/node-01.jpg" class="luxury-field fluid" @input="detectType" required />
                <div class="type-badge-mini">{{ form.mediaType.toUpperCase() }}</div>
              </div>

              <div v-else class="extraction-upload-surface">
                <div class="upload-zone-quantum" :class="{ 'has-file': selectedFile }">
                  <input type="file" @change="onFile" reset class="hidden-input" id="asset-upload-quantum" accept="image/*,video/*" />
                  <label for="asset-upload-quantum" class="upload-label">
                    <div class="upload-icon">{{ selectedFile ? '⚙️' : '🛸' }}</div>
                    <div class="upload-text">
                      <strong>{{ selectedFile ? selectedFile.name : 'Select or Drop Asset' }}</strong>
                      <span>{{ selectedFile ? 'Click to replace file' : 'Maximum file size: 50MB' }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions-strata">
              <button type="button" @click="$emit('close')" class="btn-cancel-quantum">Cancel</button>
              <button type="submit" class="btn-save-quantum" :disabled="loading">
                <span class="save-icon">{{ loading ? '⏳' : '✅' }}</span>
                {{ loading ? 'Saving...' : (editing ? 'Save Changes' : 'Create Item') }}
              </button>
            </div>
          </form>
        </div>

        <div class="surface-preview">
          <label class="section-label sticky">Preview</label>
          <div class="preview-vessel">
            <div class="preview-card-replica" :class="form.size">
              <div class="replica-chamber">
                <img v-if="previewUrl && form.mediaType === 'image'" :src="previewUrl" class="card-img" />
                <div v-else-if="previewUrl && form.mediaType === 'video'" class="card-video-placeholder">
                  <div class="play-icon">▶</div>
                  <span>Video Content Ready</span>
                </div>
                <div v-else class="empty-placeholder">
                  <div class="empty-icon">🎨</div>
                  <span>No Media Identified</span>
                </div>
                
                <div class="replica-tags">
                  <span class="replica-tag order">#{{ form.order }}</span>
                  <span class="replica-tag type">{{ form.mediaType.toUpperCase() }}</span>
                </div>
              </div>
              <div class="replica-content">
                <h4 class="replica-title">{{ form.title || 'Untitled Item' }}</h4>
                <div class="replica-meta">
                  <span class="domain">{{ form.product }}</span>
                  <span class="tag">{{ form.tag || 'Unlabeled' }}</span>
                </div>
              </div>
            </div>
            
            <div class="configuration-readout">
              <div class="readout-header">ITEM_INFO</div>
              <pre class="json-dump"><code>{
  "node_id": "{{ editing ? editing._id : 'NEW' }}",
  "spatial_scale": "{{ form.size }}",
  "active_status": {{ form.active }},
  "broadcast_ready": {{ !!(form.mediaUrl || selectedFile) }}
}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  editing: { type: Object, default: null },
  loading: Boolean
})

const emit = defineEmits(['save', 'close'])

const mediaSource = ref('url')
const selectedFile = ref(null)
const previewUrl = ref('')

const form = ref({
  title: '',
  description: '',
  mediaUrl: '',
  mediaType: 'image',
  product: 'SuperFiitter',
  tag: '',
  size: 'medium',
  order: 0,
  active: true
})

onMounted(() => {
  if (props.editing) {
    form.value = { ...props.editing }
    previewUrl.value = form.value.mediaUrl
  }
})

// Update preview URL when mediaUrl changes (URL mode)
watch(() => form.value.mediaUrl, (newUrl) => {
  if (mediaSource.value === 'url') {
    previewUrl.value = newUrl
  }
})

const detectType = () => {
  form.value.mediaType = form.value.mediaUrl.match(/\.(mp4|webm|mov)$/) ? 'video' : 'image'
}

const onFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  selectedFile.value = file
  form.value.mediaType = file.type.startsWith('video') ? 'video' : 'image'
  
  // Create local preview URL
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
.showcase-editor-quantum {
  max-width: 1000px !important;
  width: 95vw !important;
  border-radius: 40px !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-subtle) !important;
}

.modal-header {
  padding: 2.5rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-light);
}

.header-vessel { display: flex; gap: 1.5rem; align-items: center; }
.header-glyph { font-size: 2rem; }
.header-text h2 { font-size: 1.5rem; font-weight: 850; margin-bottom: 4px; color: white; }
.header-text p { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }

.close-quantum-btn {
  width: 50px; height: 50px; border-radius: 50%; border: 1px solid var(--border-subtle);
  background: transparent; color: var(--text-muted); font-size: 1.25rem; cursor: pointer;
  transition: all 0.2s;
}
.close-quantum-btn:hover { color: white; border-color: white; transform: rotate(90deg); }

.editor-dual-surface {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
}

.surface-form {
  padding: 3rem;
  border-right: 1px solid var(--border-subtle);
  max-height: 70vh;
  overflow-y: auto;
}

.surface-preview {
  padding: 3rem;
  background: rgba(0,0,0,0.2);
  max-height: 70vh;
  overflow-y: auto;
}

.intelligence-form { display: flex; flex-direction: column; gap: 2rem; }

.section-label {
  display: block; font-size: 0.7rem; font-weight: 900; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem;
}

.section-label.sticky { position: sticky; top: 0; background: transparent; z-index: 10; margin-top: -1rem; padding: 1rem 0; }

.luxury-field {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  padding: 1rem 1.25rem;
  border-radius: 16px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
}
.luxury-field:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
.luxury-field.select { cursor: pointer; appearance: none; }

.form-row-multi { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

.order-control { display: flex; align-items: center; gap: 1rem; }
.luxury-field.small { width: 120px; }
.helper-text { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

.method-toggles {
  display: flex; gap: 4px; background: var(--bg-surface); padding: 4px; border-radius: 14px;
  border: 1px solid var(--border-subtle); width: fit-content; margin-bottom: 1.5rem;
}
.method-toggles button {
  padding: 8px 18px; border: none; background: transparent; color: var(--text-muted);
  font-size: 0.75rem; font-weight: 800; border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.method-toggles button.active { background: var(--bg-elevated); color: white; box-shadow: var(--shadow-sm); }

.extraction-input-cluster { position: relative; display: flex; align-items: center; }
.type-badge-mini {
  position: absolute; right: 1rem; background: var(--primary); color: white;
  padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; font-weight: 900;
}

.upload-zone-quantum {
  border: 2px dashed var(--border-medium); border-radius: 20px; padding: 2.5rem;
  text-align: center; transition: all 0.3s; background: rgba(255,255,255,0.02);
}
.upload-zone-quantum:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
.upload-zone-quantum.has-file { border-color: var(--success); background: rgba(16, 185, 129, 0.05); }

.upload-label { cursor: pointer; display: flex; align-items: center; gap: 1.5rem; text-align: left; }
.upload-icon { font-size: 2.5rem; opacity: 0.5; transition: all 0.3s; }
.upload-zone-quantum:hover .upload-icon { transform: scale(1.1) rotate(15deg); opacity: 1; }
.upload-text strong { display: block; font-size: 0.95rem; color: white; margin-bottom: 4px; }
.upload-text span { font-size: 0.75rem; color: var(--text-muted); }

.form-actions-strata {
  display: flex; gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle); margin-top: 1rem;
}

.btn-cancel-quantum {
  padding: 1rem 1.5rem; border-radius: 16px; border: 1px solid var(--border-subtle);
  background: transparent; color: var(--text-muted); font-weight: 800; cursor: pointer; transition: all 0.2s;
}
.btn-save-quantum {
  flex: 1; padding: 1rem; border-radius: 16px; border: none; background: var(--primary-gradient);
  color: white; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2); transition: all 0.3s;
}
.btn-save-quantum:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3); }

/* Preview Card */
.preview-vessel { display: flex; flex-direction: column; gap: 2.5rem; }
.preview-card-replica {
  background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 24px;
  overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); width: 100%;
}

.replica-chamber { height: 200px; background: #000; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; }
.card-video-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--primary); }
.play-icon { width: 44px; height: 44px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; padding-left: 3px; }
.empty-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); opacity: 0.3; }
.empty-icon { font-size: 2.5rem; }

.replica-tags { position: absolute; bottom: 1rem; left: 1rem; right: 1rem; display: flex; justify-content: space-between; }
.replica-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; background: rgba(0,0,0,0.8); color: white; border: 1px solid rgba(255,255,255,0.1); }
.replica-tag.type { color: var(--primary); }

.replica-content { padding: 1.5rem; border-top: 1px solid var(--border-subtle); }
.replica-title { font-size: 1rem; font-weight: 850; margin-bottom: 8px; color: white; }
.replica-meta { display: flex; gap: 1rem; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.replica-meta .domain { color: var(--primary); }

.configuration-readout {
  background: black; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;
}
.readout-header { background: #111; padding: 10px 1.5rem; font-size: 0.65rem; font-weight: 900; color: #555; letter-spacing: 0.1em; }
.json-dump { margin: 0; padding: 1.5rem; color: #4ade80; font-size: 0.8rem; font-family: monospace; }

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
  .showcase-editor-quantum {
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
  .form-actions-strata {
    flex-direction: column;
  }
  .btn-save-quantum {
    order: -1;
  }
  .order-control {
    flex-wrap: wrap;
  }
  .luxury-field.small {
    width: 100%;
  }
}
</style>
