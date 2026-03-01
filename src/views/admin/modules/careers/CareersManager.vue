<template>
  <div class="careers-manager">
    <transition name="page-fade" mode="out-in">
      <CareersJDList 
        v-if="subTab === 'jds'"
        :jobs="jobs"
        :loading="loading"
        @create="$emit('create')"
        @edit="j => $emit('edit-job', j)"
        @archive="id => $emit('archive-job', id)"
        @delete="id => $emit('delete-job', id)"
        @restore="id => $emit('restore-job', id)"
        @configure-page="$emit('configure-page', 'careers')"
      />
      
      <CareersApplications 
        v-else-if="subTab === 'applicants'"
        :applications="applications"
        :loading="loading"
        @preview="a => $emit('preview-app', a)"
        @updateStatus="(id, s) => $emit('update-app-status', id, s)"
        @delete="id => $emit('delete-app', id)"
        @restore="id => $emit('restore-app', id)"
        @deletePermanent="id => $emit('delete-app-permanent', id)"
      />

      <CareersAuditLog 
        v-else-if="subTab === 'history'"
        :applications="applications"
      />
    </transition>
  </div>
</template>

<script setup>
import CareersJDList from './CareersJDList.vue'
import CareersApplications from './CareersApplications.vue'
import CareersAuditLog from './CareersAuditLog.vue'

const props = defineProps({
  jobs: { type: Array, required: true },
  applications: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  subTab: { type: String, default: 'jds' }
})

const emit = defineEmits(['edit-job', 'archive-job', 'delete-job', 'restore-job', 'preview-app', 'update-app-status', 'delete-app', 'restore-app', 'delete-app-permanent', 'switch-tab', 'create', 'configure-page'])
</script>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active {
  transition: all 0.25s ease;
}
.page-fade-enter-from, .page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
