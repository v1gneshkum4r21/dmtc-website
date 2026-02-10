<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero echoai-gradient">
      <div class="hero-content">
        <div class="hero-badge">AI VOICE & AUTONOMOUS AGENTS</div>
        <h1 class="page-title">EchoAI</h1>
        <h2 class="page-tagline">Advanced Voice Intelligence for Modern Operations</h2>
        <p class="page-description">
          The next evolution in voice intelligence and autonomous BPO automation. 
          Deploy self-learning voice agents that handle complex conversational workflows with human-parity precision.
        </p>

        <div class="hero-actions">
          <button class="primary-btn" @click="openContactModal">
            Get Started
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Core Capabilities -->
    <section class="capabilities-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">THE PLATFORM</span>
          <h2>Intelligent <span class="text-gradient">Automation</span></h2>
        </div>

        <div class="capabilities-grid">
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            </div>
            <h4>AI Voice Calling</h4>
            <p>Ultra-low latency, human-parity voice synthesis for high-volume support.</p>
          </div>
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h4>Autonomous Agents</h4>
            <p>Context-aware reasoning engines that handle multi-turn inquiries independently.</p>
          </div>
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h4>Enterprise Integration</h4>
            <p>Unified task orchestration that replaces manual processes with agent chains.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases -->
    <section class="use-cases-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">APPLICATIONS</span>
          <h2>Strategic <span class="text-gradient">Use Cases</span></h2>
        </div>

        <div class="use-cases-grid">
          <div class="use-case-card">
             <h4>Customer Support</h4>
             <p>Handle thousands of simultaneous calls with consistent quality and instant resolution.</p>
          </div>
          <div class="use-case-card">
             <h4>Sales & Outreach</h4>
             <p>Deploy persistent and persuasive agents for lead qualification and automated lead nurturing.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Revolutionize your <span class="text-gradient">Voice Operations</span></h2>
          <p class="cta-subtitle">Deploy high-performance voice intelligence that powers the next generation of digital enterprise.</p>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Book a Strategy Call
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
import { inject, onMounted } from 'vue'

const openContactModal = inject('openContactModal')

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

/* Hero Section */
.page-hero {
  padding: 12rem 5% 8rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
}

.echoai-gradient::before {
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
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-tagline {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
}

/* Sections Shared Styles */
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

.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-header h2 {
  font-size: 3.5rem;
  font-weight: 850;
}

/* Capabilities Section */
.capabilities-section {
  padding: 8rem 5%;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.cap-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.cap-card:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #3b82f6;
  margin-bottom: 2rem;
}

.cap-card h4 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.cap-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Use Cases Section */
.use-cases-section {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.use-case-card {
  padding: 3rem;
  background: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--grid-color);
}

.use-case-card h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.use-case-card p {
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
  margin-bottom: 2rem;
  line-height: 1.1;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 3rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
}

/* Global Buttons Refinement */
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

/* Responsiveness */
@media (max-width: 1024px) {
  .capabilities-grid { grid-template-columns: 1fr; }
  .use-cases-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
}
</style>
