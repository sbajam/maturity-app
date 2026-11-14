<script setup lang="ts" generic="T extends { id: number }">
// Generic, slot-based data table with loading and empty states.
import type { DataTableColumn } from "~/types/ui"

defineSlots<{
    toolbar?: () => unknown

    footer?: () => unknown

    [key: `cell-${string}`]: (props: {
        row: T
        index: number
    }) => unknown
}>()

const props = withDefaults(
    defineProps<{
        columns: DataTableColumn<T>[]

        items: T[]

        loading?: boolean

        emptyTitle?: string

        emptyDescription?: string
    }>(),
    {
        loading: false,
        emptyTitle: "No data",
        emptyDescription: "Nothing to display.",
    },
)

const alignClass = (
    align?: "left" | "center" | "right",
) => {
    switch (align) {
        case "center":
            return "text-center"

        case "right":
            return "text-right"

        default:
            return "text-left"
    }
}

function getCellValue(
    row: T,
    accessor?: Extract<keyof T, string>,
) {
    if (!accessor)
        return ""

    return row[accessor]
}
</script>

<template>
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <!-- Toolbar -->

        <div v-if="$slots.toolbar" class="border-b border-slate-200 p-4">
            <slot name="toolbar" />
        </div>

        <!-- Loading -->

        <div v-if="props.loading" class="p-12 text-center text-sm text-slate-500">
            Loading...
        </div>

        <!-- Empty -->

        <UiEmptyState v-else-if="props.items.length === 0" :title="props.emptyTitle"
            :description="props.emptyDescription" />

        <!-- Table -->

        <div v-else class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-slate-50">
                    <tr>
                        <th v-for="column in props.columns" :key="column.id" :style="{
                            width: column.width,
                        }" :class="[
                'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600',
                alignClass(column.align),
            ]">
                            {{ column.label }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(row, index) in props.items" :key="row.id"
                        class="border-t border-slate-200 transition hover:bg-slate-50">
                        <td v-for="column in props.columns" :key="column.id" :class="[
                            'px-5 py-4 text-sm text-slate-700',
                            alignClass(column.align),
                        ]">
                            <slot :name="`cell-${column.id}`" :row="row" :index="index">
                                {{ getCellValue(row, column.accessor) }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer -->

        <div v-if="$slots.footer" class="border-t border-slate-200 p-4">
            <slot name="footer" />
        </div>
    </div>
</template>