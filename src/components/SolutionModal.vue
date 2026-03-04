<template>
  <Teleport to="body">
    <Transition name="solution-modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" :style="{ '--solution-accent': accentColor }">
          <!-- Animated Background Glow -->
          <div class="glow-container">
            <div class="solution-glow"></div>
          </div>

          <!-- Close Button is inside modal-content for correct stacking -->

          <div class="modal-content">
            <!-- Close Button inside stacking context -->
            <button class="close-btn" @click="$emit('close')" aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="header-section">
              <div class="solution-badge">SOLUTION INQUIRY</div>
              <h2 class="solution-title">Explore <span class="text-gradient">{{ solutionTitle || 'Agentic Swarms' }}</span></h2>
              <p class="subtitle">Customizing neural architecture for your specific business logic.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="inquiry-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" v-model="form.name" placeholder="John Doe" required />
                </div>
                <div class="form-group">
                  <label>Work Email</label>
                  <input type="email" v-model="form.email" placeholder="john@enterprise.ai" required />
                </div>
              </div>

              <div class="form-group">
                <label>Special Requirements</label>
                <textarea 
                  v-model="form.message" 
                  rows="4" 
                  placeholder="Describe your use case or specific technical requirements..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="submit-btn" :disabled="submitting">
                <span v-if="!submitting">Initialize Connection</span>
                <div class="loader" v-else>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </button>

              <Transition name="fade">
                <div v-if="submitted" class="success-message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Request Transmitted Successfully</span>
                </div>
              </Transition>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  isOpen: Boolean,
  solutionTitle: String,
  initialMessage: String,
  accentColor: {
    type: String,
    default: 'var(--accent-primary)'
  }
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  try {
    const submissionData = {
      ...form.value,
      subject: `Solution Inquiry: ${props.solutionTitle || 'Custom Architecture'}`
    }
    await api.contact.submit(submissionData)
    submitting.value = false
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
      emit('close')
    }, 3000)
  } catch (err) {
    console.error('Failed to submit solution inquiry:', err)
    submitting.value = false
    // You could add an error message state here if needed
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    form.value.message = props.initialMessage || ''
  } else {
    document.body.style.overflow = ''
    form.value = { name: '', email: '', message: '' }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  width: 100%;
  max-width: 600px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.glow-container {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 0;
}

.solution-glow {
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, var(--solution-accent) 0%, transparent 70%);
  opacity: 0.15;
  filter: blur(60px);
  animation: pulse 8s infinite alternate;
}

@keyframes pulse {
  0% { transform: scale(1) translate(0, 0); opacity: 0.1; }
  100% { transform: scale(1.2) translate(10px, 10px); opacity: 0.2; }
}

.modal-content {
  position: relative;
  z-index: 1;
  padding: 3.5rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  color: var(--text-primary);
  width: 38px; height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10; /* Ensure it sits above the glow-container */
  position: absolute; /* Reaffirm stacking context */
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.solution-badge {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--solution-accent);
  background: rgba(255, 255, 255, 0.05);
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
}

.solution-title {
  font-size: 2.2rem;
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--solution-accent), #fff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

input, textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s;
  outline: none;
}

input:focus, textarea:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--solution-accent);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.submit-btn {
  width: 100%;
  background: var(--solution-accent);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.4s;
  position: relative;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.loader {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 6px; height: 6px;
  background: white;
  border-radius: 50%;
  animation: bounce 0.5s infinite alternate;
}

.dot:nth-child(2) { animation-delay: 0.1s; }
.dot:nth-child(3) { animation-delay: 0.2s; }

@keyframes bounce {
  from { transform: translateY(0); opacity: 0.5; }
  to { transform: translateY(-4px); opacity: 1; }
}

.success-message {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #10b981;
  font-weight: 700;
  font-size: 0.9rem;
}

.success-message svg {
  width: 18px; height: 18px;
}

/* Transitions */
.solution-modal-fade-enter-active,
.solution-modal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.solution-modal-fade-enter-from,
.solution-modal-fade-leave-to {
  opacity: 0;
}

.solution-modal-fade-enter-active .modal-card {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.solution-modal-fade-enter-from .modal-card {
  transform: scale(0.9) translateY(20px);
  filter: blur(10px);
}

@media (max-width: 650px) {
  .modal-content { padding: 2.5rem 1.5rem; }
  .form-row { grid-template-columns: 1fr; }
  .solution-title { font-size: 1.8rem; }
}
</style>
