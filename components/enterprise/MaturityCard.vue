<script setup lang="ts">
// Card displaying the enterprise's overall maturity score on a 1-5 Likert scale.
import { formatScore } from "~/utils/maturity"

defineProps<{
  score: number
}>()
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-6 py-5">
      <h2 class="text-lg font-semibold text-slate-900">
        Overall Maturity
      </h2>
    </div>

    <div class="flex flex-col items-center justify-center p-8">
      <div class="text-5xl font-bold text-blue-600">
        {{ formatScore(score) }}
      </div>

      <p class="mt-3 text-sm text-slate-500">
        Likert scale (1-5)
      </p>
    </div>
  </section>
</template>
