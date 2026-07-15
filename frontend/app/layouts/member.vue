<template>
  <div class="min-h-screen overflow-x-hidden bg-surface-deep">
    <MemberHeader />
    <div class="flex min-h-screen">
      <MemberSidebar />
      <main class="min-w-0 flex-1 p-4 pb-24 md:p-8 md:pb-24">
        <slot />
      </main>
    </div>
    <MobileBottomNav />
  </div>
</template>
