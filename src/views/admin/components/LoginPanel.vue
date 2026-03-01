<template>
  <div class="login-wrapper">
    <div class="login-card shadow-2xl">
      <div class="restricted-tag">RESTRICTED ACCESS</div>
      <h1>{{ isMfaStep ? '2-Step Verification' : 'Admin Login' }}</h1>
      <p class="login-subtitle">
        {{ isMfaStep ? 'TOUCH YOUR SECURITY KEY' : 'DREAMATIC CMS • Global Admin' }}
      </p>
      
      <div v-if="!isMfaStep">
        <form @submit.prevent="onLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username" 
              v-model="loginForm.username" 
              type="text" 
              placeholder="Enter username" 
              class="input-premium"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              v-model="loginForm.password" 
              type="password" 
              placeholder="Enter password" 
              class="input-premium"
              required 
            />
          </div>
          
          <button type="submit" class="btn-primary-luxe w-full" :disabled="loading">
            <span class="btn-text" v-if="loading">Verifying Node...</span>
            <span class="btn-text" v-else>Authorize Access</span>
          </button>
        </form>
      </div>

      <div v-else class="mfa-step text-center">
        <div class="yubikey-icon-wrapper">
          <div class="yubikey-pulse"></div>
          <span class="yubikey-icon">🔑</span>
        </div>
        <p class="mfa-description">Insert your YubiKey and touch the gold sensor to verify your identity.</p>
        
        <button @click="startMfaProcess" class="btn-primary-luxe w-full" :disabled="loading">
          <span class="btn-text" v-if="loading">Waiting for touch...</span>
          <span class="btn-text" v-else>Verify via Security Key</span>
        </button>

        <button @click="isMfaStep = false" class="btn-text text-sm mt-6 text-muted-gradient border-none bg-transparent hover:opacity-100">
          ← Back to Password
        </button>
      </div>

      <transition name="fade">
        <p v-if="error" class="error-message mt-4 text-center">{{ error }}</p>
      </transition>

      <div class="login-footer">
        <p>© 2026 Dreamatic Intelligence Network</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authAPI } from '@/services/api'
import { startAuthentication } from '@simplewebauthn/browser'

const props = defineProps({
  loading: Boolean,
  error: String
})

const emit = defineEmits(['login', 'mfa-verify'])

const loginForm = ref({ username: '', password: '' })
const isMfaStep = ref(false)
const mfaUsername = ref('')

const onLogin = async () => {
  // We let the parent handle the initial password login via emit
  // The parent implementation of handleLogin will return res if mfa_required
  emit('login', loginForm.value)
}

// Parent will call this via template or we handle logic here
const handleMfaRequired = (username) => {
  mfaUsername.value = username
  isMfaStep.value = true
  startMfaProcess() // Auto trigger
}

// Expose handleMfaRequired to parent
defineExpose({ handleMfaRequired })

const startMfaProcess = async () => {
  try {
    // 1. Get options from server
    const options = await authAPI.getMfaOptions(mfaUsername.value)
    
    // 2. Perform authentication with browser
    const asseResp = await startAuthentication({ optionsJSON: options })
    
    // 3. Verify with server
    await authAPI.verifyMfa(mfaUsername.value, asseResp)
    
    // 4. Success - parent will see token in storage or we signal
    window.location.reload() // Fastest way to trigger app state reload for admin
  } catch (err) {
    console.error('MFA Error:', err)
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1a2e 0%, #08080a 100%);
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 3rem;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.restricted-tag {
  font-size: 0.65rem;
  font-weight: 900;
  color: #ef4444;
  letter-spacing: 0.2em;
  margin-bottom: 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 12px;
  border-radius: 100px;
  display: inline-block;
}

h1 { font-size: 2rem; font-weight: 850; margin-bottom: 0.5rem; color: white; letter-spacing: -0.02em; }
.login-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2.5rem; text-transform: uppercase; letter-spacing: 0.1em; }

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }

.login-footer {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.65rem;
  color: #4b5563;
  font-weight: 600;
}

/* MFA Styling */
.mfa-step { padding: 1rem 0; }
.mfa-description { font-size: 0.85rem; color: #64748b; margin-bottom: 2rem; line-height: 1.6; }

.yubikey-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yubikey-icon {
  font-size: 2.5rem;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}

.yubikey-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  z-index: 1;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.5; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
