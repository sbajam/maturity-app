<script setup lang="ts">
// Modal dialog form for creating a new enterprise.
const open = defineModel<boolean>("open", {
  default: false,
})
defineProps<{ error?: string; loading?: boolean }>()

const emit = defineEmits<{
  create: [{
    name: string
    description: string
    industry: string
    country: string
    businessModel: string
    companySize: string
  }]
}>()

const name = ref("")
const description = ref("")
const industry = ref("")
const country = ref("")
const businessModel = ref("")
const companySize = ref("")

const companySizeOptions = [
  { label: "1-10", value: "1-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "500+", value: "500+" },
]

function reset() {
  name.value = ""
  description.value = ""
  industry.value = ""
  country.value = ""
  businessModel.value = ""
  companySize.value = ""
}

function submit() {
  if (!name.value.trim() || !industry.value.trim())
    return

  emit("create", {
    name: name.value.trim(),
    description: description.value.trim(),
    industry: industry.value.trim(),
    country: country.value.trim(),
    businessModel: businessModel.value.trim(),
    companySize: companySize.value,
  })

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
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 class="text-xl font-semibold text-slate-900">
          New Enterprise
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Add a new organization to the platform.
        </p>

        <div class="mt-6 space-y-4">
          <UiInput
            v-model="name"
            label="Company Name"
            placeholder="Vornaco"
            required
          />

          <UiInput
            v-model="industry"
            label="Industry"
            placeholder="Software"
            required
          />

          <UiInput
            v-model="country"
            label="Country"
            placeholder="Iran"
          />

          <UiInput
            v-model="businessModel"
            label="Business Type"
            placeholder="B2B SaaS"
          />

          <UiSelect
            v-model="companySize"
            label="Company Size"
            placeholder="Select size"
            :options="companySizeOptions"
          />

          <UiTextarea
            v-model="description"
            label="Description"
            placeholder="Company description..."
            dir="auto"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <UiButton
            variant="ghost"
            @click="open = false"
          >
            Cancel
          </UiButton>

          <UiButton :disabled="loading" @click="submit">
            Create
          </UiButton>
        </div>
        <p v-if="error" role="alert" class="mt-3 text-sm text-red-700">{{ error }}</p>
      </div>
    </div>
  </Teleport>
</template>
