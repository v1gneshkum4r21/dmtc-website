<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content candidate-profile-quantum">
      <header class="viewer-header">
        <div class="header-aura"></div>
        <div class="candidate-identity">
          <div class="avatar-quantum">
            {{ application.name.charAt(0) }}
            <div class="avatar-ring"></div>
          </div>
          <div class="identity-text">
            <h2>{{ application.name }}</h2>
            <p class="designation">{{ application.role }} <span class="loc-divider">//</span> <span class="loc">{{ application.location }}</span></p>
          </div>
        </div>
        
        <div class="status-controls-vessel">
          <div :class="['status-badge-quantum', application.status.toLowerCase().replace(' ', '-')]">
            <span class="pulse-dot"></span>
            {{ application.status.toUpperCase() }}
          </div>
          <button class="close-quantum-btn" @click="$emit('close')">✕</button>
        </div>
      </header>

      <div class="viewer-body">
        <div class="info-mesh-grid">
          <!-- Primary Intelligence -->
          <div class="intelligence-card">
            <label class="section-label">Contact Payload</label>
            <div class="data-group">
              <div class="data-item clickable" @click="copyToClipboard(application.email)">
                <span class="icon">📧</span>
                <div class="val-wrap">
                  <span class="val-label">Node Email</span>
                  <span class="val">{{ application.email }}</span>
                </div>
              </div>
              <div class="data-item clickable" @click="copyToClipboard(application.phone)">
                <span class="icon">📱</span>
                <div class="val-wrap">
                  <span class="val-label">Logic Line</span>
                  <span class="val">{{ application.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="intelligence-card">
            <label class="section-label">Temporal Matrix</label>
            <div class="data-group">
              <div class="data-item">
                <span class="icon">⏳</span>
                <div class="val-wrap">
                  <span class="val-label">Experience Tier</span>
                  <span class="val">{{ formatExperience(application.experience) }}</span>
                </div>
              </div>
              <div class="data-item">
                <span class="icon">🗓️</span>
                <div class="val-wrap">
                  <span class="val-label">Notice Sequence</span>
                  <span class="val">{{ formatNotice(application.notice) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="intelligence-card">
            <label class="section-label">Asset Requirements</label>
            <div class="data-group">
              <div class="data-item">
                <span class="icon">💎</span>
                <div class="val-wrap">
                  <span class="val-label">Salary Spec</span>
                  <span class="val">{{ application.salary || 'Unspecified' }}</span>
                </div>
              </div>
              <div class="data-item">
                <span class="icon">📍</span>
                <div class="val-wrap">
                  <span class="val-label">Hub Origin</span>
                  <span class="val">{{ application.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Digital Artifacts -->
          <div class="intelligence-card full-width">
            <label class="section-label">Neural Artifacts & Documents</label>
            <div class="artifacts-row">
              <a v-if="application.resume" :href="application.resume" target="_blank" class="artifact-link resume">
                <span class="art-icon">📄</span>
                <div class="art-text">
                  <span class="main">FULL_RESUME_BLOB</span>
                  <span class="sub">View Protocol Document</span>
                </div>
              </a>
              <a v-if="application.linkedin" :href="application.linkedin" target="_blank" class="artifact-link linkedin">
                <span class="art-icon">🔗</span>
                <div class="art-text">
                  <span class="main">LINKEDIN_PROFILE</span>
                  <span class="sub">Professional Neural Map</span>
                </div>
              </a>
              <a v-if="application.portfolio" :href="application.portfolio" target="_blank" class="artifact-link portfolio">
                <span class="art-icon">🎨</span>
                <div class="art-text">
                  <span class="main">ARTIFACT_PORTFOLIO</span>
                  <span class="sub">Visual Proof of Work</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Intent Logic -->
        <section class="intent-logic-chamber">
          <label class="section-label">Candidate Vision Statement</label>
          <div class="logic-vessel">
            <div class="vessel-aura"></div>
            <p class="mission-text">{{ application.message || 'No mission statement provided.' }}</p>
          </div>
        </section>

        <!-- Command Actions -->
        <footer class="viewer-footer-ops">
          <template v-if="!application.isDeleted">
            <button @click="$emit('updateStatus', 'Selected')" class="op-btn-quantum admit">
              <span class="glow"></span>
              INITIALIZE ADMISSION
            </button>
            <button @click="$emit('updateStatus', 'Waiting List')" class="op-btn-quantum secondary">
              MOVE TO QUEUE
            </button>
            <button @click="$emit('updateStatus', 'Rejected')" class="op-btn-quantum restrict">
              RESTRICT ACCESS
            </button>
          </template>
          <template v-else>
            <button @click="$emit('restore')" class="op-btn-quantum restore">
              REINTEGRATE NODE
            </button>
            <button @click="$emit('deletePermanent')" class="op-btn-quantum restrict purge-perm">
              PERMANENT_PURGE
            </button>
          </template>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  application: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updateStatus', 'restore', 'deletePermanent'])

const formatExperience = (exp) => {
  const map = {
    'junior': 'Junior (0-2 years)',
    'mid': 'Mid-Level (3-5 years)',
    'senior': 'Senior (5-8 years)',
    'staff': 'Staff / Principal (8+ years)'
  }
  return map[exp] || exp || 'Unknown'
}

const formatNotice = (notice) => {
  const map = {
    'immediate': 'Immediate Availability',
    '15days': '15 Days Window',
    '30days': '30 Days Window',
    '60days': '2 Months +'
  }
  return map[notice] || notice || 'N/A'
}

const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  // Tooltip/feedback could be added here
}
</script>

<style scoped>
.candidate-profile-quantum {
  max-width: 900px !important;
  width: 95vw !important;
  padding: 0 !important;
  border-radius: 40px !important;
  overflow: hidden !important;
  background: #0a0a0c !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 50px 100px rgba(0,0,0,0.8);
}

.viewer-header {
  padding: 3rem 4rem;
  background: rgba(255,255,255,0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.header-aura {
  position: absolute; inset: 0;
  background: radial-gradient(circle at top left, rgba(16, 185, 129, 0.08), transparent 70%);
  pointer-events: none;
}

.candidate-identity { display: flex; align-items: center; gap: 2rem; z-index: 2; }

.avatar-quantum {
  width: 72px; height: 72px; background: rgba(16, 185, 129, 0.1); border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 950; color: #10b981;
  position: relative; border: 1px solid rgba(16, 185, 129, 0.2);
}
.avatar-ring {
  position: absolute; inset: -4px; border-radius: 24px;
  border: 2px solid #10b981; opacity: 0.15;
}

.identity-text h2 { font-size: 2rem; font-weight: 950; color: white; margin-bottom: 6px; letter-spacing: -0.02em; }
.designation { font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.5); }
.loc-divider { color: rgba(255,255,255,0.2); margin: 0 6px; }
.loc { color: #10b981; font-weight: 700; }

.status-controls-vessel { display: flex; align-items: center; gap: 1.5rem; z-index: 2; }

.status-badge-quantum {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; background: rgba(255,255,255,0.03); border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.08); font-size: 0.65rem; font-weight: 900;
  letter-spacing: 0.1em;
}
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; opacity: 0.8; }

.status-badge-quantum.applied { color: #10b981; border-color: rgba(16, 185, 129, 0.3); }
.status-badge-quantum.applied .pulse-dot { background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulseDot 2s infinite; }

.status-badge-quantum.selected { color: #10b981; background: rgba(16, 185, 129, 0.1); border-color: #10b981; }
.status-badge-quantum.selected .pulse-dot { background: #10b981; }

.status-badge-quantum.rejected { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
.status-badge-quantum.waiting-list { color: #f59e0b; border-color: rgba(245, 158, 11, 0.3); }

.close-quantum-btn {
  width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: rgba(255,255,255,0.4); font-size: 1rem; cursor: pointer;
  transition: all 0.3s;
}
.close-quantum-btn:hover { color: white; border-color: white; background: rgba(255,255,255,0.1); transform: rotate(90deg); }

.viewer-body { padding: 4rem; max-height: 70vh; overflow-y: auto; scrollbar-width: none; }
.viewer-body::-webkit-scrollbar { display: none; }

.info-mesh-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin-bottom: 4rem; }

.intelligence-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.50rem;
  border-radius: 20px;
}
.intelligence-card.full-width { grid-column: span 3; }

.section-label {
  display: block; font-size: 0.6rem; font-weight: 950; color: #10b981;
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1.25rem;
}

.data-group { display: flex; flex-direction: column; gap: 1.25rem; }
.data-item { display: flex; align-items: flex-start; gap: 1rem; }
.data-item.clickable { cursor: pointer; transition: 0.2s; }
.data-item.clickable:hover { transform: translateX(5px); }

.data-item .icon { font-size: 1.25rem; opacity: 0.8; margin-top: 2px; }
.val-wrap { display: flex; flex-direction: column; gap: 2px; }
.val-label { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; }
.val { font-size: 0.9rem; font-weight: 700; color: white; word-break: break-all; }

.artifacts-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
.artifact-link {
  display: flex; align-items: center; gap: 1rem; padding: 1rem;
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; text-decoration: none; transition: 0.3s;
}
.artifact-link:hover { transform: translateY(-3px); background: rgba(16, 185, 129, 0.05); border-color: #10b981; }

.art-icon { font-size: 1.5rem; }
.art-text { display: flex; flex-direction: column; }
.art-text .main { font-size: 0.75rem; font-weight: 900; color: white; letter-spacing: 0.05em; }
.art-text .sub { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.4); }

.intent-logic-chamber { margin-bottom: 4rem; }
.logic-vessel {
  background: rgba(0,0,0,0.2); padding: 2.5rem; border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.03); position: relative; overflow: hidden;
}
.mission-text { font-size: 1.1rem; line-height: 1.8; color: rgba(255,255,255,0.7); position: relative; z-index: 2; }

.viewer-footer-ops { display: flex; gap: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3rem; }
.op-btn-quantum {
  flex: 1; padding: 1.25rem; border-radius: 18px; border: none;
  font-size: 0.8rem; font-weight: 950; cursor: pointer; transition: 0.3s;
  letter-spacing: 0.05em; text-transform: uppercase;
}

.op-btn-quantum.admit { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
.op-btn-quantum.secondary { background: rgba(255,255,255,0.03); color: white; border: 1px solid rgba(255,255,255,0.1); }
.op-btn-quantum.restrict { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

.op-btn-quantum.admit:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4); }
.op-btn-quantum.secondary:hover { background: rgba(255,255,255,0.08); }
.op-btn-quantum.restrict:hover { background: #ef4444; color: white; }

.op-btn-quantum.restore { background: #10b981; color: white; }
.op-btn-quantum.purge-perm { border-color: #ef4444; color: #ef4444; }

@keyframes pulseDot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

@media (max-width: 900px) {
  .info-mesh-grid { grid-template-columns: 1fr 1fr; }
  .intelligence-card.full-width { grid-column: span 2; }
  .artifacts-row { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .info-mesh-grid { grid-template-columns: 1fr; }
  .intelligence-card.full-width { grid-column: span 1; }
  .viewer-footer-ops { flex-direction: column; }
  .viewer-header { padding: 2rem; flex-direction: column; align-items: flex-start; gap: 2rem; }
  .candidate-identity { flex-direction: column; align-items: flex-start; }
}
</style>
