<script setup lang="ts">
// Enterprise overview page with latest assessment summary, maturity score, and quick stats.
const {
  enterpriseId,
  enterprise,
  dataSources,
  latestCompletedAssessment,
  store,
} = useEnterpriseRoute()

const capabilityAssessments = computed(() => {
  if (!latestCompletedAssessment.value)
    return []

  return store.getAllCapabilityAssessments(
    latestCompletedAssessment.value.id,
  )
})

const enabledSourcesCount = computed(() =>
  dataSources.value.filter(item => item.enabled).length,
)

function handleNewAssessment() {
  navigateTo(`/enterprise/${enterpriseId.value}/assessments`)
}
</script>

<template>
  <div
    v-if="enterprise"
    class="space-y-8"
  >
    <EnterpriseHeader
      :enterprise="enterprise"
      @new-assessment="handleNewAssessment"
    />

    <EnterpriseTabs />

    <section class="grid gap-6 xl:grid-cols-12">
      <div class="space-y-6 xl:col-span-8">
        <EnterpriseInformationCard :enterprise="enterprise" />

        <EnterpriseLatestAssessmentCard
          v-if="latestCompletedAssessment"
          :assessment="latestCompletedAssessment"
        />

        <UiEmptyState
          v-else
          title="No Assessments Yet"
          description="Run your first assessment to see results here."
          icon="lucide:clipboard-list"
        />
      </div>

      <div class="space-y-6 xl:col-span-4">
        <EnterpriseAssessmentSummaryCard
          v-if="latestCompletedAssessment"
          :assessment="latestCompletedAssessment"
          :capability-assessments="capabilityAssessments"
        />

        <EnterpriseMaturityCard
          v-if="latestCompletedAssessment?.overallScore"
          :score="latestCompletedAssessment.overallScore"
        />

        <EnterpriseDataSourcesCard :sources="dataSources" />

        <AppCard title="Quick Stats">
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl bg-slate-50 p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ enabledSourcesCount }}
              </div>
              <div class="mt-1 text-xs text-slate-500">
                Active Sources
              </div>
            </div>

            <div class="rounded-xl bg-slate-50 p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ store.getCompletedAssessmentsForEnterprise(enterpriseId).length }}
              </div>
              <div class="mt-1 text-xs text-slate-500">
                Completed
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </section>
  </div>

  <UiEmptyState
    v-else
    title="Enterprise Not Found"
    description="The requested enterprise does not exist."
    icon="lucide:building-2"
  />
</template>
