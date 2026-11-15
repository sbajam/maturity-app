<script setup lang="ts">
import type { Enterprise } from '~/types'
import { validRouteId } from '~/services/api'

const route = useRoute()
const api = useApi()
const enterpriseId = computed(() => Number(route.params.id))
const demo = useAppMode()
const validId = computed(() => validRouteId(route.params.id))
const { data, pending, error, refresh } = await useAsyncData(
  () => `enterprise-overview-${route.params.id}`,
  async () => {
    if (!validId.value) throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
    const [enterprise, sources, assessments] = await Promise.all([
      api.getEnterprise(enterpriseId.value), api.listSources(enterpriseId.value, 1, 1), api.listAssessments(enterpriseId.value, 1, 50),
    ])
    return { enterprise: enterprise.data, sourceCount: sources.pagination.total, assessmentCount: assessments.pagination.total, latestCompleted: assessments.data.find(a => a.status === "completed") ?? null }
  },
  { watch: [enterpriseId] },
)
const enterprise = computed<Enterprise | undefined>(() => {
  if (!data.value) return undefined
  const item = data.value.enterprise
  return { ...item, description: item.description ?? undefined, country: item.country ?? undefined, businessModel: item.businessModel ?? undefined, companySize: item.companySize ?? undefined }
})
</script>

<template>
  <div v-if="pending" class="p-8 text-sm text-slate-500">Loading enterprise...</div>
  <div v-else-if="error" role="alert" class="p-8 text-sm text-red-700">{{ error.statusCode === 404 ? 'Enterprise not found.' : error.statusCode === 503 ? 'The service is temporarily unavailable.' : 'Unable to load this enterprise.' }} <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button></div>
  <div v-else-if="enterprise && data" class="space-y-8">
    <EnterpriseHeader :enterprise="enterprise" @new-assessment="navigateTo(`/enterprise/${enterpriseId}/assessments`)" />
    <EnterpriseTabs />
    <div class="grid gap-6 md:grid-cols-2">
      <EnterpriseInformationCard :enterprise="enterprise" />
      <AppCard title="Overview">
        <p>Data sources: {{ data.sourceCount }}</p>
        <p>Assessments: {{ data.assessmentCount }}</p>
      </AppCard>
    </div>
    <AppCard v-if="data.latestCompleted" title="Latest completed assessment">
      <p class="font-medium">{{ data.latestCompleted.name }}</p>
      <p v-if="demo" class="text-sm text-amber-700">نتایج نمونه و غیرواقعی — بدون اجرای LLM</p>
      <NuxtLink :to="`/enterprise/${enterpriseId}/assessments/${data.latestCompleted.id}/report`" class="text-sm text-blue-700 underline">View report</NuxtLink>
    </AppCard>
    <UiEmptyState v-else title="No assessment results" description="No completed assessment yet." icon="lucide:clipboard-list" />
  </div>
</template>
