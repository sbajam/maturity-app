<script setup lang="ts">
import { computed } from "vue"

const model = defineModel<string>()

const props = withDefaults(
    defineProps<{
        label?: string
        placeholder?: string
        type?: string
        hint?: string
        error?: string
        disabled?: boolean
        required?: boolean
    }>(),
    {
        type: "text",
        disabled: false,
        required: false,
    },
)

const inputClasses = computed(() => [
    "w-full rounded-lg border bg-white px-3 py-2 text-sm transition",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    props.error
        ? "border-red-300"
        : "border-slate-300",
    props.disabled
        ? "cursor-not-allowed bg-slate-100"
        : "",
])
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="block text-sm font-medium text-slate-700">
            {{ label }}

            <span v-if="required" class="text-red-500">
                *
            </span>
        </label>

        <input v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled" :class="inputClasses">

        <p v-if="hint && !error" class="text-xs text-slate-500">
            {{ hint }}
        </p>

        <p v-if="error" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>