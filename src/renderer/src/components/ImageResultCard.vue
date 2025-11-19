<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { openModal } from '@renderer/stores/modal';


const props = defineProps<{
    image: string;
    title: string;
    caption: string;
}>();

const copyImage = async (image: string) => {
    try {
        const res = await window.api.copyImage({ imageBase64: image });
        if (res.success) {
            alert('✅ Image sudah tercopy');
        } else {
            alert('❌ Failed to copy: ' + res.error);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Something went wrong.');
    }
};

const copyCaption = async (caption: string) => {
    try {
        const res = await window.api.copyCaption({ caption: caption });
        if (res.success) {
            alert('✅ Caption sudah tercopy');
        } else {
            alert('❌ Failed to copy: ' + res.error);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Something went wrong.');
    }
}

const openPreviewModal = () => {
    openModal('imagePreview', {
        imageUrl: props.image,
        prompt: props.caption,
        date: props.title
    })
}


</script>

<template>
    <section class="border border-zinc-600 rounded-2xl p-4 w-64 text-white shadow-lg">
        <button class="text-left cursor-pointer" @click="openPreviewModal()">
            <img :src="image" alt="Image" class="rounded-lg mb-3 w-full object-cover">

            <p class="text-sm mb-4">{{ caption }}</p>
            <p class="text-sm text-amber-300  mb-4">Dibuat pada : {{ title }}</p>
        </button>


        <div class="flex justify-around flex-col">
            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                @click="copyImage(image)">
                Copy Image
            </button>
            <button
                class="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                @click="copyCaption(caption)">
                Copy Caption
            </button>
        </div>
    </section>
</template>
