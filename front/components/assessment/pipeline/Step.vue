<script setup lang="ts">
// Single pipeline step with status icon, timestamps, and expandable evidence/mapping details.
import type {
  AssessmentPipeline,
  Evidence,
  CapabilityEvidenceMapping,
} from "~/types"
import { formatConfidence } from "~/utils/maturity"

const props = defineProps<{
  step: AssessmentPipeline
  isLast?: boolean
  evidence?: Evidence[]
  mappings?: CapabilityEvidenceMapping[]
}>()

const emit = defineEmits<{
  mappingApproval: [mappingId: number, approved: boolean]
}>()

const expanded = ref(false)

const icon = computed(() => {
  switch (props.step.status) {
    case "completed":
      return "fa6-solid:check"
    case "running":
      return "fa6-solid:spinner"
    case "failed":
      return "fa6-solid:x"
    default:
      return "mdi:clock-outline"
  }
})

const iconClass = computed(() => {
  switch (props.step.status) {
    case "completed":
      return "bg-green-500 text-white"
    case "running":
      return "bg-blue-500 text-white"
    case "failed":
      return "bg-red-500 text-white"
    default:
      return "border-2 border-slate-300 bg-white text-slate-400"
  }
})

const hasDetails = computed(() => {
  if (props.step.status !== "completed")
    return false

  return (
    (props.step.step === "extract_evidence"
      && (props.evidence?.length ?? 0) > 0)
    || (props.step.step === "mapping"
      && (props.mappings?.length ?? 0) > 0)
  )
})

const subSteps = computed(() => {
  if (props.step.step === "mapping")
    return [
      "Analyzing evidence patterns",
      "Matching to capability tree",
      "Calculating confidence scores",
    ]

  if (props.step.step === "assessment")
    return [
      "Evaluating leaf capabilities",
      "Generating maturity scores",
      "Writing AI reasoning",
    ]

  return []
})

function toggleExpanded() {
  if (hasDetails.value)
    expanded.value = !expanded.value
}
</script>

<template>
  <div>
    <div class="relative flex gap-5 pb-8">
      <div class="flex w-12 flex-col items-center">
        <div
          :class="iconClass"
          class="flex h-11 w-11 items-center justify-center rounded-full shadow-sm"
        >
          <Icon
            :name="icon"
            class="h-5 w-5"
            :class="{
              'animate-spin': step.status === 'running',
            }"
          />
        </div>

        <div
          v-if="!isLast"
          class="mt-2 h-full w-px bg-slate-200"
        />
      </div>

      <div
        class="flex-1 rounded-xl border border-slate-200 transition"
        :class="{
          'hover:border-blue-300 hover:shadow-sm': hasDetails,
          'border-blue-300 shadow-sm': expanded,
        }"
      >
        <div
          class="px-4 py-3"
          :class="{ 'cursor-pointer': hasDetails }"
          @click="toggleExpanded"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-semibold text-slate-900">
                {{ getPipelineStepLabel(step.step) }}
              </h3>

              <p class="mt-1 text-sm leading-6 text-slate-500">
                {{ getPipelineStepDescription(step.step) }}
              </p>

              <div
                v-if="step.status === 'running' && subSteps.length"
                class="mt-3 space-y-1"
              >
                <div
                  v-for="(sub, index) in subSteps"
                  :key="sub"
                  class="flex items-center gap-2 text-xs text-blue-600"
                >
                  <Icon
                    name="lucide:loader-circle"
                    class="h-3 w-3 animate-spin"
                    :style="{ animationDelay: `${index * 300}ms` }"
                  />
                  {{ sub }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <UiBadge
                :variant="getPipelineStatusVariant(step.status)"
              >
                {{ getPipelineStatusLabel(step.status) }}
              </UiBadge>

              <Icon
                v-if="hasDetails"
                :name="expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                class="h-4 w-4 text-slate-400"
              />
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
            <div>
              <span class="font-medium text-slate-700">
                Started
              </span>
              <div class="mt-1">
                {{ step.startedAt ?? "—" }}
              </div>
            </div>

            <div>
              <span class="font-medium text-slate-700">
                Finished
              </span>
              <div class="mt-1">
                {{ step.completedAt ?? "—" }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="expanded && step.step === 'extract_evidence'"
          class="border-t border-slate-100 px-4 py-4"
        >
          <h4 class="mb-3 text-sm font-semibold text-slate-800">
            Extracted Evidence ({{ evidence?.length ?? 0 }})
          </h4>

          <div class="space-y-2">
            <div
              v-for="item in evidence"
              :key="item.id"
              class="rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <div class="font-medium text-slate-900">
                {{ item.title }}
              </div>
              <div
                class="mt-0.5 text-slate-600"
                dir="auto"
              >
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="expanded && step.step === 'mapping'"
          class="border-t border-slate-100 px-4 py-4"
        >
          <h4 class="mb-3 text-sm font-semibold text-slate-800">
            AI Capability Mapping
          </h4>

          <div class="space-y-3">
            <div
              v-for="mapping in mappings"
              :key="mapping.id"
              class="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="text-sm">
                  <span class="font-medium text-slate-900">
                    Evidence #{{ mapping.evidenceId }}
                  </span>
                  <span class="text-slate-400"> → </span>
                  <span class="font-medium text-blue-600">
                    Capability #{{ mapping.capabilityId }}
                  </span>
                </div>

                <span class="shrink-0 text-xs font-medium text-green-600">
                  {{ formatConfidence(mapping.confidence) }}
                </span>
              </div>

              <p class="mt-2 text-xs leading-5 text-slate-600">
                {{ mapping.reasoning }}
              </p>

              <div class="mt-2 flex gap-2">
                <UiButton
                  variant="outline"
                  :class="mapping.approved === true ? 'border-green-500 text-green-700' : ''"
                  @click.stop="emit('mappingApproval', mapping.id, true)"
                >
                  Approve
                </UiButton>

                <UiButton
                  variant="ghost"
                  :class="mapping.approved === false ? 'text-red-600' : ''"
                  @click.stop="emit('mappingApproval', mapping.id, false)"
                >
                  Reject
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
