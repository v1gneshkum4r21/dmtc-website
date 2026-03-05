import { reactive, watch } from 'vue'
import { adminAPI, pagesAPI } from '@/services/api'

const STORAGE_KEY = 'dreamactic_navigation_matrix'

// Default configuration for all site views
const defaultMatrix = {
    // Services
    'ai-work': { id: 'ai-work', label: 'AI for Work', path: '/services/ai-work', visible: true, group: 'services' },
    'ai-service': { id: 'ai-service', label: 'AI for Service', path: '/services/ai-service', visible: true, group: 'services' },
    'ai-enterprise': { id: 'ai-enterprise', label: 'AI for Enterprise', path: '/services/ai-enterprise', visible: true, group: 'services' },

    // Products
    'superfitter': { id: 'superfitter', label: 'SuperFiitter', path: '/products/superfitter', visible: true, group: 'products' },
    'echoai': { id: 'echoai', label: 'EchoAI', path: '/products/echoai', visible: true, group: 'products' },

    // Company
    'about': { id: 'about', label: 'About Us', path: '/company/about', visible: true, group: 'company' },
    'leadership': { id: 'leadership', label: 'Leadership', path: '/company/leadership', visible: true, group: 'company' },
    'careers': { id: 'careers', label: 'Careers', path: '/company/careers', visible: true, group: 'company' },

    // Resources
    'resource-hub': { id: 'resource-hub', label: 'Resource Hub', path: '/resources/hub', visible: true, group: 'resources' },
    'blog': { id: 'blog', label: 'Blog', path: '/resources/blog', visible: true, group: 'resources' },
    'research': { id: 'research', label: 'Research', path: '/resources/research', visible: true, group: 'resources' },

    // Support
    'docs': { id: 'docs', label: 'Documentation', path: '/support/docs', visible: true, group: 'support' },
    'community': { id: 'community', label: 'Community', path: '/support/community', visible: true, group: 'support' },
    'help': { id: 'help', label: 'Help Center', path: '/support/help', visible: true, group: 'support' },

    // Showcase
    'showcase': { id: 'showcase', label: 'Showcase', path: '/showcase', visible: true, group: 'global' }
}

// Load from localStorage or use defaults
const savedMatrix = localStorage.getItem(STORAGE_KEY)
const matrixData = savedMatrix ? JSON.parse(savedMatrix) : defaultMatrix

export const navStore = reactive({
    matrix: matrixData,
    groups: ['services', 'products', 'company', 'resources', 'support'],

    toggleVisibility(id) {
        if (this.matrix[id]) {
            this.updatePage(id, { visible: !this.matrix[id].visible })
        }
    },

    isVisible(id) {
        return this.matrix[id]?.visible ?? true
    },

    hasVisibleInSection(group) {
        return Object.values(this.matrix).some(route => route.group === group && route.visible)
    },

    addCustomPage(title, group) {
        const id = title.toLowerCase().replace(/\s+/g, '-')
        const path = `/p/${id}`   // always use flat /p/:id for custom pages

        // Don't overwrite existing
        if (this.matrix[id]) return false

        const newPage = {
            id,
            label: title,
            path,
            visible: true,
            group: group || 'custom',
            isCustom: true,
            theme: {
                primary: '#6366f1',
                accent: '#a855f7'
            },
            content: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'hero',
                    title: `${title}`,
                    subtitle: 'Initialize your mission with DREAMACTIC.',
                    badge: 'MODULAR_NODE'
                },
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'cta',
                    title: 'Ready for the jump?',
                    subtitle: 'Initialize your workflow today.',
                    buttonText: 'Get Started'
                }
            ]
        }

        this.matrix[id] = newPage
        this.save()

        // Persist to MongoDB database
        adminAPI.updatePageConfig(id, {
            page_id: id,
            label: newPage.label,
            path: newPage.path,
            visible: newPage.visible,
            group: newPage.group,
            isCustom: true,
            theme: newPage.theme,
            content: newPage.content
        }).catch(err => {
            console.error('Failed to persist new page to database:', err)
        })

        return true
    },

    updatePage(id, config) {
        if (this.matrix[id]) {
            this.matrix[id] = { ...this.matrix[id], ...config }
            this.save()

            // Push updated content + theme to MySQL
            adminAPI.updatePageConfig(id, {
                page_id: id,
                label: this.matrix[id].label,
                path: this.matrix[id].path,
                visible: this.matrix[id].visible,
                group: this.matrix[id].group,
                isCustom: !!this.matrix[id].isCustom,
                theme: this.matrix[id].theme,
                content: this.matrix[id].content
            }).catch(err => {
                console.error('Failed to sync page to database:', err)
            })
        }
    },

    removeCustomPage(id) {
        if (this.matrix[id] && this.matrix[id].isCustom) {
            delete this.matrix[id]
            this.save()

            // Remove from MongoDB
            adminAPI.deletePageConfig(id).catch(err => {
                console.error('Failed to remove page from database:', err)
            })
        }
    },

    getComponentLibrary() {
        return [
            // ── FOUNDATION ──────────────────────────────────────────
            {
                type: 'hero',
                label: 'Hero Branding',
                icon: '🚀',
                group: 'Foundation',
                description: 'Main entry section with badge, gradient title, subtitle & CTA button.'
            },
            {
                type: 'content',
                label: 'Rich Text Block',
                icon: '📝',
                group: 'Foundation',
                description: 'Markdown-formatted text block — body copy, articles, explanations.'
            },
            {
                type: 'cta',
                label: 'Luxe CTA Banner',
                icon: '🔥',
                group: 'Foundation',
                description: 'High-contrast call to action with aura glow and button.'
            },

            // ── SHOWCASE ─────────────────────────────────────────────
            {
                type: 'solutions',
                label: 'Solutions Framework',
                icon: '🧠',
                group: 'Showcase',
                description: 'Premium solution cards with gradient accents, features list & hover effects — matches AI Work / Enterprise pages.'
            },
            {
                type: 'features',
                label: 'Feature Grid',
                icon: '🧩',
                group: 'Showcase',
                description: 'Grid of icon-based capability cards.'
            },
            {
                type: 'cards',
                label: 'Premium Cards',
                icon: '🎴',
                group: 'Showcase',
                description: 'Rich cards with glow effects, icons, and explore link.'
            },
            {
                type: 'carousel',
                label: 'Luxe Carousel',
                icon: '🎢',
                group: 'Showcase',
                description: 'Full-bleed horizontal image/content slider with text overlay.'
            },

            // ── DATA ─────────────────────────────────────────────────
            {
                type: 'stats',
                label: 'Neural Stats',
                icon: '📊',
                group: 'Data',
                description: 'Large metric counters with labels — e.g. "99% Reliability".'
            },
            {
                type: 'analytics',
                label: 'Insights Analytics',
                icon: '📈',
                group: 'Data',
                description: 'Real-time data cards with sparklines and trend indicators.'
            },
            {
                type: 'timeline',
                label: 'Journey Timeline',
                icon: '🪐',
                group: 'Data',
                description: 'Vertical timeline of milestones, history, or process steps.'
            },

            // ── CONTENT ───────────────────────────────────────────────
            {
                type: 'insights',
                label: 'Insights / Blog Cards',
                icon: '💡',
                group: 'Content',
                description: 'Blog-style article cards with image, category tag, title, and excerpt — matches the Insights Hub.'
            },
            {
                type: 'team',
                label: 'Team Grid',
                icon: '👥',
                group: 'Content',
                description: 'Team member cards with photo/avatar, name, role, and bio — matches the Leadership page.'
            },
            {
                type: 'testimonials',
                label: 'Testimonials',
                icon: '💬',
                group: 'Content',
                description: 'Customer quote cards with name, company logo, and rating stars.'
            },
            {
                type: 'faq',
                label: 'FAQ Accordion',
                icon: '❓',
                group: 'Content',
                description: 'Expandable question/answer pairs with smooth animations.'
            },

            // ── MEDIA ─────────────────────────────────────────────────
            {
                type: 'ecosystem',
                label: 'Ecosystem / Trust Bar',
                icon: '🔗',
                group: 'Media',
                description: 'Infinite marquee of partner logos/integrations — matches the Integration Bar on service pages.'
            },
            {
                type: 'video',
                label: 'Video Embed',
                icon: '🎬',
                group: 'Media',
                description: 'Embed a YouTube or MP4 video with caption and rounded chrome.'
            },
            {
                type: 'pricing',
                label: 'Pricing Table',
                icon: '💎',
                group: 'Media',
                description: 'Three-column pricing tiers with feature comparison list and highlighted popular plan.'
            }
        ]
    },

    // Fetch ALL custom pages from MongoDB and merge into local matrix
    async syncFromDB() {
        try {
            const dbPages = await pagesAPI.getAll()
            for (const dbPage of dbPages) {
                const id = dbPage.page_id
                if (!id) continue

                // For custom pages, DB is the source of truth on load
                // but we only want to add it if it doesn't exist or 
                // if it's already marked as custom.
                if (this.matrix[id]) {
                    // Update existing with DB data
                    this.matrix[id] = {
                        ...this.matrix[id],
                        content: dbPage.content || this.matrix[id].content,
                        theme: dbPage.theme || this.matrix[id].theme,
                        visible: dbPage.visible ?? this.matrix[id].visible,
                        label: dbPage.label || this.matrix[id].label,
                    }
                } else if (dbPage.isCustom) {
                    // New custom page from DB
                    this.matrix[id] = {
                        id,
                        label: dbPage.label || id,
                        path: dbPage.path || `/p/${id}`,
                        visible: dbPage.visible ?? true,
                        group: dbPage.group || 'custom',
                        isCustom: true,
                        theme: dbPage.theme || { primary: '#6366f1', accent: '#a855f7' },
                        content: dbPage.content || []
                    }
                }
            }
            this.save()
        } catch (err) {
            console.warn('DB sync skipped (backend may be offline):', err)
        }
    },

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.matrix))
    }
})

// Persistence watcher - auto-save any reactive change
watch(() => navStore.matrix, () => {
    navStore.save()
}, { deep: true })

// On load: sync custom page content from MongoDB
navStore.syncFromDB()
