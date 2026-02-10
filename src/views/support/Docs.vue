<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero docs-hero">
      <div class="hero-content">
        <div class="hero-badge">DOCUMENTATION</div>
        <h1 class="page-title">Developer <span class="text-gradient">Documentation</span></h1>
        <p class="page-description">
          Complete technical documentation, API references, and SDKs for integrating Dreamactic's autonomous AI platform. Start building production-ready agent workflows in minutes.
        </p>
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search the docs..." class="search-input">
        </div>
      </div>
    </div>

    <!-- Quick Start Grid -->
    <section class="quick-start">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">GET STARTED</span>
          <h2>Quick <span class="text-gradient">Launch</span></h2>
        </div>
        <div class="docs-grid">
          <div v-for="guide in quickStart" :key="guide.title" class="doc-card">
            <div class="icon-box" v-html="guide.icon"></div>
            <h3>{{ guide.title }}</h3>
            <p>{{ guide.desc }}</p>
            <span class="read-more">View Guide</span>
          </div>
        </div>
      </div>
    </section>

    <!-- API Reference Snippet -->
    <section class="api-preview">
      <div class="section-container">
        <div class="api-grid">
          <div class="api-text">
            <span class="section-tag">API REFERENCE</span>
            <h2>Powerful <span class="text-gradient">Primitives</span></h2>
            <p>Our REST and WebSocket APIs are designed for reliability and low-latency interaction. Manage agent lifecycles, streaming voice buffers, and complex reasoning nodes with ease.</p>
            <ul class="api-features">
              <li>Granular Workflow Control</li>
              <li>Real-time State Syncing</li>
              <li>Secure Orchestration Tokens</li>
            </ul>
          </div>
          <div class="code-preview">
            <div class="code-header">
              <div class="code-dots"><span></span><span></span><span></span></div>
              <span class="file-name">POST /v1/orchestrate</span>
            </div>
            <pre class="code-box"><code>{
  "workflow_id": "wf_claims_processor",
  "agents": [
    {
      "type": "voice",
      "model": "echo-ai-pro",
      "config": {
        "language": "en-US",
        "streaming": true
      }
    },
    {
      "type": "reasoning",
      "model": "logic-v3"
    }
  ],
  "task": {
    "description": "Process insurance claim",
    "priority": "high",
    "timeout": 300
  }
}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Need technical <span class="text-gradient">Support</span>?</h2>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Open a Ticket
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

const quickStart = [
  { 
    title: 'API Authentication', 
    desc: 'Generate and manage API keys, implement OAuth2 flows, and configure webhook signatures for secure integration.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  },
  { 
    title: 'Voice Agent Setup', 
    desc: 'Configuring EchoAI voice agents with custom voices, streaming protocols, and real-time transcription.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>'
  },
  { 
    title: 'Multi-Agent Workflows', 
    desc: 'Orchestrating complex task chains across multiple specialized agents with state management and error recovery.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
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

.docs-hero::before {
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
  margin: 0 auto 3rem;
}

.search-bar {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 1.2rem 1.5rem 1.2rem 3.5rem;
  border-radius: 16px;
  border: 1px solid var(--grid-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
}

.text-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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

/* Quick Start */
.quick-start {
  padding: 8rem 5%;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.doc-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
  cursor: pointer;
}

.doc-card:hover {
  transform: translateY(-8px);
  border-color: #6366f1;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #6366f1;
  margin-bottom: 2rem;
}

.doc-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.doc-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 700;
  color: #6366f1;
}

/* API Preview */
.api-preview {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.api-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem;
  align-items: center;
}

.api-text h2 {
  font-size: 3.5rem;
  font-weight: 850;
  margin-bottom: 2rem;
}

.api-text p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.api-features {
  list-style: none;
  padding: 0;
}

.api-features li {
  margin-bottom: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.api-features li::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #6366f1;
  border-radius: 50%;
}

.code-preview {
  background: #0f172a;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.code-header {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-dots {
  display: flex;
  gap: 0.5rem;
}

.code-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.file-name {
  color: #94a3b8;
  font-family: monospace;
  font-size: 0.85rem;
}

.code-box {
  padding: 2.5rem;
  margin: 0;
  color: #e2e8f0;
  font-family: 'Fira Code', monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  overflow-x: auto;
}

.code-box code {
  color: #38bdf8;
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

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
}

@media (max-width: 1024px) {
  .docs-grid { grid-template-columns: 1fr; }
  .api-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
}
</style>
