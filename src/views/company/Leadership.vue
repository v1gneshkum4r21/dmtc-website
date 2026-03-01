<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero leadership-gradient" v-if="pageConfig">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">{{ pageConfig.hero_badge }}</span>
        </div>
        <h1 class="hero-title" v-html="formatGradientTitle(pageConfig.hero_title)"></h1>
        <p class="hero-subtitle">{{ pageConfig.hero_subtitle }}</p>
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
                <a 
                  v-for="link in member.socials" 
                  :key="link.url"
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="social-link" 
                  v-html="getSocialIcon(link.url)"
                >
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
import { pagesAPI } from '@/services/api'

const team = ref([])
const advisors = ref([])

const pageConfig = ref({
  hero_badge: 'OUR LEADERSHIP',
  hero_title: 'The Team Building Tomorrow',
  hero_subtitle: 'Our founding team combines decades of experience from leading AI research labs, enterprise software companies, and Fortune 500 digital transformations.'
})

const getSocialIcon = (url) => {
  if (!url) return '🔗'
  const u = url.toLowerCase()
  if (u.includes('linkedin')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>'
  if (u.includes('twitter') || u.includes('x.com')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  if (u.includes('facebook')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>'
  if (u.includes('instagram')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4A3.6,3.6 0 0,0 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6A3.6,3.6 0 0,0 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>'
  if (u.includes('whatsapp') || u.includes('wa.me')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zM6.07 17.51l-.19-.3a8.163 8.163 0 01-1.25-4.3c0-4.51 3.67-8.19 8.19-8.19 2.19 0 4.24.85 5.79 2.4s2.4 3.61 2.4 5.79c0 4.51-3.67 8.19-8.19 8.19-1.53 0-3.04-.43-4.35-1.24l-.31-.19-3.24.85.86-3.16z"/></svg>'
  if (u.includes('youtube')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.67,7.64 21.78,8.11 21.84,8.57C22,9.75 22,12 22,12C22,12 22,14.25 21.84,15.43C21.78,15.89 21.67,16.36 21.56,16.83C21.23,18.06 20.26,19.03 19.03,19.36C17.85,19.7 12,19.7 12,19.7C12,19.7 6.15,19.7 4.97,19.36C3.74,19.03 2.77,18.06 2.44,16.83C2.33,16.36 2.22,15.89 2.16,15.43C2,14.25 2,12 2,12C2,12 2,9.75 2.16,8.57C2.22,8.11 2.33,7.64 2.44,7.17C2.77,5.94 3.74,4.97 4.97,4.64C6.15,4.3 12,4.3 12,4.3C12,4.3 17.85,4.3 19.03,4.64C20.26,4.97 21.23,5.94 21.56,7.17Z"/></svg>'
  if (u.includes('threads.net')) return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.42 12.56a3.86 3.86 0 0 1-3.66 2.6c-2 0-3.7-1.5-3.7-3.7S9.7 7.7 11.75 7.7c1.47 0 2.5.7 3.03 1.34l1.64-1.35c-.86-1-2.45-2.2-4.67-2.2-3.4 0-6 2.32-6 6s2.5 6.1 6 6.1c1.8 0 3.32-.6 4.38-1.58C17 15 17.65 13.84 17.85 13c3.34 0 4.15-2.52 4.15-2.52s-.76-1-3.56-.84c1-5-1.84-7.4-4.82-7.4a6.6 6.6 0 0 0-6.6 6.6c0 3.5 2.8 6.4 6.4 6.4s6.4-2.8 6.4-6.4V5a1.5 1.5 0 0 0-3 0v3.86A3.86 3.86 0 0 0 15.42 12.56Z"/></svg>'
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>'
}

const formatGradientTitle = (title) => {
  if (!title) return ''
  const parts = title.split(' ')
  if (parts.length > 1) {
    const last = parts.pop()
    return `${parts.join(' ')} <span class="text-gradient">${last}</span>`
  }
  return title
}

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

onMounted(async () => {
  window.scrollTo(0, 0)
  try {
    const config = await pagesAPI.getConfig('leadership')
    if (config) {
      pageConfig.value = config
      if (config.team) team.value = config.team
      if (config.advisors) advisors.value = config.advisors
    }
  } catch (err) {
    console.error('Failed to load leadership page context:', err)
  }
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  flex: 1 1 350px;
  max-width: 400px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  flex: 1 1 300px;
  max-width: 380px;
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
  .advisory-grid { justify-content: center; }
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
