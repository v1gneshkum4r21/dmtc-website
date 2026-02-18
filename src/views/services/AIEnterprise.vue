<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="premium-hero">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">AI FOR ENTERPRISE</span>
        </div>
        <h1 class="hero-title">Omniscient Scale: The <span class="text-gradient">Self-Driving Enterprise</span></h1>
        <p class="hero-subtitle">
          Engineered for global leaders. Orchestrate billions of parameters with enterprise-grade security, multi-agent swarms, and sovereign infrastructure that evolves with your business logic.
        </p>
        <div class="hero-actions">
          <button class="primary-btn" @click="scrollToSolutions">
            Explore Solutions
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Trust / Integration Bar -->
    <section class="trust-bar">
      <p class="trust-label">CERTIFIED & INTEGRATED GLOBAL INFRASTRUCTURE</p>
      <div class="marquee-container">
        <div class="marquee-content" :style="{ '--item-count': ecosystem.length }">
          <div v-for="(item, index) in [...ecosystem, ...ecosystem, ...ecosystem]" :key="index" class="ecosystem-item">
            <div class="ecosystem-icon" v-html="item.icon" :style="{ color: item.color }"></div>
            <span class="ecosystem-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filterable Solutions Grid -->
    <section class="solutions-explorer" ref="solutionsSection">
      <div class="section-container">
        <div class="section-header centered" ref="solutionsHeader">
          <div class="detail-badge">SOLUTIONS</div>
          <h2>Enterprise-Grade <span class="text-gradient">Neural Core</span></h2>
        </div>

        <div class="solutions-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollSolutions('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div class="solutions-grid" ref="solutionsGrid" @mousemove="handleMouseMove">
            <div 
              v-for="solution in solutions" 
              :key="solution.id" 
              class="solution-card"
              :style="{ 
                '--card-accent': solution.accent,
                '--card-color': solution.color 
              }"
            >
              <div class="card-glow"></div>
              <div class="sol-header">
                <h3>{{ solution.title }}</h3>
                <div class="sol-subtitle">{{ solution.subtitle }}</div>
              </div>
              <p class="sol-description">{{ solution.description }}</p>
              <ul class="sol-features">
                <li v-for="(feature, index) in solution.features" :key="index">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <div class="sol-footer">
                <span class="view-details">Explore</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollSolutions('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Insights Section -->
    <section class="insights-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">INSIGHTS</div>
          <h2>Global <span class="text-gradient">Impact</span></h2>
          <p>Analyzing the shift from manual oversight to sovereign AI governance in Fortune 500 enterprises.</p>
        </div>

        <div class="insights-grid">
          <div v-for="insight in insights" :key="insight._id" class="insight-card" @click="openInsight(insight)">
            <div class="insight-image">
              <img v-if="insight.imageUrl" :src="insight.imageUrl" :alt="insight.title" class="card-img" />
              <div v-else class="placeholder-img"></div>
            </div>
            <div class="insight-body">
              <div class="insight-meta">Published: {{ formatDate(insight.createdAt) }}</div>
              <h3>{{ insight.title }}</h3>
              <p>{{ insight.excerpt }}</p>
              <button class="read-btn">Read Article</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Insight Reader Modal -->
      <Transition name="fade-in">
        <div v-if="selectedInsight" class="insight-modal-overlay" @click.self="closeInsight">
          <div class="insight-modal-content">
            <button class="close-modal-btn" @click="closeInsight">×</button>
            
            <div class="modal-header">
              <div class="modal-meta">Published: {{ formatDate(selectedInsight.createdAt) }}</div>
              <h2 class="modal-title">{{ selectedInsight.title }}</h2>
              <div class="modal-author">By {{ selectedInsight.author || 'DREAMATIC Team' }}</div>
            </div>

            <div class="modal-image" v-if="selectedInsight.imageUrl">
              <img :src="selectedInsight.imageUrl" :alt="selectedInsight.title" />
            </div>

            <div class="modal-body">
              <div class="insight-full-content" v-html="formatContent(selectedInsight.content)"></div>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Secure the Future of Your <span class="text-gradient">Empire</span></h2>
          <p>Deployment engineers are standing by for consultation on custom weights, private cloud architecture, and cross-border data compliance.</p>
          <div class="cta-actions">
            <button class="primary-btn">Start Full Platform Trial</button>
            <button class="secondary-btn">Schedule Vision Demo</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { insightsAPI } from '@/services/api'

const ecosystem = [
  { name: 'SAP S/4HANA', color: '#008FD3', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"/></svg>' },
  { name: 'Oracle Cloud', color: '#F80000', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 1.999c-5.522 0-9.999 4.477-9.999 9.999s4.477 9.999 9.999 9.999 9.999-4.477 9.999-9.999-4.477-9.999-9.999-9.999zm0 16.5c-3.59 0-6.5-2.91-6.5-6.501s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.501-6.5 6.501z"/></svg>' },
  { name: 'Salesforce Core', color: '#00A1E0', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"/></svg>' },
  { name: 'ServiceNow', color: '#293E40', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L24 6.928V20.785L12 27.713L0 20.785V6.928L12 0Z"/></svg>' },
  { name: 'IBM Watson', color: '#0530AD', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' },
  { name: 'Snowflake Governance', color: '#29B5E8', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.732 6v12L12 24l10.268-6V6L12 0z"/></svg>' },
  { name: 'Palantir Apollo', color: '#000000', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>' },
  { name: 'Microsoft Azure GCC', color: '#0089D6', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32m-3.084-12.531 3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76a1.722 1.722 0 0 0-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684"/></svg>' }
]

const solutionsGrid = ref(null)

const handleMouseMove = (e) => {
  if (!solutionsGrid.value) return
  const cards = solutionsGrid.value.querySelectorAll('.solution-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  })
}

const scrollSolutions = (direction) => {
  if (!solutionsGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  solutionsGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const solutionsHeader = ref(null)

const scrollToSolutions = () => {
  if (!solutionsHeader.value) return
  const headerPosition = solutionsHeader.value.getBoundingClientRect().top
  const offsetPosition = headerPosition + window.pageYOffset - 100
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
}

const solutions = [
  { 
    id: 1, 
    title: 'Visualizer', 
    subtitle: 'Data Imaging',
    description: 'Transform complex enterprise data into hyper-immersive visual narratives. Real-time rendering of large-scale dataset structures.',
    features: ['Infinite zoom rendering', 'Neural voxel clusters', 'Interactive data topology'],
    accent: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#10B981'
  },
  { 
    id: 2, 
    title: '3D Design', 
    subtitle: 'Spatial Intelligence',
    description: 'Automated 3D environment generation for product simulation, architectural pre-viz, and industrial digital twins.',
    features: ['Physics-aware synthesis', 'LIDAR-to-Mesh pipeline', 'Real-time Raytracing'],
    accent: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#3B82F6'
  },
  { 
    id: 3, 
    title: 'Real Estate', 
    subtitle: 'Property Intelligence',
    description: 'Global property analysis and photorealistic virtual staging agents that scale property management across continents.',
    features: ['Automated valuation swarms', 'Virtual light simulation', 'Market sentiment mapping'],
    accent: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    color: '#F59E0B'
  },
  { 
    id: 4, 
    title: 'Virtual Tour', 
    subtitle: 'Mapping & Telepresence',
    description: 'Deploy 6DOF immersive tours for industrial sites, retail showrooms, and distributed headquarters with neural stitching.',
    features: ['6-Degrees of Freedom', 'Neural point cloud sync', 'Multi-user telepresence'],
    accent: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: '#8B5CF6'
  },
  { 
    id: 5, 
    title: 'Interior AI', 
    subtitle: 'Smart Design Systems',
    description: 'Autonomous spatial planning for enterprise offices, retail layouts, and industrial floor optimization using generative logic.',
    features: ['Constraint-based routing', 'Ergonomic heatmaps', 'Auto-material sourcing'],
    accent: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    color: '#06B6D4'
  },
  { 
    id: 6, 
    title: 'Planning', 
    subtitle: 'Strategy & Orchestration',
    description: 'High-level multi-agent orchestration for corporate strategy, board-level forecasting, and scenario modeling.',
    features: ['Monte Carlo swarms', 'Competitive game theory', 'Recursive goal planning'],
    accent: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    color: '#EC4899'
  },
  { 
    id: 7, 
    title: 'Finance AI', 
    subtitle: 'Risk & Forecasting',
    description: 'Sovereign financial models for real-time risk assessment, automated hedging, and synthetic market simulations.',
    features: ['Predictive liquidity', 'Neural fraud detection', 'Zero-latency execution'],
    accent: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    color: '#14B8A6'
  },
  { 
    id: 8, 
    title: 'Logistics', 
    subtitle: 'Neural Routing',
    description: 'Autonomous global supply chain routing. Agent swarms that manage port delays, fuel optimization, and fleet logic.',
    features: ['Dynamic pathfinding', 'Fleet consciousness', 'Intermodal sync'],
    accent: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
    color: '#4F46E5'
  }
]

const insights = ref([])
const insightsLoading = ref(false)
const selectedInsight = ref(null)

const openInsight = (insight) => {
  selectedInsight.value = insight
  document.body.style.overflow = 'hidden'
}

const closeInsight = () => {
  selectedInsight.value = null
  document.body.style.overflow = 'auto'
}

const formatContent = (content) => {
  if (!content) return ''
  return content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
}

onMounted(async () => {
  insightsLoading.value = true
  try {
    insights.value = await insightsAPI.getAll('ai-enterprise')
    if (insights.value.length === 0) {
       insights.value = [
         {
           _id: 'ent-1',
           title: 'The Sovereign Intelligence Whitepaper',
           excerpt: 'How global enterprises are building private clouds for AI weight autonomy and data sovereignty.',
           createdAt: new Date().toISOString(),
           author: 'DREAMATIC Research',
           imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
         },
         {
           _id: 'ent-2',
           title: 'Multi-Agent Swarms in Logistics',
           excerpt: 'Case study on deep neural routing for cross-border supply chain optimization.',
           createdAt: new Date().toISOString(),
           author: 'Engineering Team',
           imageUrl: 'https://images.unsplash.com/photo-1580674271209-40b49a2a5a7d?auto=format&fit=crop&q=80&w=800'
         },
         {
           _id: 'ent-3',
           title: 'Predictive Finance AI',
           excerpt: 'Analyzing real-time risk assessment models for large-scale institutional trading.',
           createdAt: new Date().toISOString(),
           author: 'Data Science Division',
           imageUrl: 'https://images.unsplash.com/photo-1611974714158-f899156056b5?auto=format&fit=crop&q=80&w=800'
         }
       ]
    }
  } catch (error) {
    console.error('Failed to load insights:', error)
  } finally {
    insightsLoading.value = false
  }
})


const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.page-container {
  width: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Premium Hero */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #10B981;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.25);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.6s;
  z-index: 2;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.primary-btn:hover::before {
  left: 100%;
}

.secondary-btn {
  padding: 1.25rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--text-primary);
}

/* Trust Bar */
.trust-bar {
  padding: 4rem 0 45px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
  position: relative;
}

.trust-label {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 850;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  opacity: 0.6;
  margin-bottom: 0px;
  text-transform: uppercase;
}

.marquee-container {
  width: 100%;
  display: flex;
  overflow: hidden;
  user-select: none;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  gap: 4rem;
  animation: marquee 40s linear infinite;
  padding: 1.5rem 2rem;
}

.ecosystem-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1.75rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 100px;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0.7;
}

.ecosystem-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.ecosystem-icon :deep(svg) {
  width: 20px;
  height: 20px;
  min-width: 20px;
  flex-shrink: 0;
  stroke-width: 2.5;
  display: block;
}

.ecosystem-item:hover {
  opacity: 1;
  background: rgba(16, 185, 129, 0.03);
  border-color: rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.1);
}

.ecosystem-item:hover .ecosystem-icon {
  transform: scale(1.1);
}

.ecosystem-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-33.333% - 1.333rem)); }
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  max-width: 800px;
  margin-bottom: 6rem;
}

.section-header h2 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.section-header p {
  font-size: 1.3rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Solutions Explorer */
.solutions-explorer {
  padding: 0 5% 5rem;
}

.solutions-carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-nav {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
}

.carousel-nav:hover {
  background: #10B981;
  border-color: #10B981;
}

.carousel-nav:hover svg {
  color: white;
}

.carousel-nav.prev {
  left: -24px;
}

.carousel-nav.next {
  right: -24px;
}

.carousel-nav svg {
  width: 20px;
  height: 20px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.centered {
  text-align: center;
  margin: 0 auto 40px;
}

.detail-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

.solution-card {
  position: relative;
  min-width: 260px;
  padding: 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

/* Holographic Border Effect */
.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: var(--card-accent);
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.4s ease;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--card-accent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.solution-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(16, 185, 129, 0.1);
}

.solution-card:hover::before {
  opacity: 0.8;
}

.solution-card:hover .card-glow {
  opacity: 0.15;
}

.sol-header {
  margin-bottom: 1.25rem;
}

.solution-card h3 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
  background: var(--card-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-height: 3.8rem;
  display: flex;
  align-items: center;
}

.sol-subtitle {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--card-color);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.9;
}

.sol-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
  min-height: 4.5rem;
}

.sol-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 5rem;
}

.sol-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sol-features svg {
  width: 12px;
  height: 12px;
  color: var(--card-color);
  opacity: 1;
  flex-shrink: 0;
}

.sol-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.solution-card:hover .sol-footer {
  opacity: 1;
}

.view-details {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.sol-footer svg {
  width: 14px;
  height: 14px;
  color: var(--text-primary);
}

/* Insights Section */
.insights-section {
  padding: 0 5% 10rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.insight-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s;
  cursor: pointer;
}

.insight-card:hover {
  transform: translateY(-10px);
  border-color: #10B981;
}

.insight-image {
  aspect-ratio: 16/9;
  background: var(--bg-secondary);
  position: relative;
}

.placeholder-img {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.insight-body {
  padding: 2rem;
}

.insight-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.insight-body h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.insight-body p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.read-btn {
  font-weight: 700;
  color: #10B981;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.95rem;
  transition: opacity 0.3s;
}

.read-btn:hover {
  opacity: 0.8;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Modal Styles */
.insight-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.insight-modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 4rem;
  scrollbar-width: thin;
}

.close-modal-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: #10B981;
  color: white;
}

.modal-header {
  margin-bottom: 3rem;
  text-align: center;
}

.modal-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.1;
  font-weight: 850;
}

.modal-author {
  color: #10B981;
  font-weight: 600;
}

.modal-image {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 3rem;
  aspect-ratio: 16/9;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.15rem;
}

.insight-full-content :deep(p) {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .insight-modal-content {
    padding: 2.5rem;
    border-radius: 24px;
  }
  .modal-title {
    font-size: 2rem;
  }
}

/* Page CTA */
.page-cta {
  padding: 0 5% 10rem;
}

.cta-card {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  padding: 6rem;
  text-align: center;
  backdrop-filter: blur(24px);
  position: relative;
  box-shadow: 0 0 100px rgba(16, 185, 129, 0.05);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-card:hover {
  transform: translateY(-8px);
  border-color: rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.3), 
    0 0 120px rgba(16, 185, 129, 0.15),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
}

.cta-content {
  position: relative;
  z-index: 2;
}

/* Glass reflection effect */
.cta-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  transition: 0.75s;
  pointer-events: none;
}

.cta-card:hover::after {
  left: 150%;
}

.cta-card h2, .cta-card p, .cta-card .cta-actions {
  position: relative;
  z-index: 1;
}

.cta-card h2 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 850;
  letter-spacing: -0.04em;
}

.cta-card p {
  font-size: 1.4rem;
  color: var(--text-secondary);
  margin-bottom: 3.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

/* Transitions */
.grid-fade-enter-active, .grid-fade-leave-active {
  transition: all 0.4s ease;
}
.grid-fade-enter-from, .grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-in-enter-active {
  transition: opacity 0.5s ease;
}
.fade-in-enter-from {
  opacity: 0;
}

/* Large Desktop */
@media (max-width: 1200px) {
  .solutions-grid { 
    grid-template-columns: repeat(3, 1fr); 
    gap: 1.75rem;
  }
}

/* Tablet Responsiveness */
@media (max-width: 1024px) {
  .premium-hero { padding: 10rem 5% 6rem; }
  .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); }
  .hero-subtitle { font-size: 1.2rem; }
  .hero-actions { flex-wrap: wrap; }
  
  .insights-grid { grid-template-columns: repeat(2, 1fr); }
  
  .section-header h2 { font-size: 2.8rem; }
}

/* Medium Tablet */
@media (max-width: 900px) {
  .solutions-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem;
  }
  .solution-card {
    padding: 2rem;
  }
  .solution-card h3 {
    font-size: 1.4rem;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .premium-hero { padding: 8rem 5% 5rem; }
  .hero-title { font-size: 2.5rem; line-height: 1.1; }
  .hero-subtitle { font-size: 1.1rem; }
  .hero-actions { 
    flex-direction: column; 
    width: 100%;
  }
  .primary-btn, .secondary-btn {
    width: 100%;
    padding: 1rem 2rem;
  }
  
  .trust-bar { padding: 3rem 5%; }
  
  .solutions-explorer { padding: 6rem 5% 3rem; }
  
  .carousel-nav {
    display: flex;
  }
  
  .solutions-grid { 
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1.5rem;
    padding: 0 2rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    align-items: stretch;
  }
  
  .solutions-grid::-webkit-scrollbar {
    display: none;
  }
  
  .solution-card { 
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2.5rem;
  }
  .solution-card h3 {
    font-size: 1.35rem;
  }
  .sol-description {
    font-size: 0.9rem;
  }
  .sol-features li {
    font-size: 0.85rem;
  }
  
  .insights-section { padding: 3rem 5% 6rem; }
  .insights-grid { grid-template-columns: 1fr; }
  
  .page-cta { padding: 0 5% 6rem; }
  .cta-card { 
    padding: 3rem 2rem; 
    border-radius: 24px;
  }
  .cta-card h2 { font-size: 2rem; }
  .cta-card p { font-size: 1.1rem; }
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .hero-badge { font-size: 0.65rem; padding: 0.4rem 1rem; }
  
  .section-header h2 { font-size: 1.75rem; }
  
  .solution-card {
    padding: 2rem 1.75rem;
  }
  .solution-card h3 {
    font-size: 1.25rem;
  }
  .sol-header {
    padding-bottom: 0.5rem;
  }
  .sol-description {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  .sol-features li {
    font-size: 0.8rem;
    gap: 0.65rem;
  }
  .sol-features svg {
    width: 16px;
    height: 16px;
  }
  
  .cta-card { padding: 2.5rem 1.5rem; }
  .cta-card h2 { font-size: 1.75rem; }
}
</style>
