// Resolves the current enterprise and its related assessments/data sources from the route.
export function useEnterpriseContext() {
  const route = useRoute()
  const store = useMockStore()

  const enterpriseId = computed(() =>
    Number(route.params.id),
  )

  const enterprise = computed(() =>
    store.getEnterprise(enterpriseId.value),
  )

  const assessments = computed(() =>
    store.getAssessmentsForEnterprise(enterpriseId.value),
  )

  const dataSources = computed(() =>
    store.getDataSourcesForEnterprise(enterpriseId.value),
  )

  const completedAssessments = computed(() =>
    store.getCompletedAssessmentsForEnterprise(
      enterpriseId.value,
    ),
  )

  const latestCompletedAssessment = computed(() =>
    store.getLatestCompletedAssessment(enterpriseId.value),
  )

  return {
    route,
    store,
    enterpriseId,
    enterprise,
    assessments,
    dataSources,
    completedAssessments,
    latestCompletedAssessment,
  }
}
