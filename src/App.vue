<script setup></script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style>
body {
  @apply bg-gray-100;
}
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner {
  display: block;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-right-color: transparent;
  border-left-color: transparent;
  background: rgba(0, 0, 0, 0.1);
}
</style>
