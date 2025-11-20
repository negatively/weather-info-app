export interface DatabaseConfig {
  host: string
  database: string
  user: string
  password: string
}

export interface SavedReport {
  id: string
  imagePath: string
  createdAt: string
  analystName: string
  dataDate: string
  imageBase64: any
}

export interface ScheduleConfig {
  air_time: string
}
