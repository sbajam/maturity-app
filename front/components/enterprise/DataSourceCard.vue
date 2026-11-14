<script setup lang="ts">
// Card listing an enterprise's connected data sources with enabled/disabled counts.
import { getEnabledLabel, getEnabledVariant } from "~/utils/status"
import { getDataSourceLabel } from "~/utils/data-source"
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

const businessSources = computed(() =>
  props.sources.filter(
    source => source.type === "business_document",
  ),
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
          <div
            v-for="source in sources"
            :key="source.id"
            class="rounded-xl border border-slate-100 px-4 py-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon name="lucide:database-zap" size="18" class="text-blue-600" />

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

            <p
              v-if="source.type === 'business_document' && source.businessText"
              class="mt-2 line-clamp-2 text-xs leading-5 text-slate-600"
              dir="auto"
            >
              {{ source.businessText }}
            </p>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500"
        >
          No data sources configured.
        </div>
      </div>
    </template>
  </AppCard>
</template>
