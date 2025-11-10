<script setup lang="ts">
import { ipcRenderer } from 'electron';


defineProps<{
    image: string;
    title: string;
}>();

const copyToClipboard = async (image: string, title: string) => {
    try {
        const res = await window.api.copyImageAndCaption({ imageBase64: image, title });
        if (res.success) {
            alert('✅ Image and caption copied! You can now paste them in WhatsApp.');
        } else {
            alert('❌ Failed to copy: ' + res.error);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Something went wrong.');
    }
};


</script>

<template>
    <section class="border border-zinc-600 rounded-2xl p-4 w-64 text-white shadow-lg">
        <img :src="image" alt="Image" class="rounded-lg mb-3 w-full object-cover">

        <p class="text-sm text-center mb-4">{{ title }}</p>

        <div class="flex justify-around flex-col">
            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                @click="copyToClipboard(image, title)">
                Copy
            </button>
            <button
                class="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                Share to Whatsapp
            </button>
        </div>
    </section>
</template>
