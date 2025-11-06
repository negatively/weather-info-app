<script setup lang="ts">
import { useAirQualityStore } from '@renderer/stores/airQuality';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useCanvasReport } from '@renderer/composables/useCanvasReport';
import { useAirQualityChart, chartOptions } from '@renderer/composables/useAirQualityChart';
import AlertModal from '@renderer/components/AlertModal.vue';
import router from '@renderer/router';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const airQualityStore = useAirQualityStore();
const { summarize, processed, date } = storeToRefs(airQualityStore);
const nameInput = ref('');


// Modal
const showModal = ref(false)
const modalMessage = ref('')

// Initialize canvas composable
const { canvasRef, initCanvas, downloadReport, saveReport } = useCanvasReport();

// Initialize chart composable
const { chartData } = useAirQualityChart(processed.value);

// Watch for changes
watch([nameInput, summarize], () => {
    initCanvas(summarize, nameInput);
}, { deep: true });

onMounted(() => {
    initCanvas(summarize, nameInput);
});

const saveButton = () => {
    if (nameInput.value == '') {
        modalMessage.value = "Mohon Isi Nama Analis Terlebih Dahulu"
        showModal.value = true
    } else {
        saveReport(nameInput.value)
        router.push({ name: 'air-quality' })
    }
}

const rejectButton = () => {
    router.push({ name: 'air-quality' })
}

</script>

<template>
    <div
        class="h-20 flex rounded-2xl justify-center items-center bg-linear-to-br from-teal-950 to-teal-600 z-0 shadow-lg">
        <h1 class="text-2xl font-semibold text-white">Preview Info Kualitas Udara</h1>
    </div>
    <div class="flex">
        <div class="w-3/4 mt-2">
            <div class="min-h-100 border border-zinc-600 mr-2 rounded-2xl p-4">
                <canvas ref="canvasRef" class="w-full h-full" width="1600" height="1600"></canvas>
            </div>
            <div class="h-60 border border-zinc-600 mt-2 mr-2 rounded-2xl p-4">
                <Line :data="chartData" :options="chartOptions" class="h-full w-full" />
            </div>
        </div>
        <div class="w-1/4 flex-1 border border-zinc-600 mt-2 mr-2 rounded-2xl p-4 ">
            <div class="flex-1">
                <div class="relative">
                    <input v-model="nameInput" type="text" id="name" name="name" placeholder=" "
                        class=" w-full px-4 pt-6 pb-2 rounded-lg border border-zinc-300 focus:outline-none focus:border-teal-500 transition-all" />
                    <label for="name"
                        class="absolute left-4 top-2 text-xs text-neutral-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-neutral-400">
                        Nama Pengolah
                    </label>
                </div>
            </div>

            <div class="flex flex-col gap-2 mt-2">

                <button @click="saveButton"
                    class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Accept
                </button>
                <!-- <button @click="downloadReport"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Download Report
                </button> -->
                <button @click="rejectButton"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Reject
                </button>
                <button @click="rejectButton"
                    class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                    Edit
                </button>
            </div>
        </div>
    </div>
    <AlertModal v-model:show="showModal" title="Error" :message="modalMessage"></AlertModal>
</template>