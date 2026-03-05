<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero careers-gradient" v-if="pageConfig">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">{{ pageConfig.hero_badge }}</span>
        </div>
        <h1 class="hero-title" v-html="formatGradientTitle(pageConfig.hero_title)"></h1>
        <p class="hero-subtitle">{{ pageConfig.hero_subtitle }}</p>
        <div class="hero-actions">
          <a href="#open-roles" class="primary-btn">
            View Open Roles
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Perks Section (Solutions Grid Style) -->
    <section class="perks-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">WHY DREAMATIC</div>
          <h2>The Perks of <span class="text-gradient">High Velocity</span></h2>
          <p class="section-subtitle">We don't just build the future — we make sure you thrive while doing it.</p>
        </div>

        <div class="perks-grid-wrapper">
          <button class="carousel-arrow carousel-arrow-left" @click="scrollPerks('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="carousel-arrow carousel-arrow-right" @click="scrollPerks('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div class="perks-grid" ref="perksGrid" @mousemove="handlePerksMouseMove">
            <div
              v-for="(perk, index) in perks"
              :key="index"
              class="perk-card"
              :style="{ '--card-accent': 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)' }"
            >
              <div class="card-glow"></div>
              <div class="perk-icon-wrap">
                <svg v-html="perk.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="perk-icon"></svg>
              </div>
              <h3 class="perk-title">{{ perk.title }}</h3>
              <p class="perk-desc">{{ perk.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Roles Section -->
    <section class="roles-section" id="open-roles">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">OPEN ROLES</div>
          <h2>Current <span class="text-gradient">Opportunities</span></h2>
        </div>

        <div class="roles-grid-wrapper">
          <button class="carousel-arrow carousel-arrow-left" @click="scrollRoles('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="carousel-arrow carousel-arrow-right" @click="scrollRoles('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div class="roles-list" ref="rolesGrid">
            <div
              v-for="role in roles"
              :key="role._id || role.title"
              class="role-card-vessel"
              @click="selectedJobDetail = role"
            >
              <div class="role-card">
                <div class="role-left">
                  <div class="role-type-badge">{{ role.type || 'Full-time' }}</div>
                  <div class="role-info">
                    <h3 class="role-title">{{ role.title }}</h3>
                    <div class="role-meta">
                      <span>{{ role.team }}</span>
                      <span class="meta-dot"></span>
                      <span>{{ role.location }}</span>
                    </div>
                  </div>
                </div>
                <div class="role-actions">
                  <button class="protocol-btn" @click.stop="selectedJobDetail = role">
                    View Protocol
                  </button>
                  <button class="apply-btn-primary" @click.stop="openJobModal(role.title)">
                    Apply Now
                    <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="roles.length === 0" class="no-roles">
              <div class="no-roles-icon">💼</div>
              <h3>No Openings Right Now</h3>
              <p>We're always looking for great people. Send us your resume.</p>
            </div>
          </div>
        </div>

        <div class="speculative-card">
          <div class="speculative-content">
            <div class="speculative-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="speculative-text">
              <h3>Not seeing the <span class="text-gradient">perfect fit</span>?</h3>
              <p>We're always looking for exceptional talent to orbit our core teams. Send a speculative transmission or reach out directly.</p>
            </div>
          </div>
          <div class="speculative-actions">
            <a href="mailto:careers@dreamatic.ai" class="secondary-btn">careers@dreamatic.ai</a>
            <button class="primary-btn" @click="openContactModal({ subject: 'Careers', message: 'I am interested in future opportunities at Dreamactic.' })">
              General Inquiry
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Ready to revolutionize <span class="text-gradient">Work</span>?</h2>
          <p class="cta-subtitle">We move fast, build boldly, and reward exceptional talent across every frontier.</p>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Send an Inquiry
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Protocol Popup -->
    <JobDetailModal 
      v-if="selectedJobDetail"
      :isOpen="!!selectedJobDetail"
      :job="selectedJobDetail"
      @close="selectedJobDetail = null"
      @apply="j => openJobModal(j.title)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { jobsAPI, pagesAPI } from '@/services/api'
import { useRoute } from 'vue-router'
import JobDetailModal from './JobDetailModal.vue'

const route = useRoute()
const openContactModal = inject('openContactModal')
const openJobModal = inject('openJobModal')

const perks = ref([])
const roles = ref([])
const perksGrid = ref(null)
const rolesGrid = ref(null)
const selectedJobDetail = ref(null)

const pageConfig = ref({
  hero_badge: 'CAREERS',
  hero_title: 'Build the Future of Enterprise AI',
  hero_subtitle: 'Join a team solving some of the hardest problems in artificial intelligence—from real-time agent orchestration to neural architecture optimization. We offer competitive compensation, significant equity, and the opportunity to shape how Fortune 500 companies deploy autonomous AI at scale.'
})

const formatGradientTitle = (title) => {
  if (!title) return ''
  const parts = title.split(' ')
  if (parts.length > 1) {
    const last = parts.pop()
    const secondLast = parts.pop()
    return `${parts.join(' ')} <span class="text-gradient">${secondLast} ${last}</span>`
  }
  return title
}

const handlePerksMouseMove = (e) => {
  if (!perksGrid.value) return
  const cards = perksGrid.value.querySelectorAll('.perk-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
    card.querySelector('.card-glow').style.opacity = '0.15'
  })
}

const scrollPerks = (direction) => {
  if (!perksGrid.value) return
  const scrollAmount = perksGrid.value.offsetWidth * 0.85
  perksGrid.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
}

const scrollRoles = (direction) => {
  if (!rolesGrid.value) return
  const scrollAmount = 400
  rolesGrid.value.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
}

const formatMarkdown = (text) => {
  if (!text) return ''
  // Simple markdown conversion for bold and lists until a full lib is added
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '• $1')
    .replace(/\n/g, '<br>')
}

const formatRequirements = (reqs) => {
  if (!reqs) return []
  // Split by newlines or bullet points
  return reqs.split(/\n|•|\*/).map(r => r.trim()).filter(r => r.length > 0)
}

const refreshCount = inject('refreshCount', ref(0))

const syncData = async () => {
  try {
    const [careersConfig, jobsData] = await Promise.all([
      pagesAPI.getConfig('careers'),
      jobsAPI.getAll()
    ])
    if (careersConfig) {
      pageConfig.value = careersConfig
      if (careersConfig.perks) perks.value = careersConfig.perks
    }
    if (jobsData?.length) {
      roles.value = jobsData.map(j => ({ ...j, showDetails: false }))
      
      // Check for ID in query params to auto-open modal (only on initial mount)
      if (route.query.id && !selectedJobDetail.value) {
        const targetJob = jobsData.find(j => j._id === route.query.id || j.id === route.query.id)
        if (targetJob) {
          openJobModal(targetJob.title)
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync careers data:', err)
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)
  await syncData()
})

// Listen for global sync heartbeat
watch(refreshCount, syncData)
</script>

<style scoped>
.page-container {
  width: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* ── Hero ─────────────────────────────────────────────────── */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.careers-gradient::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.07) 0%, transparent 70%);
  background: radial-gradient(circle at center, rgba(34, 211, 238, 0.07) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.badge-wrapper { margin-bottom: 2rem; }

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #22d3ee;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-weight: 500;
}

.hero-actions { display: flex; justify-content: center; gap: 1.5rem; }

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(34, 211, 238, 0.25);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: 0.6s;
  z-index: 2;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 40px rgba(34, 211, 238, 0.35);
}

.primary-btn:hover::before { left: 100%; }

.btn-arrow {
  width: 18px; height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.primary-btn:hover .btn-arrow { transform: translateX(5px); }

/* ── Shared Layout ───────────────────────────────────────── */
.section-container { max-width: 1200px; margin: 0 auto; }

.centered { text-align: center; }

.detail-badge {
  font-family: var(--font-accent);
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 560px;
  margin: -0.5rem auto 0;
  line-height: 1.6;
  font-weight: 500;
}

/* Carousel arrows */
.carousel-arrow {
  display: none;
  position: absolute;
  top: 50%; transform: translateY(-50%);
  z-index: 10;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0; pointer-events: none;
  align-items: center; justify-content: center;
}
.perks-grid-wrapper:hover .carousel-arrow,
.roles-grid-wrapper:hover .carousel-arrow {
  opacity: 1; pointer-events: auto;
}
.carousel-arrow:hover {
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.3);
  transform: translateY(-50%) scale(1.1);
}
.carousel-arrow svg { width: 24px; height: 24px; }
.carousel-arrow-left { left: -24px; }
.carousel-arrow-right { right: -24px; }
.perks-grid-wrapper:hover .carousel-arrow-left,
.roles-grid-wrapper:hover .carousel-arrow-left { left: 10px; }
.perks-grid-wrapper:hover .carousel-arrow-right,
.roles-grid-wrapper:hover .carousel-arrow-right { right: 10px; }

/* ── Perks Section ──────────────────────────────────────── */
.perks-section { padding: 4rem 5% 8rem; }

.perks-grid-wrapper { position: relative; }

.perks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.perk-card {
  position: relative;
  padding: 3rem 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.perk-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #22d3ee 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.perk-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); }
.perk-card:hover::before { opacity: 0.8; }

.perk-icon-wrap {
  width: 56px; height: 56px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 2rem;
  color: #22d3ee;
}
.perk-icon { width: 26px; height: 26px; }

.perk-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.perk-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ── Roles Section ──────────────────────────────────────── */
.roles-section {
  padding: 4rem 5% 8rem;
  background: var(--bg-secondary);
}

.roles-grid-wrapper { position: relative; }

.roles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
}

.role-card-vessel {
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.role-card-vessel.is-expanded {
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.role-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.25rem 2.75rem;
  cursor: pointer;
}

.role-card-vessel:hover {
  border-color: rgba(34, 211, 238, 0.3);
  background: rgba(255, 255, 255, 0.01);
}

.role-left { display: flex; align-items: center; gap: 1.75rem; }

.role-type-badge {
  padding: 0.4rem 1rem;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 950;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.role-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.role-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 600;
}
.meta-dot {
  width: 4px; height: 4px;
  background: rgba(245, 158, 11, 0.4);
  border-radius: 50%;
}

.role-actions { display: flex; align-items: center; gap: 1.25rem; }

.protocol-btn {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 0.8rem 1.75rem;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
}
.protocol-btn:hover { border-color: rgba(14, 165, 233, 0.5); color: #0ea5e9; }

.apply-btn-primary {
  padding: 0.8rem 2rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 850;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
/* ── Speculative Card ───────────────────────────────────── */
.speculative-card {
  margin-top: 5rem;
  padding: 3.5rem 4rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
}

.speculative-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.speculative-icon {
  width: 64px; height: 64px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  color: #0ea5e9;
  flex-shrink: 0;
}

.speculative-text h3 {
  font-size: 1.75rem;
  font-weight: 850;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.speculative-text p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 500px;
}

.speculative-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.speculative-actions .secondary-btn {
  color: white;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  transition: 0.3s;
}
.speculative-actions .secondary-btn:hover { color: var(--accent-primary); text-decoration: underline; }

.speculative-actions .primary-btn {
  padding: 1rem 1.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  display: flex; align-items: center; gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.speculative-actions .primary-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }

/* Transitions */
.expand-enter-active, .expand-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); max-height: 1500px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-10px); }

/* ── CTA ─────────────────────────────────────────────────── */
.page-cta { padding: 8rem 5% 10rem; }

.cta-card {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 48px;
  padding: 6rem 4rem;
  text-align: center;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}
.cta-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 3.5rem;
  font-weight: 850;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  position: relative; z-index: 1;
}

.cta-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  position: relative; z-index: 1;
  line-height: 1.6;
}

.cta-buttons { display: flex; justify-content: center; position: relative; z-index: 1; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .speculative-card {
    flex-direction: column;
    text-align: center;
    padding: 3rem 2rem;
    gap: 2rem;
  }
  .speculative-content { flex-direction: column; }
  .speculative-text p { max-width: 100%; }
  .speculative-actions { flex-direction: column; width: 100%; }
  .speculative-actions .primary-btn { width: 100%; justify-content: center; }
  
  .perks-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  .carousel-arrow {
    display: flex;
    opacity: 0; pointer-events: none;
  }
  .perks-grid-wrapper:active .carousel-arrow,
  .carousel-arrow:active { opacity: 1; pointer-events: auto; }
  .carousel-arrow-left { left: -10px; }
  .carousel-arrow-right { right: -10px; }
  .perks-grid-wrapper:active .carousel-arrow-left { left: 10px; }
  .perks-grid-wrapper:active .carousel-arrow-right { right: 10px; }

  .perks-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 1rem;
    scrollbar-width: none;
    grid-template-columns: none;
  }
  .perks-grid::-webkit-scrollbar { display: none; }
  .perk-card { min-width: 80vw; scroll-snap-align: center; }

  .role-card { flex-direction: column; align-items: flex-start; gap: 1.75rem; padding: 2rem; }
  .role-left { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .role-actions { width: 100%; flex-direction: column-reverse; gap: 1rem; }
  .protocol-btn, .apply-btn-primary { width: 100%; justify-content: center; }

  .role-details-trace { padding: 2rem; }
  .trace-grid { grid-template-columns: 1fr; gap: 2.5rem; }

  .section-header h2 { font-size: 2.5rem; }
}
</style>
