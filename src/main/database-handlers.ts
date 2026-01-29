import { IpcMain } from 'electron'
import ElectronStore from 'electron-store'
import mysql from 'mysql2/promise'
import { DatabaseConfig } from '../shared/types/store'
import type { RawAirQuality, RawOzon, RawPM10, RawPM25 } from '../shared/types/airquality'

/**
 * Sets up IPC handlers for database-related operations,
 * like testing connection to a remote MySQL database.
 */
export const initializeDatabaseHandlers = (
  ipcMain: IpcMain,
  ElectronStoreClass: typeof ElectronStore
): void => {
  const store = new ElectronStoreClass({ name: 'config' })

  ipcMain.handle('test-db-connection', async () => {
    const dbConfig = store.get('dbSettings') as DatabaseConfig

    console.log('[DB Handler] Testing DB connection with:', dbConfig)

    try {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
      })
      await connection.end()
      console.log('[DB Handler] Connection successful!')
      return { success: true, message: 'Connection successful!' }
    } catch (error: any) {
      console.error('[DB Handler] Connection failed:', error.message)
      return { success: false, message: error.message }
    }
  })

  ipcMain.handle('fetch-data-by-date', async (event, targetDate: string) => {
    console.log(event.type)
    const config = store.get('dbSettings') as DatabaseConfig
    let connection: mysql.Connection | null = null

    try {
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
      })

      const [o3rows] = await connection.query<RawOzon[]>(
        `
        SELECT O3, DATE_ADD(LastUpdate, INTERVAL 7 HOUR) AS LastUpdate
        FROM tblo3_iq
        WHERE DATE(DATE_ADD(LastUpdate, INTERVAL 7 HOUR)) = ?
        ORDER BY LastUpdate
        `,
        [targetDate]
      )

      const [pm25rows] = await connection.query<RawPM25[]>(
        `
        SELECT PM25, DATE_ADD(LastUpdate, INTERVAL 7 HOUR) AS LastUpdate
        FROM tblpm25
        WHERE DATE(DATE_ADD(LastUpdate, INTERVAL 7 HOUR)) = ?
        ORDER BY LastUpdate
        `,
        [targetDate]
      )

      const [pm10rows] = await connection.query<RawPM10[]>(
        `
        SELECT PM10, DATE_ADD(LastUpdate, INTERVAL 7 HOUR) AS LastUpdate
        FROM tblpm10
        WHERE DATE(DATE_ADD(LastUpdate, INTERVAL 7 HOUR)) = ?
        ORDER BY LastUpdate
        `,
        [targetDate]
      )

      const response: RawAirQuality = {
        pm25: pm25rows,
        pm10: pm10rows,
        o3: o3rows
      }

      return { success: true, data: response, message: 'Data fetched successfully' }
    } catch (error: any) {
      return { success: false, message: `Database query failed: ${error.message}` }
    } finally {
      if (connection) await connection.end()
    }
  })
}
