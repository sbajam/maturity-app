<script setup lang="ts">
// Single sidebar navigation item, supporting active state and collapsible children.
import type { NavigationItem } from "~/types/navigation";

const props = defineProps<{
  item: NavigationItem;
}>();

const route = useRoute();

const open = ref(false);

const hasChildren = computed(() => !!props.item.children?.length);

const isActive = computed(() => {
  if (!props.item.to) return false;

  return route.path.startsWith(props.item.to);
});

watchEffect(() => {
  if (isActive.value)
    open.value = true;
});
</script>

<template>
  <div>
    <button
      v-if="hasChildren"
      class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      @click="open = !open"
    >
      <div class="flex items-center gap-3">
        <Icon
          v-if="item.icon"
          :name="item.icon"
          size="18"
        />

        {{ item.title }}
      </div>

      <Icon
        name="lucide:chevron-down"
        size="16"
        class="transition"
        :class="open && 'rotate-180'"
      />
    </button>

    <NuxtLink
      v-else
      :to="item.to!"
      class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
      :class="
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-700 hover:bg-slate-100'
      "
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        size="18"
      />

      {{ item.title }}
    </NuxtLink>

    <Transition name="submenu">
      <div
        v-if="open && hasChildren"
        class="ml-4 mt-1 border-l border-slate-200 pl-3"
      >
        <AppSidebarItem
          v-for="child in item.children"
          :key="child.title"
          :item="child"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all .2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>