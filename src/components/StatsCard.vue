<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'warning', 'danger'].includes(v)
  }
})
</script>

<template>
  <div class="card stat-card">
    <div class="stat-icon" :class="`stat-icon-${variant}`">
      <component :is="icon" :size="24" weight="bold" />
    </div>
    <div class="stat-content">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-primary {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.stat-icon-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.stat-icon-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.stat-icon-danger {
  background-color: rgba(244, 63, 94, 0.1);
  color: #F43F5E;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}
</style>

