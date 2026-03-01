<template>
  <div class="dynamic-page" v-if="pageData" :style="themeStyles">
    <div v-for="(block, index) in pageData.content" :key="block.id || index" class="page-block">

      <!-- ══ HERO ══════════════════════════════════════════════════ -->
      <section v-if="block.type === 'hero'" class="hero-block luxe-aura-bg">
        <div class="block-content centered">
          <div class="badge-wrapper">
            <span class="luxe-badge">{{ block.badge || 'ALPHA_NODE' }}</span>
          </div>
          <h1 class="block-title" v-html="formatGradient(block.title)"></h1>
          <p class="block-subtitle">{{ block.subtitle }}</p>
          <div class="hero-actions" v-if="block.buttonText">
            <button class="btn-luxe-primary" @click="handleCTA(block)">
              <span class="btn-text">{{ block.buttonText }}</span>
              <span class="btn-icon">→</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ══ RICH TEXT ══════════════════════════════════════════════ -->
      <section v-if="block.type === 'content'" class="content-block">
        <div class="block-content">
          <h2 v-if="block.title" class="section-title-luxe mb-md">{{ block.title }}</h2>
          <div class="text-body" v-html="formatText(block.text || '')"></div>
        </div>
      </section>

      <!-- ══ FEATURES GRID ══════════════════════════════════════════ -->
      <section v-if="block.type === 'features'" class="features-block">
        <div class="block-content">
          <h2 v-if="block.title" class="section-title-luxe mb-lg centered">{{ block.title }}</h2>
          <div class="features-grid">
            <div v-for="(feat, fIdx) in block.items" :key="fIdx" class="feature-card card-premium">
              <span class="feat-icon">{{ feat.icon || '✦' }}</span>
              <h3>{{ feat.title }}</h3>
              <p>{{ feat.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ STATS ══════════════════════════════════════════════════ -->
      <section v-if="block.type === 'stats'" class="stats-block">
        <div class="block-content">
          <h2 v-if="block.title" class="section-title-luxe mb-lg centered">{{ block.title }}</h2>
          <div class="stats-grid">
            <div v-for="(stat, sIdx) in block.items" :key="sIdx" class="stat-node">
              <span class="stat-value text-gradient">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CTA ════════════════════════════════════════════════════ -->
      <section v-if="block.type === 'cta'" class="cta-block">
        <div class="block-content">
          <div class="cta-luxe-card indigo-aura">
            <div class="aura-glow"></div>
            <div class="cta-inner">
              <div class="cta-text">
                <h2 class="luxe-title">{{ block.title }}</h2>
                <p class="luxe-description">{{ block.subtitle }}</p>
              </div>
              <div class="cta-actions">
                <button class="btn-luxe-primary" @click="handleCTA(block)">
                  <span class="btn-text">{{ block.buttonText || 'Contact Us' }}</span>
                  <span class="btn-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ SOLUTIONS FRAMEWORK ════════════════════════════════════ -->
      <section v-if="block.type === 'solutions'" class="solutions-dyn-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">SOLUTIONS</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="solutions-carousel-wrapper">
            <button class="carousel-nav prev" @click="scrollEl($event, 'left')" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div class="solutions-grid-scroll" @mousemove="handleMouseMove">
              <div
                v-for="(sol, sIdx) in block.items"
                :key="sIdx"
                class="solution-card"
                :style="{ '--card-accent': sol.accent }"
                @click="handleSolutionContact(sol)"
              >
                <div class="card-glow"></div>
                <div class="sol-header">
                  <h3>{{ sol.title }}</h3>
                  <div class="sol-subtitle">{{ sol.subtitle }}</div>
                </div>
                <p class="sol-description">{{ sol.description }}</p>
                <ul class="sol-features">
                  <li v-for="(f, fi) in sol.features" :key="fi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </li>
                </ul>
                <div class="sol-footer">
                  <span class="view-details">Explore</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
            <button class="carousel-nav next" @click="scrollEl($event, 'right')" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- ══ PREMIUM CARDS ══════════════════════════════════════════ -->
      <section v-if="block.type === 'cards'" class="cards-block">
        <div class="block-content">
          <h2 v-if="block.title" class="section-title-luxe mb-lg centered">{{ block.title }}</h2>
          <div class="cards-grid">
            <div v-for="(card, cIdx) in block.items" :key="cIdx" class="luxe-card-node">
              <div class="card-glow"></div>
              <div class="card-content-inner">
                <span class="card-icon-luxe">{{ card.icon }}</span>
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
                <div class="card-footer-action">
                  <span>Explore Architecture</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CAROUSEL ═══════════════════════════════════════════════ -->
      <section v-if="block.type === 'carousel'" class="carousel-block">
        <div class="carousel-container">
          <div class="carousel-track">
            <div v-for="(slide, sIdx) in block.items" :key="sIdx" class="carousel-slide">
              <img :src="slide.image" :alt="slide.title" class="slide-img">
              <div class="slide-overlay">
                <div class="slide-content">
                  <h2 class="slide-title">{{ slide.title }}</h2>
                  <p class="slide-text">{{ slide.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ ANALYTICS METRICS ══════════════════════════════════════ -->
      <section v-if="block.type === 'analytics'" class="analytics-block">
        <div class="block-content">
          <div class="analytics-header">
            <span class="luxe-badge">REAL_TIME_INSIGHTS</span>
            <h2 class="section-title-luxe">{{ block.title || 'Platform' }} <span class="text-gradient">Metrics</span></h2>
          </div>
          <div class="analytics-grid">
            <div v-for="(data, dIdx) in block.items" :key="dIdx" class="data-card card-premium">
              <div class="data-header">
                <span class="data-label">{{ data.label }}</span>
                <span class="data-change" :class="{ positive: data.change?.includes('+') }">{{ data.change }}</span>
              </div>
              <div class="data-main">
                <span class="data-value">{{ data.value }}</span>
                <div class="data-sparkline">
                  <div class="spark-bar" v-for="n in 12" :key="n" :style="{ height: (30 + (n * 17 % 70)) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ INSIGHTS / BLOG CARDS ══════════════════════════════════ -->
      <section v-if="block.type === 'insights'" class="insights-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">INSIGHTS</div>
            <h2>{{ block.title }}</h2>
          </div>
          <!-- Use real InsightsCarousel if live data available, else render manually -->
          <InsightsCarousel
            v-if="liveInsights.length > 0"
            :insights="liveInsights"
            @open-insight="openInsight"
          />
          <div v-else class="insights-grid-dyn">
            <div v-for="(art, aIdx) in block.items" :key="aIdx" class="insight-card-dyn card-premium">
              <div class="insight-img-wrap">
                <img v-if="art.image" :src="art.image" :alt="art.title" class="insight-img">
                <div v-else class="insight-img-placeholder"></div>
              </div>
              <div class="insight-body">
                <span class="insight-cat">{{ art.category }}</span>
                <h3>{{ art.title }}</h3>
                <p>{{ art.excerpt }}</p>
                <span class="insight-time">{{ art.readTime }} read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ TEAM GRID ══════════════════════════════════════════════ -->
      <section v-if="block.type === 'team'" class="team-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">TEAM</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="team-grid-dyn">
            <div v-for="(member, mIdx) in block.items" :key="mIdx" class="team-card-dyn card-premium">
              <div class="team-avatar" :style="{ background: member.accent || 'linear-gradient(135deg,#6366f1,#a855f7)' }">
                <img v-if="member.image" :src="member.image" :alt="member.name" class="team-photo">
                <span v-else class="team-initials">{{ member.initials }}</span>
              </div>
              <h3 class="team-name">{{ member.name }}</h3>
              <div class="team-role">{{ member.role }}</div>
              <p class="team-bio">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ TESTIMONIALS ═══════════════════════════════════════════ -->
      <section v-if="block.type === 'testimonials'" class="testimonials-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">TESTIMONIALS</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="testimonials-grid">
            <div v-for="(t, tIdx) in block.items" :key="tIdx" class="testimonial-card card-premium">
              <div class="stars">
                <span v-for="s in (t.rating || 5)" :key="s">★</span>
              </div>
              <p class="quote-text">"{{ t.quote }}"</p>
              <div class="quote-author">
                <strong>{{ t.author }}</strong>
                <span>{{ t.company }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ FAQ ════════════════════════════════════════════════════ -->
      <section v-if="block.type === 'faq'" class="faq-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">FAQ</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="faq-list">
            <details v-for="(item, fIdx) in block.items" :key="fIdx" class="faq-item card-premium">
              <summary class="faq-question">{{ item.question }}</summary>
              <div class="faq-answer">{{ item.answer }}</div>
            </details>
          </div>
        </div>
      </section>

      <!-- ══ ECOSYSTEM / TRUST BAR ══════════════════════════════════ -->
      <section v-if="block.type === 'ecosystem'" class="ecosystem-block">
        <p class="trust-label">{{ block.label || 'INTEGRATED WITH YOUR ECOSYSTEM' }}</p>
        <div class="eco-marquee">
          <div class="eco-track">
            <div v-for="(item, eIdx) in [...(block.items || []), ...(block.items || [])]" :key="eIdx" class="eco-item">
              <span class="eco-icon" :style="{ color: item.color }">{{ item.icon }}</span>
              <span class="eco-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ VIDEO EMBED ═════════════════════════════════════════════ -->
      <section v-if="block.type === 'video'" class="video-block">
        <div class="block-content">
          <h2 v-if="block.title" class="section-title-luxe mb-lg centered">{{ block.title }}</h2>
          <div class="video-chrome">
            <iframe
              v-if="block.url?.includes('youtube') || block.url?.includes('youtu')"
              :src="block.url"
              class="video-frame"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
            <video v-else-if="block.url" :src="block.url" class="video-frame" controls></video>
          </div>
          <p v-if="block.caption" class="video-caption">{{ block.caption }}</p>
        </div>
      </section>

      <!-- ══ PRICING TABLE ══════════════════════════════════════════ -->
      <section v-if="block.type === 'pricing'" class="pricing-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">PRICING</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="pricing-grid">
            <div v-for="(plan, pIdx) in block.items" :key="pIdx" class="pricing-card card-premium" :class="{ popular: plan.popular }">
              <div v-if="plan.popular" class="popular-badge">Most Popular</div>
              <div class="plan-name">{{ plan.name }}</div>
              <div class="plan-price">{{ plan.price }}</div>
              <p class="plan-desc">{{ plan.description }}</p>
              <ul class="plan-features">
                <li v-for="(feat, fIdx) in plan.features" :key="fIdx">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ feat }}
                </li>
              </ul>
              <button class="btn-luxe-primary full-w" @click="handleCTA(block)">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ TIMELINE ════════════════════════════════════════════════ -->
      <section v-if="block.type === 'timeline'" class="timeline-block">
        <div class="block-content">
          <div class="section-header centered" v-if="block.title">
            <div class="detail-badge">JOURNEY</div>
            <h2>{{ block.title }}</h2>
          </div>
          <div class="timeline-list">
            <div v-for="(event, tIdx) in block.items" :key="tIdx" class="timeline-item">
              <div class="timeline-year">{{ event.year }}</div>
              <div class="timeline-connector"><div class="timeline-dot"></div></div>
              <div class="timeline-content card-premium">
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Insight Modal -->
    <InsightModal
      v-if="selectedInsight"
      :is-open="!!selectedInsight"
      :insight="selectedInsight"
      @close="selectedInsight = null"
    />

  </div>
  <div v-else-if="!isPreview" class="page-404 centered">
    <h1>404</h1>
    <p>Neural Node Not Found</p>
    <router-link to="/" class="btn-luxe-primary">Return Home</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { insightsAPI, pagesAPI } from '@/services/api'
import { navStore } from '@/store/navigation'
import InsightsCarousel from '@/components/InsightsCarousel.vue'
import InsightModal from '@/components/InsightModal.vue'

const props = defineProps({
  pageData: { type: Object, default: null },
  isPreview: { type: Boolean, default: false }
})

const route = useRoute()

// ── Resolve page data ─────────────────────────────────────────────────
// Priority: 1) prop (preview mode)  2) navStore (local)  3) API (DB)
const resolvedPageData = ref(null)

const resolvePageId = () => {
  if (props.pageData) return null  // prop mode — skip
  // Try /p/:pageId first
  if (route.params.pageId) return route.params.pageId
  // Try /:category/:id
  if (route.params.id) return route.params.id
  // Fallback: last segment of path
  return route.path.split('/').filter(Boolean).pop()
}

const loadPageData = async () => {
  if (props.pageData) {
    resolvedPageData.value = props.pageData
    return
  }

  const pageId = resolvePageId()
  if (!pageId) return

  // 1. Try navStore first (instant, no network)
  const stored = Object.values(navStore.matrix).find(
    p => p.id === pageId || p.path === route.path
  )
  if (stored && stored.content) {
    resolvedPageData.value = stored
    return
  }

  // 2. Fallback: fetch from API
  try {
    const res = await pagesAPI.getConfig(pageId)
    if (res.data && res.data.content) {
      resolvedPageData.value = res.data
    }
  } catch (err) {
    console.warn('DynamicView: could not load page', pageId, err)
  }
}

// ── Computed page data (prop or resolved) ─────────────────────────────
const pageData = computed(() => props.pageData || resolvedPageData.value)

// ── Theme ──────────────────────────────────────────────────────────────
const themeStyles = computed(() => ({
  '--primary': pageData.value?.theme?.primary || '#6366f1',
  '--accent': pageData.value?.theme?.accent || '#a855f7'
}))

// ── Injected modals ────────────────────────────────────────────────────
const openSolutionModal = inject('openSolutionModal', null)
const openDemoModal = inject('openDemoModal', null)

const handleCTA = (block) => {
  if (openDemoModal) {
    openDemoModal('demo', {
      title: block.buttonText || 'Get Started',
      subtitle: block.subtitle || '',
      message: `I'd like to learn more about: ${block.title || 'your platform'}.`
    })
  }
}

const handleSolutionContact = (sol) => {
  if (openSolutionModal) {
    openSolutionModal({
      title: sol.title,
      message: `I'm interested in the "${sol.title}" solution.`,
      accent: sol.accent?.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|linear-gradient\([^)]+\)/)?.[0] || 'var(--accent-primary)'
    })
  }
}

// ── Live insights ──────────────────────────────────────────────────────
const liveInsights = ref([])
const selectedInsight = ref(null)
const openInsight = (insight) => { selectedInsight.value = insight }

// ── Solutions carousel ─────────────────────────────────────────────────
const scrollEl = (e, dir) => {
  const grid = e.currentTarget.closest('.solutions-carousel-wrapper')?.querySelector('.solutions-grid-scroll')
  if (grid) grid.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
}

const handleMouseMove = (e) => {
  const cards = e.currentTarget.querySelectorAll('.solution-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  })
}

// ── Text helpers ───────────────────────────────────────────────────────
const formatGradient = (text = '') => {
  if (!text) return text
  const words = text.split(' ')
  const half = Math.ceil(words.length / 2)
  return `${words.slice(0, half).join(' ')} <span class="text-gradient">${words.slice(half).join(' ')}</span>`
}

const formatText = (text = '') =>
  text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(async () => {
  await loadPageData()

  if (!props.isPreview) {
    try {
      const res = await insightsAPI.getAll({ page: '', published: true })
      liveInsights.value = res.data?.items || []
    } catch {
      liveInsights.value = []
    }
  }
})

// Re-fetch if route changes (SPA navigation)
watch(() => route.params, loadPageData)
// Re-sync if prop changes (preview updates live)
watch(() => props.pageData, (v) => { if (v) resolvedPageData.value = v })
</script>

<style scoped>
/* ── CSS Variables (overridden by theme) ─────────────────────────── */
.dynamic-page {
  --primary: #6366f1;
  --accent: #a855f7;
  background: #000;
  color: white;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

/* ── Shared Layout ───────────────────────────────────────────────── */
.block-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2.5rem;
}
.centered { text-align: center; }
.mb-md { margin-bottom: 2rem; }
.mb-lg { margin-bottom: 3rem; }
.full-w { width: 100%; justify-content: center; }

.section-header { margin-bottom: 4rem; }
.section-header h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 950;
  color: white;
  margin-top: 1rem;
  line-height: 1.15;
}

.detail-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--primary);
  border: 1px solid rgba(99,102,241,0.3);
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-premium {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  transition: border-color 0.3s, transform 0.3s;
}
.card-premium:hover {
  border-color: rgba(99,102,241,0.35);
}

/* ── Hero Block ──────────────────────────────────────────────────── */
.hero-block {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.luxe-aura-bg::before {
  content: '';
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.badge-wrapper { margin-bottom: 2rem; }
.luxe-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.22em;
  color: var(--primary);
  border: 1px solid rgba(99,102,241,0.35);
  padding: 7px 20px;
  border-radius: 100px;
}
.block-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 950;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}
.block-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #71717a;
  max-width: 680px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.btn-luxe-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}
.btn-luxe-primary:hover { opacity: 0.85; transform: translateY(-2px); }

/* ── Rich Text ───────────────────────────────────────────────────── */
.content-block { padding: 0; }
.section-title-luxe {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 950;
  color: white;
  line-height: 1.2;
}
.text-body {
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.85;
  max-width: 780px;
}
.text-body p { margin-bottom: 1.25rem; }
.text-body strong { color: white; }

/* ── Features Grid ────────────────────────────────────────────────── */
.features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
.feature-card { padding: 2.5rem 2rem !important; }
.feature-card:hover { transform: translateY(-6px); }
.feat-icon { font-size: 2rem; display: block; margin-bottom: 1.25rem; }
.feature-card h3 { font-size: 1.1rem; font-weight: 850; color: white; margin-bottom: 0.75rem; }
.feature-card p { font-size: 0.9rem; color: #71717a; line-height: 1.65; }

/* ── Stats ───────────────────────────────────────────────────────── */
.stats-block { background: rgba(255,255,255,0.01); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 2rem; text-align: center; }
.stat-node { padding: 2rem 1rem; }
.stat-value { display: block; font-size: clamp(2.5rem, 4vw, 4rem); font-weight: 950; line-height: 1; margin-bottom: 0.75rem; }
.stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #52525b; }

/* ── CTA Block ───────────────────────────────────────────────────── */
.cta-luxe-card {
  position: relative;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 28px;
  padding: 4rem;
  overflow: hidden;
}
.indigo-aura .aura-glow {
  position: absolute;
  top: -80px; left: 50%;
  transform: translateX(-50%);
  width: 500px; height: 300px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.25), transparent 70%);
  pointer-events: none;
}
.cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 3rem; flex-wrap: wrap; }
.cta-text { flex: 1; min-width: 280px; }
.luxe-title { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 950; color: white; line-height: 1.2; margin-bottom: 1rem; }
.luxe-description { font-size: 1rem; color: #a1a1aa; line-height: 1.6; max-width: 480px; }
.cta-actions { flex-shrink: 0; }

/* ── Solutions Framework ─────────────────────────────────────────── */
.solutions-dyn-block { padding: 4rem 0; }
.solutions-carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2.5rem;
}
.solutions-grid-scroll {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 1rem 0 2rem;
}
.solutions-grid-scroll::-webkit-scrollbar { display: none; }

.solution-card {
  flex: 0 0 320px;
  scroll-snap-align: start;
  position: relative;
  background: #000;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.35s, border-color 0.35s;
}
.solution-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.15);
}
.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.12), transparent);
  transition: opacity 0.4s;
  pointer-events: none;
}
.solution-card:hover::before { opacity: 1; }
.card-glow {
  position: absolute; top: -40px; right: -40px;
  width: 140px; height: 140px; border-radius: 50%;
  background: var(--card-accent, linear-gradient(135deg,#6366f1,#a855f7));
  opacity: 0.12; filter: blur(50px); pointer-events: none;
}
.sol-header { margin-bottom: 1rem; }
.sol-header h3 { font-size: 1.15rem; font-weight: 900; color: white; margin-bottom: 6px; }
.sol-subtitle { font-size: 0.62rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: #52525b; }
.sol-description { font-size: 0.9rem; color: #71717a; line-height: 1.6; margin-bottom: 1.75rem; }
.sol-features { list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 8px; }
.sol-features li { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #a1a1aa; }
.sol-features svg { flex-shrink: 0; color: #10b981; }
.sol-footer { display: flex; align-items: center; gap: 8px; color: var(--primary); font-size: 0.8rem; font-weight: 800; }
.view-details { font-size: 0.8rem; }

.carousel-nav {
  flex-shrink: 0;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: 0.3s;
}
.carousel-nav:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); }
.carousel-nav svg { width: 18px; height: 18px; }

/* ── Premium Cards ───────────────────────────────────────────────── */
.cards-block { padding: 4rem 0; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.luxe-card-node { position: relative; padding: 2.5rem !important; overflow: hidden; cursor: pointer; }
.luxe-card-node:hover { transform: translateY(-6px); }
.luxe-card-node .card-glow { top: -30px; right: -30px; width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary), var(--accent)); opacity: 0.12; filter: blur(40px); }
.card-content-inner { position: relative; z-index: 1; }
.card-icon-luxe { font-size: 2rem; display: block; margin-bottom: 1.25rem; }
.luxe-card-node h3 { font-size: 1.1rem; font-weight: 850; color: white; margin-bottom: 0.75rem; }
.luxe-card-node p { font-size: 0.875rem; color: #71717a; line-height: 1.65; margin-bottom: 1.5rem; }
.card-footer-action { display: flex; align-items: center; gap: 8px; color: var(--primary); font-size: 0.8rem; font-weight: 800; }

/* ── Carousel ────────────────────────────────────────────────────── */
.carousel-block { width: 100%; }
.carousel-container { height: 500px; overflow: hidden; }
.carousel-track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.carousel-track::-webkit-scrollbar { display: none; }
.carousel-slide { flex: 0 0 100%; scroll-snap-align: start; position: relative; }
.slide-img { width: 100%; height: 100%; object-fit: cover; }
.slide-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  display: flex; align-items: flex-end;
}
.slide-content { padding: 3rem; }
.slide-title { font-size: 2.5rem; font-weight: 950; color: white; margin-bottom: 0.5rem; }
.slide-text { font-size: 1rem; color: rgba(255,255,255,0.7); max-width: 500px; }

/* ── Analytics ───────────────────────────────────────────────────── */
.analytics-block { padding: 4rem 0; }
.analytics-header { margin-bottom: 3rem; text-align: center; }
.analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.data-card { padding: 2rem !important; display: flex; flex-direction: column; gap: 1.5rem; }
.data-header { display: flex; justify-content: space-between; align-items: center; }
.data-label { font-size: 0.7rem; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; }
.data-change { font-size: 0.75rem; font-weight: 800; color: #ef4444; background: rgba(239,68,68,0.1); padding: 2px 8px; border-radius: 100px; }
.data-change.positive { color: #10b981; background: rgba(16,185,129,0.1); }
.data-main { display: flex; align-items: flex-end; justify-content: space-between; }
.data-value { font-size: 2.5rem; font-weight: 950; color: white; line-height: 1; }
.data-sparkline { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
.spark-bar { width: 4px; background: var(--primary); border-radius: 10px; opacity: 0.5; transition: height 0.3s; }

/* ── Insights ────────────────────────────────────────────────────── */
.insights-block { padding: 4rem 0; }
.insights-grid-dyn { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
.insight-card-dyn { overflow: hidden; padding: 0 !important; }
.insight-img-wrap { height: 200px; overflow: hidden; }
.insight-img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
.insight-card-dyn:hover .insight-img { transform: scale(1.05); }
.insight-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1)); }
.insight-body { padding: 1.75rem; }
.insight-cat { font-size: 0.6rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; display: block; }
.insight-card-dyn h3 { font-size: 1.1rem; font-weight: 850; color: white; margin-bottom: 0.75rem; line-height: 1.4; }
.insight-card-dyn p { font-size: 0.85rem; color: #71717a; line-height: 1.6; margin-bottom: 1rem; }
.insight-time { font-size: 0.7rem; color: #52525b; font-weight: 700; }

/* ── Team ────────────────────────────────────────────────────────── */
.team-block { padding: 4rem 0; }
.team-grid-dyn { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2rem; }
.team-card-dyn { padding: 2.5rem !important; text-align: center; }
.team-card-dyn:hover { transform: translateY(-6px); }
.team-avatar { width: 90px; height: 90px; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.team-photo { width: 100%; height: 100%; object-fit: cover; }
.team-initials { font-size: 1.5rem; font-weight: 900; color: white; }
.team-name { font-size: 1.15rem; font-weight: 900; color: white; margin-bottom: 0.4rem; }
.team-role { font-size: 0.68rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1rem; }
.team-bio { font-size: 0.85rem; color: #71717a; line-height: 1.6; }

/* ── Testimonials ────────────────────────────────────────────────── */
.testimonials-block { padding: 4rem 0; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.testimonial-card { padding: 2.5rem !important; display: flex; flex-direction: column; gap: 1.25rem; }
.stars { color: #f59e0b; font-size: 1.2rem; letter-spacing: 0.1em; }
.quote-text { font-size: 1.05rem; color: #e4e4e7; line-height: 1.7; font-style: italic; flex: 1; }
.quote-author { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; }
.quote-author strong { display: block; color: white; font-size: 0.9rem; }
.quote-author span { font-size: 0.75rem; color: #52525b; }

/* ── FAQ ─────────────────────────────────────────────────────────── */
.faq-block { padding: 4rem 0; }
.faq-list { display: flex; flex-direction: column; gap: 1rem; max-width: 820px; margin: 0 auto; }
.faq-item { padding: 0 !important; overflow: hidden; }
.faq-question { padding: 1.5rem 2rem; font-size: 1rem; font-weight: 700; color: white; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.faq-question::after { content: '＋'; color: var(--primary); font-size: 1.2rem; flex-shrink: 0; }
details[open] .faq-question::after { content: '－'; }
.faq-answer { padding: 0 2rem 1.75rem; color: #71717a; line-height: 1.75; border-top: 1px solid rgba(255,255,255,0.05); }

/* ── Ecosystem ───────────────────────────────────────────────────── */
.ecosystem-block { padding: 2.5rem 0; text-align: center; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
.trust-label { font-size: 0.62rem; font-weight: 900; letter-spacing: 0.22em; color: #3f3f46; margin-bottom: 2rem; text-transform: uppercase; }
.eco-marquee { overflow: hidden; }
.eco-track { display: flex; gap: 3.5rem; animation: ecoScroll 25s linear infinite; width: max-content; }
.eco-item { display: flex; align-items: center; gap: 0.75rem; white-space: nowrap; }
.eco-icon { font-size: 1.4rem; }
.eco-name { font-size: 0.85rem; font-weight: 700; color: #52525b; }
@keyframes ecoScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── Video ───────────────────────────────────────────────────────── */
.video-block { padding: 4rem 0; }
.video-chrome { border-radius: 24px; overflow: hidden; aspect-ratio: 16/9; background: #000; border: 1px solid rgba(255,255,255,0.05); }
.video-frame { width: 100%; height: 100%; border: none; }
.video-caption { text-align: center; font-size: 0.85rem; color: #52525b; margin-top: 1.25rem; }

/* ── Pricing ─────────────────────────────────────────────────────── */
.pricing-block { padding: 4rem 0; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: start; }
.pricing-card { padding: 3rem 2.5rem !important; position: relative; }
.pricing-card.popular { border-color: var(--primary); box-shadow: 0 0 40px rgba(99,102,241,0.15); }
.popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; font-size: 0.62rem; font-weight: 900; letter-spacing: 0.12em; padding: 5px 18px; border-radius: 100px; white-space: nowrap; }
.plan-name { font-size: 0.68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #52525b; margin-bottom: 1rem; }
.plan-price { font-size: 3rem; font-weight: 950; color: white; line-height: 1; margin-bottom: 0.75rem; }
.plan-desc { font-size: 0.875rem; color: #71717a; margin-bottom: 2rem; line-height: 1.6; }
.plan-features { list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 10px; }
.plan-features li { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #a1a1aa; }
.plan-features svg { color: #10b981; flex-shrink: 0; }

/* ── Timeline ────────────────────────────────────────────────────── */
.timeline-block { padding: 4rem 0; }
.timeline-list { max-width: 820px; margin: 0 auto; }
.timeline-item { display: grid; grid-template-columns: 80px 40px 1fr; align-items: start; margin-bottom: 2rem; }
.timeline-year { font-size: 0.68rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; padding-top: 1.4rem; text-align: right; padding-right: 1rem; }
.timeline-connector { display: flex; flex-direction: column; align-items: center; padding-top: 1.4rem; position: relative; }
.timeline-connector::after { content: ''; position: absolute; top: 24px; width: 1px; height: calc(100% + 2rem - 24px); background: rgba(99,102,241,0.2); }
.timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--primary); flex-shrink: 0; box-shadow: 0 0 16px var(--primary); z-index: 1; position: relative; }
.timeline-content { padding: 1.5rem 2rem !important; margin-left: 1rem; }
.timeline-content h3 { font-size: 1.05rem; font-weight: 850; color: white; margin-bottom: 0.5rem; }
.timeline-content p { font-size: 0.875rem; color: #71717a; line-height: 1.65; }

/* ── 404 ─────────────────────────────────────────────────────────── */
.page-404 { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
.page-404 h1 { font-size: 6rem; font-weight: 950; color: white; line-height: 1; }
.page-404 p { color: #52525b; font-size: 1.1rem; }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .block-content { padding: 4rem 2rem; }
  .cta-inner { flex-direction: column; text-align: center; }
  .luxe-description { max-width: 100%; }
  .carousel-container { height: 380px; }
}

@media (max-width: 768px) {
  .block-content { padding: 3rem 1.5rem; }
  .solutions-carousel-wrapper { padding: 0 1.5rem; }
  .solution-card { flex: 0 0 280px; }
  .cta-luxe-card { padding: 2.5rem 1.5rem; }
  .timeline-item { grid-template-columns: 60px 30px 1fr; }
  .timeline-year { font-size: 0.6rem; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
  .slide-title { font-size: 1.8rem; }
  .slide-content { padding: 2rem; }
  .carousel-container { height: 300px; }
}

@media (max-width: 480px) {
  .block-content { padding: 2.5rem 1.25rem; }
  .hero-block { min-height: 55vh; }
  .block-title { font-size: 2.2rem; }
  .features-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .analytics-grid { grid-template-columns: 1fr; }
  .team-grid-dyn { grid-template-columns: 1fr 1fr; }
  .insights-grid-dyn { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .timeline-item { grid-template-columns: 50px 30px 1fr; }
  .carousel-nav { display: none; }
  .solutions-grid-scroll { padding-left: 1.25rem; }
}
</style>
