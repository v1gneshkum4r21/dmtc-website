<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero help-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">HELP CENTER</span>
        </div>
        <h1 class="hero-title">We're Here to <span class="text-gradient">Help</span></h1>
        <p class="hero-subtitle">
          Comprehensive support resources for technical integration, account management, and platform optimization.
        </p>
        <div class="search-vessel">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search for answers..." class="search-input">
          </div>
        </div>
      </div>
    </div>

    <section class="help-categories">
      <div class="section-container">
        <div class="categories-grid" ref="categoriesGrid" @mousemove="handleMouseMove">
          <div 
            v-for="cat in helpCategories" 
            :key="cat.name" 
            class="help-card glass-card"
          >
            <div class="card-glow"></div>
            <div class="help-card-content">
              <div class="help-icon" v-html="cat.icon"></div>
              <h3>{{ cat.name }}</h3>
              <p>{{ cat.desc }}</p>
              <ul class="help-links">
                <li v-for="link in cat.links" :key="link"><span>{{ link }}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">FAQ</div>
          <h2>Common <span class="text-gradient">Questions</span></h2>
        </div>
        <div class="faq-list">
          <div v-for="faq in faqs" :key="faq.q" class="faq-item glass-card mini">
            <div class="faq-q">
              <span class="q-glyph">?</span>
              <h4>{{ faq.q }}</h4>
            </div>
            <p class="faq-a">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-luxe-card sky-aura">
        <div class="cta-luxe-content">
          <h2 class="cta-luxe-title">Still have <span class="text-gradient">Questions</span>?</h2>
          <p class="cta-luxe-subtitle">Our technical support team is available 24/7 for enterprise customers.</p>
          <div class="cta-luxe-buttons">
            <button class="btn-luxe-primary" @click="openContactModal">
              <span>Contact Support</span>
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

const helpCategories = [
  { 
    name: 'Getting Started', 
    desc: 'Learn how to set up your first agent, configure authentication, and deploy your initial workflow.',
    links: ['5-Minute Quickstart', 'Authentication Setup', 'First Voice Agent', 'SDK Installation'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
  },
  { 
    name: 'Billing & Plans', 
    desc: 'Manage subscriptions, view usage analytics, upgrade plans, and access invoices.',
    links: ['Pricing Calculator', 'Usage Dashboard', 'Enterprise Pricing', 'Invoice History'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>'
  },
  { 
    name: 'Advanced Features', 
    desc: 'Optimize performance, scale to production, implement security best practices, and debug complex workflows.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6M9 20v-10M6 20v-4M15 20v-8M18 20v-12"/></svg>',
    links: ['Performance Tuning', 'Production Deployment', 'Security Guide', 'Troubleshooting']
  }
]

const faqs = [
  { q: 'How does Dreamactic ensure data privacy and compliance?', a: 'We use SOC 2 Type II certified infrastructure with end-to-end encryption. All data is encrypted at rest and in transit. We offer on-premise deployment options for highly regulated industries and support GDPR, HIPAA, and CCPA compliance requirements.' },
  { q: 'Can I bring my own AI models or use custom LLMs?', a: 'Yes, our platform is model-agnostic. You can integrate your own fine-tuned models, connect to any LLM endpoint, or combine multiple models in a single workflow. We provide adapter interfaces for OpenAI, Anthropic, Cohere, and custom hosted models.' },
  { q: 'What happens if an agent encounters an error or ambiguous situation?', a: 'Our platform includes configurable fallback behaviors, automatic retry logic with exponential backoff, and human-in-the-loop escalation triggers. You can define custom error handlers and set confidence thresholds for when agents should request human review.' }
]

const categoriesGrid = ref(null)

const handleMouseMove = (e) => {
  if (!categoriesGrid.value) return
  const cards = categoriesGrid.value.querySelectorAll('.help-card')
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

.help-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
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
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #0ea5e9;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%);
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

.search-vessel {
  display: flex;
  justify-content: center;
}

.search-bar {
  width: 100%;
  max-width: 500px;
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
  opacity: 0.5;
}

.search-input {
  width: 100%;
  padding: 1.2rem 1.5rem 1.2rem 3.5rem;
  border-radius: 20px;
  border: 1px solid var(--grid-color);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.15);
}

/* Categories Section */
.help-categories { padding: 8rem 5%; }
.categories-grid {
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

.help-card {
  padding: 3.5rem;
  flex: 1 1 350px;
  max-width: 400px;
  text-align: left;
}

.help-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.5), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.2;
}

.help-card:hover {
  transform: translateY(-10px);
  border-color: rgba(14, 165, 233, 0.3);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(14, 165, 233, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.help-card:hover .card-glow { opacity: 1; }

.help-icon {
  width: 56px;
  height: 56px;
  color: #0ea5e9;
  margin-bottom: 2rem;
}

.help-card h3 { font-size: 1.75rem; font-weight: 850; margin-bottom: 1.25rem; }
.help-card p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 2.5rem; }

.help-links { list-style: none; padding: 0; }
.help-links li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0ea5e9;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.help-links li::before {
  content: '→';
  font-family: serif;
  opacity: 0.5;
}

.help-links li:hover { transform: translateX(5px); color: #22d3ee; }

/* FAQ Section */
.faq-section { padding: 10rem 5%; background: rgba(0,0,0,0.2); }
.centered { text-align: center; margin-bottom: 6rem; }
.detail-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
}

.faq-list {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.faq-item {
  padding: 2.5rem;
  transition: 0.4s;
}

.faq-q {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.q-glyph {
  width: 32px;
  height: 32px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
  font-weight: 900;
}

.faq-item h4 { font-size: 1.3rem; font-weight: 800; margin: 0; }
.faq-a { color: var(--text-secondary); line-height: 1.8; padding-left: 3.5rem; }

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

.sky-aura::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 120%, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
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
  margin-bottom: 1.5rem;
  line-height: 1;
}

.cta-luxe-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 4rem;
  line-height: 1.6;
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
</style>
