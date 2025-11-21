<script setup>
defineProps({
    show: Boolean
})
</script>
<template>
    <div v-if="show" class="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center text-white">
        <div class="flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4">
            </div>
        </div>
    </div>
</template>
