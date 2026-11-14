<script setup lang="ts">
// Renders a list of top-level sidebar navigation items.
import type { NavigationItem } from "~/types/navigation";

defineProps<{
  items: NavigationItem[];
}>();
</script>

<template>
  <div class="space-y-1 px-3">
    <AppSidebarItem
      v-for="item in items"
      :key="item.title"
      :item="item"
    />
  </div>
</template>