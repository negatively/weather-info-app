import { ref, type Ref } from 'vue'
import templateImage from '@renderer/assets/template.png'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import { SavedReport } from 'src/shared/types/store'

interface SummarizeData {
  pm25: {
    avg: number
    max: number
    min: number
    hourMax: string
    hourMin: string
  }
  pm10: {
    avg: number
    max: number
    min: number
    hourMax: string
    hourMin: string
  }
  o3: {
    avg: number
    max: number
    min: number
    hourMax: string
    hourMin: string
  }
}

const CANVAS_STYLES = {
  fonts: {
    normal: '22px Poppins',
    bold18: 'bold 18px Poppins',
    bold26: 'bold 26px Poppins',
    bold40: 'bold 40px Poppins'
  },
  positions: {
    description: { x: 100, y: 400, maxWidth: 1400, lineHeight: 30 },
    conclusion: { x: 120, y: 920, maxWidth: 500, lineHeight: 30 },
    explanation: { x: 720, y: 920, maxWidth: 750, lineHeight: 30 },
    signature: {
      date: { x: 250, y: 1412 },
      name: { x: 250, y: 1457 }
    }
  }
}

export function useCanvasReport() {
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const paragraphs = text.split('\\n')
    let currentY = y

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ')
      let line = ''

      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, x, currentY)
          line = word
          currentY += lineHeight
        } else {
          line = testLine
        }
      }

      if (line) {
        ctx.fillText(line, x, currentY)
      }

      currentY += lineHeight
    }

    return currentY
  }

  const extractHour = (dateTimeString: string | null) => {
    if (!dateTimeString || dateTimeString === 'X') return 'X'

    const date = new Date(dateTimeString)
    if (isNaN(date.getTime())) return 'X' // invalid date handling

    return date.getHours().toString().padStart(2, '0')
  }

  const initCanvas = (
    summarizeData: Ref<SummarizeData | null>,
    nameInput: Ref<string>,
    date: Ref<any>
  ) => {
    if (!canvasRef.value || !summarizeData.value) return
    const ctx = canvasRef.value.getContext('2d')
    if (!ctx) return

    dayjs.locale('id')
    const dataDate = dayjs(date.value).format('DD MMMM YYYY')

    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    const img = new Image()
    img.src = templateImage
    img.onload = async () => {
      // Pastikan font Poppins sudah ter-load
      ;(await document.fonts.load('16px "Poppins"'),
        await document.fonts.load('22px "Poppins"'),
        await document.fonts.load('bold 16px "Poppins"'),
        await document.fonts.load('bold 40px "Poppins"'),
        await document.fonts.ready)
      ctx.drawImage(img, 0, 0, canvasRef.value!.width, canvasRef.value!.height)

      ctx.font = CANVAS_STYLES.fonts.bold40
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = '#01729A'
      ctx.fillText(dataDate, 800, 325)

      // Draw description text
      ctx.font = CANVAS_STYLES.fonts.normal
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      const description = `Pengukuran dilakukan pada tanggal ${dataDate} periode pukul 00 WIB hingga 23 WIB di Stasiun Pemantau Atmosfer Global (GAW) Bukit Kototabang. Informasi kualitas udara yang dianalisis berdasarkan pantauan alat kualitas udara BAM 1020 untuk monitoring parameter aerosol partikulat debu halus (PM2.5) dan debu (PM10) dan Thermo 49iQ Series untuk monitoring parameter gas reaktif ozon permukaan (O3).`
      drawWrappedText(
        ctx,
        description,
        CANVAS_STYLES.positions.description.x,
        CANVAS_STYLES.positions.description.y,
        CANVAS_STYLES.positions.description.maxWidth,
        CANVAS_STYLES.positions.description.lineHeight
      )

      const conclusion = 'Nilai konsentrasi parameter PM10 dan PM2.5 berada pada kategori BAIK.'
      drawWrappedText(
        ctx,
        conclusion,
        CANVAS_STYLES.positions.conclusion.x,
        CANVAS_STYLES.positions.conclusion.y,
        CANVAS_STYLES.positions.conclusion.maxWidth,
        CANVAS_STYLES.positions.conclusion.lineHeight
      )

      // Draw signature
      ctx.font = CANVAS_STYLES.fonts.bold18
      const formattedDate = dayjs().format('DD MMMM YYYY HH.mm [WIB]')
      ctx.fillText(
        formattedDate,
        CANVAS_STYLES.positions.signature.date.x,
        CANVAS_STYLES.positions.signature.date.y
      )
      ctx.fillText(
        nameInput.value,
        CANVAS_STYLES.positions.signature.name.x,
        CANVAS_STYLES.positions.signature.name.y
      )

      if (summarizeData.value) {
        // Draw values
        ctx.font = CANVAS_STYLES.fonts.bold40
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.save()
        // avg pm2.5
        ctx.fillStyle = getColorPM25(summarizeData.value.pm25.avg)
        ctx.fillRect(198, 665, 107, 114)
        // avg pm10
        ctx.fillStyle = getColorPM10(summarizeData.value.pm10.avg)
        ctx.fillRect(685, 665, 106, 114)

        // max pm2.5
        ctx.fillStyle = getColorPM25(summarizeData.value.pm25.max)
        ctx.fillRect(309, 665, 106, 56)
        // max pm10
        ctx.fillStyle = getColorPM10(summarizeData.value.pm10.max)
        ctx.fillRect(796, 665, 106, 56)

        // min pm2.5
        ctx.fillStyle = getColorPM25(summarizeData.value.pm25.min)
        ctx.fillRect(421, 665, 106, 55)
        // min pm10
        ctx.fillStyle = getColorPM25(summarizeData.value.pm10.min)
        ctx.fillRect(908, 665, 106, 55)

        // Value
        ctx.font = CANVAS_STYLES.fonts.bold26
        const data = summarizeData.value
        ctx.fillStyle = getColorTextPM25(data.pm25.avg)
        ctx.fillText(data.pm25.avg.toString(), 250, 730)
        ctx.fillStyle = getColorTextPM10(data.pm10.avg)
        ctx.fillText(data.pm10.avg.toString(), 740, 730)
        ctx.fillStyle = getColorTextPM25(data.pm25.max)
        ctx.fillText(data.pm25.max.toString(), 360, 695)
        ctx.fillStyle = getColorTextPM10(data.pm10.max)
        ctx.fillText(data.pm10.max.toString(), 850, 695)
        ctx.fillStyle = getColorTextPM25(data.pm25.min)
        ctx.fillText(data.pm25.min.toString(), 475, 695)
        ctx.fillStyle = getColorTextPM10(data.pm10.min)
        ctx.fillText(data.pm10.min.toString(), 960, 695)
        ctx.fillStyle = '#fff'

        ctx.restore()

        // Draw averages

        ctx.fillText(data.o3.avg.toString(), 1225, 730)

        ctx.font = CANVAS_STYLES.fonts.bold26
        // Draw max/min values

        ctx.fillText(data.o3.max.toString(), 1335, 695)

        ctx.fillText(data.o3.min.toString(), 1445, 695)

        // Draw hours
        ctx.fillText(extractHour(data.pm25.hourMax), 360, 765)
        ctx.fillText(extractHour(data.pm10.hourMax), 850, 765)
        ctx.fillText(extractHour(data.o3.hourMax), 1335, 765)

        ctx.fillText(extractHour(data.pm25.hourMin), 475, 765)
        ctx.fillText(extractHour(data.pm10.hourMin), 960, 765)
        ctx.fillText(extractHour(data.o3.hourMin), 1445, 765)

        ctx.font = CANVAS_STYLES.fonts.normal
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        const explanation = `Rata-rata Konsentrasi  PM2.5  sebesar ${data.pm25.avg}  µg/m3. \\nKonsentrasi tertinggi sebesar ${data.pm25.max}  µg/m3  terjadi pada pukul ${extractHour(data.pm25.hourMax)} \\ndan konsentrasi  terendah sebesar ${data.pm25.min} µg/m3 terjadi pada pukul ${extractHour(data.pm25.hourMin)}. \\n\\n Rata-rata Konsentrasi  PM10  sebesar ${data.pm10.avg}  µg/m3. \\nKonsentrasi tertinggi sebesar ${data.pm10.max}  µg/m3  terjadi pada pukul ${extractHour(data.pm10.hourMax)} \\ndan konsentrasi  terendah sebesar ${data.pm10.min} µg/m3 terjadi pada pukul ${extractHour(data.pm10.hourMin)}.\\n\\n Rata-rata Konsentrasi  O3  sebesar ${data.o3.avg}  ppb. \\nKonsentrasi tertinggi sebesar ${data.o3.max}  ppb  terjadi pada pukul ${extractHour(data.o3.hourMax)} \\ndan konsentrasi  terendah sebesar ${data.o3.min} ppb terjadi pada pukul ${extractHour(data.o3.hourMin)}.`

        drawWrappedText(
          ctx,
          explanation,
          CANVAS_STYLES.positions.explanation.x,
          CANVAS_STYLES.positions.explanation.y,
          CANVAS_STYLES.positions.explanation.maxWidth,
          CANVAS_STYLES.positions.explanation.lineHeight
        )
      }
    }
  }

  const downloadReport = () => {
    if (!canvasRef.value) return
    const link = document.createElement('a')
    link.download = `air-quality-report-${Date.now()}.png`
    link.href = canvasRef.value.toDataURL('image/png')
    link.click()
  }

  const saveReport = async (analystName: string, dataDate: any) => {
    if (!canvasRef.value) {
      console.error('Canvas not found')
      return
    }

    const base64Image = canvasRef.value.toDataURL('image/png')
    dayjs.locale('id')
    const date = dayjs()
    const formattedDate = date.format('DD MMMM YYYY HH.mm [WIB]')

    const formattedDataDate = dayjs(dataDate).format('DD MMMM YYYY')
    console.log(formattedDataDate)
    const report: SavedReport = {
      id: date.toISOString(),
      imagePath: '',
      createdAt: formattedDate,
      analystName: analystName,
      dataDate: formattedDataDate,
      imageBase64: ''
    }

    const result = window.api.saveReport(report, base64Image)
  }

  const getColorPM25 = (value) => {
    if (value >= 0 && value <= 15.5) return 'rgb(0,204,0)' // hijau
    if (value >= 15.6 && value <= 55.4) return 'rgb(0,51,255)' // biru
    if (value >= 55.5 && value <= 150.4) return 'rgb(255,255,0)' // kuning
    return 'rgb(0,204,0)'
  }

  const getColorPM10 = (value) => {
    if (value >= 0 && value <= 50) return 'rgb(0,204,0)' // hijau
    if (value >= 51 && value <= 150) return 'rgb(0,51,255)' // biru
    if (value >= 151 && value <= 350) return 'rgb(255,255,0)' // kuning
    return 'rgb(0,204,0)'
  }

  const getColorTextPM25 = (value) => {
    if (value >= 0 && value <= 55.4) return 'rgb(255,255,255)'
    if (value >= 55.5 && value <= 150.4) return 'rgb(0,0,0)'
    return 'rgb(255,255,255)'
  }

  const getColorTextPM10 = (value) => {
    if (value >= 0 && value <= 150) return 'rgb(255,255,255)'
    if (value >= 151 && value <= 350) return 'rgb(0,0,0)'
    return 'rgb(255,255,255)'
  }

  return {
    canvasRef,
    initCanvas,
    downloadReport,
    saveReport
  }
}
