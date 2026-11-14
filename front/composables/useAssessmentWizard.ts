// Drives the 4-step assessment wizard state machine (review, evidence, AI analysis, results).
import type { MappingReviewStatus, WizardStep } from "~/types"

export function useAssessmentWizard(assessmentId: number) {
  const store = useMockStore()

  const currentStep = ref<WizardStep>("review")
  const evidenceLoading = ref(false)
  const aiRunning = ref(false)

  const assessment = computed(() =>
    store.assessments.value.find(
      item => item.id === assessmentId,
    ),
  )

  const evidence = computed(() =>
    store.getEvidence(assessmentId),
  )

  const mappings = computed(() =>
    store.getMappings(assessmentId),
  )

  const capabilityAssessments = computed(() =>
    store.getAllCapabilityAssessments(assessmentId),
  )

  const recommendations = computed(() =>
    store.getRecommendations(assessmentId),
  )

  async function confirmReview() {
    store.startWizardAssessment(assessmentId)
    currentStep.value = "evidence"
    evidenceLoading.value = true

    await new Promise(resolve => setTimeout(resolve, 2500))

    store.prepareWizardEvidence(assessmentId)
    evidenceLoading.value = false
  }

  function reviewMapping(
    mappingId: number,
    status: MappingReviewStatus,
  ) {
    store.updateMappingReview(
      assessmentId,
      mappingId,
      status,
    )
  }

  function confirmEvidence() {
    currentStep.value = "ai_analysis"
    aiRunning.value = true
  }

  function completeAiAnalysis() {
    store.finalizeWizardAssessment(assessmentId)
    aiRunning.value = false
    currentStep.value = "results"
  }

  function goBack() {
    if (currentStep.value === "evidence")
      currentStep.value = "review"
  }

  onMounted(() => {
    if (assessment.value?.status === "completed") {
      if (evidence.value.length === 0)
        store.prepareWizardEvidence(assessmentId)

      if (capabilityAssessments.value.length === 0)
        store.finalizeWizardAssessment(assessmentId)

      currentStep.value = "results"
    }
  })

  return {
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
  }
}
