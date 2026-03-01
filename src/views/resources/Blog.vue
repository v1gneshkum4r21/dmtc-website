<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero blog-hero" v-if="pageConfig">
      <div class="hero-ambient">
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">{{ pageConfig.hero_badge || 'THE AGENTIC BLOG' }}</div>
        <h1 class="page-title" v-html="formatGradientTitle(pageConfig.hero_title || 'Insights from the AI Frontier')"></h1>
        <p class="page-description">
          {{ pageConfig.hero_subtitle || 'Analysis, research breakthroughs, and strategic perspectives from the team building enterprise-grade autonomous AI infrastructure.' }}
        </p>
      </div>
    </div>

    <!-- Featured Post -->
    <section v-if="featuredPost" class="featured-post">
      <div class="section-container">
        <div class="featured-card" @click="openModal(featuredPost)">
          <div class="featured-image" :style="featuredPost.imageUrl ? { backgroundImage: `url(${featuredPost.imageUrl})` } : {}">
            <div class="featured-image-inner"></div>
            <div class="featured-tag">FEATURED</div>
          </div>
          <div class="featured-info">
            <span class="post-date">{{ featuredPost.category?.toUpperCase() || 'ARTICLE' }} &nbsp;·&nbsp; {{ featuredPost.date || formatDate(featuredPost.createdAt) }}</span>
            <h2>{{ featuredPost.title }}</h2>
            <p>{{ featuredPost.excerpt }}</p>
            <button class="primary-btn">
              Read Full Article
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Post Grid -->
    <section class="post-grid-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">LATEST ARTICLES</span>
          <h2>From the <span class="text-gradient">Editorial</span></h2>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading articles...</p>
        </div>

        <div v-else-if="posts.length === 0 && !featuredPost" class="empty-state">
          <p>No articles published yet.</p>
        </div>

        <div v-else class="posts-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollPosts('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="post-grid" ref="postGrid">
            <div v-for="post in posts" :key="post._id" class="post-card" @click="openModal(post)">
              <div class="post-thumbnail" :style="post.imageUrl ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: getCategoryGradient(post.category) }">
                <div class="thumb-inner"></div>
              </div>
              <div class="post-content">
                <div class="post-meta">
                  <span class="post-category">{{ post.category || 'Article' }}</span>
                  <span class="dot"></span>
                  <span>{{ post.date || formatDate(post.createdAt) }}</span>
                </div>
                <h4>{{ post.title }}</h4>
                <p>{{ post.excerpt }}</p>
                <span class="read-link">
                  Read More
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>
          <button class="carousel-nav next" @click="scrollPosts('right')" aria-label="Next">
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
          <h2>Stay ahead of the <span class="text-gradient">Curve</span></h2>
          <p class="cta-desc">Get the DREAMATIC Intelligence Briefing, delivered weekly to your inbox.</p>
          <div style="display:flex; justify-content:center;">
            <button class="primary-btn" @click="openContactModal">
              Manage Subscriptions
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Insight Modal -->
    <InsightModal :is-open="modalOpen" :insight="selectedInsight" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { insightsAPI, pagesAPI } from '@/services/api'
import InsightModal from '@/components/InsightModal.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const openContactModal = inject('openContactModal')

const allPosts = ref([])
const pageConfig = ref(null)
const loading = ref(true)
const modalOpen = ref(false)
const selectedInsight = ref(null)
const postGrid = ref(null)

const featuredPost = computed(() => allPosts.value[0] || null)
const posts = computed(() => allPosts.value.slice(1))

const initPage = async () => {
  try {
    loading.value = true
    const [configData, resData] = await Promise.all([
      pagesAPI.getConfig('blog'),
      insightsAPI.getAll('blog')
    ])
    pageConfig.value = configData
    allPosts.value = resData

    // Check for ID in query params to auto-open modal
    if (route.query.id) {
      const targetPost = resData.find(p => p._id === route.query.id)
      if (targetPost) {
        openModal(targetPost)
      }
    }
  } catch (err) {
    console.error('Failed to load blog data:', err)
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

const openModal = (post) => {
  selectedInsight.value = post
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedInsight.value = null
}

const scrollPosts = (direction) => {
  if (!postGrid.value) return
  postGrid.value.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' })
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getCategoryGradient = (cat) => {
  const map = {
    Engineering: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))',
    Research: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))',
    Strategy: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.2))',
    Product: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))',
  }
  return map[cat] || 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(37,99,235,0.15))'
}

onMounted(() => {
  window.scrollTo(0, 0)
  initPage()
})
</script>

<style scoped>
.page-container { width: 100%; min-height: 100vh; background: var(--bg-primary); }

/* HERO */
.page-hero { padding: 14rem 5% 10rem; text-align: center; position: relative; overflow: hidden; background: var(--bg-secondary); }
.hero-ambient { position: absolute; inset: 0; pointer-events: none; }
.ambient-orb { position: absolute; border-radius: 50%; filter: blur(100px); }
.orb-1 { width: 700px; height: 700px; top: -250px; right: -100px; background: rgba(99,102,241,0.12); animation: orbDrift 20s infinite alternate; }
.orb-2 { width: 600px; height: 600px; bottom: -200px; left: -150px; background: rgba(168,85,247,0.1); animation: orbDrift 25s infinite alternate-reverse; }
@keyframes orbDrift { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
.hero-content { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
.hero-badge { display: inline-block; padding: 0.5rem 1.5rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 100px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; color: var(--accent-primary); margin-bottom: 2.5rem; }
.page-title { font-size: clamp(3.5rem, 7vw, 6rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1; margin-bottom: 2rem; color: var(--text-primary); }
.text-gradient { background: linear-gradient(135deg, var(--accent-primary) 0%, #a855f7 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-description { font-size: 1.3rem; color: var(--text-secondary); line-height: 1.7; max-width: 760px; margin: 0 auto; }

/* COMMON */
.section-container { max-width: 1200px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 5rem; }
.section-header h2 { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -0.03em; }
.section-tag { display: block; color: var(--accent-primary); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem; }

/* LOADING */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 6rem; color: var(--text-secondary); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 6rem; color: var(--text-secondary); }

/* CAROUSEL NAV */
.carousel-nav { display: none; position: absolute; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 50%; cursor: pointer; z-index: 10; align-items: center; justify-content: center; transition: all 0.3s ease; }
.carousel-nav:hover { background: var(--accent-primary); border-color: var(--accent-primary); }
.carousel-nav:hover svg { color: white; }
.carousel-nav.prev { left: -26px; }
.carousel-nav.next { right: -26px; }
.carousel-nav svg { width: 20px; height: 20px; color: var(--text-primary); }

/* FEATURED */
.featured-post { padding: 8rem 5%; }
.featured-card { display: grid; grid-template-columns: 1.2fr 1fr; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 48px; overflow: hidden; border: 1px solid var(--glass-border); min-height: 520px; box-shadow: 0 40px 80px rgba(0,0,0,0.15); transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
.featured-card:hover { transform: translateY(-8px); }
.featured-image { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2)); background-size: cover; background-position: center; }
.featured-image-inner { position: absolute; inset: 0; background: radial-gradient(circle at 40% 40%, rgba(99,102,241,0.2), transparent 60%); }
.featured-tag { position: absolute; top: 2rem; left: 2rem; padding: 0.5rem 1.25rem; background: var(--accent-primary); color: white; border-radius: 100px; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.2em; }
.featured-info { padding: 5rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.post-date { font-size: 0.8rem; font-weight: 800; color: var(--accent-primary); letter-spacing: 0.1em; margin-bottom: 1.5rem; text-transform: uppercase; }
.featured-info h2 { font-size: 2.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 1.5rem; }
.featured-info p { font-size: 1.15rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 3rem; }
.primary-btn { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 2.5rem; background: linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%); color: white; border: none; border-radius: 14px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.4s cubic-bezier(0.23,1,0.32,1); box-shadow: 0 10px 30px rgba(99,102,241,0.25); }
.primary-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(99,102,241,0.35); }
.primary-btn svg { width: 18px; height: 18px; transition: transform 0.3s; }
.primary-btn:hover svg { transform: translateX(5px); }

/* POST GRID */
.post-grid-section { padding: 8rem 5%; background: var(--bg-secondary); }
.posts-carousel-wrapper { position: relative; }
.post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.post-card { display: flex; flex-direction: column; cursor: pointer; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
.post-card:hover { transform: translateY(-10px); }
.post-thumbnail { height: 240px; border-radius: 24px; margin-bottom: 2rem; overflow: hidden; position: relative; border: 1px solid var(--glass-border); }
.thumb-inner { position: absolute; inset: 0; background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.05), transparent 70%); }
.post-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.8rem; font-weight: 800; }
.post-category { color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.1em; }
.dot { width: 4px; height: 4px; background: var(--text-secondary); border-radius: 50%; }
.post-meta span:last-child { color: var(--text-secondary); }
.post-content h4 { font-size: 1.4rem; font-weight: 800; line-height: 1.3; margin-bottom: 1rem; letter-spacing: -0.02em; }
.post-content p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; }
.read-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-primary); text-decoration: none; font-weight: 700; font-size: 0.9rem; transition: gap 0.3s; cursor: pointer; }
.read-link svg { width: 16px; height: 16px; }

/* CTA */
.page-cta { padding: 8rem 5% 12rem; }
.cta-card { max-width: 860px; margin: 0 auto; background: var(--glass-bg); backdrop-filter: blur(40px); border-radius: 48px; padding: 7rem 5rem; text-align: center; border: 1px solid var(--glass-border); box-shadow: 0 40px 80px rgba(0,0,0,0.2); position: relative; overflow: hidden; }
.cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 300px; background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%); pointer-events: none; }
.cta-content { position: relative; z-index: 1; }
.cta-card h2 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 1rem; }
.cta-desc { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 3rem; }

@media (max-width: 1024px) { .featured-card { grid-template-columns: 1fr; } .post-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) {
  .page-hero { padding: 10rem 5% 6rem; } .featured-post, .post-grid-section { padding: 6rem 5%; } .cta-card { padding: 4rem 2rem; } .featured-info { padding: 3rem 2.5rem; } .featured-info h2 { font-size: 2rem; }
  .carousel-nav { display: flex; }
  .post-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 1.5rem; padding: 1rem 1rem 2rem; -webkit-overflow-scrolling: touch; scrollbar-width: none; grid-template-columns: none; }
  .post-grid::-webkit-scrollbar { display: none; }
  .post-card { flex: 0 0 82%; scroll-snap-align: center; }
}
@media (max-width: 480px) { .post-card { flex: 0 0 90%; } }
</style>
