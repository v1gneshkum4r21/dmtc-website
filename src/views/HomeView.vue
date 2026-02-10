<template>
  <div class="home-view">
    <LandingHeroCarousel />
    <ServiceShowcase />
    <IntegrationEcosystem />
  </div>
</template>

<script setup>
import LandingHeroCarousel from '../components/LandingHeroCarousel.vue'
import IntegrationEcosystem from '../components/IntegrationEcosystem.vue'
import ServiceShowcase from '../components/ServiceShowcase.vue'
</script>

<style scoped>
.home-view {
  width: 100%;
}
</style>
