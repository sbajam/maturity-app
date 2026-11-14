<script setup lang="ts">
import { demoChildren, demoLeaves, type DemoCapability, type DemoResult } from '~/utils/demo-model'

const props = defineProps<{ node: DemoCapability; selected: string[]; results?: Record<string, DemoResult>; mode: 'select' | 'report'; depth?: number }>()
const emit = defineEmits<{ toggle: [ids: string[], checked: boolean] }>()
const expanded = ref(false)
const children = computed(() => demoChildren(props.node.id))
const leaves = computed(() => demoLeaves(props.node.id))
const checked = computed(() => leaves.value.every(id => props.selected.includes(id)))
const some = computed(() => leaves.value.some(id => props.selected.includes(id)))
</script>

<template>
  <div>
    <div class="flex items-center gap-2 py-1.5 text-sm" :style="{ paddingInlineStart: `${(depth ?? 0) * 16}px` }">
      <button v-if="children.length" type="button" :aria-label="expanded ? 'Collapse' : 'Expand'" class="w-6 rounded border text-slate-600" @click="expanded = !expanded">{{ expanded ? '−' : '+' }}</button>
      <span v-else class="w-6 text-center text-slate-400">·</span>
      <input v-if="mode === 'select'" type="checkbox" :checked="checked" :indeterminate="some && !checked" :aria-label="node.name" @change="emit('toggle', leaves, ($event.target as HTMLInputElement).checked)">
      <span dir="auto" :class="children.length ? 'font-semibold' : ''">{{ node.name }}</span>
      <span v-if="!children.length" class="rounded bg-blue-50 px-1 text-xs text-blue-700">Leaf</span>
      <span v-if="mode === 'report' && results?.[node.id]" class="ms-auto text-xs" :class="results[node.id]?.score == null ? 'text-amber-700' : 'text-green-700'">
        {{ results[node.id]?.score == null ? (results[node.id]?.status === 'not_selected' ? 'Not selected' : 'Incomplete') : `${results[node.id]?.score?.toFixed(2)} / 5` }}
      </span>
    </div>
    <template v-if="expanded">
      <DemoCapabilityNode v-for="child in children" :key="child.id" :node="child" :selected="selected" :results="results" :mode="mode" :depth="(depth ?? 0) + 1" @toggle="(ids, value) => emit('toggle', ids, value)" />
    </template>
  </div>
</template>
