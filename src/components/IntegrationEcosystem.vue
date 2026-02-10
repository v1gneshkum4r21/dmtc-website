<template>
  <section class="integration-ecosystem">
    <div class="content-container">
      <!-- Section Header -->
      <div class="header-group">
        <div class="pill-label">THIS IS WHAT WE DO FOR YOU</div>
        <h2 class="section-title">Professional, precise and autonomous</h2>
        <p class="section-subtitle">
          We develop software built for your industry. All our solutions stand on the shoulders of Dreamactic's size, stability, innovation, and security.
        </p>
      </div>

      <!-- Hub & Spoke Layout -->
      <div class="ecosystem-layout">
        
        <!-- Left: Core Hub Card -->
        <div class="hub-column">
          <div class="core-card">
            <div class="logo-stack">
              <div class="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" class="brand-logo">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="brand-name">Dreamactic</span>
            </div>
            <p class="core-text">Softwares made for you</p>
          </div>
        </div>

        <!-- Center: SVG Connectors (Desktop Only) -->
        <div class="connector-column">
          <svg class="connector-svg" viewBox="0 0 100 400" preserveAspectRatio="none">
            <!-- Top Path (To Row 1) -->
            <path d="M0 200 C 60 200, 40 80, 100 80" 
                  fill="none" stroke="#E0E6EB" stroke-width="2" />
            
            <!-- Bottom Path (To Row 3) -->
            <path d="M0 200 C 60 200, 40 320, 100 320" 
                  fill="none" stroke="#E0E6EB" stroke-width="2" />
            
            <!-- Animated Dots -->
            <circle r="3" fill="#635BFF">
              <animateMotion dur="3s" repeatCount="indefinite"
                path="M0 200 C 60 200, 40 80, 100 80" />
            </circle>
            <circle r="3" fill="#635BFF">
              <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s"
                path="M0 200 C 60 200, 40 320, 100 320" />
            </circle>
          </svg>
        </div>

        <!-- Right: Industry Grid (Spokes / Marquee) -->
        <div class="spoke-column">
          
          <!-- Row 1: Marquee Left -->
          <div class="spoke-row-container">
            <div class="spoke-track track-left">
              <!-- Content Duplicated 3 times for smooth loop -->
              <div class="spoke-group" v-for="i in 3" :key="i">
                <div 
                  v-for="(pill, idx) in row1" 
                  :key="idx" 
                  class="industry-pill"
                  :style="{ backgroundColor: pill.color, borderColor: pill.color }"
                >
                  <span class="pill-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <!-- Construction (Hammer) -->
                      <path v-if="pill.icon === 'construction'" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      <!-- Healthcare (Activity) -->
                      <polyline v-else-if="pill.icon === 'activity'" points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      <!-- Retail (Shopping Bag) -->
                      <path v-else-if="pill.icon === 'shopping-bag'" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line v-if="pill.icon === 'shopping-bag'" x1="3" y1="6" x2="21" y2="6" /><path v-if="pill.icon === 'shopping-bag'" d="M16 10a4 4 0 0 1-8 0" />
                      <!-- Manufacturing (Settings/Cog) -->
                      <circle v-else-if="pill.icon === 'settings'" cx="12" cy="12" r="3" /><path v-if="pill.icon === 'settings'" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </span> 
                  {{ pill.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: Marquee Right -->
          <div class="spoke-row-container">
            <div class="spoke-track track-right">
              <div class="spoke-group" v-for="i in 3" :key="i">
                 <div 
                  v-for="(pill, idx) in row2" 
                  :key="idx" 
                  class="industry-pill"
                  :style="{ backgroundColor: pill.color, borderColor: pill.color }"
                >
                  <span class="pill-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <!-- Public Sector (Landmark) -->
                      <line v-if="pill.icon === 'landmark'" x1="3" y1="22" x2="21" y2="22" /><line v-if="pill.icon === 'landmark'" x1="6" y1="18" x2="6" y2="11" /><line v-if="pill.icon === 'landmark'" x1="10" y1="18" x2="10" y2="11" /><line v-if="pill.icon === 'landmark'" x1="14" y1="18" x2="14" y2="11" /><line v-if="pill.icon === 'landmark'" x1="18" y1="18" x2="18" y2="11" /><polygon v-if="pill.icon === 'landmark'" points="12 2 20 7 4 7" />
                      <!-- Utilities (Zap) -->
                      <polygon v-else-if="pill.icon === 'zap'" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      <!-- Legal Tech (Scale) -->
                      <path v-else-if="pill.icon === 'scale'" d="M16 16l-4-4-4 4" /><path v-if="pill.icon === 'scale'" d="M12 2v20" />
                      <!-- Real Estate (Home) -->
                      <path v-else-if="pill.icon === 'home'" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline v-if="pill.icon === 'home'" points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </span> 
                  {{ pill.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Row 3: Marquee Left -->
          <div class="spoke-row-container">
            <div class="spoke-track track-left">
              <div class="spoke-group" v-for="i in 3" :key="i">
                 <div 
                  v-for="(pill, idx) in row3" 
                  :key="idx" 
                  class="industry-pill"
                  :style="{ backgroundColor: pill.color, borderColor: pill.color }"
                >
                  <span class="pill-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <!-- Logistics (Truck) -->
                      <rect v-if="pill.icon === 'truck'" x="1" y="3" width="15" height="13" /><polygon v-if="pill.icon === 'truck'" points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle v-if="pill.icon === 'truck'" cx="5.5" cy="18.5" r="2.5" /><circle v-if="pill.icon === 'truck'" cx="18.5" cy="18.5" r="2.5" />
                      <!-- Education (Book) -->
                      <path v-else-if="pill.icon === 'book'" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path v-if="pill.icon === 'book'" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      <!-- Finance (Trending Up) -->
                      <polyline v-else-if="pill.icon === 'trending-up'" points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline v-if="pill.icon === 'trending-up'" points="17 6 23 6 23 12" />
                      <!-- Travel (Plane) -->
                      <path v-else-if="pill.icon === 'plane'" d="M2 12h20" /><path v-if="pill.icon === 'plane'" d="M12 2l-3 9h6l-3-9z" /><path v-if="pill.icon === 'plane'" d="M12 22l3-9H9l3 9z" /> <!-- Simplified plane-like shape or define better one -->
                      <path v-else-if="pill.icon === 'map'" d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><line v-if="pill.icon === 'map'" x1="8" y1="2" x2="8" y2="18" /><line v-if="pill.icon === 'map'" x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </span> 
                  {{ pill.name }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const row1 = [
  { name: 'Construction', color: '#F59E0B', icon: 'construction' }, // Amber
  { name: 'Healthcare', color: '#EF4444', icon: 'activity' }, // Red
  { name: 'Retail', color: '#8B5CF6', icon: 'shopping-bag' }, // Violet
  { name: 'Manufacturing', color: '#6B7280', icon: 'settings' } // Gray
]

const row2 = [
  { name: 'Public Sector', color: '#10B981', icon: 'landmark' }, // Emerald
  { name: 'Utilities', color: '#FBBF24', icon: 'zap' }, // Yellow
  { name: 'Legal Tech', color: '#3B82F6', icon: 'scale' }, // Blue
  { name: 'Real Estate', color: '#6366F1', icon: 'home' } // Indigo
]

const row3 = [
  { name: 'Logistics', color: '#EC4899', icon: 'truck' }, // Pink
  { name: 'Education', color: '#14B8A6', icon: 'book' }, // Teal
  { name: 'Finance', color: '#22C55E', icon: 'trending-up' }, // Green
  { name: 'Travel', color: '#0EA5E9', icon: 'map' } // Sky Blue
]
</script>

<style scoped>



.integration-ecosystem {
  padding: 8rem 0 50px 0; /* Updated bottom padding as requested */
  background-color: var(--bg-primary); /* White in Light, Dark in Dark */
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  text-align: center;
}

/* Header Styles */
.header-group {
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pill-label {
  background: rgba(99, 91, 255, 0.1);
  color: var(--accent-primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  display: inline-block;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  max-width: 700px;
  line-height: 1.6;
}

/* Hub & Spoke Layout */
.ecosystem-layout {
  display: flex;
  align-items: center; /* Vertically align hub and spokes */
  justify-content: center;
  position: relative;
  height: 400px; /* Fixed height for SVG canvas */
}

/* Left Column: Core Card */
.hub-column {
  z-index: 2;
  flex-shrink: 0;
}

.core-card {
  background: var(--bg-secondary); /* Contrast against white/dark bg */
  width: 240px;
  height: 240px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); /* Soft shadow */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  border: 1px solid var(--grid-color);
}

.logo-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #635BFF 0%, #00D4FF 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(99, 91, 255, 0.3);
}

.brand-logo {
  width: 40px;
  height: 40px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.core-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Center Column: SVG Connectors */
.connector-column {
  flex-grow: 1;
  height: 100%;
  position: relative;
  min-width: 100px; /* Ensure space for lines */
  max-width: 150px;
}

.connector-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Right Column: Spokes Grid (Marquee) */
.spoke-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center; /* Vertically center */
  height: 100%;
  padding-left: 20px; /* Space from connector end */
  width: 100%; /* Ensure it takes remaining space */
  overflow: hidden; /* Hide overflow for marquee */
  /* Strong fade on left to avoid straight line cut-off */
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); 
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.spoke-row-container {
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: flex-start; /* Ensure rows start from left */
}

.spoke-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
}

.spoke-group {
  display: flex;
  gap: 1.5rem;
}

/* Marquee Animations */
.track-left {
  animation: scroll-left 40s linear infinite;
}

.track-right {
  animation: scroll-right 45s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); } /* Move 1/3 since we have 3 groups */
}

@keyframes scroll-right {
  0% { transform: translateX(-33.33%); }
  100% { transform: translateX(0); }
}

/* Pause on Hover */
.spoke-column:hover .spoke-track {
  animation-play-state: paused;
}


/* Mobile Responsiveness */
.industry-pill {
  /* background set inline */
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
  font-size: 0.95rem;
  font-weight: 700;
  color: white; /* White text for solid bg */
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
  border: 1px solid transparent; /* Border match bg */
  white-space: nowrap;
}

.industry-pill:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15); 
  filter: brightness(1.1); /* Slightly brighter on hover */
}

.pill-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2.5; 
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
  .ecosystem-layout {
    flex-direction: column;
    height: auto;
    gap: 3rem;
  }

  .connector-column {
    display: none; /* Hide SVG lines on mobile */
  }

  .hub-column {
    margin-bottom: 2rem;
    position: relative;
  }

  /* Add a vertical connector line for mobile */
  .hub-column::after {
    content: '';
    position: absolute;
    bottom: -3.5rem; /* Extend a bit more */
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 3.5rem;
    background: linear-gradient(to bottom, var(--accent-primary), transparent); /* Gradient fade */
  }

  /* Add a dot at the end of the line */
  .hub-column::before {
    content: '';
    position: absolute;
    bottom: -3.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    border-radius: 50%; /* Circle */
    box-shadow: 0 0 10px var(--accent-primary); /* Glow */
    animation: pulse-dot 2s infinite;
  }

  .spoke-column {
    padding-left: 0;
    align-items: center;
    mask-image: none; /* Remove mask on mobile if needed, or keep it */
  }
}

@keyframes pulse-dot {
  0% { transform: translateX(-50%) scale(1); opacity: 1; }
  50% { transform: translateX(-50%) scale(1.5); opacity: 0.5; }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

</style>
