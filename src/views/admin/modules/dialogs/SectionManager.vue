<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content card-premium section-manager">
      <header class="modal-header">
        <h2>Provision Node Section</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </header>

      <p class="section-desc">Register a new intelligence node to partition and organize network insights.</p>

      <form @submit.prevent="handleSubmit" class="luxury-form">
        <div class="form-group">
          <label>Section Designation</label>
          <input v-model="form.label" type="text" placeholder="e.g. Synthetic Neuroscience" class="input-premium" required />
        </div>
        <div class="form-group">
          <label>Visual Identifier (Emoji)</label>
          <input v-model="form.icon" type="text" placeholder="🌌" class="input-premium" />
        </div>
        
        <div class="form-footer-actions">
          <button type="button" @click="$emit('close')" class="btn-ghost">Discard</button>
          <button type="submit" class="btn-primary-luxe">
            <span class="btn-text">Register Section</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['create', 'close'])

const form = ref({ label: '', icon: '🌐' })

const handleSubmit = () => {
  emit('create', { ...form.value })
  form.value = { label: '', icon: '🌐' }
}
</script>

<style scoped>
.section-desc { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.5; }
.form-footer-actions { margin-top: 1rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 1rem; }
</style>
