<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card">
          <!-- Ambient Background Elements -->
          <div class="modal-blobs">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
          </div>

          <!-- Close Button -->
          <button class="close-btn" @click="$emit('close')" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-layout">
            <!-- Left Side: Form Section -->
            <div class="modal-form-section">
              <div class="form-header">
                <div class="header-badge">CONTACT US</div>
                <h2>Let's build the <span class="text-gradient">future</span></h2>
                <p>Join our ecosystem of agentic workflows. Our team of experts is ready to assist your digital transformation.</p>
              </div>

              <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Full Name</label>
                    <div class="input-container">
                      <input type="text" v-model="form.name" placeholder="Alex Rivera" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Work Email</label>
                    <div class="input-container">
                      <input type="email" v-model="form.email" placeholder="alex@company.com" required />
                    </div>
                  </div>
                </div>

                <!-- Custom Luxury Dropdown -->
                <div class="form-group">
                  <label>Interest Area</label>
                  <div class="input-container custom-dropdown" v-click-outside="closeDropdown">
                    <div 
                      class="dropdown-trigger" 
                      :class="{ 'is-active': isDropdownOpen }"
                      @click="toggleDropdown"
                    >
                      <span>{{ selectedLabel || 'Search for categories...' }}</span>
                      <div class="select-arrow" :class="{ 'rotate': isDropdownOpen }">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                    
                    <Transition name="dropdown-slide">
                      <ul v-if="isDropdownOpen" class="dropdown-options">
                        <li 
                          v-for="option in options" 
                          :key="option.value"
                          @click="selectOption(option)"
                          :class="{ 'is-selected': form.subject === option.value }"
                        >
                          <div class="option-dot"></div>
                          <span>{{ option.label }}</span>
                          <svg v-if="form.subject === option.value" class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </li>
                      </ul>
                    </Transition>
                  </div>
                </div>

                <div class="form-group">
                  <label>Your Vision</label>
                  <div class="input-container">
                    <textarea v-model="form.message" rows="4" placeholder="How can we help you orchestrate your future?" required></textarea>
                  </div>
                </div>

                <button type="submit" class="submit-btn" :disabled="submitting">
                  <div class="btn-inner" v-if="!submitting">
                    <span>Initialize Transmission</span>
                    <div class="btn-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                  <div class="btn-loader" v-else>
                    <div class="loader-dot"></div>
                    <div class="loader-dot"></div>
                    <div class="loader-dot"></div>
                  </div>
                </button>
                
                <Transition name="fade-in">
                  <div v-if="submitted" class="success-toast">
                    <div class="toast-icon">✨</div>
                    <span>Transmission authenticated. Awaiting connection.</span>
                  </div>
                </Transition>
              </form>
            </div>

            <!-- Right Side: Info Sidebar -->
            <div class="modal-info-sidebar">
              <div class="sidebar-pattern"></div>
              
              <div class="sidebar-content">
                <div class="info-card">
                  <div class="card-icon-hub">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="card-details">
                    <span class="card-label">HEADQUARTERS</span>
                    <h3>101 Agentic Way</h3>
                    <p>San Francisco, CA 94105</p>
                  </div>
                </div>
                
                <div class="info-card">
                  <div class="card-icon-hub">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div class="card-details">
                    <span class="card-label">DIRECT LINES</span>
                    <h3>hello@dreamactic.ai</h3>
                    <p>+1 (555) 888-2026</p>
                  </div>
                </div>

                <div class="sidebar-footer">
                  <span class="footer-label">ORCHESTRATE THE FUTURE</span>
                  <div class="social-links-minimal">
                    <a href="#" class="minimal-link">Twitter</a>
                    <a href="#" class="minimal-link">LinkedIn</a>
                    <a href="#" class="minimal-link">GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const options = [
  { label: 'Enterprise Orchestration', value: 'enterprise' },
  { label: 'Core Agentic Platform', value: 'platform' },
  { label: 'Strategic Partnerships', value: 'partnership' },
  { label: 'General Discovery', value: 'general' }
]

const isDropdownOpen = ref(false)
const selectedLabel = computed(() => {
  const option = options.find(o => o.value === form.value.subject)
  return option ? option.label : null
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectOption = (option) => {
  form.value.subject = option.value
  isDropdownOpen.value = false
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Directive for clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const submitting = ref(false)
const submitted = ref(false)

const handleSubmit = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => { 
      submitted.value = false
      emit('close')
    }, 3000)
  }, 1800)
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
    isDropdownOpen.value = false
  }
})

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    if (isDropdownOpen.value) {
      isDropdownOpen.value = false
    } else {
      emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: var(--glass-bg);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  width: 100%;
  max-width: 1050px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 50px 100px -20px rgba(0, 0, 0, 0.5),
    0 30px 60px -30px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

/* Ambient Blobs */
.modal-blobs {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}

.blob {
  position: absolute;
  filter: blur(80px);
  border-radius: 50%;
  animation: blob-float 25s infinite alternate ease-in-out;
}

.blob-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
  top: -150px; right: -50px;
}

.blob-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
  bottom: -100px; left: -50px;
  animation-delay: -7s;
}

.blob-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
  top: 30%; left: 20%;
  animation-delay: -14s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  50% { transform: translate(40px, 60px) scale(1.1) rotate(5deg); }
  100% { transform: translate(-20px, 20px) scale(0.9) rotate(-5deg); }
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 2rem; right: 2rem;
  width: 44px; height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 30;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg) scale(1.05);
  border-color: var(--accent-primary);
}

.modal-layout {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  min-height: 650px;
}

/* Form Section */
.modal-form-section {
  padding: 4.5rem;
  background: rgba(255, 255, 255, 0.005);
}

.header-badge {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--accent-primary);
  margin-bottom: 1rem;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 4px;
}

.form-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--accent-primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.form-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 90%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  opacity: 0.7;
}

.input-container {
  position: relative;
}

input, .dropdown-trigger, textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  outline: none;
}

.dark-theme input, .dark-theme .dropdown-trigger, .dark-theme textarea {
  background: rgba(255, 255, 255, 0.02);
}

input:focus, .dropdown-trigger.is-active, textarea:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--accent-primary);
  box-shadow: 
    0 0 0 5px rgba(99, 102, 241, 0.08),
    0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Custom Dropdown Styling */
.custom-dropdown {
  position: relative;
  user-select: none;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-trigger span {
  opacity: 1;
}

.dropdown-trigger:not(.is-active) span:empty::before {
  content: attr(placeholder);
  opacity: 0.5;
}

.select-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.select-arrow.rotate {
  transform: rotate(180deg);
  color: var(--accent-primary);
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  padding: 0.5rem;
  list-style: none;
  z-index: 100;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.dropdown-options li {
  padding: 0.9rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-options li:hover {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  padding-left: 1.25rem;
}

.dropdown-options li.is-selected {
  background: rgba(99, 102, 241, 0.15);
  color: var(--accent-primary);
  font-weight: 600;
}

.option-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0;
  transition: all 0.2s;
}

.dropdown-options li:hover .option-dot,
.dropdown-options li.is-selected .option-dot {
  opacity: 1;
  transform: scale(1.2);
}

.check-icon {
  margin-left: auto;
  color: var(--accent-primary);
}

/* Dropdown Animation */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* Submit Button */
.submit-btn {
  width: 100%;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  overflow: hidden;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 28px; height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 20px 40px -10px rgba(99, 102, 241, 0.5),
    0 0 20px rgba(99, 102, 241, 0.2);
}

.submit-btn:hover .btn-icon {
  transform: translateX(3px);
}

.btn-loader {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.loader-dot {
  width: 8px; height: 8px;
  background: white;
  border-radius: 50%;
  animation: dot-pulse 0.6s infinite alternate;
}

.loader-dot:nth-child(2) { animation-delay: 0.2s; }
.loader-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}

.success-toast {
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Sidebar Section */
.modal-info-sidebar {
  padding: 4.5rem;
  background: var(--accent-primary);
  color: white;
  position: relative;
  display: flex;
  align-items: center;
}

.sidebar-pattern {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
  opacity: 0.5;
}

.sidebar-content {
  position: relative;
  z-index: 10;
  width: 100%;
}

.info-card {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  transition: all 0.3s;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.card-icon-hub {
  width: 56px; height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  opacity: 0.7;
  margin-bottom: 0.4rem;
  display: block;
}

.card-details h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card-details p {
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.4;
}

.sidebar-footer {
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.footer-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 1.25rem;
  display: block;
}

.social-links-minimal {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.minimal-link {
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.7;
  transition: all 0.2s;
}

.minimal-link:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: 0.1s;
}

.modal-fade-enter-from .modal-card {
  transform: scale(0.92) translateY(50px);
  filter: blur(15px);
}

@media (max-width: 950px) {
  .modal-card {
    max-width: 600px;
    border-radius: 30px;
  }
  .modal-layout { 
    grid-template-columns: 1fr; 
    min-height: auto;
  }
  .modal-info-sidebar { display: none; }
  .modal-form-section { padding: 4rem 2.5rem 3rem; }
  .form-grid { grid-template-columns: 1fr; }
  .form-header h2 { font-size: 2rem; }
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 0.75rem;
  }
  .modal-card {
    max-height: 96vh;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    /* Removed overflow: hidden to allow very small screens to scroll if absolutely necessary, 
       but aiming for no-scroll on 375x812 */
  }
  .modal-layout {
    flex: 1;
  }
  .modal-form-section {
    padding: 2.5rem 1.25rem 1.5rem;
  }
  .header-badge, .form-header p {
    display: none; /* Hide for vertical space */
  }
  .form-header h2 {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
    text-align: center;
  }
  .close-btn {
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    padding: 0;
  }
  .form-group {
    margin-bottom: 0.8rem;
  }
  .form-group label {
    font-size: 0.65rem;
    margin-bottom: 0.4rem;
  }
  input, .dropdown-trigger, textarea {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  textarea {
    min-height: 80px; /* Reduced height */
  }
  .submit-btn {
    padding: 1rem;
    font-size: 1rem;
    margin-top: 0.5rem;
    border-radius: 14px;
  }
}

@media (max-width: 400px) {
  .modal-form-section {
    padding: 2.2rem 1rem 1.2rem;
  }
  .form-header h2 {
    font-size: 1.35rem;
  }
}
</style>
