<template>
  <div class="page-container">
    <div class="page-hero research-hero" v-if="pageConfig">
      <div class="hero-ambient">
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">{{ pageConfig.hero_badge || 'THE LAB' }}</div>
        <h1 class="page-title" v-html="formatGradientTitle(pageConfig.hero_title || 'Advancing the Science of Autonomous AI')"></h1>
        <p class="page-description">
          {{ pageConfig.hero_subtitle || 'Our research team publishes at top-tier AI conferences and collaborates with leading academic institutions to solve fundamental challenges in multi-agent coordination, neural reasoning, and AI safety.' }}
        </p>
      </div>
    </div>

    <!-- Research Areas -->
    <section class="areas-section" v-if="areas && areas.length > 0">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">CORE DOMAINS</span>
          <h2>Focus <span class="text-gradient">Areas</span></h2>
        </div>
        <div class="areas-grid">
          <div v-for="area in areas" :key="area.name" class="area-card">
            <div class="area-icon-wrap"><div class="area-icon" v-html="area.icon"></div></div>
            <h4>{{ area.name }}</h4>
            <p>{{ area.desc }}</p>
            <div class="area-tag">{{ area.tag }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section class="publications-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">PUBLICATIONS</span>
          <h2>Peer-Reviewed <span class="text-gradient">Insights</span></h2>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading publications...</p>
        </div>
        <div v-else-if="publications.length === 0" class="empty-state"><p>No publications yet.</p></div>

        <div v-else class="publications-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollPublications('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div class="pub-list" ref="pubList">
            <div v-for="pub in publications" :key="pub._id" class="pub-item" @click="openModal(pub)">
              <div class="pub-card-glow"></div>
              <div class="pub-meta">
                <span class="pub-year">{{ pub.year || new Date(pub.createdAt).getFullYear() }}</span>
                <div class="pub-type-badge">RESEARCH PAPER</div>
              </div>
              <div class="pub-journal-name">{{ pub.journal || 'DREAMATIC Research' }}</div>
              <h3>{{ pub.title }}</h3>
              <p class="pub-authors">{{ pub.authors || pub.author }}</p>
              
              <div class="pub-actions">
                <button class="text-btn" @click.stop="openModal(pub)">
                  Abstract
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <a v-if="pub.pdfUrl" :href="pub.pdfUrl" target="_blank" rel="noopener" class="download-btn-small" @click.stop>
                  <template v-if="pub.linkType === 'preview'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View Paper
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
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollPublications('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-glow"></div>
        <div class="cta-content">
          <h2>Collaborate with our <span class="text-gradient">Researchers</span></h2>
          <p class="cta-desc">Partner with the team defining the science of autonomous AI.</p>
          <div style="display:flex; justify-content:center;">
            <button class="primary-btn" @click="openContactModal">
              Partnership Inquiries
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <ResearchModal :is-open="modalOpen" :pub="selectedInsight" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { researchAPI, pagesAPI } from '@/services/api'
import ResearchModal from '@/components/ResearchModal.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const openContactModal = inject('openContactModal')

const publications = ref([])
const pageConfig = ref(null)
const loading = ref(true)
const modalOpen = ref(false)
const selectedInsight = ref(null)
const pubList = ref(null)

const areas = computed(() => pageConfig.value?.approaches || [])

const initPage = async () => {
  try {
    loading.value = true
    const [configData, pubData] = await Promise.all([
      pagesAPI.getConfig('research'),
      researchAPI.getAll()
    ])
    pageConfig.value = configData
    publications.value = pubData

    // Check for ID in query params to auto-open modal
    if (route.query.id) {
      const targetPub = pubData.find(p => p._id === route.query.id)
      if (targetPub) {
        openModal(targetPub)
      }
    }
  } catch (err) {
    console.error('Failed to load research data:', err)
  } finally {
    loading.value = false
  }
}

const formatGradientTitle = (title) => {
  if (!title) return ''
  const words = title.split(' ')
  if (words.length >= 2) {
    const lastPart = words.splice(-2).join(' ')
    return `${words.join(' ')} <span class="text-gradient">${lastPart}</span>`
  }
  return title
}

const openModal = (pub) => { selectedInsight.value = pub; modalOpen.value = true }
const closeModal = () => { modalOpen.value = false; selectedInsight.value = null }
const scrollPublications = (direction) => {
  if (!pubList.value) return
  const scrollAmount = direction === 'left' ? -490 : 490
  pubList.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

onMounted(() => { window.scrollTo(0, 0); initPage() })
</script>

<style scoped>
.page-container { width: 100%; min-height: 100vh; background: var(--bg-primary); }

.page-hero { padding: 14rem 5% 10rem; text-align: center; position: relative; overflow: hidden; background: var(--bg-secondary); }
.hero-ambient { position: absolute; inset: 0; pointer-events: none; }
.ambient-orb { position: absolute; border-radius: 50%; filter: blur(100px); }
.orb-1 { width: 700px; height: 700px; top: -200px; left: -150px; background: rgba(16,185,129,0.12); animation: orbDrift 18s infinite alternate; }
.orb-2 { width: 600px; height: 600px; bottom: -200px; right: -100px; background: rgba(6,182,212,0.1); animation: orbDrift 22s infinite alternate-reverse; }
@keyframes orbDrift { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
.hero-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
.hero-badge { display: inline-block; padding: 0.5rem 1.5rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); border-radius: 100px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; color: #10b981; margin-bottom: 2.5rem; }
.page-title { font-size: clamp(3.5rem, 7vw, 6rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1; margin-bottom: 2rem; color: var(--text-primary); }
.text-gradient { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-description { font-size: 1.3rem; color: var(--text-secondary); line-height: 1.7; max-width: 760px; margin: 0 auto; }

.section-container { max-width: 1200px; margin: 0 auto; width: 100%; }
.section-header { text-align: center; margin-bottom: 5rem; }
.section-header h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -0.03em; }
.section-tag { display: block; color: #10b981; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 6rem; color: var(--text-secondary); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 6rem; color: var(--text-secondary); }

/* Carousel Navigation */
.publications-carousel-wrapper { position: relative; width: 100%; padding: 0 50px; }
.carousel-nav { 
  display: flex; 
  position: absolute; 
  top: 50%; 
  transform: translateY(-50%); 
  width: 64px; 
  height: 64px; 
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.2); 
  border-radius: 50%; 
  cursor: pointer; 
  z-index: 100; 
  align-items: center; 
  justify-content: center; 
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
  color: white;
}
.carousel-nav:hover { background: #10b981; border-color: #10b981; transform: translateY(-50%) scale(1.1); box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
.carousel-nav:hover svg { color: white; }
.carousel-nav.prev { left: -10px; }
.carousel-nav.next { right: -10px; }
.carousel-nav svg { width: 28px; height: 28px; color: white; transition: color 0.3s; }

/* Grid / List Styles */
.pub-list { 
  display: flex; 
  flex-direction: row; 
  gap: 2.5rem; 
  overflow-x: hidden; 
  scroll-behavior: smooth;
  padding: 2rem 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.pub-list::-webkit-scrollbar { display: none; }

.pub-item { 
  flex: 0 0 450px;
  padding: 3.5rem; 
  background: var(--glass-bg); 
  backdrop-filter: blur(40px); 
  border-radius: 40px; 
  border: 1px solid var(--glass-border); 
  transition: all 0.6s cubic-bezier(0.16,1,0.3,1); 
  cursor: pointer; 
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.pub-card-glow { 
  position: absolute; 
  inset: 0; 
  background: radial-gradient(circle at 0% 0%, rgba(16,185,129,0.1), transparent 70%); 
  opacity: 0; 
  transition: opacity 0.4s; 
}
.pub-item:hover { 
  transform: translateY(-15px); 
  border-color: rgba(16,185,129,0.4); 
  box-shadow: 0 40px 80px rgba(0,0,0,0.3);
}
.pub-item:hover .pub-card-glow { opacity: 1; }

.pub-meta { 
  display: flex; 
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; 
  position: relative;
  z-index: 1;
}
.pub-year { 
  font-size: 0.85rem;
  font-weight: 800; 
  color: #10b981; 
  padding: 0.4rem 1rem;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 100px;
}
.pub-type-badge {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  opacity: 0.6;
}

.pub-journal-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.pub-item h3 { 
  font-size: 1.75rem; 
  font-weight: 900; 
  margin-bottom: 1.5rem; 
  line-height: 1.15; 
  letter-spacing: -0.04em; 
  color: white;
  position: relative;
  z-index: 1;
}
.pub-authors { 
  color: rgba(255,255,255,0.5); 
  font-size: 1rem; 
  margin-bottom: auto; 
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.pub-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.text-btn { 
  display: flex; 
  align-items: center; 
  gap: 0.6rem; 
  background: none; 
  border: none; 
  color: #10b981; 
  font-weight: 800; 
  font-size: 0.95rem; 
  cursor: pointer; 
  padding: 0; 
  transition: all 0.3s; 
}
.text-btn:hover { gap: 1rem; filter: brightness(1.2); }
.text-btn svg { width: 18px; height: 18px; }

.download-btn-small {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.1rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}
.download-btn-small:hover {
  background: #10b981;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}
.download-btn-small svg { width: 16px; height: 16px; }

/* CTA */
.page-cta { padding: 8rem 5% 12rem; }
.cta-card { max-width: 860px; margin: 0 auto; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 48px; padding: 7rem 5rem; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 40px 80px rgba(0,0,0,0.2); position: relative; overflow: hidden; }
.cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 300px; background: radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%); pointer-events: none; }
.cta-content { position: relative; z-index: 1; }
.cta-card h2 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1rem; }
.cta-desc { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 3rem; }
.primary-btn { display: inline-flex; align-items: center; gap: 0.8rem; padding: 1.1rem 2.5rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 14px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.4s cubic-bezier(0.23,1,0.32,1); box-shadow: 0 10px 30px rgba(16,185,129,0.25); }
.primary-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(16,185,129,0.35); }
.primary-btn svg { width: 18px; height: 18px; transition: transform 0.3s; }
.primary-btn:hover svg { transform: translateX(5px); }

/* Areas styles */
.areas-section { padding: 10rem 5%; }
.areas-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.area-card { padding: 3.5rem; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 32px; border: 1px solid var(--glass-border); transition: all 0.5s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
.area-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 20%, rgba(16,185,129,0.07), transparent 60%); opacity: 0; transition: opacity 0.4s; }
.area-card:hover { transform: translateY(-10px); border-color: rgba(16,185,129,0.3); box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
.area-card:hover::before { opacity: 1; }
.area-icon-wrap { width: 52px; height: 52px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; position: relative; z-index: 1; }
.area-icon { color: #10b981; width: 24px; height: 24px; }
.area-card h4 { font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem; position: relative; z-index: 1; }
.area-card p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; position: relative; z-index: 1; }
.area-tag { display: inline-block; padding: 0.35rem 0.9rem; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); border-radius: 100px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; color: #10b981; text-transform: uppercase; position: relative; z-index: 1; }

@media (max-width: 1024px) { 
  .areas-grid { grid-template-columns: 1fr 1fr; }
  .pub-item { flex: 0 0 400px; }
}
@media (max-width: 768px) {
  .page-hero, .areas-section, .publications-section { padding: 6rem 5%; } 
  .cta-card { padding: 4rem 2rem; }
  .publications-carousel-wrapper { padding: 0 20px; }
  .carousel-nav { display: none; }
  .pub-list { 
    overflow-x: auto; 
    scroll-snap-type: x mandatory; 
    gap: 1.5rem; 
    padding: 1rem 0 2rem; 
    -webkit-overflow-scrolling: touch; 
  }
  .pub-item { flex: 0 0 85%; scroll-snap-align: center; padding: 2.5rem; }
  .pub-item h3 { font-size: 1.5rem; }
  .areas-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1.5rem; padding: 1rem 0 2rem; -webkit-overflow-scrolling: touch; scrollbar-width: none; grid-template-columns: none; }
  .areas-grid::-webkit-scrollbar { display: none; }
  .area-card { flex: 0 0 82%; scroll-snap-align: center; }
}
@media (max-width: 480px) {
  .pub-item { flex: 0 0 90%; }
}
</style>
