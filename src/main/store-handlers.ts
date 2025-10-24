import { IpcMain } from 'electron'
import ElectronStore from 'electron-store'

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

  // Define the default settings structure
  const defaultDBSettings = {
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
  ipcMain.handle('set-db-settings', (event, settings) => {
    console.log('[Store Handler] Saving new DB settings:', settings)
    store.set('dbSettings', settings)
    return true
  })
}
