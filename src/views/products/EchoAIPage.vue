<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="premium-hero echoai-gradient">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">AI VOICE & AUTONOMOUS AGENTS</span>
        </div>
        <h1 class="hero-title">EchoAI <span class="text-gradient">Voice Intelligence</span></h1>
        <p class="hero-subtitle">
          The next evolution in voice intelligence and autonomous BPO automation. 
          Deploy self-learning voice agents that handle complex conversational workflows with human-parity precision.
        </p>

        <div class="hero-actions">
          <button class="primary-btn" @click="scrollToSolutions">
            Get Started
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Trust / Integration Bar -->
    <section class="trust-bar">
      <p class="trust-label">POWERING THE GLOBAL COMMUNICATIONS PIPELINE</p>
      <div class="marquee-container">
        <div class="marquee-content" :style="{ '--item-count': ecosystem.length }">
          <div v-for="(item, index) in [...ecosystem, ...ecosystem, ...ecosystem]" :key="index" class="ecosystem-item">
            <div class="ecosystem-icon" v-html="item.icon" :style="{ color: item.color }"></div>
            <span class="ecosystem-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions Explorer (Replacing Capabilities) -->
    <section class="solutions-explorer" ref="solutionsSection">
      <div class="section-container">
        <div class="section-header centered" ref="solutionsHeader">
          <div class="detail-badge">THE PLATFORM</div>
          <h2>Intelligent <span class="text-gradient">Automation</span></h2>
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
                '--card-accent': solution.accent 
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
          <div class="detail-badge">INNOVATION</div>
          <h2>Intelligence in <span class="text-gradient">Motion</span></h2>
          <p>Read our latest breakthroughs in multi-modal learning and automated production.</p>
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
          <h2>Revolutionize your <span class="text-gradient">Voice Operations</span></h2>
          <p class="cta-subtitle">Deploy high-performance voice intelligence that powers the next generation of digital enterprise.</p>
          <div class="cta-buttons">
            <button class="primary-btn" @click="openContactModal">
              Book a Strategy Call
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
import { ref, inject, onMounted } from 'vue'

const openContactModal = inject('openContactModal')

const ecosystem = [
  { name: 'OpenAI', color: '#412991', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>' },
  { name: 'Google Cloud', color: '#4285F4', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.92 1C5.89 1 1 5.89 1 11.92c0 2.5 1.01 4.76 2.65 6.47l2.12-2.12c-1.1-1.16-1.78-2.69-1.78-4.35 0-3.53 2.87-6.4 6.4-6.4 3.53 0 6.4 2.87 6.4 6.4 0 3.53-2.87 6.4-6.4 6.4-1.71 0-3.3-.7-4.46-1.84l-2.12 2.12c1.76 1.76 4.19 2.84 6.87 2.84 5.8 0 10.5-4.7 10.5-10.5S17.72 1 11.92 1zM7 11h2v2H7z"/></svg>' },
  { name: 'AWS', color: '#FF9900', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l1.65 6.07 6.13-.53-4.63 4.13 1.34 6.06L12 14.1l-4.49 3.13 1.34-6.06-4.63-4.13 6.13.53L12 1.5M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12"/></svg>' },
  { name: 'Azure AI', color: '#0078D4', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.4 18.9L11 3h2l5.6 15.9h-2.3L15.2 16H8.8l-1.1 2.9H5.4zm3.9-4.7h5.4L12 6.3l-2.7 7.9z"/></svg>' },
  { name: 'Twilio', color: '#F22F46', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>' },
  { name: 'WebRTC', color: '#333333', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>' },
  { name: 'Deepgram', color: '#13EF93', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 12l3-3 3 3-3 3-3-3z" fill="#000"/></svg>' },
  { name: 'AssemblyAI', color: '#563CDE', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5L18.5 20H5.5L12 6.5z"/></svg>' },
  { name: 'Stripe', color: '#008CDD', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-7.07-1.855l-.907 5.626c1.472.585 3.785.97 6.479.97 2.651 0 4.88-.636 6.452-1.923 1.528-1.258 2.296-3.047 2.296-5.322 0-3.929-2.28-5.656-6.425-7.151z"/></svg>' },
  { name: 'Node.js', color: '#339933', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5L2.25 7.14v10.72L12 23.5l9.75-5.64V7.14L12 1.5zM12 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>' },
  { name: 'Redis', color: '#DC382D', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 2.661l.54.997-1.797.644 2.409.218.748 1.246.467-1.121 2.077-.208-1.61-.613.426-1.017-1.578.519zm6.905 2.077L13.76 6.182l3.292 1.298.353-.146 3.293-1.298zm-10.51.312a2.97 1.153 0 0 0-2.97 1.152 2.97 1.153 0 0 0 2.97 1.153 2.97 1.153 0 0 0-2.97-1.153z"/></svg>' },
  { name: 'Docker', color: '#2496ED', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.186.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>' },
  { name: 'Kubernetes', color: '#326CE5', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l1.65 6.07 6.13-.53-4.63 4.13 1.34 6.06L12 14.1l-4.49 3.13 1.34-6.06-4.63-4.13 6.13.53L12 1.5M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12"/></svg>' }
]

const solutions = [
  { 
    id: 1, 
    title: 'AI Voice Calling', 
    subtitle: 'Human Parity',
    description: 'Ultra-low latency, human-parity voice synthesis for high-volume customer support operations.',
    features: ['<500ms Latency', 'Multi-speaker Support', 'Emotion synthesis'],
    accent: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
  },
  { 
    id: 2, 
    title: 'Autonomous Agents', 
    subtitle: 'Reasoning Engine',
    description: 'Context-aware reasoning engines that handle complex multi-turn inquiries independently.',
    features: ['Memory persistence', 'Goal-oriented', 'Self-correction'],
    accent: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
  },
  { 
    id: 3, 
    title: 'Enterprise Sync', 
    subtitle: 'Integration',
    description: 'Unified task orchestration that replaces manual processes with intelligent agent chains.',
    features: ['CRM Integration', 'Live Data Sync', 'Secure Handoff'],
    accent: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
  },
  { 
    id: 4, 
    title: 'Sentiment Analysis', 
    subtitle: 'Real-time Intelligence',
    description: 'Live monitoring of conversation sentiment with automated escalation and risk detection.',
    features: ['Live Dashboard', 'Risk Alerts', 'Trend Analysis'],
    accent: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  }
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

// Insights logic
import { insightsAPI } from '@/services/api'
const insights = ref([])
const selectedInsight = ref(null)

const openInsight = (insight) => {
  selectedInsight.value = insight
  document.body.style.overflow = 'hidden'
}

const closeInsight = () => {
  selectedInsight.value = null
  document.body.style.overflow = 'auto'
}

const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
const formatContent = (c) => c ? c.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') : ''

onMounted(async () => {
  window.scrollTo(0, 0)
  try {
    // Attempt to load insights for 'echoai' (or fallback to 'ai-service' or similar if none yet)
    insights.value = await insightsAPI.getAll('echo-ai')  
  } catch (err) {
    console.error('Failed to load insights:', err)
  }
})
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

.echoai-gradient::before {
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

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.primary-btn:hover::before {
  left: 100%;
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
  animation: marquee 60s linear infinite;
  padding: 1.5rem 2rem;
  width: max-content;
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
  background: rgba(59, 130, 246, 0.03);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
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
  100% { transform: translateX(-50%); }
}

/* Solutions Explorer */
.solutions-explorer {
  padding: 0 5% 5rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
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
  background: #3b82f6;
  border-color: #3b82f6;
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
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
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
  box-shadow: var(--shadow-md), 0 0 20px rgba(59, 130, 246, 0.1);
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
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.8;
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
  color: var(--card-accent);
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
  border-color: #3b82f6;
}

.insight-image {
  aspect-ratio: 16/9;
  background: var(--bg-secondary);
  position: relative;
}

.placeholder-img {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.insight-card:hover .card-img {
  transform: scale(1.05);
}

.insight-body {
  padding: 2rem;
}

.insight-meta {
  font-size: 0.75rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.insight-body h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.insight-body p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  padding: 0.6rem 1.25rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.insight-card:hover .read-btn {
  background: white;
  color: black;
  border-color: white;
}

/* Insight Modal */
.insight-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.insight-modal-content {
  background: #0f0f11;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 32px;
  border: 1px solid var(--glass-border);
  padding: 4rem;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
}

.close-modal-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: #3b82f6;
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
  color: #3b82f6;
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
  font-size: 1.1rem;
}

/* Page CTA */
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
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 3.5rem;
  color: var(--text-primary);
  font-weight: 850;
  margin-bottom: 3rem;
  line-height: 1.1;
  position: relative;
  z-index: 1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .solutions-grid { grid-template-columns: repeat(2, 1fr); }
  .insights-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 3.5rem; }
  .cta-card { padding: 4rem 2rem; }
  .cta-card h2 { font-size: 2.5rem; }
}

@media (max-width: 768px) {
  .solutions-explorer { padding: 0 5% 3rem; }

  .carousel-nav {
    display: flex;
  }
  
  .solutions-grid { 
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1.5rem;
    padding: 0 1rem;
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
    padding: 2rem;
  }

  .cta-card { padding: 4rem 2rem; }
  .cta-buttons { flex-direction: column; }
  .primary-btn { width: 100%; justify-content: center; }
}
</style>
