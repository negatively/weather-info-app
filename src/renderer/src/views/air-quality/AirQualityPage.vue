<script setup lang="ts">
import ImageResultCard from '@renderer/components/ImageResultCard.vue';
import { ref } from 'vue';
import { fetchRawData, avgByHour, summarizeDaily, dataCleansing } from '@renderer/services/data.service';


const name = ref('')
const date = ref('')

const handleSubmit = async () => {
    date.value = '2025-10-26'
    const result = await fetchRawData(date.value)
    const avg = await avgByHour(result.data)
    const cleansing = await dataCleansing(avg)
    const summarize = await summarizeDaily(cleansing)

    // console.log(avg);
    // if (result.success) {
    //     console.log(result.data)
    // } else {
    //     console.error(result.message)
    // }
}
</script>
<template>
    <div class="relative mt-10">
        <div
            class="absolute top-0 -translate-y-1/2 w-72 h-20 flex pl-8 pt-2 rounded-2xl items-start bg-linear-to-br from-teal-950 to-teal-600 z-0 shadow-lg">
            <h1 class="text-base font-semibold text-white">Info Kualitas Udara</h1>
        </div>
        <form class="max-w-full mx-auto border relative z-10 border-zinc-600 bg-zinc-900 p-8 rounded-2xl"
            @submit.prevent="handleSubmit">
            <div class="space-y-4">
                <div class="relative">
                    <input type="text" id="name" name="name" placeholder=" "
                        class=" w-full px-4 pt-6 pb-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all" />
                    <label for="name"
                        class="absolute left-4 top-2 text-xs text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-400">
                        Nama Pegawai
                    </label>
                </div>
                <div class="relative">
                    <input type="date" id="date" name="date"
                        class="peer w-full px-4 pt-6 pb-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all" />
                    <label for="date" class="absolute left-4 top-2 text-xs text-neutral-400">
                        Tanggal Data
                    </label>
                </div>
            </div>
            <div class="pt-4">
                <button type="submit"
                    class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r  from-yellow-200 from-0% to-green-400 to-50% hover:to-90% text-gray-900 font-bold rounded-lg transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900">
                    <img src="@renderer/assets/wand.svg" alt="Logo" class="w-5 h-5" />
                    Generate
                </button>
            </div>
        </form>
    </div>

    <!--List Image-->
    <div class="mt-2 gap-4">
        <div class="p-4">
            <h1 class="text-base font-semibold text-white">Result</h1>
        </div>
        <div class="flex flex-wrap">
            <ImageResultCard image="https://picsum.photos/300/200" title="25 Januari 2025" />
        </div>


    </div>
</template>