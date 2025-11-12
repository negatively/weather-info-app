import { SavedReport } from 'src/shared/types/store'

export interface DatabaseConfig {
  host: string
  database: string
  user: string
  password: string
}

declare global {
  interface Window {
    api: {
      getDbSettings: () => Promise<DatabaseConfig>
      setDbSettings: (settings: DatabaseConfig) => Promise<boolean>
      testDbConnection: () => Promise<{ success: boolean; message: string }>
      fetchDataByDate: (date: any) => Promise<{ success: boolean; data: any; message: string }>
      saveReport: (report: any, imageData: string) => Promise<{ success: boolean; message: string }>
      getSavedReports: () => Promise<SavedReport[]>
      getReportImage: (path: string) => Promise<string>
    }
  }
}

export {}
