<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero blog-hero">
      <div class="hero-content">
        <div class="hero-badge">THE AGENTIC BLOG</div>
        <h1 class="page-title">Insights from the <span class="text-gradient">AI Frontier</span></h1>
        <p class="page-description">
          Analysis, research breakthroughs, and strategic perspectives from the team building enterprise-grade autonomous AI infrastructure. Explore how industry leaders are deploying agents that think, decide, and act.
        </p>
      </div>
    </div>

    <!-- Featured Post -->
    <section class="featured-post">
      <div class="section-container">
        <div class="featured-card">
          <div class="featured-image"></div>
          <div class="featured-info">
            <span class="post-date">FEBRUARY 09, 2026</span>
            <h2>Why Multi-Agent Systems Will Replace Monolithic AI Models</h2>
            <p>The next paradigm shift in enterprise AI won't be about larger models—it will be about intelligent coordination. We explore why specialized agent swarms consistently outperform single-model approaches for complex business operations, and what this means for AI infrastructure.</p>
            <button class="primary-btn">Read Full Article</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Post Grid -->
    <section class="post-grid-section">
      <div class="section-container">
        <div class="post-grid">
          <div v-for="post in posts" :key="post.title" class="post-card">
            <div class="post-thumbnail"></div>
            <div class="post-content">
              <div class="post-meta">
                <span>{{ post.category }}</span>
                <span class="dot"></span>
                <span>{{ post.date }}</span>
              </div>
              <h4>{{ post.title }}</h4>
              <p>{{ post.desc }}</p>
              <router-link to="#" class="read-link">Read More</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Stay ahead of the <span class="text-gradient">Curve</span></h2>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Manage Subscriptions
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

const posts = [
  { 
    title: 'Achieving 40ms Voice Latency: The EchoAI Architecture', 
    category: 'Engineering', 
    date: 'Feb 05, 2026', 
    desc: 'A deep dive into the streaming pipeline, neural voice synthesis, and edge deployment strategies that power our real-time conversational AI.' 
  },
  { 
    title: 'Alignment at Scale: Ethical Constraints in Multi-Agent Systems', 
    category: 'Research', 
    date: 'Jan 28, 2026', 
    desc: 'How we implement moral reasoning and safety guardrails that function across thousands of autonomous agents making independent decisions.' 
  },
  { 
    title: 'The Economics of AI Agents: When Automation Actually Pays Off', 
    category: 'Strategy', 
    date: 'Jan 15, 2026', 
    desc: 'Beyond the hype—a quantitative analysis of where autonomous agents deliver real ROI, based on deployments at 50+ enterprise customers.' 
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
  padding: 12rem 5% 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
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
  background: rgba(30, 41, 59, 0.05);
  border: 1px solid rgba(30, 41, 59, 0.1);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #475569 100%);
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
  background: linear-gradient(135deg, #1e293b 0%, #64748b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Featured Post */
.featured-post {
  padding: 6rem 5%;
}

.featured-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  background: var(--bg-secondary);
  border-radius: 48px;
  overflow: hidden;
  border: 1px solid var(--grid-color);
  min-height: 500px;
}

.featured-image {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  opacity: 0.8;
}

.featured-info {
  padding: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.post-date {
  font-size: 0.85rem;
  font-weight: 800;
  color: #2563eb;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.featured-info h2 {
  font-size: 3rem;
  font-weight: 850;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.featured-info p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 3rem;
}

/* Post Grid */
.post-grid-section {
  padding: 6rem 5% 8rem;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

.post-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-8px);
}

.post-thumbnail {
  height: 240px;
  background: var(--bg-secondary);
  border-radius: 24px;
  margin-bottom: 2rem;
  border: 1px solid var(--grid-color);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 750;
  color: #2563eb;
  text-transform: uppercase;
}

.dot {
  width: 4px;
  height: 4px;
  background: var(--grid-color);
  border-radius: 50%;
}

.post-content h4 {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.post-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.read-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  border-bottom: 2px solid var(--accent-primary);
  display: inline-block;
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
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
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
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .featured-card { grid-template-columns: 1fr; }
  .post-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
}
</style>
