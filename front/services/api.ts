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
  version: string; status: 'draft'|'running'|'completed'|'failed'; overallScore?: number|null; completedAt?: string|null; createdAt: string; updatedAt: string
}
export interface ApiDocument {
  id: number; dataSourceId: number; originalName: string; mediaType: string
  sizeBytes: number; sha256: string; createdAt: string; updatedAt: string
}
export interface ApiDashboard { enterpriseCount: number; enabledSourceCount: number; draftAssessmentCount: number; latestResult: {assessmentId:number;enterpriseId:number;name:string;overallScore:number|null}|null }
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
    getDossier: (id: number, assessmentId: number) => call<ApiResponse<ApiDossier>>(`${assessments(id)}/${assessmentId}/full`),
    prepareDemo: (id: number, assessmentId: number) => call<ApiResponse<ApiDossier>>(`${assessments(id)}/${assessmentId}/demo/prepare`, {method:'POST'}),
    finalizeDemo: (id: number, assessmentId: number) => call<ApiResponse<ApiDossier>>(`${assessments(id)}/${assessmentId}/demo/finalize`, {method:'POST'}),
    reviewDemoMapping: (id: number, assessmentId: number, mappingId: number, reviewStatus:'approved'|'rejected'|'irrelevant') => call<ApiResponse<ApiDossier>>(`${assessments(id)}/${assessmentId}/mappings/${mappingId}/review`, {method:'PATCH',body:{reviewStatus}}),
    getCapabilities: (id:number) => call<ApiResponse<{frameworkVersionId:number|null;capabilities:ApiCapability[]}>>(`${enterprise(id)}/capabilities`),
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

// Same domain contract for a seeded demonstration and future real AI output.
// The server marks simulated material; no UI component infers this from a fake LLM call.
export interface ApiCapability {
  id:number; frameworkVersionId:number; parentId:number|null; name:string; description:string|null;
  level:number; order:number; sourceRow:number|null
}
export interface ApiEvidence {
  id:number; assessmentId:number; dataSourceId:number; sourceRecordId:number; title:string;
  evidenceType:string; content:string; context:Record<string,unknown>; metadata:Record<string,unknown>;
  provenance:Record<string,unknown>; origin:'simulated'|'real_ai'|'deterministic'; createdAt:string; updatedAt:string
}
export interface ApiMapping {
  id:number; assessmentId:number; capabilityId:number; evidenceId:number;
  confidence:number; reasoning:string; reviewStatus:'pending'|'approved'|'rejected'|'irrelevant';
  approved:boolean; origin:string; createdAt:string; updatedAt:string
}
export interface ApiCapabilityScore {
  id:number; assessmentId:number; capabilityId:number; score:number|null; maturityLevel:number|null;
  confidence:number|null; reasoning:string; status:'assessed'|'insufficient_evidence';
  origin:string; createdAt:string; updatedAt:string
}
export interface ApiPipelineStep {
  id:number; assessmentId:number; step:'collect_sources'|'extract_evidence'|'mapping'|'assessment'|'aggregation'|'report';
  status:'waiting'|'running'|'completed'|'failed'; startedAt:string|null; completedAt:string|null;
  createdAt:string; updatedAt:string
}
export interface ApiDossier {
  enterpriseId:number;
  assessment:ApiAssessment & {overallScore:number|null; completedAt:string|null};
  sources:ApiDataSource[]; capabilities:ApiCapability[]; evidences:ApiEvidence[]; mappings:ApiMapping[];
  leafEvaluations:ApiCapabilityScore[]; capabilityAssessments:ApiCapabilityScore[];
  pipeline:ApiPipelineStep[];
  report:{recommendations:string[];summary:Record<string,unknown>;origin:string}|null;
  snapshot:{frameworkVersionId:number;selectedSourceIds:number[];selectedCapabilityIds:number[];origin:string}|null;
  analysisMode:'simulated'|'not_available';displayWarning:string|null
}
