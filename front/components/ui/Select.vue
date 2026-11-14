<script setup lang="ts">
// Base labeled select dropdown with hint/error state support.
import type { SelectOption } from "~/types/ui"

const model = defineModel<string | number>()

const props = defineProps<{
    label?: string
    placeholder?: string
    options: SelectOption[]
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
}>()
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="text-sm font-medium text-slate-700">
            {{ label }}

            <span v-if="required" class="text-red-500">
                *
            </span>
        </label>

        <select v-model="model" :disabled="disabled" class="form-control">
            <option value="" disabled>
                {{ placeholder ?? "Select..." }}
            </option>

            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <p v-if="hint && !error" class="text-xs text-slate-500">
            {{ hint }}
        </p>

        <p v-if="error" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>