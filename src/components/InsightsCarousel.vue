
<template>
  <div class="insights-carousel-wrapper">
    <!-- Carousel Controls -->
    <div class="carousel-controls">
      <button class="nav-btn prev" @click="scroll('left')" :disabled="isAtStart" aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="nav-btn next" @click="scroll('right')" :disabled="isAtEnd" aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Scroll Container -->
    <div 
      class="insights-carousel" 
      ref="carouselRef"
      @scroll="handleScroll"
    >
      <div 
        v-for="insight in insights" 
        :key="insight._id" 
        class="insight-card-item" 
        @click="$emit('open-insight', insight)"
      >
        <div class="insight-card-inner">
          <div class="insight-image-box">
            <img v-if="insight.imageUrl" :src="insight.imageUrl" :alt="insight.title" loading="lazy" />
            <div v-else class="placeholder-img"></div>
            <div class="card-overlay">
              <span class="read-more">Read Insight</span>
            </div>
          </div>
          <div class="insight-content-box">
            <div class="insight-meta-date">
              <span class="dot"></span>
              {{ formatDate(insight.createdAt) }}
            </div>
            <h3>{{ insight.title }}</h3>
            <p>{{ insight.excerpt }}</p>
            <div class="card-footer">
              <span class="team-badge">DREAMACTIC Research</span>
              <div class="arrow-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  insights: {
    type: Array,
    required: true
  }
})

defineEmits(['open-insight'])

const carouselRef = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const scroll = (direction) => {
  if (!carouselRef.value) return
  const scrollAmount = carouselRef.value.offsetWidth * 0.8
  const left = direction === 'left' ? -scrollAmount : scrollAmount
  carouselRef.value.scrollBy({ left, behavior: 'smooth' })
}

const handleScroll = () => {
  if (!carouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  isAtStart.value = scrollLeft <= 10
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recent'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Check scroll position on window resize
const checkScroll = () => {
  handleScroll()
}

onMounted(() => {
  window.addEventListener('resize', checkScroll)
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>

<style scoped>
.insights-carousel-wrapper {
  position: relative;
  width: 100%;
  margin-top: 2rem;
}

.carousel-controls {
  position: absolute;
  top: -80px;
  right: 0;
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover:not(:disabled) {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.insights-carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  gap: 2rem;
  padding: 1rem 0 3rem;
  margin: 0 -1rem;
}

.insights-carousel::-webkit-scrollbar {
  display: none;
}

.insight-card-item {
  flex: 0 0 calc(33.333% - 1.35rem);
  scroll-snap-align: start;
  cursor: pointer;
}

.insight-card-inner {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.insight-card-item:hover .insight-card-inner {
  transform: translateY(-12px);
  border-color: var(--accent-primary);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.insight-image-box {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.insight-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.insight-card-item:hover .insight-image-box img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.insight-card-item:hover .card-overlay {
  opacity: 1;
}

.read-more {
  padding: 0.8rem 1.5rem;
  background: white;
  color: black;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.9rem;
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.insight-card-item:hover .read-more {
  transform: translateY(0);
}

.insight-content-box {
  padding: 2.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.insight-meta-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent-primary);
  border-radius: 50%;
}

.insight-content-box h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.insight-card-item:hover h3 {
  color: var(--accent-primary);
}

.insight-content-box p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.team-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-primary);
  letter-spacing: 0.1em;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: transform 0.3s ease, color 0.3s ease;
}

.insight-card-item:hover .arrow-icon {
  transform: translateX(5px);
  color: var(--accent-primary);
}

/* Responsiveness */
@media (max-width: 1200px) {
  .insight-card-item {
    flex: 0 0 calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .carousel-controls {
    top: auto;
    bottom: -60px;
    right: 50%;
    transform: translateX(50%);
  }
  
  .insight-card-item {
    flex: 0 0 85%;
    scroll-snap-align: center;
  }
  
  .insights-carousel {
    padding: 1rem 1rem 3rem;
  }
  
  .insight-content-box {
    padding: 1.75rem;
  }
  
  .insight-content-box h3 {
    font-size: 1.35rem;
  }
}
</style>
