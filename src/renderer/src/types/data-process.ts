export interface HourlyData {
  hour: any
  avg: any
  count: any
}

export interface HourlySummarize {
  pm10: HourlyData[]
  pm25: HourlyData[]
  o3: HourlyData[]
}

export interface StatSummarize {
  pm10: any
  pm25: any
  o3: any
}
