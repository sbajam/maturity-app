<script setup lang="ts">
import { getEnabledLabel, getEnabledVariant } from "~/utils/status";
import type { DataSource } from "~/types"

const props = defineProps<{
  sources: DataSource[]
}>()

const enabledSources = computed(() =>
  props.sources.filter(source => source.enabled),
)

const disabledSources = computed(() =>
  props.sources.filter(source => !source.enabled),
)
</script>

<template>
  <AppCard title="Connected Data Sources" description="Available data sources configured for this enterprise.">
    <div class="space-y-5">

      <AppDescriptionItem label="Total Sources" icon="lucide:database">
        {{ sources.length }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Enabled" icon="lucide:circle-check-big">
        {{ enabledSources.length }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Disabled" icon="lucide:circle-x">
        {{ disabledSources.length }}
      </AppDescriptionItem>

    </div>

    <template #footer>

      <div class="border-t border-slate-100 px-6 py-5">

        <h3 class="mb-4 text-sm font-semibold text-slate-900">
          Source List
        </h3>

        <div v-if="sources.length" class="space-y-2">

          <div v-for="source in sources" :key="source.id"
            class="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">

            <div class="flex items-center gap-3">

              <Icon name="lucide:database-zap" size="18" class="text-blue-600" />

              <div>

                <p class="font-medium text-slate-900">
                  {{ source.name }}
                </p>

                <p class="text-xs text-slate-500">
                  {{ source.type }}
                </p>

              </div>

            </div>
            <UiAppBadge :variant="getEnabledVariant(source.enabled)">
              {{ getEnabledLabel(source.enabled) }}
            </UiAppBadge>

          </div>

        </div>

        <div v-else class="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
          No data sources configured.
        </div>

      </div>

    </template>

  </AppCard>
</template>