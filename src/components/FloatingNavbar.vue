<template>
  <nav ref="navbarRef" class="floating-navbar" :class="{ 'is-open': isMobileMenuOpen }" @mouseleave="closeDropdown">
    <div class="nav-content">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img :src="logoSrc" alt="DREAMACTIC" class="logo-img" />
      </router-link>

      <!-- Links -->
      <ul class="nav-links">
        <li class="nav-item" @mouseenter="openDropdown('services')">
          <router-link to="/services/ai-work" :class="{ active: activeDropdown === 'services' || isServicesActive }">Services</router-link>
          
          <!-- SERVICES MEGA MENU -->
          <div class="mega-menu" :class="{ show: activeDropdown === 'services' }">
            <router-link to="/services/ai-work" class="mega-row row-lavender" @click="closeDropdown">
              <span class="mega-watermark">Work</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>AI for Work</h3>
                  <p>Search across silos. Automate workflows. Orchestrate AI agents.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/services/ai-service" class="mega-row row-blue" @click="closeDropdown">
              <span class="mega-watermark">Service</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>AI for Service</h3>
                  <p>Leverage Agentic capabilities to empower customers.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/services/ai-enterprise" class="mega-row row-green" @click="closeDropdown">
              <span class="mega-watermark">Enterprise</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>AI for Enterprise</h3>
                  <p>Transform your entire organization with custom AI swarms.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
          </div>
        </li>

        <li class="nav-item" @mouseenter="openDropdown('products')">
          <router-link to="/products/superfiitter" :class="{ active: activeDropdown === 'products' || isProductsActive }">Products</router-link>
          <div class="mega-menu" :class="{ show: activeDropdown === 'products' }">
             <router-link to="/products/superfiitter" class="mega-row row-lavender" @click="closeDropdown">
              <span class="mega-watermark">SuperFiitter</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>SuperFiitter</h3>
                  <p>AI-powered virtual try-on platform with real-time image and video rendering for immersive fitting.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/products/echoai" class="mega-row row-blue" @click="closeDropdown">
              <span class="mega-watermark">EchoAI</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>EchoAI</h3>
                  <p>AI voice and autonomous agent platform for intelligent BPO automation and conversational workflows.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
          </div>
        </li>

        <li class="nav-item" @mouseenter="openDropdown('company')">
          <router-link to="/company/about" :class="{ active: activeDropdown === 'company' || isCompanyActive }">Company</router-link>
          <div class="mega-menu" :class="{ show: activeDropdown === 'company' }">
            <router-link to="/company/about" class="mega-row row-lavender" @click="closeDropdown">
              <span class="mega-watermark">About</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>About Us</h3>
                  <p>About our mission and team.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/company/leadership" class="mega-row row-blue" @click="closeDropdown">
              <span class="mega-watermark">Team</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Leadership</h3>
                  <p>Meet the visionaries behind Dreamactic.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/company/careers" class="mega-row row-green" @click="closeDropdown">
              <span class="mega-watermark">Jobs</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Careers</h3>
                  <p>Join us in building the agentic future.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
          </div>
        </li>
        <li class="nav-item" @mouseenter="openDropdown('resources')">
          <router-link to="/resources/hub" :class="{ active: activeDropdown === 'resources' || isResourcesActive }">Resources</router-link>
          <div class="mega-menu" :class="{ show: activeDropdown === 'resources' }">
            <router-link to="/resources/hub" class="mega-row row-lavender" @click="closeDropdown">
              <span class="mega-watermark">Hub</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Resource Hub</h3>
                  <p>Guides, tutorials, and training materials.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/resources/blog" class="mega-row row-blue" @click="closeDropdown">
              <span class="mega-watermark">Blog</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Blog</h3>
                  <p>Latest news and insights from the AI front.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/resources/research" class="mega-row row-green" @click="closeDropdown">
              <span class="mega-watermark">Research</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Research</h3>
                  <p>Our contributions to the field of Agentic AI.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
          </div>
        </li>
        <li class="nav-item" @mouseenter="openDropdown('support')">
          <router-link to="/support/docs" :class="{ active: activeDropdown === 'support' || isSupportActive }">Support</router-link>
          <div class="mega-menu" :class="{ show: activeDropdown === 'support' }">
            <router-link to="/support/docs" class="mega-row row-lavender" @click="closeDropdown">
              <span class="mega-watermark">Docs</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Documentation</h3>
                  <p>Get started with our technical guides.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/support/community" class="mega-row row-blue" @click="closeDropdown">
              <span class="mega-watermark">Help</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Community</h3>
                  <p>Connect with other builders and experts.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
            <router-link to="/support/help" class="mega-row row-green" @click="closeDropdown">
              <span class="mega-watermark">Support</span>
              <div class="row-content">
                <div class="row-text">
                  <h3>Help Center</h3>
                  <p>Find answers to common questions.</p>
                </div>
                <!-- Animated Arrow -->
                <div class="row-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </router-link>
          </div>
        </li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <!-- Search -->
        <div class="search-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            class="search-input" 
            @focus="closeDropdown"
          />
        </div>

        <!-- Showcase -->
        <div class="action-item">
          <router-link to="/showcase" class="showcase-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <span class="btn-label">Showcase</span>
          </router-link>
        </div>

        <!-- Contact Us -->
        <div class="action-item">
          <button class="contact-us-btn" @click="openContactModal">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span class="btn-label">Contact Us</span>
          </button>
        </div>

        <!-- Theme Toggle -->
        <button class="theme-toggle" @click="$emit('toggle-theme')" aria-label="Toggle theme">
          <svg v-if="isDarkMode" class="theme-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else class="theme-icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- Hamburger Menu Toggle (Mobile/Tablet) -->
        <button class="hamburger" @click="toggleMobileMenu" :class="{ 'is-active': isMobileMenuOpen }">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU DRAWER -->
    <div class="mobile-drawer" :class="{ open: isMobileMenuOpen }">
      <div class="mobile-nav-list">
        <!-- Services Accordion -->
        <div class="mobile-nav-item">
          <button class="mobile-nav-btn" @click="toggleSection('services')">
            Services
            <svg class="chevron" :class="{ rotate: openSection === 'services' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="mobile-sub-menu" v-show="openSection === 'services'">
            <router-link to="/services/ai-work" class="mobile-sub-item lavender" @click="toggleMobileMenu">
              <h3>AI for Work</h3>
              <p>Search across silos. Automate workflows.</p>
            </router-link>
            <router-link to="/services/ai-service" class="mobile-sub-item blue" @click="toggleMobileMenu">
              <h3>AI for Service</h3>
              <p>Leverage Agentic capabilities to empower customers.</p>
            </router-link>
            <router-link to="/services/ai-enterprise" class="mobile-sub-item green" @click="toggleMobileMenu">
              <h3>AI for Enterprise</h3>
              <p>Transform your entire organization with AI swarms.</p>
            </router-link>
          </div>
        </div>

        <!-- Products Accordion -->
        <div class="mobile-nav-item">
          <button class="mobile-nav-btn" @click="toggleSection('products')">
            Products
            <svg class="chevron" :class="{ rotate: openSection === 'products' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="mobile-sub-menu" v-show="openSection === 'products'">
            <router-link to="/products/superfiitter" class="mobile-sub-item lavender" @click="toggleMobileMenu">
              <h3>SuperFiitter</h3>
              <p>AI Virtual Try-On & Real-Time Rendering.</p>
            </router-link>
            <router-link to="/products/echoai" class="mobile-sub-item blue" @click="toggleMobileMenu">
              <h3>EchoAI</h3>
              <p>Autonomous Voice Agents & BPO Automation.</p>
            </router-link>
          </div>
        </div>

        <!-- Company Accordion -->
        <div class="mobile-nav-item">
          <button class="mobile-nav-btn" @click="toggleSection('company')">
            Company
            <svg class="chevron" :class="{ rotate: openSection === 'company' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="mobile-sub-menu" v-show="openSection === 'company'">
            <router-link to="/company/about" class="mobile-sub-item lavender" @click="toggleMobileMenu">
              <h3>About Us</h3>
              <p>Our mission and team.</p>
            </router-link>
            <router-link to="/company/leadership" class="mobile-sub-item blue" @click="toggleMobileMenu">
              <h3>Leadership</h3>
              <p>Meet the visionaries.</p>
            </router-link>
            <router-link to="/company/careers" class="mobile-sub-item green" @click="toggleMobileMenu">
              <h3>Careers</h3>
              <p>Join us in building the future.</p>
            </router-link>
          </div>
        </div>

        <!-- Resources Accordion -->
        <div class="mobile-nav-item">
          <button class="mobile-nav-btn" @click="toggleSection('resources')">
            Resources
            <svg class="chevron" :class="{ rotate: openSection === 'resources' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="mobile-sub-menu" v-show="openSection === 'resources'">
            <router-link to="/resources/hub" class="mobile-sub-item lavender" @click="toggleMobileMenu">
              <h3>Resource Hub</h3>
              <p>Guides and training materials.</p>
            </router-link>
            <router-link to="/resources/blog" class="mobile-sub-item blue" @click="toggleMobileMenu">
              <h3>Blog</h3>
              <p>Latest news and insights.</p>
            </router-link>
            <router-link to="/resources/research" class="mobile-sub-item green" @click="toggleMobileMenu">
              <h3>Research</h3>
              <p>Field-leading AI research.</p>
            </router-link>
          </div>
        </div>

        <!-- Support Accordion -->
        <div class="mobile-nav-item">
          <button class="mobile-nav-btn" @click="toggleSection('support')">
            Support
            <svg class="chevron" :class="{ rotate: openSection === 'support' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="mobile-sub-menu" v-show="openSection === 'support'">
            <router-link to="/support/docs" class="mobile-sub-item lavender" @click="toggleMobileMenu">
              <h3>Documentation</h3>
              <p>Technical guides and API docs.</p>
            </router-link>
            <router-link to="/support/community" class="mobile-sub-item blue" @click="toggleMobileMenu">
              <h3>Community</h3>
              <p>Connect with other builders.</p>
            </router-link>
            <router-link to="/support/help" class="mobile-sub-item green" @click="toggleMobileMenu">
              <h3>Help Center</h3>
              <p>Answers to common questions.</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, defineProps, defineEmits, inject, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const navbarRef = ref(null)

const route = useRoute()
const openContactModal = inject('openContactModal')

const props = defineProps({
  isDarkMode: Boolean
})

const emit = defineEmits(['toggle-theme'])

const activeDropdown = ref(null)
const isMobileMenuOpen = ref(false)
const openSection = ref(null)

const isServicesActive = computed(() => route.path.startsWith('/services'))
const isProductsActive = computed(() => route.path.startsWith('/products'))
const isCompanyActive = computed(() => route.path.startsWith('/company'))
const isResourcesActive = computed(() => route.path.startsWith('/resources'))
const isSupportActive = computed(() => route.path.startsWith('/support'))

const logoSrc = computed(() => {
  return props.isDarkMode ? '/logo/120226_LogoV2_02.svg' : '/logo/120226_LogoV2_01.svg'
})

const openDropdown = (menu) => {
  if (window.innerWidth > 1050) {
    activeDropdown.value = menu
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) {
    openSection.value = null
  }
}

const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section
}
const handleClickOutside = (event) => {
  if (isMobileMenuOpen.value && navbarRef.value && !navbarRef.value.contains(event.target)) {
    isMobileMenuOpen.value = false
    openSection.value = null
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.floating-navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 1080px;
  /* Glassmorphism */
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  border-radius: 50px;
  padding: 0.8rem 2rem;
  box-shadow: 
    var(--shadow-sm), 
    var(--shadow-md),
    inset 0 0 0 1px var(--glass-border);
    
  transition: all 0.3s ease;
}

.floating-navbar:hover {
  background: var(--bg-primary);
  opacity: 0.98;
  box-shadow: 
    var(--navbar-shadow),
    inset 0 0 0 1px var(--glass-border);
  transform: translateX(-50%) translateY(-2px);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative; /* Anchor for dropdown */
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: clamp(14px, 1.6vh, 18px);
  width: auto;
  display: block;
  transition: all 0.3s ease;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 1rem;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-links > .nav-item > a {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  opacity: 0.8;
  padding: 10px 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.nav-links a:hover, .nav-links a.active {
  opacity: 1;
}

/* ========================================
   MEGA MENU STYLES
   ======================================== */

.mega-menu {
  position: fixed;
  top: 85px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  width: 95%;
  max-width: 1026px;
  background: var(--bg-primary); /* Themed */
  border-radius: 12px;
  box-shadow: 
    0 50px 100px -20px rgba(50, 50, 93, 0.25), 
    0 30px 60px -30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mega-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.mega-row {
  padding: 1.1rem 2.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: block; /* Expand a tag */
  text-decoration: none !important;
  position: relative;
  overflow: hidden;
}

.mega-row:last-child {
  border-bottom: none;
}

.mega-watermark {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 4.5rem;
  font-weight: 950;
  color: rgba(0, 0, 0, 0.04);
  pointer-events: none;
  user-select: none;
  z-index: 1;
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.row-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-text h3 {
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0a2540; /* Always dark for legibility on pastel rows */
  font-family: var(--font-heading);
}

.row-text p {
  margin: 0;
  font-size: 0.8rem;
  color: #425466; /* Always dark for legibility on pastel rows */
  line-height: 1.4;
}

/* Row Arrow Styles */
.row-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: inherit; /* Use font color */
  display: flex;
  align-items: center;
}

.mega-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Colors - Vivid Base & Deeper Hover (Always Colorful) */
.row-lavender { background-color: #C4B5F7; }
.row-lavender:hover { background-color: #B09EED !important; }

.row-blue { background-color: #A8D8F0; }
.row-blue:hover { background-color: #8CCCE8 !important; }

.row-green { background-color: #A8E6C8; }
.row-green:hover { background-color: #8CDDB5 !important; }

/* ========================================
   NAV ACTIONS
   ======================================== */

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 14px;
  height: 14px;
  color: var(--text-primary);
  opacity: 0.5;
}

.search-input {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 0.4rem 1rem 0.4rem 2rem;
  font-size: 0.8rem;
  width: 140px;
  transition: all 0.2s;
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
  background: var(--bg-primary);
  width: 180px;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.1);
}

.showcase-btn, .contact-us-btn, .theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0.5rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  height: 34px;
  min-width: 34px;
}

.btn-label {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0;
}

.showcase-btn:hover .btn-label,
.contact-us-btn:hover .btn-label {
  max-width: 100px;
  opacity: 1;
  margin-left: 0.4rem;
}

.showcase-btn:hover,
.contact-us-btn:hover {
  padding: 0.5rem 0.8rem;
}

.theme-toggle {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  width: 34px;
}

.theme-toggle:hover {
  background: var(--bg-primary);
}

.theme-icon {
  width: 16px;
  height: 16px;
}

.showcase-btn {
  background: var(--btn-showcase-bg);
  color: white;
  box-shadow: var(--shadow-sm);
}

.showcase-btn:hover {
  background: var(--btn-showcase-hover);
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

.contact-us-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
}

.contact-us-btn:hover {
  background: var(--bg-primary);
  transform: translateY(-1px);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* ========================================
   MOBILE DRAWER
   ======================================== */
.mobile-drawer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-primary); /* Themed */
  border-radius: 0 0 24px 24px;
  width: 100%;
}

.mobile-drawer.open {
  max-height: 80vh;
  overflow-y: auto;
  border-top: 1px solid var(--glass-border);
  padding-bottom: 1rem;
}

/* Custom Scrollbar for Mobile Drawer */
.mobile-drawer.open::-webkit-scrollbar {
  width: 5px;
}
.mobile-drawer.open::-webkit-scrollbar-track {
  background: transparent;
}
.mobile-drawer.open::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 10px;
}

.mobile-nav-list {
  padding: 1rem;
}

.mobile-nav-item {
  border-bottom: none;
}

.mobile-nav-item:last-child {
  border-bottom: none;
}

.mobile-nav-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0.5rem;
  background: none;
  border: none;
  color: var(--text-primary); /* Themed */
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.chevron {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
  opacity: 0.8;
  color: var(--text-primary); /* Themed */
}

.chevron.rotate {
  transform: rotate(180deg);
}

.mobile-sub-menu {
  padding: 0 0.5rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-sub-item {
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
}

.mobile-sub-item h3 {
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0a2540; /* Always dark text inside cards */
}

.mobile-sub-item p {
  margin: 0;
  font-size: 0.8rem;
  color: #425466; /* Always grey text inside cards */
  opacity: 0.8;
}

.mobile-sub-item.lavender { background: #C4B5F7; }
.mobile-sub-item.blue { background: #A8D8F0; }
.mobile-sub-item.green { background: #A8E6C8; }

/* Dark Mode Specific Adjustments for Cards - Removed to keep same as light theme */
.dark-theme .mobile-nav-btn:focus {
  outline: none;
}

/* ========================================
   HAMBURGER BUTTON
   ======================================== */
.hamburger {
  display: none;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
}

.hamburger-box {
  width: 18px;
  height: 12px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -1px;
}

.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
  width: 18px;
  height: 2px;
  background-color: var(--text-primary);
  border-radius: 2px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

.hamburger-inner::before, .hamburger-inner::after {
  content: "";
  display: block;
}

.hamburger-inner::before {
  top: -5px;
}

.hamburger-inner::after {
  bottom: -5px;
}

/* Animation */
.hamburger.is-active .hamburger-inner {
  transform: rotate(45deg);
}

.hamburger.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
}

.hamburger.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
}

@media (max-width: 950px) {
  .floating-navbar {
    width: 95%;
    padding: 0.6rem 1.2rem;
    border-radius: 24px;
  }

  .floating-navbar.is-open {
    border-radius: 24px 24px 0 0;
  }

  .nav-links {
    display: none; 
  }

  .hamburger {
    display: flex;
  }

  .search-container {
    display: none; 
  }

  .btn-label {
    display: none; 
  }

  .showcase-btn, .contact-us-btn {
    padding: 0.5rem;
  }

  .logo-img {
    height: 14px;
  }
}

@media (max-width: 480px) {
  .logo-img {
    height: 12px;
  }
  
  .nav-actions {
    gap: 0.4rem;
  }
}

/* Extreme Landscape Support: Under 500px height */
@media (max-height: 500px) {
  .floating-navbar {
    top: 10px;
    padding: 0.3rem 1.2rem;
  }
  
  .logo-img {
    height: 12px;
  }
  
  .nav-links a {
    font-size: 0.85rem;
    padding: 5px 0;
  }
  
  .search-input {
    padding: 0.25rem 0.8rem 0.25rem 1.8rem;
    font-size: 0.75rem;
  }
  
  .showcase-btn, .contact-us-btn, .theme-toggle {
    height: 28px;
    min-width: 28px;
    padding: 0.3rem;
  }
}

.action-item {
  position: relative;
  display: flex;
  align-items: center;
}
</style>
