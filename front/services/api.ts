import { $fetch, type FetchOptions } from 'ofetch'

export interface ApiPagination { page: number; pageSize: number; total: number }
export interface ApiList<T> { data: T[]; pagination: ApiPagination }
export interface ApiResponse<T> { data: T }
export interface ApiEnterprise {
  id: number; name: string; industry: string; description: string | null; country: string | null
  businessModel: string | null; companySize: string | null; createdAt: string; updatedAt: string
}
export type SourceType = 'clarity' | 'matomo' | 'support' | 'business_document' | 'capability_excel' | 'server_log' | 'event_log' | 'custom'
export interface ApiDataSource {
  id: number; enterpriseId: number; name: string; type: SourceType; enabled: boolean
  description: string | null; businessText: string | null; createdAt: string; updatedAt: string
}
export interface ApiAssessment {
  id: number; enterpriseId: number; name: string; description: string | null
  version: string; status: 'draft'; createdAt: string; updatedAt: string
}
export interface ApiDocument {
  id: number; dataSourceId: number; originalName: string; mediaType: string
  sizeBytes: number; sha256: string; createdAt: string; updatedAt: string
}
export interface ApiDashboard { enterpriseCount: number; enabledSourceCount: number; draftAssessmentCount: number; latestResult: null }
export interface ApiFieldError { path: string; message: string }

export function validRouteId(value: unknown): value is string {
  return typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) <= 2147483647
}

export class ApiError extends Error {
  readonly statusCode: number
  constructor(public status: number, public code: string, message: string, public fields: ApiFieldError[] = []) {
    super(message)
    this.statusCode = status || 500
  }
}

function normalizeError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const value = error as { statusCode?: number; data?: { error?: { code?: string; message?: string; fields?: ApiFieldError[] } } }
    if (typeof value.statusCode === 'number')
      return new ApiError(value.statusCode, value.data?.error?.code ?? 'REQUEST_FAILED', value.data?.error?.message ?? 'Unable to complete the request.', value.data?.error?.fields ?? [])
  }
  return new ApiError(0, 'NETWORK_ERROR', 'Unable to connect to the server.')
}

export function createApi(baseURL: string) {
  async function call<T>(url: string, options: FetchOptions<'json'> = {}): Promise<T> {
    try { return await $fetch<T>(url, { ...options, baseURL }) }
    catch (error) { throw normalizeError(error) }
  }
  const enterprise = (id: number) => `/enterprises/${id}`
  const sources = (id: number) => `${enterprise(id)}/data-sources`
  const assessments = (id: number) => `${enterprise(id)}/assessments`
  const documents = (id: number, sourceId: number) => `${sources(id)}/${sourceId}/documents`
  return {
    listEnterprises: (page = 1, pageSize = 20) => call<ApiList<ApiEnterprise>>('/enterprises', { query: { page, pageSize } }),
    getEnterprise: (id: number) => call<ApiResponse<ApiEnterprise>>(enterprise(id)),
    createEnterprise: (body: { name: string; industry: string; description?: string | null; country?: string | null; businessModel?: string | null; companySize?: string | null }) => call<ApiResponse<ApiEnterprise>>('/enterprises', { method: 'POST', body }),
    deleteEnterprise: (id: number) => call<void>(enterprise(id), { method: 'DELETE' }),
    listSources: (id: number, page = 1, pageSize = 20) => call<ApiList<ApiDataSource>>(sources(id), { query: { page, pageSize } }),
    createSource: (id: number, body: { name: string; type: SourceType; description?: string | null; businessText?: string | null; enabled?: boolean }) => call<ApiResponse<ApiDataSource>>(sources(id), { method: 'POST', body }),
    updateSource: (id: number, sourceId: number, body: { description?: string | null; businessText?: string | null; enabled?: boolean }) => call<ApiResponse<ApiDataSource>>(`${sources(id)}/${sourceId}`, { method: 'PATCH', body }),
    deleteSource: (id: number, sourceId: number) => call<void>(`${sources(id)}/${sourceId}`, { method: 'DELETE' }),
    listAssessments: (id: number, page = 1, pageSize = 20) => call<ApiList<ApiAssessment>>(assessments(id), { query: { page, pageSize } }),
    getAssessment: (id: number, assessmentId: number) => call<ApiResponse<ApiAssessment>>(`${assessments(id)}/${assessmentId}`),
    createAssessment: (id: number, body: { name: string; description?: string | null; version?: string }) => call<ApiResponse<ApiAssessment>>(assessments(id), { method: 'POST', body }),
    deleteAssessment: (id: number, assessmentId: number) => call<void>(`${assessments(id)}/${assessmentId}`, { method: 'DELETE' }),
    dashboard: () => call<ApiResponse<ApiDashboard>>('/dashboard'),
    listDocuments: (id: number, sourceId: number, page = 1, pageSize = 20) => call<ApiList<ApiDocument>>(documents(id, sourceId), { query: { page, pageSize } }),
    uploadDocument: (id: number, sourceId: number, file: File) => { const body = new FormData(); body.append('file', file); return call<ApiResponse<ApiDocument>>(documents(id, sourceId), { method: 'POST', body }) },
    downloadDocument: async (id: number, sourceId: number, documentId: number) => {
      try { return await $fetch<Blob, 'blob'>(`${documents(id, sourceId)}/${documentId}/content`, { baseURL, responseType: 'blob' }) }
      catch (error) { throw normalizeError(error) }
    },
    saveDocument: async (id: number, sourceId: number, document: ApiDocument) => {
      const blob = await $fetch<Blob, 'blob'>(`${documents(id, sourceId)}/${document.id}/content`, { baseURL, responseType: 'blob' }).catch((error: unknown) => { throw normalizeError(error) })
      const url = URL.createObjectURL(blob)
      try { const link = window.document.createElement('a'); link.href = url; link.download = document.originalName; link.click() }
      finally { URL.revokeObjectURL(url) }
    },
    deleteDocument: (id: number, sourceId: number, documentId: number) => call<void>(`${documents(id, sourceId)}/${documentId}`, { method: 'DELETE' }),
  }
}
