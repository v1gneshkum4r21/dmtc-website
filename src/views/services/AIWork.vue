<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="premium-hero">

      <div class="hero-content">
        <div class="badge-wrapper">
          <span class="hero-badge">AI FOR WORK</span>
        </div>
        <h1 class="hero-title">Beyond Automation: Orchestrating the <span class="text-gradient">Agentic Frontier</span></h1>
        <p class="hero-subtitle">
          Transform your enterprise into a living neural ecosystem. Eliminate data silos, automate complex reasoning, and deploy autonomous agent swarms that think, learn, and scale with your mission.
        </p>
        <div class="hero-actions">
          <button class="primary-btn" @click="scrollToSolutions">
            Explore Solutions
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Trust / Integration Bar -->
    <section class="trust-bar">
      <p class="trust-label">INTEGRATED WITH YOUR EXISTING ECOSYSTEM</p>
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
          <div class="detail-badge">SOLUTIONS</div>
          <h2>Specialized AI for <span class="text-gradient">Every Task</span></h2>
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
          <div class="detail-badge">INSIGHTS</div>
          <h2>Future-proof your <span class="text-gradient">workforce</span></h2>
          <p>Read our latest research and case studies on the impact of agentic AI in the modern enterprise.</p>
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
          <h2>Ready to initialize the <span class="text-gradient">Agentic Revolution</span>?</h2>
          <p>Join the world's leading enterprises building the next generation of intelligent work on the DREAMATIC Neural Platform.</p>
          <div class="cta-actions">
            <button class="primary-btn">Start Full Platform Trial</button>
            <button class="secondary-btn">Schedule Vision Demo</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { insightsAPI } from '@/services/api'

const ecosystem = [
  { name: 'Microsoft Azure', color: '#0089D6', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32m-3.084-12.531 3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76a1.722 1.722 0 0 0-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684"/></svg>' },
  { name: 'AWS', color: '#232F3E', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg>' },
  { name: 'Google Cloud', color: '#4285F4', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z"/></svg>' },
  { name: 'Salesforce', color: '#00A1E0', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"/></svg>' },
  { name: 'Slack', color: '#4A154B', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>' },
  { name: 'Microsoft Teams', color: '#6264A7', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.625 8.127q-.55 0-1.025-.205-.475-.205-.832-.563-.358-.357-.563-.832Q18 6.053 18 5.502q0-.54.205-1.02t.563-.837q.357-.358.832-.563.474-.205 1.025-.205.54 0 1.02.205t.837.563q.358.357.563.837.205.48.205 1.02 0 .55-.205 1.025-.205.475-.563.832-.357.358-.837.563-.48.205-1.02.205zm0-3.75q-.469 0-.797.328-.328.328-.328.797 0 .469.328.797.328.328.797.328.469 0 .797-.328.328-.328.328-.797 0-.469-.328-.797-.328-.328-.797-.328zM24 10.002v5.578q0 .774-.293 1.46-.293.685-.803 1.194-.51.51-1.195.803-.686.293-1.459.293-.445 0-.908-.105-.463-.106-.85-.329-.293.95-.855 1.729-.563.78-1.319 1.336-.756.557-1.67.861-.914.305-1.898.305-1.148 0-2.162-.398-1.014-.399-1.805-1.102-.79-.703-1.312-1.664t-.674-2.086h-5.8q-.411 0-.704-.293T0 16.881V6.873q0-.41.293-.703t.703-.293h8.59q-.34-.715-.34-1.5 0-.727.275-1.365.276-.639.75-1.114.475-.474 1.114-.75.638-.275 1.365-.275t1.365.275q.639.276 1.114.75.474.475.75 1.114.275.638.275 1.365t-.275 1.365q-.276.639-.75 1.113-.475.475-1.114.75-.638.276-1.365.276-.188 0-.375-.024-.188-.023-.375-.058v1.078h10.875q.469 0 .797.328.328.328.328.797zM12.75 2.373q-.41 0-.78.158-.368.158-.638.434-.27.275-.428.639-.158.363-.158.773 0 .41.158.78.159.368.428.638.27.27.639.428.369.158.779.158.41 0 .773-.158.364-.159.64-.428.274-.27.433-.639.158-.369.158-.779 0-.41-.158-.773-.159-.364-.434-.64-.275-.275-.639-.433-.363-.158-.773-.158zM6.937 9.814h2.25V7.94H2.814v1.875h2.25v6h1.875zm10.313 7.313v-6.75H12v6.504q0 .41-.293.703t-.703.293H8.309q.152.809.556 1.5.405.691.985 1.19.58.497 1.318.779.738.281 1.582.281.926 0 1.746-.352.82-.351 1.436-.966.615-.616.966-1.43.352-.815.352-1.752zm5.25-1.547v-5.203h-3.75v6.855q.305.305.691.452.387.146.809.146.469 0 .879-.176.41-.175.715-.48.304-.305.48-.715t.176-.879Z"/></svg>' },
  { name: 'Snowflake', color: '#29B5E8', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 3.459c0 .646-.418 1.18-1.141 1.18-.723 0-1.142-.534-1.142-1.18 0-.647.419-1.18 1.142-1.18.723 0 1.141.533 1.141 1.18zm-.228 0c0-.533-.38-.951-.913-.951s-.913.38-.913.95c0 .533.38.952.913.952.57 0 .913-.419.913-.951zm-1.37-.533h.495c.266 0 .456.152.456.38 0 .153-.076.229-.19.305l.19.266v.038h-.266l-.19-.266h-.229v.266h-.266zm.495.228h-.229v.267h.229c.114 0 .152-.038.152-.114.038-.077-.038-.153-.152-.153zM7.602 12.4c.038-.151.076-.304.076-.456 0-.114-.038-.228-.038-.342-.114-.343-.304-.647-.646-.838l-4.87-2.777c-.685-.38-1.56-.152-1.94.533-.381.685-.153 1.56.532 1.94l2.701 1.56-2.701 1.56c-.685.38-.913 1.256-.533 1.94.38.685 1.256.914 1.94.533l4.832-2.777c.343-.267.571-.533.647-.876zm1.332 2.626c-.266-.038-.57.038-.837.19l-4.832 2.777c-.685.38-.913 1.256-.532 1.94.38.686 1.255.914 1.94.533l2.701-1.56v3.12c0 .8.647 1.408 1.446 1.408.799 0 1.407-.647 1.407-1.408v-5.592c0-.761-.57-1.37-1.293-1.408zm4.946-6.088c.266.038.57-.038.837-.19l4.832-2.777c.685-.38.913-1.256.532-1.94-.38-.686-1.255-.914-1.94-.533l-2.701 1.56V1.975c0-.799-.647-1.408-1.446-1.408-.799 0-1.446.609-1.446 1.408V7.53c0 .76.609 1.37 1.332 1.407zM3.265 5.97l4.832 2.777c.266.152.533.19.837.19.723-.038 1.331-.684 1.331-1.407V1.975c0-.799-.646-1.408-1.407-1.408-.799 0-1.446.647-1.446 1.408v3.12l-2.701-1.56c-.685-.38-1.56-.152-1.94.533-.419.646-.19 1.521.494 1.902zm9.093 6.011a.412.412 0 00-.114-.266l-.57-.571a.346.346 0 00-.267-.114.412.412 0 00-.266.114l-.571.57a.411.411 0 00-.114.267c0 .076.038.19.114.267l.57.57a.345.345 0 00.267.114c.076 0 .19-.038.266-.114l.571-.57a.412.412 0 00.114-.267zm1.598.533L11.94 14.53c-.039.038-.153.114-.229.114h-.608a.411.411 0 01-.267-.114L8.82 12.514a.408.408 0 01-.076-.229v-.608c0-.076.038-.19.114-.267l2.016-2.016a.41.41 0 01.267-.114h.608a.41.41 0 01.267.114l2.016 2.016a.347.347 0 01.114.267v.608c-.076.077-.114.19-.19.229zm5.593 5.44l-4.832-2.777c-.266-.152-.57-.19-.837-.152-.723.038-1.332.684-1.332 1.408v5.554c0 .8.647 1.408 1.408 1.408.799 0 1.446-.647 1.446-1.408v-3.12l2.7 1.56c.686.38 1.561.152 1.941-.533.419-.646.19-1.521-.494-1.94zm2.549-7.533l-2.701 1.56 2.7 1.56c.686.38.914 1.256.533 1.94-.38.685-1.255.913-1.94.533l-4.832-2.778a1.644 1.644 0 01-.647-.798c-.037-.153-.076-.305-.076-.457 0-.114.039-.228.039-.342.114-.343.342-.647.646-.837l4.832-2.778c.685-.38 1.56-.152 1.94.533.457.609.19 1.484-.494 1.864"/></svg>' },
  { name: 'Databricks', color: '#FF3621', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z"/></svg>' },
  { name: 'Shopify', color: '#96BF48', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/></svg>' },
  { name: 'SAP', color: '#008FD3', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"/></svg>' }
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
    title: 'Conversational AI', 
    subtitle: 'Custom Chatbots',
    description: 'Build intelligent conversational interfaces that understand context, intent, and sentiment to deliver human-like interactions at scale.',
    features: ['Natural language understanding', 'Multi-turn conversations', 'Sentiment analysis'],
    accent: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  { 
    id: 2, 
    title: 'Agentic AI', 
    subtitle: 'Autonomous Systems',
    description: 'Deploy self-directed AI agents that can plan, execute, and adapt to achieve complex goals without constant human oversight.',
    features: ['Goal-oriented planning', 'Self-correction', 'Tool integration'],
    accent: 'linear-gradient(135deg, #8b5cf6 0% , #ec4899 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="3"/></svg>`
  },
  { 
    id: 3, 
    title: 'Generative AI', 
    subtitle: 'Content Creation',
    description: 'Generate high-quality text, code, and creative content using state-of-the-art language models fine-tuned for your domain.',
    features: ['Text generation', 'Code synthesis', 'Creative writing'],
    accent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },
  { 
    id: 4, 
    title: 'Image & Video AI', 
    subtitle: 'Visual Models',
    description: 'Process, analyze, and generate visual content with advanced computer vision and generative models for images and video.',
    features: ['Object detection', 'Image generation', 'Video analysis'],
    accent: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
  { 
    id: 5, 
    title: 'Predictive Analytics', 
    subtitle: 'Forecasting',
    description: 'Leverage machine learning to forecast trends, predict outcomes, and make data-driven decisions with confidence intervals.',
    features: ['Time-series forecasting', 'Anomaly detection', 'Risk assessment'],
    accent: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
  { 
    id: 6, 
    title: 'Recommendation', 
    subtitle: 'Personalization',
    description: 'Deliver personalized experiences with recommendation engines that learn user preferences and adapt in real-time.',
    features: ['Collaborative filtering', 'Content-based matching', 'Real-time personalization'],
    accent: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  { 
    id: 7, 
    title: 'Knowledge Graphs', 
    subtitle: 'RAG Systems',
    description: 'Build retrieval-augmented generation systems that combine structured knowledge graphs with LLMs for accurate, grounded responses.',
    features: ['Semantic search', 'Entity extraction', 'Context retrieval'],
    accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>`
  },
  { 
    id: 8, 
    title: 'AI Automation', 
    subtitle: 'Workflow Intelligence',
    description: 'Automate complex business processes with intelligent workflows that adapt to changing conditions and optimize for efficiency.',
    features: ['Process mining', 'Smart routing', 'Adaptive optimization'],
    accent: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  }
]

// Insights - now loaded from API
const insights = ref([])
const insightsLoading = ref(false)
const selectedInsight = ref(null)

const openInsight = (insight) => {
  selectedInsight.value = insight
  document.body.style.overflow = 'hidden'
}

const closeInsight = () => {
  selectedInsight.value = null
  document.body.style.overflow = 'auto'
}

const formatContent = (content) => {
  if (!content) return ''
  // Basic line break to paragraph conversion for simple text
  // In a real app, you might use a markdown library like marked.js
  return content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
}

// Load insights from API on component mount
onMounted(async () => {
  insightsLoading.value = true
  try {
    insights.value = await insightsAPI.getAll('ai-work')
  } catch (error) {
    console.error('Failed to load insights:', error)
    insights.value = []
  } finally {
    insightsLoading.value = false
  }
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
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--accent-primary);
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
  background: linear-gradient(135deg, var(--accent-primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.25);
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
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.35);
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
  background: rgba(99, 102, 241, 0.03);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
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

/* Capabilities Section */
.capabilities-section {
  padding: 10rem 5%;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  max-width: 800px;
  margin-bottom: 6rem;
}

.section-header h2 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.section-header p {
  font-size: 1.3rem;
  color: var(--text-secondary);
  line-height: 1.6;
}


/* Detail Blocks */
.detail-block {
  padding: 8rem 5%;
  background: var(--bg-secondary);
}

.detail-block.reverse .detail-container {
  flex-direction: row-reverse;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8rem;
}

.detail-text {
  flex: 1;
}

.detail-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
}

.detail-text h2 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.detail-text p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.feature-list li svg {
  width: 20px;
  height: 20px;
  color: var(--accent-primary);
}

.detail-image {
  flex: 1;
}

.glass-image-placeholder {
  aspect-ratio: 4/3;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  padding: 2rem;
  backdrop-filter: blur(40px);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.abstract-shape {
  width: 60%;
  height: 60%;
  filter: blur(80px);
  opacity: 0.4;
  border-radius: 50%;
}

.glass-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  z-index: 3;
  pointer-events: none;
}

/* Solutions Explorer */
.solutions-explorer {
  padding: 0 5% 5rem;
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
  background: var(--accent-primary);
  border-color: var(--accent-primary);
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

.filter-pills {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.filter-pill {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-pill:hover, .filter-pill.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
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
  opacity: 0.3; /* Increased slightly for visibility on light mode */
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
  box-shadow: var(--shadow-md), 0 0 20px rgba(99, 102, 241, 0.1);
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
  border-color: var(--accent-primary);
}

.insight-image {
  aspect-ratio: 16/9;
  background: var(--bg-secondary);
  position: relative;
}

.placeholder-img {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
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
  color: var(--accent-primary);
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
  background: var(--accent-primary);
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
  color: var(--accent-primary);
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

@media (max-width: 768px) {
  .insight-modal-content {
    padding: 2.5rem;
    border-radius: 24px;
  }
  .modal-title {
    font-size: 2rem;
  }
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
  box-shadow: 0 0 100px rgba(99, 102, 241, 0.05);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.3), 
    0 0 120px rgba(99, 102, 241, 0.15),
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
  
  .detail-container { gap: 4rem; }
  .logo-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  
  .capability-bento { 
    grid-template-columns: repeat(2, 1fr); 
    grid-auto-rows: 350px;
  }
  .bento-card.large {
    grid-column: span 2;
  }
  .card-content { padding: 2.5rem; }
  
  .insights-grid { grid-template-columns: repeat(2, 1fr); }
  
  .section-header h2 { font-size: 2.8rem; }
  .detail-text h2 { font-size: 2.5rem; }
}

/* Medium Tablet */
@media (max-width: 900px) {
  .solutions-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem;
  }
  .solution-card {
    padding: 2rem;
  }
  .solution-card h3 {
    font-size: 1.4rem;
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
  .logo-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 2rem;
  }
  
  
  .detail-block { padding: 5rem 5%; }
  .detail-container { 
    flex-direction: column !important; 
    text-align: center;
    gap: 3rem;
  }
  .detail-text h2 { font-size: 2rem; }
  .detail-text p { font-size: 1.05rem; }
  .feature-list { text-align: left; }
  
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
  
  .filter-pills { 
    flex-wrap: wrap; 
    gap: 0.75rem;
  }
  .filter-pill { 
    padding: 0.6rem 1.2rem;
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
  
  .logo-grid { grid-template-columns: 1fr; }
  
  .section-header h2 { font-size: 1.75rem; }
  .detail-text h2 { font-size: 1.75rem; }
  
  .card-content { padding: 1.5rem; }
  .cap-info h3 { font-size: 1.4rem; }
  
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
