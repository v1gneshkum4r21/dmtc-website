<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero docs-hero-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">DOCUMENTATION</span>
        </div>
        <h1 class="hero-title">Developer <span class="text-gradient">Documentation</span></h1>
        <p class="hero-subtitle">
          Complete technical documentation and SDKs for building production-ready agent workflows in minutes.
        </p>
        <div class="search-vessel">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search the docs..." class="search-input">
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Start Grid -->
    <section class="quick-start">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">GET STARTED</div>
          <h2 class="section-title">Quick <span class="text-gradient">Launch</span></h2>
        </div>
        <div class="docs-grid" @mousemove="handleMouseMove" ref="docsGrid">
          <div v-for="guide in quickStart" :key="guide.title" class="doc-card glass-card">
            <div class="card-glow"></div>
            <div class="doc-content">
              <div class="icon-box" v-html="guide.icon"></div>
              <h3>{{ guide.title }}</h3>
              <p>{{ guide.desc }}</p>
              <span class="read-more">Deploy Guide →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API Reference Snippet -->
    <section class="api-preview">
      <div class="section-container">
        <div class="api-grid">
          <div class="api-text">
            <div class="detail-badge">API REFERENCE</div>
            <h2 class="section-title">Powerful <span class="text-gradient">Primitives</span></h2>
            <p>Our REST and WebSocket APIs are designed for reliability and low-latency interaction. Manage agent lifecycles and streaming voice buffers with ease.</p>
            <ul class="api-features">
              <li>Granular Workflow Control</li>
              <li>Real-time State Syncing</li>
              <li>Secure Orchestration Tokens</li>
            </ul>
          </div>
          <div class="code-preview-vessel">
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
      <div class="cta-luxe-card indigo-aura">
        <div class="cta-luxe-content">
          <h2 class="cta-luxe-title">Need technical <span class="text-gradient">Support</span>?</h2>
          <div class="cta-luxe-buttons">
            <button class="btn-luxe-primary" @click="openContactModal">
              <span>Open a Ticket</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
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
import { ref, onMounted, inject } from 'vue'

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

const docsGrid = ref(null)

const handleMouseMove = (e) => {
  if (!docsGrid.value) return
  const cards = docsGrid.value.querySelectorAll('.doc-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  })
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Premium Hero */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.docs-hero-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.badge-wrapper { margin-bottom: 2rem; }
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
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
}

.search-vessel { display: flex; justify-content: center; }
.search-bar { width: 100%; max-width: 500px; position: relative; }
.search-icon {
  position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%);
  width: 20px; height: 20px; color: var(--text-secondary); opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border-radius: 20px;
  border: 1px solid var(--grid-color);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  transition: 0.3s;
}

.search-input:focus {
  outline: none; border-color: #6366f1;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
}

/* Quick Start Section */
.quick-start { padding: 8rem 5%; }
.centered { text-align: center; margin-bottom: 6rem; }
.detail-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
}

.section-title { font-size: 3.5rem; font-weight: 850; }

.docs-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
}

.glass-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.doc-card {
  padding: 3.5rem;
  flex: 1 1 350px;
  max-width: 400px;
  cursor: pointer;
}

.doc-card::before {
  content: ''; position: absolute; inset: 0; padding: 1px; border-radius: 32px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.2;
}

.doc-card:hover { transform: translateY(-10px); border-color: rgba(99, 102, 241, 0.3); }

.card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.5s ease; pointer-events: none;
}

.doc-card:hover .card-glow { opacity: 1; }

.icon-box { color: #6366f1; width: 56px; height: 56px; margin-bottom: 2rem; }
.doc-card h3 { font-size: 1.75rem; font-weight: 850; margin-bottom: 1.25rem; }
.doc-card p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 2.5rem; }
.read-more { font-weight: 800; color: #6366f1; font-size: 0.9rem; }

/* API Preview */
.api-preview { padding: 10rem 5%; background: rgba(0,0,0,0.2); }
.api-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6rem; align-items: center; }

.api-text p { font-size: 1.25rem; color: var(--text-secondary); margin-top: 1.5rem; line-height: 1.7; }

.api-features { list-style: none; padding: 0; margin-top: 2.5rem; }
.api-features li {
  margin-bottom: 1rem; font-weight: 700; color: white;
  display: flex; align-items: center; gap: 1rem;
}
.api-features li::before { content: ''; width: 6px; height: 6px; background: #6366f1; border-radius: 50%; }

.code-preview-vessel {
  background: #0a0a0c; border-radius: 32px; border: 1px solid var(--glass-border);
  overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}

.code-header { padding: 1.25rem 2rem; background: rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: center; }
.code-dots { display: flex; gap: 0.6rem; }
.code-dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.file-name { color: #6366f1; font-family: monospace; font-size: 0.85rem; font-weight: 700; }

.code-box { padding: 3rem; margin: 0; overflow-x: auto; color: #e2e8f0; font-family: 'Fira Code', monospace; line-height: 1.8; }
.code-box code { color: #6366f1; }

/* Luxe Aura CTA System */
.page-cta { padding: 12rem 5%; }

.cta-luxe-card {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 8rem 4rem;
  border-radius: 40px;
  overflow: hidden;
  text-align: center;
  background: #050505;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
}

.indigo-aura::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 120%, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  z-index: 0;
}

.cta-luxe-content {
  position: relative;
  z-index: 10;
}

.cta-luxe-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  margin-bottom: 4rem;
  line-height: 1.1;
}

.btn-luxe-primary {
  position: relative;
  padding: 1.25rem 3.5rem;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.btn-luxe-primary svg {
  width: 20px;
  transition: transform 0.4s ease;
}

.btn-luxe-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.2);
}

.btn-luxe-primary:hover svg {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .cta-luxe-card { padding: 5rem 2rem; border-radius: 30px; }
  .cta-luxe-title { font-size: 2.5rem; }
  .btn-luxe-primary { width: 100%; justify-content: center; }
}

@media (max-width: 1024px) {
  .api-grid { grid-template-columns: 1fr; gap: 4rem; }
  .doc-card { flex: 1 1 100%; }
}

@media (max-width: 768px) {
  .cta-card { padding: 5rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
  .code-box { padding: 1.5rem; font-size: 0.9rem; }
}
</style>
