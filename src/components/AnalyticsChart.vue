<script setup>
import { computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

const props = defineProps({
  type: {
    type: String,
    default: 'bar',
    validator: (v) => ['bar', 'doughnut'].includes(v)
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  }
})

const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    }
  },
  ...props.options
}))
</script>

<template>
  <div class="chart-container">
    <div v-if="title" class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div class="chart-wrapper">
      <Bar v-if="type === 'bar'" :data="data" :options="defaultOptions" />
      <Doughnut v-else-if="type === 'doughnut'" :data="data" :options="defaultOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  height: 300px;
  position: relative;
}
</style>

