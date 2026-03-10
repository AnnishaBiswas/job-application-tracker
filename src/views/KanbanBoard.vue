<script setup>
import { ref, computed, watch } from 'vue'
import { PhMagnifyingGlass, PhFunnel, PhPlus } from '@phosphor-icons/vue'
import { useJobs } from '../composables/useJobs'
import KanbanColumn from '../components/KanbanColumn.vue'
import AddJobModal from '../components/AddJobModal.vue'
import EditJobModal from '../components/EditJobModal.vue'

const { jobs, jobsByStatus, updateJobStatus, deleteJob } = useJobs()

const showAddModal = ref(false)
const showEditModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const editingJob = ref(null)

// Column configuration
const columns = [
  { id: 'applied', title: 'Applied', color: '#3B82F6' },
  { id: 'interview', title: 'Interview', color: '#F59E0B' },
  { id: 'offer', title: 'Offer', color: '#10B981' },
  { id: 'rejected', title: 'Rejected', color: '#F43F5E' }
]

// Get jobs for each column with search/filter
function getColumnJobs(status) {
  let result = jobsByStatus.value[status] || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(j => 
      j.company.toLowerCase().includes(query) ||
      j.position.toLowerCase().includes(query)
    )
  }
  
  return result
}

// Handle job update from drag-drop
function handleJobUpdate(status, newJobs) {
  // Find jobs that moved to this column
  const currentJobIds = jobsByStatus.value[status].map(j => j.id)
  const newJobIds = newJobs.map(j => j.id)
  
  // Find jobs that were added to this column
  const addedJobs = newJobs.filter(j => !currentJobIds.includes(j.id))
  
  // Update status for added jobs
  addedJobs.forEach(job => {
    if (job.status !== status) {
      updateJobStatus(job.id, status)
    }
  })
}

// Column change handlers
const appliedJobs = computed({
  get: () => getColumnJobs('applied'),
  set: (val) => handleJobUpdate('applied', val)
})

const interviewJobs = computed({
  get: () => getColumnJobs('interview'),
  set: (val) => handleJobUpdate('interview', val)
})

const offerJobs = computed({
  get: () => getColumnJobs('offer'),
  set: (val) => handleJobUpdate('offer', val)
})

const rejectedJobs = computed({
  get: () => getColumnJobs('rejected'),
  set: (val) => handleJobUpdate('rejected', val)
})

// Edit/Delete handlers
function handleEditJob(job) {
  editingJob.value = job
  showEditModal.value = true
}

function handleDeleteJob(id) {
  if (confirm('Are you sure you want to delete this job?')) {
    deleteJob(id)
  }
}

function closeEditModal() {
  showEditModal.value = false
  editingJob.value = null
}
</script>

<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Job Board</h1>
      <button class="btn btn-primary" @click="showAddModal = true">
        <PhPlus :size="18" />
        Add Job
      </button>
    </div>

    <!-- Search and Filter -->
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
      
      <div class="filter-wrapper">
        <PhFunnel :size="18" />
        <select v-model="statusFilter" class="select">
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="kanban-board">
      <KanbanColumn 
        v-for="column in columns"
        :key="column.id"
        :title="column.title"
        :status="column.id"
        :color="column.color"
        :jobs="column.id === 'applied' ? appliedJobs : column.id === 'interview' ? interviewJobs : column.id === 'offer' ? offerJobs : rejectedJobs"
        @update:jobs="val => { 
          if (column.id === 'applied') appliedJobs = val
          else if (column.id === 'interview') interviewJobs = val
          else if (column.id === 'offer') offerJobs = val
          else rejectedJobs = val
        }"
        @edit-job="handleEditJob"
        @delete-job="handleDeleteJob"
      />
    </div>

    <!-- Add Job Modal -->
    <AddJobModal 
      v-if="showAddModal" 
      @close="showAddModal = false" 
    />

    <!-- Edit Job Modal -->
    <EditJobModal 
      v-if="showEditModal && editingJob" 
      :job="editingJob"
      @close="closeEditModal" 
    />
  </div>
</template>

<style scoped>
.filter-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-muted);
}

.filter-wrapper .select {
  min-width: 150px;
}
</style>

