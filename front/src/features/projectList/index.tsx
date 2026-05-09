import type { Session } from '../projectsModel/types'
import { ProjectCard } from './components/ProjectCard'
import { usePomodoroTimer } from './hooks/usePomodoroTimer'

type ProjectsListProps = {
  sessions: Session[]
  onUpdateSession: (sessionId: string, patch: Partial<Session>) => void
}

export function ProjectsList({ sessions, onUpdateSession }: ProjectsListProps) {
  const { handlePlay, getTimerInfo } = usePomodoroTimer({ sessions, onUpdateSession })

  if (sessions.length === 0) {
    return (
      <article className="empty-state">
        <p className="empty-title">No projects yet</p>
        <p className="empty-subtitle">Tap the + button below to create your first focus session.</p>
      </article>
    )
  }

  return (
    <section className="space-y-4">
      {sessions.map((session) => (
        <ProjectCard
          key={session.id}
          session={session}
          timerInfo={getTimerInfo(session.id)}
          onPlay={handlePlay}
        />
      ))}
    </section>
  )
}
