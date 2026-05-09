import type { Session } from '../../projectsModel/types'
import { formatTimerClock } from '../utils/time'
import { formatTimerSettingsSummary, getPhaseLabel } from '../utils/pomodoro'
import type { TimerInfo } from '../hooks/usePomodoroTimer'

type TimerStatusProps = {
  session: Session
  timerInfo: TimerInfo | null
}

export function TimerStatus({ session, timerInfo }: TimerStatusProps) {
  if (!timerInfo) {
    return <p className="task-timer">{formatTimerSettingsSummary(session.timerSettings)}</p>
  }

  const label = getPhaseLabel(timerInfo.phase)
  const timeLabel = formatTimerClock(timerInfo.secondsLeft)

  return (
    <p className="task-timer">
      {label} • {timeLabel} · {timerInfo.cycleIndex}/{timerInfo.cycles}
    </p>
  )
}
