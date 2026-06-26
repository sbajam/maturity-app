<script setup lang="ts">
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