import { useEffect, useState } from 'react'
import type { CreateSessionPayload, ProjectsRepository } from './repository'
import type { Session } from './types'

type UpdateOptions = {
  persist?: boolean
}

const PAGE_SIZE = 10

export const useProjectsStore = (repository: ProjectsRepository) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const reloadSessions = async (page: number = 1) => {
    setLoading(true)
    try {
      const skip = (page - 1) * PAGE_SIZE
      const data = await repository.loadSessions(skip, PAGE_SIZE)
      setSessions(data.items)
      setTotalCount(data.total)
      setCurrentPage(page)
    } finally {
      setHydrated(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    void reloadSessions()
  }, [repository])

  const addSession = async (payload: CreateSessionPayload) => {
    const created = await repository.createSession(payload)
    setSessions((prev) => [...prev, created])
    return created
  }

  const updateSession = async (
    sessionId: string,
    patch: Partial<Session>,
    options: UpdateOptions = { persist: true },
  ) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, ...patch } : session)),
    )

    if (options.persist) {
      const updated = await repository.updateSession(sessionId, patch)
      setSessions((prev) => prev.map((session) => (session.id === sessionId ? updated : session)))
      return updated
    }

    return null
  }

  const deleteSession = async (sessionId: string) => {
    await repository.deleteSession(sessionId)
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
  }

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    hydrated,
    loading,
    reloadSessions,
    currentPage,
    totalPages,
    goToPage: (page: number) => reloadSessions(Math.max(1, Math.min(page, totalPages))),
  }
}
