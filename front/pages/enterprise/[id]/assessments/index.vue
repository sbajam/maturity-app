<script setup lang="ts">
import type { Enterprise } from '~/types'
import { ApiError, validRouteId } from '~/services/api'

const route = useRoute(); const api = useApi()
const enterpriseId = computed(() => Number(route.params.id)); const page = ref(1)
const showNewModal = ref(false); const saving = ref(false); const message = ref('')
const success = ref('')
const { data, pending, error, refresh } = await useAsyncData(() => `assessments-${route.params.id}-${page.value}`, async () => {
  const id = enterpriseId.value
  if (!validRouteId(route.params.id)) throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
  const [enterprise, assessments] = await Promise.all([api.getEnterprise(id), api.listAssessments(id, page.value)])
  return { enterprise: enterprise.data, assessments }
}, { watch: [enterpriseId, page] })
const enterprise = computed<Enterprise | undefined>(() => {
  if (!data.value) return undefined
  const item = data.value.enterprise
  return { ...item, description: item.description ?? undefined, country: item.country ?? undefined, businessModel: item.businessModel ?? undefined, companySize: item.companySize ?? undefined }
})
async function create(input: { name: string; description: string; version: string }) {
  saving.value = true; message.value = ''
  try { const result = await api.createAssessment(enterpriseId.value, input); showNewModal.value = false; await refresh(); await navigateTo(`/enterprise/${enterpriseId.value}/assessments/${result.data.id}`) }
  catch (cause) { message.value = cause instanceof ApiError ? cause.message : 'Unable to create assessment.' } finally { saving.value = false }
}
async function remove(id: number) {
  if (!confirm('Delete this draft assessment?')) return
  message.value = ''; success.value = ''
  try { await api.deleteAssessment(enterpriseId.value, id); await refresh(); success.value = 'Draft assessment deleted.' }
  catch (cause) { message.value = cause instanceof ApiError ? cause.message : 'Unable to delete assessment.' }
}
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading assessments...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">{{ error.statusCode === 404 ? 'Enterprise not found.' : error.statusCode === 503 ? 'The service is temporarily unavailable.' : 'Unable to load assessments.' }} <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button></div>
  <div v-else-if="enterprise && data" class="space-y-6">
    <EnterpriseHeader :enterprise="enterprise" @new-assessment="message = ''; showNewModal = true" />
    <EnterpriseTabs />
    <div class="flex items-center justify-between"><h2 class="text-xl font-semibold">Draft assessments</h2><UiButton @click="message = ''; showNewModal = true">New Assessment</UiButton></div>
    <p v-if="message && !showNewModal" role="alert" class="text-sm text-red-700">{{ message }}</p>
    <p v-if="success" role="status" class="text-sm text-green-700">{{ success }}</p>
    <UiEmptyState v-if="!data.assessments.data.length" title="No assessments" description="Create a draft assessment to get started." />
    <div v-for="item in data.assessments.data" :key="item.id" class="flex items-center justify-between rounded-xl border bg-white p-5">
      <div><NuxtLink :to="`/enterprise/${enterpriseId}/assessments/${item.id}`" class="font-semibold text-blue-700 hover:underline">{{ item.name }}</NuxtLink><p class="text-sm text-slate-500">Draft · v{{ item.version }}</p></div>
      <UiButton variant="ghost" @click="remove(item.id)">Delete</UiButton>
    </div>
    <div class="flex gap-3 text-sm"><button :disabled="page <= 1" @click="page--">Previous</button><span>Page {{ page }} · {{ data.assessments.pagination.total }} assessments</span><button :disabled="page * 20 >= data.assessments.pagination.total" @click="page++">Next</button></div>
    <AssessmentNewModal v-model:open="showNewModal" :error="message" :loading="saving" @create="create" />
  </div>
</template>
