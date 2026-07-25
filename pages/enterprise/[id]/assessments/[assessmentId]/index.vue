<script setup lang="ts">
// Redirects /assessments/:id to the run or report page depending on assessment status.
const route = useRoute()
const store = useMockStore()

const enterpriseId = route.params.id
const assessmentId = Number(route.params.assessmentId)

const assessment = store.assessments.value.find(
  item => item.id === assessmentId,
)

if (!assessment) {
  await navigateTo(
    `/enterprise/${enterpriseId}/assessments`,
    { replace: true },
  )
}
else if (assessment.status === "completed") {
  await navigateTo(
    `/enterprise/${enterpriseId}/assessments/${assessmentId}/report`,
    { replace: true },
  )
}
else {
  await navigateTo(
    `/enterprise/${enterpriseId}/assessments/${assessmentId}/run`,
    { replace: true },
  )
}
</script>

<template>
  <div />
</template>
