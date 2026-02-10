import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },

    // Services
    { path: '/services/ai-work', name: 'ai-work', component: () => import('../views/services/AIWork.vue') },
    { path: '/services/ai-service', name: 'ai-service', component: () => import('../views/services/AIService.vue') },
    { path: '/services/ai-enterprise', name: 'ai-enterprise', component: () => import('../views/services/AIEnterprise.vue') },

    // Products
    { path: '/products/superfiitter', name: 'superfiitter', component: () => import('../views/products/SuperfiitterPage.vue') },
    { path: '/products/echoai', name: 'echoai', component: () => import('../views/products/EchoAIPage.vue') },

    // Company
    { path: '/company/about', name: 'about', component: () => import('../views/company/About.vue') },
    { path: '/company/leadership', name: 'leadership', component: () => import('../views/company/Leadership.vue') },
    { path: '/company/careers', name: 'careers', component: () => import('../views/company/Careers.vue') },

    // Resources
    { path: '/resources/hub', name: 'resource-hub', component: () => import('../views/resources/Hub.vue') },
    { path: '/resources/blog', name: 'blog', component: () => import('../views/resources/Blog.vue') },
    { path: '/resources/research', name: 'research', component: () => import('../views/resources/Research.vue') },

    // Support
    { path: '/support/docs', name: 'docs', component: () => import('../views/support/Docs.vue') },
    { path: '/support/community', name: 'community', component: () => import('../views/support/Community.vue') },
    { path: '/support/help', name: 'help', component: () => import('../views/support/Help.vue') },

    // Showcase
    { path: '/showcase', name: 'showcase', component: () => import('../views/support/Showcase.vue') },

    // Admin
    { path: '/admin/insights', name: 'insights-admin', component: () => import('../views/admin/InsightsAdmin.vue') },

    // Redirect any unknown routes to home
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

export default router
