<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero superfiitter-gradient">
      <div class="hero-content">
        <div class="hero-badge">AI VIRTUAL TRY-ON</div>
        <h1 class="page-title">SuperFiitter</h1>
        <h2 class="page-tagline">Real-Time Virtual Try-On for Digital Commerce</h2>
        <p class="page-description">
          Transform online shopping into an immersive experience. 
          SuperFiitter enables real-time rendering for deeper customer engagement 
          and confident digital interaction.
        </p>

        <div class="hero-actions">
          <button class="primary-btn" @click="openContactModal">
            Request Demo
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Technical Foundation -->
    <section class="capabilities-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">THE PLATFORM</span>
          <h2>Technical <span class="text-gradient">Foundation</span></h2>
        </div>

        <div class="capabilities-grid">
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <h4>Real-Time Rendering</h4>
            <p>Instantaneous processing and visualization through high-performance rendering pipelines.</p>
          </div>
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h4>Motion Understanding</h4>
            <p>Advanced AI detects posture and movement to align products realistically across all frames.</p>
          </div>
          <div class="cap-card">
            <div class="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
              </svg>
            </div>
            <h4>Visual Fidelity</h4>
            <p>High-resolution neural texture mapping that replicates fabric weight, translucency, and drape.</p>
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
             <h4>Fashion Retail</h4>
             <p>Reduce return rates and increase conversion by giving customers confidence in fit and style.</p>
          </div>
          <div class="use-case-card">
             <h4>Premium Accessories</h4>
             <p>Virtual try-on for eyewear, jewelry, and watches with dynamic, real-time lighting previews.</p>
          </div>
          <div class="use-case-card">
             <h4>Digital Goods</h4>
             <p>Power next-generation fashion experiences including digital garments and virtual styling tools.</p>
          </div>
          <div class="use-case-card">
             <h4>Omnichannel Sales</h4>
             <p>Extend virtual try-on into retail displays and hybrid shopping environments for a unified experience.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Ready to revolutionize your <span class="text-gradient">Fitting Experience</span>?</h2>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Request a Demo
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

.superfiitter-gradient::before {
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
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #6366f1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-tagline {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

/* Sections Shared Styles */
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

.text-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
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
  border-color: #6366f1;
}

.icon-box {
  width: 48px;
  height: 48px;
  color: #6366f1;
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
  margin-bottom: 3rem;
  line-height: 1.1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
}

/* Global Buttons Refinement */
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

/* Responsiveness */
@media (max-width: 1024px) {
  .capabilities-grid { grid-template-columns: 1fr; }
  .use-cases-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
}
</style>
