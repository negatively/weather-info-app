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
  // pm10
  const avgPm10 = _.meanBy(data.pm10, 'avg')
  const minDataPm10 = _.minBy(data.pm10, 'avg')
  const maxDataPm10 = _.maxBy(data.pm10, 'avg')

  const sumPm10 = {
    avg: avgPm10,
    min: minDataPm10?.avg ?? 0,
    max: maxDataPm10?.avg ?? 0,
    hourMin: minDataPm10?.hour ?? null,
    hourMax: maxDataPm10?.hour ?? null
  }

  // pm25
  const avgPm25 = _.meanBy(data.pm25, 'avg')
  const minDataPm25 = _.minBy(data.pm25, 'avg')
  const maxDataPm25 = _.maxBy(data.pm25, 'avg')

  const sumPm25 = {
    avg: avgPm25,
    min: minDataPm25?.avg ?? 0,
    max: maxDataPm25?.avg ?? 0,
    hourMin: minDataPm25?.hour ?? null,
    hourMax: maxDataPm25?.hour ?? null
  }

  // pm10
  const avgO3 = _.meanBy(data.o3, 'avg')
  const minDataO3 = _.minBy(data.o3, 'avg')
  const maxDataO3 = _.maxBy(data.o3, 'avg')

  const sumO3 = {
    avg: avgO3,
    min: minDataO3?.avg ?? 0,
    max: maxDataO3?.avg ?? 0,
    hourMin: minDataO3?.hour ?? null,
    hourMax: maxDataO3?.hour ?? null
  }
  const response: StatSummarize = { o3: sumO3, pm10: sumPm10, pm25: sumPm25 }
  return response
}

export async function dataCleansing(data: HourlySummarize) {
  // pm25
  // remove 0 and 9999
  const absPm25 = data.pm25.map((n: HourlyData) => ({
    ...n,
    avg: Math.abs(n.avg)
  }))

  const delValPm25 = _.map(absPm25, (n: HourlyData) => {
    return n.avg != 0 && n.avg < 9999 ? n : { ...n, avg: null }
  })

  // pm10
  // remove 0 and 9999
  const absPm10 = data.pm10.map((n: HourlyData) => {
    const absAvg = Math.abs(n.avg)
    console.log(absAvg)
    const nAvg = absAvg < 1 ? absAvg * 1000 : absAvg
    console.warn(nAvg)
    return {
      ...n,
      avg: nAvg
    }
  })
  const delValPm10 = _.map(absPm10, (n: HourlyData) => {
    return n.avg != 0 && n.avg < 9999 ? n : { ...n, avg: null }
  })
  console.log(delValPm10)
  // o3
  // remove 0 and 9999
  const absO3 = data.o3.map((n: HourlyData) => ({
    ...n,
    avg: Math.abs(n.avg)
  }))

  const delValO3 = _.map(absO3, (n: HourlyData) => {
    return n.avg != 0 && n.avg < 9999 ? n : { ...n, avg: null }
  })

  const response: HourlySummarize = {
    o3: delValO3,
    pm10: delValPm10,
    pm25: delValPm25
  }
  return response
}
