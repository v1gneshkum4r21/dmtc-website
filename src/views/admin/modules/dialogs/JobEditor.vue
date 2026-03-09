<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content recruitment-protocol-quantum">
      <header class="modal-header">
        <div class="header-vessel">
          <div class="header-glyph">📡</div>
          <div class="header-text">
            <h2>{{ editing ? 'Edit Job Opening' : 'Add New Job' }}</h2>
            <p>Fill in the job details below.</p>
          </div>
        </div>
        <button class="close-quantum-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-dual-surface">
        <!-- Form Surface -->
        <div class="surface-form">
          <form @submit.prevent="handleSubmit" class="protocol-form">
            <div class="form-section">
              <label class="section-label">Job Title</label>
              <div class="input-vessel">
                <input v-model="form.title" type="text" placeholder="e.g. Lead Developer" class="luxury-field" required />
              </div>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Team</label>
                <input v-model="form.team" type="text" placeholder="e.g. Engineering" class="luxury-field" required />
              </div>
              <div class="form-section">
                <label class="section-label">Location</label>
                <input v-model="form.location" type="text" placeholder="Remote / City" class="luxury-field" required />
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Job Description (Markdown)</label>
              <textarea v-model="form.description" rows="8" class="luxury-field code-font" placeholder="# Role Overview..." required></textarea>
            </div>

            <div class="form-section">
              <label class="section-label">Requirements</label>
              <textarea v-model="form.requirements" rows="6" class="luxury-field code-font" placeholder="e.g. 5+ years of experience..."></textarea>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Salary Range</label>
                <input v-model="form.salary_range" type="text" placeholder="e.g., $150k - $200k" class="luxury-field" />
              </div>
              <div class="form-section">
                <label class="section-label">Experience Level</label>
                <input v-model="form.experience_level" type="text" placeholder="e.g., Senior / Staff" class="luxury-field" />
              </div>
            </div>

            <div class="form-row-multi">
              <div class="form-section">
                <label class="section-label">Remote Policy</label>
                <input v-model="form.remote_policy" type="text" placeholder="e.g., Remote-First / Hybrid" class="luxury-field" />
              </div>
              <div class="form-section">
                <label class="section-label">Application Deadline</label>
                <input v-model="form.deadline" type="datetime-local" class="luxury-field" />
              </div>
            </div>

            <div class="form-section">
              <label class="section-label">Benefits & Perks (Markdown)</label>
              <textarea v-model="form.benefits" rows="4" class="luxury-field code-font" placeholder="* Comprehensive Health\n* 401k Match..."></textarea>
            </div>

            <div class="form-section">
              <label class="section-label">Tags (Comma Separated)</label>
              <input v-model="form.tags" type="text" placeholder="AI, remote, full-time" class="luxury-field" />
            </div>

            <div class="form-actions-strata">
              <div class="network-sync-toggle">
                <input type="checkbox" id="active" v-model="form.active" class="hidden-check" />
                <label for="active" class="sync-switch-label">
                  <span class="switch-ui"></span>
                  <span class="label-text">Publish Job Live</span>
                </label>
              </div>
              
              <div class="main-actions">
                <button type="button" @click="$emit('close')" class="btn-cancel-quantum">Cancel</button>
                <button type="submit" class="btn-save-quantum" :disabled="loading">
                  <span class="save-icon">{{ loading ? '⏳' : '🚀' }}</span>
                  {{ loading ? 'Saving...' : (editing ? 'Save Changes' : 'Create Job') }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Preview Surface -->
        <div class="surface-preview">
          <label class="section-label sticky">Preview</label>
          <div class="preview-vessel">
            <!-- Job Card Replica -->
            <div class="preview-job-replica">
              <div class="replica-header">
                <div class="brand-micro">DREAMACTIC // RECRUITMENT</div>
                <div class="status-marker" :class="{ live: form.active }">
                  {{ form.active ? 'LIVE' : 'DRAFT' }}
                </div>
              </div>
              
              <div class="replica-body">
                <h4 class="replica-title">{{ form.title || 'Incomplete Designation' }}</h4>
                <div class="meta-row higher-fidelity">
                  <span class="meta-item">📍 {{ form.location || 'Unknown Hub' }}</span>
                  <span class="meta-item">🛡️ {{ form.team || 'Unassigned Sub-system' }}</span>
                  <span v-if="form.salary_range" class="meta-item">💰 {{ form.salary_range }}</span>
                  <span v-if="form.remote_policy" class="meta-item">🏠 {{ form.remote_policy }}</span>
                </div>
                
                <div class="jd-mesh">
                  <div class="mesh-label">DESCRIPTION</div>
                  <div class="mesh-content">
                    {{ form.description || 'Synthesizing protocol specifications...' }}
                  </div>
                </div>

                <div v-if="form.requirements" class="jd-mesh secondary">
                  <div class="mesh-label">REQUIREMENTS</div>
                  <div class="mesh-content">
                    {{ form.requirements }}
                  </div>
                </div>

                <div v-if="form.benefits" class="jd-mesh benefits">
                  <div class="mesh-label">BENEFITS</div>
                  <div class="mesh-content">
                    {{ form.benefits }}
                  </div>
                </div>

                <div v-if="form.tags" class="tags-row">
                  <span v-for="tag in form.tags.split(',')" :key="tag" class="preview-tag">
                    #{{ tag.trim() }}
                  </span>
                </div>
              </div>

              <div class="replica-footer">
                <div class="apply-btn-mock">Apply Now</div>
              </div>
            </div>

            <!-- Health & Metrics Mock -->
            <div class="protocol-health card-premium">
              <div class="health-item">
                <label>Signal Integrity</label>
                <div class="health-bar"><div class="fill" :style="{ width: healthScore + '%' }"></div></div>
              </div>
              <div class="health-item">
                <label>Job Level</label>
                <span class="val">{{ form.experience_level || 'ENTRY_LEVEL' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  editing: { type: Object, default: null },
  loading: Boolean
})

const emit = defineEmits(['save', 'close'])

const form = ref({
  title: '',
  team: '',
  location: '',
  description: '',
  requirements: '',
  company: 'DREAMACTIC',
  tags: '',
  type: 'Full-time',
  salary_range: '',
  remote_policy: '',
  experience_level: '',
  benefits: '',
  deadline: '',
  active: true
})

onMounted(() => {
  if (props.editing) {
    form.value = { ...props.editing }
    // Clean up deadline format if needed
    if (form.value.deadline) {
      form.value.deadline = new Date(form.value.deadline).toISOString().slice(0, 16)
    }
  }
})

const healthScore = computed(() => {
  let score = 20
  if (form.value.title) score += 10
  if (form.value.description) score += 10
  if (form.value.requirements) score += 10
  if (form.value.salary_range) score += 10
  if (form.value.remote_policy) score += 10
  if (form.value.benefits) score += 10
  if (form.value.tags) score += 10
  if (form.value.deadline) score += 10
  return Math.min(score, 100)
})

const handleSubmit = () => {
  emit('save', form.value)
}
</script>

<style scoped>
.recruitment-protocol-quantum {
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

.protocol-form { display: flex; flex-direction: column; gap: 1.8rem; }

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
.btn-save-quantum:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3); }

/* Preview Card Rendering */
.preview-vessel { display: flex; flex-direction: column; gap: 2.5rem; }

.preview-job-replica {
  background: #09090b; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px;
  overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.5); width: 100%;
}

.replica-header {
  padding: 1.5rem; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; align-items: center;
}
.brand-micro { font-size: 0.6rem; font-weight: 900; color: #555; letter-spacing: 0.2em; }
.status-marker { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); padding: 4px 10px; border-radius: 100px; background: rgba(0,0,0,0.3); }
.status-marker.live { color: #818cf8; background: rgba(99, 102, 241, 0.1); }

.replica-body { padding: 2rem; }
.replica-title { font-size: 1.6rem; font-weight: 850; color: white; margin-bottom: 0.5rem; }
.meta-row { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
.meta-item { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }

.jd-mesh { background: rgba(0,0,0,0.2); border-left: 2px solid var(--primary); padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 1.5rem; }
.jd-mesh.secondary { border-left-color: var(--success); background: rgba(16, 185, 129, 0.05); }
.mesh-label { font-size: 0.6rem; font-weight: 950; color: var(--primary); letter-spacing: 0.15em; margin-bottom: 1rem; }
.jd-mesh.secondary .mesh-label { color: var(--success); }
.mesh-content { font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); white-space: pre-wrap; }

.tags-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 1rem; }
.preview-tag { font-size: 0.65rem; font-weight: 800; color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 4px 10px; border-radius: 6px; }

.replica-footer { padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.03); }
.apply-btn-mock {
  width: 100%; padding: 0.8rem; border-radius: 12px; background: #18181b; color: #818cf8;
  font-weight: 800; font-size: 0.85rem; text-align: center; border: 1px solid rgba(129, 140, 248, 0.2);
}

.protocol-health { padding: 1.5rem !important; display: flex; flex-direction: column; gap: 1.25rem; }
.health-item { display: flex; flex-direction: column; gap: 8px; }
.health-item label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
.health-bar { height: 6px; background: var(--bg-surface); border-radius: 100px; overflow: hidden; }
.health-bar .fill { height: 100%; background: var(--primary-gradient); border-radius: 100px; }
.health-item .val { font-size: 0.9rem; font-weight: 950; color: white; letter-spacing: 0.05em; }

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
  .recruitment-protocol-quantum {
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
  .preview-job-replica {
    border-radius: 12px;
  }
  .replica-title {
    font-size: 1.3rem;
  }
}
</style>
