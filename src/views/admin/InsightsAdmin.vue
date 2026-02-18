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
            <div 
              class="nav-item"
              :class="{ active: activeModule === 'careers' }"
              @click="activeModule = 'careers'"
            >
              <span class="nav-icon">💼</span>
              <span>Career Manager</span>
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
                  <option value="careers">Career Manager</option>
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
                  <option value="ai-enterprise">AI Enterprise</option>
                  <option value="echo-ai">EchoAI</option>
                  <option value="superfiitter">SuperFiitter</option>
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
            <button v-if="activeModule === 'careers'" @click="showJobForm = true" class="btn-primary">
              + New Job JD
            </button>
          </div>
        </header>

        <div class="dashboard-content">
          <!-- Module Content: Insights -->
          <div v-if="activeModule === 'insights'">
            <!-- ... insights list ... -->
            <div class="module-intro">
              <div class="intro-text">
                <div v-if="selectedPage === 'ai-enterprise'" class="section-branding">
                  <div class="detail-badge">INSIGHTS</div>
                  <h2 class="branding-title">Global <span class="text-gradient">Impact</span></h2>
                </div>
                <h2 v-else>{{ activeModuleTitle }}</h2>
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

          <!-- Module Content: Careers -->
          <div v-else-if="activeModule === 'careers'">
            <div class="module-intro">
              <div class="intro-text">
                <h2>Career Opportunity Manager</h2>
                <p>Curate the future talent of DREAMATIC</p>
              </div>
              <div class="career-sub-nav">
                <button class="sub-tab-btn" :class="{ active: careerSubTab == 'jds' }" @click="careerSubTab = 'jds'">
                  <span>💼</span> Job Descriptions
                </button>
                <button class="sub-tab-btn" :class="{ active: careerSubTab == 'applicants' }" @click="careerSubTab = 'applicants'">
                  <span>👥</span> Applicants
                </button>
                <button class="sub-tab-btn" :class="{ active: careerSubTab == 'history' }" @click="careerSubTab = 'history'">
                  <span>📜</span> Audit History
                </button>
              </div>
            </div>

            <!-- JDs Page -->
            <div v-if="careerSubTab === 'jds'" class="jobs-manager">
              <div class="quick-stats" style="margin-bottom: 2rem;">
                <div class="stat-card">
                  <span class="stat-val">{{ jobs.length }}</span>
                  <span class="stat-label">Total Roles</span>
                </div>
                <div class="stat-card">
                  <span class="stat-val">{{ jobs.filter(j => j.active && !j.isArchived).length }}</span>
                  <span class="stat-label">Active JDs</span>
                </div>
                <div class="stat-card">
                  <span class="stat-val">{{ jobs.filter(j => j.isArchived).length }}</span>
                  <span class="stat-label">Archived</span>
                </div>
              </div>

              <div v-if="loading && jobs.length === 0" class="loading">
                Loading roles...
              </div>

              <div v-else-if="jobs.length === 0" class="empty-state">
                <p>No job roles listed yet. Create a JD to start hiring!</p>
              </div>

              <div v-else class="jobs-admin-list">
                <div
                  v-for="job in jobs"
                  :key="job._id"
                  class="job-admin-card"
                  :class="{ inactive: !job.active, archived: job.isArchived }"
                >
                  <div class="job-status-indicator"></div>
                  <div class="job-info">
                    <div class="job-title-row">
                      <h3>{{ job.title }} <span v-if="job.isArchived" class="badge-archived">Archived</span></h3>
                      <span class="job-type-badge">{{ job.type }}</span>
                    </div>
                    <div class="job-meta-row">
                      <span class="meta-item">🏢 {{ job.company }}</span>
                      <span class="meta-item">� {{ job.location }}</span>
                      <span class="meta-item">� {{ job.team }}</span>
                    </div>
                    <div v-if="job.tags" class="job-tags-row">
                      <span v-for="tag in job.tags.split(',')" :key="tag" class="small-tag">{{ tag.trim() }}</span>
                    </div>
                  </div>
                  <div class="job-actions">
                    <button @click="startEditJob(job)" class="btn-edit">Edit</button>
                    <button @click="handleArchiveJob(job._id)" class="btn-archive" v-if="!job.isArchived">Archive</button>
                    <button @click="handleDeleteJob(job._id)" class="btn-delete">Delete</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Applicants Page -->
            <div v-if="careerSubTab === 'applicants'" class="applications-container">
              <div class="applications-header">
                <h3>Applicants Management ({{ filteredApplications.length }})</h3>
                <div class="header-tools">
                  <div class="status-filter">
                    <label for="status-filter">Filter:</label>
                    <select id="status-filter" v-model="statusFilter" class="filter-select">
                      <option value="all">All Statuses</option>
                      <option value="Applied">Applied</option>
                      <option value="Selected">Selected</option>
                      <option value="Waiting List">Waiting List</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Deleted">Deleted</option>
                    </select>
                  </div>
                   <div class="view-toggles">
                    <button @click="viewMode = 'grid'" class="toggle-btn" :class="{ active: viewMode === 'grid' }"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
                    <button @click="viewMode = 'list'" class="toggle-btn" :class="{ active: viewMode === 'list' }"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                  </div>
                </div>
              </div>
              
              <div v-if="filteredApplications.length === 0" class="empty-state">
                <p>No applicants {{ statusFilter !== 'all' ? 'with status: ' + statusFilter : 'yet. Keep pushing!' }}</p>
              </div>

              <div v-else :class="['applications-grid', viewMode]">
                <div v-for="app in filteredApplications" :key="app._id" class="app-card" @click="openApplicationPreview(app)">
                  <div class="card-content-wrapper">
                    <div class="app-header">
                      <div class="app-meta">
                        <div class="meta-left">
                          <span class="app-role">{{ app.role }}</span>
                          <span v-if="app.status" :class="['status-badge', app.status.toLowerCase().replace(' ', '-')]">
                            {{ app.status }}
                          </span>
                        </div>
                        <span class="app-date">{{ formatDate(app.createdAt) }}</span>
                      </div>
                      <div class="app-user-row">
                        <div class="app-avatar-mini">{{ app.name.charAt(0) }}</div>
                        <div class="app-user-info">
                          <h3>{{ app.name }}</h3>
                          <a :href="'mailto:' + app.email" class="app-email" @click.stop>{{ app.email }}</a>
                        </div>
                      </div>
                    </div>
                    
                    <div class="app-details">
                      <div class="detail-item"><span class="detail-label">Location</span><span class="detail-value">{{ app.location }}</span></div>
                      <div class="detail-item"><span class="detail-label">Experience</span><span class="detail-value">{{ app.experience }}</span></div>
                    </div>
                    
                    <div class="app-resume">
                      <a :href="app.resume" target="_blank" class="resume-link" @click.stop>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <span>View Resume</span>
                      </a>
                    </div>

                    <div class="app-actions-row">
                      <div class="status-actions">
                        <button @click.stop="handleUpdateStatus(app._id, 'Selected')" class="btn-status select" :class="{ active: app.status === 'Selected' }">Select</button>
                        <button @click.stop="handleUpdateStatus(app._id, 'Waiting List')" class="btn-status wait" :class="{ active: app.status === 'Waiting List' }">Waiting</button>
                        <button @click.stop="handleUpdateStatus(app._id, 'Rejected')" class="btn-status reject" :class="{ active: app.status === 'Rejected' }">Reject</button>
                      </div>
                      <button @click.stop="handleDeleteApplication(app._id)" class="btn-delete-icon" title="Soft Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- History Page -->
            <div v-if="careerSubTab === 'history'" class="history-manager">
              <div class="applications-header">
                <h3>Global Audit Trail</h3>
                <p>A full record of all application activities.</p>
              </div>

              <div class="audit-log-list">
                <div v-for="app in [...applications].sort((a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))" :key="'audit-'+app._id" class="audit-card">
                  <div class="audit-header" @click="app.showAudit = !app.showAudit">
                    <div class="audit-user">
                      <div class="avatar-small">{{ app.name.charAt(0) }}</div>
                      <div>
                        <strong>{{ app.name }}</strong>
                        <span>{{ app.role }}</span>
                      </div>
                    </div>
                    <div class="audit-summary">
                      Latest: <span :class="['status-badge-small', app.status.toLowerCase().replace(' ', '-')]">{{ app.status }}</span>
                    </div>
                    <div class="audit-toggle">{{ app.showAudit ? '▾' : '▸' }}</div>
                  </div>

                  <div v-if="app.showAudit" class="history-timeline">
                    <div v-for="(entry, idx) in app.history" :key="idx" class="history-item">
                      <div class="history-mark"></div>
                      <div class="history-content">
                        <span class="history-time">{{ formatDate(entry.timestamp) }}</span>
                        <span class="history-status">{{ entry.status }}</span>
                        <p v-if="entry.note" class="history-note">{{ entry.note }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!['insights', 'showcase', 'careers'].includes(activeModule)" class="empty-module">
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
                <option value="ai-enterprise">AI Enterprise</option>
                <option value="echo-ai">EchoAI</option>
                <option value="superfiitter">SuperFiitter</option>
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

      <!-- Create/Edit Form Modal (Scoped to Careers) -->
      <div v-if="(showJobForm || editingJob) && activeModule === 'careers'" class="modal-overlay" @click.self="closeJobForm">
        <div class="modal-content career-modal">
          <h2>{{ editingJob ? 'Edit Job Description' : 'Create New JD' }}</h2>
          
          <form @submit.prevent="handleJobSubmit">
            <div class="form-group">
              <label for="jb-title">Role Title *</label>
              <input
                id="jb-title"
                v-model="jobForm.title"
                type="text"
                placeholder="e.g. Senior ML Engineer"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="jb-team">Team *</label>
                <input
                  id="jb-team"
                  v-model="jobForm.team"
                  type="text"
                  placeholder="e.g. AI Research"
                  required
                />
              </div>

              <div class="form-group">
                <label for="jb-location">Location *</label>
                <input
                  id="jb-location"
                  v-model="jobForm.location"
                  type="text"
                  placeholder="e.g. San Francisco / Remote"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="jb-description">Role Description *</label>
              <textarea
                id="jb-description"
                v-model="jobForm.description"
                placeholder="What will this person do?"
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="jb-requirements">Requirements *</label>
              <textarea
                id="jb-requirements"
                v-model="jobForm.requirements"
                placeholder="What skills are needed?"
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="jb-company">Company *</label>
                <input
                  id="jb-company"
                  v-model="jobForm.company"
                  type="text"
                  placeholder="e.g. DREAMATIC"
                  required
                />
              </div>

              <div class="form-group">
                <label for="jb-tags">Tags (comma separated)</label>
                <input
                  id="jb-tags"
                  v-model="jobForm.tags"
                  type="text"
                  placeholder="e.g. AI, ML, SF"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="jb-type">Job Type</label>
                <select id="jb-type" v-model="jobForm.type" class="module-select">
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div class="form-group checkbox-group middle-align">
                <label>
                  <input type="checkbox" v-model="jobForm.active" />
                  Active
                </label>
                <label v-if="editingJob">
                  <input type="checkbox" v-model="jobForm.isArchived" />
                  Archived
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Saving...' : (editingJob ? 'Update JD' : 'Post Role') }}
              </button>
              <button type="button" @click="closeJobForm" class="btn-secondary">
                Cancel
              </button>
            </div>

            <p v-if="error" class="error-message">{{ error }}</p>
          </form>
        </div>
      </div>
      <!-- Application Preview Modal -->
      <div v-if="selectedApplication" class="modal-overlay" @click.self="closeApplicationPreview">
        <div class="modal-content application-preview-modal">
          <div class="preview-header">
            <div class="preview-user-info">
              <div class="preview-avatar">{{ selectedApplication.name.charAt(0) }}</div>
              <div class="preview-title-box">
                <h2>{{ selectedApplication.name }}</h2>
                <div class="preview-role-tag">{{ selectedApplication.role }}</div>
              </div>
            </div>
            <button class="btn-close" @click="closeApplicationPreview">&times;</button>
          </div>

          <div class="preview-body">
            <div class="preview-section">
              <h3>Contact Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Email</label>
                  <span>{{ selectedApplication.email }}</span>
                </div>
                <div class="info-item">
                  <label>Phone</label>
                  <span>{{ selectedApplication.phone || 'Not provided' }}</span>
                </div>
                <div class="info-item">
                  <label>Location</label>
                  <span>{{ selectedApplication.location }}</span>
                </div>
                <div class="info-item">
                  <label>Notice Period</label>
                  <span>{{ selectedApplication.notice }}</span>
                </div>
              </div>
            </div>

            <div class="preview-section">
              <h3>Experience & Expectations</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Experience Level</label>
                  <span>{{ selectedApplication.experience }}</span>
                </div>
                <div class="info-item">
                  <label>Salary Expectations</label>
                  <span>{{ selectedApplication.salary }}</span>
                </div>
              </div>
            </div>

            <div class="preview-section">
              <h3>Links & Resume</h3>
              <div class="links-row">
                <a :href="selectedApplication.resume" target="_blank" class="preview-action-btn primary">
                  📄 View Resume
                </a>
                <a v-if="selectedApplication.linkedin" :href="selectedApplication.linkedin" target="_blank" class="preview-action-btn">
                  🔗 LinkedIn
                </a>
                <a v-if="selectedApplication.portfolio" :href="selectedApplication.portfolio" target="_blank" class="preview-action-btn">
                  🌐 Portfolio
                </a>
              </div>
            </div>

            <div class="preview-section message-section" v-if="selectedApplication.message">
              <h3>Cover Letter / Message</h3>
              <div class="message-content">
                {{ selectedApplication.message }}
              </div>
            </div>
          </div>

          <div class="preview-footer">
            <div class="footer-actions-left">
              <button @click.stop="handleUpdateStatus(selectedApplication._id, 'Selected')" 
                      class="btn-status select" :class="{ active: selectedApplication.status === 'Selected' }"
                      onclick="console.log('✅ Select button clicked!')">
                Select Candidate
              </button>
              <button @click.stop="handleUpdateStatus(selectedApplication._id, 'Waiting List')" 
                      class="btn-status wait" :class="{ active: selectedApplication.status === 'Waiting List' }"
                      onclick="console.log('✅ Waiting List button clicked!')">
                Move to Waiting List
              </button>
              <button @click.stop="handleUpdateStatus(selectedApplication._id, 'Rejected')" 
                      class="btn-status reject" :class="{ active: selectedApplication.status === 'Rejected' }"
                      onclick="console.log('✅ Reject button clicked!')">
                Reject Candidate
              </button>
            </div>
            <button @click.stop="handleDeleteApplication(selectedApplication._id)" 
                    class="btn-delete-full" :class="{ 'confirm-state': deleteConfirmState }"
                    onclick="console.log('✅ Delete button clicked!')">
              {{ deleteConfirmState ? '⚠️ Confirm Delete?' : 'Delete Application' }}
            </button>
          </div>
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
const jobs = ref([])
const applications = ref([])
const showCreateForm = ref(false)
const showShowcaseForm = ref(false)
const showJobForm = ref(false)
const editingInsight = ref(null)
const editingShowcase = ref(null)
const editingJob = ref(null)
const activeModule = ref('insights')
const selectedPage = ref('')
const mediaSource = ref('url')
const selectedFile = ref(null)
const deleteConfirmState = ref(false)

const openApplicationPreview = (app) => {
  selectedApplication.value = app
  deleteConfirmState.value = false // Reset delete state on new open
}

const handleDeleteApplication = async (id) => {
  console.log('🗑️ Delete clicked. State:', deleteConfirmState.value)

  if (!deleteConfirmState.value) {
    // First click - ask for confirmation
    deleteConfirmState.value = true
    return
  }
  
  // Second click - proceed with delete
  console.log('✅ Delete confirmed for:', id)
  
  try {
    await adminAPI.deleteApplication(id, false) // false = soft delete
    console.log('Delete response: success')
    
    // Update the application status to 'Deleted' instead of removing it
    const app = applications.value.find(a => a._id === id)
    if (app) {
      app.status = 'Deleted'
      // Add to history
      if (!app.history) app.history = []
      app.history.push({
        status: 'Deleted',
        timestamp: new Date().toISOString(),
        note: 'Application soft-deleted by admin'
      })
    }
    
    // Reset confirmation state
    deleteConfirmState.value = false
    
    console.log('✅ Application marked as deleted')
  } catch (err) {
    console.error('Error deleting application:', err)
    error.value = 'Failed to delete application'
  }
}

const viewMode = ref('grid')
const careerSubTab = ref('jds') // 'jds', 'applicants', 'history'
const statusFilter = ref('all') // Filter for application status

// Computed property to filter applications by status
const filteredApplications = computed(() => {
  if (statusFilter.value === 'all') {
    return applications.value
  }
  return applications.value.filter(app => app.status === statusFilter.value)
})

const jobForm = ref({
  title: '',
  team: '',
  location: '',
  description: '',
  requirements: '',
  company: 'DREAMATIC',
  tags: '',
  type: 'Full-time',
  active: true,
  isArchived: false
})

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
    case 'careers': return 'Career Manager'
    case 'showcase': return 'Showcase Manager'
    case 'users': return 'User Management'
    default: return 'Dashboard'
  }
})

const selectedPageLabel = computed(() => {
  if (!selectedPage.value) return 'All Website Sections'
  switch(selectedPage.value) {
    case 'ai-work': return 'AI Work — Insights'
    case 'ai-service': return 'AI Service — Media Intelligence'
    case 'ai-enterprise': return 'AI Enterprise — Global Impact'
    case 'echo-ai': return 'EchoAI — Voice Intelligence'
    case 'superfiitter': return 'SuperFiitter — Virtual Try-On'
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
    case 'ai-enterprise': return '/services/ai-enterprise'
    case 'echo-ai': return '/products/echoai'
    case 'superfiitter': return '/products/superfiitter'
    case 'platform': return '/products/platform'
    case 'agentic': return '/services/ai-work' 
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
    loadJobs()
    loadApplications()
  }
})

const loadJobs = async () => {
  loading.value = true
  try {
    jobs.value = await adminAPI.getAllJobs({ active_only: false, include_archived: true })
  } catch (err) {
    error.value = 'Failed to load jobs'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadApplications = async () => {
  try {
    // For admin, we want to see history/archive, but maybe by default only show non-deleted
    // The history tab will specifically want all applications to show audit trail
    applications.value = await adminAPI.getApplications({ include_deleted: true })
  } catch (err) {
    console.error('Failed to load applications:', err)
  }
}

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

// Job Handlers
const handleJobSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (editingJob.value) {
      await adminAPI.updateJob(editingJob.value._id, jobForm.value)
    } else {
      await adminAPI.createJob(jobForm.value)
    }
    
    closeJobForm()
    await loadJobs()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to save job'
  } finally {
    loading.value = false
  }
}

const startEditJob = (job) => {
  editingJob.value = job
  jobForm.value = {
    title: job.title,
    team: job.team,
    location: job.location,
    description: job.description,
    requirements: job.requirements,
    company: job.company || 'DREAMATIC',
    tags: job.tags || '',
    type: job.type,
    active: job.active,
    isArchived: job.isArchived || false
  }
  showJobForm.value = true
}

const closeJobForm = () => {
  showJobForm.value = false
  editingJob.value = null
  jobForm.value = {
    title: '',
    team: '',
    location: '',
    description: '',
    requirements: '',
    company: 'DREAMATIC',
    tags: '',
    type: 'Full-time',
    active: true,
    isArchived: false
  }
  error.value = ''
}

const handleArchiveJob = async (id) => {
  if (!confirm('Archive this job? It will no longer be visible to candidates.')) return
  try {
    await adminAPI.updateJob(id, { isArchived: true, active: false })
    await loadJobs()
  } catch (err) {
    error.value = 'Failed to archive job'
  }
}

const handleDeleteJob = async (id) => {
  if (!confirm('Permanently delete this job? This cannot be undone.')) return
  try {
    await adminAPI.deleteJob(id, true)
    await loadJobs()
  } catch (err) {
    error.value = 'Failed to delete job'
  }
}


const closeApplicationPreview = () => {
  selectedApplication.value = null
}

const handleUpdateStatus = async (id, targetStatus) => {
  console.log('🔄 Attempting status update for:', id, 'to:', targetStatus)
  
  const currentApp = applications.value.find(a => a._id === id)
  const isDeselecting = currentApp && currentApp.status === targetStatus
  const newStatus = isDeselecting ? 'Applied' : targetStatus
  
  console.log('📝 Current status:', currentApp?.status, '| New status:', newStatus, '| Toggling:', isDeselecting)

  const actionText = isDeselecting ? 'Reset to Applied' : `Updated to ${targetStatus}`
  const note = actionText // Automatic note instead of prompt
  
  try {
    const result = await adminAPI.updateApplicationStatus(id, newStatus, note)
    console.log('✅ Status update result:', result)
    
    // Refresh applications to get updated history
    await loadApplications()
    
    if (selectedApplication.value && selectedApplication.value._id === id) {
      const refreshedApp = applications.value.find(a => a._id === id)
      console.log('🔄 Refreshing selected application preview:', refreshedApp?.status)
      selectedApplication.value = refreshedApp
    }
  } catch (err) {
    console.error('🔥 Error updating status:', err)
    error.value = 'Failed to update status'
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

/* Frontend-style Branding in Admin */
.section-branding {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.branding-title {
  font-size: 2.2rem !important;
  font-weight: 850 !important;
  margin: 0 !important;
  line-height: 1.1 !important;
  letter-spacing: -0.03em !important;
}

.text-gradient {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Careers Manager Admin Styles */
.jobs-admin-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-admin-card {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.job-admin-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateX(5px);
}

.job-admin-card.inactive {
  opacity: 0.6;
}

.job-status-indicator {
  width: 4px;
  height: 40px;
  background: #10b981;
  border-radius: 4px;
}

.job-admin-card.inactive .job-status-indicator {
  background: #4b5563;
}

.job-info {
  flex: 1;
}

.job-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.job-title-row h3 {
  font-size: 1.15rem;
  margin: 0;
  color: white;
}

.job-type-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  border-radius: 4px;
  text-transform: uppercase;
}

.job-meta-row {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.job-actions {
  display: flex;
  gap: 0.75rem;
}

.middle-align {
  display: flex;
  align-items: center;
}

.career-modal {
  max-width: 700px;
}

/* Applications Section Styles */
.applications-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.applications-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-tools {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #9ca3af;
}

.filter-select {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  min-width: 140px;
}

.filter-select:focus {
  border-color: #6366f1;
}

.filter-select option {
  background: #111114;
  color: white;
  padding: 10px;
}

.view-toggles {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.toggle-btn {
  padding: 6px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
}

.toggle-btn.active {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.applications-header h3 {
  font-size: 1.25rem;
  color: white;
  margin: 0;
}

/* Redesigned Applications Grid */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

.applications-grid.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-card {
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  background: #16161b;
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

/* Glow accent on hover */
.app-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.app-card:hover::after {
  opacity: 1;
}

/* Grid vs List Wrapper Logic */
.card-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.applications-grid.list .card-content-wrapper {
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

/* Card Elements */
.app-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.applications-grid.list .app-header {
  min-width: 250px;
}

.app-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-role {
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.app-date {
  font-size: 0.7rem;
  color: #4b5563;
}

.app-user-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.app-avatar-mini {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.app-user-info h3 {
  margin: 0;
  font-size: 1rem;
  color: white;
  line-height: 1.2;
}

.app-email {
  font-size: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.app-email:hover {
  color: #818cf8;
}

/* Details Section */
.app-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.applications-grid.list .app-details {
  flex-direction: row;
  flex: 1;
  background: transparent;
  border: none;
  padding: 0;
  gap: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #4b5563;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.85rem;
  color: #d1d5db;
  font-weight: 500;
}

/* Resume/Action */
.app-resume {
  margin-top: 0.5rem;
}

.applications-grid.list .app-resume {
  margin-top: 0;
}

.resume-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid rgba(99, 102, 241, 0.05);
}

.resume-link:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-2px);
}

/* Message Preview */
.app-message-preview {
  margin-top: 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.015);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.025);
}

.app-message-preview p {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #9ca3af;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Application Preview Modal Styles */
.application-preview-modal {
  max-width: 800px;
  padding: 0;
  overflow: hidden;
  background: #0d0d10;
}

.preview-header {
  padding: 2rem;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.preview-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.preview-title-box h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.preview-role-tag {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 0.05em;
}

.preview-body {
  padding: 2rem;
  max-height: calc(70vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;
}

.preview-section {
  margin-bottom: 2.5rem;
}

.preview-section h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #4b5563;
  letter-spacing: 0.1em;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.info-item label {
  font-size: 0.75rem;
  color: #6b7280;
}

.info-item span {
  font-size: 0.95rem;
  color: #e5e7eb;
  font-weight: 500;
}

.links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-action-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.preview-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.preview-action-btn.primary {
  background: #6366f1;
  border: none;
}

.preview-action-btn.primary:hover {
  background: #4f46e5;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
}

.message-content {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 1.5rem;
  color: #d1d5db;
  line-height: 1.7;
  font-size: 0.95rem;
  white-space: pre-wrap;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.btn-close {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #ef4444;
  color: white;
}

/* Application Status & Action Styles */
.meta-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.status-badge.selected {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge.waiting-list {
  background: rgba(234, 179, 8, 0.1);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.2);
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-badge.deleted {
  background: rgba(107, 114, 128, 0.1);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.status-badge.applied {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.app-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.applications-grid.list .app-actions-row {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
  min-width: 280px;
}

.status-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-status {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

.btn-status:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.btn-status.select.active {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.3);
}

.btn-status.wait.active {
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  border-color: rgba(234, 179, 8, 0.3);
}

.btn-status.reject.active {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-delete-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-icon:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.preview-footer {
  padding: 1.5rem 2rem;
  background: #0a0a0c;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 100;
  pointer-events: auto;
}

.footer-actions-left {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 10;
}

.footer-actions-left .btn-status {
  padding: 10px 20px;
  font-size: 0.85rem;
  cursor: pointer !important;
  position: relative;
  z-index: 10;
  pointer-events: auto !important;
}

.btn-delete-full {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  pointer-events: auto !important;
  z-index: 10;
}

.btn-delete-full:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-status svg,
.btn-delete-icon svg {
  pointer-events: none;
}

/* Career Manager Sub-navigation */
.career-sub-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.sub-tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sub-tab-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.sub-tab-btn.active {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

/* History Timeline Styles */
.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.history-item {
  display: flex;
  gap: 2rem;
}

.history-mark {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #6366f1;
  background: #0a0a0c;
  position: relative;
  margin-top: 0.25rem;
}

.history-mark::after {
  content: '';
  position: absolute;
  top: 24px;
  left: 7px;
  bottom: -40px;
  width: 2px;
  background: rgba(99, 102, 241, 0.2);
}

.history-item:last-child .history-mark::after {
  display: none;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-time {
  font-size: 0.8rem;
  color: #6b7280;
}

.history-status {
  font-weight: 700;
  font-size: 1rem;
  color: white;
}

.history-note {
  font-size: 0.9rem;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.badge-archived {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 10px;
}

.job-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.small-tag {
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.7rem;
  color: #9ca3af;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.audit-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.audit-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s;
}

.audit-header:hover {
  background: rgba(255, 255, 255, 0.04);
}

.audit-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.audit-user strong {
  display: block;
  font-size: 1rem;
}

.audit-user span {
  font-size: 0.8rem;
  color: #6b7280;
}

.status-badge-small {
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
}

.audit-summary {
  font-size: 0.85rem;
  color: #9ca3af;
}

.audit-toggle {
  color: #6366f1;
  font-size: 1.2rem;
}

.btn-archive {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-archive:hover {
  background: #f59e0b;
  color: white;
}

.job-admin-card.archived {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.app-card.is-deleted {
  opacity: 0.5;
  filter: saturate(0.5);
  border-style: dashed;
}

.badge-deleted {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

</style>
