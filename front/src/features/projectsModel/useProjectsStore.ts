import { useEffect, useState } from 'react'
import type { ProjectsRepository } from './repository'
import type { Session } from './types'

export const useProjectsStore = (repository: ProjectsRepository) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true

    void repository
      .loadSessions()
      .then((data) => {
        if (active) {
          setSessions(data)
        }
      })
      .finally(() => {
        if (active) {
          setHydrated(true)
        }
      })

    return () => {
      active = false
    }
  }, [repository])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    void repository.saveSessions(sessions)
  }, [hydrated, repository, sessions])

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session])
  }

  const updateSession = (sessionId: string, patch: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, ...patch } : session)),
    )
  }

  return {
    sessions,
    addSession,
    updateSession,
    hydrated,
  }
}
