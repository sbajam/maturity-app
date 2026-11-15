<script setup lang="ts">
// Legacy entry point maintained for bookmarks. Uses the SAME enterprise pages as Real mode.
const demo=useAppMode()
if (demo) await navigateTo('/enterprise/900001', {replace:true})
</script>
<template><UiEmptyState v-if="!demo" title="Demo unavailable" description="Set NUXT_PUBLIC_APP_MODE=demo to use the Vendow Demo database." /></template>
