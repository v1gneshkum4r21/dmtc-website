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

// Showcase API
export const showcaseAPI = {
    // Get all active showcase items
    getAll: async () => {
        const response = await apiClient.get('/showcase')
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
    }
}

export default {
    insights: insightsAPI,
    showcase: showcaseAPI,
    auth: authAPI,
    admin: adminAPI
}
