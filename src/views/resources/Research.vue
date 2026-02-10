<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero research-hero">
      <div class="hero-content">
        <div class="hero-badge">THE LAB</div>
        <h1 class="page-title">Advancing the <span class="text-gradient">Science</span> of Autonomous AI</h1>
        <p class="page-description">
          Our research team publishes at top-tier AI conferences and collaborates with leading academic institutions to solve fundamental challenges in multi-agent coordination, neural reasoning, and AI safety. Explore our latest contributions to the field.
        </p>
      </div>
    </div>

    <!-- Research Areas -->
    <section class="areas-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">CORE DOMAINS</span>
          <h2>Focus <span class="text-gradient">Areas</span></h2>
        </div>
        <div class="areas-grid">
          <div v-for="area in areas" :key="area.name" class="area-card">
            <h4>{{ area.name }}</h4>
            <p>{{ area.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications List -->
    <section class="publications-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">PUBLICATIONS</span>
          <h2>Peer-Reviewed <span class="text-gradient">Insights</span></h2>
        </div>
        <div class="pub-list">
          <div v-for="pub in publications" :key="pub.title" class="pub-item">
            <div class="pub-meta">
              <span class="pub-year">{{ pub.year }}</span>
              <span class="pub-journal">{{ pub.journal }}</span>
            </div>
            <h3>{{ pub.title }}</h3>
            <p class="pub-authors">{{ pub.authors }}</p>
            <button class="text-btn">
              Download PDF
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
          <h2>Collaborate with our <span class="text-gradient">Researchers</span></h2>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Partnership Inquiries
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
import { onMounted, inject } from 'vue'

const openContactModal = inject('openContactModal')

const areas = [
  { name: 'Multi-Agent Coordination', desc: 'Developing scalable algorithms for coordinating thousands of autonomous agents, including efficient communication protocols and decentralized decision-making frameworks.' },
  { name: 'Neural Architecture Search', desc: 'Automated discovery of optimal neural network architectures for specific agent tasks, reducing the need for manual hyperparameter tuning.' },
  { name: 'Explainable AI', desc: 'Building interpretability layers that allow enterprises to understand and audit agent decisions in real-time, critical for regulated industries.' }
]

const publications = [
  { 
    title: 'Hierarchical Task Decomposition in Multi-Agent Reinforcement Learning', 
    authors: 'Chen, J., Singh, A., et al.', 
    year: '2025', 
    journal: 'NeurIPS 2025' 
  },
  { 
    title: 'Real-Time Constraint Satisfaction in Autonomous Agent Swarms', 
    authors: 'Okonkwo, S., Chen, J.', 
    year: '2024', 
    journal: 'ICML 2024' 
  },
  { 
    title: 'Ethical Decision Frameworks for Production AI Systems', 
    authors: 'Singh, A., Martinez, R.', 
    year: '2024', 
    journal: 'AAAI 2024' 
  }
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

.research-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
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
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #10b981;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #10b981 100%);
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
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1000px;
  margin: 0 auto;
}

.section-tag {
  color: #10b981;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-header h2 {
  font-size: 3.5rem;
  font-weight: 850;
}

/* Areas Grid */
.areas-section {
  padding: 8rem 5%;
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.area-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.area-card:hover {
  transform: translateY(-8px);
  border-color: #10b981;
}

.area-card h4 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.area-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Publication List */
.publications-section {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.pub-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pub-item {
  padding: 3rem;
  background: var(--bg-primary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: border-color 0.3s ease;
}

.pub-item:hover {
  border-color: #10b981;
}

.pub-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: #10b981;
}

.pub-item h3 {
  font-size: 1.75rem;
  font-weight: 850;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.pub-authors {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.text-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #10b981;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
}

.text-btn svg {
  width: 18px;
  height: 18px;
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
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
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .areas-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
}
</style>
