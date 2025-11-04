import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'

interface ProcessedData {
  o3: Array<{ hour: string; avg: number }>
  pm10: Array<{ hour: string; avg: number }>
  pm25: Array<{ hour: string; avg: number }>
}

export const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

export function useAirQualityChart(processedData: ProcessedData | null) {
  const chartData = computed<ChartData<'line', number[], string>>(() => {
    if (!processedData?.o3) return { labels: [], datasets: [] }

    const labels = processedData.o3.map((item) => item.hour.slice(11))

    return {
      labels,
      datasets: [
        {
          label: 'O₃ (µg/m³)',
          data: processedData.o3.map((item) => item.avg),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'PM₁₀ (µg/m³)',
          data: processedData.pm10.map((item) => item.avg),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'PM₂.₅ (µg/m³)',
          data: processedData.pm25.map((item) => item.avg),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    }
  })

  return {
    chartData
  }
}
