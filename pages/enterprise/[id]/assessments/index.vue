<script setup lang="ts">
// Assessment list + detail page for an enterprise, with create/select flows.
const {
  enterpriseId,
  enterprise,
  assessments,
  store,
} = useEnterpriseRoute()

const route = useRoute()
const showNewModal = ref(false)

const selectedAssessmentId = ref<number>(
  Number(route.query.id) || assessments.value[0]?.id || 0,
)

watch(assessments, (items) => {
  if (!items.find(i => i.id === selectedAssessmentId.value))
    selectedAssessmentId.value = items[0]?.id ?? 0
}, { immediate: true })

watch(selectedAssessmentId, (id) => {
  if (!id)
    return

  if (String(route.query.id) === String(id))
    return

  navigateTo({
    path: `/enterprise/${enterpriseId.value}/assessments`,
    query: { id: String(id) },
  }, { replace: true })
})

const selectedAssessment = computed(() =>
  assessments.value.find(
    item => item.id === selectedAssessmentId.value,
  ),
)

const selectedPipeline = computed(() =>
  store.getPipeline(selectedAssessmentId.value),
)

const selectedEvidence = computed(() =>
  store.getEvidence(selectedAssessmentId.value),
)

const selectedMappings = computed(() =>
  store.getMappings(selectedAssessmentId.value),
)

const isRunning = computed(() =>
  store.runningAssessmentId.value === selectedAssessmentId.value,
)

function selectAssessment(id: number) {
  selectedAssessmentId.value = id
}

function handleCreate(input: {
  name: string
  description: string
  version: string
}) {
  const assessment = store.createAssessment(
    enterpriseId.value,
    input,
  )
  selectedAssessmentId.value = assessment.id
  navigateTo(
    `/enterprise/${enterpriseId.value}/assessments/${assessment.id}/run`,
  )
}

function handleMappingApproval(
  mappingId: number,
  approved: boolean,
) {
  store.updateMappingApproval(
    mappingId,
    selectedAssessmentId.value,
    approved,
  )
}
</script>

<template>
  <div
    v-if="enterprise"
    class="space-y-6"
  >
    <EnterpriseHeader
      :enterprise="enterprise"
      @new-assessment="showNewModal = true"
    />

    <EnterpriseTabs />

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-4">
        <AssessmentList
          :items="assessments"
          :selected-id="selectedAssessmentId"
          @select="selectAssessment"
          @new="showNewModal = true"
        />
      </div>

      <div class="col-span-12 lg:col-span-8">
        <AssessmentDetail
          :assessment="selectedAssessment"
          :pipeline="selectedPipeline"
          :evidence="selectedEvidence"
          :mappings="selectedMappings"
          :enterprise-id="enterpriseId"
          :is-running="isRunning"
          @mapping-approval="handleMappingApproval"
        />
      </div>
    </div>

    <AssessmentNewModal
      v-model:open="showNewModal"
      @create="handleCreate"
    />
  </div>

  <UiEmptyState
    v-else
    title="Enterprise Not Found"
    description="The requested enterprise does not exist."
    icon="lucide:building-2"
  />
</template>
