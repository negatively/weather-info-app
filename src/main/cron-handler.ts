import cron from 'node-cron'

let currentCronTask: ReturnType<typeof cron.schedule> | null = null

export const startCronJob = (hour: string, minute: string) => {
  if (currentCronTask) {
    currentCronTask.stop()
    currentCronTask = null
  }

  const expr = `${minute} ${hour} * * *`
  console.log('Cron running with:', expr)

  currentCronTask = cron.schedule(expr, () => {
    console.log('CRON executed at:', new Date())
  })

  currentCronTask.start()
}

export const loadCronOnStartup = (savedTime: string | null) => {
  if (!savedTime) {
    console.log('No cron schedule found.')
    return
  }

  const [hour, minute] = savedTime.split(':')
  startCronJob(hour, minute)
}
