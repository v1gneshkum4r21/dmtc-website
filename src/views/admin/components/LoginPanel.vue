<template>
  <div class="login-wrapper">
    <div class="login-card shadow-2xl">
      <div class="restricted-tag">RESTRICTED ACCESS</div>
      <h1>Admin Login</h1>
      <p class="login-subtitle">DREAMATIC CMS • Global Admin</p>
      
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
        
        <transition name="fade">
          <p v-if="error" class="error-message mt-4 text-center">{{ error }}</p>
        </transition>
      </form>

      <div class="login-footer">
        <p>© 2026 Dreamatic Intelligence Network</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: Boolean,
  error: String
})

const emit = defineEmits(['login'])

const loginForm = ref({ username: '', password: '' })

const onLogin = () => {
  emit('login', loginForm.value)
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
.login-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2.5rem; }

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }

.login-footer {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.65rem;
  color: #4b5563;
  font-weight: 600;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
