<script setup lang="ts">
// Generic content card wrapper with optional title, description, and footer slot.
interface Props {
    title?: string
    description?: string
}

defineProps<Props>()
</script>

<template>
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <header v-if="title || description" class="border-b border-slate-100 px-6 py-5">
            <h2 v-if="title" class="text-lg font-semibold text-slate-900">
                {{ title }}
            </h2>

            <p v-if="description" class="mt-1 text-sm text-slate-500">
                {{ description }}
            </p>
        </header>

        <div class="p-6">
            <slot />
        </div>

        <slot name="footer" />
    </section>
</template>