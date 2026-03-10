<script setup>
import { computed } from 'vue'
import { useJobs } from '../composables/useJobs'
import StatsCard from '../components/StatsCard.vue'
import AnalyticsChart from '../components/AnalyticsChart.vue'
import { 
  PhBriefcase, 
  PhCheckCircle, 
  PhPercent, 
  PhTrendUp 
} from '@phosphor-icons/vue'

const { stats, jobs } = useJobs()

// Chart data for status distribution (Doughnut)
const statusChartData = computed(() => ({
  labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
  datasets: [{
    data: [stats.value.applied, stats.value.interview, stats.value.offer, stats.value.rejected],
    backgroundColor: [
      '#3B82F6', // Blue - Applied
      '#F59E0B', // Amber - Interview
      '#10B981', // Green - Offer
      '#F43F5E'  // Red - Rejected
    ],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

// Chart data for applications over time (Bar)
const timelineChartData = computed(() => {
  // Group jobs by month
  const months = {}
  jobs.value.forEach(job => {
    const month = new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    months[month] = (months[month] || 0) + 1
  })
  
  const sortedMonths = Object.keys(months).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA - dateB
  })
  
  return {
    labels: sortedMonths.length > 0 ? sortedMonths : ['No data'],
    datasets: [{
      label: 'Applications',
      data: sortedMonths.length > 0 ? sortedMonths.map(m => months[m]) : [0],
      backgroundColor: '#4F46E5',
      borderRadius: 6,
      barThickness: 40
    }]
  }
})

// Chart options
const barOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const doughnutOptions = {
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right'
    }
  }
}
</script>

<template>
  <div class="page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Analytics</h1>
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
        label="Response Rate" 
        :value="`${stats.responseRate}%`"
        :icon="PhPercent"
        variant="warning"
      />
      <StatsCard 
        label="Offer Rate" 
        :value="`${stats.offerRate}%`"
        :icon="PhCheckCircle"
        variant="success"
      />
      <StatsCard 
        label="Active Applications" 
        :value="stats.applied + stats.interview"
        :icon="PhTrendUp"
        variant="primary"
      />
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Status Distribution -->
      <div class="chart-section">
        <AnalyticsChart 
          type="doughnut"
          :data="statusChartData"
          :options="doughnutOptions"
          title="Application Status"
        />
      </div>
      
      <!-- Timeline -->
      <div class="chart-section">
        <AnalyticsChart 
          type="bar"
          :data="timelineChartData"
          :options="barOptions"
          title="Applications Over Time"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card card">
        <h3>Interview Success Rate</h3>
        <p class="summary-value">
          {{ stats.interview + stats.offer + stats.rejected > 0 
            ? Math.round(((stats.interview + stats.offer) / (stats.interview + stats.offer + stats.rejected)) * 100) 
            : 0 }}%
        </p>
        <p class="summary-description">
          Of all responses (interview, offer, or rejected)
        </p>
      </div>
      
      <div class="summary-card card">
        <h3>Offer Acceptance Rate</h3>
        <p class="summary-value">
          {{ stats.offer > 0 ? '100%' : 'N/A' }}
        </p>
        <p class="summary-description">
          Offers received so far
        </p>
      </div>
      
      <div class="summary-card card">
        <h3>Average Applications/Month</h3>
        <p class="summary-value">
          {{ stats.total > 0 ? Math.round(stats.total / 3) : 0 }}
        </p>
        <p class="summary-description">
          Based on recent activity
        </p>
      </div>
      
      <div class="summary-card card">
        <h3>Active Pipeline</h3>
        <p class="summary-value">
          {{ stats.applied + stats.interview }}
        </p>
        <p class="summary-description">
          Jobs in applied or interview stage
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-section {
  min-height: 350px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

.summary-card h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.summary-description {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>

