<script setup lang="ts">
import { validRouteId } from '~/services/api'
const route=useRoute();const api=useApi();const demo=useAppMode()
const enterpriseId=computed(()=>Number(route.params.id))
const {data,pending,error,refresh}=await useAsyncData(()=>`enterprise-reports-v2-${route.params.id}`,async()=>{
  if(!validRouteId(route.params.id))throw createError({statusCode:404,statusMessage:'Enterprise not found'})
  const [enterprise,assessments]=await Promise.all([api.getEnterprise(enterpriseId.value),api.listAssessments(enterpriseId.value,1,100)])
  return {enterprise:enterprise.data,reports:assessments.data.filter(a=>a.status==='completed')}
},{watch:[enterpriseId]})
</script>
<template>
  <div v-if="pending" class="p-8 text-slate-500">Loading reports...</div>
  <div v-else-if="error" role="alert" class="p-8 text-red-700">Unable to load reports. <button class="underline" @click="refresh()">Retry</button></div>
  <div v-else class="space-y-6">
    <EnterpriseTabs />
    <h2 class="text-xl font-semibold">Assessment Reports</h2>
    <p v-if="demo" class="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">Demo — تمام خروجی‌های تحلیلی نمونه هستند و هنوز توسط LLM واقعی تولید نشده‌اند.</p>
    <div v-for="item in data?.reports ?? []" :key="item.id" class="flex items-center justify-between rounded-xl border bg-white p-5">
      <div><h3 class="font-semibold">{{ item.name }}</h3><p class="text-sm text-slate-500">Completed · v{{ item.version }}</p></div>
      <NuxtLink :to="`/enterprise/${enterpriseId}/assessments/${item.id}/report`" class="text-blue-700 underline">Open Report</NuxtLink>
    </div>
    <UiEmptyState v-if="!data?.reports.length" title="No reports available" description="No completed assessment for this enterprise." icon="lucide:file-x" />
  </div>
</template>
