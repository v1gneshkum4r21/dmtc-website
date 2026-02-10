<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="page-hero community-hero">
      <div class="hero-content">
        <div class="hero-badge">OUR COMMUNITY</div>
        <h1 class="page-title">Join the <span class="text-gradient">Agentic AI</span> Community</h1>
        <p class="page-description">
          Connect with 50,000+ developers, researchers, and AI practitioners building the future of enterprise automation. Share knowledge, collaborate on projects, and get support from both our team and the community.
        </p>
        <div class="stats-row">
          <div class="stat-bubble">
            <strong>50k+</strong>
            <span>Active Developers</span>
          </div>
          <div class="stat-bubble">
            <strong>200+</strong>
            <span>Enterprise Deployments</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Channels Section -->
    <section class="channels-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">CHANNELS</span>
          <h2>Where We <span class="text-gradient">Connect</span></h2>
        </div>
        <div class="channels-grid">
          <div v-for="channel in channels" :key="channel.name" class="channel-card">
            <div class="channel-icon" v-html="channel.icon"></div>
            <h3>{{ channel.name }}</h3>
            <p>{{ channel.desc }}</p>
            <button class="secondary-btn">{{ channel.action }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="section-container">
        <div class="events-box">
          <div class="events-text">
            <span class="section-tag">EVENTS</span>
            <h2>Global <span class="text-gradient">Meetups</span></h2>
            <p>From technical webinars to in-person orchestration hackathons, we are building a global network of agentic experts.</p>
          </div>
          <div class="events-list">
             <div v-for="event in events" :key="event.title" class="event-item">
               <span class="event-date">{{ event.date }}</span>
               <div class="event-info">
                 <h4>{{ event.title }}</h4>
                 <span>{{ event.location }}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Ready to join the <span class="text-gradient">Swarm</span>?</h2>
          <div class="cta-buttons">
            <button class="primary-btn">
              Join Discord
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
import { onMounted } from 'vue'

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

.community-hero::before {
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
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, #3b82f6 100%);
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

.stats-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.stat-bubble {
  display: flex;
  flex-direction: column;
}

.stat-bubble strong {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
}

.stat-bubble span {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

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

/* Channels */
.channels-section {
  padding: 8rem 5%;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-header h2 {
  font-size: 3.5rem;
  font-weight: 850;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.channel-card {
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 32px;
  border: 1px solid var(--grid-color);
  transition: all 0.4s ease;
  text-align: center;
}

.channel-card:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
}

.channel-icon {
  width: 56px;
  height: 56px;
  color: #3b82f6;
  margin: 0 auto 2.5rem;
}

.channel-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.channel-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.secondary-btn {
  padding: 0.8rem 2rem;
  background: var(--bg-primary);
  border: 1px solid var(--grid-color);
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

/* Events Box */
.events-section {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.events-box {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 6rem;
  align-items: center;
}

.events-text h2 {
  font-size: 3.5rem;
  font-weight: 850;
  margin-bottom: 2rem;
}

.events-text p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.event-item {
  padding: 2.5rem 3rem;
  background: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--grid-color);
  display: flex;
  align-items: center;
  gap: 3rem;
}

.event-date {
  font-size: 1.1rem;
  font-weight: 900;
  color: #3b82f6;
  min-width: 120px;
}

.event-info h4 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.event-info span {
  color: var(--text-secondary);
  font-size: 0.95rem;
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
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
}

@media (max-width: 1024px) {
  .channels-grid { grid-template-columns: 1fr; }
  .events-box { grid-template-columns: 1fr; }
  .event-item { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .page-title { font-size: 3.5rem; }
}
</style>
