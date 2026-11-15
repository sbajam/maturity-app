import type { ApiDossier } from '~/services/api'
import type { Assessment, Capability, DataSource, Enterprise, Evidence, CapabilityEvidenceMapping, CapabilityAssessment, AssessmentPipeline } from '~/types'

// Adapt the server's versioned domain DTO to the existing presentation components.
// This does NOT synthesize evidence or run the historical in-memory mock store.
export function presentDossier(d:ApiDossier) {
  const assessment:Assessment = {
    ...d.assessment,
    description:d.assessment.description??undefined,
    overallScore:d.assessment.overallScore??undefined,
    completedAt:d.assessment.completedAt??undefined,
  }
  const capabilities:Capability[]=d.capabilities.map(c=>({...c,description:c.description??undefined,createdAt:'',updatedAt:''}))
  const sources:DataSource[]=d.sources.map(s=>({...s,description:s.description??undefined,businessText:s.businessText??undefined}))
  const evidence:Evidence[]=d.evidences.map(e=>({
    id:e.id,assessmentId:e.assessmentId,dataSourceId:e.dataSourceId,title:e.title,content:e.content,
    context:e.context as Evidence['context'],metadata:e.metadata as Evidence['metadata'],
    createdAt:e.createdAt,updatedAt:e.updatedAt,
  }))
  const mappings:CapabilityEvidenceMapping[]=d.mappings.map(m=>({...m}))
  const capabilityAssessments:CapabilityAssessment[]=d.capabilityAssessments.map(s=>({...s}))
  const pipeline:AssessmentPipeline[]=d.pipeline.map(p=>({
    ...p,startedAt:p.startedAt??undefined,completedAt:p.completedAt??undefined,
  }))
  const recommendations=d.report?.recommendations??[]
  return {assessment,capabilities,sources,evidence,mappings,capabilityAssessments,pipeline,recommendations}
}
export function presentEnterprise(e:{id:number;name:string;industry:string;description:string|null;country:string|null;businessModel:string|null;companySize:string|null;createdAt:string;updatedAt:string}):Enterprise {
  return {...e,description:e.description??undefined,country:e.country??undefined,businessModel:e.businessModel??undefined,companySize:e.companySize??undefined}
}
