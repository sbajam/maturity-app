<script setup lang="ts">
// Modal dialog form for creating a new assessment.
const open = defineModel<boolean>("open", {
  default: false,
})

const emit = defineEmits<{
  create: [{
    name: string
    description: string
    version: string
  }]
}>()

const name = ref("")
const description = ref("")
const version = ref("1.0")

function reset() {
  name.value = ""
  description.value = ""
  version.value = "1.0"
}

function submit() {
  if (!name.value.trim())
    return

  emit("create", {
    name: name.value.trim(),
    description: description.value.trim(),
    version: version.value.trim() || "1.0",
  })

  reset()
  open.value = false
}

watch(open, (value) => {
  if (!value)
    reset()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="open = false"
    >
      <div
        class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h2 class="text-xl font-semibold text-slate-900">
          New Assessment
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Create a new capability maturity assessment.
        </p>

        <div class="mt-6 space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>

            <UiInput
              v-model="name"
              placeholder="Q1 Capability Assessment"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
              Version
            </label>

            <UiInput
              v-model="version"
              placeholder="1.0"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <UiTextarea
              v-model="description"
              placeholder="Optional description..."
              dir="auto"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <UiButton
            variant="ghost"
            @click="open = false"
          >
            Cancel
          </UiButton>

          <UiButton @click="submit">
            Create
          </UiButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
