<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero careers-gradient">
      <div class="hero-content">
        <div class="hero-badge">CAREERS</div>
        <h1 class="page-title">Build the Future of <span class="text-gradient">Enterprise AI</span></h1>
        <p class="page-description">
          Join a team solving some of the hardest problems in artificial intelligence—from real-time agent orchestration to neural architecture optimization. We offer competitive compensation, significant equity, and the opportunity to shape how Fortune 500 companies deploy autonomous AI at scale.
        </p>
      </div>
    </div>

    <!-- Why Us Section -->
    <section class="benefits-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">WHY DREAMACTIC</span>
          <h2>The Perks of <span class="text-gradient">High Velocity</span></h2>
        </div>
        <div class="benefits-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollBenefits('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="benefits-grid" ref="benefitsGrid">
            <div class="benefit-card">
              <div class="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h4>Competitive Compensation</h4>
              <p>Top-of-market salaries, significant equity grants, and comprehensive benefits including health, dental, vision, and 401(k) matching.</p>
            </div>
            <div class="benefit-card">
              <div class="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h4>Cutting-Edge Research</h4>
              <p>Work on problems published in top-tier conferences. Access to state-of-the-art compute infrastructure and the latest AI models.</p>
            </div>
            <div class="benefit-card">
              <div class="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4>World-Class Team</h4>
              <p>Collaborate with former researchers and engineers from Google DeepMind, OpenAI, Microsoft Research, and leading AI labs worldwide.</p>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollBenefits('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Open Roles Placeholder -->
    <section class="roles-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">OPEN ROLES</span>
          <h2>Current <span class="text-gradient">Opportunities</span></h2>
        </div>
        <div class="roles-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollRoles('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="roles-grid" ref="rolesGrid">
            <div v-for="role in roles" :key="role.title" class="role-card">
              <div class="role-info">
                <h3>{{ role.title }}</h3>
                <div class="role-meta">
                  <span>{{ role.team }}</span>
                  <span class="dot"></span>
                  <span>{{ role.location }}</span>
                </div>
              </div>
              <button class="secondary-btn" @click="openJobModal(role.title)">Apply Now</button>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollRoles('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
        <div class="no-roles-notice">
          <p>Don't see a role? Send your resume to <a href="mailto:careers@dreamactic.ai" class="link">careers@dreamactic.ai</a></p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Ready to revolutionize <span class="text-gradient">Work</span>?</h2>
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
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { jobsAPI } from '@/services/api'

const openContactModal = inject('openContactModal')
const openJobModal = inject('openJobModal')

const roles = ref([
  { title: 'Senior ML Engineer – Agent Orchestration', team: 'Core Platform', location: 'San Francisco / Remote (US)' },
  { title: 'Research Scientist – Multi-Agent Systems', team: 'AI Research', location: 'San Francisco' },
  { title: 'Full-Stack Engineer – Voice Infrastructure', team: 'EchoAI', location: 'Hybrid' },
  { title: 'Product Manager – Enterprise Solutions', team: 'Product', location: 'San Francisco' },
  { title: 'DevOps Engineer – AI Infrastructure', team: 'Platform', location: 'Remote (Global)' }
])

const fetchJobs = async () => {
  try {
    const data = await jobsAPI.getAll()
    if (data && data.length > 0) {
      roles.value = data
    }
  } catch (err) {
    console.error('Failed to fetch jobs:', err)
  }
}

const benefitsGrid = ref(null)
const rolesGrid = ref(null)

const scrollBenefits = (direction) => {
  if (!benefitsGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  benefitsGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const scrollRoles = (direction) => {
  if (!rolesGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  rolesGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

onMounted(() => {
  window.scrollTo(0, 0)
  fetchJobs()
})
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-hero {
  padding: 12rem 5% 8rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
}

.careers-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #a855f7;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #a855f7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 750px;
  margin: 0 auto;
}

.text-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  color: #a855f7;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

/* Benefits Section */
.benefits-section {
  padding: 8rem 5%;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-header h2 {
  font-size: 3.5rem;
  font-weight: 850;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.benefit-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.benefit-card:hover {
  transform: translateY(-8px);
  border-color: #a855f7;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #a855f7;
  margin-bottom: 2rem;
}

.benefit-card h4 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.benefit-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Roles Section */
.roles-section {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.roles-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.role-card {
  padding: 2.5rem 3rem;
  background: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--grid-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s ease;
}

.role-card:hover {
  border-color: #a855f7;
}

.role-info h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.role-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.dot {
  width: 4px;
  height: 4px;
  background: var(--grid-color);
  border-radius: 50%;
}

.secondary-btn {
  padding: 0.8rem 1.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: var(--bg-primary);
  border-color: #a855f7;
}

.no-roles-notice {
  text-align: center;
  margin-top: 4rem;
  color: var(--text-secondary);
}

.link {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
}

/* CTA Section */
.page-cta {
  padding: 8rem 5% 10rem;
}

.cta-card {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 48px;
  padding: 6rem 4rem;
  text-align: center;
  border: 1px solid var(--grid-color);
  box-shadow: var(--shadow-md);
}

.cta-card h2 {
  font-size: 3.5rem;
  color: var(--text-primary);
  font-weight: 850;
  margin-bottom: 3rem;
  line-height: 1.1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.25);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 40px rgba(168, 85, 247, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .role-card { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .page-title { font-size: 3.5rem; }
  .cta-card h2 { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2.5rem;
  }

  /* Benefits Carousel for Mobile */
  .benefits-carousel-wrapper {
    position: relative;
    width: 100%;
  }

  .carousel-nav {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    z-index: 10;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .carousel-nav.prev { left: -10px; }
  .carousel-nav.next { right: -10px; }

  .carousel-nav svg {
    width: 20px;
    height: 20px;
    color: var(--text-primary);
  }

  .benefits-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1.5rem;
    padding: 0 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    grid-template-columns: none;
  }

  .benefits-grid::-webkit-scrollbar { display: none; }

  .benefit-card {
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2.5rem 2rem;
    border-radius: 32px;
    height: auto;
  }

  /* Roles Carousel for Mobile */
  .roles-carousel-wrapper {
    position: relative;
    width: 100%;
  }

  .roles-carousel-wrapper .carousel-nav {
    display: flex; /* Override base */
  }

  .roles-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1rem;
    padding: 0 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-direction: row; /* Override desktop column */
  }

  .roles-grid::-webkit-scrollbar { display: none; }

  .role-card {
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2rem;
    border-radius: 24px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .role-info h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .role-meta {
    justify-content: center;
    font-size: 0.85rem;
  }
}
</style>
