<script setup lang="ts">
interface Props {
    label: string

    icon?: string
}

defineProps<Props>()
</script>

<template>
    <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-2">
            <Icon v-if="icon" :name="icon" size="18" class="text-blue-600" />

            <span class="text-sm text-slate-600">
                {{ label }}
            </span>
        </div>

        <span class="text-right font-semibold text-slate-900">
            <slot />
        </span>
    </div>
</template>