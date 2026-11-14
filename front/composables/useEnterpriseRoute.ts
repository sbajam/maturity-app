// Resolves the current enterprise ID from the route and exposes related store data/helpers.
export function useEnterpriseRoute() {
  const route = useRoute()
  const store = useMockStore()

  const enterpriseId = computed(() =>
    Number(route.params.id),
  )

  const enterprise = computed(() =>
    store.getEnterprise(enterpriseId.value),
  )

  const dataSources = computed(() =>
    store.getDataSourcesForEnterprise(enterpriseId.value),
  )

  const assessments = computed(() =>
    store.getAssessmentsForEnterprise(enterpriseId.value),
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
    dataSources,
    assessments,
    completedAssessments,
    latestCompletedAssessment,
  }
}
