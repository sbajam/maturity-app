<script setup lang="ts">
import type {
  DataSource, Enterprise,
  DataTableColumn,

} from "~/types"
import {
  getEnabledLabel,
  getEnabledVariant,
} from "~/utils/status"

const route = useRoute()

const columns: DataTableColumn<DataSource>[] = [
  {
    id: "name",
    accessor: "name",
    label: "Name",
  },
  {
    id: "type",
    accessor: "type",
    label: "Type",
  },
  {
    id: "status",
    accessor: "enabled",
    label: "Status",
  },
  {
    id: "actions",
    label: "",
    align: "right",
    width: "180px",
  },
]
// -----------------------------------------------------------------------------
// Temporary Mock Data
// Remove after API integration
// -----------------------------------------------------------------------------


const enterprise: Enterprise = {
  id: 1,
  createdAt: "2026-01-05T10:30:00Z",
  updatedAt: "2026-02-10T09:00:00Z",

  name: "Vornaco",

  description:
    "شرکت ورناکو در زمینه توسعه نرم‌افزارهای سازمانی، هوش مصنوعی و تحلیل فرایندهای کسب‌وکار فعالیت می‌کند.",

  industry: "Software",

  country: "Iran",

  businessModel: "B2B SaaS",

  companySize: "11-50",

  logo: "",
}
const enterpriseId = enterprise.id
const sources = ref<DataSource[]>([
  {
    id: 1,
    enterpriseId,
    name: "Microsoft Clarity",

    type: "clarity",

    enabled: true,

    createdAt: "",

    updatedAt: "",
  },

  {
    id: 2,
    enterpriseId,
    name: "Customer Feedback",

    type: "customer_feedback",

    enabled: false,

    createdAt: "",

    updatedAt: "",
  },
])

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

const onEdit = () => {
  console.log("Edit Enterprise")
}

const onNewAssessment = () => {
  console.log("New Assessment")
}
</script>

<template>
  <div class="space-y-6">

    <EnterpriseHeader :enterprise="enterprise" @edit="onEdit" @new-assessment="onNewAssessment" />

    <EnterpriseTabs />

    <UiDataTable :columns="columns" :items="sources" empty-title="No Data Sources"
      empty-description="Connect your first data source.">

      <template #toolbar>

        <div class="flex items-center justify-between">

          <div>

            <h2 class="text-xl font-semibold">
              Data Sources
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Manage connected enterprise data.
            </p>

          </div>

          <UiButton>

            Add Source

          </UiButton>

        </div>

      </template>
      <template #cell-status="{ row }">
        <UiBadge :variant="getEnabledVariant(row.enabled)">
          {{ getEnabledLabel(row.enabled) }}
        </UiBadge>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost">
            Edit
          </UiButton>

          <UiButton variant="ghost">
            Delete
          </UiButton>
        </div>
      </template>

    </UiDataTable>

  </div>
</template>