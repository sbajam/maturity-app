<script setup lang="ts">
// First wizard step reviewing the capability framework, data sources, and business context before running an assessment.
import type { Capability, DataSource } from "~/types"
import { buildCapabilityTree } from "~/utils/capability"
import { getDataSourceLabel } from "~/utils/data-source"
import { getEnabledLabel, getEnabledVariant } from "~/utils/status"

const props = defineProps<{
  capabilities: Capability[]
  dataSources: DataSource[]
  readOnly?: boolean
}>()

const emit = defineEmits<{
  continue: []
}>()

const capabilityTree = computed(() =>
  buildCapabilityTree(props.capabilities),
)

const enabledSources = computed(() =>
  props.dataSources.filter(item => item.enabled),
)

const businessSources = computed(() =>
  props.dataSources.filter(
    item => item.type === "business_document",
  ),
)
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4">
      <div class="flex items-start gap-3">
        <Icon name="lucide:info" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <p class="text-sm leading-6 text-blue-800">
          Review the capability framework, connected data sources, and business context below.
          Confirm everything looks correct before proceeding to evidence extraction.
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <AppCard
        title="Capability Framework"
        description="Capabilities that will be assessed."
      >
        <div class="max-h-80 space-y-1 overflow-y-auto">
          <AssessmentWizardCapabilityNode
            v-for="root in capabilityTree"
            :key="root.id"
            :node="root"
            :depth="0"
          />
        </div>

        <p class="mt-4 text-xs text-slate-500">
          {{ capabilities.length }} capabilities in framework
        </p>
      </AppCard>

      <AppCard
        title="Connected Data Sources"
        description="Sources used for evidence extraction."
      >
        <div class="space-y-3">
          <div
            v-for="source in dataSources"
            :key="source.id"
            class="rounded-xl border p-4 transition"
            :class="source.enabled
              ? 'border-green-200 bg-green-50/30'
              : 'border-slate-100 bg-slate-50 opacity-60'"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg"
                  :class="source.enabled ? 'bg-green-100' : 'bg-slate-200'"
                >
                  <Icon
                    name="lucide:database"
                    class="h-4 w-4"
                    :class="source.enabled ? 'text-green-600' : 'text-slate-400'"
                  />
                </div>
                <div>
                  <p class="font-medium text-slate-900">
                    {{ source.name }}
                  </p>
                  <p class="text-xs text-slate-500">
                    {{ getDataSourceLabel(source.type) }}
                  </p>
                </div>
              </div>
              <UiBadge :variant="getEnabledVariant(source.enabled)">
                {{ getEnabledLabel(source.enabled) }}
              </UiBadge>
            </div>
          </div>
        </div>

        <p class="mt-4 text-xs text-slate-500">
          {{ enabledSources.length }} of {{ dataSources.length }} sources enabled
        </p>
      </AppCard>
    </div>

    <AppCard
      v-if="businessSources.length"
      title="Business Documentation"
      description="Business rules and context for AI understanding."
    >
      <div class="space-y-4">
        <div
          v-for="source in businessSources"
          :key="source.id"
          class="rounded-xl border border-amber-100 bg-amber-50/30 p-5"
        >
          <div class="flex items-center gap-2">
            <Icon name="lucide:file-text" class="h-4 w-4 text-amber-600" />
            <h4 class="font-semibold text-slate-900">
              {{ source.name }}
            </h4>
            <UiBadge
              v-if="source.fileName"
              variant="neutral"
            >
              {{ source.fileName }}
            </UiBadge>
          </div>

          <p
            v-if="source.businessText"
            class="mt-3 text-sm leading-7 text-slate-700"
            dir="auto"
          >
            {{ source.businessText }}
          </p>

          <p
            v-else
            class="mt-3 text-sm italic text-slate-400"
          >
            No business context provided.
          </p>
        </div>
      </div>
    </AppCard>

    <div
      v-else
      class="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500"
    >
      No business documentation configured.
    </div>

    <div class="flex justify-end border-t border-slate-100 pt-6">
      <UiButton v-if="!readOnly" @click="emit('continue')">
        Confirm & Continue
        <Icon name="lucide:arrow-right" class="h-4 w-4" />
      </UiButton>
    </div>
  </div>
</template>
