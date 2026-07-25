<script setup lang="ts">
// Wizard header showing pipeline progress and the 4-step indicator bar.
import type { WizardStep } from "~/types"
import {
  WIZARD_STEPS,
  getWizardProgress,
  getWizardStepIndex,
} from "~/utils/wizard"

const props = defineProps<{
  currentStep: WizardStep
  assessmentName: string
}>()

const progress = computed(() =>
  getWizardProgress(props.currentStep),
)

const currentIndex = computed(() =>
  getWizardStepIndex(props.currentStep),
)

function stepState(index: number) {
  if (index < currentIndex.value)
    return "completed"

  if (index === currentIndex.value)
    return "current"

  return "upcoming"
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <!-- Header -->
    <div class="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Assessment Pipeline
          </p>
          <h1 class="mt-1 text-xl font-bold text-slate-900">
            {{ assessmentName }}
          </h1>
        </div>

        <div class="text-right">
          <div class="text-2xl font-bold text-blue-600">
            {{ progress }}%
          </div>
          <div class="text-xs text-slate-500">
            Step {{ currentIndex + 1 }} of {{ WIZARD_STEPS.length }}
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Steps -->
    <div class="grid grid-cols-2 gap-0 divide-x divide-slate-100 md:grid-cols-4">
      <div
        v-for="(step, index) in WIZARD_STEPS"
        :key="step.id"
        class="relative px-4 py-5 transition-colors"
        :class="{
          'bg-blue-50/60': stepState(index) === 'current',
          'bg-green-50/40': stepState(index) === 'completed',
        }"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all"
            :class="{
              'bg-green-500 text-white shadow-md shadow-green-200': stepState(index) === 'completed',
              'bg-blue-600 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100': stepState(index) === 'current',
              'bg-slate-100 text-slate-400': stepState(index) === 'upcoming',
            }"
          >
            <Icon
              v-if="stepState(index) === 'completed'"
              name="lucide:check"
              class="h-4 w-4"
            />
            <span v-else>{{ index + 1 }}</span>
          </div>

          <div class="min-w-0">
            <p
              class="text-sm font-semibold leading-tight"
              :class="{
                'text-blue-700': stepState(index) === 'current',
                'text-green-700': stepState(index) === 'completed',
                'text-slate-400': stepState(index) === 'upcoming',
              }"
            >
              {{ step.label }}
            </p>
            <p
              class="mt-0.5 hidden text-xs leading-4 text-slate-500 sm:block"
              :class="{
                'text-slate-600': stepState(index) !== 'upcoming',
              }"
            >
              {{ step.description }}
            </p>
          </div>
        </div>

        <div
          v-if="stepState(index) === 'current'"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        />
      </div>
    </div>
  </div>
</template>
