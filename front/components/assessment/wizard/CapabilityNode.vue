<script setup lang="ts">
// Recursive capability tree row used in the wizard's review step.
import type { CapabilityNode } from "~/utils/capability"

defineProps<{
  node: CapabilityNode
  depth: number
}>()
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2 py-1.5 text-sm"
      :style="{ paddingLeft: `${depth * 16}px` }"
    >
      <Icon
        v-if="node.children.length"
        name="lucide:folder"
        class="h-3.5 w-3.5 shrink-0 text-slate-400"
      />
      <span
        v-else
        class="h-2 w-2 shrink-0 rounded-full bg-blue-400"
      />
      <span
        :class="node.children.length ? 'font-semibold text-slate-800' : 'text-slate-700'"
      >
        {{ node.name }}
      </span>
      <span
        v-if="!node.children.length"
        class="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
      >
        Leaf
      </span>
    </div>

    <AssessmentWizardCapabilityNode
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :depth="depth + 1"
    />
  </div>
</template>
