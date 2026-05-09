const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatTimerClock = (secondsLeft: number) => {
  const isOvertime = secondsLeft < 0
  const totalSeconds = Math.abs(secondsLeft)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const clock = `${pad2(minutes)}:${pad2(seconds)}`

  return isOvertime ? `+${clock}` : clock
}
