<template>
  <Teleport to="body">
    <Transition name="demo-modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card">
          <!-- Background Effects -->
          <div class="background-mesh"></div>
          <div class="accent-glow"></div>

          <!-- Close Button -->
          <button class="close-btn" @click="$emit('close')" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-content">
            <div class="header">
              <div class="badge">{{ modalType === 'trial' ? 'PLATFORM ACCESS' : 'STRATEGY SESSION' }}</div>
              <h2>{{ dynamicTitle || (modalType === 'trial' ? 'Initialize your Neural Trial' : 'Schedule your Vision Demo') }}</h2>
              <p>{{ dynamicSubtitle || 'Deployment engineers are standing by to architect your autonomous future.' }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="demo-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" v-model="form.name" placeholder="Sarah Jenkins" required />
                </div>
                <div class="form-group">
                  <label>Work Email</label>
                  <input type="email" v-model="form.email" placeholder="sarah@global.ai" required />
                </div>
                <div class="form-group">
                  <label>Company Website</label>
                  <input type="url" v-model="form.website" placeholder="https://global.ai" />
                </div>
                <div class="form-group">
                  <label>Service Vertical</label>
                  <select v-model="form.vertical">
                    <option value="enterprise">Enterprise Orchestration</option>
                    <option value="bpo">Autonomous BPO</option>
                    <option value="retail">Immersive Retail (SuperFiitter)</option>
                    <option value="voice">Voice Intelligence (EchoAI)</option>
                  </select>
                </div>
              </div>

              <div class="form-group full-width">
                <label>Primary Use Case</label>
                <textarea v-model="form.message" rows="3" placeholder="Tell us about the logic you're looking to automate..."></textarea>
              </div>

              <button type="submit" class="cta-submit" :disabled="loading">
                <span v-if="!loading">{{ modalType === 'trial' ? 'Get Direct Access' : 'Confirm Selection' }}</span>
                <div class="loader" v-else>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </button>

              <Transition name="success-fade">
                <div v-if="success" class="success-alert">
                  <div class="check-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div class="success-text">
                    <strong>Transmission Authenticated</strong>
                    <span>An engineer will contact you in < 2 hours.</span>
                  </div>
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
  modalType: {
    type: String, // 'trial' or 'demo'
    default: 'demo'
  },
  dynamicTitle: String,
  dynamicSubtitle: String,
  initialMessage: String
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  email: '',
  website: '',
  vertical: 'enterprise',
  message: ''
})

const loading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    const submissionData = {
      name: form.value.name,
      email: form.value.email,
      subject: `${props.modalType === 'trial' ? 'Trial Request' : 'Demo Request'}: ${form.value.vertical}`,
      message: `Website: ${form.value.website || 'N/A'}\n\nUse Case: ${form.value.message}`
    }
    await api.contact.submit(submissionData)
    loading.value = false
    success.value = true
    setTimeout(() => {
      success.value = false
      emit('close')
    }, 4000)
  } catch (err) {
    console.error('Failed to submit demo/trial request:', err)
    loading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    if (props.initialMessage) form.value.message = props.initialMessage
  } else {
    document.body.style.overflow = ''
    form.value = { name: '', email: '', website: '', vertical: 'enterprise', message: '' }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  z-index: 10005;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  width: 100%;
  max-width: 800px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.82);
}

.background-mesh {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%);
  opacity: 0.5;
  pointer-events: none;
}

.accent-glow {
  position: absolute;
  top: -20%; right: -20%;
  width: 60%; height: 60%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}

.modal-content {
  position: relative;
  z-index: 1;
  padding: 4.5rem;
}

.close-btn {
  position: absolute;
  top: 2rem; right: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 44px; height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(219, 39, 119, 0.15);
  border-color: #db2777;
  color: #db2777;
  transform: rotate(90deg);
}

.badge {
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.25em;
  color: #10B981;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
}

h2 {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
  margin-bottom: 1rem;
  color: white;
}

.text-gradient {
  background: linear-gradient(135deg, #10B981, #3B82F6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin-bottom: 3.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.full-width {
  grid-column: span 2;
}

label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

input, textarea, select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.1rem;
  color: white;
  font-family: inherit;
  font-size: 1.05rem;
  transition: all 0.3s;
  outline: none;
}

input:focus, textarea:focus, select:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: #3B82F6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.1rem center;
  background-size: 1rem;
}

.cta-submit {
  width: 100%;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 1.3rem;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.cta-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
  filter: brightness(1.1);
}

.loader {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px; height: 8px;
  background: white;
  border-radius: 50%;
  animation: dot-jump 0.6s infinite alternate;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-jump {
  from { transform: translateY(0); opacity: 0.4; }
  to { transform: translateY(-6px); opacity: 1; }
}

.success-alert {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  animation: slide-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.check-circle {
  width: 48px; height: 48px;
  background: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.check-circle svg { width: 24px; height: 24px; }

.success-text {
  display: flex;
  flex-direction: column;
}

.success-text strong {
  font-size: 1.1rem;
  color: white;
  margin-bottom: 0.2rem;
}

.success-text span {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Transitions */
.demo-modal-fade-enter-active,
.demo-modal-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.demo-modal-fade-enter-from,
.demo-modal-fade-leave-to {
  opacity: 0;
}

.demo-modal-fade-enter-active .modal-card {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1.1);
}

.demo-modal-fade-enter-from .modal-card {
  transform: scale(0.95) translateY(40px);
}

@media (max-width: 850px) {
  .modal-content { padding: 3rem 2rem; }
  .form-grid { grid-template-columns: 1fr; gap: 1rem; }
  .full-width { grid-column: auto; }
  h2 { font-size: 2rem; }
}
</style>
