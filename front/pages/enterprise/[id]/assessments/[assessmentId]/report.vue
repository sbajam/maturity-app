<script setup lang="ts">
// Full original report layout, now loaded from persisted Assessment + Evidence + Mapping + Leaf scores.
import { validRouteId } from '~/services/api'
import { presentDossier, presentEnterprise } from '~/utils/dossier-view'
const route=useRoute();const api=useApi()
const enterpriseId=computed(()=>Number(route.params.id));const assessmentId=computed(()=>Number(route.params.assessmentId))
const {data,pending,error,refresh}=await useAsyncData(()=>`report-v2-${route.params.id}-${route.params.assessmentId}`,
  async()=>{
    if(!validRouteId(route.params.id)||!validRouteId(route.params.assessmentId)) throw createError({statusCode:404,statusMessage:'Invalid ID'})
    const [d,e,assessments]=await Promise.all([api.getDossier(enterpriseId.value,assessmentId.value),api.getEnterprise(enterpriseId.value),api.listAssessments(enterpriseId.value,1,100)])
    return {dossier:d.data,enterprise:e.data,assessments:assessments.data}
  },{watch:[enterpriseId,assessmentId]})
const view=computed(()=>data.value?presentDossier(data.value.dossier):null)
const enterprise=computed(()=>data.value?presentEnterprise(data.value.enterprise):null)
const history=computed(()=>data.value?.assessments.map(a=>({
  ...a,description:a.description??undefined,overallScore:a.overallScore??undefined,completedAt:a.completedAt??undefined
}))??[])
function printPage(){if(import.meta.client)window.print()}
</script>

<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading report...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">Failed to load report. <button class="underline" @click="refresh()">Retry</button></div>
  <div v-else-if="view && enterprise && view.assessment.status==='completed'" class="space-y-6">
    <p v-if="data?.dossier.analysisMode==='simulated'" class="rounded-lg bg-amber-100 p-3 text-sm font-semibold text-amber-900" role="status">Demo — گزارش و امتیازهای شبیه‌سازی‌شده؛ فاقد تحلیل واقعی LLM و اعتبارسنجی علمی.</p>
    <EnterpriseHeader :enterprise="enterprise" />
    <EnterpriseTabs />
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink :to="`/enterprise/${enterpriseId}/assessments/${assessmentId}`" class="mb-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><Icon name="lucide:arrow-left" class="h-4 w-4" />Back to Assessment</NuxtLink>
        <h1 class="text-2xl font-bold text-slate-900">Assessment Report</h1>
        <p class="mt-1 text-sm text-slate-500">{{ view.assessment.name }} · v{{ view.assessment.version }}</p>
      </div>
      <UiButton variant="outline" @click="printPage"><Icon name="lucide:printer" class="h-4 w-4" />Print</UiButton>
    </div>
    <AssessmentCard :assessment="view.assessment" />
    <p v-if="view.capabilityAssessments.some(c=>c.score===null)" class="rounded-lg bg-orange-50 p-3 text-sm text-orange-900">ارزیابی ناقص: نبود Evidence معتبر باعث می‌شود امتیاز همان Leaf و والدهایش محاسبه نشود؛ امتیاز صفر نیست.</p>
    <AssessmentPipelineCard :pipeline="view.pipeline" :evidence="view.evidence" :mappings="view.mappings" />
    <AssessmentTimeline :assessments="history" />
    <AssessmentResults :capabilities="view.capabilities" :assessments="view.capabilityAssessments" :mappings="view.mappings" :evidence="view.evidence" :recommendations="view.recommendations" />
  </div>
  <div v-else class="space-y-4"><UiEmptyState title="Report not available" description="Complete the assessment first." /><NuxtLink :to="`/enterprise/${enterpriseId}/assessments/${assessmentId}`" class="text-blue-700 underline">Back to assessment</NuxtLink></div>
</template>
