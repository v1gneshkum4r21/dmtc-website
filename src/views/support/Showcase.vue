<template>
  <div class="showcase-container">
    <!-- Compact Header -->
    <div class="showcase-header">
      <div class="header-content">
        <h1>Creative <span class="gradient-text">Showcase</span></h1>
        <p>Explore stunning creations powered by Dreamactic AI</p>
      </div>
      
      <!-- Compact Filters -->
      <div class="filter-bar">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          :class="['filter-chip', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- Masonry Gallery -->
    <div class="gallery-masonry">
      <div v-if="loading" class="loading-state">
        <div v-for="n in 8" :key="n" class="skeleton-card"></div>
      </div>
      
      <template v-else>
        <GalleryItem 
          v-for="item in filteredItems" 
          :key="item._id"
          :data="item"
          @click="openModal"
        />
      </template>
    </div>

    <!-- Modal Viewer -->
    <div v-if="selectedItem" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="modal-image">
          <img v-if="selectedItem.mediaType === 'image'" :src="selectedItem.mediaUrl" :alt="selectedItem.title" />
          <video v-else :src="selectedItem.mediaUrl" controls autoplay muted></video>
        </div>
        <div class="modal-info">
          <h2>{{ selectedItem.title }}</h2>
          <div v-if="selectedItem.description" class="modal-description">
            {{ selectedItem.description }}
          </div>
          <div class="modal-meta">
            <div class="meta-item">
              <span class="meta-label">Product</span>
              <span class="meta-value">{{ selectedItem.product }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Category</span>
              <span class="meta-value">{{ selectedItem.tag }}</span>
            </div>
          </div>
          <div class="modal-stats">
            <div class="stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{{ selectedItem.likes || 0 }} likes</span>
            </div>
            <div class="stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>{{ selectedItem.views || 0 }} views</span>
            </div>
          </div>
          <button class="share-btn" @click="handleShareClick">
            Share Your Work
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { showcaseAPI } from '@/services/api'
import GalleryItem from '@/components/GalleryItem.vue'

const openContactModal = inject('openContactModal')
const activeFilter = ref('all')
const selectedItem = ref(null)
const showcaseItems = ref([])
const loading = ref(true)

const filters = [
  { id: 'all', name: 'All' },
  { id: 'SuperFiitter', name: 'SuperFiitter' },
  { id: 'EchoAI', name: 'EchoAI' },
  { id: 'images', name: 'Images' },
  { id: 'videos', name: 'Videos' }
]

const filteredItems = computed(() => {
  let items = showcaseItems.value
  
  if (activeFilter.value === 'all') return items
  if (activeFilter.value === 'images') return items.filter(item => item.mediaType === 'image')
  if (activeFilter.value === 'videos') return items.filter(item => item.mediaType === 'video')
  
  return items.filter(item => item.product === activeFilter.value)
})

const fetchShowcase = async () => {
  loading.value = true
  try {
    showcaseItems.value = await showcaseAPI.getAll()
  } catch (err) {
    console.error('Failed to fetch showcase:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (item) => {
  selectedItem.value = item
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedItem.value = null
  document.body.style.overflow = 'auto'
}

const handleShareClick = () => {
  closeModal()
  openContactModal()
}

onMounted(() => {
  window.scrollTo(0, 0)
  fetchShowcase()
})
</script>

<style scoped>
.showcase-container {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  padding-top: 100px;
}

/* Header */
.showcase-header {
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem 5% 2rem;
}

.header-content {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-content h1 {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-content p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Filters */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 0.6rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 100px;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.filter-chip.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-color: transparent;
}

/* Masonry Gallery */
.gallery-masonry {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 5%;
  column-count: 4;
  column-gap: 1.5rem;
}

/* Loading State */
.loading-state {
  column-count: inherit;
  column-gap: inherit;
  width: 100%;
}

.skeleton-card {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  height: 400px;
  background: linear-gradient(90deg, #1a1a1e 25%, #2a2a2e 50%, #1a1a1e 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 20px;
}

.skeleton-card:nth-child(2n) { height: 300px; }
.skeleton-card:nth-child(3n) { height: 500px; }

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  max-width: 1200px;
  width: 100%;
  background: var(--bg-secondary);
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  max-height: 90vh;
  position: relative;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background: #000;
  overflow: hidden;
}

.modal-image img,
.modal-image video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-play {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-play:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.85);
}

.video-play svg {
  margin-left: 5px;
}

.modal-info {
  padding: 3rem;
  overflow-y: auto;
}

.modal-info h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.modal-description {
  color: #9ca3af;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-meta {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--grid-color);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat svg {
  width: 20px;
  height: 20px;
  color: #8b5cf6;
}

.share-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

/* Responsive */
@media (max-width: 1400px) {
  .gallery-masonry { column-count: 3; }
}

@media (max-width: 1024px) {
  .gallery-masonry { column-count: 2; }
  .modal-content { grid-template-columns: 1fr; }
  .modal-image { min-height: 400px; }
}

@media (max-width: 768px) {
  .header-content h1 { font-size: 2.5rem; }
  .gallery-masonry { column-count: 1; padding: 1rem 3%; }
  .filter-bar { padding: 0 3%; }
}
</style>
