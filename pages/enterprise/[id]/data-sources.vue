<script setup lang="ts">
// Enterprise data source management page: add, edit, toggle, and delete sources.
import type {
  DataSource,
  DataSourceType,
  DataTableColumn,
} from "~/types"
import {
  getEnabledLabel,
  getEnabledVariant,
} from "~/utils/status"
import {
  defaultDataSourceTypes,
  getDataSourceLabel,
} from "~/utils/data-source"

const {
  enterpriseId,
  enterprise,
  dataSources,
  store,
} = useEnterpriseRoute()

const columns: DataTableColumn<DataSource>[] = [
  { id: "name", accessor: "name", label: "Name" },
  { id: "type", label: "Type" },
  { id: "enabled", label: "Enabled", width: "100px" },
  { id: "status", accessor: "enabled", label: "Status", width: "110px" },
  { id: "actions", label: "", align: "right", width: "200px" },
]

const showAddModal = ref(false)
const editingSource = ref<DataSource | null>(null)
const showEditModal = ref(false)

const newName = ref("")
const newType = ref<DataSourceType>("clarity")
const newDescription = ref("")
const newBusinessText = ref("")

const editBusinessText = ref("")
const editFileName = ref("")
const editDescription = ref("")

const typeOptions = defaultDataSourceTypes.map(type => ({
  label: getDataSourceLabel(type),
  value: type,
}))

const businessSources = computed(() =>
  dataSources.value.filter(
    item => item.type === "business_document",
  ),
)

function openEdit(source: DataSource) {
  editingSource.value = source
  editBusinessText.value = source.businessText ?? ""
  editFileName.value = source.fileName ?? ""
  editDescription.value = source.description ?? ""
  showEditModal.value = true
}

function saveEdit() {
  if (!editingSource.value)
    return

  store.updateDataSource(editingSource.value.id, {
    businessText: editBusinessText.value,
    fileName: editFileName.value || undefined,
    description: editDescription.value || undefined,
  })

  showEditModal.value = false
  editingSource.value = null
}

function handleAdd() {
  if (!newName.value.trim())
    return

  store.createDataSource(enterpriseId.value, {
    name: newName.value.trim(),
    type: newType.value,
    description: newDescription.value.trim() || undefined,
    businessText: newType.value === "business_document"
      ? newBusinessText.value.trim() || undefined
      : undefined,
    enabled: true,
  })

  newName.value = ""
  newType.value = "clarity"
  newDescription.value = ""
  newBusinessText.value = ""
  showAddModal.value = false
}

function handleDelete(source: DataSource) {
  if (!confirm(`Delete "${source.name}"?`))
    return

  store.deleteDataSource(source.id)
}

function handleMockUpload() {
  editFileName.value = `document-${Date.now()}.pdf`
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
      :items="dataSources"
      empty-title="No Data Sources"
      empty-description="Connect your first data source."
    >
      <template #toolbar>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">
              Data Sources
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Manage connected enterprise data sources.
            </p>
          </div>

          <UiButton @click="showAddModal = true">
            <Icon name="lucide:plus" class="h-4 w-4" />
            Add Source
          </UiButton>
        </div>
      </template>

      <template #cell-type="{ row }">
        {{ getDataSourceLabel(row.type) }}
      </template>

      <template #cell-enabled="{ row }">
        <button
          type="button"
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
          :class="row.enabled ? 'bg-blue-600' : 'bg-slate-200'"
          @click="store.toggleDataSource(row.id)"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
            :class="row.enabled ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </template>

      <template #cell-status="{ row }">
        <UiBadge :variant="getEnabledVariant(row.enabled)">
          {{ getEnabledLabel(row.enabled) }}
        </UiBadge>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiButton
            variant="ghost"
            @click="openEdit(row)"
          >
            Edit
          </UiButton>

          <UiButton
            variant="ghost"
            @click="handleDelete(row)"
          >
            Delete
          </UiButton>
        </div>
      </template>
    </UiDataTable>

    <div
      v-if="businessSources.length"
      class="space-y-4"
    >
      <h2 class="text-lg font-semibold text-slate-900">
        Business Documentation
      </h2>

      <div
        v-for="source in businessSources"
        :key="source.id"
        class="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-slate-900">
              {{ source.name }}
            </h3>
            <p
              v-if="source.fileName"
              class="mt-1 text-sm text-slate-500"
            >
              <Icon name="lucide:file" class="mr-1 inline h-4 w-4" />
              {{ source.fileName }}
            </p>
          </div>

          <UiBadge :variant="getEnabledVariant(source.enabled)">
            {{ getEnabledLabel(source.enabled) }}
          </UiBadge>
        </div>

        <div
          v-if="source.businessText"
          class="mt-4 rounded-xl bg-slate-50 p-4"
        >
          <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Business Context
          </h4>
          <p
            class="text-sm leading-7 text-slate-700"
            dir="auto"
          >
            {{ source.businessText }}
          </p>
        </div>

        <p
          v-else
          class="mt-4 text-sm italic text-slate-400"
        >
          No business context provided. Click Edit to add description.
        </p>
      </div>
    </div>

    <!-- Add Modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showAddModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <h2 class="text-xl font-semibold text-slate-900">
            Add Data Source
          </h2>

          <div class="mt-6 space-y-4">
            <UiInput
              v-model="newName"
              label="Name"
              placeholder="Microsoft Clarity"
              required
            />

            <UiSelect
              v-model="newType"
              label="Type"
              :options="typeOptions"
            />

            <UiTextarea
              v-model="newDescription"
              label="Description"
              placeholder="Optional description..."
            />

            <UiTextarea
              v-if="newType === 'business_document'"
              v-model="newBusinessText"
              label="Business Context"
              placeholder="Describe your business rules and processes..."
              dir="auto"
              :rows="5"
            />
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UiButton
              variant="ghost"
              @click="showAddModal = false"
            >
              Cancel
            </UiButton>
            <UiButton @click="handleAdd">
              Add
            </UiButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showEditModal && editingSource"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showEditModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <h2 class="text-xl font-semibold text-slate-900">
            Edit {{ editingSource.name }}
          </h2>

          <div class="mt-6 space-y-4">
            <UiTextarea
              v-model="editDescription"
              label="Description"
              placeholder="Source description..."
            />

            <template v-if="editingSource.type === 'business_document'">
              <UiTextarea
                v-model="editBusinessText"
                label="Business Context"
                placeholder="Describe your business rules and processes..."
                dir="auto"
                :rows="5"
              />

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Document Upload
                </label>
                <div class="flex items-center gap-3">
                  <UiButton
                    variant="outline"
                    @click="handleMockUpload"
                  >
                    <Icon name="lucide:upload" class="h-4 w-4" />
                    Upload File
                  </UiButton>
                  <span
                    v-if="editFileName"
                    class="text-sm text-slate-600"
                  >
                    {{ editFileName }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UiButton
              variant="ghost"
              @click="showEditModal = false"
            >
              Cancel
            </UiButton>
            <UiButton @click="saveEdit">
              Save
            </UiButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

  <UiEmptyState
    v-else
    title="Enterprise Not Found"
    description="The requested enterprise does not exist."
    icon="lucide:building-2"
  />
</template>
