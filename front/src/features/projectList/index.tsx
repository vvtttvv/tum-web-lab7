import type { Session } from '../projectsModel/types'
import { ProjectCard } from './components/ProjectCard'
import { Pagination } from './components/Pagination'
import { usePomodoroTimer } from './hooks/usePomodoroTimer'

type ProjectsListProps = {
  sessions: Session[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onUpdateSession: (sessionId: string, patch: Partial<Session>) => void
  onEditSession: (session: Session) => void
  onDeleteSession: (sessionId: string) => void
}

export function ProjectsList({
  sessions,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateSession,
  onEditSession,
  onDeleteSession,
}: ProjectsListProps) {
  const { handlePlay, getTimerInfo } = usePomodoroTimer({ sessions, onUpdateSession })

  if (sessions.length === 0 && totalPages === 0) {
    return (
      <article className="empty-state">
        <p className="empty-title">No projects yet</p>
        <p className="empty-subtitle">Tap the + button below to create your first focus session.</p>
      </article>
    )
  }

  return (
    <>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <section className="space-y-4">
        {sessions.map((session) => (
          <ProjectCard
            key={session.id}
            session={session}
            timerInfo={getTimerInfo(session.id)}
            onPlay={handlePlay}
            onEdit={() => onEditSession(session)}
            onDelete={() => onDeleteSession(session.id)}
          />
        ))}
      </section>
    </>
  )
}
