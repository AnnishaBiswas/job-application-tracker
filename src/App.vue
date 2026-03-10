<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import {
  PhBriefcase,
  PhSquaresFour,
  PhChartLine,
  PhMoon,
  PhSun,
  PhPlus
} from '@phosphor-icons/vue'
import AddJobModal from './components/AddJobModal.vue'

const route = useRoute()
const isDark = ref(false)
const showAddModal = ref(false)

// Initialize theme
onMounted(() => {
  const savedTheme = localStorage.getItem('job-tracker-theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

// Toggle dark mode
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('job-tracker-theme', isDark.value ? 'dark' : 'light')
}

function openAddModal() {
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}
</script>

<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="navbar-brand-icon">
          <PhBriefcase :size="20" weight="bold" />
        </div>
        <span>JobTrack</span>
      </div>

      <div class="navbar-nav">
        <RouterLink 
          to="/" 
          class="navbar-link"
          :class="{ active: route.path === '/' }"
        >
          <PhSquaresFour :size="18" />
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/jobs" 
          class="navbar-link"
          :class="{ active: route.path === '/jobs' }"
        >
          <PhBriefcase :size="18" />
          Jobs
        </RouterLink>
        <RouterLink 
          to="/analytics" 
          class="navbar-link"
          :class="{ active: route.path === '/analytics' }"
        >
          <PhChartLine :size="18" />
          Analytics
        </RouterLink>
      </div>

      <div class="navbar-actions">
        <button class="btn btn-primary" @click="openAddModal">
          <PhPlus :size="18" />
          Add Job
        </button>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <PhMoon v-if="!isDark" :size="20" />
          <PhSun v-else :size="20" />
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Add Job Modal -->
    <AddJobModal 
      v-if="showAddModal" 
      @close="closeAddModal" 
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>

