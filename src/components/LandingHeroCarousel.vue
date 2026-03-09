<template>
  <div class="landing-hero-carousel">
    <!-- Brand Header -->
    <div class="landing-carousel-header">
      <span class="landing-brand-mark">DREAMACTIC</span>
    </div>

    <!-- Watermark Layer -->
    <div class="landing-watermark-layer">
      <h1 class="landing-vertical-watermark">DREAMACTIC</h1>
    </div>

    <!-- Dynamic Layout Stage -->
    <div class="landing-carousel-stage">
      <!-- Carousel Track -->
      <div class="landing-carousel-track">
        <div 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          class="landing-carousel-slide"
          :class="getSlideClass(index)"
          @click="handleSlideClick(index)"
          @mouseenter="stopAutoPlay"
          @mouseleave="startAutoPlay"
        >
          <div class="landing-slide-content-wrapper">
          <div class="landing-slide-video-container">
              <video
                v-if="slide.mediaType !== 'image'"
                :ref="el => videoRefs[index] = el"
                :src="index === currentIndex ? (slide.url || slide.video) : undefined"
                class="landing-slide-video"
                muted
                playsinline
                loop
                preload="none"
              />
              <img
                v-else
                :src="slide.url"
                class="landing-slide-video"
                loading="lazy"
                alt=""
              />
              <div class="landing-slide-overlay" />
            </div>
          </div>
        </div>
      </div>

      <!-- Cinematic Info (Visible for active slide) -->
      <div class="landing-cinematic-info" v-if="slides[currentIndex]">
        <div class="landing-meta-line">
          <span class="landing-slide-number">0{{ currentIndex + 1 }}</span>
          <div class="landing-catalog-separator"></div>
          <span class="landing-total-slides">0{{ slides.length }}</span>
        </div>
        <h2 class="landing-cinematic-title">{{ slides[currentIndex].title }}</h2>
        <p class="landing-cinematic-desc">{{ slides[currentIndex].desc }}</p>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="landing-nav-container left">
      <button class="landing-nav-button" @click="prevSlide" aria-label="Previous slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
    </div>
    <div class="landing-nav-container right">
      <button class="landing-nav-button" @click="nextSlide" aria-label="Next slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

const DEFAULT_SLIDES = [
  { id: 1, mediaType: 'video', url: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4', title: 'Neural Core', desc: 'The heartbeat of synthetic intelligence.' },
  { id: 2, mediaType: 'video', url: 'https://videos.pexels.com/video-files/5377684/5377684-hd_1920_1080_25fps.mp4', title: 'Future Cities', desc: 'Architecting the skyline of tomorrow.' },
  { id: 3, mediaType: 'video', url: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4', title: 'Global Grid', desc: 'Connecting consciousness across the void.' }
];

const slides = ref(DEFAULT_SLIDES);

// Fetch dynamic slides from admin
const fetchSlides = async () => {
  try {
    const res = await fetch('/api/hero-slides');
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;

    // Normalize
    const newSlides = data.map(s => ({
      ...s,
      url: s.url || s.video || '',
      mediaType: s.mediaType || (s.video ? 'video' : 'image'),
      duration: s.duration || 5,
    }));

    // Deep compare to prevent unnecessary state resets
    if (JSON.stringify(newSlides) === JSON.stringify(slides.value)) return;

    slides.value = newSlides;
    
    // Pick up global settings from first slide metadata
    if (data[0]?._globalDuration) globalDuration.value = data[0]._globalDuration;
    if (data[0]?._autoplay !== undefined) isAutoPlaying.value = data[0]._autoplay;
    if (data[0]?._loop !== undefined) loop.value = data[0]._loop;
  } catch (err) {
    // Silence errors to keep experience smooth
  }
};

onMounted(() => {
  fetchSlides().then(() => startAutoPlay());
  // Background check for carousel updates every 60 seconds
  const syncTimer = setInterval(fetchSlides, 60000);
  onUnmounted(() => clearInterval(syncTimer));
});

const currentIndex = ref(0);
const isAutoPlaying = ref(true);
const loop = ref(true);
const globalDuration = ref(5);
const videoRefs = ref([]);
let autoPlayTimeout = null;

const nextSlide = () => {
  if (currentIndex.value < slides.value.length - 1) {
    currentIndex.value++;
  } else if (loop.value) {
    currentIndex.value = 0;
  }
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const handleSlideClick = (index) => {
  if (index !== currentIndex.value) {
    currentIndex.value = index;
  } else if (slides.value[index]?.link) {
    window.open(slides.value[index].link, '_blank');
  }
};

const getSlideClass = (index) => {
  if (index === currentIndex.value) return 'active';
  if (index === (currentIndex.value - 1 + slides.value.length) % slides.value.length) return 'prev';
  if (index === (currentIndex.value + 1) % slides.value.length) return 'next';
  return '';
};

const startAutoPlay = () => {
  stopAutoPlay();
  if (!isAutoPlaying.value || slides.value.length === 0) return;
  
  // If we are at the end and loop is off, don't schedule next
  if (!loop.value && currentIndex.value === slides.value.length - 1) return;

  const slide = slides.value[currentIndex.value];
  const ms = ((slide?.duration) || globalDuration.value) * 1000;
  autoPlayTimeout = setTimeout(() => {
    nextSlide();
    startAutoPlay();
  }, ms);
};

const stopAutoPlay = () => {
  if (autoPlayTimeout) {
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = null;
  }
};

watch(currentIndex, (newIndex) => {
  // Restart the timer on each slide change to use that slide's duration
  startAutoPlay();
  videoRefs.value.forEach((video, index) => {
    if (!video) return;
    if (index === newIndex) {
      // Ensure src is set (reactive binding sets undefined for non-active slides)
      const targetSrc = slides.value[index]?.url || slides.value[index]?.video;
      if (targetSrc && video.src !== targetSrc) {
        video.src = targetSrc;
        video.load();
      }
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });

  // Smart preload: queue the next slide's video to buffer just-in-time
  const nextIndex = (newIndex + 1) % slides.value.length;
  const nextVideo = videoRefs.value[nextIndex];
  if (nextVideo && slides.value[nextIndex]?.mediaType !== 'image') {
    const nextSrc = slides.value[nextIndex]?.url || slides.value[nextIndex]?.video;
    if (nextSrc && !nextVideo.src) {
      nextVideo.preload = 'auto';
      nextVideo.src = nextSrc;
      nextVideo.load();
    }
  }
}, { immediate: true });


onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.landing-hero-carousel {
    position: relative;
    width: 100%;
    height: 100vh;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* Increased minimum padding to 140px to safely clear the floating navbar */
    padding: clamp(140px, 15vh, 180px) 0 2rem 0;
}

@media (max-height: 500px) {
    .landing-hero-carousel {
        /* Reduced padding for ultra-short screens to just clear the navbar */
        padding: 85px 0 1rem 0;
    }
}

.landing-carousel-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* Fluid gap: 1rem on small screens to 3rem on large */
    gap: clamp(1rem, 4vh, 3rem);
    z-index: 10;
    width: 100%;
}

.landing-carousel-track {
    position: relative;
    width: 100%;
    /* Fluid track height scales with viewport width/height */
    /* Fluid track height reduced slightly to 45vh for more breathing room */
    height: clamp(20rem, 45vh, 36.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 100rem;
    z-index: 5;
}

.landing-carousel-slide {
    position: absolute;
    /* Fluid slide dimensions that keep aspect ratio */
    /* Fluid slide dimensions: 40vh multiplier for safer laptop/mobile height */
    width: clamp(18rem, 40vh, 33.75rem);
    height: clamp(18rem, 40vh, 33.75rem);
    border-radius: 20px;
    overflow: hidden;
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
    background: #000;
}

.landing-carousel-slide.prev {
    transform: translateX(-26.25rem) translateZ(-31.25rem) rotateY(20deg) scale(0.85);
    opacity: 0.3;
    z-index: 5;
    filter: blur(8px) brightness(0.6);
}

.landing-carousel-slide.active {
    transform: translateX(0) translateZ(0) rotateY(0) scale(1);
    opacity: 1;
    z-index: 10;
    filter: blur(0) brightness(1);
    box-shadow: 0 60px 120px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.landing-carousel-slide.next {
    transform: translateX(26.25rem) translateZ(-31.25rem) rotateY(-20deg) scale(0.85);
    opacity: 0.3;
    z-index: 5;
    filter: blur(8px) brightness(0.6);
}

.landing-carousel-slide:not(.active):not(.prev):not(.next) {
    transform: translateZ(-62.5rem) scale(0.3);
    opacity: 0;
    pointer-events: none;
}

.landing-slide-content-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.landing-slide-video-container {
    width: 100%;
    height: 100%;
}

.landing-slide-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.landing-slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 50%);
}

.landing-carousel-header {
    position: absolute;
    top: 3rem;
    left: 4.5rem;
    z-index: 20;
}

.landing-brand-mark {
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.5em;
    color: var(--text-secondary);
    opacity: 0.3;
}

.landing-nav-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    padding: 0 4rem;
}

.landing-nav-container.left { left: 0; }
.landing-nav-container.right { right: 0; }

.landing-nav-button {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    backdrop-filter: blur(20px);
    opacity: 0.6;
}

.landing-nav-button:hover {
    background: var(--accent-primary);
    color: #ffffff;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    opacity: 1;
}

.landing-watermark-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    pointer-events: none;
    z-index: 1;
    display: flex;
    justify-content: center;
}

.landing-vertical-watermark {
    font-size: clamp(5rem, 15vw, 18rem);
    font-weight: 900;
    color: var(--grid-color);
    margin: 0;
    letter-spacing: -0.05em;
    user-select: none;
    text-transform: uppercase;
}

.landing-cinematic-info {
    position: relative;
    z-index: 45;
    text-align: center;
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.landing-meta-line {
    display: flex;
    align-items: flex-end; /* Aligned to bottom of text */
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-family: var(--font-accent);
}

.landing-slide-number {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
}

.landing-catalog-separator {
    width: 1px;
    height: 1.2rem;
    background: var(--text-secondary);
    opacity: 0.4;
    transform: rotate(20deg); /* Slanted look */
    margin: 0 0.25rem;
}

.landing-total-slides {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    opacity: 0.6;
    line-height: 1.1;
}

.landing-cinematic-title {
    font-size: clamp(2.2rem, 5vw, 4.8rem);
    font-weight: 900;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.05em;
    text-transform: uppercase;
    line-height: 0.95;
}

.landing-cinematic-desc {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-top: 1rem;
    max-width: 600px;
    line-height: 1.5;
}

@media (max-width: 1440px) {
    .landing-nav-container { display: none; }
}

@media (max-width: 768px) {
    .landing-nav-container { padding: 0 2rem; }
    .landing-nav-button { width: 50px; height: 50px; }
}

/* Extreme Landscape Support: Under 500px height */
@media (max-height: 500px) {
    .landing-carousel-stage { 
        gap: 0.5rem; 
    }
    .landing-carousel-track { 
        height: 14rem; 
    }
    .landing-carousel-slide { 
        width: 12rem; 
        height: 12rem; 
    }
    .landing-cinematic-title {
        font-size: clamp(1.5rem, 4vh, 2.5rem);
    }
    .landing-cinematic-desc {
        font-size: 0.9rem;
        margin-top: 0.25rem;
        max-width: 400px;
    }
    .landing-meta-line {
        margin-bottom: 0.25rem;
    }
}
</style>
