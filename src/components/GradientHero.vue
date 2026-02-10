<template>
  <div class="stripe-hero-wrapper">
    <!-- The Slanted Hero Container -->
    <div class="stripe-hero">
      
      <!-- 1. Background Box Pattern -->
      <div class="boxes-overlay"></div>

      <!-- 2. Twisted Ribbon Background (Preserved) -->
      <div class="ribbon-canvas">
        <div class="ribbon-fold fold-green"></div>
        <div class="ribbon-fold fold-blue-shadow"></div>
        <div class="ribbon-fold fold-blue-core"></div>
        <div class="ribbon-fold fold-lavender"></div>
        <div class="glass-sheen"></div>
      </div>

      <div class="hero-container">
        <!-- 3. Main Content -->
        <div class="hero-content">
          <div class="badge">
            <span class="badge-text">Dreamactic</span>
            <span class="badge-arrow">→</span>
          </div>

          <h1 class="hero-title">
            AI products<br>
            and solutions
          </h1>

          <p class="hero-subtitle">
            Experience the next generation of intelligent business. We build the agentic infrastructure that powers modern innovation.
          </p>

          <div class="cta-group">
            <button class="primary-btn">Start now <span class="arrow">→</span></button>
            <button class="secondary-btn">Contact sales <span class="arrow">→</span></button>
          </div>
        </div>

        <!-- 4. Logo Strip -->
        <div class="logo-strip">
          <!-- Anthropic -->
          <span class="partner-logo">ANTHROPIC</span>
          <!-- Lightspeed -->
          <span class="partner-logo">lightspeed</span>
          <!-- Lovable -->
          <span class="partner-logo">Lovable</span>
          <!-- OpenAI -->
          <span class="partner-logo">OpenAI</span>
          <!-- Amazon -->
          <span class="partner-logo">amazon</span>
          <!-- NVIDIA -->
          <span class="partner-logo">NVIDIA</span>
          <!-- Ford -->
          <span class="partner-logo">Ford</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Static layout
</script>

<style scoped>
.stripe-hero-wrapper {
  /* No longer needed for slant */
  width: 100%;
  overflow: hidden;
}

.stripe-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5%;
}


/* ========================================
   BACKGROUND BOX PATTERN
   ======================================== */
.boxes-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center top;
  z-index: 1;
  pointer-events: none;
  opacity: 0.4;
  mask-image: radial-gradient(circle at 20% 30%, black 0%, transparent 70%);
}

/* ========================================
   TWISTED RIBBON SYSTEM (Existing)
   ======================================== */
.ribbon-canvas {
  position: absolute;
  top: -10%;
  right: -10%;
  width: 70%; 
  height: 120%;
  z-index: 2; /* Above grid, below content */
  perspective: 1000px;
  transform-style: preserve-3d;
}

.ribbon-fold {
  position: absolute;
  mix-blend-mode: multiply;
  filter: blur(50px);
  opacity: 0.9;
  will-change: transform;
  animation: ribbon-float 15s ease-in-out infinite alternate;
}

.fold-green {
  bottom: 0;
  right: 10%;
  width: 800px;
  height: 1000px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background: linear-gradient(135deg, #92C2A7 0%, transparent 80%);
  transform: rotate(-15deg) translateZ(-50px);
  animation-delay: -2s;
  opacity: 0.85;
}

.fold-blue-core {
  top: 15%;
  right: 25%;
  width: 600px;
  height: 1200px;
  border-radius: 100% 0% 100% 0% / 80% 0% 60% 0%;
  background: linear-gradient(to bottom, #94ACC0 10%, #9C92C3 60%, transparent 100%);
  transform: rotate(10deg) skewX(-10deg);
  z-index: 5;
  animation-delay: -5s;
}

.fold-blue-shadow {
  top: 20%;
  right: 22%;
  width: 550px;
  height: 1100px;
  border-radius: 100% 0% 100% 0%;
  background: #94ACC0;
  opacity: 0.4;
  filter: blur(80px);
  transform: rotate(8deg);
  z-index: 2;
}

.fold-lavender {
  top: -10%;
  right: 0%;
  width: 900px;
  height: 900px;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: linear-gradient(225deg, #9C92C3 20%, rgba(156, 146, 195, 0) 80%);
  transform: rotate(-30deg) scale(1.1);
  z-index: 10;
  animation-delay: -8s;
}

@keyframes ribbon-float {
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-20px) rotate(1deg) scale(1.02); }
  100% { transform: translateY(10px) rotate(-1deg) scale(0.98); }
}

.glass-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.6) 45%, transparent 60%);
  pointer-events: none;
  mix-blend-mode: soft-light;
  z-index: 15;
}

/* ========================================
   CONTENT
   ======================================== */
.hero-container {
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 20;
}

.hero-content {
  margin-top: 5rem;
  max-width: 800px; /* Slightly wider than showcase header to accommodate large hero title */
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  background: transparent;
  color: var(--accent-primary);
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  cursor: pointer;
}

.hero-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 480px;
}
@media (max-width: 768px) {
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
}

.cta-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap; /* Allow wrapping */
}

.primary-btn {
  background: var(--accent-primary);
  color: #ffffff;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11);
}

.secondary-btn {
  background: transparent;
  color: var(--accent-primary);
  border: none;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ========================================
   LOGO STRIP
   ======================================== */
.logo-strip {
  margin-top: 10rem;
  display: flex;
  gap: 3rem;
  align-items: center;
  opacity: 0.8;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .logo-strip {
    gap: 2rem;
    justify-content: center;
  }
}

.partner-logo {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  /* Simulating logos with text for now */
  font-family: system-ui, -apple-system, sans-serif;
}

@media (max-width: 768px) {
  .stripe-hero {
    padding: 6rem 1.5rem 4rem 1.5rem;
    min-height: auto;
    justify-content: flex-start;
  }
  .hero-content {
    margin-top: 2rem;
  }
  .ribbon-canvas {
    width: 100%;
    right: 0;
    opacity: 0.4;
  }
  .logo-strip {
    margin-top: 4rem;
    gap: 1.5rem;
  }
  .partner-logo {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.8rem;
  }
  .cta-group {
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100%;
    gap: 0.75rem;
  }
  .primary-btn, .secondary-btn {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.2rem;
  }
  .secondary-btn {
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    background: var(--bg-secondary);
  }
}
</style>
