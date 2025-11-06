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
}
