<!-- Default application shell composed of the sidebar, header, and main content container. -->
<template>
  <div class="flex h-screen bg-slate-50">

    <AppSidebar />

    <div class="flex flex-1 flex-col overflow-hidden">

      <AppHeader />


      <main class="flex-1 overflow-auto">

        <AppContainer>

          <slot />

        </AppContainer>

      </main>

    </div>

  </div>
</template>