<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content confirm-modal card-premium">
      <div class="confirm-icon-box" :class="{ danger: isDanger }">
        <span class="icon">{{ icon || '⚠️' }}</span>
      </div>
      
      <div class="confirm-content">
        <h2 class="confirm-title">{{ title }}</h2>
        <p class="confirm-message">{{ message }}</p>
      </div>

      <div class="confirm-actions">
        <button class="btn-ghost" @click="$emit('cancel')">{{ cancelLabel || 'Cancel' }}</button>
        <button 
          class="btn-premium" 
          :class="{ 'btn-danger': isDanger }" 
          @click="$emit('confirm')"
          :disabled="loading"
        >
          {{ loading ? 'Processing...' : (confirmLabel || 'Confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: String,
  cancelLabel: String,
  icon: String,
  isDanger: { type: Boolean, default: true },
  loading: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-modal {
  max-width: 450px;
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.confirm-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.confirm-icon-box.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
}

.confirm-title {
  font-size: 1.5rem;
  font-weight: 850;
  margin-bottom: 0.75rem;
  color: white;
}

.confirm-message {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
}

.confirm-actions button {
  flex: 1;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.2) !important;
}

.btn-danger:hover {
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.4) !important;
}
</style>
