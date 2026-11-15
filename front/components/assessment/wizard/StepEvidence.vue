<script setup lang="ts">
// Evidence & mapping review step where the user approves/rejects AI-generated capability mappings.
import type {
  Capability,
  CapabilityEvidenceMapping,
  Evidence,
  MappingReviewStatus,
} from "~/types"
import { getLeafCapabilities } from "~/utils/capability"
import { formatConfidence } from "~/utils/maturity"

const props = defineProps<{
  capabilities: Capability[]
  evidence: Evidence[]
  mappings: CapabilityEvidenceMapping[]
  loading?: boolean
  readOnly?: boolean
}>()

const emit = defineEmits<{
  review: [mappingId: number, status: MappingReviewStatus]
  continue: []
  back: []
}>()

const leafCapabilities = computed(() =>
  getLeafCapabilities(props.capabilities),
)

const mappedCapabilityIds = computed(() =>
  new Set(props.mappings.map(m => m.capabilityId)),
)

const unmappedLeaves = computed(() =>
  leafCapabilities.value.filter(
    leaf => !mappedCapabilityIds.value.has(leaf.id),
  ),
)

const evidenceMap = computed(() => {
  const map = new Map<number, Evidence>()

  for (const item of props.evidence)
    map.set(item.id, item)

  return map
})

const capabilityMap = computed(() => {
  const map = new Map<number, Capability>()

  for (const item of props.capabilities)
    map.set(item.id, item)

  return map
})

const groupedMappings = computed(() => {
  const groups = new Map<number, CapabilityEvidenceMapping[]>()

  for (const mapping of props.mappings) {
    const list = groups.get(mapping.capabilityId) ?? []
    list.push(mapping)
    groups.set(mapping.capabilityId, list)
  }

  return Array.from(groups.entries()).map(([capabilityId, items]) => ({
    capabilityId,
    capabilityName:
      capabilityMap.value.get(capabilityId)?.name
      ?? `Capability #${capabilityId}`,
    mappings: items,
  }))
})

const pendingCount = computed(() =>
  props.mappings.filter(
    m => !m.reviewStatus || m.reviewStatus === "pending",
  ).length,
)

const canContinue = computed(() =>
  pendingCount.value === 0 && !props.loading,
)

function statusLabel(status?: MappingReviewStatus) {
  switch (status) {
    case "approved": return "Approved"
    case "rejected": return "Excluded"
    case "irrelevant": return "Not Related"
    default: return "Pending"
  }
}

function statusVariant(status?: MappingReviewStatus) {
  switch (status) {
    case "approved": return "success"
    case "rejected": return "danger"
    case "irrelevant": return "warning"
    default: return "neutral"
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20"
    >
      <div class="relative">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <Icon
          name="lucide:sparkles"
          class="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-blue-600"
        />
      </div>
      <h3 class="mt-6 text-lg font-semibold text-slate-900">
        Extracting Evidence
      </h3>
      <p class="mt-2 text-sm text-slate-500">
        AI is analyzing data sources and mapping evidence to capabilities...
      </p>
    </div>

    <template v-else>
      <!-- Summary stats -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ evidence.length }}
          </div>
          <div class="mt-1 text-xs text-slate-500">
            Evidence Items
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ mappings.length }}
          </div>
          <div class="mt-1 text-xs text-slate-500">
            AI Mappings
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <div class="text-2xl font-bold text-amber-600">
            {{ pendingCount }}
          </div>
          <div class="mt-1 text-xs text-slate-500">
            Pending Review
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <div class="text-2xl font-bold text-red-500">
            {{ unmappedLeaves.length }}
          </div>
          <div class="mt-1 text-xs text-slate-500">
            No Evidence Found
          </div>
        </div>
      </div>

      <!-- Unmapped leaf capabilities -->
      <div
        v-if="unmappedLeaves.length"
        class="rounded-xl border border-red-200 bg-red-50/50 p-5"
      >
        <div class="flex items-start gap-3">
          <Icon name="lucide:alert-triangle" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <h3 class="font-semibold text-red-800">
              Capabilities Without Evidence
            </h3>
            <p class="mt-1 text-sm text-red-700">
              AI could not find any evidence for these leaf capabilities from the connected data sources.
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="leaf in unmappedLeaves"
                :key="leaf.id"
                class="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-red-400" />
                {{ leaf.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Grouped mappings -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-900">
          Evidence & Capability Mappings
        </h3>

        <div
          v-for="group in groupedMappings"
          :key="group.capabilityId"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div class="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <div class="flex items-center gap-2">
              <Icon name="lucide:target" class="h-4 w-4 text-blue-600" />
              <h4 class="font-semibold text-slate-900">
                {{ group.capabilityName }}
              </h4>
              <UiBadge variant="primary">
                {{ group.mappings.length }} mappings
              </UiBadge>
            </div>
          </div>

          <div class="divide-y divide-slate-100">
            <div
              v-for="mapping in group.mappings"
              :key="mapping.id"
              class="p-5 transition"
              :class="{
                'bg-green-50/30': mapping.reviewStatus === 'approved',
                'bg-red-50/30': mapping.reviewStatus === 'rejected',
                'bg-amber-50/30': mapping.reviewStatus === 'irrelevant',
              }"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex-1 space-y-3">
                  <!-- Evidence -->
                  <div class="flex items-start gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Icon name="lucide:file-search" class="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Evidence
                      </p>
                      <p class="font-semibold text-slate-900">
                        {{ evidenceMap.get(mapping.evidenceId)?.title ?? `Evidence #${mapping.evidenceId}` }}
                      </p>
                      <p
                        class="mt-1 text-sm text-slate-600"
                        dir="auto"
                      >
                        {{ evidenceMap.get(mapping.evidenceId)?.content }}
                      </p>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <div class="flex items-center gap-2 pl-12 text-slate-300">
                    <Icon name="lucide:arrow-down" class="h-4 w-4" />
                    <span class="text-xs font-medium text-blue-500">
                      AI mapped with {{ formatConfidence(mapping.confidence) }} confidence
                    </span>
                  </div>

                  <!-- Reasoning -->
                  <div class="rounded-xl bg-slate-50 p-4 pl-5">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      AI Reasoning
                    </p>
                    <p class="mt-1 text-sm leading-6 text-slate-700">
                      {{ mapping.reasoning }}
                    </p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex shrink-0 flex-col gap-2 lg:w-44">
                  <UiBadge
                    :variant="statusVariant(mapping.reviewStatus)"
                  >
                    {{ statusLabel(mapping.reviewStatus) }}
                  </UiBadge>

                  <UiButton
                    v-if="!readOnly"
                    variant="outline"
                    :class="mapping.reviewStatus === 'approved' ? 'border-green-500 bg-green-50 text-green-700' : ''"
                    @click="emit('review', mapping.id, 'approved')"
                  >
                    <Icon name="lucide:check" class="h-4 w-4" />
                    Approve
                  </UiButton>

                  <UiButton
                    v-if="!readOnly"
                    variant="ghost"
                    :class="mapping.reviewStatus === 'rejected' ? 'bg-red-50 text-red-700' : ''"
                    @click="emit('review', mapping.id, 'rejected')"
                  >
                    <Icon name="lucide:ban" class="h-4 w-4" />
                    Don't Consider
                  </UiButton>

                  <UiButton
                    v-if="!readOnly"
                    variant="ghost"
                    :class="mapping.reviewStatus === 'irrelevant' ? 'bg-amber-50 text-amber-700' : ''"
                    @click="emit('review', mapping.id, 'irrelevant')"
                  >
                    <Icon name="lucide:link-2-off" class="h-4 w-4" />
                    Not Related
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div v-if="!readOnly" class="flex items-center justify-between border-t border-slate-100 pt-6">
        <UiButton
          variant="ghost"
          @click="emit('back')"
        >
          <Icon name="lucide:arrow-left" class="h-4 w-4" />
          Back
        </UiButton>

        <div class="flex items-center gap-3">
          <p
            v-if="pendingCount > 0"
            class="text-sm text-amber-600"
          >
            {{ pendingCount }} mapping(s) need review
          </p>

          <UiButton
            :disabled="!canContinue"
            @click="emit('continue')"
          >
            Continue to AI Analysis
            <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </UiButton>
        </div>
      </div>
    </template>
  </div>
</template>
