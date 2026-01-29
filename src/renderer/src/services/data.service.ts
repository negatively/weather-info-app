import { HourlyData, HourlySummarize, StatSummarize } from '@renderer/types/data-process'
import _ from 'lodash'
import { RawAirQuality } from 'src/shared/types/airquality'

export async function fetchRawData(date: string) {
  return await window.api.fetchDataByDate(date)
}

//======================================

export async function avgByHour(rows: RawAirQuality) {
  // processing o3
  // kelompokkan data berdasar jam
  const groupedO3 = _.groupBy(rows.o3, (r: any) => {
    const d = new Date(r.LastUpdate)
    // gabungkan tanggal + jam agar tidak campur antar hari
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`
  })
  // Hitung rata-rata per grup
  const avgO3: HourlyData[] = Object.entries(groupedO3).map(([hour, values]: [string, any]) => {
    const avg = _.meanBy(values, 'O3')
    return { hour, avg, count: values?.length }
  })

  // processing pm25
  const groupedPm25 = _.groupBy(rows.pm25, (r: any) => {
    const d = new Date(r.LastUpdate)
    // gabungkan tanggal + jam agar tidak campur antar hari
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`
  })
  // Hitung rata-rata per grup
  const avgPm25: HourlyData[] = Object.entries(groupedPm25).map(([hour, values]: [string, any]) => {
    const avg = _.meanBy(values, 'PM25')
    return { hour, avg, count: values?.length }
  })

  // processing pm10
  const groupedPm10 = _.groupBy(rows.pm10, (r: any) => {
    const d = new Date(r.LastUpdate)
    // gabungkan tanggal + jam agar tidak campur antar hari
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`
  })
  // Hitung rata-rata per grup
  const avgPm10: HourlyData[] = Object.entries(groupedPm10).map(([hour, values]: [string, any]) => {
    const avg = _.meanBy(values, 'PM10')
    return { hour, avg, count: values?.length }
  })

  const response: HourlySummarize = {
    o3: avgO3,
    pm10: avgPm10,
    pm25: avgPm25
  }
  return response
}

export async function summarizeDaily(data: HourlySummarize) {
  const summarizePollutant = (arr: any[]) => {
    const nonNull = arr.filter((item) => item.avg !== null)
    const count = nonNull.length

    // If less than 12 valid data points → everything is "X"
    if (count < 12) {
      return {
        avg: 'X',
        min: 'X',
        max: 'X',
        hourMin: 'X',
        hourMax: 'X'
      }
    }

    // Compute raw values
    const rawMean = _.meanBy(nonNull, 'avg')
    const minData = _.minBy(nonNull, 'avg')
    const maxData = _.maxBy(nonNull, 'avg')

    // Apply Math.ceil ONLY when count > 12
    const applyRound = (val: number) => (count > 12 ? Math.round(val) : val)

    return {
      avg: applyRound(rawMean),
      min: applyRound(minData?.avg ?? 0),
      max: applyRound(maxData?.avg ?? 0),
      hourMin: minData?.hour ?? 'X',
      hourMax: maxData?.hour ?? 'X'
    }
  }

  const sumPm10 = summarizePollutant(data.pm10)
  const sumPm25 = summarizePollutant(data.pm25)
  const sumO3 = summarizePollutant(data.o3)

  const response: StatSummarize = { o3: sumO3, pm10: sumPm10, pm25: sumPm25 }
  console.error(response)

  return response
}

export async function dataCleansing(data: HourlySummarize, rescaling: boolean) {
  // pm25
  // remove 0 and 9999
  const delValPm25 = _.map(data.pm25, (n: HourlyData) => {
    return n.avg > 0.5 && n.avg < 9999 ? n : { ...n, avg: null }
  })

  // pm10
  // remove 0 and 9999
  const absPm10 = data.pm10.map((n: HourlyData) => {
    const nAvg = rescaling ? n.avg * 1000 : n.avg
    return {
      ...n,
      avg: nAvg
    }
  })
  const delValPm10 = _.map(absPm10, (n: HourlyData) => {
    return n.avg > 0.5 && n.avg < 9999 ? n : { ...n, avg: null }
  })
  // o3
  // remove 0 and 9999
  const delValO3 = _.map(data.o3, (n: HourlyData) => {
    return n.avg > 0.5 && n.avg < 9999 ? n : { ...n, avg: null }
  })

  const response: HourlySummarize = {
    o3: delValO3,
    pm10: delValPm10,
    pm25: delValPm25
  }
  return response
}
