<script setup>
import { ref, onMounted } from 'vue'
import { PhX } from '@phosphor-icons/vue'
import { useJobs } from '../composables/useJobs'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { updateJob, deleteJob } = useJobs()

const form = ref({
  company: '',
  position: '',
  status: 'applied',
  dateApplied: '',
  deadline: '',
  salary: '',
  location: '',
  notes: ''
})

const isSubmitting = ref(false)

// Initialize form with job data
onMounted(() => {
  form.value = {
    company: props.job.company,
    position: props.job.position,
    status: props.job.status,
    dateApplied: props.job.dateApplied,
    deadline: props.job.deadline || '',
    salary: props.job.salary || '',
    location: props.job.location || '',
    notes: props.job.notes || ''
  }
})

function handleSubmit() {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
try {
    updateJob(props.job.id, {
      ...form.value,
      deadline: form.value.deadline || undefined,
      salary: form.value.salary || undefined,
      location: form.value.location || undefined,
      notes: form.value.notes || undefined
    })
    emit('close')
  } finally {
    isSubmitting.value = false
  }
}

function handleDelete() {
  if (confirm('Are you sure you want to delete this job?')) {
    deleteJob(props.job.id)
    emit('close')
  }
}

function handleClose() {
  emit('close')
}

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal animate-slide-up">
      <div class="modal-header">
        <h3>Edit Job</h3>
        <button class="btn btn-ghost" @click="handleClose">
          <PhX :size="20" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="form-group">
            <label class="label" for="company">Company *</label>
            <input 
              id="company"
              v-model="form.company"
              type="text" 
              class="input" 
              placeholder="e.g., Google"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="label" for="position">Position *</label>
            <input 
              id="position"
              v-model="form.position"
              type="text" 
              class="input" 
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>
          
<div class="form-row">
            <div class="form-group">
              <label class="label" for="dateApplied">Date Applied</label>
              <input 
                id="dateApplied"
                v-model="form.dateApplied"
                type="date" 
                class="input"
              />
            </div>
            
            <div class="form-group">
              <label class="label" for="deadline">Deadline</label>
              <input 
                id="deadline"
                v-model="form.deadline"
                type="date" 
                class="input"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="label" for="salary">Salary</label>
              <input 
                id="salary"
                v-model="form.salary"
                type="text" 
                class="input" 
                placeholder="e.g., $100,000 - $150,000"
              />
            </div>
            
            <div class="form-group">
              <label class="label" for="location">Location</label>
              <input 
                id="location"
                v-model="form.location"
                type="text" 
                class="input" 
                placeholder="e.g., Remote, San Francisco, CA"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="label" for="notes">Notes</label>
            <textarea 
              id="notes"
              v-model="form.notes"
              class="textarea" 
              rows="3"
              placeholder="Any additional notes..."
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-danger"
            @click="handleDelete"
          >
            Delete
          </button>
          <div class="footer-right">
            <button type="button" class="btn btn-secondary" @click="handleClose">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: var(--space-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-right {
  display: flex;
  gap: var(--space-sm);
}
</style>

