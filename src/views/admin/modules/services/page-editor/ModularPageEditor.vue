<template>
  <div class="page-editor-overlay" @click.self="$emit('close')">
    <div class="page-editor-container card-premium shadow-2xl">
      <header class="editor-header">
        <div class="header-meta">
          <span class="context-tag">{{ pageId.toUpperCase() }} MODULAR NODE</span>
          <h2>Modular <span class="text-gradient-primary">Architect</span></h2>
        </div>
        <div class="editor-nav">
          <button 
            v-for="tab in ['Builder', 'Theme']" 
            :key="tab"
            :class="['tab-btn', { active: activeTab === tab.toLowerCase() }]"
            @click="activeTab = tab.toLowerCase()"
          >
            {{ tab }}
          </button>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </header>

      <div class="editor-shell">
        <!-- Controls Column -->
        <div class="editor-controls">
          
          <!-- BUILDER TAB -->
          <div v-show="activeTab === 'builder'" class="pane-stack">
            <div class="section-header">
              <h3>Page Structure</h3>
              <p>Drag and drop components to build your page layout.</p>
            </div>

            <div class="blocks-list">
              <div v-for="(block, index) in config.content" :key="block.id" class="block-editor-card card-premium">
                <div class="block-header">
                  <div class="block-type-info">
                    <span class="type-icon">{{ getBlockIcon(block.type) }}</span>
                    <span class="type-label">{{ block.type.toUpperCase() }}</span>
                  </div>
                  <div class="block-actions">
                    <button class="action-btn" @click="moveBlock(index, -1)" :disabled="index === 0">↑</button>
                    <button class="action-btn" @click="moveBlock(index, 1)" :disabled="index === config.content.length - 1">↓</button>
                    <button class="action-btn danger" @click="config.content.splice(index, 1)">✕</button>
                  </div>
                </div>

                <!-- Block Specific Fields -->
                <div class="block-fields">
                  <div v-if="block.type === 'hero' || block.type === 'cta' || block.type === 'content'" class="field-item">
                    <label>Title</label>
                    <input v-model="block.title" type="text" class="input-premium">
                  </div>
                  <div v-if="block.type === 'hero' || block.type === 'cta'" class="field-item">
                    <label>Subtitle</label>
                    <textarea v-model="block.subtitle" rows="2" class="input-premium"></textarea>
                  </div>
                  <div v-if="block.type === 'hero'" class="field-item">
                    <label>Badge Text</label>
                    <input v-model="block.badge" type="text" class="input-premium">
                  </div>
                   <div v-if="block.type === 'cta'" class="field-item">
                    <label>Button Text</label>
                    <input v-model="block.buttonText" type="text" class="input-premium">
                  </div>
                  <div v-if="block.type === 'content'" class="field-item">
                    <label>Body Text</label>
                    <textarea v-model="block.text" rows="5" class="input-premium"></textarea>
                  </div>

                  <!-- Features Block Items -->
                  <div v-if="block.type === 'features'" class="sub-list">
                    <label>Feature Items</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.icon" type="text" placeholder="Emoji/Icon" class="input-premium mini">
                      <input v-model="item.title" type="text" placeholder="Title" class="input-premium">
                      <textarea v-model="item.description" rows="2" placeholder="Description" class="input-premium"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addFeatureItem(block)">+ Add Feature</button>
                  </div>

                  <!-- Stats Block Items -->
                  <div v-if="block.type === 'stats'" class="sub-list">
                    <label>Statistical Nodes</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.value" type="text" placeholder="Value (e.g. 99%)" class="input-premium">
                      <input v-model="item.label" type="text" placeholder="Label" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addStatItem(block)">+ Add Stat</button>
                  </div>

                  <!-- Carousel Block Items -->
                  <div v-if="block.type === 'carousel'" class="sub-list">
                    <label>Carousel Slides</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.image" type="text" placeholder="Image URL" class="input-premium">
                      <input v-model="item.title" type="text" placeholder="Slide Title" class="input-premium">
                      <textarea v-model="item.description" rows="2" placeholder="Slide Text" class="input-premium"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addCarouselItem(block)">+ Add Slide</button>
                  </div>

                  <!-- Cards Block Items -->
                  <div v-if="block.type === 'cards'" class="sub-list">
                    <label>Feature Cards</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.icon" type="text" placeholder="Emoji/Icon" class="input-premium mini">
                      <input v-model="item.title" type="text" placeholder="Card Title" class="input-premium">
                      <textarea v-model="item.description" rows="2" placeholder="Card Body" class="input-premium"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addCardItem(block)">+ Add Card</button>
                  </div>

                  <!-- Analytics Block Items -->
                  <div v-if="block.type === 'analytics'" class="sub-list">
                    <label>Data Points</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.label" type="text" placeholder="Metric Name" class="input-premium">
                      <input v-model="item.value" type="text" placeholder="Current Value" class="input-premium">
                      <input v-model="item.change" type="text" placeholder="+12% (optional)" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addAnalyticsItem(block)">+ Add Metric</button>
                  </div>

                  <!-- Solutions Framework Items -->
                  <div v-if="block.type === 'solutions'" class="sub-list">
                    <label>Solution Cards</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.title" type="text" placeholder="Solution Title" class="input-premium">
                      <input v-model="item.subtitle" type="text" placeholder="Subtitle / Category" class="input-premium">
                      <textarea v-model="item.description" rows="2" placeholder="Short Description" class="input-premium"></textarea>
                      <input v-model="item.accent" type="text" placeholder="CSS gradient e.g. linear-gradient(135deg,#6366f1,#a855f7)" class="input-premium">
                      <label class="sub-label">Features (one per line)</label>
                      <textarea v-model="item.featuresRaw" rows="3" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" class="input-premium" @input="item.features = item.featuresRaw.split('\n').filter(f => f)"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addSolutionItem(block)">+ Add Solution</button>
                  </div>

                  <!-- Insights / Blog Cards -->
                  <div v-if="block.type === 'insights'" class="sub-list">
                    <label>Blog / Insight Cards</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.image" type="text" placeholder="Cover Image URL" class="input-premium">
                      <input v-model="item.category" type="text" placeholder="Category Tag (e.g. AI, Research)" class="input-premium">
                      <input v-model="item.title" type="text" placeholder="Article Title" class="input-premium">
                      <textarea v-model="item.excerpt" rows="2" placeholder="Short excerpt..." class="input-premium"></textarea>
                      <input v-model="item.readTime" type="text" placeholder="Read time (e.g. 5 min)" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addInsightItem(block)">+ Add Article</button>
                  </div>

                  <!-- Team Grid -->
                  <div v-if="block.type === 'team'" class="sub-list">
                    <label>Team Members</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.image" type="text" placeholder="Photo URL (or leave blank for initials)" class="input-premium">
                      <input v-model="item.initials" type="text" placeholder="Initials (e.g. AS)" class="input-premium mini">
                      <input v-model="item.name" type="text" placeholder="Full Name" class="input-premium">
                      <input v-model="item.role" type="text" placeholder="Role / Title" class="input-premium">
                      <textarea v-model="item.bio" rows="2" placeholder="Short bio..." class="input-premium"></textarea>
                      <input v-model="item.accent" type="text" placeholder="Avatar gradient e.g. linear-gradient(135deg,#3b82f6,#2563eb)" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addTeamItem(block)">+ Add Member</button>
                  </div>

                  <!-- Testimonials -->
                  <div v-if="block.type === 'testimonials'" class="sub-list">
                    <label>Testimonials</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <textarea v-model="item.quote" rows="3" placeholder="Customer quote..." class="input-premium"></textarea>
                      <input v-model="item.author" type="text" placeholder="Author Name" class="input-premium">
                      <input v-model="item.company" type="text" placeholder="Company / Role" class="input-premium">
                      <input v-model="item.rating" type="number" min="1" max="5" placeholder="Rating (1-5)" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addTestimonialItem(block)">+ Add Testimonial</button>
                  </div>

                  <!-- FAQ Accordion -->
                  <div v-if="block.type === 'faq'" class="sub-list">
                    <label>FAQ Items</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.question" type="text" placeholder="Question" class="input-premium">
                      <textarea v-model="item.answer" rows="3" placeholder="Answer..." class="input-premium"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addFaqItem(block)">+ Add FAQ</button>
                  </div>

                  <!-- Ecosystem / Trust Bar -->
                  <div v-if="block.type === 'ecosystem'" class="sub-list">
                    <label>Integration Logos</label>
                    <div class="field-item">
                      <label>Section Label</label>
                      <input v-model="block.label" type="text" placeholder="INTEGRATED WITH YOUR ECOSYSTEM" class="input-premium">
                    </div>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.name" type="text" placeholder="Technology Name" class="input-premium">
                      <input v-model="item.icon" type="text" placeholder="Emoji or SVG (e.g. 🔵)" class="input-premium">
                      <input v-model="item.color" type="text" placeholder="Color (e.g. #3b82f6)" class="input-premium">
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addEcosystemItem(block)">+ Add Integration</button>
                  </div>

                  <!-- Video Embed -->
                  <div v-if="block.type === 'video'" class="sub-list">
                    <div class="field-item">
                      <label>Video URL (YouTube or MP4)</label>
                      <input v-model="block.url" type="text" placeholder="https://youtube.com/embed/..." class="input-premium">
                    </div>
                    <div class="field-item">
                      <label>Caption (optional)</label>
                      <input v-model="block.caption" type="text" placeholder="Video caption text" class="input-premium">
                    </div>
                  </div>

                  <!-- Pricing Table -->
                  <div v-if="block.type === 'pricing'" class="sub-list">
                    <label>Pricing Tiers</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.name" type="text" placeholder="Plan Name (e.g. Pro)" class="input-premium">
                      <input v-model="item.price" type="text" placeholder="Price (e.g. $49/mo)" class="input-premium">
                      <input v-model="item.description" type="text" placeholder="One-line tagline" class="input-premium">
                      <label class="sub-label">Features (one per line)</label>
                      <textarea v-model="item.featuresRaw" rows="4" placeholder="Feature A&#10;Feature B" class="input-premium" @input="item.features = item.featuresRaw.split('\n').filter(f => f)"></textarea>
                      <div class="field-item" style="display:flex; gap:10px; align-items:center;">
                        <input type="checkbox" v-model="item.popular" id="popular">
                        <label for="popular" style="font-size:0.8rem;">Mark as Popular</label>
                      </div>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addPricingItem(block)">+ Add Tier</button>
                  </div>

                  <!-- Timeline -->
                  <div v-if="block.type === 'timeline'" class="sub-list">
                    <label>Timeline Events</label>
                    <div v-for="(item, iIdx) in block.items" :key="iIdx" class="sub-item card-premium">
                      <input v-model="item.year" type="text" placeholder="Year / Date" class="input-premium mini">
                      <input v-model="item.title" type="text" placeholder="Milestone Title" class="input-premium">
                      <textarea v-model="item.description" rows="2" placeholder="Description..." class="input-premium"></textarea>
                      <button class="remove-mini" @click="block.items.splice(iIdx, 1)">✕</button>
                    </div>
                    <button class="btn-ghost mini mt-2" @click="addTimelineItem(block)">+ Add Event</button>
                  </div>

                </div>
              </div>
            </div>

            <!-- Add Component Selector (Grouped) -->
            <div class="add-component-vessel">
              <h4>Inject Component</h4>
              <div v-for="groupName in componentGroups" :key="groupName" class="comp-group">
                <div class="comp-group-label">{{ groupName }}</div>
                <div class="component-grid">
                  <div 
                    v-for="comp in getLibraryByGroup(groupName)" 
                    :key="comp.type" 
                    class="comp-trigger card-premium"
                    :title="comp.description"
                    @click="addComponent(comp.type)"
                  >
                    <span class="comp-icon">{{ comp.icon }}</span>
                    <span class="comp-label">{{ comp.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- THEME TAB -->
          <div v-show="activeTab === 'theme'" class="pane-stack">
            <div class="section-header">
              <h3>Chromatic Profile</h3>
              <p>Configure the global aesthetic for this neural node.</p>
            </div>

            <div class="theme-form card-premium">
              <div class="field-item">
                <label>Primary Brand Color</label>
                <div class="color-picker-row">
                  <input type="color" v-model="config.theme.primary" class="color-sq">
                  <input type="text" v-model="config.theme.primary" class="input-premium">
                </div>
              </div>
              <div class="field-item">
                <label>Accent Secondary</label>
                <div class="color-picker-row">
                  <input type="color" v-model="config.theme.accent" class="color-sq">
                  <input type="text" v-model="config.theme.accent" class="input-premium">
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Live Preview Pane -->
        <aside class="editor-preview" :style="{ '--primary': config.theme.primary, '--accent': config.theme.accent }">
          <div class="preview-stage">
            <div class="preview-scroll-area">
              <DynamicViewContent :page-data="config" is-preview />
            </div>
          </div>
        </aside>
      </div>

      <footer class="editor-footer">
        <button class="btn-ghost" @click="$emit('close')">Abandon</button>
        <button class="btn-primary-luxe" @click="saveChanges">
          <span class="btn-text">Deploy Changes</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navStore } from '@/store/navigation'
import DynamicViewContent from '@/views/DynamicView.vue'

const props = defineProps({
  pageId: { type: String, required: true }
})

const emit = defineEmits(['close', 'saved'])

const activeTab = ref('builder')
const config = ref({
  theme: { primary: '#6366f1', accent: '#a855f7' },
  content: []
})

onMounted(() => {
  const existing = navStore.matrix[props.pageId]
  if (existing) {
    config.value = JSON.parse(JSON.stringify(existing))
    if (!config.value.theme) config.value.theme = { primary: '#6366f1', accent: '#a855f7' }
  }
})

// ── Component Library Helpers ──────────────────────────────────────────
const componentGroups = computed(() => {
  const lib = navStore.getComponentLibrary()
  return [...new Set(lib.map(c => c.group))]
})

const getLibraryByGroup = (groupName) => {
  return navStore.getComponentLibrary().filter(c => c.group === groupName)
}

const getBlockIcon = (type) => {
  const lib = navStore.getComponentLibrary()
  return lib.find(c => c.type === type)?.icon || '✦'
}

// ── Block Management ───────────────────────────────────────────────────
const moveBlock = (index, delta) => {
  const target = index + delta
  if (target < 0 || target >= config.value.content.length) return
  const arr = config.value.content
  ;[arr[index], arr[target]] = [arr[target], arr[index]]
}

const addComponent = (type) => {
  const defaults = {
    hero:       { title: 'New Hero Section', subtitle: 'Compelling subtitle here.', badge: 'NODE_ALPHA', buttonText: 'Explore Now' },
    content:    { title: 'Rich Text Block', text: 'Write your content here...' },
    cta:        { title: 'Ready to get started?', subtitle: 'Join thousands building the future.', buttonText: 'Contact Us' },
    stats:      { title: 'By the Numbers', items: [{ value: '99%', label: 'Reliability' }, { value: '10M+', label: 'Tasks Automated' }] },
    features:   { title: 'Key Capabilities', items: [{ icon: '✦', title: 'Capability One', description: 'Brief explanation of this feature.' }] },
    cards:      { title: 'Premium Showcase', items: [{ icon: '🧠', title: 'Card Title', description: 'Explore this capability in depth.' }] },
    carousel:   { title: 'Featured Showcase', items: [{ image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200', title: 'First Slide', description: 'Impactful one-liner.' }] },
    analytics:  { title: 'Platform Metrics', items: [{ label: 'Latency', value: '4.8ms', change: '+12%' }, { label: 'Uptime', value: '99.99%', change: '+0.1%' }] },
    solutions:  { title: 'Solutions Framework', items: [{ id: 1, title: 'Solution A', subtitle: 'Category', description: 'What this solves.', accent: 'linear-gradient(135deg,#6366f1,#a855f7)', features: ['Feature 1', 'Feature 2'], featuresRaw: 'Feature 1\nFeature 2' }] },
    insights:   { title: 'Latest Insights', items: [{ image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600', category: 'AI', title: 'The Future of Agentic AI', excerpt: 'How autonomous agents are reshaping work.', readTime: '5 min' }] },
    team:       { title: 'Meet the Team', items: [{ name: 'Dr. Alex Chen', role: 'CEO & Co-Founder', initials: 'AC', bio: 'Former AI lead at leading research labs.', accent: 'linear-gradient(135deg,#3b82f6,#2563eb)', image: '' }] },
    testimonials:{ title: 'What Our Clients Say', items: [{ quote: 'DREAMATIC transformed how we operate at scale.', author: 'Jane Smith', company: 'CTO, Acme Corp', rating: 5 }] },
    faq:        { title: 'Frequently Asked Questions', items: [{ question: 'How does it work?', answer: 'Our platform uses agentic AI to...' }] },
    ecosystem:  { title: '', label: 'INTEGRATED WITH YOUR ECOSYSTEM', items: [{ name: 'OpenAI', icon: '🤖', color: '#10b981' }, { name: 'Salesforce', icon: '☁️', color: '#3b82f6' }, { name: 'Slack', icon: '💬', color: '#a855f7' }] },
    video:      { title: 'Product Walkthrough', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'See DREAMATIC in action.' },
    pricing:    { title: 'Simple, Transparent Pricing', items: [
      { name: 'Starter', price: 'Free', description: 'Get started with the basics.', features: ['5 agents', '1,000 tasks/mo'], featuresRaw: '5 agents\n1,000 tasks/mo', popular: false },
      { name: 'Pro', price: '$49/mo', description: 'For growing teams.', features: ['50 agents', '100K tasks/mo', 'Priority support'], featuresRaw: '50 agents\n100K tasks/mo\nPriority support', popular: true },
      { name: 'Enterprise', price: 'Custom', description: 'Unlimited scale.', features: ['Unlimited agents', 'SLA guarantee', 'Dedicated CSM'], featuresRaw: 'Unlimited agents\nSLA guarantee\nDedicated CSM', popular: false }
    ]},
    timeline:   { title: 'Our Journey', items: [{ year: '2022', title: 'Founded', description: 'DREAMATIC was born in a small R&D lab.' }, { year: '2024', title: 'Series A', description: 'Raised $20M to accelerate global expansion.' }] },
  }

  const base = { id: Math.random().toString(36).substr(2, 9), type }
  config.value.content.push({ ...base, ...(defaults[type] || { title: 'New Block' }) })
}

// ── Item Add Helpers ───────────────────────────────────────────────────
const addCarouselItem    = (b) => { if (!b.items) b.items = []; b.items.push({ image: '', title: 'Slide Title', description: 'Slide text...' }) }
const addCardItem        = (b) => { if (!b.items) b.items = []; b.items.push({ icon: '✦', title: 'New Card', description: 'Feature description.' }) }
const addAnalyticsItem   = (b) => { if (!b.items) b.items = []; b.items.push({ label: 'New Metric', value: '00', change: '0%' }) }
const addFeatureItem     = (b) => { if (!b.items) b.items = []; b.items.push({ icon: '✦', title: 'New Feature', description: 'Description text...' }) }
const addStatItem        = (b) => { if (!b.items) b.items = []; b.items.push({ value: '00', label: 'New Metric' }) }
const addSolutionItem    = (b) => { if (!b.items) b.items = []; b.items.push({ id: b.items.length + 1, title: 'New Solution', subtitle: 'Category', description: 'Description.', accent: 'linear-gradient(135deg,#6366f1,#a855f7)', features: [], featuresRaw: '' }) }
const addInsightItem     = (b) => { if (!b.items) b.items = []; b.items.push({ image: '', category: 'AI', title: 'New Article', excerpt: 'Excerpt...', readTime: '3 min' }) }
const addTeamItem        = (b) => { if (!b.items) b.items = []; b.items.push({ name: 'New Member', role: 'Role', initials: 'NM', bio: 'Bio...', accent: 'linear-gradient(135deg,#6366f1,#a855f7)', image: '' }) }
const addTestimonialItem = (b) => { if (!b.items) b.items = []; b.items.push({ quote: 'Great product!', author: 'John Doe', company: 'CEO, Company', rating: 5 }) }
const addFaqItem         = (b) => { if (!b.items) b.items = []; b.items.push({ question: 'New Question?', answer: 'Answer here...' }) }
const addEcosystemItem   = (b) => { if (!b.items) b.items = []; b.items.push({ name: 'New Tool', icon: '🔵', color: '#6366f1' }) }
const addPricingItem     = (b) => { if (!b.items) b.items = []; b.items.push({ name: 'New Plan', price: '$0/mo', description: 'Plan tagline.', features: [], featuresRaw: '', popular: false }) }
const addTimelineItem    = (b) => { if (!b.items) b.items = []; b.items.push({ year: '2025', title: 'New Milestone', description: 'Description...' }) }

const saveChanges = () => {
  navStore.updateCustomPage(props.pageId, config.value)
  emit('saved')
  emit('close')
}
</script>

<style scoped>
.page-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(24px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.page-editor-container {
  width: 96vw;
  max-width: 1600px;
  height: 92vh;
  display: flex;
  flex-direction: column;
  background: #050507;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
}

.editor-header {
  padding: 1.25rem 2rem;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 1rem;
  flex-wrap: wrap;
}

.editor-nav {
  display: flex;
  background: rgba(0,0,0,0.4);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
}

.tab-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: #71717a;
  font-weight: 800;
  font-size: 0.78rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s;
  white-space: nowrap;
}
.tab-btn.active { background: rgba(255,255,255,0.07); color: white; }

/* Shell — side by side on desktop */
.editor-shell {
  flex: 1;
  display: grid;
  grid-template-columns: 460px 1fr;
  overflow: hidden;
  min-height: 0; /* critical so flex children don't overflow */
}

/* Left panel — scrollable */
.editor-controls {
  padding: 1.75rem;
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(99,102,241,0.4) transparent;
}
.editor-controls::-webkit-scrollbar { width: 5px; }
.editor-controls::-webkit-scrollbar-track { background: transparent; }
.editor-controls::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 99px; }

.block-editor-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem !important;
  background: rgba(255,255,255,0.01) !important;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.block-type-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-icon { font-size: 1.2rem; }
.type-label { font-size: 0.65rem; font-weight: 900; color: var(--primary); letter-spacing: 0.1em; }

.block-actions { display: flex; gap: 4px; }
.action-btn {
  width: 28px; height: 28px; border: none; background: rgba(255,255,255,0.05);
  color: #a1a1aa; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.action-btn:hover { background: rgba(255,255,255,0.1); color: white; }
.action-btn.danger:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.block-fields { display: flex; flex-direction: column; gap: 1.25rem; }
.field-item label { display: block; font-size: 0.65rem; font-weight: 900; color: #52525b; text-transform: uppercase; margin-bottom: 0.5rem; }

.input-premium {
  width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 0.75rem 1rem; color: white; font-size: 0.85rem;
}

/* Component Selector */
.add-component-vessel { margin-top: 2rem; }
.add-component-vessel h4 { font-size: 0.8rem; font-weight: 950; color: white; margin-bottom: 1.5rem; text-align: center; letter-spacing: 0.15em; }

.comp-group { margin-bottom: 1.5rem; }
.comp-group-label {
  font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em;
  color: #52525b; padding: 0.4rem 0; margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.component-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.comp-trigger {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 1.25rem 1rem !important; cursor: pointer; transition: 0.3s; text-align: center;
}
.comp-trigger:hover { background: rgba(99,102,241,0.08) !important; border-color: var(--primary); transform: translateY(-2px); }
.comp-icon { font-size: 1.4rem; }
.comp-label { font-size: 0.7rem; font-weight: 800; color: white; line-height: 1.3; }

.sub-label { display: block; font-size: 0.6rem; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; margin-bottom: 0.3rem; }

/* Theme Styles */
.color-picker-row { display: flex; gap: 1rem; align-items: center; }
.color-sq { width: 40px; height: 40px; border-radius: 10px; border: none; background: none; cursor: pointer; }

/* Preview panel — scrollable */
.editor-preview {
  background: #020204;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.preview-stage {
  flex: 1;
  border-radius: 18px;
  background: #050507;
  border: 1px solid rgba(255,255,255,0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.preview-scroll-area {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(99,102,241,0.3) transparent;
}
.preview-scroll-area::-webkit-scrollbar { width: 5px; }
.preview-scroll-area::-webkit-scrollbar-track { background: transparent; }
.preview-scroll-area::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 99px; }

.editor-footer {
  padding: 1.25rem 2rem;
  background: rgba(255,255,255,0.02);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}

.close-btn { background: none; border: none; color: #3f3f46; font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: white; transform: rotate(90deg); }

.sub-item { position: relative; padding: 1rem !important; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.remove-mini { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #ef4444; cursor: pointer; }
.mt-2 { margin-top: 0.5rem; }

/* ── ≤1200px: narrow left panel ── */
@media (max-width: 1200px) {
  .editor-shell { grid-template-columns: 380px 1fr; }
}

/* ── ≤960px: stacked — both halves visible and scrollable ── */
@media (max-width: 960px) {
  .page-editor-container { width: 98vw; height: 95vh; border-radius: 20px; }
  .editor-header { padding: 1rem 1.25rem; }
  .editor-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 55% 45%;
    overflow: hidden;
  }
  .editor-controls {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 1.25rem;
  }
  .editor-preview { padding: 1rem; }
}

/* ── ≤600px: mobile — editor full height, preview hidden ── */
@media (max-width: 600px) {
  .page-editor-container { width: 100vw; height: 100dvh; border-radius: 0; }
  .editor-header { padding: 0.9rem 1rem; flex-wrap: nowrap; }
  .editor-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
  }
  .editor-preview { display: none; }
  .editor-controls { padding: 1rem; }
  .component-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  .comp-trigger { padding: 0.75rem 0.5rem !important; }
  .comp-icon { font-size: 1.1rem; }
  .comp-label { font-size: 0.62rem; }
  .tab-btn { padding: 6px 12px; font-size: 0.72rem; }
  .input-premium { padding: 0.6rem 0.75rem; font-size: 0.8rem; }
  .editor-footer { padding: 0.9rem 1rem; gap: 0.75rem; }
}
</style>
