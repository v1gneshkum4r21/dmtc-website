<template>
  <div class="page-container">
    <div class="page-hero green-gradient">
      <div class="hero-content">
        <h1 class="page-title">AI for Enterprise</h1>
        <p class="page-subtitle">Transform your entire organization with multi-agent orchestration.</p>
      </div>
    </div>
    
    <div class="page-details">
      <section class="info-section">
        <div class="info-card">
          <h2>Agent Swarms</h2>
          <p>Deploy specialized AI swarms tailored to your mission-critical business functions, from finance to supply chain.</p>
        </div>
        <div class="info-card">
          <h2>Enterprise Security</h2>
          <p>Built with enterprise-grade security and compliance at the core. Your data stays yours, always.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Reusing shared styles for consistency */
.page-container {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-hero {
  padding: 10rem 5% 6rem;
  text-align: center;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--grid-color);
  position: relative;
  overflow: hidden;
}

.green-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(168, 230, 200, 0.15) 0%, transparent 70%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 4rem;
  font-weight: 850;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #10B981 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-weight: 500;
}

.page-details {
  padding: 6rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
}

.info-card {
  padding: 3rem;
  border-radius: 24px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.info-card h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.info-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-title { font-size: 2.5rem; }
  .page-subtitle { font-size: 1.2rem; }
  .info-section { grid-template-columns: 1fr; }
}
</style>
