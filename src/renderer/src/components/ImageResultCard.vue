<script setup lang="ts">

defineProps<{
    image: string;
    title: string;
}>();

</script>

<template>
    <section class="border border-zinc-600 rounded-2xl p-4 w-64 text-white shadow-lg">
        <img :src="image" alt="A frog wearing a hat" class="rounded-lg mb-3 w-full object-cover">

        <p class="text-sm text-center mb-4">{{ title }}</p>

        <div class="flex justify-around">
            <button class="px-4 py-2 rounded-lg text-sm font-medium transition">
                Download
            </button>
            <button class="px-4 py-2 rounded-lg text-sm font-medium transition">
                Regenerate
            </button>
        </div>
    </section>
</template>
