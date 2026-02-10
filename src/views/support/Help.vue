<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero help-hero">
      <div class="hero-content">
        <div class="hero-badge">HELP CENTER</div>
        <h1 class="page-title">We're Here to <span class="text-gradient">Help</span></h1>
        <p class="page-description">
          Comprehensive support resources for technical integration, account management, and platform optimization. Our enterprise support team responds to critical issues within 2 hours.
        </p>
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search for answers..." class="search-input">
        </div>
      </div>
    </div>

    <!-- Help Categories -->
    <section class="help-categories">
      <div class="section-container">
        <div class="categories-grid">
          <div v-for="cat in helpCategories" :key="cat.name" class="help-card">
            <div class="help-icon" v-html="cat.icon"></div>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.desc }}</p>
            <ul class="help-links">
              <li v-for="link in cat.links" :key="link">{{ link }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">FAQ</span>
          <h2>Common <span class="text-gradient">Questions</span></h2>
        </div>
        <div class="faq-list">
          <div v-for="faq in faqs" :key="faq.q" class="faq-item">
            <h4>{{ faq.q }}</h4>
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Still have <span class="text-gradient">Questions</span>?</h2>
          <p class="cta-desc">Our technical support team is available 24/7 for enterprise customers.</p>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Contact Support
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

.help-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
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
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #0ea5e9;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #0ea5e9 100%);
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
  border-color: #0ea5e9;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
}

.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  color: #0ea5e9;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.5rem;
}

/* Categories */
.help-categories {
  padding: 8rem 5%;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.help-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
}

.help-card:hover {
  transform: translateY(-8px);
  border-color: #0ea5e9;
}

.help-icon {
  width: 48px;
  height: 48px;
  color: #0ea5e9;
  margin-bottom: 2rem;
}

.help-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.help-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.help-links {
  list-style: none;
  padding: 0;
}

.help-links li {
  margin-bottom: 0.8rem;
  font-weight: 700;
  color: #0ea5e9;
  cursor: pointer;
  font-size: 0.95rem;
}

/* FAQ */
.faq-section {
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

.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.faq-item h4 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.faq-item p {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* CTA */
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

.cta-desc {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3.5rem;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
}

@media (max-width: 1024px) {
  .categories-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
}
</style>
