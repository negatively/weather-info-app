import { ElectronAPI } from '@electron-toolkit/preload'
import { ReportAPI } from '../renderer/src/types/api'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ReportAPI
  }
}
