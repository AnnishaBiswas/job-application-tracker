import { ref, computed, watch } from 'vue'

// Get current date for dynamic sample data
const today = new Date()
const todayStr = today.toISOString().split('T')[0]

// Helper to add days to a date
function addDays(dateStr, days) {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const twoDaysFromNow = addDays(todayStr, 2)
const fiveDaysFromNow = addDays(todayStr, 5)
const tenDaysFromNow = addDays(todayStr, 10)
const yesterday = addDays(todayStr, -1)

// Default sample data
const defaultJobs = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Frontend Developer',
    status: 'applied',
    dateApplied: addDays(todayStr, -5),
    deadline: twoDaysFromNow,
    salary: '$150,000 - $200,000',
    location: 'Remote',
    notes: 'Applied through LinkedIn - Deadline Soon!'
  },
  {
    id: '2',
    company: 'Meta',
    position: 'Full Stack Engineer',
    status: 'interview',
    dateApplied: addDays(todayStr, -10),
    deadline: fiveDaysFromNow,
    salary: '$140,000 - $180,000',
    location: 'Menlo Park, CA',
    notes: 'First technical interview scheduled'
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'Software Development Engineer',
    status: 'offer',
    dateApplied: addDays(todayStr, -15),
    deadline: yesterday,
    salary: '$130,000 - $170,000',
    location: 'Seattle, WA',
    notes: 'Received offer! - OVERDUE'
  },
  {
    id: '4',
    company: 'Netflix',
    position: 'UI Engineer',
    status: 'rejected',
    dateApplied: addDays(todayStr, -20),
    salary: '$145,000 - $190,000',
    location: 'Los Gatos, CA',
    notes: 'Not moving forward'
  },
  {
    id: '5',
    company: 'Apple',
    position: 'iOS Developer',
    status: 'applied',
    dateApplied: addDays(todayStr, -3),
    deadline: tenDaysFromNow,
    salary: '$160,000 - $210,000',
    location: 'Cupertino, CA',
    notes: 'Direct application'
  },
  {
    id: '6',
    company: 'Microsoft',
    position: 'Frontend Developer',
    status: 'interview',
    dateApplied: addDays(todayStr, -7),
    salary: '$120,000 - $160,000',
    location: 'Redmond, WA',
    notes: 'Technical screen completed - No deadline set'
  }
]

// Reactive state
const jobs = ref([])
const isInitialized = ref(false)

// Initialize from localStorage or defaults
function initializeJobs() {
  if (isInitialized.value) return
  
  const stored = localStorage.getItem('job-tracker-jobs')
  if (stored) {
    try {
      jobs.value = JSON.parse(stored)
    } catch (e) {
      jobs.value = [...defaultJobs]
    }
  } else {
    jobs.value = [...defaultJobs]
  }
  isInitialized.value = true
}

// Save to localStorage
function saveJobs() {
  localStorage.setItem('job-tracker-jobs', JSON.stringify(jobs.value))
}

// Watch for changes and save
watch(jobs, saveJobs, { deep: true })

// Computed properties
const totalJobs = computed(() => jobs.value.length)

const jobsByStatus = computed(() => {
  return {
    applied: jobs.value.filter(j => j.status === 'applied'),
    interview: jobs.value.filter(j => j.status === 'interview'),
    offer: jobs.value.filter(j => j.status === 'offer'),
    rejected: jobs.value.filter(j => j.status === 'rejected')
  }
})

const stats = computed(() => ({
  total: jobs.value.length,
  applied: jobsByStatus.value.applied.length,
  interview: jobsByStatus.value.interview.length,
  offer: jobsByStatus.value.offer.length,
  rejected: jobsByStatus.value.rejected.length,
  responseRate: jobs.value.length > 0 
    ? Math.round(((jobsByStatus.value.interview.length + jobsByStatus.value.offer.length + jobsByStatus.value.rejected.length) / jobs.value.length) * 100)
    : 0,
  offerRate: jobs.value.length > 0
    ? Math.round((jobsByStatus.value.offer.length / jobs.value.length) * 100)
    : 0
}))

// Methods
function addJob(job) {
  const newJob = {
    ...job,
    id: Date.now().toString(),
    dateApplied: job.dateApplied || new Date().toISOString().split('T')[0]
  }
  jobs.value.push(newJob)
  return newJob
}

function updateJob(id, updates) {
  const index = jobs.value.findIndex(j => j.id === id)
  if (index !== -1) {
    jobs.value[index] = { ...jobs.value[index], ...updates }
    return jobs.value[index]
  }
  return null
}

function deleteJob(id) {
  const index = jobs.value.findIndex(j => j.id === id)
  if (index !== -1) {
    jobs.value.splice(index, 1)
    return true
  }
  return false
}

function updateJobStatus(id, newStatus) {
  return updateJob(id, { status: newStatus })
}

function getJob(id) {
  return jobs.value.find(j => j.id === id)
}

function searchJobs(query) {
  if (!query) return jobs.value
  const lowerQuery = query.toLowerCase()
  return jobs.value.filter(j => 
    j.company.toLowerCase().includes(lowerQuery) ||
    j.position.toLowerCase().includes(lowerQuery)
  )
}

function filterByStatus(status) {
  if (!status || status === 'all') return jobs.value
  return jobs.value.filter(j => j.status === status)
}

export function useJobs() {
  // Initialize on first use
  initializeJobs()
  
  return {
    jobs,
    totalJobs,
    jobsByStatus,
    stats,
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    getJob,
    searchJobs,
    filterByStatus
  }
}

