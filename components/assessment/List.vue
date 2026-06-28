<script
  setup
  lang="ts"
>
import type {
  Assessment,
} from "~/types"

defineProps<{
  items: Assessment[]

  selectedId?: number
}>()

const emit = defineEmits<{
  (
    e: "select",
    id: number,
  ): void

  (
    e: "new",
  ): void
}>()
</script>

<template>
  <UiCard class="cursor-pointer">

    <div
      class="mb-5 flex items-center justify-between"
    >
      <div>

        <h2
          class="text-lg font-semibold"
        >
          Assessments
        </h2>

        <p
          class="mt-1 text-sm text-slate-500"
        >
          Enterprise assessment history
        </p>

      </div>

      <UiButton
        @click="
          emit('new')
        "
      >
        New
      </UiButton>

    </div>

    <div
      class="space-y-3"
    >
      <AssessmentCard
        v-for="assessment in items"
        :key="
          assessment.id
        "
        :assessment="
          assessment
        "
        :selected="
          assessment.id ===
          selectedId
        "
        @click="
          emit(
            'select',
            assessment.id,
          )
        "
      />

    </div>

  </UiCard>
</template>