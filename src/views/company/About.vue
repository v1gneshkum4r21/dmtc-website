<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="premium-hero about-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">OUR MISSION</span>
        </div>
        <h1 class="hero-title">Building the <span class="text-gradient">Agentic OS</span></h1>
        <p class="hero-subtitle">
          We are engineering the operating system for the next generation of work. 
          Deploy, orchestrate, and scale autonomous AI agents that act as trusted team members across your entire enterprise.
        </p>

        <div class="hero-actions">
          <router-link to="/company/careers" class="primary-btn">
            Join the Mission
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Our Approach Section -->
    <section class="approach-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">OUR APPROACH</div>
          <h2>How we <span class="text-gradient">Design, Deploy, and Scale</span></h2>
          <p class="section-subtitle">autonomous systems differently.</p>
        </div>

        <div class="approach-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollApproach('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="approach-grid" ref="approachGrid">
            <div v-for="(item, index) in approaches" :key="index" class="approach-card">
              <div class="approach-icon-wrapper" :style="{ background: item.accent }">
                <svg v-html="item.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollApproach('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>



    <!-- Core Values (Solutions Grid Style) -->
    <section class="solutions-explorer" ref="solutionsSection">
      <div class="section-container">
        <div class="section-header centered" ref="solutionsHeader">
          <div class="detail-badge">CORE VALUES</div>
          <h2>The Principles that <span class="text-gradient">Drive Us</span></h2>
        </div>

        <div class="solutions-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollSolutions('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div class="solutions-grid" ref="solutionsGrid" @mousemove="handleMouseMove">
            <div 
              v-for="value in values" 
              :key="value.id" 
              class="solution-card"
              :style="{ 
                '--card-accent': value.accent 
              }"
            >
              <div class="card-glow"></div>
              <div class="sol-header">
                <h3>{{ value.title }}</h3>
                <div class="sol-subtitle">{{ value.subtitle }}</div>
              </div>
              <p class="sol-description">{{ value.description }}</p>
              <ul class="sol-features">
                <li v-for="(feature, index) in value.features" :key="index">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollSolutions('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Leadership Preview (Meet the Team) -->
    <section class="team-preview">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">LEADERSHIP</div>
          <h2>Meet the <span class="text-gradient">Visionaries</span></h2>
        </div>

        <div class="team-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollTeam('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div class="team-scroll-grid" ref="teamGrid">
            <div v-for="member in teamMembers" :key="member.name" class="team-card-preview">
              <div class="member-image-wrapper">
                <img :src="member.image" :alt="member.name" class="member-img">
              </div>
              <div class="member-info">
                <h3>{{ member.name }}</h3>
                <span class="member-role">{{ member.role }}</span>
                <p>{{ member.bio }}</p>
              </div>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollTeam('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div class="centered" style="margin-top: 4rem;">
          <router-link to="/company/leadership" class="secondary-btn">
            View Full Leadership Team
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Vision / Stats Section -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>The Future is <span class="text-gradient">Autonomous</span></h2>
          <p class="cta-subtitle" style="margin-bottom: 3rem;">
            We envision enterprises where AI agents act as trusted team members—making decisions, solving problems, and executing complex workflows with minimal human intervention.
          </p>
          
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-val">99%</span>
              <span class="stat-lbl">Reliability</span>
            </div>
            <div class="stat-item">
              <span class="stat-val">10M+</span>
              <span class="stat-lbl">Tasks Automated</span>
            </div>
            <div class="stat-item">
              <span class="stat-val">Global</span>
              <span class="stat-lbl">Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const approaches = [
  {
    title: 'Design',
    description: 'We architect modular agentic workflows with explainability and human-in-the-loop precision at their core.',
    accent: 'rgba(99, 102, 241, 0.1)',
    icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
  },
  {
    title: 'Deploy',
    description: 'Our Agentic OS integrates seamlessly with your infrastructure, enabling production readiness in days.',
    accent: 'rgba(59, 130, 246, 0.1)',
    icon: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'
  },
  {
    title: 'Scale',
    description: 'Orchestrate global swarms of specialized agents that learn and adapt, delivering exponential efficiency.',
    accent: 'rgba(16, 185, 129, 0.1)',
    icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
  }
]

const teamMembers = [
  {
    name: 'Dr. Amara Singh',
    role: 'CEO & Co-Founder',
    bio: 'Former Director of AI Strategy at Microsoft Azure. PhD in CS from Stanford.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'James Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Principal Engineer at Google DeepMind. Pioneer in multi-agent RL systems.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Sarah Zhang',
    role: 'Chief Product Officer',
    bio: 'Former VP of Product at Salesforce. Expert in enterprise AI automation.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300'
  }
]



const values = [
  { 
    id: 1, 
    title: 'Agent-First', 
    subtitle: 'Architecture',
    description: 'We build systems where AI agents are first-class citizens, capable of independent decision-making and learning.',
    features: ['Independent Reasoning', 'Outcome Learning', 'Human Collaboration'],
    accent: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
  },
  { 
    id: 2, 
    title: 'Reliability', 
    subtitle: 'Enterprise Grade',
    description: 'Infrastructure built for mission-critical operations with uptime, security, and certifications that define industry standards.',
    features: ['99.99% Uptime', 'SOC2 Compliance', 'Zero-Trust Security'],
    accent: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
  },
  { 
    id: 3, 
    title: 'Responsible AI', 
    subtitle: 'Ethical Core',
    description: 'Integrating explainability, auditability, and ethical guardrails into every layer of our platform.',
    features: ['Full Transparency', 'Bias Mitigation', 'Audit Trails'],
    accent: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  },
  { 
    id: 4, 
    title: 'Scalability', 
    subtitle: 'Global Reach',
    description: 'Designed to scale intelligence as easily as compute, handling millions of complex concurrent tasks.',
    features: ['Elastic Compute', 'Global Edge', 'Infinite Scale'],
    accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  }
]

const solutionsGrid = ref(null)

const handleMouseMove = (e) => {
  if (!solutionsGrid.value) return
  const cards = solutionsGrid.value.querySelectorAll('.solution-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  })
}

const scrollSolutions = (direction) => {
  if (!solutionsGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  solutionsGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const approachGrid = ref(null)

const scrollApproach = (direction) => {
  if (!approachGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  approachGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const solutionsHeader = ref(null)
const teamGrid = ref(null)

const scrollTeam = (direction) => {
  if (!teamGrid.value) return
  const scrollAmount = teamGrid.value.offsetWidth * 0.85
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  teamGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.page-container {
  width: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Premium Hero */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.about-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
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

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
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

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.25);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1;
  text-decoration: none;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.6s;
  z-index: 2;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  box-shadow: 0 20px 40px rgba(168, 85, 247, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.primary-btn:hover::before {
  left: 100%;
}



/* Solutions Explorer */
.solutions-explorer {
  padding: 30px 5% 5rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.solutions-carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-nav {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
}

.carousel-nav:hover {
  background: #a855f7;
  border-color: #a855f7;
}

.carousel-nav:hover svg {
  color: white;
}

.carousel-nav.prev {
  left: -24px;
}

.carousel-nav.next {
  right: -24px;
}

.carousel-nav svg {
  width: 20px;
  height: 20px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.centered {
  text-align: center;
  margin: 0 auto 40px;
}

.detail-badge {
  font-family: var(--font-accent);
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
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

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

.solution-card {
  position: relative;
  min-width: 260px;
  padding: 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: var(--card-accent);
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.4s ease;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--card-accent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.solution-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(168, 85, 247, 0.1);
}

.solution-card:hover::before {
  opacity: 0.8;
}

.solution-card:hover .card-glow {
  opacity: 0.15;
}

.sol-header {
  margin-bottom: 1.25rem;
}

.solution-card h3 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
  background: var(--card-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-height: 3.8rem;
  display: flex;
  align-items: center;
}

.sol-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.8;
}

.sol-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
  min-height: 4.5rem;
}

.sol-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 5rem;
}

.sol-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sol-features svg {
  width: 12px;
  height: 12px;
  color: var(--card-accent);
  opacity: 1;
  flex-shrink: 0;
}

/* Page CTA */
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
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 3.5rem;
  color: var(--text-primary);
  font-weight: 850;
  margin-bottom: 2rem;
  line-height: 1.1;
  position: relative;
  z-index: 1;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  position: relative;
  z-index: 1;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-val {
  font-size: 3rem;
  font-weight: 850;
  background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-lbl {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .solutions-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .stats-row { flex-direction: column; gap: 2rem; }
}

/* Our Approach */
.approach-section {
  padding: 8rem 5%;
  background: var(--bg-primary);
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: -0.5rem auto 3rem;
  font-weight: 500;
  text-align: center;
}

.approach-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.approach-card {
  padding: 3rem 2.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}

.approach-card:hover {
  transform: translateY(-8px);
  border-color: #a855f7;
  background: rgba(168, 85, 247, 0.05);
}

.approach-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #a855f7;
}

.approach-icon-wrapper svg {
  width: 28px;
  height: 28px;
}

.approach-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.approach-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Team Preview Section */
.team-preview {
  padding: 8rem 5%;
  background: var(--bg-primary);
}

.team-carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto 0;
}

.team-scroll-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  overflow: hidden;
}

.team-card-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.team-card-preview:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
}

.member-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.member-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.team-card-preview:hover .member-img {
  transform: scale(1.05);
}

.member-info {
  padding: 2.2rem;
}

.member-info h3 {
  font-size: 1.45rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.member-role {
  font-family: var(--font-accent);
  font-size: 0.8rem;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 1.25rem;
}

.member-info p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.secondary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.1rem 2.2rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.secondary-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.secondary-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.secondary-btn:hover svg {
  transform: translateX(4px);
}

@media (max-width: 1024px) {
  .approach-grid { grid-template-columns: repeat(2, 1fr); }
  .team-scroll-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .solutions-explorer {
    padding: 20px 5% 3rem;
  }

  .approach-section { padding: 4rem 5%; }
  
  .approach-carousel-wrapper {
    position: relative;
    width: 100%;
  }

  .approach-carousel-wrapper .carousel-nav {
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
    opacity: 1;
    pointer-events: auto;
  }

  .approach-carousel-wrapper .carousel-nav.prev { left: -10px; }
  .approach-carousel-wrapper .carousel-nav.next { right: -10px; }

  .approach-grid { 
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

  .approach-grid::-webkit-scrollbar { display: none; }

  .approach-card {
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2.5rem 2rem;
    border-radius: 32px;
  }

  .section-subtitle { font-size: 1.1rem; }
  
  .team-scroll-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    margin: 0 -5%;
    padding: 0 5% 2rem;
    scrollbar-width: none;
  }
  
  .team-scroll-grid::-webkit-scrollbar { display: none; }
  
  .team-card-preview {
    min-width: 85vw;
    scroll-snap-align: center;
  }
  
  /* Core Values Carousel for Mobile */
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
    opacity: 1;
    pointer-events: auto;
  }

  .carousel-nav.prev { left: -10px; }
  .carousel-nav.next { right: -10px; }

  .solutions-grid {
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

  .solutions-grid::-webkit-scrollbar { display: none; }

  .solution-card {
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2rem;
    border-radius: 32px;
    height: auto;
  }

  .solution-card h3 {
    font-size: 1.4rem;
    min-height: auto;
    margin-bottom: 0.75rem;
  }

  .sol-subtitle {
    font-size: 0.65rem;
    margin-bottom: 0.5rem;
  }

  .sol-description {
    font-size: 0.9rem;
    line-height: 1.6;
    min-height: auto;
    margin-bottom: 1.75rem;
  }

  .sol-features {
    min-height: auto;
    gap: 0.6rem;
  }

  .sol-features li {
    font-size: 0.85rem;
  }

  .team-carousel-wrapper:active .carousel-nav,
  .team-carousel-wrapper:hover .carousel-nav {
    opacity: 1;
    pointer-events: auto;
  }
}

</style>
