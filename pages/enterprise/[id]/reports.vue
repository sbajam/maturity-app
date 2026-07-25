<script setup lang="ts">
// List of an enterprise's completed assessment reports.
import type { Assessment, DataTableColumn } from "~/types"
import { formatScore } from "~/utils/maturity"
import { formatDate } from "~/utils/date"

const {
  enterpriseId,
  enterprise,
  completedAssessments,
} = useEnterpriseRoute()

const columns: DataTableColumn<Assessment>[] = [
  { id: "name", accessor: "name", label: "Assessment" },
  { id: "version", accessor: "version", label: "Version", width: "100px" },
  { id: "score", label: "Score", width: "120px" },
  { id: "date", label: "Completed", width: "140px" },
  { id: "actions", label: "", align: "right", width: "200px" },
]

function printPage() {
  window.print()
}
</script>

<template>
  <div
    v-if="enterprise"
    class="space-y-6"
  >
    <EnterpriseHeader :enterprise="enterprise" />

    <EnterpriseTabs />

    <UiDataTable
      :columns="columns"
      :items="completedAssessments"
      empty-title="No Reports"
      empty-description="Complete an assessment to generate a report."
    >
      <template #toolbar>
        <div>
          <h2 class="text-xl font-semibold text-slate-900">
            Reports
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Completed assessment reports available for review and printing.
          </p>
        </div>
      </template>

      <template #cell-score="{ row }">
        <span class="font-medium text-blue-600">
          {{ formatScore(row.overallScore) }}
        </span>
      </template>

      <template #cell-date="{ row }">
        {{ formatDate(row.completedAt) }}
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <NuxtLink
            :to="`/enterprise/${enterpriseId}/assessments/${row.id}/report`"
          >
            <UiButton variant="ghost">
              View Report
            </UiButton>
          </NuxtLink>

          <UiButton
            variant="outline"
            @click="printPage"
          >
            <Icon name="lucide:printer" class="h-4 w-4" />
            Print
          </UiButton>
        </div>
      </template>
    </UiDataTable>
  </div>

  <UiEmptyState
    v-else
    title="Enterprise Not Found"
    description="The requested enterprise does not exist."
    icon="lucide:building-2"
  />
</template>
