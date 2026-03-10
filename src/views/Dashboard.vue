<script setup>
import { computed, ref } from 'vue'
import { 
  PhBriefcase, 
  PhEnvelope, 
  PhCheckCircle, 
  PhXCircle,
  PhArrowRight,
  PhMagnifyingGlass
} from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
import { useJobs } from '../composables/useJobs'
import StatsCard from '../components/StatsCard.vue'
import JobCard from '../components/JobCard.vue'
import AddJobModal from '../components/AddJobModal.vue'

const router = useRouter()
const { jobs, stats, deleteJob } = useJobs()

const showAddModal = ref(false)
const searchQuery = ref('')

const filteredJobs = computed(() => {
  let result = jobs.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(j => 
      j.company.toLowerCase().includes(query) ||
      j.position.toLowerCase().includes(query)
    )
  }
  return result.slice(0, 6) // Show only recent 6
})

function handleDeleteJob(id) {
  if (confirm('Are you sure you want to delete this job?')) {
    deleteJob(id)
  }
}

function goToJobs() {
  router.push('/jobs')
}

function goToAnalytics() {
  router.push('/analytics')
}
</script>

<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <button class="btn btn-primary" @click="showAddModal = true">
        Add Job
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatsCard 
        label="Total Applications" 
        :value="stats.total"
        :icon="PhBriefcase"
        variant="primary"
      />
      <StatsCard 
        label="Applied" 
        :value="stats.applied"
        :icon="PhEnvelope"
        variant="primary"
      />
      <StatsCard 
        label="Interviews" 
        :value="stats.interview"
        :icon="PhCheckCircle"
        variant="warning"
      />
      <StatsCard 
        label="Offers" 
        :value="stats.offer"
        :icon="PhCheckCircle"
        variant="success"
      />
    </div>

    <!-- Search Bar -->
    <div class="search-filter-bar">
      <div class="search-input-wrapper">
        <PhMagnifyingGlass :size="18" />
        <input 
          v-model="searchQuery"
          type="text" 
          class="input" 
          placeholder="Search jobs..."
        />
      </div>
    </div>

    <!-- Recent Jobs Section -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Recent Applications</h2>
        <button class="btn btn-ghost" @click="goToJobs">
          View All <PhArrowRight :size="16" />
        </button>
      </div>
      
      <div v-if="filteredJobs.length > 0" class="jobs-grid">
        <JobCard 
          v-for="job in filteredJobs" 
          :key="job.id" 
          :job="job"
          @delete="handleDeleteJob"
        />
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-state-icon">
          <PhBriefcase :size="32" />
        </div>
        <h3 class="empty-state-title">No jobs yet</h3>
        <p class="empty-state-description">
          Start tracking your job applications by adding your first job.
        </p>
        <button class="btn btn-primary" @click="showAddModal = true">
          Add Your First Job
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-card card" @click="goToJobs">
        <PhBriefcase :size="24" />
        <div>
          <h3>Kanban Board</h3>
          <p>Manage jobs in a drag-and-drop board</p>
        </div>
        <PhArrowRight :size="20" />
      </div>
      
      <div class="action-card card" @click="goToAnalytics">
        <PhCheckCircle :size="24" />
        <div>
          <h3>Analytics</h3>
          <p>View your application statistics</p>
        </div>
        <PhArrowRight :size="20" />
      </div>
    </div>

    <!-- Add Job Modal -->
    <AddJobModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
    />
  </div>
</template>

<style scoped>
.section {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

@media (max-width: 1024px) {
  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.action-card svg:first-child {
  color: var(--color-primary);
  flex-shrink: 0;
}

.action-card div {
  flex: 1;
}

.action-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.action-card p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.action-card svg:last-child {
  color: var(--color-text-muted);
}
</style>

