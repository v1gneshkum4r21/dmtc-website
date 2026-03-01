<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="premium-hero community-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">OUR COMMUNITY</span>
        </div>
        <h1 class="hero-title">Join the <span class="text-gradient">Agentic AI</span> Community</h1>
        <p class="hero-subtitle">
          Connect with 50,000+ developers and researchers building the future of enterprise automation.
        </p>
        <div class="stats-row">
          <div class="stat-bubble">
            <span class="stat-value">50k+</span>
            <span class="stat-label">Active Developers</span>
          </div>
          <div class="stat-separator"></div>
          <div class="stat-bubble">
            <span class="stat-value">200+</span>
            <span class="stat-label">Enterprise Nodes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Channels Section -->
    <section class="channels-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">CHANNELS</div>
          <h2 class="section-title">Where We <span class="text-gradient">Connect</span></h2>
        </div>
        <div class="channels-grid" @mousemove="handleMouseMove" ref="channelsGrid">
          <div v-for="channel in channels" :key="channel.name" class="channel-card glass-card">
            <div class="card-glow"></div>
            <div class="channel-content">
              <div class="channel-icon" v-html="channel.icon"></div>
              <h3>{{ channel.name }}</h3>
              <p>{{ channel.desc }}</p>
              <button class="secondary-btn luxe">{{ channel.action }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="section-container">
        <div class="events-box">
          <div class="events-text">
            <div class="detail-badge">EVENTS</div>
            <h2 class="section-title">Global <span class="text-gradient">Meetups</span></h2>
            <p>From technical webinars to in-person orchestration hackathons, we are building a global network of agentic experts.</p>
          </div>
          
          <div class="events-list">
             <div v-for="event in events" :key="event.title" class="event-item glass-card mini">
               <div class="event-date-box">
                 <span class="event-date">{{ event.date }}</span>
               </div>
               <div class="event-info">
                 <h4>{{ event.title }}</h4>
                 <span class="event-loc">{{ event.location }}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-luxe-card blue-aura">
        <div class="cta-luxe-content">
          <h2 class="cta-luxe-title">Ready to join the <span class="text-gradient">Swarm</span>?</h2>
          <div class="cta-luxe-buttons">
            <button class="btn-luxe-primary">
              <span>Join Discord</span>
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
import { ref, onMounted } from 'vue'

const channels = [
  { 
    name: 'Discord Server', 
    desc: '24/7 real-time collaboration with our engineering team, API support channels, and showcase spaces for sharing your agent implementations.',
    action: 'Join 15k+ Members',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8z"/><path d="M10 12h4"/><path d="M12 10v4"/></svg>'
  },
  { 
    name: 'GitHub Discussions', 
    desc: 'Deep technical conversations about multi-agent architectures, SDK contributions, and feature requests with votes and roadmap visibility.',
    action: 'Explore Discussions',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  },
  { 
    name: 'Developer Forum', 
    desc: 'Long-form technical discussions, implementation patterns, and community-contributed tutorials for advanced use cases.',
    action: 'Browse Topics',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>'
  }
]

const events = [
  { title: 'AI Agent Summit 2026', date: 'March 20-22', location: 'San Francisco + Virtual' },
  { title: 'Multi-Agent Workshop Series', date: 'Every Thursday', location: 'Online' },
  { title: 'Enterprise AI Roundtable', date: 'Quarterly', location: 'Major Cities' }
]

const channelsGrid = ref(null)

const handleMouseMove = (e) => {
  if (!channelsGrid.value) return
  const cards = channelsGrid.value.querySelectorAll('.channel-card')
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

.community-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
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
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #3b82f6;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 4rem;
}

.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.stat-bubble { display: flex; flex-direction: column; }
.stat-value { font-size: 3rem; font-weight: 900; color: white; line-height: 1; }
.stat-label { font-size: 0.8rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; }
.stat-separator { width: 1px; height: 50px; background: rgba(255,255,255,0.1); }

/* Channels Section */
.channels-section { padding: 8rem 5%; }
.centered { text-align: center; margin-bottom: 6rem; }
.detail-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
}

.section-title { font-size: 3.5rem; font-weight: 850; }

.channels-grid {
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

.channel-card {
  padding: 4rem 3rem;
  flex: 1 1 350px;
  max-width: 400px;
  text-align: center;
}

.channel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.2;
}

.channel-card:hover {
  transform: translateY(-10px);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.channel-card:hover .card-glow { opacity: 1; }

.channel-icon {
  width: 64px;
  height: 64px;
  color: #3b82f6;
  margin: 0 auto 2.5rem;
}

.channel-card h3 { font-size: 1.75rem; font-weight: 850; margin-bottom: 1.25rem; }
.channel-card p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 3rem; }

.secondary-btn.luxe {
  padding: 0.9rem 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-weight: 800;
  color: white;
  transition: 0.3s;
}

.secondary-btn.luxe:hover {
  background: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

/* Events Section */
.events-section { padding: 10rem 5%; background: rgba(0,0,0,0.2); }
.events-box {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 6rem;
  align-items: center;
}

.events-text p { font-size: 1.25rem; color: var(--text-secondary); line-height: 1.7; margin-top: 1.5rem; }

.events-list { display: grid; gap: 1.5rem; }
.event-item {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 3rem;
  cursor: pointer;
}

.event-date-box { min-width: 140px; }
.event-date { font-size: 1.2rem; font-weight: 900; color: #3b82f6; }

.event-info h4 { font-size: 1.5rem; font-weight: 850; margin-bottom: 0.5rem; }
.event-loc { color: var(--text-secondary); font-size: 1rem; opacity: 0.7; }

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

.blue-aura::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 120%, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
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
  line-height: 1;
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

@media (max-width: 1024px) {
  .events-box { grid-template-columns: 1fr; gap: 4rem; }
  .channel-card { flex: 1 1 100%; }
}

@media (max-width: 768px) {
  .stats-row { flex-direction: column; gap: 2rem; }
  .stat-separator { display: none; }
  .event-item { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 2rem; }
  .event-date-box { min-width: auto; }
  .cta-luxe-card { padding: 5rem 2rem; border-radius: 30px; }
  .cta-luxe-title { font-size: 2.5rem; }
  .btn-luxe-primary { width: 100%; justify-content: center; }
}
</style>
