<template>
  <section class="service-showcase">
    <div class="showcase-header">
      <div class="header-container">
        <h2 class="section-title">Solutions for the Agentic Era</h2>
        <div class="header-desc-row">
          <p class="section-subtitle hide-mobile">
            From intelligent automation to enterprise-scale AI systems, we deliver 
            cutting-edge solutions that transform how organizations operate and innovate.
          </p>
          <button class="cta-mini-btn">
            Explore Solutions
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Infinite Scrolling Strips -->
    <div class="strips-container">
      <div v-for="(row, rIdx) in strips" :key="rIdx" class="marquee-row" :class="row.direction">
        <div class="marquee-content" :style="{ animationDuration: row.speed }">
          <div v-for="i in 3" :key="i" class="marquee-track">
            <div 
              v-for="(card, cIdx) in row.cards" 
              :key="cIdx" 
              class="tech-tag-card"
              :style="{ backgroundColor: card.color }"
            >
              <div class="tag-content">
                <div class="tag-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- CPU -->
                    <rect v-if="card.icon === 'cpu'" x="4" y="4" width="16" height="16" rx="2" /><rect v-if="card.icon === 'cpu'" x="9" y="9" width="6" height="6" /><path v-if="card.icon === 'cpu'" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                    <!-- Message Circle -->
                    <path v-else-if="card.icon === 'message-circle'" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    <!-- Sparkles -->
                    <path v-else-if="card.icon === 'sparkles'" d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12zM5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
                    <!-- Book Open -->
                    <path v-else-if="card.icon === 'book-open'" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                    <!-- Trending Up -->
                    <polyline v-else-if="card.icon === 'trending-up'" points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline v-if="card.icon === 'trending-up'" points="17 6 23 6 23 12" />
                    <!-- Heart -->
                    <path v-else-if="card.icon === 'heart'" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    <!-- Zap -->
                    <polygon v-else-if="card.icon === 'zap'" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    <!-- Bar Chart -->
                    <line v-else-if="card.icon === 'bar-chart'" x1="12" y1="20" x2="12" y2="10" /><line v-if="card.icon === 'bar-chart'" x1="18" y1="20" x2="18" y2="4" /><line v-if="card.icon === 'bar-chart'" x1="6" y1="20" x2="6" y2="16" />
                    <!-- Grid -->
                    <rect v-else-if="card.icon === 'grid'" x="3" y="3" width="7" height="7" /><rect v-if="card.icon === 'grid'" x="14" y="3" width="7" height="7" /><rect v-if="card.icon === 'grid'" x="14" y="14" width="7" height="7" /><rect v-if="card.icon === 'grid'" x="3" y="14" width="7" height="7" />
                    <!-- Radio -->
                    <circle v-else-if="card.icon === 'radio'" cx="12" cy="12" r="2" /><path v-if="card.icon === 'radio'" d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" />
                    <!-- Film -->
                    <rect v-else-if="card.icon === 'film'" x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line v-if="card.icon === 'film'" x1="7" y1="2" x2="7" y2="22" /><line v-if="card.icon === 'film'" x1="17" y1="2" x2="17" y2="22" /><line v-if="card.icon === 'film'" x1="2" y1="12" x2="22" y2="12" /><line v-if="card.icon === 'film'" x1="2" y1="7" x2="7" y2="7" /><line v-if="card.icon === 'film'" x1="2" y1="17" x2="7" y2="17" /><line v-if="card.icon === 'film'" x1="17" y1="17" x2="22" y2="17" /><line v-if="card.icon === 'film'" x1="17" y1="7" x2="22" y2="7" />
                    <!-- Users -->
                    <path v-else-if="card.icon === 'users'" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle v-if="card.icon === 'users'" cx="9" cy="7" r="4" /><path v-if="card.icon === 'users'" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    <!-- Play Circle -->
                    <circle v-else-if="card.icon === 'play-circle'" cx="12" cy="12" r="10" /><polygon v-if="card.icon === 'play-circle'" points="10 8 16 12 10 16 10 8" />
                    <!-- Image -->
                    <rect v-else-if="card.icon === 'image'" x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle v-if="card.icon === 'image'" cx="8.5" cy="8.5" r="1.5" /><polyline v-if="card.icon === 'image'" points="21 15 16 10 5 21" />
                    <!-- Eye -->
                    <path v-else-if="card.icon === 'eye'" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle v-if="card.icon === 'eye'" cx="12" cy="12" r="3" />
                    <!-- Box -->
                    <path v-else-if="card.icon === 'box'" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline v-if="card.icon === 'box'" points="3.27 6.96 12 12.01 20.73 6.96" /><line v-if="card.icon === 'box'" x1="12" y1="22.08" x2="12" y2="12" />
                    <!-- Home -->
                    <path v-else-if="card.icon === 'home'" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline v-if="card.icon === 'home'" points="9 22 9 12 15 12 15 22" />
                    <!-- Map -->
                    <polygon v-else-if="card.icon === 'map'" points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line v-if="card.icon === 'map'" x1="8" y1="2" x2="8" y2="18" /><line v-if="card.icon === 'map'" x1="16" y1="6" x2="16" y2="22" />
                    <!-- Layout -->
                    <rect v-else-if="card.icon === 'layout'" x="3" y="3" width="18" height="18" rx="2" ry="2" /><line v-if="card.icon === 'layout'" x1="3" y1="9" x2="21" y2="9" /><line v-if="card.icon === 'layout'" x1="9" y1="21" x2="9" y2="9" />
                    <!-- Target -->
                    <circle v-else-if="card.icon === 'target'" cx="12" cy="12" r="10" /><circle v-if="card.icon === 'target'" cx="12" cy="12" r="6" /><circle v-if="card.icon === 'target'" cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div class="tag-info">
                  <span class="tag-title">{{ card.title }}</span>
                  <span class="tag-desc">{{ card.desc }}</span>
                </div>
              </div>
              <!-- Subtle inner depth -->
              <div class="tag-depth"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const strips = [
  {
    direction: 'to-left',
    speed: '30s',
    cards: [
      { title: 'Agentic AI', desc: 'Autonomous', color: '#007AFF', icon: 'cpu' },
      { title: 'Chat/LLM', desc: 'Conversation', color: '#34C759', icon: 'message-circle' },
      { title: 'GenAI', desc: 'Creative', color: '#FF2D55', icon: 'sparkles' },
      { title: 'Knowledge', desc: 'RAG Systems', color: '#AF52DE', icon: 'book-open' },
      { title: 'Predictive', desc: 'Forecasting', color: '#FF9500', icon: 'trending-up' },
      { title: 'Recommend', desc: 'Personalize', color: '#5E5CE6', icon: 'heart' },
      { title: 'Automation', desc: 'Workflows', color: '#30B0C7', icon: 'zap' }
    ]
  },
  {
    direction: 'to-right',
    speed: '25s',
    cards: [
      { title: 'Analytics', desc: 'Insights', color: '#E6007E', icon: 'bar-chart' },
      { title: 'Multi-Modal', desc: 'Cross-media', color: '#5AC8FA', icon: 'grid' },
      { title: 'Media Intel', desc: 'Semantic', color: '#A2E100', icon: 'radio' },
      { title: 'Image/Video', desc: 'Generation', color: '#FF3B30', icon: 'film' },
      { title: 'AI Avatars', desc: 'Digital Twin', color: '#FFCC00', icon: 'users' },
      { title: 'Production', desc: 'Acceleration', color: '#00C7BE', icon: 'play-circle' },
      { title: 'Rendering', desc: 'E-commerce', color: '#2C3E50', icon: 'image' }
    ]
  },
  {
    direction: 'to-left',
    speed: '35s',
    cards: [
      { title: 'Visualizer', desc: 'Data Imaging', color: '#8E44AD', icon: 'eye' },
      { title: '3D Design', desc: 'Spatial', color: '#FF2D70', icon: 'box' },
      { title: 'Real Estate', desc: 'Properties', color: '#1ABC9C', icon: 'home' },
      { title: 'Virtual Tour', desc: 'Mapping', color: '#FF6F00', icon: 'map' },
      { title: 'Interior AI', desc: 'Smart Design', color: '#001F3F', icon: 'layout' },
      { title: 'Planning', desc: 'Strategy', color: '#E67E22', icon: 'target' }
    ]
  }
]
</script>

<style scoped>
.service-showcase {
  background: var(--bg-primary);
  padding: 10rem 0;
  overflow: hidden;
  position: relative;
}

.showcase-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 5%;
  margin-bottom: 5rem;
}

.header-container {
  width: 100%;
}

.section-title {
  font-size: clamp(2rem, 5.5vw, 3.8rem);
  font-weight: 850;
  color: var(--text-primary);
  letter-spacing: -0.05em;
  margin-bottom: 1.5rem;
  max-width: 800px;
  line-height: 1;
}

.header-desc-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 650px;
  opacity: 0.8;
}

.cta-mini-btn {
  background: #635BFF;
  color: white;
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 750;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-arrow { transition: transform 0.3s ease; }
.cta-mini-btn:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(99, 91, 255, 0.3); }
.cta-mini-btn:hover .btn-arrow { transform: translateX(5px); }

/* Strips Container */
.strips-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 5%;
  max-width: 1480px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

/* Fade gradients on edges */
.strips-container::before,
.strips-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 10;
  pointer-events: none;
}

.strips-container::before {
  left: 0;
  background: linear-gradient(to right, var(--bg-primary) 0%, transparent 100%);
}

.strips-container::after {
  right: 0;
  background: linear-gradient(to left, var(--bg-primary) 0%, transparent 100%);
}

.marquee-row {
  width: 100%;
  position: relative;
}

.marquee-content {
  display: flex;
  animation: scroll linear infinite;
}

.to-left .marquee-content { animation-name: scroll-left; }
.to-right .marquee-content { animation-name: scroll-right; }

.marquee-content:hover { animation-play-state: paused; }

.marquee-track {
  display: flex;
  gap: 1.5rem;
  padding-right: 1.5rem;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-33.333%); }
  100% { transform: translateX(0); }
}

.tech-tag-card {
  width: 240px;
  height: 90px;
  border-radius: 18px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.tag-content {
  width: 100%;
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
  color: white;
}

.tag-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  opacity: 0.9;
  transition: all 0.4s ease;
}

.tag-icon svg { 
  width: 100%; 
  height: 100%;
}

.tag-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.tag-title {
  font-size: 1.2rem;
  font-weight: 850;
  letter-spacing: -0.03em;
  line-height: 1;
}

.tag-desc {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.tag-depth {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05), transparent 40%, rgba(255,255,255,0.05));
  z-index: 1;
}

/* Hover States */
.tech-tag-card:hover {
  transform: translateY(-6px) scale(1.05) rotate(1deg);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.tech-tag-card:hover .tag-icon {
  opacity: 1;
  transform: scale(1.15);
}

/* Tablet */
@media (max-width: 1024px) {
  .showcase-header { 
    max-width: 100%;
    padding: 0 4%; 
    margin-bottom: 4rem; 
  }
  .strips-container {
    max-width: 100%;
    padding: 0 4%;
  }
  /* Faster speeds on tablet */
  .marquee-row:nth-child(1) .marquee-content { animation-duration: 25s !important; }
  .marquee-row:nth-child(2) .marquee-content { animation-duration: 20s !important; }
  .marquee-row:nth-child(3) .marquee-content { animation-duration: 28s !important; }
  
  .header-desc-row { flex-direction: column; align-items: flex-start; gap: 2rem; }
  .section-subtitle { max-width: 100%; }
  .tech-tag-card { width: 200px; height: 80px; }
  .tag-title { font-size: 1.1rem; }
  .tag-desc { font-size: 0.8rem; }
  .tag-icon { width: 24px; height: 24px; }
}

/* Mobile */
@media (max-width: 768px) {
  .service-showcase { padding: 5rem 0 4rem; }
  .showcase-header { 
    padding: 0 5%; 
    margin-bottom: 3rem; 
  }
  .strips-container {
    padding: 0 5%;
  }
  /* Even faster on mobile */
  .marquee-row:nth-child(1) .marquee-content { animation-duration: 20s !important; }
  .marquee-row:nth-child(2) .marquee-content { animation-duration: 18s !important; }
  .marquee-row:nth-child(3) .marquee-content { animation-duration: 22s !important; }
  
  .section-title { 
    font-size: 2rem; 
    max-width: 100%;
    margin-bottom: 1.5rem;
  }
  .hide-mobile { display: none; }
  .header-desc-row { gap: 1.5rem; }
  .cta-mini-btn { 
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  .strips-container { gap: 1.2rem; }
  .marquee-track { gap: 1.2rem; padding-right: 1.2rem; }
  .tech-tag-card { 
    width: 170px; 
    height: 68px; 
    border-radius: 14px;
  }
  .tag-content { padding: 0 1.2rem; gap: 0.8rem; }
  .tag-title { font-size: 0.95rem; }
  .tag-desc { font-size: 0.7rem; }
  .tag-icon { width: 20px; height: 20px; }
}

/* Small Mobile */
@media (max-width: 480px) {
  .service-showcase { padding: 4rem 0 3rem; }
  /* Fastest on small mobile */
  .marquee-row:nth-child(1) .marquee-content { animation-duration: 18s !important; }
  .marquee-row:nth-child(2) .marquee-content { animation-duration: 15s !important; }
  .marquee-row:nth-child(3) .marquee-content { animation-duration: 20s !important; }
  
  .section-title { font-size: 1.75rem; }
  .tech-tag-card { width: 150px; height: 60px; }
  .tag-content { padding: 0 1rem; gap: 0.6rem; }
  .tag-title { font-size: 0.85rem; }
  .tag-desc { font-size: 0.65rem; }
  .tag-icon { width: 18px; height: 18px; }
}
</style>
