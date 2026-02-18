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
                <div class="header-badge">CAREERS</div>
                <h2>Apply for <span class="text-gradient">{{ roleTitle || 'the Future' }}</span></h2>
                <p>Join our mission to advance autonomous AI. Complete the transmission to begin your journey.</p>
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

                <div class="form-grid">
                  <div class="form-group">
                    <label>Phone Number</label>
                    <div class="input-container">
                      <input type="tel" v-model="form.phone" placeholder="+1 (555) 000-0000" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Current Location</label>
                    <div class="input-container">
                      <input type="text" v-model="form.location" placeholder="San Francisco, CA" required />
                    </div>
                  </div>
                </div>

                <div class="form-grid">
                  <!-- Experience Level Dropdown -->
                  <div class="form-group">
                    <label>Experience Level</label>
                    <div class="input-container custom-dropdown" v-click-outside="() => closeDropdown('exp')">
                      <div 
                        class="dropdown-trigger" 
                        :class="{ 'is-active': activeDropdown === 'exp' }"
                        @click="toggleDropdown('exp')"
                      >
                        <span>{{ experienceLabel || 'Select level...' }}</span>
                        <div class="select-arrow" :class="{ 'rotate': activeDropdown === 'exp' }">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                      <Transition name="dropdown-slide">
                        <ul v-if="activeDropdown === 'exp'" class="dropdown-options">
                          <li 
                            v-for="opt in experienceOptions" 
                            :key="opt.value"
                            @click="selectOption('experience', opt)"
                            :class="{ 'is-selected': form.experience === opt.value }"
                          >
                            <div class="option-dot"></div>
                            <span>{{ opt.label }}</span>
                          </li>
                        </ul>
                      </Transition>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Salary Expectation</label>
                    <div class="input-container">
                      <input type="text" v-model="form.salary" placeholder="e.g. $150k - $180k" required />
                    </div>
                  </div>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>LinkedIn URL</label>
                    <div class="input-container">
                      <input type="url" v-model="form.linkedin" placeholder="https://linkedin.com/in/alex" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>GitHub / Portfolio</label>
                    <div class="input-container">
                      <input type="url" v-model="form.portfolio" placeholder="https://github.com/alex" required />
                    </div>
                  </div>
                </div>

                <div class="form-grid">
                  <!-- Notice Period Dropdown -->
                  <div class="form-group">
                    <label>Notice Period</label>
                    <div class="input-container custom-dropdown" v-click-outside="() => closeDropdown('notice')">
                      <div 
                        class="dropdown-trigger" 
                        :class="{ 'is-active': activeDropdown === 'notice' }"
                        @click="toggleDropdown('notice')"
                      >
                        <span>{{ noticeLabel || 'Select availability...' }}</span>
                        <div class="select-arrow" :class="{ 'rotate': activeDropdown === 'notice' }">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </div>
                      <Transition name="dropdown-slide">
                        <ul v-if="activeDropdown === 'notice'" class="dropdown-options">
                          <li 
                            v-for="opt in noticeOptions" 
                            :key="opt.value"
                            @click="selectOption('notice', opt)"
                            :class="{ 'is-selected': form.notice === opt.value }"
                          >
                            <div class="option-dot"></div>
                            <span>{{ opt.label }}</span>
                          </li>
                        </ul>
                      </Transition>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Resume (Upload or Link)</label>
                    <div class="input-container resume-input-group">
                      <div class="file-upload-wrapper" :class="{ 'has-file': resumeFile }">
                        <input 
                          type="file" 
                          id="resume-upload" 
                          @change="handleFileChange" 
                          accept=".pdf,.doc,.docx"
                          class="file-input"
                        />
                        <label for="resume-upload" class="file-label">
                          <svg v-if="!resumeFile" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span v-if="!resumeFile">Upload PDF</span>
                          <span v-else class="file-name">{{ resumeFile.name }}</span>
                          <button v-if="resumeFile" @click.prevent="removeFile" class="remove-file-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </label>
                      </div>
                      <span class="or-separator">OR</span>
                      <input type="url" v-model="form.resume" placeholder="Link to Resume" :disabled="!!resumeFile" />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Your Vision / Why Dreamactic?</label>
                  <div class="input-container">
                    <textarea v-model="form.message" rows="3" placeholder="How will you help us orchestrate the next generation of autonomous intelligence?" required></textarea>
                  </div>
                </div>

                <button type="submit" class="submit-btn" :disabled="submitting">
                  <div class="btn-inner" v-if="!submitting">
                    <span>Submit Application</span>
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
                    <span>Application transmitted. Awaiting system review.</span>
                  </div>
                </Transition>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { jobsAPI } from '@/services/api'

const props = defineProps({
  isOpen: Boolean,
  roleTitle: String
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  salary: '',
  linkedin: '',
  portfolio: '',
  notice: '',
  resume: '',
  message: ''
})

const resumeFile = ref(null)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    resumeFile.value = file
    form.value.resume = '' // Clear text field if file selected
  }
}

const removeFile = () => {
  resumeFile.value = null
  const input = document.getElementById('resume-upload')
  if (input) input.value = ''
}

const uploadResume = async () => {
  if (!resumeFile.value) return null
  
  const formData = new FormData()
  formData.append('file', resumeFile.value)
  
  try {
    const response = await fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Resume upload failed:', error)
    return null
  }
}

const experienceOptions = [
  { label: 'Junior (0-2 years)', value: 'junior' },
  { label: 'Mid-Level (3-5 years)', value: 'mid' },
  { label: 'Senior (5-8 years)', value: 'senior' },
  { label: 'Staff / Principal (8+ years)', value: 'staff' }
]

const noticeOptions = [
  { label: 'Immediate', value: 'immediate' },
  { label: '15 Days', value: '15days' },
  { label: '30 Days', value: '30days' },
  { label: '2 Months +', value: '60days' }
]

const activeDropdown = ref(null)

const experienceLabel = computed(() => {
  const opt = experienceOptions.find(o => o.value === form.value.experience)
  return opt ? opt.label : null
})

const noticeLabel = computed(() => {
  const opt = noticeOptions.find(o => o.value === form.value.notice)
  return opt ? opt.label : null
})

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const selectOption = (field, opt) => {
  form.value[field] = opt.value
  activeDropdown.value = null
}

const closeDropdown = (id) => {
  if (activeDropdown.value === id) activeDropdown.value = null
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

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    let finalResumeUrl = form.value.resume
    
    // Handle file upload if present
    if (resumeFile.value) {
      const uploadedUrl = await uploadResume()
      if (!uploadedUrl) {
        submitting.value = false
        alert('Resume upload failed. Please try again or provide a link.')
        return
      }
      finalResumeUrl = uploadedUrl
    }
    
    if (!finalResumeUrl) {
      submitting.value = false
      alert('Please provide a resume by uploading a file or entering a link.')
      return
    }

    // Prepare application data
    const applicationData = {
      ...form.value,
      resume: finalResumeUrl,
      role: props.roleTitle
    }
    
    // Call real API
    await jobsAPI.submitApplication(applicationData)
    
    submitting.value = false
    submitted.value = true
    
    // Reset form
    Object.keys(form.value).forEach(key => form.value[key] = '')
    resumeFile.value = null
    
    setTimeout(() => { 
      submitted.value = false
      emit('close')
    }, 3000)
  } catch (error) {
    console.error('Failed to submit application:', error)
    alert('Failed to submit your application. Please try again later.')
    submitting.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  }
})

const handleEsc = (e) => {
  if (e.key === 'Escape') {
    emit('close')
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
  max-width: 800px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 50px 100px -20px rgba(0, 0, 0, 0.5),
    0 30px 60px -30px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  display: flex;
}

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
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
  top: -150px; right: -50px;
}

.blob-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%);
  bottom: -100px; left: -50px;
  animation-delay: -7s;
}

.blob-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
  top: 30%; left: 20%;
  animation-delay: -14s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  50% { transform: translate(40px, 60px) scale(1.1) rotate(5deg); }
  100% { transform: translate(-20px, 20px) scale(0.9) rotate(-5deg); }
}

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
  border-color: #10b981;
}

.modal-layout {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 650px;
}

.modal-form-section {
  padding: 4.5rem;
  background: rgba(255, 255, 255, 0.005);
  overflow-y: auto;
  max-height: 90vh;
  scrollbar-width: none; /* Firefox */
}

.modal-form-section::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.header-badge {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #10b981;
  margin-bottom: 1rem;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(16, 185, 129, 0.1);
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
  background: linear-gradient(135deg, #10b981, #34d399);
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
  grid-template-columns: 1fr 1fr;
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

input, textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input:focus, textarea:focus {
  background: rgba(255, 255, 255, 0.05);
  border-color: #10b981;
  box-shadow: 
    0 0 0 4px rgba(16, 185, 129, 0.1),
    0 10px 30px -10px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.35rem;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.3);
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
  background: #059669;
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 20px 40px -10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.2);
}

.submit-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Custom Dropdown Styling */
.custom-dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-trigger {
  width: 100%;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.dark-theme .dropdown-trigger {
  background: rgba(255, 255, 255, 0.02);
}

.dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(16, 185, 129, 0.5);
}

.dropdown-trigger.is-active {
  background: rgba(255, 255, 255, 0.08);
  border-color: #10b981;
  box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.08);
}

.dropdown-trigger span {
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-arrow {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #10b981;
}

.select-arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #111; /* Fallback */
  background: var(--glass-bg);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  padding: 0.6rem;
  list-style: none;
  z-index: 100;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dropdown-options li {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
}

.dropdown-options li:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding-left: 1.25rem;
}

.dropdown-options li.is-selected {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.option-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.2s;
}

li:hover .option-dot,
li.is-selected .option-dot {
  opacity: 1;
  transform: scale(1.5);
}

/* Animations */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* Resume Upload Styling */
.resume-input-group {
  display: flex !important;
  align-items: center;
  gap: 1rem;
}

.file-upload-wrapper {
  position: relative;
  flex: 1;
}

.file-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.file-label {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed var(--glass-border);
  border-radius: 16px;
  padding: 0.85rem 1rem !important;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600 !important;
  margin-bottom: 0 !important;
  opacity: 1 !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}

.file-upload-wrapper.has-file .file-label {
  border-style: solid;
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.file-label:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #10b981;
}

.file-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 6px;
  color: #ef4444;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-file-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.or-separator {
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--text-secondary);
  opacity: 0.5;
}

.resume-input-group input[type="url"] {
  flex: 1.2;
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
    max-height: 96vh;
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
    border-radius: 20px;
  }
  .modal-form-section {
    padding: 2.5rem 1.25rem 1.5rem;
  }
}
</style>
