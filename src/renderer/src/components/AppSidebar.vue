<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { icon: '🍃', label: 'Air Quality', route: '/' },
  { icon: '🌆', label: 'PM 2.5', route: '/pm25' },
]);
</script>

<template>
  <div class="w-20 h-screen bg-zinc-800 flex flex-col items-center py-4 fixed left-0 top-0">

    <div class="mb-8">
      <img src="@renderer/assets/picture.svg" alt="Logo" class="w-8 h-8" />
    </div>

    <!-- Nav Items -->
    <nav class="flex flex-col gap-6 flex-1 overflow-y-auto">
      <router-link v-for="item in menuItems" :key="item.label" :to="item.route"
        class="flex flex-col items-center group p-2 mt-2 focus:bg-zinc-500">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-zinc-600 hover:text-white transition-colors">
          <span class="text-xl">{{ item.icon }}</span>
        </div>
        <span class="text-xs text-gray-400 group-hover:text-white mt-1">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Settings at bottom -->
    <router-link to="/settings" class="flex flex-col items-center group p-2 mt-2 focus:bg-zinc-500">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-zinc-600 hover:text-white transition-colors">
        <span class="text-xl">⚙️</span>
      </div>
      <span class="text-xs text-gray-400 group-hover:text-white mt-1">Settings</span>
    </router-link>
  </div>
</template>