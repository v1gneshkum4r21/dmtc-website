import { createRouter, createWebHistory } from 'vue-router'
import { navStore } from '@/store/navigation'

const routes = [
    // Home — eager load (it IS the initial page)
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
    },

    // Services — prefetch on hover via user navigation
    {
        path: '/services/ai-work',
        name: 'ai-work',
        component: () => import(/* webpackChunkName: "service-ai-work" */ '../views/services/AIWork.vue')
    },
    {
        path: '/services/ai-service',
        name: 'ai-service',
        component: () => import(/* webpackChunkName: "service-ai-service" */ '../views/services/AIService.vue')
    },
    {
        path: '/services/ai-enterprise',
        name: 'ai-enterprise',
        component: () => import(/* webpackChunkName: "service-ai-enterprise" */ '../views/services/AIEnterprise.vue')
    },

    // Products
    {
        path: '/products/superfitter',
        name: 'superfitter',
        component: () => import(/* webpackChunkName: "product-superfitter" */ '../views/products/SuperfiitterPage.vue')
    },
    {
        path: '/products/echoai',
        name: 'echoai',
        component: () => import(/* webpackChunkName: "product-echoai" */ '../views/products/EchoAIPage.vue')
    },

    // Company
    {
        path: '/company/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "company-about" */ '../views/company/About.vue')
    },
    {
        path: '/company/leadership',
        name: 'leadership',
        component: () => import(/* webpackChunkName: "company-leadership" */ '../views/company/Leadership.vue')
    },
    {
        path: '/company/careers',
        name: 'careers',
        component: () => import(/* webpackChunkName: "company-careers" */ '../views/company/Careers.vue')
    },

    // Resources
    {
        path: '/resources/hub',
        name: 'resource-hub',
        component: () => import(/* webpackChunkName: "resource-hub" */ '../views/resources/Hub.vue')
    },
    {
        path: '/resources/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "resource-blog" */ '../views/resources/Blog.vue')
    },
    {
        path: '/resources/research',
        name: 'research',
        component: () => import(/* webpackChunkName: "resource-research" */ '../views/resources/Research.vue')
    },

    // Support
    {
        path: '/support/docs',
        name: 'docs',
        component: () => import(/* webpackChunkName: "support-docs" */ '../views/support/Docs.vue')
    },
    {
        path: '/support/community',
        name: 'community',
        component: () => import(/* webpackChunkName: "support-community" */ '../views/support/Community.vue')
    },
    {
        path: '/support/help',
        name: 'help',
        component: () => import(/* webpackChunkName: "support-help" */ '../views/support/Help.vue')
    },

    // Showcase
    {
        path: '/showcase',
        name: 'showcase',
        component: () => import(/* webpackChunkName: "showcase" */ '../views/support/Showcase.vue')
    },

    // Admin (gated, never prefetched)
    {
        path: '/admin/insights',
        name: 'insights-admin',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/InsightsAdmin.vue')
    },

    // Custom Dynamic Pages
    {
        path: '/p/:pageId',
        name: 'custom-page-flat',
        component: () => import(/* webpackChunkName: "dynamic-page" */ '../views/DynamicView.vue')
    },
    {
        path: '/:category/:id',
        name: 'dynamic-page',
        component: () => import(/* webpackChunkName: "dynamic-page" */ '../views/DynamicView.vue')
    },

    // Fallback
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

// Router Guard for Navigation Matrix
router.beforeEach((to, from, next) => {
    // Check by route name first
    if (navStore.matrix[to.name]) {
        if (!navStore.matrix[to.name].visible) return next('/')
        return next()
    }

    // For dynamic/custom pages — find by path match
    const matchedPage = Object.values(navStore.matrix).find(p => p.path === to.path)
    if (matchedPage) {
        if (!matchedPage.visible) return next('/')
        return next()
    }

    next()
})

export default router
