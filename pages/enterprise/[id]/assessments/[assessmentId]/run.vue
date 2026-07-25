<script setup lang="ts">
// Assessment run page hosting the 4-step wizard pipeline.
const {
  enterpriseId,
  enterprise,
  dataSources,
  store,
} = useEnterpriseRoute()

const route = useRoute()

const assessmentId = Number(route.params.assessmentId)

const {
  currentStep,
  evidenceLoading,
  aiRunning,
  assessment,
  evidence,
  mappings,
  capabilityAssessments,
  recommendations,
  confirmReview,
  reviewMapping,
  confirmEvidence,
  completeAiAnalysis,
  goBack,
} = useAssessmentWizard(assessmentId)

const enabledSources = computed(() =>
  dataSources.value.filter(item => item.enabled),
)

const view = computed(() => ({
  currentStep: currentStep.value,
  evidenceLoading: evidenceLoading.value,
  aiRunning: aiRunning.value,
  assessment: assessment.value,
  evidence: evidence.value,
  mappings: mappings.value,
  capabilityAssessments: capabilityAssessments.value,
  recommendations: recommendations.value,
}))
</script>

<template>
  <div
    v-if="enterprise && view.assessment"
    class="space-y-6"
  >
    <NuxtLink
      :to="`/enterprise/${enterpriseId}/assessments?id=${assessmentId}`"
      class="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600"
    >
      <Icon name="lucide:arrow-left" class="h-4 w-4" />
      Back to Assessments
    </NuxtLink>

    <AssessmentWizardShell
      :current-step="view.currentStep"
      :assessment-name="view.assessment.name"
    />

    <AssessmentWizardStepReview
      v-if="view.currentStep === 'review'"
      :capabilities="store.capabilities"
      :data-sources="enabledSources"
      @continue="confirmReview"
    />

    <AssessmentWizardStepEvidence
      v-else-if="view.currentStep === 'evidence'"
      :capabilities="store.capabilities"
      :evidence="view.evidence"
      :mappings="view.mappings"
      :loading="view.evidenceLoading"
      @review="reviewMapping"
      @continue="confirmEvidence"
      @back="goBack"
    />

    <AssessmentWizardStepAiLoading
      v-else-if="view.currentStep === 'ai_analysis'"
      :running="view.aiRunning"
      @complete="completeAiAnalysis"
    />

    <AssessmentWizardStepResults
      v-else-if="view.currentStep === 'results'"
      :assessment="view.assessment"
      :capabilities="store.capabilities"
      :capability-assessments="view.capabilityAssessments"
      :mappings="view.mappings"
      :evidence="view.evidence"
      :recommendations="view.recommendations"
      :enterprise-id="enterpriseId"
    />
  </div>

  <UiEmptyState
    v-else
    title="Assessment Not Found"
    description="The requested assessment does not exist."
    icon="lucide:clipboard-x"
  />
</template>
