<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Watermark Background -->
      <div class="footer-watermark">DREAMACTIC</div>

      <div class="footer-main">
        <div class="footer-brand-section">
          <div class="logo">
            <img :src="logoSrc" alt="DREAMACTIC" class="logo-img" />
          </div>
          <p class="brand-tagline">
            Orchestrating the Agentic Future. Bridging the gap between advanced AI orchestration and human creativity.
          </p>
          <div class="social-wrapper">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-links-container">
          <div class="link-group">
            <span class="group-title">Products</span>
            <router-link to="/products/superfiitter">SuperFiitter</router-link>
            <router-link to="/products/echoai">EchoAI</router-link>
          </div>
          <div class="link-group">
            <span class="group-title">Services</span>
            <router-link to="/services/ai-work">AI for Work</router-link>
            <router-link to="/services/ai-service">AI for Service</router-link>
            <router-link to="/services/ai-enterprise">AI for Enterprise</router-link>
          </div>
          <div class="link-group">
            <span class="group-title">Company</span>
            <router-link to="/company/about">About Us</router-link>
            <router-link to="/company/leadership">Leadership</router-link>
            <router-link to="/company/careers">Careers</router-link>
            <a href="#" @click.prevent="openContactModal">Contact</a>
          </div>
          <div class="link-group">
            <span class="group-title">Resources</span>
            <router-link to="/resources/blog">Blog</router-link>
            <router-link to="/resources/hub">Hub</router-link>
            <router-link to="/support/docs">Docs</router-link>
          </div>
        </div>

        <div class="footer-newsletter-section">
          <span class="newsletter-title">Stay Connected</span>
          <p class="newsletter-desc">Join our newsletter for latest AI updates.</p>
          <form class="newsletter-field" @submit.prevent>
            <input type="email" placeholder="Email" class="newsletter-input" />
            <button type="submit" class="newsletter-submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="bottom-legal">
          <span>© 2026 Dreamactic</span>
          <div class="legal-dots">
            <a href="#">Privacy</a>
            <span class="dot">•</span>
            <a href="#">Terms</a>
            <span class="dot">•</span>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject, computed, defineProps } from 'vue'
const openContactModal = inject('openContactModal')

const props = defineProps({
  isDarkMode: Boolean
})

const logoSrc = computed(() => {
  return props.isDarkMode ? '/logo/120226_LogoV2_02.svg' : '/logo/120226_LogoV2_01.svg'
})
</script>

<style scoped>
.footer {
  position: relative;
  background-color: var(--bg-primary);
  padding: 5px 0 4rem 0;
  border-top: 0px solid var(--grid-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
  position: relative;
  z-index: 2;
}

.footer-watermark {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20vw;
  font-weight: 900;
  color: var(--text-primary);
  opacity: 0.03;
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: -0.05em;
  z-index: 1;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr;
  gap: 4rem;
  margin-bottom: 0px;
}

.footer-brand-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo-img {
  height: 18px;
  width: auto;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.brand-tagline {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 320px;
}

.social-wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--grid-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-link:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
}

.social-link svg {
  width: 16px;
  height: 16px;
}

.footer-links-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.link-group a {
  text-decoration: none;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  width: fit-content;
}

.link-group a:hover {
  color: var(--accent-primary);
  transform: translateX(4px);
}

.footer-newsletter-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.newsletter-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-primary);
}

.newsletter-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.newsletter-field {
  position: relative;
  margin-top: 0.5rem;
}

.newsletter-input {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  padding-right: 3rem;
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s ease;
}

.newsletter-input:focus {
  border-color: var(--accent-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
}

.newsletter-submit {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--accent-primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-submit:hover {
  background: var(--accent-hover);
  transform: translateY(-50%) translateX(2px);
}

.footer-bottom {
  padding-top: 3rem;
  border-top: 0px solid var(--grid-color);
}

.bottom-legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.legal-dots {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.legal-dots a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.legal-dots a:hover {
  color: var(--text-primary);
}

.dot {
  opacity: 0.3;
}

/* RESPONSIVE */

@media (max-width: 1200px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
  .footer-newsletter-section {
    grid-column: span 2;
    max-width: 400px;
  }
}

@media (max-width: 900px) {
  .footer {
    padding: 6rem 0 3rem 0;
  }
  .footer-links-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    text-align: center;
  }

  .footer-brand-section {
    align-items: center;
  }

  .brand-tagline {
    max-width: 100%;
  }

  .social-wrapper {
    justify-content: center;
  }

  .footer-links-container {
    padding: 2rem 0;
    border-top: 1px solid var(--grid-color);
    border-bottom: 1px solid var(--grid-color);
  }

  .link-group a {
    width: 100%;
  }

  .link-group a:hover {
    transform: none;
    color: var(--accent-primary);
  }

  .footer-newsletter-section {
    grid-column: span 1;
    max-width: 100%;
    align-items: center;
  }

  .newsletter-field {
    width: 100%;
    max-width: 350px;
  }

  .bottom-legal {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .legal-dots {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .footer-links-container {
    grid-template-columns: 1fr;
    text-align: left;
    gap: 2.5rem;
  }
  
  .group-title {
    border-bottom: 1px solid var(--grid-color);
    padding-bottom: 0.5rem;
    width: 100%;
  }
}
</style>
