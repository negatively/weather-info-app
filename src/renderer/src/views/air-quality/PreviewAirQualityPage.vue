<script setup lang="ts">
import { useAirQualityStore } from '@renderer/stores/airQuality';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import templateImage from '@renderer/assets/template.png'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const airQualityStore = useAirQualityStore();
const { summarize, processed } = storeToRefs(airQualityStore);

const hasData = computed(() => summarize.value !== null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const nameInput = ref('');
const currentDate = ref(new Date().toLocaleDateString());

// Canvas functions
const initCanvas = () => {
    if (!canvasRef.value || !summarize.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    // Load and draw template image
    const img = new Image();
    img.src = templateImage;
    img.onload = () => {
        // Draw template as background
        ctx.drawImage(img, 0, 0, canvasRef.value!.width, canvasRef.value!.height);

        // Draw description text
        ctx.font = '22px Poppins'
        ctx.textAlign = 'left'  // Reset alignment for paragraph text
        ctx.textBaseline = 'top'  // Align from top for multi-line text

        const description = 'Pengukuran dilakukan pada tanggal 02 November 2025 periode pukul 00 WIB hingga 23 WIB di Stasiun Pemantau Atmosfer Global (GAW) (GAW) Bukit Kototabang. Informasi kualitas udara yang dianalisis berdasarkan pantauan alat kualitas udara BAM 1020 untuk monitoring parameter aerosol partikulat debu halus (PM2.5) dan debu (PM10) dan Thermo 49iQ Series untuk monitoring parameter gas reaktif ozon permukaan (O3).'
        drawWrappedText(ctx, description, 100, 400, 1400, 30) // maxWidth: 1400px, lineHeight: 24px

        const conclusion = 'Nilai konsentrasi parameter PM10 dan PM2.5 berada pada kategori BAIK.'

        drawWrappedText(ctx, conclusion, 120, 920, 500, 30)


        const explanation = 'Rata-rata Konsentrasi  PM2.5  sebesar 6  µg/m3. \nKonsentrasi tertinggi sebesar 13  µg/m3  terjadi pada pukul 21 \ndan konsentrasi  terendah sebesar 2 µg/m3 terjadi pada pukul 15.\n\nRata-rata Konsentrasi  PM2.5  sebesar 6  µg/m3. \nKonsentrasi tertinggi sebesar 13  µg/m3  terjadi pada pukul 21 \ndan konsentrasi  terendah sebesar 2 µg/m3 terjadi pada pukul 15.\n\nRata-rata Konsentrasi  PM2.5  sebesar 6  µg/m3. \nKonsentrasi tertinggi sebesar 13  µg/m3  terjadi pada pukul 21 \ndan konsentrasi  terendah sebesar 2 µg/m3 terjadi pada pukul 15.'

        drawWrappedText(ctx, explanation, 720, 920, 750, 30)
        // ctx.fillText(`Name: ${nameInput.value}`, canvasRef.value!.width / 2, 200);

        // // Draw date
        // ctx.fillText(`Date: ${currentDate.value}`, canvasRef.value!.width / 2, 250);

        // Draw data
        if (summarize.value) {
            // PM2.5
            ctx.font = 'bold 40px Poppins'
            ctx.textAlign = 'center'     // Center text horizontally
            ctx.textBaseline = 'middle'  // Center text vertically

            // Draw Rata-rata
            ctx.fillText(Math.round(summarize.value.pm25.avg).toString(), 250, 730)
            ctx.fillText(Math.round(summarize.value.pm10.avg).toString(), 740, 730)
            ctx.fillText(Math.round(summarize.value.o3.avg).toString(), 1225, 730)



            ctx.font = 'bold 26px Poppins'
            // Draw Max Value
            ctx.fillText(Math.round(summarize.value.pm25.max).toString(), 360, 695)
            ctx.fillText(Math.round(summarize.value.pm10.max).toString(), 850, 695)
            ctx.fillText(Math.round(summarize.value.o3.max).toString(), 1335, 695)

            // Draw Min Value
            ctx.fillText(Math.round(summarize.value.pm25.min).toString(), 475, 695)
            ctx.fillText(Math.round(summarize.value.pm10.min).toString(), 960, 695)
            ctx.fillText(Math.round(summarize.value.o3.min).toString(), 1445, 695)

            // Draw Hour Max Value
            ctx.fillText(extractHour(summarize.value.pm25.hourMax), 360, 765)
            ctx.fillText(extractHour(summarize.value.pm10.hourMax), 850, 765)
            ctx.fillText(extractHour(summarize.value.o3.hourMax), 1335, 765)

            // Draw Hour Min Value
            ctx.fillText(extractHour(summarize.value.pm25.hourMin), 475, 765)
            ctx.fillText(extractHour(summarize.value.pm10.hourMin), 960, 765)
            ctx.fillText(extractHour(summarize.value.o3.hourMin), 1445, 765)


            // // Reset text alignment for other canvas operations
            // ctx.textAlign = 'left'
            // ctx.textBaseline = 'alphabetic'
        }
    };
};

const downloadCertificate = () => {
    if (!canvasRef.value) return;
    const link = document.createElement('a');
    link.download = `air-quality-report-${Date.now()}.png`;
    link.href = canvasRef.value.toDataURL('image/png');
    link.click();
};

// Chart data and options
const chartData = computed(() => {
    if (!processed.value?.o3) return { labels: [], datasets: [] }

    const labels = processed.value.o3.map(item => item.hour.slice(11))

    return {
        labels,
        datasets: [
            {
                label: 'O₃ (µg/m³)',
                data: processed.value.o3.map(item => item.avg),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'PM₁₀ (µg/m³)',
                data: processed.value.pm10.map(item => item.avg),
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'PM₂.₅ (µg/m³)',
                data: processed.value.pm25.map(item => item.avg),
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.3,
                fill: true
            }
        ]
    }
})


const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    }
}

// Helper function to extract hour from ISO datetime string
const extractHour = (dateTimeString: string | null) => {
    if (!dateTimeString) return '';
    return new Date(dateTimeString).getHours().toString().padStart(2, '0');
}

// Helper function to draw wrapped text
const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) => {
    // First split the text into paragraphs by newline
    const paragraphs = text.split('\n');
    let currentY = y;

    // Process each paragraph
    for (const paragraph of paragraphs) {
        // Split the paragraph into words
        const words = paragraph.split(' ');
        let line = '';

        // Process each word in the paragraph
        for (const word of words) {
            // Create a test line with the new word
            const testLine = line + (line ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);

            // If the line would be too long with this word
            if (metrics.width > maxWidth && line !== '') {
                // Draw the current line
                ctx.fillText(line, x, currentY);
                // Start a new line with the current word
                line = word;
                // Move to the next line
                currentY += lineHeight;
            } else {
                // Add the word to the current line
                line = testLine;
            }
        }

        // Draw any remaining text in the paragraph
        if (line) {
            ctx.fillText(line, x, currentY);
        }

        // Add an extra line break after each paragraph
        currentY += lineHeight;
    }

    return currentY; // Return the final y position
}

// Watch for changes
watch([nameInput, currentDate, summarize], () => {
    initCanvas();
}, { deep: true });

onMounted(() => {
    initCanvas();
});
</script>

<template>
    <div
        class="h-20 flex rounded-2xl justify-center items-center bg-linear-to-br from-teal-950 to-teal-600 z-0 shadow-lg">
        <h1 class="text-2xl font-semibold text-white">Preview Info Kualitas Udara</h1>
    </div>
    <div class="flex">
        <div class="w-3/4 mt-2">
            <div class="h-60 border border-zinc-600 mb-2 mr-2 rounded-2xl p-4">
                <Line :data="chartData" :options="chartOptions" class="h-full w-full" />
            </div>
            <div class="min-h-100 border border-zinc-600 mr-2 rounded-2xl p-4">
                <canvas ref="canvasRef" class="w-full h-full" width="1600" height="1600"></canvas>
            </div>
        </div>
        <div class="w-1/4 flex-1 border border-zinc-600 mt-2 mr-2 rounded-2xl p-4">
            <div class="flex-1">
                <input type="text" v-model="nameInput" placeholder="Enter name"
                    class="w-full px-4 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:border-teal-500" />
            </div>
            <div class="flex-1">
                <input type="text" v-model="currentDate" readonly
                    class="w-full px-4 py-2 rounded-lg border border-zinc-300 bg-zinc-50" />
            </div>
            <div class="flex flex-col">

                <button @click="downloadCertificate"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Accept
                </button>
                <button @click="downloadCertificate"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Edit
                </button>
                <button @click="downloadCertificate"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Reject
                </button>
            </div>
        </div>
    </div>
</template>