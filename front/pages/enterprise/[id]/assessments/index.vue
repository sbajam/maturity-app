<script setup lang="ts">
// Original assessment list/detail/pipeline layout, backed by the existing PostgreSQL APIs.
import type { Assessment, Enterprise } from '~/types'
import { ApiError, validRouteId } from '~/services/api'
import { presentDossier, presentEnterprise } from '~/utils/dossier-view'

const route = useRoute()
const api = useApi()
const demo = useAppMode()
const enterpriseId = computed(() => Number(route.params.id))
const page = ref(1)
const showNewModal = ref(false)
const saving = ref(false)
const message = ref('')
const success = ref('')

const { data, pending, error, refresh } = await useAsyncData(
  () => `assessment-list-${route.params.id}-${page.value}`,
  async () => {
    if (!validRouteId(route.params.id))
      throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
    const [enterprise, assessments] = await Promise.all([
      api.getEnterprise(enterpriseId.value),
      api.listAssessments(enterpriseId.value, page.value),
    ])
    return { enterprise: enterprise.data, assessments }
  },
  { watch: [enterpriseId, page] },
)

const enterprise = computed<Enterprise | undefined>(() =>
  data.value ? presentEnterprise(data.value.enterprise) : undefined,
)
const assessments = computed<Assessment[]>(() =>
  (data.value?.assessments.data ?? []).map(item => ({
    ...item,
    description: item.description ?? undefined,
    overallScore: item.overallScore ?? undefined,
    completedAt: item.completedAt ?? undefined,
  })),
)
const selectedAssessmentId = computed<number | null>(() => {
  const queryId = route.query.id
  const preferred = validRouteId(queryId) ? Number(queryId) : null
  return assessments.value.find(item => item.id === preferred)?.id
    ?? assessments.value[0]?.id
    ?? null
})
const selectedAssessment = computed(() =>
  assessments.value.find(item => item.id === selectedAssessmentId.value),
)

const { data: dossierData, pending: dossierPending, error: dossierError, refresh: refreshDossier } = await useAsyncData(
  () => `assessment-detail-${route.params.id}-${selectedAssessmentId.value ?? 'none'}`,
  async () => {
    if (!selectedAssessmentId.value) return null
    return (await api.getDossier(enterpriseId.value, selectedAssessmentId.value)).data
  },
  { watch: [enterpriseId, selectedAssessmentId], default: () => null },
)
const selectedDossier = computed(() =>
  dossierData.value && dossierData.value.assessment.id === selectedAssessmentId.value
    ? presentDossier(dossierData.value)
    : null,
)

function selectAssessment(id: number) {
  message.value = ''
  void navigateTo({
    path: `/enterprise/${enterpriseId.value}/assessments`,
    query: { id: String(id) },
  })
}
async function create(input: { name: string; description: string; version: string }) {
  saving.value = true
  message.value = ''
  try {
    const result = await api.createAssessment(enterpriseId.value, input)
    showNewModal.value = false
    await refresh()
    // Retain the original behavior: a newly created assessment starts in the Wizard.
    await navigateTo(`/enterprise/${enterpriseId.value}/assessments/${result.data.id}/run`)
  } catch (cause) {
    message.value = cause instanceof ApiError ? cause.message : 'Unable to create assessment.'
  } finally {
    saving.value = false
  }
}
async function removeDraft() {
  const item = selectedAssessment.value
  if (!item || item.status !== 'draft' || !confirm(`Delete draft "${item.name}"?`)) return
  message.value = ''
  success.value = ''
  try {
    await api.deleteAssessment(enterpriseId.value, item.id)
    await navigateTo({ path: `/enterprise/${enterpriseId.value}/assessments`, query: {} }, { replace: true })
    await refresh()
    await refreshDossier()
    success.value = 'Draft assessment deleted.'
  } catch (cause) {
    message.value = cause instanceof ApiError ? cause.message : 'Unable to delete assessment.'
  }
}
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading assessments...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">
    {{ error.statusCode === 404 ? 'Enterprise not found.' : 'Unable to load assessments.' }}
    <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button>
  </div>
  <div v-else-if="enterprise && data" class="space-y-6">
    <EnterpriseHeader :enterprise="enterprise" @new-assessment="message = ''; showNewModal = true" />
    <EnterpriseTabs />

    <p v-if="demo" role="status" class="rounded-lg bg-amber-100 p-3 text-sm font-medium text-amber-900">
      Demo — Evidence, mappings and scores are simulated. Assessment history and pipeline are loaded from the Demo database.
    </p>
    <p v-if="message && !showNewModal" role="alert" class="text-sm text-red-700">{{ message }}</p>
    <p v-if="success" role="status" class="text-sm text-green-700">{{ success }}</p>

    <!-- Restore the original two-column assessment list and detail/pipeline experience. -->
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-4">
        <AssessmentList
          :items="assessments"
          :selected-id="selectedAssessmentId ?? undefined"
          @select="selectAssessment"
          @new="showNewModal = true"
        />
        <div v-if="data.assessments.pagination.total > 20" class="mt-3 flex items-center justify-between gap-2 text-sm text-slate-600">
          <UiButton variant="ghost" :disabled="page <= 1" @click="page--">Previous</UiButton>
          <span>Page {{ page }} · {{ data.assessments.pagination.total }} assessments</span>
          <UiButton variant="ghost" :disabled="page * 20 >= data.assessments.pagination.total" @click="page++">Next</UiButton>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8">
        <p v-if="dossierPending && selectedAssessment" class="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading assessment pipeline...</p>
        <div v-else-if="dossierError && selectedAssessment" role="alert" class="rounded-xl border border-red-100 bg-white p-6 text-sm text-red-700">
          Unable to load the assessment pipeline.
          <button class="underline" @click="refreshDossier()">Retry</button>
        </div>
        <template v-else>
          <AssessmentDetail
            :assessment="selectedAssessment"
            :pipeline="selectedDossier?.pipeline ?? []"
            :evidence="selectedDossier?.evidence ?? []"
            :mappings="selectedDossier?.mappings ?? []"
            :enterprise-id="enterpriseId"
            :demo="demo"
          />
          <div v-if="selectedAssessment?.status === 'draft'" class="mt-3 flex justify-end">
            <UiButton variant="ghost" @click="removeDraft">Delete Draft</UiButton>
          </div>
        </template>
      </div>
    </div>

    <AssessmentNewModal v-model:open="showNewModal" :error="message" :loading="saving" @create="create" />
  </div>
</template>
