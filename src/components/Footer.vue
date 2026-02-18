<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top">
        <!-- Logo & Mission -->
        <div class="footer-brand">
          <div class="logo">
            <img :src="logoSrc" alt="DREAMACTIC" class="logo-img" />
          </div>
          <p class="brand-tagline">
            Orchestrating the Agentic Future. Bridging the gap between advanced AI orchestration and human creativity.
          </p>
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" class="social-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="footer-links-grid">
          <div class="link-column">
            <h4>Products</h4>
            <ul>
              <li><router-link to="/products/superfiitter">SuperFiitter</router-link></li>
              <li><router-link to="/products/echoai">EchoAI</router-link></li>
            </ul>
          </div>
          <div class="link-column">
            <h4>Services</h4>
            <ul>
              <li><router-link to="/services/ai-work">AI for Work</router-link></li>
              <li><router-link to="/services/ai-service">AI for Service</router-link></li>
              <li><router-link to="/services/ai-enterprise">AI for Enterprise</router-link></li>
            </ul>
          </div>
          <div class="link-column">
            <h4>Resources</h4>
            <ul>
              <li><router-link to="/showcase">Creative Showcase</router-link></li>
              <li><router-link to="/resources/hub">Resource Hub</router-link></li>
              <li><router-link to="/resources/blog">Blog</router-link></li>
              <li><router-link to="/support/docs">Documentation</router-link></li>
            </ul>
          </div>
          <div class="link-column">
            <h4>Company</h4>
            <ul>
              <li><router-link to="/company/about">About Us</router-link></li>
              <li><router-link to="/company/leadership">Leadership</router-link></li>
              <li><router-link to="/company/careers">Careers</router-link></li>
              <li><a href="#" @click.prevent="openContactModal">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get the latest on Agentic AI and enterprise workflows.</p>
          <form class="newsletter-form" @submit.prevent>
            <input type="email" placeholder="Email address" class="newsletter-input" />
            <button type="submit" class="newsletter-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="bottom-content">
          <p class="copyright">© 2026 Dreamactic Inc. All rights reserved.</p>
          <div class="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
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
  background-color: var(--bg-primary);
  border-top: 1px solid var(--grid-color);
  padding: 5rem 0 2rem 0;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 3fr 1.2fr;
  gap: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--grid-color);
}

.logo-img {
  height: clamp(16px, 2vw, 20px);
  width: auto;
  display: block;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.brand-tagline {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-3px);
}

.social-btn svg {
  width: 18px;
  height: 18px;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.link-column h4 {
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.link-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-column li {
  margin-bottom: 0.8rem;
}

.link-column a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.link-column a:hover {
  color: var(--accent-primary);
}

.footer-newsletter h4 {
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.footer-newsletter p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
}

.newsletter-input:focus {
  border-color: var(--accent-primary);
}

.newsletter-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.newsletter-btn:hover {
  background: var(--accent-hover);
}

.newsletter-btn svg {
  width: 20px;
  height: 20px;
}

.footer-bottom {
  padding-top: 2rem;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.legal-links {
  display: flex;
  gap: 2rem;
}

.legal-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.legal-links a:hover {
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  .footer-newsletter {
    grid-column: span 2;
  }

  .logo-img {
    height: 16px;
  }
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .footer-links-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-newsletter {
    grid-column: span 1;
  }
  .bottom-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-img {
    height: 14px;
  }
}
</style>
