<script setup lang="ts">
// Chronological timeline of an enterprise's completed assessment scores.
import type { Assessment } from "~/types"
import { formatScore } from "~/utils/maturity"
import { formatDate } from "~/utils/date"

const props = defineProps<{
  assessments: Assessment[]
}>()

const completed = computed(() =>
  [...props.assessments]
    .filter(item => item.status === "completed" && item.overallScore !== undefined && item.overallScore !== null)
    .sort(
      (a, b) =>
        new Date(a.completedAt ?? a.createdAt).getTime()
        - new Date(b.completedAt ?? b.createdAt).getTime(),
    ),
)

const maxScore = 5
</script>

<template>
  <AppCard
    title="Assessment Timeline"
    description="Historical maturity scores across completed assessments."
  >
    <div
      v-if="!completed.length"
      class="py-8 text-center text-sm text-slate-500"
    >
      No completed assessments yet.
    </div>

    <div
      v-else
      class="relative"
    >
      <div class="absolute left-4 top-0 h-full w-px bg-slate-200" />

      <div class="space-y-8">
        <div
          v-for="(item, index) in completed"
          :key="item.id"
          class="relative flex gap-6 pl-10"
        >
          <div
            class="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow"
          />

          <div class="flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 class="font-semibold text-slate-900">
                  {{ item.name }}
                </h4>
                <p class="text-xs text-slate-500">
                  v{{ item.version }}
                  ·
                  {{ formatDate(item.completedAt ?? item.createdAt) }}
                </p>
              </div>

              <span class="text-lg font-bold text-blue-600">
                {{ formatScore(item.overallScore) }}
              </span>
            </div>

            <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full bg-blue-500 transition-all"
                :style="{
                  width: `${((item.overallScore ?? 0) / maxScore) * 100}%`,
                }"
              />
            </div>

            <p
              v-if="index > 0 && completed[index - 1]?.overallScore != null"
              class="mt-2 text-xs"
              :class="(item.overallScore ?? 0) > (completed[index - 1].overallScore ?? 0)
                ? 'text-green-600'
                : (item.overallScore ?? 0) < (completed[index - 1].overallScore ?? 0)
                  ? 'text-red-600'
                  : 'text-slate-500'"
            >
              {{
                (item.overallScore ?? 0) > (completed[index - 1].overallScore ?? 0)
                  ? "↑ Improved"
                  : (item.overallScore ?? 0) < (completed[index - 1].overallScore ?? 0)
                    ? "↓ Declined"
                    : "→ No change"
              }}
              from previous
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>
