<script setup lang="ts">
// Enterprise list page with create/delete actions.
import type { DataTableColumn } from "~/types"
import type { ApiEnterprise } from "~/services/api"
import { ApiError } from "~/services/api"
import { formatDate } from "~/utils/date"

const api = useApi()
const showNewModal = ref(false)
const page = ref(1)
const mutationError = ref("")
const success = ref("")
const saving = ref(false)
const { data: result, pending, error, refresh } = await useAsyncData('enterprise-list', () => api.listEnterprises(page.value), { watch: [page] })

const columns: DataTableColumn<ApiEnterprise>[] = [
  { id: "name", accessor: "name", label: "Name" },
  { id: "industry", accessor: "industry", label: "Industry" },
  { id: "country", accessor: "country", label: "Country" },
  { id: "created", label: "Created", width: "140px" },
  { id: "actions", label: "", align: "right", width: "200px" },
]

async function handleCreate(input: {
  name: string
  description: string
  industry: string
  country: string
  businessModel: string
  companySize: string
}) {
  saving.value = true
  mutationError.value = ""; success.value = ""
  try {
    const response = await api.createEnterprise({ ...input, companySize: input.companySize || null })
    showNewModal.value = false
    await refresh()
    await navigateTo(`/enterprise/${response.data.id}`)
  } catch (cause) {
    mutationError.value = cause instanceof ApiError ? cause.message : 'Unable to create the enterprise.'
  } finally { saving.value = false }
}

async function handleDelete(enterprise: ApiEnterprise) {
  if (!confirm(`Delete "${enterprise.name}"?`))
    return
  mutationError.value = ""; success.value = ""
  try { await api.deleteEnterprise(enterprise.id); await refresh(); success.value = 'Enterprise deleted.' }
  catch (cause) { mutationError.value = cause instanceof ApiError && cause.status === 409 ? 'Delete the enterprise’s data sources and draft assessments first.' : 'Unable to delete the enterprise.' }
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

      <UiButton @click="mutationError = ''; showNewModal = true">
        <Icon name="lucide:plus" class="h-4 w-4" />
        New Enterprise
      </UiButton>
    </div>

    <p v-if="error" role="alert" class="text-sm text-red-700">Unable to load enterprises. <button class="underline" @click="refresh()">Retry</button></p>
    <p v-if="mutationError && !showNewModal" role="alert" class="text-sm text-red-700">{{ mutationError }}</p>
    <p v-if="success" role="status" class="text-sm text-green-700">{{ success }}</p>
    <UiDataTable
      v-if="!error"
      :columns="columns"
      :items="result?.data ?? []"
      :loading="pending"
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
      <template #footer>
        <div class="flex items-center justify-between text-sm">
          <span>Page {{ page }} · {{ result?.pagination.total ?? 0 }} enterprises</span>
          <div class="flex gap-2"><UiButton variant="ghost" :disabled="page <= 1" @click="page--">Previous</UiButton><UiButton variant="ghost" :disabled="page * 20 >= (result?.pagination.total ?? 0)" @click="page++">Next</UiButton></div>
        </div>
      </template>
    </UiDataTable>

    <EnterpriseNewModal
      v-model:open="showNewModal"
      :error="mutationError"
      :loading="saving"
      @create="handleCreate"
    />
  </div>
</template>
