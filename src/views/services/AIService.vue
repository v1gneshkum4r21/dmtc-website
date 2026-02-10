<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="premium-hero">
      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">AI FOR SERVICE</span>
        </div>
        <h1 class="hero-title">Elevating Experience through <span class="text-gradient">Cognitive Media</span></h1>
        <p class="hero-subtitle">
          From multi-modal intelligence to hyper-realistic digital personas. We build the infrastructure that transforms how brands interact, visualize, and scale.
        </p>
        <div class="hero-actions">
          <button class="primary-btn" @click="scrollToSolutions">
            Explore Capabilities
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Trust / Integration Bar -->
    <section class="trust-bar">
      <p class="trust-label">POWERING THE GLOBAL CREATIVE PIPELINE</p>
      <div class="marquee-container">
        <div class="marquee-content" :style="{ '--item-count': ecosystem.length }">
          <div v-for="(item, index) in [...ecosystem, ...ecosystem, ...ecosystem]" :key="index" class="ecosystem-item">
            <div class="ecosystem-icon" v-html="item.icon" :style="{ color: item.color }"></div>
            <span class="ecosystem-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filterable Solutions Grid -->
    <section class="solutions-explorer" ref="solutionsSection">
      <div class="section-container">
        <div class="section-header centered" ref="solutionsHeader">
          <div class="detail-badge">CAPABILITIES</div>
          <h2>Next-Gen <span class="text-gradient">Media Solutions</span></h2>
        </div>

        <div class="solutions-carousel-wrapper">
          <button class="carousel-nav prev" @click="scrollSolutions('left')" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div class="solutions-grid" ref="solutionsGrid" @mousemove="handleMouseMove">
            <div 
              v-for="solution in solutions" 
              :key="solution.id" 
              class="solution-card"
              :style="{ 
                '--card-accent': solution.accent 
              }"
            >
              <div class="card-glow"></div>
              <div class="sol-header">
                <h3>{{ solution.title }}</h3>
                <div class="sol-subtitle">{{ solution.subtitle }}</div>
              </div>
              <p class="sol-description">{{ solution.description }}</p>
              <ul class="sol-features">
                <li v-for="(feature, index) in solution.features" :key="index">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <div class="sol-footer">
                <span class="view-details">Explore</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>

          <button class="carousel-nav next" @click="scrollSolutions('right')" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Insights Section -->
    <section class="insights-section">
      <div class="section-container">
        <div class="section-header centered">
          <div class="detail-badge">INNOVATION</div>
          <h2>Intelligence in <span class="text-gradient">Motion</span></h2>
          <p>Read our latest breakthroughs in multi-modal learning and automated production.</p>
        </div>

        <div class="insights-grid">
          <div v-for="insight in insights" :key="insight._id" class="insight-card" @click="openInsight(insight)">
            <div class="insight-image">
              <img v-if="insight.imageUrl" :src="insight.imageUrl" :alt="insight.title" class="card-img" />
              <div v-else class="placeholder-img"></div>
            </div>
            <div class="insight-body">
              <div class="insight-meta">Published: {{ formatDate(insight.createdAt) }}</div>
              <h3>{{ insight.title }}</h3>
              <p>{{ insight.excerpt }}</p>
              <button class="read-btn">Read Article</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Insight Reader Modal -->
      <Transition name="fade-in">
        <div v-if="selectedInsight" class="insight-modal-overlay" @click.self="closeInsight">
          <div class="insight-modal-content">
            <button class="close-modal-btn" @click="closeInsight">×</button>
            
            <div class="modal-header">
              <div class="modal-meta">Published: {{ formatDate(selectedInsight.createdAt) }}</div>
              <h2 class="modal-title">{{ selectedInsight.title }}</h2>
              <div class="modal-author">By {{ selectedInsight.author || 'DREAMATIC Team' }}</div>
            </div>

            <div class="modal-image" v-if="selectedInsight.imageUrl">
              <img :src="selectedInsight.imageUrl" :alt="selectedInsight.title" />
            </div>

            <div class="modal-body">
              <div class="insight-full-content" v-html="formatContent(selectedInsight.content)"></div>
            </div>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Final CTA -->
    <section class="page-cta">
      <div class="cta-card">
        <div class="cta-content">
          <h2>Ready to revolutionize your <span class="text-gradient">Service Layer</span>?</h2>
          <p>Deploy the high-performance media intelligence that powers the next generation of digital commerce.</p>
          <div class="cta-actions">
            <button class="primary-btn">Start Full Trial</button>
            <button class="secondary-btn">Schedule Strategy Call</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { insightsAPI } from '@/services/api'

const ecosystem = [
  { name: 'Nvidia', color: '#76B900', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z"/></svg>' },
  { name: 'Unity', color: '#000000', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12.9288 4.2939 3.7997 2.1929c.1366.077.1415.2905 0 .3675l-4.515 2.6076a.4192.4192 0 0 1-.4246 0L7.274 6.8543c-.139-.0745-.1415-.293 0-.3675l3.7972-2.193V0L1.3758 5.5977V16.793l3.7177-2.1456v-4.3858c-.0025-.1565.1813-.2682.318-.1838l4.5148 2.6076a.4252.4252 0 0 1 .2136.3676v5.2127c.0025.1565-.1813.2682-.3179.1838l-3.7996-2.1929-3.7178 2.1457L12 24l9.6954-5.5977-3.7178-2.1457-3.7996 2.1929c-.1341.082-.3229-.0248-.3179-.1838V13.053c0-.1565.087-.2956.2136-.3676l4.5149-2.6076c.134-.082.3228.0224.3179.1838v4.3858l3.7177 2.1456V5.5977L12.9288 0Z"/></svg>' },
  { name: 'Unreal', color: '#000000', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm0 23.52A11.52 11.52 0 1123.52 12 11.52 11.52 0 0112 23.52zm7.13-9.791c-.206.997-1.126 3.557-4.06 4.942l-1.179-1.325-1.988 2a7.338 7.338 0 01-5.804-2.978 2.859 2.859 0 00.65.123c.326.006.678-.114.678-.66v-5.394a.89.89 0 00-1.116-.89c-.92.212-1.656 2.509-1.656 2.509a7.304 7.304 0 012.528-5.597 7.408 7.408 0 013.73-1.721c-1.006.573-1.57 1.507-1.57 2.29 0 1.262.76 1.109.984.923v7.28a1.157 1.157 0 00.148.256 1.075 1.075 0 00.88.445c.76 0 1.747-.868 1.747-.868V9.172c0-.6-.452-1.324-.905-1.572 0 0 .838-.149 1.484.346a5.537 5.537 0 01.387-.425c1.508-1.48 2.929-1.902 4.112-2.112 0 0-2.151 1.69-2.151 3.96 0 1.687.043 5.801.043 5.801.799.771 1.986-.342 3.059-1.441Z"/></svg>' },
  { name: 'Adobe', color: '#FF0000', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z"/></svg>' },
  { name: 'AWS', color: '#232F3E', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg>' },
  { name: 'OpenAI', color: '#412991', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>' },
  { name: 'Hugging Face', color: '#FFD21E', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647 2.822 2.813 2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405-.238.839-2.71-1.587-3.216-.642-.506.946 3.49 2.056 3.522 2.064 1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194 1.13-1.112 1.789-2.738 1.789-2.738s.246-.945.806-.858.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647-2.822 2.813-2.562 3.244 1.176-.506 1.176-.506 2.866-2.567 3.49-1.898-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405.238.839 2.71-1.587 3.216-.642.506.946-3.49 2.056-3.522 2.064-1.29.33-4.568 1.028-5.713-.624"/></svg>' }
]

const solutionsGrid = ref(null)

const handleMouseMove = (e) => {
  if (!solutionsGrid.value) return
  const cards = solutionsGrid.value.querySelectorAll('.solution-card')
  cards.forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mouse-x', `${x}%`)
    card.style.setProperty('--mouse-y', `${y}%`)
  })
}

const scrollSolutions = (direction) => {
  if (!solutionsGrid.value) return
  const scrollAmount = 350
  const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
  solutionsGrid.value.scrollBy({ left: scrollLeft, behavior: 'smooth' })
}

const solutionsHeader = ref(null)

const scrollToSolutions = () => {
  if (!solutionsHeader.value) return
  const headerPosition = solutionsHeader.value.getBoundingClientRect().top
  const offsetPosition = headerPosition + window.pageYOffset - 100 // 100px offset for navbar
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

const solutions = [
  { 
    id: 1, 
    title: 'Multi-Modal Training', 
    subtitle: 'Media Intelligence',
    description: 'Custom neural architectures trained to process and synchronize audio, video, and text for unified comprehension.',
    features: ['Synchronized reasoning', 'Context-aware indexing', 'Semantic search'],
    accent: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
  },
  { 
    id: 2, 
    title: '3D CGI Design', 
    subtitle: 'Automated Visualization',
    description: 'Procedural generation of high-fidelity 3D assets and environments for architectural and creative industries.',
    features: ['Real-time rendering', 'Asset automation', 'Spatial reasoning'],
    accent: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
  },
  { 
    id: 3, 
    title: 'Real Estate Vis', 
    subtitle: 'Property Showcasing',
    description: 'Photorealistic virtual staging and immersive tours that transform property marketing through spatial AI.',
    features: ['Virtual staging', 'Lighting simulation', 'Immersive tours'],
    accent: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)'
  },
  { 
    id: 4, 
    title: 'Interior Design AI', 
    subtitle: 'Smart Interiors',
    description: 'Intelligence-driven space planning and aesthetic optimization tailored to architectural constraints and user preference.',
    features: ['Layout optimization', 'Curation engine', 'Material synthesis'],
    accent: 'linear-gradient(135deg, #14b8a6 0%, #4ade80 100%)'
  },
  { 
    id: 5, 
    title: 'Media Production', 
    subtitle: 'Content Acceleration',
    description: 'Automated post-production workflows that eliminate technical bottlenecks in the creative process.',
    features: ['Auto-grading', 'Scene reconstruction', 'Asset management'],
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
  },
  { 
    id: 6, 
    title: 'AI Avatars', 
    subtitle: 'Digital Personas',
    description: 'Hyper-realistic digital twins capable of autonomous interaction and natural emotional expression.',
    features: ['Natural voice synthesis', 'Action mapping', 'Memory persistence'],
    accent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  },
  { 
    id: 7, 
    title: 'Product Renders', 
    subtitle: 'E-commerce Visuals',
    description: 'Studio-quality product visualization at scale, replacing traditional sets with generative photography.',
    features: ['Multi-angle generation', 'Dynamic lighting', 'Variant automation'],
    accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
  },
  { 
    id: 8, 
    title: 'Analytics AI', 
    subtitle: 'Business Insights',
    description: 'Transforming consumer interaction data into predictive intelligence for strategic growth.',
    features: ['Behavioral mapping', 'Trend forecasting', 'ROI attribution'],
    accent: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)'
  }
]

const insights = ref([])
const selectedInsight = ref(null)

const openInsight = (insight) => {
  selectedInsight.value = insight
  document.body.style.overflow = 'hidden'
}

const closeInsight = () => {
  selectedInsight.value = null
  document.body.style.overflow = 'auto'
}

onMounted(async () => {
  try {
    insights.value = await insightsAPI.getAll('ai-service')
  } catch (err) {
    console.error('Failed to load insights:', err)
  }
})

const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
const formatContent = (c) => c ? c.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') : ''
</script>

<style scoped>
.page-container {
  width: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Premium Hero */
.premium-hero {
  position: relative;
  padding: 12rem 5% 8rem;
  text-align: center;
  overflow: hidden;
  background: var(--bg-secondary);
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #3b82f6;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.primary-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  z-index: 1;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.6s;
  z-index: 2;
}

.primary-btn:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.35);
}

.primary-btn:hover .btn-arrow {
  transform: translateX(5px);
}

.primary-btn:hover::before {
  left: 100%;
}

.secondary-btn {
  padding: 1.25rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--text-primary);
}

/* Trust Bar */
.trust-bar {
  padding: 4rem 0 45px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--glass-border);
  overflow: hidden;
  position: relative;
}

.trust-label {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 850;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  opacity: 0.6;
  margin-bottom: 0px;
  text-transform: uppercase;
}

.marquee-container {
  width: 100%;
  display: flex;
  overflow: hidden;
  user-select: none;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  gap: 4rem;
  animation: marquee 40s linear infinite;
  padding: 1.5rem 2rem;
}

.ecosystem-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1.75rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 100px;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  opacity: 0.7;
}

.ecosystem-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.ecosystem-icon :deep(svg) {
  width: 20px;
  height: 20px;
  min-width: 20px;
  flex-shrink: 0;
  stroke-width: 2.5;
  display: block;
}

.ecosystem-item:hover {
  opacity: 1;
  background: rgba(59, 130, 246, 0.03);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
}

.ecosystem-item:hover .ecosystem-icon {
  transform: scale(1.1);
}

.ecosystem-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-33.333% - 1.333rem)); }
}

/* Solutions Explorer */
.solutions-explorer {
  padding: 0 5% 5rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.solutions-carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-nav {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
}

.carousel-nav:hover {
  background: #3b82f6;
  border-color: #3b82f6;
}

.carousel-nav:hover svg {
  color: white;
}

.carousel-nav.prev {
  left: -24px;
}

.carousel-nav.next {
  right: -24px;
}

.carousel-nav svg {
  width: 20px;
  height: 20px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.centered {
  text-align: center;
  margin: 0 auto 40px;
}

.detail-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

.solution-card {
  position: relative;
  min-width: 260px;
  padding: 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(40px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

/* Holographic Border Effect */
.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: var(--card-accent);
  -webkit-mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  mask: 
     linear-gradient(#fff 0 0) content-box, 
     linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.3;
  transition: opacity 0.4s ease;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--card-accent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.solution-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(59, 130, 246, 0.1);
}

.solution-card:hover::before {
  opacity: 0.8;
}

.solution-card:hover .card-glow {
  opacity: 0.15;
}

.sol-header {
  margin-bottom: 1.25rem;
}

.solution-card h3 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
  background: var(--card-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-height: 3.8rem;
  display: flex;
  align-items: center;
}

.sol-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.8;
}

.sol-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
  min-height: 4.5rem;
}

.sol-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 5rem;
}

.sol-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.sol-features svg {
  width: 12px;
  height: 12px;
  color: var(--card-accent);
  opacity: 1;
  flex-shrink: 0;
}

.sol-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.solution-card:hover .sol-footer {
  opacity: 1;
}

.view-details {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.sol-footer svg {
  width: 14px;
  height: 14px;
  color: var(--text-primary);
}

/* Insights Section */
.insights-section {
  padding: 5rem 5% 10rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.insight-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s;
  cursor: pointer;
}

.insight-card:hover {
  transform: translateY(-10px);
  border-color: #3b82f6;
}

.insight-image {
  aspect-ratio: 16/9;
  background: var(--bg-secondary);
  position: relative;
}

.placeholder-img {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
}

.insight-body {
  padding: 2rem;
}

.insight-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.insight-body h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.insight-body p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.read-btn {
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.95rem;
  transition: opacity 0.3s;
}

.read-btn:hover {
  opacity: 0.8;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Modal Styles */
.insight-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.insight-modal-content {
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 4rem;
  scrollbar-width: thin;
}

.close-modal-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal-btn:hover {
  background: #3b82f6;
  color: white;
}

.modal-header {
  margin-bottom: 3rem;
  text-align: center;
}

.modal-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.1;
  font-weight: 850;
}

.modal-author {
  color: #3b82f6;
  font-weight: 600;
}

.modal-image {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 3rem;
  aspect-ratio: 16/9;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1.15rem;
}

.insight-full-content :deep(p) {
  margin-bottom: 1.5rem;
}

/* Page CTA */
.page-cta {
  padding: 0 5% 10rem;
}

.cta-card {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  padding: 6rem;
  text-align: center;
  backdrop-filter: blur(24px);
  position: relative;
  box-shadow: 0 0 100px rgba(59, 130, 246, 0.05);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.3), 
    0 0 120px rgba(59, 130, 246, 0.15),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
}

.cta-content {
  position: relative;
  z-index: 2;
}

/* Glass reflection effect */
.cta-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  transition: 0.75s;
  pointer-events: none;
}

.cta-card:hover::after {
  left: 150%;
}

.cta-card h2, .cta-card p, .cta-card .cta-actions {
  position: relative;
  z-index: 1;
}

.cta-card h2 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 850;
  letter-spacing: -0.04em;
}

.cta-card p {
  font-size: 1.4rem;
  color: var(--text-secondary);
  margin-bottom: 3.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

/* Transitions */
.grid-fade-enter-active, .grid-fade-leave-active {
  transition: all 0.4s ease;
}
.grid-fade-enter-from, .grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-in-enter-active {
  transition: opacity 0.5s ease;
}
.fade-in-enter-from {
  opacity: 0;
}

/* Large Desktop */
@media (max-width: 1200px) {
  .solutions-grid { 
    grid-template-columns: repeat(3, 1fr); 
    gap: 1.75rem;
  }
}

/* Tablet Responsiveness */
@media (max-width: 1024px) {
  .premium-hero { padding: 10rem 5% 6rem; }
  .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); }
  .hero-subtitle { font-size: 1.2rem; }
  .hero-actions { flex-wrap: wrap; }
  
  .insights-grid { grid-template-columns: repeat(2, 1fr); }
  
  .section-header h2 { font-size: 2.8rem; }
}

/* Medium Tablet */
@media (max-width: 900px) {
  .solutions-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .premium-hero { padding: 8rem 5% 5rem; }
  .hero-title { font-size: 2.5rem; line-height: 1.1; }
  .hero-subtitle { font-size: 1.1rem; }
  .hero-actions { 
    flex-direction: column; 
    width: 100%;
  }
  .primary-btn, .secondary-btn {
    width: 100%;
    padding: 1rem 2rem;
  }
  
  .trust-bar { padding: 3rem 5%; }
  
  .solutions-explorer { padding: 6rem 5% 3rem; }
  
  .carousel-nav {
    display: flex;
  }
  
  .solutions-grid { 
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    gap: 1.5rem;
    padding: 0 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    align-items: stretch;
  }
  
  .solutions-grid::-webkit-scrollbar {
    display: none;
  }
  
  .solution-card { 
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 2rem;
  }
  .solution-card h3 {
    font-size: 1.35rem;
  }
  .sol-description {
    font-size: 0.9rem;
  }
  .sol-features li {
    font-size: 0.85rem;
  }
  
  .insights-section { padding: 3rem 5% 6rem; }
  .insights-grid { grid-template-columns: 1fr; }
  
  .page-cta { padding: 0 5% 6rem; }
  .cta-card { 
    padding: 3rem 2rem; 
    border-radius: 24px;
  }
  .cta-card h2 { font-size: 2rem; }
  .cta-card p { font-size: 1.1rem; }
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .hero-badge { font-size: 0.65rem; padding: 0.4rem 1rem; }
  
  .section-header h2 { font-size: 1.75rem; }
  
  .solution-card {
    padding: 1.75rem;
  }
  .solution-card h3 {
    font-size: 1.25rem;
  }
  .sol-header {
    padding-bottom: 1rem;
  }
  .sol-description {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  .sol-features li {
    font-size: 0.8rem;
    gap: 0.65rem;
  }
  .sol-features svg {
    width: 16px;
    height: 16px;
  }
  
  .cta-card { padding: 2.5rem 1.5rem; }
  .cta-card h2 { font-size: 1.75rem; }
}
</style>
