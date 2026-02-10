<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero about-gradient">
      <div class="hero-content">
        <div class="hero-badge">OUR MISSION</div>
        <h1 class="page-title">Building the <span class="text-gradient">Operating System</span> for Agentic AI</h1>
        <p class="page-description">
          At Dreamactic, we're engineering the infrastructure that enables enterprises to deploy, orchestrate, and scale 
          autonomous AI agents across their entire operation. From voice-powered customer experiences to intelligent workflow 
          automation, we're turning the promise of artificial intelligence into measurable business outcomes.
        </p>
      </div>
    </div>

    <!-- Vision Section -->
    <section class="vision-section">
      <div class="section-container">
        <div class="vision-grid">
          <div class="vision-text">
            <span class="section-tag">THE VISION</span>
            <h2>The Future is <span class="text-gradient">Autonomous</span></h2>
            <p>We envision enterprises where AI agents act as trusted team members—making decisions, solving problems, and executing complex workflows with minimal human intervention. Our platform provides the orchestration layer that makes this future possible today, enabling organizations to scale intelligence as easily as they scale compute.</p>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">98.7%</span>
                <span class="stat-label">Task Accuracy</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">85%</span>
                <span class="stat-label">Cost Reduction</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">10M+</span>
                <span class="stat-label">Tasks Automated</span>
              </div>
            </div>
          </div>
          <div class="vision-visual">
            <div class="abstract-shape"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">CORE VALUES</span>
          <h2>The Principles that <span class="text-gradient">Drive Us</span></h2>
        </div>
        <div class="values-grid">
          <div class="value-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h4>Agent-First Architecture</h4>
            <p>We build systems where AI agents are first-class citizens, capable of independent decision-making, learning from outcomes, and collaborating with humans and other agents seamlessly.</p>
          </div>
          <div class="value-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h4>Enterprise-Grade Reliability</h4>
            <p>Our infrastructure is built for mission-critical operations with 99.99% uptime, enterprise security, and compliance certifications that meet the highest industry standards.</p>
          </div>
          <div class="value-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4>Responsible AI</h4>
            <p>We integrate explainability, auditability, and ethical guardrails into every layer of our platform, ensuring AI decisions are transparent, fair, and aligned with human values.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Join us in building the <span class="text-gradient">Future of Work</span></h2>
          <div class="cta-buttons">
            <router-link to="/company/careers" class="primary-btn">
              Explore Careers
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

.about-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
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
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #6366f1;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #6366f1 100%);
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
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  color: #6366f1;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

/* Vision Section */
.vision-section {
  padding: 8rem 5%;
}

.vision-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}

.vision-text h2 {
  font-size: 3.5rem;
  font-weight: 850;
  margin-bottom: 2rem;
}

.vision-text p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vision-visual {
  height: 400px;
  background: var(--bg-secondary);
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--grid-color);
}

.abstract-shape {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  filter: blur(80px);
  opacity: 0.15;
}

/* Values Section */
.values-section {
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

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.value-card {
  padding: 3rem;
  background: var(--bg-primary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.value-card:hover {
  transform: translateY(-8px);
  border-color: #6366f1;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #6366f1;
  margin-bottom: 2rem;
}

.value-card h4 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.value-card p {
  color: var(--text-secondary);
  line-height: 1.6;
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
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.25);
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
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 1024px) {
  .vision-grid { grid-template-columns: 1fr; gap: 4rem; }
  .values-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
  .cta-card h2 { font-size: 2.5rem; }
}
</style>
