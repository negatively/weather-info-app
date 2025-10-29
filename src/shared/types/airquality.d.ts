import { RowDataPacket } from 'mysql2'

export interface RawPM10 extends RowDataPacket {
  LastUpdate: Date
  PM10: number
}

export interface RawPM25 extends RowDataPacket {
  LastUpdate: Date
  PM25: number
}

export interface RawOzon extends RowDataPacket {
  LastUpdate: Date
  O3: number
}

export interface RawAirQuality {
  pm10: RawPM10[]
  pm25: RawPM25[]
  o3: RawOzon[]
}
