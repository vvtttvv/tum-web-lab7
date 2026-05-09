import { useEffect, useRef, useState } from 'react'
import type { Session } from '../../projectsModel/types'
import { getTodayKey } from '../../projectsModel/time'
import {
  advanceTimerState,
  createTimerState,
  getPhaseDurationSeconds,
  type ActiveTimerState,
} from '../utils/pomodoro'

export type TimerInfo = {
  phase: ActiveTimerState['phase']
  secondsLeft: number
  cycleIndex: number
  cycles: number
  isRunning: boolean
  isComplete: boolean
  phaseTotalSeconds: number
}

type UsePomodoroTimerArgs = {
  sessions: Session[]
  onUpdateSession: (sessionId: string, patch: Partial<Session>) => void
}

export const usePomodoroTimer = ({ sessions, onUpdateSession }: UsePomodoroTimerArgs) => {
  const [timerState, setTimerState] = useState<ActiveTimerState | null>(null)
  const sessionsRef = useRef(sessions)
  const updateRef = useRef(onUpdateSession)

  useEffect(() => {
    sessionsRef.current = sessions
    updateRef.current = onUpdateSession
  }, [onUpdateSession, sessions])

  useEffect(() => {
    if (!timerState?.isRunning) {
      return
    }

    const interval = window.setInterval(() => {
      setTimerState((current) => {
        if (!current || !current.isRunning) {
          return current
        }

        const session = sessionsRef.current.find((item) => item.id === current.sessionId)
        if (!session) {
          return current
        }

        if (current.phase === 'focus' && !current.isComplete) {
          const todayKey = getTodayKey()
          const nextDailyLog = {
            ...session.dailyLog,
            [todayKey]: (session.dailyLog[todayKey] ?? 0) + 1,
          }

          updateRef.current(session.id, {
            elapsedSeconds: session.elapsedSeconds + 1,
            dailyLog: nextDailyLog,
          })
        }

        return advanceTimerState(current, session.timerSettings)
      })
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [timerState?.isRunning, timerState?.sessionId])

  const handlePlay = (sessionId: string) => {
    setTimerState((current) => {
      if (current?.sessionId === sessionId) {
        return {
          ...current,
          isRunning: !current.isRunning,
        }
      }

      const session = sessionsRef.current.find((item) => item.id === sessionId)
      if (!session) {
        return current
      }

      return createTimerState(session.id, session.timerSettings)
    })
  }

  const getTimerInfo = (sessionId: string): TimerInfo | null => {
    if (!timerState || timerState.sessionId !== sessionId) {
      return null
    }

    const session = sessionsRef.current.find((item) => item.id === sessionId)
    if (!session) {
      return null
    }

    return {
      phase: timerState.phase,
      secondsLeft: timerState.secondsLeft,
      cycleIndex: timerState.cycleIndex,
      cycles: session.timerSettings.cycles,
      isRunning: timerState.isRunning,
      isComplete: timerState.isComplete,
      phaseTotalSeconds: getPhaseDurationSeconds(session.timerSettings, timerState.phase),
    }
  }

  return {
    timerState,
    handlePlay,
    getTimerInfo,
  }
}
