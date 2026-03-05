<template>
  <div class="hero-manager">

    <!-- ── HEADER ──────────────────────────────────────────── -->
    <header class="module-header luxury-page-title">
      <div class="header-vessel">
        <div class="section-context">
          <span class="context-tag" style="background-color:rgba(34,211,238,0.12);color:#22d3ee;">HERO_MATRIX</span>
        </div>
        <h1>Hero <span class="text-gradient-primary">Carousel</span></h1>
        <p>Configure the landing page cinematic slides. Supports videos & images with per-slide timing.</p>
      </div>
      <div class="header-actions">
        <button class="btn-arctic-secondary" @click="addSlide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Slide
        </button>
        <button class="btn-arctic-primary" :disabled="saving" @click="saveAll">
          <div class="btn-glow"></div>
          <svg v-if="!saving" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          <span class="loader-spin" v-else></span>
          <span>{{ saving ? 'Saving…' : 'Save & Publish' }}</span>
        </button>
      </div>
    </header>

    <!-- ── SAVE TOAST ──────────────────────────────────────── -->
    <Transition name="toast-fade">
      <div v-if="saveStatus" class="save-toast" :class="saveStatus">
        {{ saveStatus === 'success' ? '✅ Carousel updated and live on the site!' : '❌ Failed to save. Check your connection.' }}
      </div>
    </Transition>

    <!-- ── LOADING ─────────────────────────────────────────── -->
    <div v-if="loading" class="loading-state">
      <div class="loading-ring"></div>
      <span>Loading carousel configuration…</span>
    </div>

    <template v-else>
      <!-- ── GLOBAL SETTINGS STRIP ───────────────────────── -->
      <div class="global-settings card-premium">
        <div class="gs-title">
          <span class="gs-icon">⚙️</span>
          <div>
            <h3>Global Carousel Settings</h3>
            <span class="gs-sub">These settings apply to the whole carousel</span>
          </div>
        </div>
        <div class="gs-controls">
          <div class="gs-control">
            <label class="gs-label">Default Slide Duration</label>
            <div class="duration-input-row">
              <input type="range" min="2" max="120" step="1" v-model.number="globalDuration" class="range-slider" />
              <span class="duration-val">{{ globalDuration }}s</span>
            </div>
            <span class="gs-hint">Per-slide duration overrides this default</span>
          </div>
          <div class="gs-control">
            <label class="gs-label">Autoplay</label>
            <div class="toggle-wrapper" @click="autoplay = !autoplay">
              <div class="toggle" :class="{ on: autoplay }">
                <div class="toggle-thumb"></div>
              </div>
              <span class="toggle-label">{{ autoplay ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="gs-control">
            <label class="gs-label">Loop</label>
            <div class="toggle-wrapper" @click="loop = !loop">
              <div class="toggle" :class="{ on: loop }">
                <div class="toggle-thumb"></div>
              </div>
              <span class="toggle-label">{{ loop ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
          <div class="gs-control">
            <label class="gs-label">Total Slides</label>
            <span class="gs-big-val">{{ slides.length }}</span>
          </div>
          <div class="gs-control">
            <label class="gs-label">Total Duration</label>
            <span class="gs-big-val">{{ totalDuration }}s</span>
          </div>
        </div>
      </div>

      <!-- ── EMPTY STATE ─────────────────────────────────── -->
      <div v-if="slides.length === 0" class="empty-state card-premium">
        <div class="empty-icon">🎬</div>
        <h3>No Slides Configured</h3>
        <p>Add your first cinematic slide to power the landing hero carousel.</p>
        <button class="btn-arctic-primary luxe-pulse" @click="addSlide">＋ Add First Slide</button>
      </div>

      <!-- ── SLIDE LIST + EDITOR ─────────────────────────── -->
      <div v-else class="editor-layout">

        <!-- Left: Slide List -->
        <div class="slide-list">
          <div class="slide-list-label">SLIDES</div>
          <div
            v-for="(slide, idx) in slides"
            :key="slide.id"
            class="slide-thumb"
            :class="{ active: activeIdx === idx }"
            @click="activeIdx = idx"
          >
            <div class="thumb-media">
              <video v-if="slide.mediaType !== 'image' && slide.url" :src="slide.url" muted loop autoplay playsinline class="thumb-vid" />
              <img v-else-if="slide.mediaType === 'image' && slide.url" :src="slide.url" class="thumb-img" />
              <div v-else class="thumb-empty">{{ slide.mediaType === 'video' ? '🎬' : '🖼' }}</div>
              <div class="thumb-overlay">
                <span class="thumb-num">{{ String(idx + 1).padStart(2, '0') }}</span>
                <span class="thumb-dur">{{ slide.duration || globalDuration }}s</span>
              </div>
            </div>
            <div class="thumb-info">
              <span class="thumb-title">{{ slide.title || 'Untitled' }}</span>
              <span class="thumb-type-badge">{{ (slide.mediaType || 'video').toUpperCase() }}</span>
            </div>
            <!-- Reorder / Delete -->
            <div class="thumb-actions">
              <button class="ta-btn" :disabled="idx === 0" @click.stop="moveSlide(idx, -1)" title="Move Up">↑</button>
              <button class="ta-btn" :disabled="idx === slides.length - 1" @click.stop="moveSlide(idx, 1)" title="Move Down">↓</button>
              <button class="ta-btn danger" @click.stop="removeSlide(idx)" title="Remove">✕</button>
            </div>
          </div>

          <button class="add-slide-cyber" @click="addSlide">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Slide
          </button>
        </div>

        <!-- Right: Slide Editor -->
        <div class="slide-editor card-premium" v-if="activeSlide">
          <!-- Editor Header -->
          <div class="se-header">
            <div class="se-num">SLIDE {{ String(activeIdx + 1).padStart(2, '0') }}</div>
            <div class="se-actions">
              <button class="se-btn" :disabled="activeIdx === 0" @click="moveSlide(activeIdx, -1)">↑ Move Up</button>
              <button class="se-btn" :disabled="activeIdx === slides.length - 1" @click="moveSlide(activeIdx, 1)">↓ Move Down</button>
              <button class="se-btn danger" @click="removeSlide(activeIdx)">🗑 Delete Slide</button>
            </div>
          </div>

          <!-- Preview Area -->
          <div class="se-preview">
            <div class="sep-media">
              <video
                v-if="activeSlide.mediaType !== 'image' && activeSlide.url"
                :src="activeSlide.url"
                muted loop autoplay playsinline
                class="sep-video"
              />
              <img
                v-else-if="activeSlide.mediaType === 'image' && activeSlide.url"
                :src="activeSlide.url"
                class="sep-video"
              />
              <div v-else class="sep-placeholder">
                <span>{{ activeSlide.mediaType === 'image' ? '🖼' : '🎬' }}</span>
                <span>Add a URL below to preview</span>
              </div>
              <!-- Overlay Info -->
              <div class="sep-overlay" v-if="activeSlide.url">
                <div class="sep-meta">
                  <span class="sep-idx">{{ String(activeIdx + 1).padStart(2,'0') }} / {{ String(slides.length).padStart(2,'0') }}</span>
                  <span class="sep-type">{{ (activeSlide.mediaType || 'video').toUpperCase() }}</span>
                </div>
                <div class="sep-text">
                  <h2 class="sep-title">{{ activeSlide.title || 'Slide Title' }}</h2>
                  <p class="sep-desc">{{ activeSlide.desc || 'Slide description goes here…' }}</p>
                </div>
                <!-- Duration bar -->
                <div class="sep-dur-bar">
                  <div class="sdbar-track">
                    <div class="sdbar-fill" :style="{ animationDuration: (activeSlide.duration || globalDuration) + 's' }"></div>
                  </div>
                  <span class="sdbar-label">{{ activeSlide.duration || globalDuration }}s</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="se-fields">
            <!-- Media Type -->
            <div class="field-group">
              <label class="field-label">Media Type</label>
              <div class="type-toggle">
                <button class="type-btn" :class="{ active: activeSlide.mediaType !== 'image' }" @click="activeSlide.mediaType = 'video'">
                  🎬 Video
                </button>
                <button class="type-btn" :class="{ active: activeSlide.mediaType === 'image' }" @click="activeSlide.mediaType = 'image'">
                  🖼 Image
                </button>
              </div>
            </div>

            <!-- Media URL + Upload -->
            <div class="field-group">
              <label class="field-label">
                {{ activeSlide.mediaType === 'image' ? 'Image URL' : 'Video URL' }}
              </label>
              <div class="url-upload-row">
                <input
                  v-model="activeSlide.url"
                  :placeholder="activeSlide.mediaType === 'image' ? 'https://example.com/hero-image.jpg' : 'https://videos.pexels.com/…mp4'"
                  class="field-input"
                  @input="autoDetectType(activeSlide)"
                />
                <label class="upload-file-btn" :for="'up-' + activeSlide.id" title="Upload file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <input :id="'up-' + activeSlide.id" type="file" :accept="activeSlide.mediaType === 'image' ? 'image/*' : 'video/*'" style="display:none" @change="e => handleUpload(e, activeSlide)" />
                </label>
              </div>
              <span class="field-hint">Paste a public URL or upload from your device (video: mp4/webm; image: jpg/png/webp)</span>
            </div>

            <!-- Two-column: Title + Description -->
            <div class="field-row-2">
              <div class="field-group">
                <label class="field-label">Slide Title <span class="char-hint">{{ (activeSlide.title||'').length }}/60</span></label>
                <input v-model="activeSlide.title" placeholder="Neural Core" class="field-input" maxlength="60" />
              </div>
              <div class="field-group">
                <label class="field-label">Description <span class="char-hint">{{ (activeSlide.desc||'').length }}/120</span></label>
                <input v-model="activeSlide.desc" placeholder="A cinematic phrase for this slide…" class="field-input" maxlength="120" />
              </div>
            </div>

            <!-- Two-column: Duration + Link -->
            <div class="field-row-2">
              <div class="field-group">
                <label class="field-label">
                  Slide Duration
                  <span class="field-badge">{{ activeSlide.duration || globalDuration }}s</span>
                </label>
                <div class="dur-slider-row">
                  <input
                    type="range" min="2" max="120" step="1"
                    :value="activeSlide.duration || globalDuration"
                    @input="e => activeSlide.duration = Number(e.target.value)"
                    class="range-slider"
                  />
                  <input
                    type="number" min="2" max="120"
                    :value="activeSlide.duration || globalDuration"
                    @change="e => activeSlide.duration = Math.min(120, Math.max(2, Number(e.target.value)))"
                    class="field-input num-input"
                  />
                </div>
                <span class="field-hint">How long this slide shows before auto-advancing (2–120 seconds)</span>
              </div>
              <div class="field-group">
                <label class="field-label">Click-through Link <span class="optional-tag">optional</span></label>
                <input v-model="activeSlide.link" placeholder="https://dreamactic.com/showcase" class="field-input" />
                <span class="field-hint">When set, clicking this slide navigates to this URL</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── SEQUENCE TIMELINE ───────────────────────────── -->
      <div class="timeline-section card-premium" v-if="slides.length > 0">
        <div class="tl-header">
          <span class="tl-title">🎞 Sequence Timeline</span>
          <span class="tl-total">Total: {{ totalDuration }}s · {{ slides.length }} slides</span>
        </div>
        <div class="tl-track">
          <div
            v-for="(s, i) in slides"
            :key="s.id"
            class="tl-seg"
            :class="{ 'tl-active': activeIdx === i }"
            :style="{ flex: (s.duration || globalDuration) }"
            @click="activeIdx = i"
            :title="`Slide ${i+1}: ${s.title || 'Untitled'} — ${s.duration || globalDuration}s`"
          >
            <div class="tl-seg-inner">
              <span class="tl-seg-num">{{ String(i+1).padStart(2,'0') }}</span>
              <span class="tl-seg-dur">{{ s.duration || globalDuration }}s</span>
            </div>
          </div>
        </div>
        <div class="tl-labels">
          <span>0s</span>
          <span>{{ Math.round(totalDuration / 2) }}s</span>
          <span>{{ totalDuration }}s</span>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { adminAPI } from '@/services/api'

const loading = ref(true)
const saving = ref(false)
const saveStatus = ref(null)
const slides = ref([])
const activeIdx = ref(0)

// Global settings
const globalDuration = ref(5)
const autoplay = ref(true)
const loop = ref(true)

const activeSlide = computed(() => slides.value[activeIdx.value] || null)

const totalDuration = computed(() =>
  slides.value.reduce((sum, s) => sum + (s.duration || globalDuration.value), 0)
)

const DEFAULT_SLIDES = [
  { id: 1, mediaType: 'video', url: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4', title: 'Neural Core', desc: 'The heartbeat of synthetic intelligence.', link: '', duration: 5 },
  { id: 2, mediaType: 'video', url: 'https://videos.pexels.com/video-files/5377684/5377684-hd_1920_1080_25fps.mp4', title: 'Future Cities', desc: 'Architecting the skyline of tomorrow.', link: '', duration: 5 },
  { id: 3, mediaType: 'video', url: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4', title: 'Global Grid', desc: 'Connecting consciousness across the void.', link: '', duration: 5 },
]

onMounted(async () => {
  try {
    const data = await adminAPI.getHeroSlides()
    if (data && data.length > 0) {
      slides.value = data.map(s => ({ duration: 5, link: '', ...s }))
      // Load saved global settings if present
      if (data[0]?._globalDuration) globalDuration.value = data[0]._globalDuration
      if (data[0]?._autoplay !== undefined) autoplay.value = data[0]._autoplay
      if (data[0]?._loop !== undefined) loop.value = data[0]._loop
    } else {
      slides.value = DEFAULT_SLIDES.map(s => ({ ...s }))
    }
  } catch {
    slides.value = DEFAULT_SLIDES.map(s => ({ ...s }))
  } finally {
    loading.value = false
  }
})

const addSlide = () => {
  slides.value.push({
    id: Date.now(),
    mediaType: 'video',
    url: '',
    title: '',
    desc: '',
    link: '',
    duration: globalDuration.value
  })
  activeIdx.value = slides.value.length - 1
}

const removeSlide = (idx) => {
  slides.value.splice(idx, 1)
  if (activeIdx.value >= slides.value.length) activeIdx.value = Math.max(0, slides.value.length - 1)
}

const moveSlide = (idx, dir) => {
  const target = idx + dir
  if (target < 0 || target >= slides.value.length) return
  ;[slides.value[idx], slides.value[target]] = [slides.value[target], slides.value[idx]]
  activeIdx.value = target
}

const autoDetectType = (slide) => {
  const url = (slide.url || '').toLowerCase()
  if (url.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/)) slide.mediaType = 'video'
  else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/)) slide.mediaType = 'image'
}

const handleUpload = async (e, slide) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    saving.value = true
    const uploaded = await adminAPI.uploadFile(file)
    slide.url = uploaded.url
    slide.mediaType = file.type.startsWith('video/') ? 'video' : 'image'
  } catch {
    alert('Upload failed. Please try again.')
  } finally {
    saving.value = false
  }
}

const saveAll = async () => {
  saving.value = true
  saveStatus.value = null
  try {
    // Embed global settings in the payload
    const payload = slides.value.map((s, i) => ({
      ...s,
      _globalDuration: i === 0 ? globalDuration.value : undefined,
      _autoplay: i === 0 ? autoplay.value : undefined,
      _loop: i === 0 ? loop.value : undefined,
    }))
    await adminAPI.saveHeroSlides(payload)
    saveStatus.value = 'success'
  } catch {
    saveStatus.value = 'error'
  } finally {
    saving.value = false
    setTimeout(() => saveStatus.value = null, 4000)
  }
}
</script>

<style scoped>
.hero-manager {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 5rem;
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── SAVE TOAST ────────── */
.save-toast {
  padding: 1rem 1.5rem; border-radius: 14px;
  font-size: 0.875rem; font-weight: 700; text-align: center;
}
.save-toast.success { background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2); color: #22d3ee; }
.save-toast.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.4s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── LOADING ───────────── */
.loading-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 5rem; color: var(--text-muted); font-weight: 600;
}
.loading-ring {
  width: 38px; height: 38px;
  border: 3px solid rgba(34,211,238,0.15);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loader-spin {
  display: inline-block; width: 12px; height: 12px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

/* ── GLOBAL SETTINGS STRIP ─ */
.global-settings {
  padding: 1.5rem 2rem !important;
}

.gs-title {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
}

.gs-icon { font-size: 1.4rem; }
.gs-title h3 { font-size: 1rem; font-weight: 850; color: white; margin: 0 0 2px; }
.gs-sub { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }

.gs-controls {
  display: flex; gap: 2.5rem; flex-wrap: wrap; align-items: flex-start;
}

.gs-control {
  display: flex; flex-direction: column; gap: 0.5rem; min-width: 160px;
}

.gs-label {
  font-size: 0.65rem; font-weight: 900; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}

.gs-hint { font-size: 0.6rem; color: var(--text-muted); opacity: 0.6; }

.gs-big-val {
  font-size: 1.6rem; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.04em;
}

.duration-input-row {
  display: flex; align-items: center; gap: 0.75rem;
}

.duration-val {
  font-size: 0.85rem; font-weight: 900; color: #22d3ee;
  font-family: monospace; min-width: 30px;
}

/* ── ARCTIC BUTTONS ───── */
.btn-arctic-primary, .btn-arctic-secondary {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 850;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: none;
  white-space: nowrap;
}

.btn-arctic-primary {
  background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
  color: #0c0c0c;
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.25);
}

.btn-arctic-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 211, 238, 0.4);
  background: linear-gradient(135deg, #67e8f9 0%, #38bdf8 100%);
}

.btn-arctic-primary:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}

.btn-arctic-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.btn-arctic-secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(8px);
}

.btn-arctic-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-glow {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.btn-arctic-primary:hover .btn-glow { opacity: 1; }

.luxe-pulse {
  animation: accent-pulse 2s infinite;
}

@keyframes accent-pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(34, 211, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
}

.loader-spin {
  width: 14px; height: 14px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: #0c0c0c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Range slider */
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 100px;
  background: rgba(255,255,255,0.08);
  outline: none;
  cursor: pointer;
  flex: 1;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 8px rgba(34,211,238,0.4);
  cursor: pointer;
  transition: transform 0.2s;
}
.range-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

/* Toggle */
.toggle-wrapper {
  display: flex; align-items: center; gap: 0.75rem; cursor: pointer; width: fit-content;
}
.toggle {
  width: 44px; height: 24px; border-radius: 100px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
  position: relative; transition: all 0.3s;
}
.toggle.on { background: rgba(34,211,238,0.2); border-color: rgba(34,211,238,0.4); }
.toggle-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: #94a3b8;
  position: absolute; top: 3px; left: 3px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle.on .toggle-thumb { background: #22d3ee; left: 23px; box-shadow: 0 0 8px rgba(34,211,238,0.5); }
.toggle-label { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); }
.toggle.on ~ .toggle-label { color: #22d3ee; }

/* ── EMPTY ─────────────── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 5rem; text-align: center;
}
.empty-icon { font-size: 3rem; }
.empty-state h3 { font-size: 1.5rem; font-weight: 850; color: white; margin: 0; }
.empty-state p { color: var(--text-muted); max-width: 380px; }

/* ── EDITOR LAYOUT ─────── */
.editor-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Left List */
.slide-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slide-list-label {
  font-size: 0.6rem; font-weight: 900; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.15em;
  padding: 0 0.25rem;
  margin-bottom: 0.25rem;
}

.slide-thumb {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.slide-thumb:hover { border-color: rgba(255,255,255,0.12); transform: translateX(2px); }
.slide-thumb.active {
  border-color: rgba(34,211,238,0.4);
  box-shadow: 0 0 0 3px rgba(34,211,238,0.06);
}

.thumb-media {
  position: relative;
  height: 80px;
  background: #000;
  overflow: hidden;
}

.thumb-vid, .thumb-img {
  width: 100%; height: 100%; object-fit: cover; opacity: 0.8;
}

.thumb-empty {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; background: #0a0a0a;
}

.thumb-overlay {
  position: absolute; inset: 0;
  padding: 0.5rem;
  display: flex; justify-content: space-between; align-items: flex-end;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}

.thumb-num {
  font-size: 0.65rem; font-weight: 900; color: white; font-family: monospace;
}

.thumb-dur {
  font-size: 0.6rem; font-weight: 900;
  background: rgba(34,211,238,0.2); border: 1px solid rgba(34,211,238,0.3);
  color: #22d3ee; padding: 2px 6px; border-radius: 5px;
}

.thumb-info {
  padding: 0.6rem 0.75rem;
  display: flex; justify-content: space-between; align-items: center;
}

.thumb-title { font-size: 0.78rem; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
.thumb-type-badge {
  font-size: 0.5rem; font-weight: 900; color: var(--text-muted);
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  padding: 2px 5px; border-radius: 4px;
}

.thumb-actions {
  display: none;
  position: absolute; top: 0.5rem; right: 0.5rem;
  gap: 0.25rem;
}
.slide-thumb:hover .thumb-actions { display: flex; }

.ta-btn {
  width: 24px; height: 24px; border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.6); color: white;
  font-size: 0.7rem; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: all 0.15s; backdrop-filter: blur(8px);
}
.ta-btn:hover { background: rgba(255,255,255,0.1); }
.ta-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.ta-btn.danger:hover { background: rgba(239,68,68,0.3); border-color: rgba(239,68,68,0.4); }

.add-slide-cyber {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: 2px dashed rgba(34, 211, 238, 0.15);
  background: rgba(34, 211, 238, 0.02);
  color: #22d3ee;
  font-size: 0.8rem;
  font-weight: 850;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-slide-cyber:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.add-slide-cyber svg {
  transition: transform 0.3s;
}

.add-slide-cyber:hover svg {
  transform: rotate(90deg);
}

/* ── SLIDE EDITOR ───────── */
.slide-editor {
  padding: 0 !important;
  overflow: hidden;
}

.se-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.se-num {
  font-size: 0.6rem; font-weight: 900; color: #22d3ee;
  background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2);
  border-radius: 6px; padding: 4px 10px; letter-spacing: 0.1em;
}

.se-actions { display: flex; gap: 0.5rem; }

.se-btn {
  padding: 6px 14px; border-radius: 9px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted);
  font-size: 0.72rem; font-weight: 800; cursor: pointer;
  transition: all 0.2s;
}
.se-btn:hover { color: white; border-color: rgba(255,255,255,0.15); background: var(--bg-elevated); }
.se-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.se-btn.danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }

/* Preview */
.se-preview { position: relative; }

.sep-media {
  height: 260px; position: relative;
  background: #000; overflow: hidden;
}

.sep-video {
  width: 100%; height: 100%; object-fit: cover; opacity: 0.7;
}

.sep-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem; background: #080808; color: var(--text-muted);
  font-size: 2.5rem;
}
.sep-placeholder span:last-child { font-size: 0.85rem; font-weight: 600; }

.sep-overlay {
  position: absolute; inset: 0;
  padding: 1.5rem;
  display: flex; flex-direction: column; justify-content: flex-end;
  background: linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.75) 100%);
}

.sep-meta {
  display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;
}
.sep-idx { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.5); font-family: monospace; }
.sep-type {
  font-size: 0.55rem; font-weight: 900;
  background: rgba(34,211,238,0.2); border: 1px solid rgba(34,211,238,0.3);
  color: #22d3ee; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.1em;
}

.sep-title { font-size: 1.4rem; font-weight: 900; color: white; margin: 0 0 4px; letter-spacing: -0.03em; }
.sep-desc { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin: 0; }
.sep-text { margin-bottom: 0.75rem; }

/* Duration bar animation */
.sep-dur-bar { display: flex; align-items: center; gap: 0.75rem; }
.sdbar-track {
  flex: 1; height: 2px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
}
.sdbar-fill {
  height: 100%; width: 0;
  background: #22d3ee;
  animation: dur-fill linear infinite;
}
@keyframes dur-fill {
  0% { width: 0%; }
  100% { width: 100%; }
}
.sdbar-label { font-size: 0.65rem; font-weight: 900; color: #22d3ee; font-family: monospace; }

/* Form fields */
.se-fields {
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1.25rem;
}

.field-group { display: flex; flex-direction: column; gap: 0.4rem; }

.field-label {
  font-size: 0.68rem; font-weight: 900; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
  display: flex; align-items: center; gap: 0.5rem;
}

.char-hint { font-size: 0.6rem; font-weight: 700; color: var(--text-muted); opacity: 0.5; font-style: normal; text-transform: none; margin-left: auto; }

.field-badge {
  font-size: 0.65rem; font-weight: 900;
  background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2);
  color: #22d3ee; padding: 2px 8px; border-radius: 6px;
  letter-spacing: 0; text-transform: none; margin-left: auto;
}

.optional-tag {
  font-size: 0.6rem; font-weight: 700; color: var(--text-muted);
  background: rgba(255,255,255,0.05); border-radius: 4px;
  padding: 2px 6px; letter-spacing: 0; text-transform: none;
}

.field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

.field-input {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 0.7rem 1rem;
  color: var(--text-primary);
  font-size: 0.9rem; font-family: inherit;
  transition: all 0.2s; outline: none; width: 100%;
}
.field-input:focus {
  border-color: rgba(34,211,238,0.35);
  background: rgba(34,211,238,0.02);
  box-shadow: 0 0 0 3px rgba(34,211,238,0.05);
}

.num-input { width: 70px !important; text-align: center; padding: 0.7rem 0.5rem; flex-shrink: 0; }

.url-upload-row { display: flex; gap: 0.5rem; }

.upload-file-btn {
  width: 44px; height: 44px; flex-shrink: 0;
  border-radius: 12px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); cursor: pointer; transition: all 0.2s;
}
.upload-file-btn:hover { background: var(--bg-elevated); color: white; border-color: rgba(255,255,255,0.15); }

.field-hint { font-size: 0.64rem; color: var(--text-muted); font-weight: 500; line-height: 1.4; }

.type-toggle { display: flex; gap: 0.5rem; }
.type-btn {
  flex: 1; padding: 0.65rem 1rem;
  border-radius: 11px; border: 1px solid var(--border-subtle);
  background: var(--bg-surface); color: var(--text-muted);
  font-size: 0.82rem; font-weight: 800; cursor: pointer; transition: all 0.2s;
}
.type-btn.active {
  background: rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.3); color: #22d3ee;
}
.type-btn:hover:not(.active) { background: var(--bg-elevated); color: white; }

.dur-slider-row { display: flex; align-items: center; gap: 0.75rem; }

/* ── TIMELINE ──────────── */
.timeline-section {
  padding: 1.5rem 2rem !important;
  display: flex; flex-direction: column; gap: 1rem;
}

.tl-header {
  display: flex; justify-content: space-between; align-items: center;
}

.tl-title { font-size: 0.75rem; font-weight: 900; color: white; }
.tl-total { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }

.tl-track {
  display: flex; gap: 4px; height: 48px; align-items: stretch;
}

.tl-seg {
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  cursor: pointer; min-width: 40px;
  transition: all 0.25s; overflow: hidden;
  position: relative;
}

.tl-seg:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
.tl-seg.tl-active { background: rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.35); }

.tl-seg-inner {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; padding: 4px;
}

.tl-seg-num {
  font-size: 0.58rem; font-weight: 900;
  color: var(--text-muted); font-family: monospace;
}
.tl-seg.tl-active .tl-seg-num { color: #22d3ee; }

.tl-seg-dur {
  font-size: 0.6rem; font-weight: 900; color: var(--text-muted);
}
.tl-seg.tl-active .tl-seg-dur { color: #22d3ee; }

.tl-labels {
  display: flex; justify-content: space-between;
  font-size: 0.6rem; font-weight: 700; color: var(--text-muted); font-family: monospace;
}

/* ── RESPONSIVE ────────── */
@media (max-width: 1100px) {
  .editor-layout { grid-template-columns: 200px 1fr; }
}

@media (max-width: 900px) {
  .editor-layout { grid-template-columns: 1fr; }
  .field-row-2 { grid-template-columns: 1fr; }
  .gs-controls { gap: 1.5rem; }
  .module-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>
