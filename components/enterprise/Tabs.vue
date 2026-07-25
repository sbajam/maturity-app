<script setup lang="ts">
// Tab navigation between an enterprise's overview, data sources, assessments, and reports pages.
const route = useRoute()

const enterpriseId = computed(() => route.params.id)

const tabs = computed(() => [
  {
    label: "Overview",
    to: `/enterprise/${enterpriseId.value}`,
    exact: true,
  },
  {
    label: "Data Sources",
    to: `/enterprise/${enterpriseId.value}/data-sources`,
  },
  {
    label: "Assessments",
    to: `/enterprise/${enterpriseId.value}/assessments`,
  },
  {
    label: "Reports",
    to: `/enterprise/${enterpriseId.value}/reports`,
  },
])

function isActive(tab: { to: string, exact?: boolean }) {
  if (tab.exact)
    return route.path === tab.to

  return route.path === tab.to
    || route.path.startsWith(`${tab.to}/`)
}
</script>

<template>
  <nav class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <ul class="flex min-w-max">
      <li v-for="tab in tabs" :key="tab.to">
        <NuxtLink
          :to="tab.to"
          class="inline-flex h-14 items-center border-b-2 border-transparent px-6 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          :class="{
            '!border-blue-600 !text-blue-600': isActive(tab),
          }"
        >
          {{ tab.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
