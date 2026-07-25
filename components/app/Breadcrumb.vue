<script setup lang="ts">
// Breadcrumb navigation generated automatically from the current route path.
const route = useRoute()

const breadcrumbs = computed(() => {
    return route.path
        .split("/")
        .filter(Boolean)
        .map((item, index, array) => ({
            label: item
                .replace("-", " ")
                .replace(/\b\w/g, c => c.toUpperCase()),
            to: "/" + array.slice(0, index + 1).join("/")
        }))
})
</script>

<template>
    <div class="flex items-center gap-2 text-sm">

        <NuxtLink to="/" class="text-slate-500 hover:text-slate-900">
            Home
        </NuxtLink>

        <template v-for="item in breadcrumbs" :key="item.to">
            <Icon name="lucide:chevron-right" size="15" class="text-slate-400" />

            <NuxtLink :to="item.to" class="text-slate-500 hover:text-slate-900">
                {{ item.label }}
            </NuxtLink>

        </template>

    </div>
</template>