import { clipboard, IpcMain, nativeImage } from 'electron'
import fs from 'fs'
/**
 * Sets up IPC handlers for action-related operations,
 */
export const initializeActionHandlers = (ipcMain: IpcMain): void => {
  ipcMain.handle('copy-image', async (_event, { imageBase64 }) => {
    try {
      const image = nativeImage.createFromDataURL(imageBase64)

      // Clear first (good hygiene)
      clipboard.clear()

      // Copy both image and text
      clipboard.write({
        image
      })

      console.log('[Clipboard] Image successfully.')
      return { success: true }
    } catch (error) {
      console.error('[Clipboard] Error copying image :', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('copy-caption', async (_event, { caption }) => {
    try {
      clipboard.clear()
      clipboard.write({ text: caption })

      console.log('[Clipboard] Caption successfully.')
      return { success: true }
    } catch (error) {
      console.error('[Clipboard] Error copying caption :', error)
      return { success: false, error: String(error) }
    }
  })

  // IPC Handler: Get Report Image
  ipcMain.handle('get-report-image', (_event, filePath: string) => {
    try {
      const imageBuffer = fs.readFileSync(filePath)
      return `data:image/png;base64,${imageBuffer.toString('base64')}`
    } catch (error) {
      console.error('[Store Handler] Error reading report image:', error)
      return null
    }
  })
}
