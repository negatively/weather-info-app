import { DatabaseConfig, SavedReport } from '../../../shared/types/store'

export interface ReportAPI {
  // Database settings
  getDbSettings: () => Promise<{
    host: string
    database: string
    user: string
    password: string
  }>
  setDbSettings: (settings: {
    host: string
    database: string
    user: string
    password: string
  }) => Promise<boolean>
  testDbConnection: () => Promise<{ success: boolean; message: string }>
  fetchDataByDate: (date: string) => Promise<any>

  // Report management
  getSavedReports: () => Promise<SavedReport[]>
  saveReport: (
    report: Omit<SavedReport, 'imagePath'>,
    imageData: string
  ) => Promise<{
    success: boolean
    report?: SavedReport
    error?: string
  }>
  deleteReport: (reportId: string) => Promise<{
    success: boolean
    error?: string
  }>
  getReportImage: (filePath: string) => Promise<string | null>
}
