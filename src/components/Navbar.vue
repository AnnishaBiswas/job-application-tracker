<script setup>
import { RouterLink, useRoute } from 'vue-router'
import {
  PhBriefcase,
  PhSquaresFour,
  PhChartLine,
  PhMoon,
  PhSun,
  PhPlus
} from '@phosphor-icons/vue'

defineProps({
  isDark: Boolean
})

const emit = defineEmits(['toggle-theme', 'add-job'])

const route = useRoute()
</script>

<template>
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
      <button class="btn btn-primary" @click="$emit('add-job')">
        <PhPlus :size="18" />
        Add Job
      </button>
      <button 
        class="theme-toggle" 
        @click="$emit('toggle-theme')"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <PhMoon v-if="!isDark" :size="20" />
        <PhSun v-else :size="20" />
      </button>
    </div>
  </nav>
</template>

