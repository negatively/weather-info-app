<script lang="ts">
import { ref } from 'vue';


const columns = [
    { field: 'time', title: 'Time', align: 'center', width: 120, editable: true },
    { field: 'value', title: 'Value', align: 'center', width: 120, editable: true },
]

const tableData = ref([
    { time: '01.00', value: 7 },
    { time: '02.00', value: 8 },
    { time: '03.00', value: 6 },
])

function onCellEdit({ rowIndex, field, value }) {
    tableData.value[rowIndex][field] = value
    console.log('Updated:', tableData.value)
}


</script>
<template>
    <div
        class="h-20 flex rounded-2xl justify-center items-center bg-linear-to-br from-yellow-950 to-yellow-600 z-0 shadow-lg">
        <h1 class="text-2xl font-semibold text-white">Edit Data Info Kualitas Udara</h1>
    </div>
    <div>
        <h1>why?</h1>

    </div>
</template>
<style></style>