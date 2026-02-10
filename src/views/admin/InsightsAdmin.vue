<template>
  <div class="admin-container">
    <!-- Login Form (if not authenticated) -->
    <div v-if="!isAuthenticated" class="login-wrapper">
      <div class="login-card">
        <div class="restricted-tag">RESTRICTED ACCESS</div>
        <h1>Admin Login</h1>
        <p class="login-subtitle">DREAMATIC CMS • Global Admin</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="Enter username"
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
              required
            />
          </div>
          
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard (if authenticated) -->
    <div v-else class="admin-dashboard">
      <!-- Sidebar Navigation -->
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <div class="brand-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <h2>DREAMATIC <span class="admin-label">ADMIN</span></h2>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <label>CORE MANAGEMENT</label>
            <div 
              class="nav-item"
              :class="{ active: activeModule === 'insights' }"
              @click="activeModule = 'insights'"
            >
              <span class="nav-icon">📁</span>
              <span>Content Manager</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeModule === 'showcase' }"
              @click="activeModule = 'showcase'"
            >
              <span class="nav-icon">✨</span>
              <span>Showcase Manager</span>
            </div>
            <div class="nav-item disabled" title="Coming Soon">
              <span class="nav-icon">👥</span>
              <span>User Management</span>
            </div>
            <div class="nav-item disabled" title="Coming Soon">
              <span class="nav-icon">🛡️</span>
              <span>Security & Access</span>
            </div>
          </div>

          <div class="nav-section">
            <label>CONFIGURATION</label>
            <div class="nav-item disabled">
              <span class="nav-icon">⚙️</span>
              <span>System Settings</span>
            </div>
            <div class="nav-item disabled">
              <span class="nav-icon">📊</span>
              <span>Analytics</span>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">AD</div>
            <div class="user-details">
              <span class="user-name">Administrator</span>
              <span class="user-role">Super Admin</span>
            </div>
          </div>
          <button @click="handleLogout" class="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-main">
        <header class="dashboard-header">
          <div class="header-breadcrumb">
            <span class="breadcrumb-root">Dashboard</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">{{ activeModuleTitle }}</span>
          </div>

          <div class="module-switcher">
            <div class="select-group">
              <label>Module:</label>
              <div class="select-wrapper">
                <select v-model="activeModule" class="module-select">
                  <option value="insights">Content Manager</option>
                  <option value="showcase">Showcase Manager</option>
                  <option value="users" disabled>User Permissions</option>
                </select>
                <span class="select-caret">▾</span>
              </div>
            </div>

            <div v-if="activeModule === 'insights'" class="select-group">
              <label>Page:</label>
              <div class="select-wrapper">
                <select v-model="selectedPage" class="module-select" @change="loadInsights">
                  <option value="">All Pages</option>
                  <option value="ai-work">AI Work</option>
                  <option value="ai-service">AI Service</option>
                  <option value="agentic">Agentic</option>
                </select>
                <span class="select-caret">▾</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <router-link :to="previewUrl" target="_blank" class="preview-link">
              View Website ↗
            </router-link>
            <button v-if="activeModule === 'insights'" @click="showCreateForm = true" class="btn-primary">
              + New Insight
            </button>
            <button v-if="activeModule === 'showcase'" @click="showShowcaseForm = true" class="btn-primary">
              + Add Media
            </button>
          </div>
        </header>

        <div class="dashboard-content">
          <!-- Module Content: Insights -->
          <div v-if="activeModule === 'insights'">
            <!-- ... insights list ... -->
            <div class="module-intro">
              <div class="intro-text">
                <h2>{{ activeModuleTitle }}</h2>
                <p>Managing content for: <span class="highlight">{{ selectedPageLabel }}</span></p>
              </div>
              <div class="quick-stats">
                <div class="stat-card">
                  <span class="stat-val">{{ insights.length }}</span>
                  <span class="stat-label">Total Articles</span>
                </div>
                <div class="stat-card">
                  <span class="stat-val">{{ insights.filter(i => i.published).length }}</span>
                  <span class="stat-label">Published</span>
                </div>
              </div>
            </div>

            <div class="insights-list">
              <div v-if="loading && insights.length === 0" class="loading">
                Loading insights...
              </div>

              <div v-else-if="insights.length === 0" class="empty-state">
                <p>No insights yet. Create your first one!</p>
              </div>

              <div v-else class="insights-grid">
                <div
                  v-for="insight in insights"
                  :key="insight._id"
                  class="insight-card"
                  :class="{ unpublished: !insight.published }"
                >
                  <div class="insight-header">
                    <h3>{{ insight.title }}</h3>
                    <span v-if="!insight.published" class="badge-draft">Draft</span>
                  </div>
                  
                  <div class="insight-meta">
                    <span>Last Updated: {{ formatDate(insight.updatedAt) }}</span>
                  </div>
                  
                  <p class="insight-excerpt">{{ insight.excerpt }}</p>
                  
                  <div class="insight-actions">
                    <button @click="startEdit(insight)" class="btn-edit">
                      Edit
                    </button>
                    <button @click="handleDelete(insight._id)" class="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Content: Showcase -->
          <div v-else-if="activeModule === 'showcase'">
            <div class="module-intro">
              <div class="intro-text">
                <h2>{{ activeModuleTitle }}</h2>
                <p>Managing the creative media museum</p>
              </div>
              <div class="quick-stats">
                <div class="stat-card">
                  <span class="stat-val">{{ showcaseItems.length }}</span>
                  <span class="stat-label">Total Items</span>
                </div>
                <div class="stat-card">
                  <span class="stat-val">{{ showcaseItems.filter(s => s.active).length }}</span>
                  <span class="stat-label">Active</span>
                </div>
              </div>
            </div>

            <div class="showcase-manager">
              <div v-if="loading && showcaseItems.length === 0" class="loading">
                Loading showcase items...
              </div>

              <div v-else-if="showcaseItems.length === 0" class="empty-state">
                <p>No media in showcase yet. Let's add something special!</p>
              </div>

              <div v-else class="showcase-admin-grid">
                <div
                  v-for="item in showcaseItems"
                  :key="item._id"
                  class="showcase-admin-card"
                  :class="{ inactive: !item.active }"
                >
                  <div class="card-preview">
                    <img v-if="item.mediaType === 'image'" :src="item.mediaUrl" alt="" />
                    <div v-else class="video-placeholder">
                      <span>🎬 Video</span>
                      <small>{{ item.mediaUrl.split('/').pop() }}</small>
                    </div>
                    <div class="card-type-badge">{{ item.mediaType.toUpperCase() }}</div>
                  </div>
                  <div class="card-content">
                    <div class="card-title-row">
                      <h3>{{ item.title }}</h3>
                      <span class="item-order">#{{ item.order }}</span>
                    </div>
                    <div class="card-details">
                      <span>{{ item.product }} • {{ item.size }}</span>
                    </div>
                    <div class="card-actions">
                      <button @click="startEditShowcase(item)" class="btn-edit">Edit</button>
                      <button @click="handleDeleteShowcase(item._id)" class="btn-delete">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other module placeholders could go here -->
          <div v-else class="empty-module">
            <h2>Select a module to manage</h2>
          </div>
        </div>
      </main>

      <!-- Create/Edit Form Modal (Scoped to Insights) -->
      <div v-if="(showCreateForm || editingInsight) && activeModule === 'insights'" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <h2>{{ editingInsight ? 'Edit Insight' : 'Create New Insight' }}</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="title">Title *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="Enter insight title"
                required
              />
            </div>

            <div class="form-group">
              <label for="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                v-model="form.excerpt"
                placeholder="Brief description of the insight"
                rows="3"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="content">Full Content *</label>
              <textarea
                id="content"
                v-model="form.content"
                placeholder="Full article content (supports markdown)"
                rows="10"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="author">Author</label>
                <input
                  id="author"
                  v-model="form.author"
                  type="text"
                  placeholder="DREAMATIC Team"
                />
              </div>

              <div class="form-group">
                <label for="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  v-model="form.imageUrl"
                  type="text"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div class="form-group">
              <label for="page">Target Page *</label>
              <select id="page" v-model="form.page" class="module-select" required>
                <option value="ai-work">AI Work</option>
                <option value="ai-service">AI Service</option>
                <option value="agentic">Agentic</option>
              </select>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="form.published" />
                Published
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Saving...' : (editingInsight ? 'Update' : 'Create') }}
              </button>
              <button type="button" @click="closeForm" class="btn-secondary">
                Cancel
              </button>
            </div>

            <p v-if="error" class="error-message">{{ error }}</p>
          </form>
        </div>
      </div>

      <!-- Create/Edit Form Modal (Scoped to Showcase) -->
      <div v-if="(showShowcaseForm || editingShowcase) && activeModule === 'showcase'" class="modal-overlay" @click.self="closeShowcaseForm">
        <div class="modal-content showcase-modal">
          <h2>{{ editingShowcase ? 'Edit Media Item' : 'Add New Media' }}</h2>
          
          <form @submit.prevent="handleShowcaseSubmit">
            <div class="form-group">
              <label for="sc-title">Title *</label>
              <input
                id="sc-title"
                v-model="showcaseForm.title"
                type="text"
                placeholder="e.g. Futuristic Fashion Editorial"
                required
              />
            </div>

            <div class="form-group">
              <label>Media Source *</label>
              <div class="media-source-toggle">
                <button type="button" :class="{ active: mediaSource === 'url' }" @click="mediaSource = 'url'">URL</button>
                <button type="button" :class="{ active: mediaSource === 'upload' }" @click="mediaSource = 'upload'">Upload File</button>
              </div>

              <div v-if="mediaSource === 'url'" class="url-input-group">
                <input
                  id="sc-mediaUrl"
                  v-model="showcaseForm.mediaUrl"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  :required="mediaSource === 'url'"
                  @input="detectMediaType"
                />
                <select v-model="showcaseForm.mediaType" class="type-select">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div v-else class="file-upload-group">
                <input
                  type="file"
                  id="sc-file"
                  @change="handleFileChange"
                  accept="image/*,video/*"
                  class="file-input"
                  :required="!editingShowcase && mediaSource === 'upload'"
                />
                <div v-if="selectedFile" class="file-info">
                  Selected: {{ selectedFile.name }} ({{ showcaseForm.mediaType }})
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="sc-product">Product *</label>
                <select id="sc-product" v-model="showcaseForm.product" class="module-select" required>
                  <option value="SuperFiitter">SuperFiitter</option>
                  <option value="EchoAI">EchoAI</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div class="form-group">
                <label for="sc-tag">Tag *</label>
                <input
                  id="sc-tag"
                  v-model="showcaseForm.tag"
                  type="text"
                  placeholder="e.g. FASHION"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="sc-size">Display Size (Card Height) *</label>
                <select id="sc-size" v-model="showcaseForm.size" class="module-select" required>
                  <option value="small">Small (280px)</option>
                  <option value="medium">Medium (400px)</option>
                  <option value="large">Large (560px)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="sc-order">Display Order</label>
                <input
                  id="sc-order"
                  v-model.number="showcaseForm.order"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="showcaseForm.active" />
                Active (Visible in Showcase)
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Saving...' : (editingShowcase ? 'Update' : 'Add to Gallery') }}
              </button>
              <button type="button" @click="closeShowcaseForm" class="btn-secondary">
                Cancel
              </button>
            </div>

            <p v-if="error" class="error-message">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authAPI, adminAPI } from '@/services/api'

const isAuthenticated = ref(false)
const loading = ref(false)
const error = ref('')
const insights = ref([])
const showcaseItems = ref([])
const showCreateForm = ref(false)
const showShowcaseForm = ref(false)
const editingInsight = ref(null)
const editingShowcase = ref(null)
const activeModule = ref('insights')
const selectedPage = ref('')
const mediaSource = ref('url')
const selectedFile = ref(null)

const showcaseForm = ref({
  title: '',
  description: '',
  mediaUrl: '',
  mediaType: 'image',
  product: 'SuperFiitter',
  tag: '',
  size: 'medium',
  order: 0,
  active: true
})

const activeModuleTitle = computed(() => {
  switch(activeModule.value) {
    case 'insights': return 'Content Manager'
    case 'users': return 'User Management'
    default: return 'Dashboard'
  }
})

const selectedPageLabel = computed(() => {
  if (!selectedPage.value) return 'All Website Sections'
  switch(selectedPage.value) {
    case 'ai-work': return 'AI Work — Insights'
    case 'ai-service': return 'AI Service — Media Intelligence'
    case 'platform': return 'Platform — Features'
    case 'agentic': return 'Agentic — Capabilities'
    case 'solutions': return 'Solutions — Case Studies'
    default: return selectedPage.value
  }
})

const previewUrl = computed(() => {
  if (!selectedPage.value) return '/services/ai-work'
  switch(selectedPage.value) {
    case 'ai-work': return '/services/ai-work'
    case 'ai-service': return '/services/ai-service'
    case 'platform': return '/products/platform'
    case 'agentic': return '/services/ai-work' // Agentic content is currently on AI work page
    case 'solutions': return '/products/solutions'
    default: return '/services/ai-work'
  }
})

const loginForm = ref({
  username: '',
  password: ''
})

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  author: 'DREAMATIC Team',
  imageUrl: '',
  page: 'ai-work',
  published: true
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  isAuthenticated.value = authAPI.isAuthenticated()
  if (isAuthenticated.value) {
    loadInsights()
    loadShowcase()
  }
})

const loadShowcase = async () => {
  loading.value = true
  try {
    showcaseItems.value = await adminAPI.getAllShowcase()
  } catch (err) {
    error.value = 'Failed to load showcase items'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const detectMediaType = () => {
  const url = showcaseForm.value.mediaUrl.toLowerCase()
  if (url.match(/\.(mp4|webm|ogg|mov)$/) || url.includes('coverr.co')) {
    showcaseForm.value.mediaType = 'video'
  } else {
    showcaseForm.value.mediaType = 'image'
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  selectedFile.value = file
  if (file.type.startsWith('video/')) {
    showcaseForm.value.mediaType = 'video'
  } else {
    showcaseForm.value.mediaType = 'image'
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authAPI.login(loginForm.value.username, loginForm.value.password)
    isAuthenticated.value = true
    await loadInsights()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authAPI.logout()
  isAuthenticated.value = false
  insights.value = []
}

const loadInsights = async () => {
  loading.value = true
  try {
    insights.value = await adminAPI.getAllInsights(selectedPage.value)
  } catch (err) {
    error.value = 'Failed to load insights'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (editingInsight.value) {
      await adminAPI.updateInsight(editingInsight.value._id, form.value)
    } else {
      await adminAPI.createInsight(form.value)
    }
    
    closeForm()
    await loadInsights()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to save insight'
  } finally {
    loading.value = false
  }
}

const startEdit = (insight) => {
  editingInsight.value = insight
  form.value = {
    title: insight.title,
    excerpt: insight.excerpt,
    content: insight.content,
    author: insight.author,
    imageUrl: insight.imageUrl || '',
    page: insight.page || 'ai-work',
    published: insight.published
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingInsight.value = null
  form.value = {
    title: '',
    excerpt: '',
    content: '',
    author: 'DREAMATIC Team',
    imageUrl: '',
    page: selectedPage.value || 'ai-work',
    published: true
  }
  error.value = ''
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this insight?')) {
    return
  }
  
  try {
    await adminAPI.deleteInsight(id)
    await loadInsights()
  } catch (err) {
    error.value = 'Failed to delete insight'
    console.error(err)
  }
}

// Showcase Handlers
const handleShowcaseSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 1. Handle file upload if needed
    if (mediaSource.value === 'upload' && selectedFile.value) {
      const uploadResult = await adminAPI.uploadFile(selectedFile.value)
      showcaseForm.value.mediaUrl = uploadResult.url
    }

    // 2. Save showcase item
    if (editingShowcase.value) {
      await adminAPI.updateShowcase(editingShowcase.value._id, showcaseForm.value)
    } else {
      await adminAPI.createShowcase(showcaseForm.value)
    }
    
    closeShowcaseForm()
    await loadShowcase()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to save showcase item'
  } finally {
    loading.value = false
  }
}

const startEditShowcase = (item) => {
  editingShowcase.value = item
  showcaseForm.value = {
    title: item.title,
    description: item.description || '',
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
    product: item.product,
    tag: item.tag,
    size: item.size,
    order: item.order,
    active: item.active
  }
  mediaSource.value = 'url' // Default to URL when editing
  selectedFile.value = null
}

const closeShowcaseForm = () => {
  showShowcaseForm.value = false
  editingShowcase.value = null
  mediaSource.value = 'url'
  selectedFile.value = null
  showcaseForm.value = {
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    product: 'SuperFiitter',
    tag: '',
    size: 'medium',
    order: 0,
    active: true
  }
  error.value = ''
}

const handleDeleteShowcase = async (id) => {
  if (!confirm('Are you sure you want to delete this media item?')) {
    return
  }
  
  try {
    await adminAPI.deleteShowcase(id)
    await loadShowcase()
  } catch (err) {
    error.value = 'Failed to delete showcase item'
    console.error(err)
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #0a0a0c;
  color: white;
}

/* Login Styles */
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.login-card {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-card h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.restricted-tag {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  display: inline-block;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Admin Dashboard Layout */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #0a0a0c;
}

/* Sidebar */
.admin-sidebar {
  width: 280px;
  background: #111114;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-brand {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
}

.dot:nth-child(2) { background: #a855f7; }
.dot:nth-child(3) { background: #ec4899; }

.sidebar-brand h2 {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  color: white;
}

.admin-label {
  color: #6366f1;
  font-size: 0.8rem;
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.sidebar-nav {
  padding: 1rem;
  flex: 1;
}

.nav-section {
  margin-bottom: 2.5rem;
}

.nav-section label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #4b5563;
  letter-spacing: 0.1em;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-item:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: #6366f1;
  border-left: 3px solid #6366f1;
}

.nav-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-icon {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 0.8rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
}

/* Main Content */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0a0a0c;
  overflow-x: hidden;
}

.dashboard-header {
  height: 80px;
  padding: 0 2.5rem;
  background: #111114;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.breadcrumb-root { color: #9ca3af; }
.breadcrumb-sep { color: #4b5563; }
.breadcrumb-current { color: white; font-weight: 600; }

.module-switcher {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.select-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-group label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper {
  position: relative;
  min-width: 200px;
}

.module-select {
  width: 100%;
  appearance: none;
  background: #1a1a1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.6rem 1rem;
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.select-caret {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.8rem;
  color: #6b7280;
}

.preview-link {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 1.5rem;
}

.dashboard-content {
  padding: 2.5rem;
  overflow-y: auto;
}

.module-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.intro-text h2 {
  font-size: 2.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 800;
}

.intro-text p {
  color: #6b7280;
  margin: 0;
}

.highlight {
  color: #a855f7;
  font-weight: 600;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  background: #1a1a1e;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-4px);
}

.insight-card.unpublished {
  opacity: 0.6;
}

.insight-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.insight-header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.badge-draft {
  background: #f59e0b;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.insight-meta {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.insight-excerpt {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.insight-actions {
  display: flex;
  gap: 0.5rem;
}

/* Buttons and Forms */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  background: #1a1a1e;
  color: #9ca3af;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  flex: 1;
  cursor: pointer;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  flex: 1;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #111114;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 2.5rem;
}

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #9ca3af; }
.form-group input, .form-group textarea {
  width: 100%;
  background: #1a1a1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem;
  color: white;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 2rem; }

.loading { padding: 3rem; text-align: center; }
.error-message { color: #ef4444; }

/* Showcase Manager Styles */
.showcase-manager {
  margin-top: 2rem;
}

.showcase-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.showcase-admin-card {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.showcase-admin-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-4px);
}

.showcase-admin-card.inactive {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.card-preview {
  height: 180px;
  position: relative;
  background: #1a1a1e;
}

.card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 0.5rem;
}

.card-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  color: white;
}

.card-content {
  padding: 1.25rem;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-title-row h3 {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-order {
  font-size: 0.75rem;
  color: #6366f1;
  font-weight: 800;
}

.card-details {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
}

.url-input-group {
  display: flex;
  gap: 0.5rem;
}

.type-select {
  width: 100px;
  background: #1a1a1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  padding: 0 0.5rem;
}

.showcase-modal {
  max-width: 600px;
}

.media-source-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.media-source-toggle button {
  flex: 1;
  padding: 0.6rem;
  background: #1a1a1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #9ca3af;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.media-source-toggle button.active {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-color: #6366f1;
}

.file-upload-group {
  background: #1a1a1e;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: border-color 0.2s;
}

.file-upload-group:hover {
  border-color: rgba(99, 102, 241, 0.3);
}

.file-input {
  width: 100%;
  color: #9ca3af;
}

.file-info {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6366f1;
  font-weight: 600;
}
</style>
