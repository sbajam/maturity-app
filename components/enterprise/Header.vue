<script setup lang="ts">
// Enterprise page header with logo, metadata, and edit/new-assessment actions.
import type { Enterprise } from "~/types"
import { formatDate } from "~/utils/date"

defineProps<{
    enterprise: Enterprise
}>()

const emit = defineEmits<{
    edit: []
    newAssessment: []
}>()
</script>

<template>
    <div
        class="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex items-start gap-5">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <img v-if="enterprise.logo" :src="enterprise.logo" :alt="enterprise.name"
                    class="h-full w-full rounded-2xl object-cover">

                <Icon v-else name="lucide:building-2" size="30" class="text-blue-600" />
            </div>

            <div class="min-w-0">

                <h1 class="truncate text-2xl font-bold text-slate-900">
                    {{ enterprise.name }}
                </h1>

                <p v-if="enterprise.description"
                    class="mt-2 max-w-3xl break-words whitespace-pre-wrap text-sm leading-6 text-slate-600"
                    dir="auto">
                    {{ enterprise.description }}
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {{ enterprise.industry }}
                    </span>

                    <span v-if="enterprise.country"
                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {{ enterprise.country }}
                    </span>

                    <span v-if="enterprise.companySize"
                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {{ enterprise.companySize }}
                    </span>
                </div>

                <p class="mt-4 text-xs text-slate-500">
                    Created {{ formatDate(enterprise.createdAt) }}
                </p>

            </div>
        </div>

        <div class="flex shrink-0 flex-wrap gap-3">
            <button
                class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="emit('edit')">
                <Icon name="lucide:square-pen" size="18" />

                Edit
            </button>

            <button
                class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                @click="emit('newAssessment')">
                <Icon name="lucide:plus" size="18" />

                New Assessment
            </button>
        </div>
    </div>
</template>