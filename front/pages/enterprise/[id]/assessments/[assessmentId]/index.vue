<script setup lang="ts">
import { validRouteId } from '~/services/api'
const route = useRoute(); const api = useApi()
const enterpriseId = computed(() => Number(route.params.id))
const assessmentId = computed(() => Number(route.params.assessmentId))
const { data, pending, error, refresh } = await useAsyncData(() => `assessment-${route.params.id}-${route.params.assessmentId}`, async () => {
  if (!validRouteId(route.params.id) || !validRouteId(route.params.assessmentId)) throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  return (await api.getAssessment(enterpriseId.value, assessmentId.value)).data
}, { watch: [enterpriseId, assessmentId] })
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading assessment...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">{{ error.statusCode === 404 ? 'Assessment not found.' : error.statusCode === 503 ? 'The service is temporarily unavailable.' : 'Unable to load this assessment.' }} <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button></div>
  <div v-else-if="data" class="space-y-4">
    <NuxtLink :to="`/enterprise/${enterpriseId}/assessments`" class="text-blue-700 underline">Back to assessments</NuxtLink>
    <AppCard :title="data.name"><p>Draft · v{{ data.version }}</p><p v-if="data.description" class="mt-2 whitespace-pre-wrap">{{ data.description }}</p></AppCard>
    <UiEmptyState title="Analysis is not available" description="This assessment is a draft. Scientific analysis and results are not available yet." />
  </div>
</template>
