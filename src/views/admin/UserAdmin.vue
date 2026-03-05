<template>
  <div class="user-admin">
    <div class="header">
      <div class="title-area">
        <h1>User Management</h1>
        <p>Manage administrative access and system users</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
        Add User
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching neural access logs...</p>
    </div>

    <div v-else class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :class="{ 'admin-row': user.username === 'admin' }">
            <td>
              <div class="table-user-cell">
                <div class="table-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
                <div class="table-username">
                  {{ user.username }}
                  <span v-if="user.username === 'admin'" class="master-badge">MASTER</span>
                </div>
              </div>
            </td>
            <td class="text-secondary">{{ user.email }}</td>
            <td>
              <span class="role-pill" :class="user.role">{{ user.role }}</span>
            </td>
            <td class="text-secondary">{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="table-actions">
                <button @click="editUser(user)" class="btn-icon" title="Edit User">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button v-if="user.username !== 'admin'" @click="confirmDelete(user)" class="btn-icon delete" title="Delete User">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Neural Access' : 'Create New User' }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="handleSubmit" class="user-form">
          <div class="form-group">
            <label>Username</label>
            <input v-model="form.username" type="text" required placeholder="e.g. jsmith" :disabled="showEditModal && form.username === 'admin'" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="form.email" type="email" required placeholder="e.g. john@dreamactic.com" />
          </div>
          <div class="form-group">
            <label>{{ showEditModal ? 'New Password (Optional)' : 'Password' }}</label>
            <input v-model="form.password" type="password" :required="!showEditModal" placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label>Access Role</label>
            <select v-model="form.role">
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Processing...' : (showEditModal ? 'Save Changes' : 'Create User') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAPI } from '@/services/api'

const users = ref([])
const loading = ref(true)
const submitting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentUserId = ref(null)

const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'admin'
})

const fetchUsers = async () => {
  try {
    loading.ref = true
    const response = await adminAPI.getUsers()
    users.value = response
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentUserId.value = null
  form.value = { username: '', email: '', password: '', role: 'admin' }
}

const editUser = (user) => {
  currentUserId.value = user.id
  form.value = {
    username: user.username,
    email: user.email,
    password: '',
    role: user.role
  }
  showEditModal.value = true
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    if (showEditModal.value) {
      const data = { ...form.value }
      if (!data.password) delete data.password
      await adminAPI.updateUser(currentUserId.value, data)
    } else {
      await adminAPI.createUser(form.value)
    }
    await fetchUsers()
    closeModal()
  } catch (error) {
    alert(error.response?.data?.detail || 'Handshake failed')
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (user) => {
  if (!confirm(`Are you sure you want to revoke access for ${user.username}?`)) return
  try {
    await adminAPI.deleteUser(user.id)
    await fetchUsers()
  } catch (error) {
    alert(error.response?.data?.detail || 'Deactivation failed')
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.user-admin {
  padding: 2rem;
  color: var(--text-primary);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title-area h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-area p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.table-container {
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 16px;
  overflow: hidden;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.user-table th {
  padding: 1.25rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--grid-color);
  background: rgba(0, 0, 0, 0.2);
}

.user-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--grid-color);
  vertical-align: middle;
}

.user-table tbody tr {
  transition: background-color 0.2s;
}

.user-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.user-table tbody tr:last-child td {
  border-bottom: none;
}

.admin-row {
  background: rgba(99, 102, 241, 0.03);
}

.table-user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-avatar {
  width: 36px;
  height: 36px;
  background: var(--accent-primary);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.table-username {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.master-badge {
  background: var(--accent-primary);
  color: white;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.role-pill {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.role-pill.admin {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.role-pill.editor {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.text-secondary {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.actions-header {
  text-align: right;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--grid-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.btn-icon.delete:hover {
  background: #ef4444;
  border-color: #ef4444;
}

/* Modals & Forms */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--grid-color);
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-group input, .form-group select {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--grid-color);
  border-radius: 10px;
  padding: 0.8rem;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: var(--accent-primary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.8rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  border: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--grid-color);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 10rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--grid-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
