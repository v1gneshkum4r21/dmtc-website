<template>
  <div class="page-editor-overlay" @click.self="$emit('close')">
    <div class="page-editor-container card-premium shadow-2xl">
      <header class="editor-header">
        <div class="header-meta">
          <span class="context-tag">{{ pageId.toUpperCase() }} NODE</span>
          <h2>Page <span class="text-gradient-primary">Architect</span></h2>
        </div>
        <div class="view-toggle">
          <span class="view-label">Live Preview Active</span>
          <div class="pulse-dot"></div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-shell">
        <!-- Controls Column -->
        <div class="editor-controls">
          <!-- Hero Section Config -->
          <section class="config-section">
            <h3>Hero Branding</h3>
            <div class="form-grid">
              <div class="form-group full">
                <label>Hero Badge</label>
                <input v-model="config.hero_badge" type="text" placeholder="e.g. AI FOR WORK" class="input-premium">
              </div>
              <div class="form-group full">
                <label>Hero Title</label>
                <input v-model="config.hero_title" type="text" placeholder="Quantum Powered..." class="input-premium">
              </div>
              <div class="form-group full">
                <label>Hero Subtitle</label>
                <textarea v-model="config.hero_subtitle" rows="3" placeholder="Transform your enterprise..." class="input-premium"></textarea>
              </div>
            </div>
          </section>

          <!-- Solutions Section Config (Service/Product) -->
          <section class="config-section" v-if="['ai-work', 'ai-service', 'ai-enterprise', 'superfitter', 'echo-ai'].includes(pageId)">
            <div class="section-header">
              <h3>Solutions Framework</h3>
              <button class="btn-ghost mini" @click="addItem('solutions')">+ Add Solution</button>
            </div>
            
            <div class="solutions-list">
              <div v-for="(sol, index) in config.solutions" :key="index" class="solution-item-card card-premium">
                <div class="item-header">
                  <h4>Solution #{{ index + 1 }}: {{ sol.title || 'Untitled' }}</h4>
                  <button class="remove-btn" @click="config.solutions.splice(index, 1)">Purge</button>
                </div>
                <!-- ... solution fields ... -->
                <div class="form-grid">
                  <div class="form-group"><label>Title</label><input v-model="sol.title" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Subtitle</label><input v-model="sol.subtitle" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Description</label><textarea v-model="sol.description" rows="2" class="input-premium"></textarea></div>
                  <!-- Color Picker -->
                  <div class="form-group full">
                    <label>Accent Logic</label>
                    <div class="color-picker-vessel">
                      <div class="preview-disk" :style="{ background: sol.accent }"></div>
                      <div class="inputs-flow">
                        <div class="color-input-vessel"><span class="color-label">Start</span><input type="color" :value="extractHex(sol.accent, 0)" @input="e => updateGradient(sol, e.target.value, 0)" class="color-input-mini"></div>
                        <div class="color-input-vessel"><span class="color-label">End</span><input type="color" :value="extractHex(sol.accent, 1)" @input="e => updateGradient(sol, e.target.value, 1)" class="color-input-mini"></div>
                      </div>
                      <input v-model="sol.accent" type="text" class="input-premium mini-text" placeholder="Gradient CSS">
                    </div>
                  </div>
                  <div class="form-group"><label>Icon</label><input v-model="sol.icon" type="text" class="input-premium"></div>
                  <div class="form-group full">
                    <label>Features (One per line)</label>
                    <textarea :value="sol.features.join('\n')" @input="e => sol.features = e.target.value.split('\n').filter(f => f.trim())" rows="3" class="input-premium"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Ecosystem Section -->
          <section class="config-section" v-if="['ai-work', 'ai-service', 'ai-enterprise', 'superfitter', 'echoai'].includes(pageId)">
            <div class="section-header">
              <h3>Ecosystem Infrastructure</h3>
              <button class="btn-ghost mini" @click="addItem('ecosystem')">+ Add Integration</button>
            </div>
            
            <div class="solutions-list">
              <div v-for="(item, index) in config.ecosystem" :key="index" class="solution-item-card card-premium">
                <div class="item-header">
                  <h4>Node: {{ item.name || 'Untitled' }}</h4>
                  <button class="remove-btn" @click="config.ecosystem.splice(index, 1)">Purge</button>
                </div>
                <div class="form-grid">
                  <div class="form-group"><label>Provider Name</label><input v-model="item.name" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Brand Color (Hex)</label><input v-model="item.color" type="color" class="color-input-mini" style="height: 42px; width: 60px;"></div>
                  <div class="form-group full"><label>Icon (SVG Data)</label><textarea v-model="item.icon" rows="2" class="input-premium" placeholder="<svg>...</svg>"></textarea></div>
                </div>
              </div>
            </div>
          </section>

          <!-- About Us Specific Sections -->
          <template v-if="pageId === 'about'">
            <!-- Approaches -->
            <section class="config-section">
              <div class="section-header"><h3>Operational Approaches</h3><button class="btn-ghost mini" @click="addItem('approaches')">+ Add Approach</button></div>
              <div v-for="(item, index) in config.approaches" :key="index" class="solution-item-card card-premium">
                <div class="item-header"><h4>Approach: {{ item.title }}</h4><button class="remove-btn" @click="config.approaches.splice(index, 1)">Purge</button></div>
                <div class="form-grid">
                  <div class="form-group"><label>Title</label><input v-model="item.title" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Accent (RGBA/Hex)</label><input v-model="item.accent" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Description</label><textarea v-model="item.description" rows="2" class="input-premium"></textarea></div>
                  <div class="form-group full"><label>Icon (Path Data)</label><input v-model="item.icon" type="text" class="input-premium"></div>
                </div>
              </div>
            </section>

            <!-- Values -->
            <section class="config-section">
              <div class="section-header"><h3>Core Principles</h3><button class="btn-ghost mini" @click="addItem('values')">+ Add Value</button></div>
              <div v-for="(val, index) in config.values" :key="index" class="solution-item-card card-premium">
                <div class="item-header"><h4>Value: {{ val.title }}</h4><button class="remove-btn" @click="config.values.splice(index, 1)">Purge</button></div>
                <div class="form-grid">
                  <div class="form-group"><label>Title</label><input v-model="val.title" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Subtitle</label><input v-model="val.subtitle" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Description</label><textarea v-model="val.description" rows="2" class="input-premium"></textarea></div>
                  <div class="form-group full"><label>Gradient</label><input v-model="val.accent" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Features (L-S separated)</label><textarea :value="val.features.join('\n')" @input="e => val.features = e.target.value.split('\n').filter(f => f.trim())" rows="2" class="input-premium"></textarea></div>
                </div>
              </div>
            </section>
          </template>

          <!-- Leadership Specific Sections -->
          <template v-if="pageId === 'leadership'">
            <section class="config-section">
              <div class="section-header"><h3>Executive Roster</h3><button class="btn-ghost mini" @click="addItem('team')">+ Add Member</button></div>
              <div v-for="(member, index) in config.team" :key="index" class="solution-item-card card-premium">
                <div class="item-header"><h4>Member: {{ member.name }}</h4><button class="remove-btn" @click="config.team.splice(index, 1)">Purge</button></div>
                <div class="form-grid">
                  <div class="form-group"><label>Name</label><input v-model="member.name" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Role</label><input v-model="member.role" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Initials</label><input v-model="member.initials" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Gradient</label><input v-model="member.accent" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Bio</label><textarea v-model="member.bio" rows="3" class="input-premium"></textarea></div>
                  <div class="form-group full">
                    <label>Image Assets</label>
                    <div class="asset-input-vessel">
                      <input v-model="member.image" type="text" placeholder="https://..." class="input-premium">
                      <div class="upload-trigger">
                        <input type="file" @change="e => handleFileUpload(e, member)" accept="image/*" class="hidden-file-input" :id="'file-' + index">
                        <label :for="'file-' + index" class="btn-ghost mini">{{ loading ? 'Scanning...' : 'Upload Link' }}</label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group full">
                    <label>Social Strategy</label>
                    <div class="socials-orchestrator">
                      <div v-for="(link, lIndex) in member.socials" :key="lIndex" class="social-link-node">
                        <div class="platform-preview">
                          <span v-html="getSocialIcon(link.url)"></span>
                        </div>
                        <input v-model="link.url" type="text" placeholder="https://linkedin.com/in/..." class="input-premium">
                        <button class="remove-btn mini" @click="member.socials.splice(lIndex, 1)">✕</button>
                      </div>
                      <button class="btn-ghost mini full-width" @click="member.socials.push({ url: '' })">+ Add Social Terminal</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="config-section">
              <div class="section-header"><h3>Strategic Advisors</h3><button class="btn-ghost mini" @click="addItem('advisors')">+ Add Advisor</button></div>
              <div v-for="(adv, index) in config.advisors" :key="index" class="solution-item-card card-premium">
                <div class="item-header"><h4>Advisor: {{ adv.name }}</h4><button class="remove-btn" @click="config.advisors.splice(index, 1)">Purge</button></div>
                <div class="form-grid">
                  <div class="form-group"><label>Name</label><input v-model="adv.name" type="text" class="input-premium"></div>
                  <div class="form-group"><label>Position</label><input v-model="adv.position" type="text" class="input-premium"></div>
                </div>
              </div>
            </section>
          </template>

          <!-- Careers Specific Sections -->
          <template v-if="pageId === 'careers'">
            <section class="config-section">
              <div class="section-header"><h3>Organizational Perks</h3><button class="btn-ghost mini" @click="addItem('perks')">+ Add Perk</button></div>
              <div v-for="(perk, index) in config.perks" :key="index" class="solution-item-card card-premium">
                <div class="item-header"><h4>Perk: {{ perk.title }}</h4><button class="remove-btn" @click="config.perks.splice(index, 1)">Purge</button></div>
                <div class="form-grid">
                  <div class="form-group"><label>Title</label><input v-model="perk.title" type="text" class="input-premium"></div>
                  <div class="form-group full"><label>Description</label><textarea v-model="perk.description" rows="2" class="input-premium"></textarea></div>
                  <div class="form-group full"><label>Icon (Path Data)</label><input v-model="perk.icon" type="text" class="input-premium"></div>
                </div>
              </div>
            </section>
          </template>
        </div>

        <!-- Live Preview Pane -->
        <aside class="editor-preview">
          <div class="preview-stage" v-if="config">
            <div class="preview-scroll-area">
              <!-- Hero Preview -->
              <div class="preview-hero-block">
                <span class="p-badge">{{ config.hero_badge }}</span>
                <h1 class="p-title" v-html="formatGradientTitle(config.hero_title)"></h1>
                <p class="p-subtitle">{{ config.hero_subtitle }}</p>
              </div>

              <!-- About Preview -->
              <div v-if="pageId === 'about'" class="about-p-wrapper">
                <div class="preview-solutions-grid">
                  <div v-for="val in config.values" :key="val.id" class="p-sol-card" :style="{ '--p-accent': val.accent }">
                    <h4 class="p-sol-title">{{ val.title }}</h4>
                    <p class="p-sol-desc">{{ val.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Leadership Preview -->
              <div v-if="pageId === 'leadership'" class="leadership-p-wrapper">
                <div class="preview-solutions-grid">
                  <div v-for="member in config.team" :key="member.name" class="p-sol-card" :style="{ '--p-accent': member.accent }">
                    <div class="p-avatar-mock" :style="{ backgroundImage: `url(${member.image})` }"></div>
                    <h4 class="p-sol-title">{{ member.name }}</h4>
                    <span class="p-role">{{ member.role }}</span>
                    <div class="p-social-row">
                      <span v-for="link in member.socials" :key="link.url" v-html="getSocialIcon(link.url)"></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Careers Preview -->
              <div v-if="pageId === 'careers'" class="careers-p-wrapper">
                <div class="preview-solutions-grid">
                  <div v-for="perk in config.perks" :key="perk.title" class="p-sol-card">
                    <div class="p-sol-icon" v-html="perk.icon"></div>
                    <h4 class="p-sol-title">{{ perk.title }}</h4>
                    <p class="p-sol-desc">{{ perk.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Solutions Preview (Service/Product) -->
              <div v-if="['ai-work', 'ai-service', 'ai-enterprise', 'superfitter', 'echo-ai'].includes(pageId)" class="preview-solutions-grid">
                <div v-for="sol in config.solutions" :key="sol.id" class="p-sol-card" :style="{ '--p-accent': sol.accent }">
                  <div class="p-sol-icon" v-html="sol.icon"></div>
                  <h4 class="p-sol-title">{{ sol.title }}</h4>
                  <p class="p-sol-desc">{{ sol.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer class="editor-footer">
        <button class="btn-ghost" @click="$emit('close')">Abandon Changes</button>
        <button class="btn-primary-luxe" :disabled="loading" @click="saveConfig">
          <span class="btn-text">{{ loading ? 'Syncing...' : 'Commit Sequence' }}</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pagesAPI, adminAPI } from '@/services/api'

const props = defineProps({
  pageId: { type: String, required: true }
})

const emit = defineEmits(['close', 'saved', 'save'])

const loading = ref(false)
const config = ref({
  hero_badge: '',
  hero_title: '',
  hero_subtitle: '',
  solutions: [],
  approaches: [],
  values: [],
  team: [],
  advisors: [],
  stats: [],
  perks: [],
  ecosystem: []
})

const loadConfig = async () => {
  loading.value = true
  try {
    const data = await pagesAPI.getConfig(props.pageId)
    if (data) {
      if (data.team) {
        data.team = data.team.map(m => ({ ...m, socials: m.socials || [] }))
      }
      data.ecosystem = data.ecosystem || []
      config.value = data
    }
  } catch (err) {
    console.error('Failed to load page config:', err)
  } finally {
    loading.value = false
  }
}

const addItem = (type) => {
  if (type === 'solutions') {
    config.value.solutions.push({ id: Date.now(), title: 'New Node', subtitle: 'Target Alpha', description: 'Intent...', features: ['Feature'], accent: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', icon: '💡' })
  } else if (type === 'approaches') {
    config.value.approaches.push({ title: 'Design', description: 'Build...', accent: 'rgba(99, 102, 241, 0.1)', icon: '' })
  } else if (type === 'values') {
    config.value.values.push({ id: Date.now(), title: 'Agent-First', subtitle: 'Architecture', description: '...', features: ['Independent'], accent: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' })
  } else if (type === 'team') {
    config.value.team.push({ name: 'New Vizier', role: 'Strategic Officer', initials: 'NV', bio: '...', accent: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', image: '', socials: [] })
  } else if (type === 'advisors') {
    config.value.advisors.push({ name: 'Advisor Name', position: 'Strategic Role' })
  } else if (type === 'perks') {
    config.value.perks.push({ title: 'New Perk', description: 'Describe...', icon: '' })
  } else if (type === 'ecosystem') {
    if (!config.value.ecosystem) config.value.ecosystem = []
    config.value.ecosystem.push({ name: 'New Provider', color: '#6366f1', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>' })
  }
}

const handleFileUpload = async (event, target) => {
  const file = event.target.files[0]
  if (!file) return
  
  loading.value = true
  try {
    const res = await adminAPI.uploadFile(file)
    target.image = res.url
  } catch (err) {
    console.error('Shadow upload failed:', err)
  } finally {
    loading.value = false
  }
}

const saveConfig = async () => {
  loading.value = true
  try {
    // Clone to avoid mutating the reactive state directly
    const payload = JSON.parse(JSON.stringify(config.value))
    
    // Sanitize payload: remove backend-specific database fields
    // so older backends don't throw 500 errors trying to update them
    delete payload._id
    delete payload.id
    delete payload.updatedAt
    
    emit('save', payload)
  } finally {
    loading.value = false
  }
}

// Gradient Logic
const extractHex = (gradientStr, index) => {
  if (!gradientStr || typeof gradientStr !== 'string') return index === 0 ? '#6366f1' : '#a855f7'
  const hexMatch = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g)
  if (hexMatch && hexMatch.length >= 2) return hexMatch[index]
  return index === 0 ? '#6366f1' : '#a855f7'
}

const updateGradient = (sol, color, index) => {
  let c1 = extractHex(sol.accent, 0)
  let c2 = extractHex(sol.accent, 1)
  
  if (index === 0) c1 = color
  else c2 = color
  
  sol.accent = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`
}

const getSocialIcon = (url) => {
  if (!url) return '🔗'
  const u = url.toLowerCase()
  if (u.includes('linkedin')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>'
  if (u.includes('twitter') || u.includes('x.com')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  if (u.includes('facebook')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>'
  if (u.includes('instagram')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4A3.6,3.6 0 0,0 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6A3.6,3.6 0 0,0 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>'
  if (u.includes('whatsapp') || u.includes('wa.me')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM6.07 17.51l-.19-.3a8.163 8.163 0 01-1.25-4.3c0-4.51 3.67-8.19 8.19-8.19 2.19 0 4.24.85 5.79 2.4s2.4 3.61 2.4 5.79c0 4.51-3.67 8.19-8.19 8.19-1.53 0-3.04-.43-4.35-1.24l-.31-.19-3.24.85.86-3.16z"/></svg>'
  if (u.includes('youtube')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.67,7.64 21.78,8.11 21.84,8.57C22,9.75 22,12 22,12C22,12 22,14.25 21.84,15.43C21.78,15.89 21.67,16.36 21.56,16.83C21.23,18.06 20.26,19.03 19.03,19.36C17.85,19.7 12,19.7 12,19.7C12,19.7 6.15,19.7 4.97,19.36C3.74,19.03 2.77,18.06 2.44,16.83C2.33,16.36 2.22,15.89 2.16,15.43C2,14.25 2,12 2,12C2,12 2,9.75 2.16,8.57C2.22,8.11 2.33,7.64 2.44,7.17C2.77,5.94 3.74,4.97 4.97,4.64C6.15,4.3 12,4.3 12,4.3C12,4.3 17.85,4.3 19.03,4.64C20.26,4.97 21.23,5.94 21.56,7.17Z"/></svg>'
  if (u.includes('threads.net')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15.42 12.56a3.86 3.86 0 0 1-3.66 2.6c-2 0-3.7-1.5-3.7-3.7S9.7 7.7 11.75 7.7c1.47 0 2.5.7 3.03 1.34l1.64-1.35c-.86-1-2.45-2.2-4.67-2.2-3.4 0-6 2.32-6 6s2.5 6.1 6 6.1c1.8 0 3.32-.6 4.38-1.58C17 15 17.65 13.84 17.85 13c3.34 0 4.15-2.52 4.15-2.52s-.76-1-3.56-.84c1-5-1.84-7.4-4.82-7.4a6.6 6.6 0 0 0-6.6 6.6c0 3.5 2.8 6.4 6.4 6.4s6.4-2.8 6.4-6.4V5a1.5 1.5 0 0 0-3 0v3.86A3.86 3.86 0 0 0 15.42 12.56Z"/></svg>'
  return '🔗'
}

const formatGradientTitle = (title) => {
  if (!title) return ''
  // Basic heuristic for preview
  const highlighters = ['Agentic', 'Future', 'Workforce', 'AI', 'Frontier', 'Automation', 'Mission']
  let formatted = title
  highlighters.forEach(word => {
    const reg = new RegExp(word, 'gi')
    formatted = formatted.replace(reg, m => `<span class="text-gradient-primary">${m}</span>`)
  })
  return formatted
}

onMounted(loadConfig)
</script>

<style scoped>
.page-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.page-editor-container {
  width: 95vw;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0c;
  border-radius: 24px;
  overflow: hidden;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.editor-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-meta h2 { font-size: 1.5rem; font-weight: 850; color: white; margin: 0; }
.context-tag { font-size: 0.6rem; font-weight: 900; color: var(--primary); letter-spacing: 0.2em; margin-bottom: 0.4rem; display: block; }

.view-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.1);
  border-radius: 100px;
}

.view-label { font-size: 0.7rem; font-weight: 800; color: #22c55e; text-transform: uppercase; }
.pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.editor-shell {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .editor-shell {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
  .editor-controls {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    overflow-y: visible;
  }
  .editor-preview {
    min-height: 500px;
  }
  .page-editor-container {
    max-height: 95vh;
  }
}

@media (max-width: 640px) {
  .page-editor-overlay {
    padding: 0;
  }
  .page-editor-container {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  .editor-header {
    padding: 1rem;
  }
  .header-meta h2 {
    font-size: 1.1rem;
  }
  .view-toggle {
    display: none;
  }
  .editor-controls {
    padding: 1rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full {
    grid-column: span 1;
  }
  .preview-solutions-grid {
    grid-template-columns: 1fr;
  }
  .editor-footer {
    padding: 1rem;
    flex-direction: column-reverse;
  }
  .editor-footer button {
    width: 100%;
  }
}

.editor-controls {
  padding: 2rem;
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.editor-preview {
  background: #050505;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.preview-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0a0a0c;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.03);
  overflow: hidden;
  position: relative;
}

.preview-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 3rem 2rem;
}

/* Preview Content Styling */
.preview-hero-block {
  text-align: center;
  margin-bottom: 4rem;
}

.p-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.p-title {
  font-size: 2.2rem;
  font-weight: 850;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.p-subtitle {
  font-size: 1rem;
  color: #a1a1aa;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

.preview-solutions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.p-sol-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 16px;
  position: relative;
}

.p-sol-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 16px;
  border: 1px solid transparent;
  background: var(--p-accent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.3;
}

.p-sol-icon { font-size: 1.5rem; margin-bottom: 1rem; }
.p-sol-icon :deep(svg) { width: 24px; height: 24px; color: white; stroke-width: 2; }

.p-avatar-mock {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: #18181b;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.p-role {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.p-sol-title { font-size: 0.9rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
.p-sol-desc { font-size: 0.75rem; color: #71717a; line-height: 1.4; margin-bottom: 1rem; }
.p-sol-features { display: flex; flex-direction: column; gap: 4px; }
.p-sol-features span { font-size: 0.65rem; color: #a1a1aa; font-weight: 600; }

/* Existing Form Styles */
.config-section { margin-bottom: 3rem; }
.config-section h3 {
  font-size: 1rem; font-weight: 800; color: white;
  margin-bottom: 1.5rem; border-left: 3px solid var(--primary);
  padding-left: 1rem;
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group.full { grid-column: span 2; }
.form-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #71717a; margin-bottom: 0.5rem; text-transform: uppercase; }

.input-premium {
  width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px; padding: 0.7rem 1rem; color: white; font-weight: 500; font-size: 0.85rem;
}

.solution-item-card { padding: 1.25rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 1.5rem; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.item-header h4 { font-size: 0.85rem; font-weight: 800; color: var(--primary); }

.color-picker-vessel {
  display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.02);
  padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
}
.preview-disk { width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; flex-shrink: 0; }
.inputs-flow { display: flex; gap: 1rem; }
.color-input-vessel { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.color-label { font-size: 0.55rem; font-weight: 900; color: #52525b; }
.color-input-mini { width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; }

.editor-footer { padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end; gap: 1rem; background: rgba(0,0,0,0.2); }
.close-btn { background: none; border: none; color: #52525b; font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: white; transform: rotate(90deg); }

.btn-ghost.mini { padding: 4px 10px; font-size: 0.7rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #a1a1aa; cursor: pointer; }
.remove-btn { font-size: 0.6rem; font-weight: 800; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 4px 8px; border-radius: 4px; cursor: pointer; }

.asset-input-vessel {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.asset-input-vessel .input-premium {
  flex: 1;
}

.upload-trigger {
  flex-shrink: 0;
}

.hidden-file-input {
  display: none;
}

.socials-orchestrator {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 12px;
}

.social-link-node {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.platform-preview {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border-radius: 8px;
  color: var(--primary);
  border: 1px solid var(--border-subtle);
}

.p-social-row {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.p-social-row span {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
  color: white;
  opacity: 0.7;
}
</style>
