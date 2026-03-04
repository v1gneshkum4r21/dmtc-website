<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card">
          <!-- Ambient Background Elements -->
          <div class="modal-blobs">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
          </div>

          <!-- Close Button -->
          <button class="close-btn" @click="$emit('close')" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-layout" ref="scrollContainer">
            <!-- Left Side: Job Details -->
            <div class="modal-content-section">
              <div class="job-header">
                <div class="header-badge">{{ job.type || 'FULL-TIME' }}</div>
                <h1 class="job-title">{{ job.title }}</h1>
                <div class="job-meta-row">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{{ job.location }}</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ job.team }}</span>
                  </div>
                </div>
              </div>

              <div class="job-body">
                <section class="body-block">
                  <h3 class="section-title">The Role</h3>
                  <div class="description-text" v-html="formatMarkdown(job.description)"></div>
                </section>

                <section class="body-block" v-if="job.requirements">
                  <h3 class="section-title">Requirements</h3>
                  <ul class="points-list">
                    <li v-for="(req, idx) in formatList(job.requirements)" :key="idx">
                      <span class="point-dot"></span>
                      {{ req }}
                    </li>
                  </ul>
                </section>

                <section class="body-block" v-if="job.benefits">
                  <h3 class="section-title">Perks & Benefits</h3>
                  <div class="perks-grid">
                    <div v-for="(ben, idx) in formatList(job.benefits)" :key="idx" class="perk-tag">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {{ ben }}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <!-- Right Side: Action Sidebar -->
            <div class="modal-action-sidebar">
              <div class="sidebar-pattern"></div>
              <div class="sidebar-content">
                <div class="stat-card" v-if="job.salary_range">
                  <span class="stat-label">COMPENSATION</span>
                  <div class="stat-value text-gradient">{{ job.salary_range }}</div>
                </div>

                <div class="stat-card" v-if="job.experience_level">
                  <span class="stat-label">EXPERIENCE</span>
                  <div class="stat-value">{{ job.experience_level }}</div>
                </div>

                <div class="stat-card" v-if="job.remote_policy">
                  <span class="stat-label">REMOTE POLICY</span>
                  <div class="stat-value">{{ job.remote_policy }}</div>
                </div>

                <div class="stat-card" v-if="job.deadline">
                  <span class="stat-label">APPLICATION DEADLINE</span>
                  <div class="stat-value">{{ formatDate(job.deadline) }}</div>
                </div>

                <div class="sidebar-actions">
                  <button class="primary-btn apply-btn" @click="handleApply">
                    <span>Apply Now</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                  <button class="secondary-btn share-btn" @click="shareProtocol">
                    <span>Share Opening</span>
                  </button>
                </div>

                <div class="sidebar-footer">
                  <p>Dreamactic is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  job: { type: Object, required: true }
})

const emit = defineEmits(['close', 'apply'])
const scrollContainer = ref(null)

const handleApply = () => {
  emit('apply', props.job)
  emit('close')
}

const shareProtocol = () => {
  const url = window.location.origin + '/careers?job=' + (props.job.id || props.job._id)
  navigator.clipboard.writeText(url)
  alert('Link copied to clipboard')
}

const formatMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\n/g, '<br>')
}

const formatList = (reqs) => {
  if (!reqs) return []
  return reqs.split(/\n|•|\*/).map(r => r.trim()).filter(r => r.length > 0)
}

const formatDate = (ds) => {
  if (!ds) return 'Rolling'
  return new Date(ds).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      if (scrollContainer.value) scrollContainer.value.scrollTop = 0
    }, 50)
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 10000;
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: var(--glass-bg);
  backdrop-filter: blur(60px);
  -webkit-backdrop-filter: blur(60px);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
}

.modal-blobs {
  position: absolute; inset: 0; pointer-events: none; z-index: -1; opacity: 0.4;
}
.blob { position: absolute; filter: blur(80px); border-radius: 50%; }
.blob-1 { width: 300px; height: 300px; background: rgba(99, 102, 241, 0.2); top: -100px; right: -50px; }
.blob-2 { width: 400px; height: 400px; background: rgba(168, 85, 247, 0.15); bottom: -150px; left: -100px; }

.close-btn {
  position: absolute; top: 2rem; right: 2rem;
  width: 44px; height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 30;
  transition: all 0.3s;
}
.close-btn:hover { background: rgba(255, 255, 255, 0.1); transform: rotate(90deg); border-color: var(--accent-primary); }

.modal-layout {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  max-height: 90vh;
  overflow-y: auto;
}

/* --- Content Section --- */
.modal-content-section {
  padding: 5rem;
  background: rgba(255, 255, 255, 0.01);
}

.header-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 850;
  color: var(--accent-primary);
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.job-title {
  font-size: 3.5rem;
  font-weight: 850;
  line-height: 1.1;
  color: white;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
}

.job-meta-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 4rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
}

.job-body {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 850;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1.5rem;
}

.description-text {
  font-size: 1.15rem;
  line-height: 1.7;
  color: #e2e8f0;
}

.points-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.points-list li {
  display: flex;
  gap: 1.25rem;
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.5;
}

.point-dot {
  width: 8px; height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
  margin-top: 0.5rem;
  flex-shrink: 0;
  box-shadow: 0 0 10px var(--accent-primary);
}

.perks-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.perk-tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
}

/* --- Sidebar Section --- */
.modal-action-sidebar {
  padding: 5rem 3rem;
  background: rgba(99, 102, 241, 0.05);
  border-left: 1px solid var(--glass-border);
  position: relative;
}

.sidebar-pattern {
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='white' fill-opacity='0.05'/%3E%3C/svg%3E");
}

.sidebar-content { position: relative; z-index: 2; }

.stat-card {
  margin-bottom: 2.5rem;
}

.stat-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 850;
  color: var(--text-secondary);
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

.text-gradient {
  background: linear-gradient(135deg, var(--accent-primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 4rem 0 3rem;
}

.apply-btn {
  width: 100%;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1.25rem;
  font-size: 1.1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}
.apply-btn:hover { background: var(--accent-hover); transform: translateY(-3px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3); }

.share-btn {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 16px;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}
.share-btn:hover { background: rgba(255, 255, 255, 0.05); border-color: white; }

.sidebar-footer p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  opacity: 0.7;
}

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-fade-enter-active .modal-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from .modal-card { transform: scale(0.95) translateY(30px); opacity: 0; }

/* Responsive */
@media (max-width: 1024px) {
  .modal-layout { grid-template-columns: 1fr; }
  .modal-action-sidebar { border-left: none; border-top: 1px solid var(--glass-border); padding: 4rem 5rem; }
  .modal-content-section { padding: 4rem 5rem; }
}

@media (max-width: 768px) {
  .job-title { font-size: 2.5rem; }
  .job-meta-row { flex-direction: column; gap: 1rem; }
  .modal-content-section, .modal-action-sidebar { padding: 3rem 2rem; }
  .job-body { gap: 2.5rem; }
  .modal-card { border-radius: 20px; }
}
</style>
