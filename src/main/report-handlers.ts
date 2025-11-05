import { app } from 'electron'
import fs from 'fs'
import path from 'path'

/**
 * Creates the reports directory if it doesn't exist
 * @returns The absolute path to the reports directory
 */
export const ensureReportsDirectory = (): string => {
  const userDataPath = app.getPath('userData')
  const reportsPath = path.join(userDataPath, 'reports')

  if (!fs.existsSync(reportsPath)) {
    fs.mkdirSync(reportsPath, { recursive: true })
  }

  return reportsPath
}

/**
 * Saves a base64 image to the reports directory
 * @param base64Data Base64 string of the image (without the data:image/png;base64, prefix)
 * @param fileName Name of the file to save
 * @returns The absolute path to the saved file
 */
export const saveReportImage = (base64Data: string, fileName: string): string => {
  const reportsPath = ensureReportsDirectory()
  const safeFileName = fileName.replace(/[<>:"/\\|?*]/g, '_')
  const filePath = path.join(reportsPath, safeFileName)

  // Remove data URL prefix if present
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')

  // Save the image
  fs.writeFileSync(filePath, base64Image, { encoding: 'base64' })

  return filePath
}

/**
 * Deletes a report image file
 * @param filePath Absolute path to the image file
 * @returns true if deletion was successful, false otherwise
 */
export const deleteReportImage = (filePath: string): boolean => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('[Report Handler] Error deleting file:', error)
    return false
  }
}

/**
 * Gets the absolute path to a report image
 * @param fileName Name of the report image file
 * @returns The absolute path to the image file
 */
export const getReportImagePath = (fileName: string): string => {
  const reportsPath = ensureReportsDirectory()
  return path.join(reportsPath, fileName)
}
