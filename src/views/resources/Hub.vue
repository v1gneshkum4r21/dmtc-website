<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero hub-gradient">
      <div class="hero-content">
        <div class="hero-badge">RESOURCE HUB</div>
        <h1 class="page-title">The Complete <span class="text-gradient">Agentic Intelligence</span> Library</h1>
        <p class="page-description">
          From technical implementation guides to strategic enterprise playbooks, access the comprehensive resource library trusted by AI teams at Fortune 500 companies deploying autonomous agents at scale.
        </p>
      </div>
    </div>

    <!-- Hub Navigation/Filter -->
    <section class="hub-explorer">
      <div class="section-container">
        <div class="category-grid">
          <div v-for="cat in categories" :key="cat.name" class="category-card">
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
        <div class="resources-grid">
          <div v-for="res in resources" :key="res.title" class="res-card">
            <div class="res-image-placeholder">
              <span class="res-type">{{ res.type }}</span>
            </div>
            <div class="res-content">
              <h4>{{ res.title }}</h4>
              <p>{{ res.desc }}</p>
              <button class="text-btn">
                Read More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Get the latest <span class="text-gradient">Insights</span></h2>
          <p class="cta-description">Join 50,000+ leaders receiving our weekly agentic briefing.</p>
          <div class="cta-buttons">
            <div class="subscribe-form">
              <input type="email" placeholder="Enter your email" class="sub-input">
              <button class="primary-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const categories = [
  { 
    name: 'Implementation Guides', 
    desc: 'Step-by-step tutorials for deploying voice agents, workflow orchestrators, and multi-agent systems in production.',
    count: 42,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  { 
    name: 'Enterprise Playbooks', 
    desc: 'Strategic frameworks for scaling AI agents across departments, managing governance, and calculating ROI.',
    count: 28,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>'
  },
  { 
    name: 'Video Masterclasses', 
    desc: 'In-depth video series covering agent architecture design, prompt engineering, and advanced orchestration patterns.',
    count: 35,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>'
  }
]

const resources = [
  { type: 'WHITE PAPER', title: 'The Enterprise Guide to Multi-Agent Orchestration', desc: 'A 40-page technical and strategic guide on deploying autonomous agent networks that handle complex business processes.' },
  { type: 'CASE STUDY', title: 'How Global Insurance Reduced Claims Processing Time by 78%', desc: 'Real-world implementation of EchoAI voice agents and workflow automation at a Fortune 100 insurance company.' },
  { type: 'TUTORIAL', title: 'Building Production-Ready Voice Agents in 30 Minutes', desc: 'Hands-on guide to deploying your first EchoAI voice agent with authentication, streaming, and error handling.' }
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

.hub-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
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
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #2563eb;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #2563eb 100%);
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
  background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  color: #2563eb;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

/* Hub Explorer */
.hub-explorer {
  padding: 8rem 5%;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.category-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #2563eb;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #2563eb;
  margin-bottom: 2rem;
}

.category-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.category-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.item-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Featured Resources */
.featured-section {
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

.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.res-card {
  background: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--grid-color);
  overflow: hidden;
  transition: all 0.4s ease;
}

.res-card:hover {
  transform: translateY(-8px);
  border-color: #2563eb;
}

.res-image-placeholder {
  height: 200px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.res-type {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #2563eb;
}

.res-content {
  padding: 2.5rem;
}

.res-content h4 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.res-content p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.text-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
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
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.subscribe-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 1rem;
}

.sub-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--grid-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.sub-input:focus {
  outline: none;
  border-color: #2563eb;
}

.primary-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

@media (max-width: 1024px) {
  .category-grid { grid-template-columns: 1fr; }
  .resources-grid { grid-template-columns: 1fr; }
  .subscribe-form { flex-direction: column; }
  .page-title { font-size: 3.5rem; }
}
</style>
