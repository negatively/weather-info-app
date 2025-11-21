<script setup lang="ts">
import ImageResultCard from '@renderer/components/ImageResultCard.vue';
import { onMounted, ref } from 'vue';
import { fetchRawData, avgByHour, summarizeDaily, dataCleansing } from '@renderer/services/data.service';
import AlertModal from '@renderer/components/AlertModal.vue';
import ImagePreviewModal from '@renderer/components/ImagePreviewModal.vue';
import router from '@renderer/router';
import { useAirQualityStore } from '@renderer/stores/airQuality';
import { SavedReport } from 'src/shared/types/store';

const airQualityStore = useAirQualityStore();
const currentDate = new Date().toISOString().slice(0, 10);
const date = ref(currentDate)
const listReport = ref<SavedReport[]>([])
// Modal
const showModal = ref(false)
const modalMessage = ref('')

const caption = "Dengan hormat, berikut kami sampaikan informasi kualitas udara tanggal"


const handleGenerate = async () => {
    const prev = new Date(date.value)
    prev.setDate(prev.getDate() - 1)
    const prevDate = prev.toISOString().slice(0, 10)
    const result = await fetchRawData(prevDate)

    if (!result.success) {
        modalMessage.value = "Server tidak terkoneksi dengan baik"
        showModal.value = true
        return
    } else if (result.data.o3.length == 0 && result.data.pm25.length == 0 && result.data.pm10.length == 0) {
        modalMessage.value = "Data Tidak Ditemukan"
        showModal.value = true
        return
    }
    const avg = await avgByHour(result.data)
    const cleansing = await dataCleansing(avg)
    const summarize = await summarizeDaily(cleansing)

    airQualityStore.setProcessed(cleansing)
    airQualityStore.setSummarize(summarize)
    airQualityStore.setDate(prevDate)
    airQualityStore.setDataCleansing(cleansing)



    router.push({ name: 'air-quality.preview' })

}

onMounted(async () => {
    const reports = await window.api.getSavedReports();
    const reportsWithImage = await Promise.all(
        reports.map(async (r) => ({
            ...r,
            imageBase64: await window.api.getReportImage(r.imagePath)
        }))
    )
    listReport.value = reportsWithImage
})

const showPicker = (event) => {
    if (event.target.showPicker) event.target.showPicker()
}
</script>
<template>
    <div class="relative mt-10">
        <div
            class="absolute top-0 -translate-y-1/2 w-72 h-20 flex pl-8 pt-2 rounded-2xl items-start bg-linear-to-br from-teal-950 to-teal-600 z-0 shadow-lg">
            <h1 class="text-base font-semibold text-white">Info Kualitas Udara</h1>
        </div>
        <form class="max-w-full mx-auto border relative z-10 border-zinc-600 bg-zinc-900 p-8 rounded-2xl"
            @submit.prevent="handleGenerate">
            <div class="space-y-4">
                <div class="relative">
                    <input v-model="date" type="date" id="date" name="date" @focus="showPicker"
                        class="peer w-full px-4 pt-6 pb-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all" />
                    <label for="date" class="absolute left-4 top-2 text-xs text-neutral-400  pointer-events-none">
                        Tanggal
                    </label>
                </div>
            </div>
            <div class="pt-4">
                <button type="submit" id="btn-generate"
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
        <div class="flex flex-wrap gap-3">
            <ImageResultCard v-for="report in listReport" :image="report.imageBase64" :title="report.createdAt"
                :caption="caption + ' ' + report.dataDate + '.'" />
        </div>
    </div>

    <AlertModal v-model:show="showModal" title="Error" :message="modalMessage"></AlertModal>
    <ImagePreviewModal />
</template>