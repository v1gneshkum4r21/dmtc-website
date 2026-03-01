import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('admin_token')
            // Optionally redirect to login or reload
            if (window.location.pathname.startsWith('/admin')) {
                window.location.reload()
            }
        }
        return Promise.reject(error)
    }
)

// Public API calls
export const insightsAPI = {
    // Get all published insights
    getAll: async (page) => {
        const params = page ? { page } : {}
        const response = await apiClient.get('/insights', { params })
        return response.data
    },

    // Get single insight by ID
    getById: async (id) => {
        const response = await apiClient.get(`/insights/${id}`)
        return response.data
    }
}

// Research API
export const researchAPI = {
    // Get all published publications
    getAll: async () => {
        const response = await apiClient.get('/research')
        return response.data
    },

    // Get single publication by ID
    getById: async (id) => {
        const response = await apiClient.get(`/research/${id}`)
        return response.data
    }
}

// Showcase API
export const showcaseAPI = {
    // Get all active showcase items. Attempt backend first, fall back to local demo data on error.
    getAll: async () => {
        try {
            const response = await apiClient.get('/showcase')
            return response.data
        } catch (err) {
            // If backend is unavailable (dev/demo), load local demo JSON fallback
            try {
                const mod = await import('../data/showcase-demo.json')
                return mod.default || mod
            } catch (e) {
                // As last resort return empty array
                console.warn('Failed to load showcase from backend and demo fallback:', e)
                return []
            }
        }
    }
}
// Jobs API
export const jobsAPI = {
    // Get all active jobs
    getAll: async () => {
        try {
            const response = await apiClient.get('/jobs')
            return response.data
        } catch (err) {
            console.warn('Failed to load jobs from backend:', err)
            return []
        }
    },

    // Get single job by ID
    getById: async (id) => {
        const response = await apiClient.get(`/jobs/${id}`)
        return response.data
    },

    // Submit a job application
    submitApplication: async (applicationData) => {
        const response = await apiClient.post('/jobs/apply', applicationData)
        return response.data
    }
}

// Search API
export const searchAPI = {
    query: async (q) => {
        const response = await apiClient.get('/search', { params: { q } })
        return response.data
    }
}

// Pages API (Public)
export const pagesAPI = {
    getAll: async () => {
        try {
            const response = await apiClient.get('/pages')
            return response.data
        } catch {
            return []
        }
    },
    getConfig: async (pageId) => {
        const response = await apiClient.get(`/pages/${pageId}`)
        return response.data
    }
}

// Authentication API
export const authAPI = {
    // Login
    login: async (username, password) => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // Store token in localStorage
        if (response.data.access_token) {
            localStorage.setItem('admin_token', response.data.access_token)
        }

        return response.data
    },

    // Logout
    logout: () => {
        localStorage.removeItem('admin_token')
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token')
    },

    // WebAuthn MFA
    getMfaOptions: async (username) => {
        const response = await apiClient.get('/auth/mfa/options', { params: { username } })
        return response.data
    },

    verifyMfa: async (username, authResponse) => {
        const response = await apiClient.post('/auth/mfa/verify', authResponse, { params: { username } })
        if (response.data.access_token) {
            localStorage.setItem('admin_token', response.data.access_token)
        }
        return response.data
    }
}

// Admin API calls (require authentication)
export const adminAPI = {
    // Get all insights (including unpublished)
    getAllInsights: async (page) => {
        const params = page ? { page } : {}
        const response = await apiClient.get('/admin/insights', { params })
        return response.data
    },

    // Create new insight
    createInsight: async (insightData) => {
        const response = await apiClient.post('/admin/insights', insightData)
        return response.data
    },

    // Update insight
    updateInsight: async (id, insightData) => {
        const response = await apiClient.put(`/admin/insights/${id}`, insightData)
        return response.data
    },

    // Delete insight
    deleteInsight: async (id) => {
        await apiClient.delete(`/admin/insights/${id}`)
    },

    // Get all showcase items (admin)
    getAllShowcase: async () => {
        const response = await apiClient.get('/admin/showcase')
        return response.data
    },

    // Create showcase item
    createShowcase: async (itemData) => {
        const response = await apiClient.post('/admin/showcase', itemData)
        return response.data
    },

    // Update showcase item
    updateShowcase: async (id, itemData) => {
        const response = await apiClient.put(`/admin/showcase/${id}`, itemData)
        return response.data
    },

    // Delete showcase item
    deleteShowcase: async (id) => {
        await apiClient.delete(`/admin/showcase/${id}`)
    },

    // Upload file
    uploadFile: async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await apiClient.post('/admin/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    // Create new admin user
    createUser: async (userData) => {
        const response = await apiClient.post('/admin/users', userData)
        return response.data
    },

    // Job Management
    getAllJobs: async (params = {}) => {
        const response = await apiClient.get('/admin/jobs', { params })
        return response.data
    },

    createJob: async (jobData) => {
        const response = await apiClient.post('/admin/jobs', jobData)
        return response.data
    },

    updateJob: async (id, jobData) => {
        const response = await apiClient.put(`/admin/jobs/${id}`, jobData)
        return response.data
    },

    deleteJob: async (id, permanent = false) => {
        await apiClient.delete(`/admin/jobs/${id}`, { params: { permanent } })
    },

    // Job Applications
    getApplications: async (params = { include_deleted: true }) => {
        const response = await apiClient.get('/admin/applications', { params })
        return response.data
    },

    updateApplicationStatus: async (id, status, note = '') => {
        const response = await apiClient.patch(`/admin/applications/${id}/status`, { status, note })
        return response.data
    },

    restoreApplication: async (id) => {
        const response = await apiClient.post(`/admin/applications/${id}/restore`)
        return response.data
    },

    deleteApplication: async (id, permanent = false) => {
        await apiClient.delete(`/admin/applications/${id}`, { params: { permanent } })
    },

    // Research Management
    getAllResearch: async () => {
        const response = await apiClient.get('/admin/research')
        return response.data
    },

    createResearch: async (paperData) => {
        const response = await apiClient.post('/admin/research', paperData)
        return response.data
    },

    updateResearch: async (id, paperData) => {
        const response = await apiClient.put(`/admin/research/${id}`, paperData)
        return response.data
    },

    deleteResearch: async (id) => {
        await apiClient.delete(`/admin/research/${id}`)
    },

    // Page Management
    updatePageConfig: async (page_id, config) => {
        const response = await apiClient.post(`/admin/pages/${page_id}`, config)
        return response.data
    },
    deletePageConfig: async (page_id) => {
        await apiClient.delete(`/admin/pages/${page_id}`)
    },

    // WebAuthn Registration
    getRegistrationOptions: async () => {
        const response = await apiClient.get('/admin/mfa/register/options')
        return response.data
    },

    verifyRegistration: async (registrationData) => {
        const response = await apiClient.post('/admin/mfa/register/verify', registrationData)
        return response.data
    }
}

export default {
    insights: insightsAPI,
    research: researchAPI,
    showcase: showcaseAPI,
    jobs: jobsAPI,
    search: searchAPI,
    pages: pagesAPI,
    auth: authAPI,
    admin: adminAPI
}
