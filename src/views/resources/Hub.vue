<template>
  <div class="page-container">
    <div class="page-hero hub-hero" v-if="pageConfig">
      <div class="hero-ambient">
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">{{ pageConfig.hero_badge || 'RESOURCE HUB' }}</div>
        <h1 class="page-title" v-html="formatGradientTitle(pageConfig.hero_title || 'The Complete Agentic Intelligence Library')"></h1>
        <p class="page-description">
          {{ pageConfig.hero_subtitle || 'From technical implementation guides to strategic enterprise playbooks, access the comprehensive resource library trusted by AI teams at Fortune 500 companies.' }}
        </p>
      </div>
    </div>

    <!-- Categories -->
    <section class="hub-explorer" v-if="categories && categories.length > 0">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">CORE CATEGORIES</span>
          <h2>Explore by <span class="text-gradient">Domain</span></h2>
        </div>
        <div class="category-grid">
          <div v-for="cat in categories" :key="cat.name" class="category-card">
            <div class="card-glow"></div>
            <div class="icon-box" v-html="cat.icon"></div>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.desc }}</p>
            <span class="item-count">{{ cat.count }} Resources</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Resources -->
    <section class="featured-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">FEATURED CONTENT</span>
          <h2>Latest from the <span class="text-gradient">Hub</span></h2>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading resources...</p>
        </div>
        <div v-else-if="resources.length === 0" class="empty-state"><p>No resources yet.</p></div>

        <div v-else class="resources-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollResources('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="resources-grid" ref="resourcesGrid">
            <div v-for="res in resources" :key="res._id" class="res-card" @click="openModal(res)">
              <div class="res-image-placeholder">
                <span class="res-type">{{ res.type || 'RESOURCE' }}</span>
                <div class="res-img-inner" :style="res.imageUrl ? { backgroundImage: `url(${res.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"></div>
              </div>
              <div class="res-content">
                <h4>{{ res.title }}</h4>
                <p>{{ res.excerpt }}</p>
                <button class="text-btn">
                  Read More
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
          <button class="carousel-nav next" @click="scrollResources('right')" aria-label="Next">
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
          <h2>Get the latest <span class="text-gradient">Insights</span></h2>
          <p class="cta-description">Join 50,000+ leaders receiving our weekly agentic briefing.</p>
          <div class="subscribe-form">
            <input type="email" placeholder="Enter your work email" class="sub-input">
            <button class="primary-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </section>

    <InsightModal :is-open="modalOpen" :insight="selectedInsight" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { insightsAPI, pagesAPI } from '@/services/api'
import InsightModal from '@/components/InsightModal.vue'

const resources = ref([])
const pageConfig = ref(null)
const loading = ref(true)
const modalOpen = ref(false)
const selectedInsight = ref(null)
const resourcesGrid = ref(null)

const categories = computed(() => pageConfig.value?.stats || [])

const initPage = async () => {
  try {
    loading.value = true
    const [configData, resData] = await Promise.all([
      pagesAPI.getConfig('hub'),
      insightsAPI.getAll('hub')
    ])
    pageConfig.value = configData
    resources.value = resData
  } catch (err) {
    console.error('Failed to load hub data:', err)
  } finally {
    loading.value = false
  }
}

const formatGradientTitle = (title) => {
  if (!title) return ''
  const words = title.split(' ')
  if (words.length > 2) {
    const lastPart = words.splice(-2).join(' ')
    return `${words.join(' ')} <span class="text-gradient">${lastPart}</span>`
  }
  return title
}

const openModal = (res) => { selectedInsight.value = res; modalOpen.value = true }
const closeModal = () => { modalOpen.value = false; selectedInsight.value = null }
const scrollResources = (direction) => {
  if (!resourcesGrid.value) return
  resourcesGrid.value.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' })
}

onMounted(() => { window.scrollTo(0, 0); initPage() })
</script>

<style scoped>
.page-container { width: 100%; min-height: 100vh; background: var(--bg-primary); }

.page-hero { padding: 14rem 5% 10rem; text-align: center; position: relative; overflow: hidden; background: var(--bg-secondary); }
.hero-ambient { position: absolute; inset: 0; pointer-events: none; }
.ambient-orb { position: absolute; border-radius: 50%; filter: blur(100px); }
.orb-1 { width: 700px; height: 700px; top: -200px; left: -200px; background: rgba(37,99,235,0.12); animation: orbDrift 18s infinite alternate; }
.orb-2 { width: 600px; height: 600px; bottom: -200px; right: -150px; background: rgba(99,102,241,0.1); animation: orbDrift 22s infinite alternate-reverse; }
@keyframes orbDrift { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
.hero-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
.hero-badge { display: inline-block; padding: 0.5rem 1.5rem; background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.25); border-radius: 100px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; color: #2563eb; margin-bottom: 2.5rem; }
.page-title { font-size: clamp(3.5rem, 7vw, 6rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1; margin-bottom: 2rem; color: var(--text-primary); }
.text-gradient { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-description { font-size: 1.3rem; color: var(--text-secondary); line-height: 1.7; max-width: 760px; margin: 0 auto; }

.section-container { max-width: 1200px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 5rem; }
.section-header h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -0.03em; }
.section-tag { display: block; color: #2563eb; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 6rem; color: var(--text-secondary); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 6rem; color: var(--text-secondary); }

.carousel-nav { display: none; position: absolute; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 50%; cursor: pointer; z-index: 10; align-items: center; justify-content: center; transition: all 0.3s ease; }
.carousel-nav:hover { background: #2563eb; border-color: #2563eb; }
.carousel-nav:hover svg { color: white; }
.carousel-nav.prev { left: -26px; }
.carousel-nav.next { right: -26px; }
.carousel-nav svg { width: 20px; height: 20px; color: var(--text-primary); }

.hub-explorer { padding: 10rem 5%; }
.category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.category-card { position: relative; padding: 3rem; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 32px; border: 1px solid var(--glass-border); transition: all 0.5s cubic-bezier(0.16,1,0.3,1); overflow: hidden; }
.card-glow { position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, rgba(37,99,235,0.08), transparent 70%); opacity: 0; transition: opacity 0.4s; }
.category-card:hover { transform: translateY(-10px); border-color: rgba(37,99,235,0.3); box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
.category-card:hover .card-glow { opacity: 1; }
.icon-box { width: 52px; height: 52px; color: #2563eb; margin-bottom: 2rem; position: relative; z-index: 1; }
.category-card h3 { font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem; position: relative; z-index: 1; }
.category-card p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; position: relative; z-index: 1; }
.item-count { font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.1em; position: relative; z-index: 1; padding: 0.4rem 0.9rem; background: rgba(37,99,235,0.08); border-radius: 100px; border: 1px solid rgba(37,99,235,0.15); }

.featured-section { padding: 10rem 5%; background: var(--bg-secondary); }
.resources-carousel-wrapper { position: relative; }
.resources-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.res-card { background: var(--bg-primary); border-radius: 28px; border: 1px solid var(--glass-border); overflow: hidden; transition: all 0.5s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
.res-card:hover { transform: translateY(-10px); border-color: rgba(37,99,235,0.3); box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
.res-image-placeholder { height: 200px; position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1)); }
.res-img-inner { position: absolute; inset: 0; background: radial-gradient(circle at 60% 60%, rgba(37,99,235,0.2), transparent 60%); }
.res-type { position: absolute; top: 1.5rem; left: 1.5rem; padding: 0.4rem 0.9rem; background: rgba(37,99,235,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(37,99,235,0.3); border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; color: #2563eb; z-index: 1; }
.res-content { padding: 2.5rem; }
.res-content h4 { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.4; }
.res-content p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; }
.text-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: #2563eb; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: gap 0.3s; padding: 0; }
.text-btn:hover { gap: 1rem; }
.text-btn svg { width: 16px; height: 16px; }

.page-cta { padding: 8rem 5% 12rem; }
.cta-card { max-width: 860px; margin: 0 auto; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 48px; padding: 7rem 5rem; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 40px 80px rgba(0,0,0,0.2); position: relative; overflow: hidden; }
.cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 300px; background: radial-gradient(circle, rgba(37,99,235,0.1), transparent 70%); pointer-events: none; }
.cta-content { position: relative; z-index: 1; }
.cta-card h2 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1rem; }
.cta-description { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 3rem; }
.subscribe-form { display: flex; max-width: 500px; margin: 0 auto; gap: 0; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 18px; padding: 0.5rem 0.5rem 0.5rem 1.5rem; }
.sub-input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 1rem; font-family: inherit; }
.sub-input::placeholder { color: var(--text-secondary); }
.primary-btn { padding: 0.9rem 2rem; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
.primary-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(37,99,235,0.4); }

@media (max-width: 1024px) { .category-grid { grid-template-columns: 1fr 1fr; } .resources-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) {
  .page-hero, .hub-explorer, .featured-section { padding: 6rem 5%; } .cta-card { padding: 4rem 2rem; }
  .carousel-nav { display: flex; }
  .category-grid, .resources-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1.5rem; padding: 1rem 1rem 2rem; -webkit-overflow-scrolling: touch; scrollbar-width: none; grid-template-columns: none; }
  .category-grid::-webkit-scrollbar, .resources-grid::-webkit-scrollbar { display: none; }
  .category-card, .res-card { flex: 0 0 82%; scroll-snap-align: center; }
  .subscribe-form { flex-direction: column; padding: 1rem; border-radius: 14px; }
}
</style>
