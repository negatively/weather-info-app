import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Database settings
  getDbSettings: () => ipcRenderer.invoke('get-db-settings'),
  setDbSettings: (settings) => ipcRenderer.invoke('set-db-settings', settings),
  getSchSettings: () => ipcRenderer.invoke('get-sch-settings'),
  setSchSettings: (settings) => ipcRenderer.invoke('set-sch-settings', settings),
  testDbConnection: () => ipcRenderer.invoke('test-db-connection'),
  fetchDataByDate: (date) => ipcRenderer.invoke('fetch-data-by-date', date),

  // Report management
  getSavedReports: () => ipcRenderer.invoke('get-saved-reports'),
  saveReport: (report: any, imageData: string) =>
    ipcRenderer.invoke('save-report', { report, imageData }),
  deleteReport: (reportId: string) => ipcRenderer.invoke('delete-report', reportId),
  getReportImage: (filePath: string) => ipcRenderer.invoke('get-report-image', filePath),
  copyImage: (data) => ipcRenderer.invoke('copy-image', data),
  copyCaption: (data) => ipcRenderer.invoke('copy-caption', data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
