<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero leadership-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">OUR LEADERSHIP</span>
        </div>
        <h1 class="hero-title">The Team Building <span class="text-gradient">Tomorrow</span></h1>
        <p class="hero-subtitle">
          Our founding team combines decades of experience from leading AI research labs, enterprise software companies, and Fortune 500 digital transformations.
        </p>
      </div>
    </div>

    <!-- Team Grid (Solutions Style) -->
    <section class="team-section" ref="teamSection">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">LEADERSHIP TEAM</div>
          <h2>Meet Our <span class="text-gradient">Founders</span></h2>
        </div>
        <div class="team-grid-wrapper">
          <!-- Mobile Carousel Arrows -->
          <button class="carousel-arrow carousel-arrow-left" @click="scrollCarousel('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="carousel-arrow carousel-arrow-right" @click="scrollCarousel('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          
          <div class="team-grid" ref="teamGrid" @mousemove="handleMouseMove">
            <div 
              v-for="member in team" 
              :key="member.name" 
              class="member-card"
              :style="{ '--card-accent': member.accent }"
            >
              <div class="card-glow"></div>
              
              <div class="member-header">
                <div class="member-avatar">
                  <img v-if="member.image" :src="member.image" :alt="member.name" class="member-photo" />
                  <div v-else class="avatar-placeholder">{{ member.initials }}</div>
                </div>
                <div class="member-role-text">{{ member.role }}</div>
              </div>

              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-bio">{{ member.bio }}</p>
              
              <div class="member-footer">
                <a :href="'https://linkedin.com/in/' + member.initials" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a :href="'https://twitter.com/' + member.initials" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Advisory Section -->
    <section class="advisory-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">ADVISORY BOARD</div>
          <h2>Strategic <span class="text-gradient">Counsel</span></h2>
        </div>
        <div class="advisory-grid-wrapper">
          <!-- Mobile Carousel Arrows for Advisory -->
          <button class="carousel-arrow carousel-arrow-left advisory-arrow" @click="scrollAdvisoryCarousel('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button class="carousel-arrow carousel-arrow-right advisory-arrow" @click="scrollAdvisoryCarousel('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          
          <div class="advisory-grid" ref="advisoryGrid">
            <div v-for="advisor in advisors" :key="advisor.name" class="advisor-item">
              <div class="advisor-content">
                <strong>{{ advisor.name }}</strong>
                <span>{{ advisor.position }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Want to join our <span class="text-gradient">Leadership Team</span>?</h2>
          <div class="cta-buttons">
            <router-link to="/company/careers" class="primary-btn">
              View Open Roles
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const team = [
  {
    name: 'Dr. Amara Singh',
    role: 'Chief Executive Officer & Co-Founder',
    initials: 'AS',
    bio: 'Former Director of AI Strategy at Microsoft Azure. PhD in Computer Science from Stanford. Led enterprise AI deployments serving 50M+ users.',
    accent: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'James Chen',
    role: 'Chief Technology Officer & Co-Founder',
    initials: 'JC',
    bio: 'Ex-Principal Engineer at Google DeepMind. Pioneered multi-agent reinforcement learning systems. 15+ publications in top AI conferences.',
    accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Sarah Okonkwo',
    role: 'VP of Product & Design',
    initials: 'SO',
    bio: 'Previously led Product at Anthropic. Expert in human-AI interaction and enterprise UX. Built products used by 500+ Fortune 1000 companies.',
    accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300'
  }
]

const advisors = [
  { name: 'Prof. Geoffrey Hinton', position: 'Turing Award Winner, AI Pioneer' },
  { name: 'Marc Andreessen', position: 'Co-Founder, Andreessen Horowitz' },
  { name: 'Dr. Fei-Fei Li', position: 'Professor of CS, Stanford | Co-Director, HAI' }
]

const teamGrid = ref(null)
const advisoryGrid = ref(null)

const handleMouseMove = (e) => {
  if (!teamGrid.value) return
  const cards = teamGrid.value.querySelectorAll('.member-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  })
}

const scrollCarousel = (direction) => {
  if (!teamGrid.value) return
  const scrollAmount = teamGrid.value.offsetWidth * 0.85 // Scroll by one card width
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  teamGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const scrollAdvisoryCarousel = (direction) => {
  if (!advisoryGrid.value) return
  const scrollAmount = advisoryGrid.value.offsetWidth * 0.85 // Scroll by one card width
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  advisoryGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.page-container {
  width: 100%;
  background: var(--bg-primary);
  min-height: 100vh;
}

/* Premium Hero */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.leadership-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
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
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #3b82f6;
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
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
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

/* Team Section */
.team-section {
  padding: 4rem 5% 8rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.team-grid-wrapper {
  position: relative;
}

.carousel-arrow {
  display: none; /* Hidden on desktop */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
}

.team-grid-wrapper:hover .carousel-arrow,
.advisory-grid-wrapper:hover .carousel-arrow {
  opacity: 1;
  pointer-events: auto;
}

.carousel-arrow:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow svg {
  width: 24px;
  height: 24px;
}

.carousel-arrow-left {
  left: -24px;
}

.team-grid-wrapper:hover .carousel-arrow-left,
.advisory-grid-wrapper:hover .carousel-arrow-left {
  left: 10px;
}

.carousel-arrow-right {
  right: -24px;
}

.team-grid-wrapper:hover .carousel-arrow-right,
.advisory-grid-wrapper:hover .carousel-arrow-right {
  right: 10px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 3rem;
}

.member-card {
  position: relative;
  padding: 3rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Left align */
  text-align: left;       /* Left align text */
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.member-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: var(--card-accent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.4s ease;
  pointer-events: none; /* Important to let clicks pass through */
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

.member-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(59, 130, 246, 0.1);
}

.member-card:hover::before {
  opacity: 0.8;
}

.member-card:hover .card-glow {
  opacity: 0.15;
}

.member-header {
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 24px; /* Slightly larger radius for larger image */
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--glass-border);
  position: relative;
  z-index: 1;
  overflow: hidden;
  flex-shrink: 0;
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.member-card:hover .member-photo {
  transform: scale(1.1);
}

.avatar-placeholder {
  font-size: 2rem; /* Larger placeholder text */
  font-weight: 800;
  color: var(--text-primary);
  opacity: 0.8;
}

.member-role-badge {
  display: none; 
}

.member-role-text {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  text-align: right;
  max-width: 60%; /* Allow more space */
  line-height: 1.4;
  margin: 0;
  background: none;
  -webkit-text-fill-color: initial;
  padding: 0;
  border: none;
  backdrop-filter: none;
}

.member-name {
  font-size: 1.75rem;
  font-weight: 850;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.member-bio {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.member-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  justify-content: flex-start; /* Left align socials */
  width: 100%;
  position: relative; /* Ensure it's above absolute overlays */
  z-index: 5;
}

.social-link {
  color: var(--text-secondary);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px; /* Square with rounded corners */
  background: transparent;
}

.social-link:hover {
  color: white;
  background: var(--card-accent);
  transform: translateY(-2px);
}

.social-link svg {
  width: 16px;
  height: 16px;
}

/* Advisory Section */
.advisory-section {
  padding: 4rem 5% 8rem;
  background: var(--bg-secondary);
}


.centered {
  text-align: center;
  margin: 0 auto 40px;
}

.detail-badge {
  font-family: var(--font-accent);
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
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

.advisory-grid-wrapper {
  position: relative;
}

.advisory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.advisor-item {
  padding: 2.5rem;
  background: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--grid-color);
  text-align: center;
  transition: all 0.3s ease;
}

.advisor-item:hover {
  border-color: #3b82f6;
  transform: translateY(-5px);
}

.advisor-item strong {
  font-family: var(--font-heading);
  display: block;
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.advisor-item span {
  font-size: 0.95rem;
  color: var(--text-secondary);
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
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 3.5rem;
  color: var(--text-primary);
  font-weight: 850;
  margin-bottom: 3rem;
  line-height: 1.1;
  position: relative;
  z-index: 1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  overflow: hidden;
  position: relative;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: 0.6s;
  z-index: 2;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.primary-btn:hover::before {
  left: 100%;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .advisory-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  /* Show carousel arrows on mobile - hidden by default, show on touch */
  .carousel-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }
  
  /* Show arrows when wrapper is touched/active or when arrow itself is touched */
  .team-grid-wrapper:active .carousel-arrow,
  .carousel-arrow:active {
    opacity: 1;
    pointer-events: auto;
  }
  
  .carousel-arrow-left {
    left: -10px;
  }
  
  .team-grid-wrapper:active .carousel-arrow-left,
  .carousel-arrow-left:active {
    left: 10px;
  }
  
  .carousel-arrow-right {
    right: -10px;
  }
  
  .team-grid-wrapper:active .carousel-arrow-right,
  .carousel-arrow-right:active {
    right: 10px;
  }
  
  /* Carousel for Team */
  .team-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 2rem; /* Space for scroll / shadow if needed */
    margin: 0 -5%; /* Extend to edges */
    padding-left: 5%; /* Restore inner padding */
    padding-right: 5%;
    scrollbar-width: none; /* Firefox */
  }
  
  .team-grid::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .member-card {
    min-width: 85vw; /* Show most of one card */
    scroll-snap-align: center;
  }

  /* Carousel for Advisory */
  .advisory-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 2rem;
    margin: 0 -5%;
    padding-left: 5%;
    padding-right: 5%;
    scrollbar-width: none;
  }
  
  .advisory-grid::-webkit-scrollbar {
    display: none;
  }

  .advisor-item {
    min-width: 85vw;
    scroll-snap-align: center;
  }

  /* Show arrows for advisory grid wrapper on touch */
  .advisory-grid-wrapper:active .carousel-arrow,
  .advisory-arrow:active {
    opacity: 1;
    pointer-events: auto;
  }
  
  .advisory-grid-wrapper:active .carousel-arrow-left,
  .advisory-arrow.carousel-arrow-left:active {
    left: 10px;
  }
  
  .advisory-grid-wrapper:active .carousel-arrow-right,
  .advisory-arrow.carousel-arrow-right:active {
    right: 10px;
  }
  
  .member-header {
    flex-direction: row; /* Keep row layout but maybe adjust spacing */
    gap: 1rem;
    align-items: center;
  }
  
  .member-role-badge {
    max-width: 100%;
    text-align: left;
  }
}
</style>
