import { clipboard, IpcMain, nativeImage, shell } from 'electron'
import ElectronStore from 'electron-store'
import { saveReportImage, deleteReportImage } from './report-handlers'
import { DatabaseConfig, SavedReport } from '../shared/types/store'

/**
 * Initializes the ElectronStore instance and sets up the IPC handlers
 * for loading and saving database configuration settings.
 *
 * @param ipcMain The electron ipcMain module for handling renderer requests.
 * @param ElectronStoreClass The ElectronStore class (passed in to handle import nuances).
 */
export const initializeStoreHandlers = (
  ipcMain: IpcMain,
  ElectronStoreClass: typeof ElectronStore
): void => {
  // Initialize the Store instance
  const store = new ElectronStoreClass({ name: 'config' })
  const ImageStore = new ElectronStoreClass({ name: 'reports' })

  // Define the default settings structure
  const defaultDBSettings: DatabaseConfig = {
    host: '127.0.0.1',
    database: 'gawdata',
    user: 'root',
    password: ''
  }

  // IPC Handler: Load Settings
  ipcMain.handle('get-db-settings', () => {
    console.log('[Store Handler] Loading DB settings.')
    // Retrieves settings, falling back to defaults if not found
    return store.get('dbSettings', defaultDBSettings)
  })

  // IPC Handler: Save Settings
  ipcMain.handle('set-db-settings', (_event, settings) => {
    console.log('[Store Handler] Saving new DB settings:', settings)
    store.set('dbSettings', settings)
    return true
  })

  // IPC Handler: Get Saved Reports
  ipcMain.handle('get-saved-reports', () => {
    console.log('[Store Handler] Loading saved reports.')
    const reports = ImageStore.get('AirQualityReports', []) as SavedReport[]
    // Sort newest first, then take only the top 2
    const newestReports = reports
      .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
      .slice(0, 8)

    return newestReports
  })

  // IPC Handler: Save Report
  ipcMain.handle(
    'save-report',
    (_event, { report, imageData }: { report: SavedReport; imageData: string }) => {
      console.log('[Store Handler] Saving new report:', report.createdAt)

      try {
        // Save the image file
        const fileName = `report-${report.createdAt}.png`
        const imagePath = saveReportImage(imageData, fileName)

        // Update the report with the correct image path
        const reportToSave = {
          ...report,
          imagePath
        }

        // Save to store
        const reports = ImageStore.get('AirQualityReports', [] as SavedReport[]) as SavedReport[]
        reports.push(reportToSave)
        ImageStore.set('AirQualityReports', reports)

        return { success: true, message: reportToSave }
      } catch (error) {
        console.error('[Store Handler] Error saving report:', error)
        return { success: false, message: 'Failed to save report' }
      }
    }
  )

  // IPC Handler: Delete Report
  ipcMain.handle('delete-report', (_event, reportCreatedAt: string) => {
    console.log('[Store Handler] Deleting report:', reportCreatedAt)
    const reports = ImageStore.get('AirQualityReports', [] as SavedReport[]) as SavedReport[]
    const reportToDelete = reports.find((report) => report.createdAt === reportCreatedAt)

    if (reportToDelete) {
      // Delete the image file
      deleteReportImage(reportToDelete.imagePath)

      // Update the store
      const updatedReports = reports.filter((report) => report.createdAt !== reportCreatedAt)
      store.set('AirQualityReports', updatedReports)
      return { success: true }
    }

    return { success: false, error: 'Report not found' }
  })
}
