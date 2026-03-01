
<template>
  <Transition name="modal-fade">
    <div v-if="isOpen && insight" class="insight-modal-overlay" @click.self="$emit('close')">
      <div class="modal-bg-glows">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>
      <div class="insight-modal-container">
        <div class="scroll-progress-container">
          <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
        </div>


        <div class="modal-content-scroller" ref="scroller" @scroll="handleScroll">
          <div class="content-vignette top"></div>
          <!-- Hero Header -->
          <div class="modal-hero">
            <div class="header-meta">
              <span v-if="insight.page" class="category-badge">{{ insight.page.replace('-', ' ') }}</span>
              <span class="meta-separator">•</span>
              <span class="date">{{ insight.journal ? insight.journal + ' · ' + insight.year : formatDate(insight.createdAt) }}</span>
              <span class="meta-separator">•</span>
              <span class="reading-time">{{ estimateReadingTime(insight.content) }} min read</span>
            </div>
            <h1 class="modal-title">{{ insight.title }}</h1>
            <div class="author-box">
              <div class="author-avatar">{{ insight.author ? insight.author.charAt(0) : 'D' }}</div>
              <div class="author-info">
                <span class="author-name">{{ insight.author || 'DREAMATIC Team' }}</span>
                <span class="author-role">Research & Insights</span>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="modal-image-wrapper" v-if="insight.imageUrl">
            <img :src="insight.imageUrl" :alt="insight.title" class="featured-image" />
            <div class="image-gradient"></div>
          </div>


          <!-- Article Body -->
          <div class="modal-article-body">
            <div class="article-lead-section">
              <p class="lead-excerpt">{{ insight.excerpt }}</p>
              <div class="neural-line"></div>
            </div>
            
            <div class="content-text" v-html="formattedContent"></div>
            
            <div class="article-footer">
              <div class="tags">
                <span class="tag">#AgenticAI</span>
                <span class="tag">#FutureOfWork</span>
                <span class="tag">#Innovation</span>
              </div>
              <div class="share-section">
                <span>Share this insight:</span>
                <div class="share-icons">
                  <button class="share-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.39 4.6 17.28 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93-1.45 1.14-3.29 1.82-5.28 1.82-.34 0-.68-.02-1.02-.06C2.01 20.25 4.34 21 6.8 21 14.59 21 18.84 14.54 18.84 8.94c0-.18 0-.37-.01-.55.84-.6 1.56-1.36 2.13-2.22z"/></svg></button>
                  <button class="share-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.3-3.3 3.3 3.3 0 0 0-3.1 1.9h-.1V10h-2.9v8.5h3v-4.7c0-1.4.3-2.7 2-2.7s2 1.3 2 2.8v4.6h3zM6.5 8.3a1.8 1.8 0 0 0 1.8-1.8 1.8 1.8 0 0 0-1.8-1.8 1.8 1.8 0 0 0-1.8 1.8 1.8 1.8 0 0 0 1.8 1.8m1.5 1.7h-3v8.5h3V10z"/></svg></button>
                </div>
              </div>
            </div>

            <div class="bottom-actions">
              <a
                v-if="insight.pdfUrl"
                :href="insight.pdfUrl"
                target="_blank"
                rel="noopener"
                class="download-btn"
              >
                <template v-if="insight.linkType === 'preview'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View Full Paper
                </template>
                <template v-else>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </template>
              </a>
              <button class="finish-btn" @click="$emit('close')">
                Finish Reading
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="content-vignette bottom"></div>
        </div>

        <!-- Custom Scrollbar -->
        <div class="custom-scrollbar-track">
          <div class="custom-scrollbar-thumb" :style="{ height: thumbHeight + '%', top: thumbTop + '%' }"></div>
        </div>

        <!-- Sticky Close Button - Moved to end to ensure correct stacking -->
        <button class="close-btn" @click="$emit('close')" aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  insight: Object
})

defineEmits(['close'])

const scroller = ref(null)
const scrollProgress = ref(0)
const thumbHeight = ref(30)
const thumbTop = ref(0)

// Lock scroll when open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    scrollProgress.value = 0
    thumbTop.value = 0
  } else {
    document.body.style.overflow = ''
  }
})

const handleScroll = () => {
  if (!scroller.value) return
  const el = scroller.value
  const scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight)
  scrollProgress.value = Math.min(100, Math.max(0, scrollRatio * 100))

  // Custom scrollbar thumb positioning
  const visibleRatio = el.clientHeight / el.scrollHeight
  thumbHeight.value = Math.max(8, visibleRatio * 100) // min 8% height
  thumbTop.value = scrollRatio * (100 - thumbHeight.value)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Latest'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const estimateReadingTime = (content) => {
  if (!content) return 2
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute) || 2
}

const formattedContent = computed(() => {
  if (!props.insight?.content) return ''
  return props.insight.content
    .split('\n\n')
    .map(p => {
      const formatted = p.replace(/\n/g, '<br>')
      return `<p>${formatted}</p>`
    })
    .join('')
})

</script>

<style scoped>
.insight-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: env(safe-area-inset-top, 2rem) 1rem env(safe-area-inset-bottom, 2rem);
}

.insight-modal-container {
  background: rgba(10, 10, 12, 0.96);
  width: 100%;
  max-width: 1000px;
  height: auto;
  max-height: 82vh;
  border-radius: 44px;
  border: 1px solid var(--glass-border);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 50px 100px rgba(0, 0, 0, 0.8),
    inset 0 0 80px rgba(99, 102, 241, 0.05);
  animation: modalSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

/* Background Glows */
.modal-bg-glows {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.glow {
  position: absolute;
  width: 600px;
  height: 600px;
  filter: blur(120px);
  opacity: 0.15;
  border-radius: 50%;
}

.glow-1 {
  top: -200px;
  left: -200px;
  background: var(--accent-primary);
  animation: glowMove 15s infinite alternate;
}

.glow-2 {
  bottom: -200px;
  right: -200px;
  background: #a855f7;
  animation: glowMove 20s infinite alternate-reverse;
}

@keyframes glowMove {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(100px, 50px) scale(1.2); }
}

@keyframes modalSlideUp {
  from { transform: translateY(60px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.close-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  transform: rotate(90deg) scale(1.1);
}

/* Hide native scrollbar, use custom one */
.modal-content-scroller {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  -webkit-overflow-scrolling: touch;
  position: relative;
  /* Hide native scrollbar completely */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.modal-content-scroller::-webkit-scrollbar {
  display: none;
}

/* Custom Scrollbar */
.custom-scrollbar-track {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  height: 50%; /* Only 50% of the modal height */
  width: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  z-index: 50;
}

.custom-scrollbar-thumb {
  position: absolute;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, var(--accent-primary), #4f46e5);
  border-radius: 10px;
  transition: top 0.05s linear, height 0.1s ease;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
}

/* Progress Bar */
.scroll-progress-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1000;
}

.scroll-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  transition: width 0.1s ease-out;
}

.content-vignette {
  position: sticky;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 10;
  pointer-events: none;
}

.content-vignette.top {
  top: 0;
  background: linear-gradient(to bottom, rgba(10, 10, 12, 1) 0%, transparent 100%);
}

.content-vignette.bottom {
  bottom: 0;
  margin-top: -60px;
  background: linear-gradient(to top, rgba(10, 10, 12, 1) 0%, transparent 100%);
}

/* Header Section */
.modal-hero {
  padding: 6rem 5rem 4rem;
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.08), transparent 70%);
  text-align: center;
  position: relative;
}

/* Glass Meta Badge */
.header-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.category-badge {
  padding: 0.6rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--accent-primary);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.meta-separator {
  color: var(--accent-primary);
  opacity: 0.5;
  font-weight: 900;
}

.date, .reading-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.modal-title {
  font-size: clamp(2.5rem, 6vw, 4.2rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 3rem;
  letter-spacing: -0.05em;
  color: white;
  text-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.author-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary), #4f46e5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.author-name {
  font-weight: 700;
  color: var(--text-primary);
}

.author-role {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Image Section */
.modal-image-wrapper {
  padding: 0 5rem;
  margin-bottom: 4rem;
  position: relative;
}

.featured-image {
  width: 100%;
  aspect-ratio: 21/9;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
}

/* Body Section */
.modal-article-body {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 5rem 8rem;
}

.article-lead-section {
  position: relative;
  margin-bottom: 4rem;
}

.lead-excerpt {
  font-size: clamp(1.4rem, 3.5vw, 1.8rem);
  line-height: 1.4;
  color: white;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.neural-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-primary), transparent);
  margin-top: 2rem;
  opacity: 0.3;
}

.content-text {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 450;
}

.content-text :deep(p) {
  margin-bottom: 2.5rem;
}

/* First Letter Special Style (Drop-cap feel) */
.content-text :deep(p:first-of-type)::first-letter {
  float: left;
  font-size: 4.5rem;
  line-height: 1;
  font-weight: 900;
  color: var(--accent-primary);
  margin-right: 0.8rem;
  text-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.article-footer {
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tag {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.share-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 700;
}

.share-icons {
  display: flex;
  gap: 0.8rem;
}

.share-icon {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: color 0.3s ease;
}

.share-icon:hover {
  color: var(--accent-primary);
}

.bottom-actions {
  margin-top: 4rem;
  display: flex;
  justify-content: center;
}

.finish-btn {
  padding: 1rem 2.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  border-radius: 100px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.finish-btn:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
}

.finish-btn svg {
  width: 18px;
  height: 18px;
}


/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Responsiveness Extensions */
@media (max-width: 1024px) {
  .insight-modal-container {
    max-width: 90%;
  }
  .modal-hero { padding: 5rem 3.5rem 2.5rem; }
  .modal-article-body, .modal-image-wrapper { padding: 0 3.5rem 4rem; }
}

@media (max-width: 768px) {
  .insight-modal-overlay { padding: 0.5rem; }
  .insight-modal-container {
    max-height: 95vh;
    border-radius: 24px;
  }
  .modal-hero { padding: 4rem 1.5rem 2rem; }
  .modal-article-body, .modal-image-wrapper { padding: 0 1.5rem 3rem; }
  .featured-image { aspect-ratio: 16/9; border-radius: 16px; }
  .close-btn { top: 1rem; right: 1rem; width: 40px; height: 40px; }
  .meta-separator { display: none; }
  .header-meta { flex-direction: column; gap: 0.5rem; }
  .modal-title { margin-bottom: 2rem; }
  .article-footer { flex-direction: column; gap: 1.5rem; align-items: center; text-align: center; }
  .share-section { flex-direction: column; gap: 1rem; }
}

@media (max-width: 480px) {
  .modal-title { font-size: 1.75rem; }
  .author-box { flex-direction: column; text-align: center; }
  .author-info { align-items: center; }
  .finish-btn { width: 100%; justify-content: center; }
}
</style>
