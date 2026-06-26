<script setup lang="ts">
import type { DataSource } from "~/types"

const props = defineProps<{
    sources: DataSource[]
}>()

const total = computed(() => props.sources.length)

const enabled = computed(() =>
    props.sources.filter(source => source.enabled).length,
)

const disabled = computed(() =>
    props.sources.filter(source => !source.enabled).length,
)

const stats = computed(() => [
    {
        title: "Connected Sources",
        value: total.value,
        icon: "i-lucide-database",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        title: "Enabled",
        value: enabled.value,
        icon: "i-lucide-circle-check-big",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        title: "Disabled",
        value: disabled.value,
        icon: "i-lucide-circle-x",
        color: "text-slate-500",
        bg: "bg-slate-100",
    },
])
</script>

<template>
    <div class="grid gap-5 md:grid-cols-3">
        <AppCard v-for="item in stats" :key="item.title">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-slate-500">
                        {{ item.title }}
                    </p>

                    <h3 class="mt-2 text-3xl font-bold text-slate-900">
                        {{ item.value }}
                    </h3>
                </div>

                <div :class="item.bg" class="flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon :name="item.icon" size="24" :class="item.color" />
                </div>
            </div>
        </AppCard>
    </div>
</template>