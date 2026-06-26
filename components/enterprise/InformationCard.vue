<script setup lang="ts">
import { formatDate } from "~/utils/date"
import type { Enterprise } from "~/types"

defineProps<{
    enterprise: Enterprise
}>()

</script>

<template>
    <AppCard title="Enterprise Information" description="General information about the organization.">
        <div class="space-y-5">

            <AppDescriptionItem label="Company Name" icon="lucide:building-2">
                {{ enterprise.name }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Industry" icon="lucide:briefcase-business">
                {{ enterprise.industry }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Country" icon="lucide:map-pinned">
                {{ enterprise.country || "-" }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Business Model" icon="lucide:chart-network">
                {{ enterprise.businessModel || "-" }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Company Size" icon="lucide:users">
                {{ enterprise.companySize || "-" }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Created At" icon="lucide:calendar-plus">
                {{ formatDate(enterprise.createdAt) }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Updated At" icon="lucide:calendar-clock">
                {{ formatDate(enterprise.updatedAt) }}
            </AppDescriptionItem>

        </div>

        <template v-if="enterprise.description" #footer>
            <div class="border-t border-slate-100 px-6 py-5">
                <h3 class="mb-2 text-sm font-semibold text-slate-900">
                    Description
                </h3>

                <p class="break-words whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {{ enterprise.description }}
                </p>
            </div>
        </template>
    </AppCard>
</template>