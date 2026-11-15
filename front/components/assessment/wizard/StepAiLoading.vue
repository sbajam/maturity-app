<script setup lang="ts">
// Animated AI analysis step with progress bar and rotating status messages.
import { AI_LOADING_MESSAGES } from "~/utils/wizard"

const demo = useAppMode()
const props = defineProps<{
  running?: boolean
  readOnly?: boolean
}>()

const emit = defineEmits<{
  complete: []
}>()

const messageIndex = ref(0)
const progress = ref(0)
let interval: ReturnType<typeof setInterval> | null = null
let progressInterval: ReturnType<typeof setInterval> | null = null

const currentMessage = computed(() =>
  AI_LOADING_MESSAGES[messageIndex.value]
  ?? AI_LOADING_MESSAGES[AI_LOADING_MESSAGES.length - 1],
)

function startAnimation() {
  messageIndex.value = 0
  progress.value = 0

  interval = setInterval(() => {
    if (messageIndex.value < AI_LOADING_MESSAGES.length - 1)
      messageIndex.value++
  }, 1200)

  progressInterval = setInterval(() => {
    if (progress.value < 95)
      progress.value += Math.random() * 8 + 2
  }, 400)

  setTimeout(() => {
    progress.value = 100
    if (interval) clearInterval(interval)
    if (progressInterval) clearInterval(progressInterval)
    setTimeout(() => emit("complete"), 600)
  }, AI_LOADING_MESSAGES.length * 1200 + 800)
}

onMounted(() => {
  if (!props.readOnly && props.running !== false)
    startAnimation()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<template>
  <div v-if="readOnly" class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
    <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <Icon name="lucide:brain" class="h-8 w-8" />
    </div>
    <h2 class="text-xl font-bold text-slate-900">Simulated AI Analysis — Historical Review</h2>
    <p class="mt-3 max-w-lg text-sm leading-7 text-slate-600">
      This completed assessment used pre-generated illustrative data. No model is being called now.
      Review the saved capability scores and reasoning in Results.
    </p>
  </div>
  <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20">
    <!-- AI Avatar -->
    <div class="relative mb-8">
      <div class="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
      <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200">
        <Icon name="lucide:brain" class="h-10 w-10 text-white" />
      </div>
    </div>

    <h2 class="text-2xl font-bold text-slate-900">
      {{ demo ? 'Simulated AI Analysis' : 'AI Analysis in Progress' }}
    </h2>

    <p class="mt-2 max-w-md text-center text-sm text-slate-500">
      {{ demo ? "در حالت Demo ارزیابی نمایشی در Backend ثبت می‌شود؛ هیچ فراخوانی LLM انجام نمی‌شود." : "Our AI is evaluating capability maturity based on your approved evidence mappings." }}
    </p>

    <!-- Progress -->
    <div class="mt-8 w-full max-w-md">
      <div class="mb-2 flex justify-between text-xs text-slate-500">
        <span>Analyzing...</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Current message -->
    <div class="mt-8 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4">
      <Icon
        name="lucide:loader-circle"
        class="h-5 w-5 shrink-0 animate-spin text-blue-600"
      />
      <p class="text-sm font-medium text-blue-800 transition-all duration-300">
        {{ currentMessage }}
      </p>
    </div>

    <!-- Message dots -->
    <div class="mt-6 flex gap-2">
      <div
        v-for="(_, index) in AI_LOADING_MESSAGES"
        :key="index"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="index <= messageIndex
          ? 'w-6 bg-blue-500'
          : 'w-1.5 bg-slate-200'"
      />
    </div>
  </div>
</template>
