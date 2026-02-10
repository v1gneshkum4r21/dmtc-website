<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero leadership-gradient">
      <div class="hero-content">
        <div class="hero-badge">OUR LEADERSHIP</div>
        <h1 class="page-title">The Team Building <span class="text-gradient">Tomorrow</span></h1>
        <p class="page-description">
          Our founding team combines decades of experience from leading AI research labs, enterprise software companies, and Fortune 500 digital transformations. Together, we're building the platform that will define how enterprises deploy autonomous intelligence.
        </p>
      </div>
    </div>

    <!-- Team Grid -->
    <section class="team-section">
      <div class="section-container">
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="member-card">
            <div class="member-image-placeholder">
              <div class="member-initials">{{ member.initials }}</div>
            </div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <span class="member-role">{{ member.role }}</span>
              <p class="member-bio">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Advisory Section -->
    <section class="advisory-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">ADVISORY BOARD</span>
          <h2>Strategic <span class="text-gradient">Counsel</span></h2>
        </div>
        <div class="advisory-grid">
          <div v-for="advisor in advisors" :key="advisor.name" class="advisor-item">
            <strong>{{ advisor.name }}</strong>
            <span>{{ advisor.position }}</span>
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
import { onMounted } from 'vue'

const team = [
  {
    name: 'Dr. Amara Singh',
    role: 'Chief Executive Officer & Co-Founder',
    initials: 'AS',
    bio: 'Former Director of AI Strategy at Microsoft Azure. PhD in Computer Science from Stanford. Led enterprise AI deployments serving 50M+ users.'
  },
  {
    name: 'James Chen',
    role: 'Chief Technology Officer & Co-Founder',
    initials: 'JC',
    bio: 'Ex-Principal Engineer at Google DeepMind. Pioneered multi-agent reinforcement learning systems. 15+ publications in top AI conferences.'
  },
  {
    name: 'Sarah Okonkwo',
    role: 'VP of Product & Design',
    initials: 'SO',
    bio: 'Previously led Product at Anthropic. Expert in human-AI interaction and enterprise UX. Built products used by 500+ Fortune 1000 companies.'
  }
]

const advisors = [
  { name: 'Prof. Geoffrey Hinton', position: 'Turing Award Winner, AI Pioneer' },
  { name: 'Marc Andreessen', position: 'Co-Founder, Andreessen Horowitz' },
  { name: 'Dr. Fei-Fei Li', position: 'Professor of CS, Stanford | Co-Director, HAI' }
]

onMounted(() => {
  window.scrollTo(0, 0)
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

.leadership-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
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
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #3b82f6;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #3b82f6 100%);
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
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  color: #3b82f6;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

/* Team Section */
.team-section {
  padding: 8rem 5%;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.member-card {
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  overflow: hidden;
  transition: all 0.4s ease;
}

.member-card:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
}

.member-image-placeholder {
  height: 300px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--grid-color);
}

.member-initials {
  font-size: 4rem;
  font-weight: 900;
  color: #3b82f6;
  opacity: 0.5;
}

.member-info {
  padding: 2.5rem;
}

.member-info h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.member-role {
  display: block;
  font-size: 0.95rem;
  color: #3b82f6;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.member-bio {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Advisory Section */
.advisory-section {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-header h2 {
  font-size: 3.5rem;
  font-weight: 850;
}

.advisory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  text-align: center;
}

.advisor-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.advisor-item strong {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.advisor-item span {
  font-size: 1rem;
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
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .team-grid { grid-template-columns: 1fr; }
  .advisory-grid { grid-template-columns: 1fr; gap: 2rem; }
  .page-title { font-size: 3.5rem; }
  .cta-card h2 { font-size: 2.5rem; }
}
</style>
