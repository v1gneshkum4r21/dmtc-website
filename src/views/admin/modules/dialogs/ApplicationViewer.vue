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
        
        <div :class="['status-badge-quantum', application.status.toLowerCase().replace(' ', '-')]">
          <span class="pulse-dot"></span>
          {{ application.status.toUpperCase() }}
        </div>
        
        <button class="close-quantum-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="viewer-body">
        <div class="info-grid">
          <!-- Contact Strata -->
          <section class="info-section">
            <label class="section-label">Communication Node</label>
            <div class="data-pill">
              <span class="icon">📧</span>
              <span class="val">{{ application.email }}</span>
            </div>
          </section>

          <!-- Experience Strata -->
          <section class="info-section">
            <label class="section-label">Temporal Experience</label>
            <div class="data-pill">
              <span class="icon">⏳</span>
              <span class="val">{{ application.experience }}</span>
            </div>
          </section>

          <!-- Digital Footprint -->
          <section class="info-section full-width">
            <label class="section-label">Professional Neural Map</label>
            <a :href="application.linkedin" target="_blank" class="quantum-link">
              <span class="link-label">LinkedIn Protocol Data</span>
              <span class="link-icon">↗</span>
            </a>
          </section>
        </div>

        <!-- Intent Logic -->
        <section class="intent-logic-chamber">
          <label class="section-label">Candidate Intent Vector</label>
          <div class="logic-vessel">
            <div class="vessel-aura"></div>
            <p>{{ application.message || 'No mission statement provided.' }}</p>
          </div>
        </section>

        <!-- Command Actions -->
        <footer class="viewer-footer-ops">
          <template v-if="!application.isDeleted">
            <button @click="$emit('updateStatus', 'Selected')" class="op-btn-quantum admit">
              <span class="glow"></span>
              INITIALIZE ADMISSION
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

defineEmits(['close', 'updateStatus', 'restore', 'deletePermanent'])
</script>

<style scoped>
.candidate-profile-quantum {
  max-width: 800px !important;
  width: 90vw !important;
  padding: 0 !important;
  border-radius: 40px !important;
  overflow: hidden !important;
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-subtle) !important;
}

.viewer-header {
  padding: 4rem;
  background: rgba(0,0,0,0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.header-aura {
  position: absolute; inset: 0;
  background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.08), transparent 70%);
  pointer-events: none;
}

.candidate-identity { display: flex; align-items: center; gap: 2rem; z-index: 2; }

.avatar-quantum {
  width: 72px; height: 72px; background: var(--bg-elevated); border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 950; color: var(--primary);
  position: relative; border: 1px solid var(--border-subtle);
}
.avatar-ring {
  position: absolute; inset: -4px; border-radius: 24px;
  border: 2px solid var(--primary); opacity: 0.2;
}

.identity-text h2 { font-size: 1.8rem; font-weight: 950; color: white; margin-bottom: 6px; letter-spacing: -0.02em; }
.designation { font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); }
.loc-divider { color: var(--text-muted); margin: 0 4px; }
.loc { color: var(--text-muted); font-weight: 600; }

.status-badge-quantum {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 14px; background: var(--bg-elevated); border-radius: 100px;
  border: 1px solid var(--border-subtle); font-size: 0.65rem; font-weight: 900;
  letter-spacing: 0.05em; z-index: 2;
}
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); }

.status-badge-quantum.applied { color: var(--primary); border-color: rgba(99, 102, 241, 0.3); }
.status-badge-quantum.applied .pulse-dot { background: var(--primary); box-shadow: 0 0 10px var(--primary); animation: pulseDot 2s infinite; }

.status-badge-quantum.selected { color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
.status-badge-quantum.selected .pulse-dot { background: var(--success); box-shadow: 0 0 10px var(--success); }

.status-badge-quantum.rejected { color: var(--error); border-color: rgba(239, 68, 68, 0.3); }

.close-quantum-btn {
  position: absolute; top: 1.5rem; right: 1.5rem;
  width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--border-subtle);
  background: transparent; color: var(--text-muted); font-size: 1rem; cursor: pointer;
  transition: all 0.2s; z-index: 5;
}
.close-quantum-btn:hover { color: white; border-color: white; transform: rotate(90deg); }

.viewer-body { padding: 0 4rem 4rem; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 3.5rem; }
.section-label {
  display: block; font-size: 0.65rem; font-weight: 950; color: var(--primary);
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem;
}

.data-pill {
  background: var(--bg-elevated); padding: 1rem 1.25rem; border-radius: 16px;
  border: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 12px;
}
.data-pill .icon { opacity: 0.6; }
.data-pill .val { font-size: 0.95rem; font-weight: 700; color: white; }

.full-width { grid-column: span 2; }

.quantum-link {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.25rem 1.5rem; background: var(--primary-gradient); border-radius: 16px;
  text-decoration: none; transition: 0.3s;
}
.quantum-link:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }
.link-label { font-size: 0.9rem; font-weight: 900; color: white; }
.link-icon { font-size: 1.1rem; color: white; }

.intent-logic-chamber { margin-bottom: 4rem; }
.logic-vessel {
  background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 20px;
  border: 1px solid var(--border-subtle); position: relative; overflow: hidden;
}
.vessel-aura {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.02), transparent);
}
.logic-vessel p { font-size: 1rem; line-height: 1.7; color: var(--text-secondary); position: relative; z-index: 2; }

.viewer-footer-ops { display: flex; gap: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 3rem; }
.op-btn-quantum {
  flex: 1; padding: 1.1rem; border-radius: 16px; border: none;
  font-size: 0.85rem; font-weight: 950; cursor: pointer; transition: 0.3s;
  letter-spacing: 0.05em; text-transform: uppercase; position: relative; overflow: hidden;
}

.op-btn-quantum.admit { background: var(--primary-gradient); color: white; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2); }
.op-btn-quantum.admit:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4); }

.op-btn-quantum.restrict { background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border-subtle); }
.op-btn-quantum.restrict:hover { background: var(--error); color: white; border-color: var(--error); }
.op-btn-quantum.purge-perm { border-color: var(--error); color: var(--error); }

.op-btn-quantum.restore { background: var(--success); color: white; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }

@keyframes pulseDot { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  .candidate-profile-quantum {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0 !important;
  }
  .viewer-header {
    padding: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .candidate-identity {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .identity-text h2 {
    font-size: 1.4rem;
  }
  .identity-text p {
    font-size: 0.8rem;
  }
  .avatar-quantum {
    width: 60px;
    height: 60px;
  }
  .viewer-body {
    padding: 1.5rem;
  }
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .full-width {
    grid-column: span 1;
  }
  .viewer-footer-ops {
    flex-direction: column;
    padding-top: 1.5rem;
    gap: 1rem;
  }
  .op-btn-quantum {
    padding: 0.9rem;
  }
}
</style>
