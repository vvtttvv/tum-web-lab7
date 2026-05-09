import type { Session } from '../../projectsModel/types'
import { formatHoursMinutes, getTodayKey } from '../../projectsModel/time'
import type { TimerInfo } from '../hooks/usePomodoroTimer'
import { getPhaseDurationSeconds } from '../utils/pomodoro'
import { TimerStatus } from './TimerStatus'

type ProjectCardProps = {
  session: Session
  timerInfo: TimerInfo | null
  onPlay: (sessionId: string) => void
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value))

export function ProjectCard({ session, timerInfo, onPlay }: ProjectCardProps) {
  const todayKey = getTodayKey()
  const workedSeconds = session.dailyLog[todayKey] ?? 0
  const elapsedLabel = formatHoursMinutes(workedSeconds)
  const totalLabel = formatHoursMinutes(session.totalSeconds)

  const focusTotal = timerInfo ? getPhaseDurationSeconds(session.timerSettings, timerInfo.phase) : 0
  const focusProgress =
    timerInfo && focusTotal > 0
      ? clampPercent(((focusTotal - Math.max(timerInfo.secondsLeft, 0)) / focusTotal) * 100)
      : 0

  const isActive = Boolean(timerInfo)
  const playIcon = timerInfo?.isRunning ? '⏸' : '▶'
  const playLabel = timerInfo?.isRunning ? 'Pause task' : 'Start task'

  return (
    <article className={`task-card${isActive ? ' active' : ''}`}>
      <div className="task-row">
        <button
          className="play-btn"
          aria-label={playLabel}
          type="button"
          style={{ backgroundColor: session.color }}
          onClick={() => onPlay(session.id)}
        >
          {playIcon}
        </button>

        <div className="task-content">
          <div className="task-header">
            <div>
              <h2 className="task-title">{session.title}</h2>
              <p className="task-subtitle">
                {elapsedLabel} / {totalLabel}
              </p>
              <TimerStatus session={session} timerInfo={timerInfo} />
            </div>
            <span className="task-arrow">›</span>
          </div>

          <div className="task-progress-row">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${focusProgress}%` }}></div>
            </div>
            <span className="task-percent">{Math.round(focusProgress)}%</span>
          </div>
        </div>
      </div>
    </article>
  )
}
