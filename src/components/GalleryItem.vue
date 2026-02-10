<template>
  <div 
    class="gallery-item" 
    :class="[
      `size-${data.size || 'medium'}`,
      { 'is-video': data.mediaType === 'video' }
    ]"
    @click="$emit('click', data)"
  >
    <div class="item-inner">
      <div class="item-media">
        <template v-if="data.mediaType === 'video'">
          <!-- Video element with poster -->
          <video 
            ref="videoRef"
            :src="data.mediaUrl" 
            muted 
            loop 
            playsinline 
            class="media-content"
            @mouseenter="playVideo"
            @mouseleave="pauseVideo"
          ></video>
          <div class="video-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M8 5v14l11-7z"/>
            </svg>
            VIDEO
          </div>
        </template>
        <template v-else>
          <img 
            :src="data.mediaUrl" 
            :alt="data.title" 
            loading="lazy" 
            class="media-content"
          />
        </template>
      </div>

      <div class="item-overlay">
        <div class="overlay-top">
          <span class="product-badge">{{ data.product }}</span>
        </div>
        <div class="overlay-bottom">
          <h3 class="item-title">{{ data.title }}</h3>
          <div class="item-metadata">
            <span class="tag">#{{ data.tag }}</span>
            <div class="stats">
              <span class="stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ data.likes || 0 }}
              </span>
              <span class="stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ data.views || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const videoRef = ref(null)

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play().catch(e => console.log("Autoplay prevented"))
  }
}

const pauseVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
}
</script>

<style scoped>
.gallery-item {
  width: 100%;
  break-inside: avoid;
  margin-bottom: 24px;
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: var(--bg-secondary);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Dynamic Sizes */
.size-small { height: 280px; }
.size-medium { height: 400px; }
.size-large { height: 560px; }

.item-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.item-media {
  width: 100%;
  height: 100%;
  position: relative;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.gallery-item:hover .media-content {
  transform: scale(1.05);
}

.video-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Overlay Styling */
.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .item-overlay {
  opacity: 1;
}

.overlay-top {
  display: flex;
  justify-content: flex-end;
}

.product-badge {
  background: rgba(139, 92, 246, 0.2);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.4);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.overlay-bottom {
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.gallery-item:hover .overlay-bottom {
  transform: translateY(0);
}

.item-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.item-metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  font-weight: 600;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Support for Firefox and Safari */
@supports not (inset: 0) {
  .item-overlay {
    top: 0; right: 0; bottom: 0; left: 0;
  }
}
</style>
