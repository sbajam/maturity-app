<script setup lang="ts">
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost"

const props = withDefaults(
  defineProps<{
    variant?: Variant
    disabled?: boolean
    loading?: boolean
    type?: "button" | "submit"
  }>(),
  {
    variant: "primary",
    disabled: false,
    loading: false,
    type: "button",
  },
)

const classes = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200"

    case "outline":
      return "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"

    case "danger":
      return "bg-red-600 text-white hover:bg-red-700"

    case "ghost":
      return "text-slate-700 hover:bg-slate-100"

    default:
      return "bg-blue-600 text-white hover:bg-blue-700"
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Icon
      v-if="loading"
      name="i-lucide-loader-circle"
      class="animate-spin"
    />

    <slot />
  </button>
</template>