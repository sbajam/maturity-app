<script setup lang="ts">
// Full assessment report page: overview, pipeline, timeline, and capability results.
const {
  enterpriseId,
  enterprise,
  assessments,
  store,
} = useEnterpriseRoute()

const route = useRoute()

const assessmentId = computed(() =>
  Number(route.params.assessmentId),
)

const assessment = computed(() =>
  assessments.value.find(
    item => item.id === assessmentId.value,
  ),
)

const pipeline = computed(() =>
  store.getPipeline(assessmentId.value),
)

const evidence = computed(() =>
  store.getEvidence(assessmentId.value),
)

const mappings = computed(() =>
  store.getMappings(assessmentId.value),
)

const capabilityAssessments = computed(() =>
  store.getAllCapabilityAssessments(assessmentId.value),
)

const recommendations = computed(() =>
  store.getRecommendations(assessmentId.value),
)

function printPage() {
  window.print()
}
</script>

<template>
  <div
    v-if="enterprise && assessment"
    class="space-y-6"
  >
    <EnterpriseHeader :enterprise="enterprise" />

    <EnterpriseTabs />

    <div class="flex items-center justify-between">
      <div>
        <NuxtLink
          :to="`/enterprise/${enterpriseId}/assessments?id=${assessment.id}`"
          class="mb-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <Icon name="lucide:arrow-left" class="h-4 w-4" />
          Back to Assessment
        </NuxtLink>

        <h1 class="text-2xl font-bold text-slate-900">
          Assessment Report
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          {{ assessment.name }} · v{{ assessment.version }}
        </p>
      </div>

      <UiButton
        variant="outline"
        @click="printPage"
      >
        <Icon name="lucide:printer" class="h-4 w-4" />
        Print
      </UiButton>
    </div>

    <AssessmentCard :assessment="assessment" />

    <AssessmentPipelineCard
      :pipeline="pipeline"
      :evidence="evidence"
      :mappings="mappings"
    />

    <AssessmentTimeline :assessments="assessments" />

    <AssessmentResults
      :capabilities="store.capabilities"
      :assessments="capabilityAssessments"
      :mappings="mappings"
      :evidence="evidence"
      :recommendations="recommendations"
    />
  </div>

  <UiEmptyState
    v-else
    title="Report Not Found"
    description="This assessment report is not available."
    icon="lucide:file-x"
  />
</template>
