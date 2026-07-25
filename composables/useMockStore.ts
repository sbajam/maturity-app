// In-memory mock data store simulating the backend: enterprises, data sources, assessments, pipelines, and the assessment run/wizard flow.
import type {
  Assessment,
  AssessmentPipeline,
  CapabilityAssessment,
  CapabilityEvidenceMapping,
  DataSource,
  DataSourceType,
  Enterprise,
  Evidence,
  MappingReviewStatus,
} from "~/types"
import { mockAssessments } from "~/mock/assessments"
import {
  getTemplateCapabilityAssessments,
  getTemplateRecommendations,
  mockCapabilityAssessmentsByAssessment,
  mockRecommendationsByAssessment,
} from "~/mock/capability-assessments"
import { mockCapabilities } from "~/mock/capabilities"
import { mockDataSources } from "~/mock/data-sources"
import { mockEnterprise } from "~/mock/enterprise"
import {
  getTemplateEvidence,
  mockEvidenceByAssessment,
} from "~/mock/evidence"
import {
  getTemplateMappings,
  mockMappingsByAssessment,
} from "~/mock/mappings"
import {
  createEmptyPipeline,
  mockPipelines,
} from "~/mock/pipeline"
import { aggregateParentAssessments } from "~/utils/capability"
import { average } from "~/utils/number"

let nextEnterpriseId = 2
let nextAssessmentId = 4
let nextPipelineId = 20
let nextDataSourceId = 10
let nextEvidenceId = 100
let nextMappingId = 100
let nextCapabilityAssessmentId = 100

const enterprises = ref<Enterprise[]>([{ ...mockEnterprise }])
const assessments = ref<Assessment[]>([...mockAssessments])
const pipelines = ref<Record<number, AssessmentPipeline[]>>({
  ...mockPipelines,
})
const dataSources = ref<DataSource[]>([...mockDataSources])
const evidenceByAssessment = ref<
  Record<number, Evidence[]>
>({ ...mockEvidenceByAssessment })
const mappingsByAssessment = ref<
  Record<number, CapabilityEvidenceMapping[]>
>({ ...mockMappingsByAssessment })
const capabilityAssessmentsByAssessment = ref<
  Record<number, CapabilityAssessment[]>
>({ ...mockCapabilityAssessmentsByAssessment })
const recommendationsByAssessment = ref<
  Record<number, string[]>
>({ ...mockRecommendationsByAssessment })

const runningAssessmentId = ref<number | null>(null)

export function useMockStore() {
  function getEnterprise(id: number) {
    return enterprises.value.find(item => item.id === id)
  }

  function getDataSourcesForEnterprise(
    enterpriseId: number,
  ) {
    return dataSources.value.filter(
      item => item.enterpriseId === enterpriseId,
    )
  }

  function getAssessmentsForEnterprise(
    enterpriseId: number,
  ) {
    return assessments.value.filter(
      item => item.enterpriseId === enterpriseId,
    )
  }

  const completedAssessments = computed(() =>
    assessments.value.filter(
      item => item.status === "completed",
    ),
  )

  function getCompletedAssessmentsForEnterprise(
    enterpriseId: number,
  ) {
    return getAssessmentsForEnterprise(enterpriseId).filter(
      item => item.status === "completed",
    )
  }

  function getLatestCompletedAssessment(
    enterpriseId: number,
  ) {
    const completed = getCompletedAssessmentsForEnterprise(
      enterpriseId,
    )

    if (!completed.length)
      return undefined

    return [...completed].sort(
      (a, b) =>
        new Date(b.completedAt ?? b.createdAt).getTime()
        - new Date(a.completedAt ?? a.createdAt).getTime(),
    )[0]
  }

  function getPipeline(assessmentId: number) {
    return pipelines.value[assessmentId] ?? []
  }

  function getEvidence(assessmentId: number) {
    return evidenceByAssessment.value[assessmentId] ?? []
  }

  function getMappings(assessmentId: number) {
    return mappingsByAssessment.value[assessmentId] ?? []
  }

  function getLeafCapabilityAssessments(
    assessmentId: number,
  ) {
    return (
      capabilityAssessmentsByAssessment.value[
        assessmentId
      ] ?? []
    )
  }

  function getAllCapabilityAssessments(
    assessmentId: number,
  ) {
    const leaf = getLeafCapabilityAssessments(
      assessmentId,
    )

    if (!leaf.length)
      return []

    return aggregateParentAssessments(
      mockCapabilities,
      leaf,
    )
  }

  function getRecommendations(assessmentId: number) {
    return (
      recommendationsByAssessment.value[assessmentId]
      ?? []
    )
  }

  function createEnterprise(input: {
    name: string
    description?: string
    industry: string
    country?: string
    businessModel?: string
    companySize?: string
  }) {
    const id = nextEnterpriseId++
    const now = new Date().toISOString()

    const enterprise: Enterprise = {
      id,
      name: input.name,
      description: input.description,
      industry: input.industry,
      country: input.country,
      businessModel: input.businessModel,
      companySize: input.companySize,
      createdAt: now,
      updatedAt: now,
    }

    enterprises.value.unshift(enterprise)

    return enterprise
  }

  function updateEnterprise(
    id: number,
    updates: Partial<Enterprise>,
  ) {
    const index = enterprises.value.findIndex(
      item => item.id === id,
    )

    if (index === -1)
      return

    enterprises.value[index] = {
      ...enterprises.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  }

  function deleteEnterprise(id: number) {
    const assessmentIds = assessments.value
      .filter(item => item.enterpriseId === id)
      .map(item => item.id)

    enterprises.value = enterprises.value.filter(
      item => item.id !== id,
    )
    dataSources.value = dataSources.value.filter(
      item => item.enterpriseId !== id,
    )
    assessments.value = assessments.value.filter(
      item => item.enterpriseId !== id,
    )

    for (const assessmentId of assessmentIds) {
      delete pipelines.value[assessmentId]
      delete evidenceByAssessment.value[assessmentId]
      delete mappingsByAssessment.value[assessmentId]
      delete capabilityAssessmentsByAssessment.value[assessmentId]
      delete recommendationsByAssessment.value[assessmentId]
    }
  }

  function createDataSource(
    enterpriseId: number,
    input: {
      name: string
      type: DataSourceType
      description?: string
      enabled?: boolean
      businessText?: string
      fileName?: string
    },
  ) {
    const id = nextDataSourceId++
    const now = new Date().toISOString()

    const source: DataSource = {
      id,
      enterpriseId,
      name: input.name,
      type: input.type,
      enabled: input.enabled ?? true,
      description: input.description,
      businessText: input.businessText,
      fileName: input.fileName,
      createdAt: now,
      updatedAt: now,
    }

    dataSources.value.push(source)

    return source
  }

  function deleteDataSource(id: number) {
    dataSources.value = dataSources.value.filter(
      item => item.id !== id,
    )
  }

  function toggleDataSource(id: number) {
    const source = dataSources.value.find(
      item => item.id === id,
    )

    if (!source)
      return

    source.enabled = !source.enabled
    source.updatedAt = new Date().toISOString()
  }

  function createAssessment(
    enterpriseId: number,
    input: {
      name: string
      description?: string
      version: string
    },
  ) {
    const id = nextAssessmentId++
    const now = new Date().toISOString()

    const assessment: Assessment = {
      id,
      enterpriseId,
      name: input.name,
      description: input.description,
      version: input.version,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    }

    assessments.value.unshift(assessment)
    pipelines.value[id] = createEmptyPipeline(
      id,
      nextPipelineId,
    )
    nextPipelineId += 6

    return assessment
  }

  function deleteAssessment(id: number) {
    assessments.value = assessments.value.filter(
      item => item.id !== id,
    )
    delete pipelines.value[id]
    delete evidenceByAssessment.value[id]
    delete mappingsByAssessment.value[id]
    delete capabilityAssessmentsByAssessment.value[id]
    delete recommendationsByAssessment.value[id]
  }

  async function runAssessment(assessmentId: number) {
    if (runningAssessmentId.value !== null)
      return

    const assessment = assessments.value.find(
      item => item.id === assessmentId,
    )

    if (!assessment || assessment.status === "running")
      return

    runningAssessmentId.value = assessmentId
    assessment.status = "running"
    assessment.updatedAt = new Date().toISOString()

    const steps = pipelines.value[assessmentId]

    if (!steps)
      return

    for (const step of steps) {
      step.status = "running"
      step.startedAt = new Date().toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit" },
      )
      step.updatedAt = new Date().toISOString()

      await new Promise(resolve =>
        setTimeout(resolve, 1800),
      )

      if (step.step === "extract_evidence") {
        const evidence = getTemplateEvidence(
          assessmentId,
          nextEvidenceId,
        )
        nextEvidenceId += evidence.length
        evidenceByAssessment.value[assessmentId]
          = evidence
      }

      if (step.step === "mapping") {
        const mappings = getTemplateMappings(
          assessmentId,
          nextMappingId,
        )
        nextMappingId += mappings.length
        mappingsByAssessment.value[assessmentId]
          = mappings
      }

      if (step.step === "assessment") {
        const capabilityAssessments =
          getTemplateCapabilityAssessments(
            assessmentId,
            nextCapabilityAssessmentId,
          )
        nextCapabilityAssessmentId
          += capabilityAssessments.length
        capabilityAssessmentsByAssessment.value[
          assessmentId
        ] = capabilityAssessments
      }

      if (step.step === "report") {
        recommendationsByAssessment.value[
          assessmentId
        ] = getTemplateRecommendations(assessmentId)
      }

      step.status = "completed"
      step.completedAt = new Date().toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit" },
      )
      step.updatedAt = new Date().toISOString()
    }

    const leafScores = (
      capabilityAssessmentsByAssessment.value[assessmentId] ?? []
    ).map(item => item.score)

    assessment.status = "completed"
    assessment.overallScore = average(leafScores)
    assessment.completedAt = new Date().toISOString()
    assessment.updatedAt = new Date().toISOString()
    runningAssessmentId.value = null
  }

  function startWizardAssessment(assessmentId: number) {
    const assessment = assessments.value.find(
      item => item.id === assessmentId,
    )

    if (!assessment)
      return

    assessment.status = "running"
    assessment.updatedAt = new Date().toISOString()
  }

  function prepareWizardEvidence(assessmentId: number) {
    const evidence = getTemplateEvidence(
      assessmentId,
      nextEvidenceId,
    )
    nextEvidenceId += evidence.length

    const mappings = getTemplateMappings(
      assessmentId,
      nextMappingId,
    )
    nextMappingId += mappings.length

    evidenceByAssessment.value[assessmentId] = evidence
    mappingsByAssessment.value[assessmentId] = mappings

    const pipeline = pipelines.value[assessmentId]

    if (pipeline) {
      for (const step of pipeline) {
        if (
          step.step === "collect_sources"
          || step.step === "extract_evidence"
          || step.step === "mapping"
        ) {
          step.status = "completed"
          step.completedAt = new Date().toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit" },
          )
        }
      }
    }
  }

  function finalizeWizardAssessment(assessmentId: number) {
    const capabilityAssessments =
      getTemplateCapabilityAssessments(
        assessmentId,
        nextCapabilityAssessmentId,
      )
    nextCapabilityAssessmentId
      += capabilityAssessments.length

    capabilityAssessmentsByAssessment.value[
      assessmentId
    ] = capabilityAssessments

    recommendationsByAssessment.value[
      assessmentId
    ] = getTemplateRecommendations(assessmentId)

    const pipeline = pipelines.value[assessmentId]

    if (pipeline) {
      for (const step of pipeline) {
        step.status = "completed"
        step.completedAt = new Date().toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit" },
        )
      }
    }

    const assessment = assessments.value.find(
      item => item.id === assessmentId,
    )

    if (!assessment)
      return

    const leafScores = capabilityAssessments.map(
      item => item.score,
    )

    assessment.status = "completed"
    assessment.overallScore = average(leafScores)
    assessment.completedAt = new Date().toISOString()
    assessment.updatedAt = new Date().toISOString()
  }

  function updateMappingReview(
    assessmentId: number,
    mappingId: number,
    reviewStatus: MappingReviewStatus,
  ) {
    const mappings =
      mappingsByAssessment.value[assessmentId] ?? []

    const mapping = mappings.find(
      item => item.id === mappingId,
    )

    if (!mapping)
      return

    mapping.reviewStatus = reviewStatus
    mapping.approved = reviewStatus === "approved"
    mapping.updatedAt = new Date().toISOString()
  }

  function updateMappingApproval(
    mappingId: number,
    assessmentId: number,
    approved: boolean,
  ) {
    updateMappingReview(
      assessmentId,
      mappingId,
      approved ? "approved" : "rejected",
    )
  }

  function updateDataSource(
    id: number,
    updates: Partial<DataSource>,
  ) {
    const index = dataSources.value.findIndex(
      item => item.id === id,
    )

    if (index === -1)
      return

    dataSources.value[index] = {
      ...dataSources.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  }

  return {
    enterprises,
    assessments,
    pipelines,
    dataSources,
    capabilities: mockCapabilities,
    evidenceByAssessment,
    mappingsByAssessment,
    capabilityAssessmentsByAssessment,
    recommendationsByAssessment,
    runningAssessmentId,
    completedAssessments,
    getEnterprise,
    getDataSourcesForEnterprise,
    getAssessmentsForEnterprise,
    getCompletedAssessmentsForEnterprise,
    getLatestCompletedAssessment,
    getPipeline,
    getEvidence,
    getMappings,
    getLeafCapabilityAssessments,
    getAllCapabilityAssessments,
    getRecommendations,
    createEnterprise,
    updateEnterprise,
    deleteEnterprise,
    createDataSource,
    deleteDataSource,
    toggleDataSource,
    createAssessment,
    deleteAssessment,
    runAssessment,
    startWizardAssessment,
    prepareWizardEvidence,
    finalizeWizardAssessment,
    updateMappingReview,
    updateMappingApproval,
    updateDataSource,
  }
}
