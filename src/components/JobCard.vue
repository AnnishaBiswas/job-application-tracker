<script setup>
import { computed } from 'vue'
import { PhPencil, PhTrash, PhMapPin, PhCurrencyDollar, PhCalendar, PhAlarm } from '@phosphor-icons/vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const statusClass = computed(() => {
  return `badge badge-${props.job.status}`
})

const companyInitial = computed(() => {
  return props.job.company.charAt(0).toUpperCase()
})

const formattedDate = computed(() => {
  const date = new Date(props.job.dateApplied)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

// Deadline computed properties
const hasDeadline = computed(() => {
  return props.job.deadline && props.job.deadline.trim() !== ''
})

const formattedDeadline = computed(() => {
  if (!props.job.deadline) return ''
  const date = new Date(props.job.deadline)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const daysUntilDeadline = computed(() => {
  if (!props.job.deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(props.job.deadline)
  deadline.setHours(0, 0, 0, 0)
  const diffTime = deadline - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const isDeadlineSoon = computed(() => {
  if (daysUntilDeadline.value === null) return false
  return daysUntilDeadline.value >= 0 && daysUntilDeadline.value <= 3
})

const isDeadlineOverdue = computed(() => {
  if (daysUntilDeadline.value === null) return false
  return daysUntilDeadline.value < 0
})

function handleEdit() {
  emit('edit', props.job)
}

function handleDelete() {
  emit('delete', props.job.id)
}
</script>

<template>
  <div class="kanban-card job-card">
    <div class="job-card-header">
      <div class="job-card-logo">
        {{ companyInitial }}
      </div>
      <div class="job-card-info">
        <div class="job-card-title">{{ job.position }}</div>
        <div class="job-card-company">{{ job.company }}</div>
      </div>
      <div class="job-card-actions">
        <button class="btn btn-ghost btn-sm" @click="handleEdit" title="Edit">
          <PhPencil :size="14" />
        </button>
        <button class="btn btn-ghost btn-sm" @click="handleDelete" title="Delete">
          <PhTrash :size="14" />
        </button>
      </div>
    </div>
    
    <div class="job-card-meta">
      <span v-if="job.location" class="flex items-center gap-xs">
        <PhMapPin :size="12" />
        {{ job.location }}
      </span>
      <span v-if="job.salary" class="flex items-center gap-xs">
        <PhCurrencyDollar :size="12" />
        {{ job.salary }}
      </span>
      <span class="flex items-center gap-xs">
        <PhCalendar :size="12" />
        {{ formattedDate }}
      </span>
    </div>
    
<span :class="statusClass">
      {{ job.status.charAt(0).toUpperCase() + job.status.slice(1) }}
    </span>
    
    <!-- Deadline Badge -->
    <div v-if="hasDeadline" class="deadline-info">
      <span 
        class="deadline-badge"
        :class="{ 
          'deadline-soon': isDeadlineSoon, 
          'deadline-overdue': isDeadlineOverdue 
        }"
      >
        <PhAlarm :size="12" />
        <span v-if="isDeadlineOverdue">Overdue</span>
        <span v-else-if="isDeadlineSoon">Deadline Soon</span>
        <span v-else>{{ daysUntilDeadline }} days left</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.gap-xs {
  gap: 0.25rem;
}

.deadline-info {
  margin-top: var(--space-sm);
}

.deadline-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.deadline-badge.deadline-soon {
  background-color: #FEF3C7;
  color: #D97706;
}

.deadline-badge.deadline-overdue {
  background-color: #FEE2E2;
  color: #DC2626;
}
</style>

