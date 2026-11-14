<script setup lang="ts">
import { validRouteId } from '~/services/api'
const route = useRoute(); const api = useApi()
const enterpriseId = computed(() => Number(route.params.id))
const { pending, error, refresh } = await useAsyncData(() => `reports-enterprise-${route.params.id}`, async () => {
  const id = enterpriseId.value
  if (!validRouteId(route.params.id)) throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
  return (await api.getEnterprise(id)).data
}, { watch: [enterpriseId] })
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading reports...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">{{ error.statusCode === 404 ? 'Enterprise not found.' : error.statusCode === 503 ? 'The service is temporarily unavailable.' : 'Unable to load this enterprise.' }} <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button></div>
  <div v-else class="space-y-6"><EnterpriseTabs /><UiEmptyState title="No reports available" description="Scientific assessment reports are not available yet." icon="lucide:file-x" /></div>
</template>
