import type { PomodoroPhase, TimerSettings } from '../../projectsModel/types'

export type ActiveTimerState = {
  sessionId: string
  phase: PomodoroPhase
  secondsLeft: number
  cycleIndex: number
  isRunning: boolean
  isComplete: boolean
}

export const createTimerState = (sessionId: string, settings: TimerSettings): ActiveTimerState => ({
  sessionId,
  phase: 'focus',
  secondsLeft: settings.focusMinutes * 60,
  cycleIndex: 1,
  isRunning: true,
  isComplete: false,
})

export const getPhaseDurationSeconds = (settings: TimerSettings, phase: PomodoroPhase) => {
  switch (phase) {
    case 'focus':
      return settings.focusMinutes * 60
    case 'short-break':
      return settings.shortBreakMinutes * 60
    case 'long-break':
      return settings.longBreakMinutes * 60
    default:
      return 0
  }
}

export const formatTimerSettingsSummary = (settings: TimerSettings) =>
  `Countdown • ${settings.focusMinutes}/${settings.shortBreakMinutes}/${settings.longBreakMinutes} | ${settings.cycles}`

export const getPhaseLabel = (phase: PomodoroPhase) => {
  switch (phase) {
    case 'focus':
      return 'Focus'
    case 'short-break':
      return 'Break'
    case 'long-break':
      return 'Long break'
    case 'complete':
      return 'Overtime'
    default:
      return 'Timer'
  }
}

export const advanceTimerState = (state: ActiveTimerState, settings: TimerSettings): ActiveTimerState => {
  if (!state.isRunning) {
    return state
  }

  if (state.isComplete) {
    return {
      ...state,
      secondsLeft: state.secondsLeft - 1,
    }
  }

  const nextSecondsLeft = state.secondsLeft - 1

  if (nextSecondsLeft >= 0) {
    return {
      ...state,
      secondsLeft: nextSecondsLeft,
    }
  }

  if (state.phase === 'focus') {
    if (state.cycleIndex >= settings.cycles) {
      if (settings.longBreakMinutes > 0) {
        return {
          ...state,
          phase: 'long-break',
          secondsLeft: settings.longBreakMinutes * 60,
        }
      }

      return {
        ...state,
        phase: 'complete',
        secondsLeft: -1,
        isComplete: true,
      }
    }

    return {
      ...state,
      phase: 'short-break',
      secondsLeft: settings.shortBreakMinutes * 60,
    }
  }

  if (state.phase === 'short-break') {
    return {
      ...state,
      phase: 'focus',
      secondsLeft: settings.focusMinutes * 60,
      cycleIndex: state.cycleIndex + 1,
    }
  }

  if (state.phase === 'long-break') {
    return {
      ...state,
      phase: 'complete',
      secondsLeft: -1,
      isComplete: true,
    }
  }

  return {
    ...state,
    phase: 'complete',
    secondsLeft: -1,
    isComplete: true,
  }
}
