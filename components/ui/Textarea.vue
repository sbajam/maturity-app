<script setup lang="ts">
const model = defineModel<string>()

const props = withDefaults(
    defineProps<{
        label?: string
        placeholder?: string
        rows?: number
        hint?: string
        error?: string
        disabled?: boolean
        required?: boolean
    }>(),
    {
        rows: 4,
        disabled: false,
        required: false,
    },
)

const classes = computed(() => [
    "form-control resize-y",
    props.error
        ? "border-red-300"
        : "",
    props.disabled
        ? "bg-slate-100 cursor-not-allowed"
        : "",
])
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="text-sm font-medium text-slate-700">
            {{ label }}

            <span v-if="required" class="text-red-500">
                *
            </span>
        </label>

        <textarea v-model="model" :rows="rows" :disabled="disabled" :placeholder="placeholder" :class="classes" />

        <p v-if="hint && !error" class="text-xs text-slate-500">
            {{ hint }}
        </p>

        <p v-if="error" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>