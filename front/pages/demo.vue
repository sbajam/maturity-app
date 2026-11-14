<script setup lang="ts">
import { mockAssessments } from '~/mock/assessments'
import { mockEnterprise } from '~/mock/enterprise'

const enabled = useRuntimeConfig().public.demoMode
const completed = mockAssessments.filter(item => item.status === 'completed')
</script>

<template>
  <UiEmptyState v-if="!enabled" title="Demo unavailable" description="Demo mode is not enabled." />
  <div v-else class="space-y-6">
    <div class="rounded-lg bg-amber-100 p-4 font-semibold text-amber-900">Demo — sample data and results, not scientific analysis</div>
    <h1 class="text-2xl font-bold">{{ mockEnterprise.name }} · Demo</h1>
    <p class="text-sm text-slate-600">This view uses fixed demonstration fixtures.</p>
    <AppCard v-for="item in completed" :key="item.id" :title="`${item.name} · Demo`">
      <p>Sample score: {{ item.overallScore ?? '—' }}</p>
      <p class="text-sm text-slate-500">Demonstration result</p>
    </AppCard>
  </div>
</template>
