const pad2 = (value: number) => String(value).padStart(2, '0')

export const parseDurationToSeconds = (value: string) => {
  const hoursMatch = value.match(/(\d+)\s*h/)
  const minutesMatch = value.match(/(\d+)\s*m/)

  const hours = hoursMatch ? Number.parseInt(hoursMatch[1], 10) : 0
  const minutes = minutesMatch ? Number.parseInt(minutesMatch[1], 10) : 0

  return hours * 3600 + minutes * 60
}

export const formatHoursMinutes = (seconds: number) => {
  const totalMinutes = Math.max(0, Math.floor(seconds / 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${pad2(minutes)}m`
}

export const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = pad2(now.getMonth() + 1)
  const day = pad2(now.getDate())
  return `${year}-${month}-${day}`
}
