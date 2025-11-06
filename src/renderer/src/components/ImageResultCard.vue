<script setup lang="ts">

defineProps<{
    image: string;
    title: string;
}>();

</script>

<template>
    <section class="border border-zinc-600 rounded-2xl p-4 w-64 text-white shadow-lg">
        <img :src="image" alt="Image" class="rounded-lg mb-3 w-full object-cover">

        <p class="text-sm text-center mb-4">{{ title }}</p>

        <div class="flex justify-around flex-col">
            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                Download
            </button>
            <button
                class="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                Share to Whatsapp
            </button>
        </div>
    </section>
</template>
