<script setup lang="ts">
import type { ApiDataSource, ApiDocument, SourceType } from '~/services/api'
import { ApiError, validRouteId } from '~/services/api'
import type { Enterprise } from '~/types'
import { defaultDataSourceTypes, getDataSourceLabel } from '~/utils/data-source'

const api = useApi()
const route = useRoute()
const enterpriseId = computed(() => Number(route.params.id))
const page = ref(1)
const message = ref('')
const success = ref('')
const saving = ref(false)
const showModal = ref(false)
const editing = ref<ApiDataSource | null>(null)
const name = ref('')
const type = ref<SourceType>('clarity')
const description = ref('')
const businessText = ref('')
const documents = ref<Record<number, ApiDocument[]>>({})
const documentPages = ref<Record<number, number>>({})
const documentTotals = ref<Record<number, number>>({})
const options = [...defaultDataSourceTypes, 'custom' as SourceType].map(value => ({ value, label: getDataSourceLabel(value) }))
const { data, pending, error, refresh } = await useAsyncData(() => `sources-${route.params.id}-${page.value}`, async () => {
  const id = enterpriseId.value
  if (!validRouteId(route.params.id)) throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
  const [enterprise, sources] = await Promise.all([api.getEnterprise(id), api.listSources(id, page.value)])
  return { enterprise: enterprise.data, sources }
}, { watch: [enterpriseId, page] })
const enterprise = computed<Enterprise | undefined>(() => {
  if (!data.value) return undefined
  const item = data.value.enterprise
  return { ...item, description: item.description ?? undefined, country: item.country ?? undefined, businessModel: item.businessModel ?? undefined, companySize: item.companySize ?? undefined }
})
function openCreate() { editing.value = null; name.value = ''; type.value = 'clarity'; description.value = ''; businessText.value = ''; message.value = ''; showModal.value = true }
function openEdit(source: ApiDataSource) { editing.value = source; name.value = source.name; type.value = source.type; description.value = source.description ?? ''; businessText.value = source.businessText ?? ''; message.value = ''; showModal.value = true }
function errorMessage(cause: unknown) { return cause instanceof ApiError ? cause.message : 'Unable to complete the request.' }
async function save() {
  if (!name.value.trim()) return
  saving.value = true; message.value = ''; success.value = ''
  try {
    if (editing.value) await api.updateSource(enterpriseId.value, editing.value.id, { description: description.value || null, ...(type.value === 'business_document' ? { businessText: businessText.value || null } : {}) })
    else await api.createSource(enterpriseId.value, { name: name.value, type: type.value, description: description.value || null, businessText: type.value === 'business_document' ? businessText.value || null : null })
    await refresh(); showModal.value = false; success.value = editing.value ? 'Data source updated.' : 'Data source created.'
  } catch (cause) { message.value = errorMessage(cause) } finally { saving.value = false }
}
async function toggle(source: ApiDataSource) {
  message.value = ''; success.value = ''
  try { await api.updateSource(enterpriseId.value, source.id, { enabled: !source.enabled }); await refresh(); success.value = 'Data source updated.' } catch (cause) { message.value = errorMessage(cause) }
}
async function remove(source: ApiDataSource) {
  if (!confirm(`Delete "${source.name}"?`)) return
  message.value = ''; success.value = ''
  try { await api.deleteSource(enterpriseId.value, source.id); await refresh(); success.value = 'Data source deleted.' }
  catch (cause) { message.value = cause instanceof ApiError && cause.status === 409 ? 'Delete the documents in this source first.' : errorMessage(cause) }
}
async function loadDocuments(sourceId: number, targetPage = 1) {
  try { const result = await api.listDocuments(enterpriseId.value, sourceId, targetPage); documents.value[sourceId] = result.data; documentPages.value[sourceId] = targetPage; documentTotals.value[sourceId] = result.pagination.total }
  catch (cause) { message.value = errorMessage(cause) }
}
async function upload(sourceId: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  message.value = ''; success.value = ''
  try { await api.uploadDocument(enterpriseId.value, sourceId, file); await loadDocuments(sourceId, 1); success.value = 'Document uploaded.' }
  catch (cause) { message.value = errorMessage(cause) } finally { input.value = '' }
}
async function removeDocument(sourceId: number, item: ApiDocument) {
  if (!confirm(`Delete "${item.originalName}"?`)) return
  success.value = ''; message.value = ''
  try { await api.deleteDocument(enterpriseId.value, sourceId, item.id); await loadDocuments(sourceId, documentPages.value[sourceId] || 1); success.value = 'Document deleted.' }
  catch (cause) { message.value = errorMessage(cause) }
}
async function download(sourceId: number, item: ApiDocument) {
  try { await api.saveDocument(enterpriseId.value, sourceId, item) } catch (cause) { message.value = errorMessage(cause) }
}
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading data sources...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">{{ error.statusCode === 404 ? 'Enterprise not found.' : error.statusCode === 503 ? 'The service is temporarily unavailable.' : 'Unable to load data sources.' }} <button v-if="error.statusCode !== 404" class="underline" @click="refresh()">Retry</button></div>
  <div v-else-if="enterprise && data" class="space-y-6">
    <EnterpriseHeader :enterprise="enterprise" @new-assessment="navigateTo(`/enterprise/${enterpriseId}/assessments`)" />
    <EnterpriseTabs />
    <div class="flex items-center justify-between"><h2 class="text-xl font-semibold">Data Sources</h2><UiButton @click="openCreate">Add Source</UiButton></div>
    <p v-if="message && !showModal" role="alert" class="text-sm text-red-700">{{ message }}</p>
    <p v-if="success" role="status" class="text-sm text-green-700">{{ success }}</p>
    <UiEmptyState v-if="!data.sources.data.length" title="No Data Sources" description="Add a data source to get started." />
    <div v-for="source in data.sources.data" :key="source.id" class="space-y-3 rounded-xl border bg-white p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div><h3 class="font-semibold">{{ source.name }}</h3><p class="text-sm text-slate-500">{{ getDataSourceLabel(source.type) }} · {{ source.enabled ? 'Enabled' : 'Disabled' }}</p></div>
        <div class="flex gap-2"><UiButton variant="ghost" @click="toggle(source)">{{ source.enabled ? 'Disable' : 'Enable' }}</UiButton><UiButton variant="ghost" @click="openEdit(source)">Edit</UiButton><UiButton variant="ghost" @click="remove(source)">Delete</UiButton></div>
      </div>
      <p v-if="source.description" class="text-sm text-slate-600">{{ source.description }}</p>
      <div v-if="(source.type === 'business_document' || source.type === 'capability_excel')" class="space-y-2 border-t pt-3">
        <p v-if="source.businessText" class="whitespace-pre-wrap text-sm">{{ source.businessText }}</p>
        <div class="flex flex-wrap items-center gap-3"><input v-if="source.type === 'business_document'" type="file" accept=".pdf,.docx,.txt" @change="upload(source.id, $event)"><button class="text-sm text-blue-700 underline" @click="loadDocuments(source.id)">Show documents</button></div>
        <p v-if="documents[source.id] && !documents[source.id]?.length" class="text-sm text-slate-500">No documents on this page.</p>
        <div v-for="item in documents[source.id] ?? []" :key="item.id" class="flex items-center gap-3 text-sm"><span>{{ item.originalName }}</span><button class="text-blue-700 underline" @click="download(source.id, item)">Download</button><button v-if="source.type === 'business_document'" class="text-red-700 underline" @click="removeDocument(source.id, item)">Delete</button></div>
        <div v-if="documents[source.id]" class="flex gap-2 text-sm"><button :disabled="(documentPages[source.id] || 1) <= 1" @click="loadDocuments(source.id, (documentPages[source.id] || 1) - 1)">Previous</button><span>Page {{ documentPages[source.id] }}</span><button :disabled="(documentPages[source.id] || 1) * 20 >= (documentTotals[source.id] || 0)" @click="loadDocuments(source.id, (documentPages[source.id] || 1) + 1)">Next</button></div>
      </div>
    </div>
    <div class="flex items-center gap-3 text-sm"><button :disabled="page <= 1" @click="page--">Previous</button><span>Page {{ page }} · {{ data.sources.pagination.total }} sources</span><button :disabled="page * 20 >= data.sources.pagination.total" @click="page++">Next</button></div>
    <Teleport to="body"><div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div class="w-full max-w-lg space-y-4 rounded-xl bg-white p-6">
      <h2 class="text-xl font-semibold">{{ editing ? 'Edit Data Source' : 'Add Data Source' }}</h2>
      <UiInput v-model="name" label="Name" :disabled="!!editing" required />
      <UiSelect v-model="type" label="Type" :options="options" :disabled="!!editing" />
      <UiTextarea v-model="description" label="Description" />
      <UiTextarea v-if="type === 'business_document'" v-model="businessText" label="Business Context" />
      <p v-if="message" role="alert" class="text-sm text-red-700">{{ message }}</p>
      <div class="flex justify-end gap-2"><UiButton variant="ghost" @click="showModal = false">Cancel</UiButton><UiButton :disabled="saving" @click="save">Save</UiButton></div>
    </div></div></Teleport>
  </div>
</template>
