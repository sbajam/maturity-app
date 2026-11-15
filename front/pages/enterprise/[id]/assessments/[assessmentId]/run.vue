<script setup lang="ts">
// Preserve the original four-step Wizard, reading persisted Demo data from PostgreSQL.
import type { MappingReviewStatus, WizardStep } from '~/types'
import { ApiError, validRouteId } from '~/services/api'
import { presentDossier } from '~/utils/dossier-view'

const route = useRoute()
const api = useApi()
const demo = useAppMode()
const enterpriseId = computed(() => Number(route.params.id))
const assessmentId = computed(() => Number(route.params.assessmentId))
const currentStep = ref<WizardStep>('review')
const steps: Array<{ id: WizardStep; label: string }> = [
  { id: 'review', label: 'Review Setup' },
  { id: 'evidence', label: 'Evidence & Mapping' },
  { id: 'ai_analysis', label: 'AI Analysis' },
  { id: 'results', label: 'Results' },
]
const evidenceLoading = ref(false)
const aiRunning = ref(false)
const message = ref('')

const { data, pending, error, refresh } = await useAsyncData(
  () => `run-v2-${route.params.id}-${route.params.assessmentId}`,
  async () => {
    if (!validRouteId(route.params.id) || !validRouteId(route.params.assessmentId))
      throw createError({ statusCode: 404, statusMessage: 'Invalid assessment ID' })
    return (await api.getDossier(enterpriseId.value, assessmentId.value)).data
  },
  { watch: [enterpriseId, assessmentId] },
)
const view = computed(() => data.value ? presentDossier(data.value) : null)
const enabledSources = computed(() => view.value?.sources.filter(source => source.enabled) ?? [])
const readOnly = computed(() => view.value?.assessment.status === 'completed')

// A completed assessment opens at the first step for historical review instead of skipping to Report.
// Historical browsing does not call prepare/finalize or mutate an approved mapping.
watch(() => view.value?.assessment.status, (status, previous) => {
  if (!status) return
  if (status === 'completed' && previous !== 'running' && !aiRunning.value)
    currentStep.value = 'review'
  else if (status === 'running' && !aiRunning.value && !evidenceLoading.value && currentStep.value === 'review')
    currentStep.value = 'evidence'
}, { immediate: true })
watch(assessmentId, () => {
  currentStep.value = 'review'
  evidenceLoading.value = false
  aiRunning.value = false
  message.value = ''
})

async function confirmReview() {
  if (readOnly.value) { currentStep.value = 'evidence'; return }
  message.value = ''
  evidenceLoading.value = true
  currentStep.value = 'evidence'
  try {
    await api.prepareDemo(enterpriseId.value, assessmentId.value)
    await refresh()
  } catch (cause) {
    currentStep.value = 'review'
    message.value = cause instanceof ApiError ? cause.message : 'Failed to prepare demonstration evidence.'
  } finally {
    evidenceLoading.value = false
  }
}
async function reviewMapping(mappingId: number, status: MappingReviewStatus) {
  if (readOnly.value || status === 'pending') return
  try {
    await api.reviewDemoMapping(enterpriseId.value, assessmentId.value, mappingId, status)
    await refresh()
  } catch (cause) {
    message.value = cause instanceof ApiError ? cause.message : 'Unable to save mapping review.'
  }
}
function confirmEvidence() {
  if (readOnly.value) { currentStep.value = 'ai_analysis'; return }
  message.value = ''
  currentStep.value = 'ai_analysis'
  aiRunning.value = true
}
async function completeAiAnalysis() {
  if (readOnly.value) { currentStep.value = 'results'; return }
  try {
    await api.finalizeDemo(enterpriseId.value, assessmentId.value)
    await refresh()
    aiRunning.value = false
    currentStep.value = 'results'
  } catch (cause) {
    aiRunning.value = false
    currentStep.value = 'evidence'
    message.value = cause instanceof ApiError ? cause.message : 'Unable to save simulated evaluation.'
  }
}
function goBack() {
  if (currentStep.value === 'evidence') currentStep.value = 'review'
}
</script>

<template>
  <div v-if="!demo" class="space-y-4">
    <UiEmptyState title="AI analysis is not available" description="Real mode does not run simulated analysis." />
    <NuxtLink :to="`/enterprise/${enterpriseId}/assessments?id=${assessmentId}`" class="text-blue-700 underline">Back to assessment</NuxtLink>
  </div>
  <div v-else-if="pending" class="p-8 text-slate-500">Loading assessment...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">
    Failed to load assessment. <button class="underline" @click="refresh()">Retry</button>
  </div>
  <div v-else-if="view" class="space-y-6">
    <p role="status" class="rounded-lg bg-amber-100 p-3 text-sm font-semibold text-amber-900">
      Demo / Simulated — Vendow documents are genuine; Evidence, Mapping and Scores are illustrative. No LLM was called.
    </p>
    <NuxtLink :to="`/enterprise/${enterpriseId}/assessments?id=${assessmentId}`" class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
      <Icon name="lucide:arrow-left" class="h-4 w-4" />Back to Assessments & Pipeline
    </NuxtLink>
    <p v-if="message" role="alert" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ message }}</p>

    <AssessmentWizardShell :current-step="currentStep" :assessment-name="view.assessment.name" />

    <div v-if="readOnly" class="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
      <p class="text-sm font-medium text-blue-900">
        Completed assessment — read-only history. Browse every Wizard stage without restarting AI or changing stored results.
      </p>
      <nav aria-label="Historical wizard steps" class="flex flex-wrap gap-2">
        <button
          v-for="step in steps"
          :key="step.id"
          type="button"
          :aria-current="currentStep === step.id ? 'step' : undefined"
          class="rounded-lg border px-3 py-2 text-sm font-medium transition"
          :class="currentStep === step.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'"
          @click="currentStep = step.id"
        >{{ step.label }}</button>
      </nav>
    </div>

    <AssessmentWizardStepReview
      v-if="currentStep === 'review'"
      :capabilities="view.capabilities"
      :data-sources="enabledSources"
      :read-only="readOnly"
      @continue="confirmReview"
    />
    <AssessmentWizardStepEvidence
      v-else-if="currentStep === 'evidence'"
      :capabilities="view.capabilities"
      :evidence="view.evidence"
      :mappings="view.mappings"
      :loading="evidenceLoading"
      :read-only="readOnly"
      @review="reviewMapping"
      @continue="confirmEvidence"
      @back="goBack"
    />
    <AssessmentWizardStepAiLoading
      v-else-if="currentStep === 'ai_analysis'"
      :running="aiRunning"
      :read-only="readOnly"
      @complete="completeAiAnalysis"
    />
    <AssessmentWizardStepResults
      v-else-if="currentStep === 'results'"
      :assessment="view.assessment"
      :capabilities="view.capabilities"
      :capability-assessments="view.capabilityAssessments"
      :mappings="view.mappings"
      :evidence="view.evidence"
      :recommendations="view.recommendations"
      :enterprise-id="enterpriseId"
    />
  </div>
</template>
