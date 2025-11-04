import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAirQualityStore = defineStore('airQuality', () => {
  const processed = ref<any>(null)
  const summarize = ref<any>(null)
  const date = ref<any>(null)

  const setSummarize = (data: any) => {
    summarize.value = data
  }

  const setProcessed = (data: any) => {
    processed.value = data
  }

  const setDate = (data: any) => {
    date.value = data
  }

  return {
    summarize,
    setSummarize,
    processed,
    setProcessed,
    date,
    setDate
  }
})
