<script setup lang="ts">
// Enterprise list page with create/delete actions.
import type { Enterprise, DataTableColumn } from "~/types"
import { formatDate } from "~/utils/date"

const store = useMockStore()
const showNewModal = ref(false)

const columns: DataTableColumn<Enterprise>[] = [
  { id: "name", accessor: "name", label: "Name" },
  { id: "industry", accessor: "industry", label: "Industry" },
  { id: "country", accessor: "country", label: "Country" },
  { id: "created", label: "Created", width: "140px" },
  { id: "actions", label: "", align: "right", width: "200px" },
]

function handleCreate(input: {
  name: string
  description: string
  industry: string
  country: string
  businessModel: string
  companySize: string
}) {
  const enterprise = store.createEnterprise(input)
  navigateTo(`/enterprise/${enterprise.id}`)
}

function handleDelete(enterprise: Enterprise) {
  if (!confirm(`Delete "${enterprise.name}"? This will remove all related data.`))
    return

  store.deleteEnterprise(enterprise.id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          Enterprises
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage organizations for maturity assessment.
        </p>
      </div>

      <UiButton @click="showNewModal = true">
        <Icon name="lucide:plus" class="h-4 w-4" />
        New Enterprise
      </UiButton>
    </div>

    <UiDataTable
      :columns="columns"
      :items="store.enterprises.value"
      empty-title="No Enterprises"
      empty-description="Create your first enterprise to get started."
    >
      <template #cell-name="{ row }">
        <NuxtLink
          :to="`/enterprise/${row.id}`"
          class="font-medium text-blue-600 hover:underline"
          dir="auto"
        >
          {{ row.name }}
        </NuxtLink>
      </template>

      <template #cell-country="{ row }">
        {{ row.country ?? "—" }}
      </template>

      <template #cell-created="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <NuxtLink :to="`/enterprise/${row.id}`">
            <UiButton variant="ghost">
              View
            </UiButton>
          </NuxtLink>

          <UiButton
            variant="ghost"
            @click="handleDelete(row)"
          >
            Delete
          </UiButton>
        </div>
      </template>
    </UiDataTable>

    <EnterpriseNewModal
      v-model:open="showNewModal"
      @create="handleCreate"
    />
  </div>
</template>
