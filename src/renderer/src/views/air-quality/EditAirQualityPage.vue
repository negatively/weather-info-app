<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAirQualityStore } from '@renderer/stores/airQuality';
import { HourlySummarize } from '@renderer/types/data-process';
import { summarizeDaily } from '@renderer/services/data.service';
import router from '@renderer/router';


const airQualityStore = useAirQualityStore()
const tableData = ref<Array<any>>([])


const saveChanges = async () => {
    console.warn('Saving edited data...')
    const reversed = reverseTransformData(tableData.value)
    const summarize = await summarizeDaily(reversed)
    airQualityStore.setDataCleansing(reversed)
    airQualityStore.setSummarize(summarize)
    console.log('Saved data:', reversed)
    router.push({ name: 'air-quality.preview' })
}

const transformData = (data: any) => {
    if (!data || !data.o3) return []
    return data.o3.map((item: any, idx: number) => ({
        hour: item.hour,
        o3: Math.round(item.avg),
        pm10: data.pm10?.[idx]?.avg ?? null,
        pm25: data.pm25?.[idx]?.avg ?? null
    }))
}

const reverseTransformData = (table: any[]) => {
    const result: HourlySummarize = {
        pm10: [],
        pm25: [],
        o3: []
    };

    table.forEach(row => {
        result.o3.push({ hour: row.hour, avg: Number(row.o3), count: 1 })
        result.pm10.push({ hour: row.hour, avg: Number(row.pm10), count: 1 })
        result.pm25.push({ hour: row.hour, avg: Number(row.pm25), count: 1 })
    })

    return result
}

watch(
    () => airQualityStore.dataCleansing, // pantau langsung ref di store
    (newVal) => {
        tableData.value = transformData(newVal)
    },
    { immediate: true, deep: true }
)
</script>
<template>
    <div
        class="h-20 flex rounded-2xl justify-center items-center bg-linear-to-br from-yellow-950 to-yellow-600 z-0 shadow-lg">
        <h1 class="text-2xl font-semibold text-white">Edit Data Info Kualitas Udara</h1>
    </div>
    <div class="pt-2">
        <button type="button"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r  from-yellow-200 from-0% to-green-400 to-50% hover:to-90% text-gray-900 font-bold rounded-lg transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            @click="saveChanges">
            <img src="@renderer/assets/wand.svg" alt="Logo" class="w-5 h-5" />
            Save dan Regenerate
        </button>
        <div class="p-4 mt-2 bg-white rounded-2xl">
            <vxe-table :data="tableData" border :edit-config="{ trigger: 'click', mode: 'cell' }">
                <vxe-column field="hour" title="Jam" width="150" />
                <vxe-column field="o3" title="O3 " :edit-render="{ name: 'input', attrs: { type: 'number' } }" />
                <vxe-column field="pm10" title="PM10" :edit-render="{ name: 'input', attrs: { type: 'number' } }" />
                <vxe-column field="pm25" title="PM2.5" :edit-render="{ name: 'input', attrs: { type: 'number' } }" />
            </vxe-table>
        </div>
    </div>
</template>