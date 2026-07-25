<script setup lang="ts">
// Dashboard home page showing platform-wide summary stats and quick actions.
import { formatScore } from "~/utils/maturity"
import { formatDate } from "~/utils/date"
import {
  getAssessmentStatusLabel,
  getAssessmentStatusVariant,
} from "~/utils/status"

const store = useMockStore()

const firstEnterprise = computed(() =>
  store.enterprises.value[0],
)

const latestAssessment = computed(() => {
  if (!firstEnterprise.value)
    return undefined

  return store.getLatestCompletedAssessment(
    firstEnterprise.value.id,
  )
})

const enabledSourcesCount = computed(() => {
  if (!firstEnterprise.value)
    return 0

  return store.getDataSourcesForEnterprise(
    firstEnterprise.value.id,
  ).filter(item => item.enabled).length
})

const completedCount = computed(() =>
  store.completedAssessments.value.length,
)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Overview of your enterprise maturity assessment platform.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <AppCard>
        <div class="text-sm font-medium text-slate-500">
          Enterprises
        </div>
        <div class="mt-2 text-xl font-bold text-slate-900">
          {{ store.enterprises.value.length }}
        </div>
        <div class="mt-1 text-xs text-slate-500">
          registered
        </div>
      </AppCard>

      <AppCard>
        <div class="text-sm font-medium text-slate-500">
          Latest Score
        </div>
        <div class="mt-2 text-xl font-bold text-blue-600">
          {{ latestAssessment ? formatScore(latestAssessment.overallScore) : "—" }}
        </div>
        <div class="mt-1 text-xs text-slate-500">
          Overall Maturity
        </div>
      </AppCard>

      <AppCard>
        <div class="text-sm font-medium text-slate-500">
          Active Sources
        </div>
        <div class="mt-2 text-xl font-bold text-slate-900">
          {{ enabledSourcesCount }}
        </div>
        <div class="mt-1 text-xs text-slate-500">
          across all enterprises
        </div>
      </AppCard>

      <AppCard>
        <div class="text-sm font-medium text-slate-500">
          Assessments
        </div>
        <div class="mt-2 text-xl font-bold text-slate-900">
          {{ completedCount }}
        </div>
        <div class="mt-1 text-xs text-slate-500">
          completed
        </div>
      </AppCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <AppCard
        title="Latest Assessment"
        description="Most recent completed assessment."
      >
        <template v-if="latestAssessment">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-900">
                {{ latestAssessment.name }}
              </span>
              <UiBadge
                :variant="getAssessmentStatusVariant(latestAssessment.status)"
              >
                {{ getAssessmentStatusLabel(latestAssessment.status) }}
              </UiBadge>
            </div>

            <p class="text-2xl font-bold text-blue-600">
              {{ formatScore(latestAssessment.overallScore) }}
            </p>

            <p class="text-sm text-slate-500">
              Completed {{ formatDate(latestAssessment.completedAt) }}
            </p>
          </div>
        </template>

        <UiEmptyState
          v-else
          title="No Completed Assessments"
          description="Run an assessment to see results."
          icon="lucide:clipboard-list"
        />
      </AppCard>

      <AppCard
        title="Quick Actions"
        description="Common tasks to get started."
      >
        <div class="space-y-3">
          <NuxtLink
            to="/enterprise"
            class="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <Icon name="lucide:building-2" class="h-5 w-5 text-blue-600" />
            <div>
              <div class="font-medium text-slate-900">
                Manage Enterprises
              </div>
              <div class="text-xs text-slate-500">
                View, add, or remove organizations
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            v-if="firstEnterprise"
            :to="`/enterprise/${firstEnterprise.id}/assessments`"
            class="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <Icon name="lucide:play" class="h-5 w-5 text-blue-600" />
            <div>
              <div class="font-medium text-slate-900">
                Run Assessment
              </div>
              <div class="text-xs text-slate-500">
                Start a new maturity evaluation
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            v-if="firstEnterprise"
            :to="`/enterprise/${firstEnterprise.id}/reports`"
            class="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <Icon name="lucide:file-text" class="h-5 w-5 text-blue-600" />
            <div>
              <div class="font-medium text-slate-900">
                View Reports
              </div>
              <div class="text-xs text-slate-500">
                Browse completed assessment reports
              </div>
            </div>
          </NuxtLink>
        </div>
      </AppCard>
    </div>
  </div>
</template>
