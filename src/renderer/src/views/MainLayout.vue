<script setup>
import { ref } from 'vue';
import AppSidebar from '@renderer/components/AppSidebar.vue';
</script>

<template>
    <div class="flex min-h-screen bg-zinc-900 text-white">
        <AppSidebar />
        <div class="flex-1 p-6 pl-25">
            <RouterView />
        </div>
    </div>
</template>
