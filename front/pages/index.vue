<script setup lang="ts">
const api = useApi()
const demoMode = useAppMode()
const { data, pending, error, refresh } = await useAsyncData('dashboard', async () => (await api.dashboard()).data)
</script>

<template>
  <div class="space-y-8">
    <div><h1 class="text-2xl font-bold text-slate-900">Dashboard</h1><p class="mt-1 text-sm text-slate-500">Overview of your enterprise maturity assessment platform.</p></div>
    <NuxtLink v-if="demoMode" to="/enterprise/900001" class="inline-block rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">Vendow Demo — simulated evidence and scores</NuxtLink>
    <div v-if="pending" class="text-sm text-slate-500">Loading dashboard...</div>
    <div v-else-if="error" role="alert" class="text-sm text-red-700">Unable to load the dashboard. <button class="underline" @click="refresh()">Retry</button></div>
    <template v-else-if="data">
      <div class="grid gap-6 md:grid-cols-3">
        <AppCard><div class="text-sm text-slate-500">Enterprises</div><div class="mt-2 text-xl font-bold">{{ data.enterpriseCount }}</div></AppCard>
        <AppCard><div class="text-sm text-slate-500">Active Sources</div><div class="mt-2 text-xl font-bold">{{ data.enabledSourceCount }}</div></AppCard>
        <AppCard><div class="text-sm text-slate-500">Draft Assessments</div><div class="mt-2 text-xl font-bold">{{ data.draftAssessmentCount }}</div></AppCard>
      </div>
      <AppCard v-if="data.latestResult" title="Latest assessment result">
        <p class="font-semibold">{{ data.latestResult.name }}</p>
        <p class="mt-2">{{ data.latestResult.overallScore ?? 'ارزیابی ناقص' }}</p>
        <p v-if="demoMode" class="mt-1 text-sm text-amber-700">Simulated / Demo — not an LLM result</p>
        <NuxtLink :to="`/enterprise/${data.latestResult.enterpriseId}/assessments/${data.latestResult.assessmentId}/report`" class="text-blue-700 underline">View full report</NuxtLink>
      </AppCard>
      <UiEmptyState v-else title="No assessment results" description="No completed assessment yet." icon="lucide:clipboard-list" />
      <NuxtLink to="/enterprise" class="inline-block text-blue-700 underline">Manage Enterprises</NuxtLink>
    </template>
  </div>
</template>
