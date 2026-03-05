<template>
  <div class="contacts-manager">
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag" style="background-color: rgba(14, 165, 233, 0.2); color: #0ea5e9;">
            Network Comms
          </span>
        </div>
        <h1>Incoming <span class="text-gradient-primary">Transmissions</span></h1>
        <p>Review and act continuously on incoming contact form requests.</p>
      </div>
      
      <div class="header-actions">
        <div class="filter-cluster-glass">
          <div class="search-vessel">
            <span class="search-icon">🔍</span>
            <input v-model="localQuery" type="text" placeholder="Filter emails or names..." class="search-input-mini">
          </div>
        </div>
      </div>
    </header>

    <!-- Metrics Matrix -->
    <div class="metrics-row">
      <div class="metric-pill">
        <span class="val">{{ contacts.length }}</span>
        <span class="label">Total Signals</span>
      </div>
      <div class="metric-pill">
        <span class="val warning">{{ unseenCount }}</span>
        <span class="label">Unseen Bursts</span>
      </div>
      <div class="metric-pill">
        <span class="val success">{{ actionedCount }}</span>
        <span class="label">Actioned Resolves</span>
      </div>
    </div>

    <!-- Futuristic Table -->
    <div class="intelligence-table-vessel card-premium">
      <table class="futuristic-table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Email</th>
            <th>Interest</th>
            <th>Message Snippet</th>
            <th>Status</th>
            <th>Transmission Log</th>
            <th class="text-right">Ops</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in filteredContacts" :key="contact.id" @click="selectedContact = contact" class="interactive-row">
            <td>
              <div class="sender-cell">
                <div class="avatar-mini">{{ contact.name.charAt(0) }}</div>
                <span class="primary-text">{{ contact.name }}</span>
              </div>
            </td>
            <td><span class="secondary-text">{{ contact.email }}</span></td>
            <td><span class="domain-tag">{{ contact.subject }}</span></td>
            <td class="col-main">
              <span class="secondary-text truncation">{{ contact.message }}</span>
            </td>
            <td>
              <div class="status-wrapper" @click.stop>
                <select v-model="contact.status" @change="updateStatus(contact.id, contact.status)" class="status-select" :class="contact.status">
                  <option value="unseen">Unseen</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="actioned">Actioned</option>
                </select>
              </div>
            </td>
            <td><span class="delta-time">{{ formatDate(contact.createdAt) }}</span></td>
            <td class="text-right">
              <div class="ops-cluster" @click.stop>
                <button class="ops-btn" @click="selectedContact = contact" title="Preview Signal">🔭</button>
                <button class="ops-btn delete" @click="$emit('delete-contact', contact.id)" title="Purge Data">🗑</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredContacts.length === 0">
            <td colspan="7" style="text-align:center; padding: 5rem;">
               <div class="empty-glyph">📭</div>
               <h3>No transmissions identified</h3>
               <p style="opacity:0.5; font-size: 0.9rem;">The neural grid returned no matches for your current query.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- High-Fidelity Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedContact" class="modal-overlay" @click.self="selectedContact = null">
          <div class="modal-card card-premium">
            <div class="modal-aura"></div>
            
            <header class="modal-header">
              <div class="header-left">
                <div class="modal-avatar">{{ selectedContact.name.charAt(0) }}</div>
                <div class="header-info">
                  <h2>{{ selectedContact.name }}</h2>
                  <p>{{ selectedContact.email }} — Sent {{ formatDateFull(selectedContact.createdAt) }}</p>
                </div>
              </div>
              <button class="modal-close" @click="selectedContact = null">✕</button>
            </header>

            <div class="modal-body">
              <div class="detail-row">
                <label>Interest Architecture</label>
                <span class="detail-tag">{{ selectedContact.subject }}</span>
              </div>

              <div class="detail-row">
                <label>Transmission Intent</label>
                <div class="message-burst">
                  {{ selectedContact.message }}
                </div>
              </div>

              <div class="detail-row">
                <label>System status</label>
                <div class="status-control">
                  <span class="c-label">Update processing state:</span>
                  <select v-model="selectedContact.status" @change="updateStatus(selectedContact.id, selectedContact.status)" class="status-select large" :class="selectedContact.status">
                    <option value="unseen">Unseen Burst</option>
                    <option value="reviewed">Reviewed State</option>
                    <option value="actioned">Actioned Resolve</option>
                  </select>
                </div>
              </div>
            </div>

            <footer class="modal-footer">
              <div class="footer-actions">
                <button class="btn-secondary" @click="copyToClipboard(selectedContact.email)">
                  <span class="icon">📋</span> Copy Email
                </button>
                <a :href="'mailto:' + selectedContact.email" class="btn-primary-luxe">
                  <span class="icon">✉️</span> Initialize Outreach
                </a>
              </div>
              <button class="btn-danger-ghost" @click="handleDelete(selectedContact.id)">
                Purge From Records
              </button>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  contacts: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update-status', 'delete-contact'])

const localQuery = ref('')
const selectedContact = ref(null)

const unseenCount = computed(() => props.contacts.filter(c => c.status === 'unseen').length)
const actionedCount = computed(() => props.contacts.filter(c => c.status === 'actioned').length)

const filteredContacts = computed(() => {
  let list = props.contacts || []
  if (localQuery.value) {
    const q = localQuery.value.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.message.toLowerCase().includes(q))
  }
  return [...list].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const updateStatus = (id, status) => {
  emit('update-status', { id, status })
}

const handleDelete = (id) => {
  emit('delete-contact', id)
  selectedContact.value = null
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  alert('Email address copied to clipboard.')
}

const formatDate = (ds) => new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
const formatDateFull = (ds) => new Date(ds).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>

<style scoped>
.contacts-manager {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-actions { display: flex; align-items: center; gap: 2rem; }
.filter-cluster-glass {
  display: flex; align-items: center; gap: 1rem;
  background: var(--glass-light); padding: 6px; border-radius: 18px;
  border: 1px solid var(--border-subtle);
}
.search-vessel { display: flex; align-items: center; gap: 10px; padding: 0 1rem; }
.search-icon { font-size: 0.9rem; opacity: 0.5; }
.search-input-mini {
  background: transparent; border: none; color: white;
  font-size: 0.85rem; font-weight: 600; width: 200px; outline: none;
}

/* Metrics Row */
.metrics-row { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; }
.metric-pill { display: flex; align-items: baseline; gap: 10px; }
.metric-pill .val { font-size: 1.8rem; font-weight: 900; color: white; }
.metric-pill .val.success { color: var(--success); }
.metric-pill .val.warning { color: var(--warning); }
.metric-pill .label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* Table Vibe */
.intelligence-table-vessel { padding: 1rem !important; }
.futuristic-table { width: 100%; border-collapse: collapse; }
.futuristic-table th {
  padding: 1.5rem; text-align: left; font-size: 0.7rem; font-weight: 900;
  color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-medium);
}
.futuristic-table td { padding: 1.5rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
.interactive-row { cursor: pointer; transition: background 0.2s; }
.interactive-row:hover { background: rgba(255,255,255,0.03); }

.sender-cell { display: flex; align-items: center; gap: 12px; }
.avatar-mini {
  width: 28px; height: 28px; border-radius: 8px; background: var(--primary-gradient);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 900; color: white;
}

.col-main { max-width: 250px; }
.primary-text { display: block; font-size: 0.95rem; font-weight: 800; color: white; margin-bottom: 4px; }
.secondary-text { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
.truncation { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.domain-tag {
  font-size: 0.65rem; font-weight: 800; color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2);
  padding: 4px 10px; border-radius: 6px; text-transform: uppercase;
}

.status-select {
  background: var(--bg-surface); color: white; border: 1px solid var(--border-subtle);
  border-radius: 8px; padding: 6px 12px; font-size: 0.8rem; font-weight: 700; outline: none; cursor:pointer;
}
.status-select.large { padding: 10px 16px; font-size: 0.9rem; }

.status-select.unseen { border-color: var(--error); color: var(--error); }
.status-select.reviewed { border-color: var(--warning); color: var(--warning); }
.status-select.actioned { border-color: var(--success); color: var(--success); }

.ops-cluster { display: flex; gap: 8px; justify-content: flex-end; }
.ops-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-subtle);
  background: var(--bg-elevated); color: white; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
}
.ops-btn:hover { background: var(--bg-hover); border-color: var(--primary); }
.ops-btn.delete:hover { border-color: var(--error); color: var(--error); background: rgba(239, 68, 68, 0.1); }

/* Modal Orchestration */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 2rem;
}

.modal-card {
  width: 100%; max-width: 700px; max-height: 90vh;
  overflow-y: auto; position: relative;
  background: var(--bg-surface); padding: 3rem !important;
  border-radius: 32px;
}

.modal-aura {
  position: absolute; top: 0; left: 0; right: 0; height: 140px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.1), transparent);
  pointer-events: none;
}

.modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; position: relative; }
.header-left { display: flex; gap: 1.5rem; align-items: center; }
.modal-avatar {
  width: 64px; height: 64px; border-radius: 18px; background: var(--primary-gradient);
  display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: white;
}
.header-info h2 { font-size: 2rem; font-weight: 850; color: white; margin: 0; }
.header-info p { font-size: 0.95rem; color: var(--text-muted); margin-top: 4px; }

.modal-close {
  background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover { color: white; }

.detail-row { margin-bottom: 2.5rem; }
.detail-row label { display: block; font-size: 0.7rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem; }

.detail-tag {
  display: inline-block; padding: 6px 16px; border-radius: 8px;
  background: rgba(99, 102, 241, 0.1); color: var(--primary); font-weight: 800; font-size: 0.9rem;
}

.message-burst {
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);
  padding: 2rem; border-radius: 20px; color: white; line-height: 1.6; font-size: 1.1rem;
  white-space: pre-wrap;
}

.status-control { display: flex; align-items: center; gap: 1.5rem; }
.c-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }

.modal-footer {
  margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle);
  display: flex; justify-content: space-between; align-items: center;
}
.footer-actions { display: flex; gap: 1rem; }

.btn-primary-luxe {
  background: var(--primary); color: white; border: none; padding: 12px 24px;
  border-radius: 14px; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
  text-decoration: none;
}
.btn-primary-luxe:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3); }

.btn-secondary {
  background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--border-subtle);
  padding: 12px 24px; border-radius: 14px; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover { background: rgba(255,255,255,0.1); }

.btn-danger-ghost {
  background: transparent; border: none; color: var(--error); font-weight: 800; font-size: 0.85rem;
  cursor: pointer; opacity: 0.6; transition: opacity 0.2s;
}
.btn-danger-ghost:hover { opacity: 1; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }

.empty-glyph { font-size: 4rem; margin-bottom: 2rem; opacity: 0.2; }

@media (max-width: 1024px) {
  .metrics-row { gap: 1rem; }
  .metric-pill .val { font-size: 1.4rem; }
}

@media (max-width: 768px) {
  .intelligence-table-vessel { overflow-x: auto; }
  .modal-card { padding: 1.5rem !important; }
  .modal-header { flex-direction: column; gap: 1.5rem; }
  .modal-footer { flex-direction: column; gap: 2rem; align-items: flex-start; }
  .footer-actions { width: 100%; flex-direction: column; }
  .btn-primary-luxe, .btn-secondary { width: 100%; justify-content: center; }
}
</style>
