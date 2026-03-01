
<template>
  <Transition name="modal-fade">
    <div v-if="isOpen && pub" class="research-modal-overlay" @click.self="$emit('close')">
      <div class="modal-bg-glows">
        <div class="glow glow-research"></div>
      </div>
      
      <div class="research-modal-container">
        <!-- Progress Bar -->
        <div class="scroll-progress-container">
          <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
        </div>

        <div class="modal-content-scroller" ref="scroller" @scroll="handleScroll">
          <div class="content-vignette top"></div>
          
          <!-- Research Header -->
          <div class="modal-header">
            <div class="header-meta">
              <span class="pub-type-badge">RESEARCH PUBLICATION</span>
              <span class="meta-sep">•</span>
              <span class="journal-name">{{ pub.journal }}</span>
              <span class="meta-sep">•</span>
              <span class="pub-year">{{ pub.year }}</span>
            </div>
            
            <h1 class="pub-title">{{ pub.title }}</h1>
            
            <div class="authors-list">
              <div class="author-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <div class="authors-text">
                <span class="label">Lead Researchers</span>
                <span class="names">{{ pub.authors || pub.author }}</span>
              </div>
            </div>
          </div>

          <!-- Featured Paper Visual -->
          <div class="paper-visual-wrapper" v-if="pub.imageUrl">
            <img :src="pub.imageUrl" :alt="pub.title" class="paper-image" />
            <div class="image-overlay"></div>
          </div>

          <!-- Paper Quick Actions Banner -->
          <div class="paper-action-banner">
            <div class="status-info">
              <div class="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div class="text">
                <span class="top">Document Status</span>
                <span class="bottom">{{ pub.pdfUrl ? 'Full Manuscript Available' : 'Abstract Only (Manuscript Restricted)' }}</span>
              </div>
            </div>
            
            <a v-if="pub.pdfUrl" :href="pub.pdfUrl" target="_blank" rel="noopener" class="paper-primary-btn">
              <template v-if="pub.linkType === 'preview'">
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
          </div>

          <!-- Article Content -->
          <div class="article-body">
            <div class="abstract-section">
              <h3 class="section-title">ABSTRACT</h3>
              <p class="abstract-text">{{ pub.abstract || pub.excerpt }}</p>
            </div>
            
            <div class="full-content" v-html="formattedContent"></div>
            
            <div class="paper-footer">
              <div class="paper-tags">
                <span class="tag">#AcademicResearch</span>
                <span class="tag">#AI_Science</span>
                <span class="tag">#PeerReviewed</span>
              </div>
              
              <div class="footer-cta">
                <a v-if="pub.pdfUrl" :href="pub.pdfUrl" target="_blank" rel="noopener" class="paper-primary-btn footer-cta-btn">
                  <template v-if="pub.linkType === 'preview'">
                    View Publication
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                  </template>
                  <template v-else>
                    Download Full PDF
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </template>
                </a>
                <div v-else class="restricted-access">
                  <span class="lock-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                  Manuscript Restricted
                </div>
              </div>
            </div>
          </div>

          <div class="content-vignette bottom"></div>
        </div>

        <!-- Scrollbar -->
        <div class="custom-scrollbar-track">
          <div class="custom-scrollbar-thumb" :style="{ height: thumbHeight + '%', top: thumbTop + '%' }"></div>
        </div>

        <!-- Sticky Close -->
        <button class="close-btn" @click="$emit('close')" aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  pub: Object
})

defineEmits(['close'])

const scroller = ref(null)
const scrollProgress = ref(0)
const thumbHeight = ref(30)
const thumbTop = ref(0)

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
  const visibleRatio = el.clientHeight / el.scrollHeight
  thumbHeight.value = Math.max(8, visibleRatio * 100)
  thumbTop.value = scrollRatio * (100 - thumbHeight.value)
}

const formattedContent = computed(() => {
  if (!props.pub?.content) return ''
  return props.pub.content
    .split('\n\n')
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})
</script>

<style scoped>
.research-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.research-modal-container {
  background: #0a0a0c;
  width: 100%;
  max-width: 1100px;
  max-height: 85vh;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 50px 100px rgba(0,0,0,0.5);
}

.modal-bg-glows {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow-research {
  position: absolute;
  top: -100px;
  left: 20%;
  width: 600px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent 70%);
  filter: blur(80px);
}

.modal-content-scroller {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  position: relative;
  z-index: 1;
}

.modal-content-scroller::-webkit-scrollbar { display: none; }

.modal-header {
  padding: 6rem 5rem 4rem;
  text-align: left;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.pub-type-badge {
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 6px;
}

.meta-sep { color: rgba(255,255,255,0.2); }
.journal-name, .pub-year { font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.6); }

.pub-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: white;
  margin-bottom: 3rem;
  max-width: 900px;
}

.authors-list {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.author-avatar {
  width: 52px;
  height: 52px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.authors-text { display: flex; flex-direction: column; }
.authors-text .label { font-size: 0.7rem; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 2px; }
.authors-text .names { font-size: 1.1rem; font-weight: 600; color: white; }

.paper-visual-wrapper {
  padding: 0 5rem;
  margin-bottom: 4rem;
  position: relative;
}

.paper-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.1);
}

.paper-action-banner {
  max-width: 900px;
  margin: 0 auto 5rem;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 24px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(20px);
}

.status-info { display: flex; align-items: center; gap: 1.25rem; }
.icon-wrap { color: #10b981; width: 44px; height: 44px; background: rgba(16,185,129,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.status-info .text { display: flex; flex-direction: column; }
.status-info .top { font-size: 0.7rem; font-weight: 800; color: #10b981; text-transform: uppercase; }
.status-info .bottom { font-size: 1rem; font-weight: 600; color: white; }

.paper-primary-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.8rem;
  background: #10b981;
  color: white;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
}

.paper-primary-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }

.article-body { max-width: 900px; margin: 0 auto; padding: 0 5rem 8rem; }
.section-title { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.2em; color: #10b981; margin-bottom: 2rem; }
.abstract-text { font-size: 1.4rem; line-height: 1.5; color: white; font-weight: 600; margin-bottom: 4rem; }
.full-content { font-size: 1.15rem; line-height: 1.8; color: rgba(255,255,255,0.7); }
.full-content :deep(p) { margin-bottom: 2rem; }

.paper-footer { margin-top: 6rem; padding-top: 3rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; }
.paper-tags { display: flex; gap: 1rem; }
.tag { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.4); }

.footer-cta-btn {
  padding: 1.1rem 2.2rem;
  border-radius: 100px;
  font-size: 1rem;
}

.footer-cta-btn svg {
  width: 20px;
  height: 20px;
}

.restricted-access {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
  font-size: 0.9rem;
}

.lock-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn { position: absolute; top: 2rem; right: 2rem; width: 52px; height: 52px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.3s; backdrop-filter: blur(10px); }
.close-btn:hover { background: #ef4444; border-color: #ef4444; transform: rotate(90deg) scale(1.1); }

.scroll-progress-container { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.02); z-index: 100; }
.scroll-progress-bar { height: 100%; background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); transition: width 0.1s ease-out; }

.custom-scrollbar-track { position: absolute; right: 8px; top: 20%; height: 60%; width: 4px; background: rgba(255,255,255,0.03); border-radius: 10px; }
.custom-scrollbar-thumb { position: absolute; left: 0; width: 100%; background: #10b981; border-radius: 10px; box-shadow: 0 0 8px rgba(16,185,129,0.3); }

@media (max-width: 768px) {
  .modal-header, .paper-visual-wrapper, .article-body { padding-left: 1.5rem; padding-right: 1.5rem; }
  .paper-action-banner { flex-direction: column; gap: 1.5rem; text-align: center; }
  .paper-primary-btn { width: 100%; justify-content: center; }
  .close-btn { top: 1rem; right: 1rem; width: 44px; height: 44px; }
  .paper-footer { flex-direction: column; gap: 2rem; align-items: stretch; text-align: center; }
  .paper-tags { justify-content: center; }
}
</style>
