<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import JobCard from './JobCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  jobs: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
})

const emit = defineEmits(['update:jobs', 'edit-job', 'delete-job'])

const localJobs = computed({
  get: () => props.jobs,
  set: (value) => emit('update:jobs', value)
})

const jobCount = computed(() => props.jobs.length)
</script>

<template>
  <div class="kanban-column">
    <div class="kanban-column-header">
      <div class="kanban-column-title">
        <span 
          class="status-dot" 
          :style="{ backgroundColor: color }"
        ></span>
        {{ title }}
      </div>
      <span class="kanban-column-count">{{ jobCount }}</span>
    </div>
    
    <draggable 
      v-model="localJobs" 
      group="jobs" 
      item-key="id"
      class="kanban-cards"
      ghost-class="sortable-ghost"
      drag-class="sortable-drag"
      :animation="200"
    >
      <template #item="{ element }">
        <JobCard 
          :job="element" 
          @edit="$emit('edit-job', $event)"
          @delete="$emit('delete-job', $event)"
        />
      </template>
    </draggable>
    
    <div v-if="jobs.length === 0" class="kanban-empty">
      <p>No jobs</p>
    </div>
  </div>
</template>

<style scoped>
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.kanban-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  margin-top: var(--space-sm);
}
</style>

