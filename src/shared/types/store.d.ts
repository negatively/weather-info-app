export interface DatabaseConfig {
  host: string
  database: string
  user: string
  password: string
}

export interface SavedReport {
  imagePath: string
  createdAt: string
  analystName: string
}
