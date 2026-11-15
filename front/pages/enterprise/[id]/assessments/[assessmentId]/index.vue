<script setup lang="ts">
import { validRouteId } from '~/services/api'

const route = useRoute()
if (!validRouteId(route.params.id) || !validRouteId(route.params.assessmentId))
  throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })

// Do not skip the original assessment detail and pipeline when navigating by ID.
await navigateTo({
  path: `/enterprise/${route.params.id}/assessments`,
  query: { id: String(route.params.assessmentId) },
}, { replace: true })
</script>

<template>
  <div />
</template>
