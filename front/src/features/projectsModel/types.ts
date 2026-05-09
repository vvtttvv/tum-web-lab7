export type Theme = 'light' | 'dark'

export type Session = {
  id: string
  title: string
  elapsedSeconds: number
  totalSeconds: number
  color: string
  timerSettings: TimerSettings
  dailyLog: Record<string, number>
}

export type TimerSettings = {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  cycles: number
}

export type PomodoroPhase = 'focus' | 'short-break' | 'long-break' | 'complete'

export type Frequency = 'repeating' | 'one-time'
export type Period = 'daily' | 'weekly' | 'monthly'

export type ProjectFormState = {
  projectName: string
  duration: string
  frequency: Frequency
  period: Period
  selectedColor: string
  timerSettings: TimerSettings
}
