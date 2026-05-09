import { defaultTimerSettings } from './constants'
import { parseDurationToSeconds } from './time'
import type { Session, TimerSettings } from './types'

export type ProjectsRepository = {
  loadSessions: () => Promise<Session[]>
  saveSessions: (sessions: Session[]) => Promise<void>
}

const DB_NAME = 'focus-flow-db'
const DB_VERSION = 1
const STORE_NAME = 'projects'

const isTimerSettings = (value: unknown): value is TimerSettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.focusMinutes === 'number' &&
    typeof candidate.shortBreakMinutes === 'number' &&
    typeof candidate.longBreakMinutes === 'number' &&
    typeof candidate.cycles === 'number'
  )
}

const isLegacySession = (
  candidate: Record<string, unknown>,
): candidate is Record<string, unknown> & { elapsed: string; total: string } =>
  typeof candidate.elapsed === 'string' && typeof candidate.total === 'string'

const toSession = (value: unknown): Session | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>

  if (typeof candidate.id !== 'string' || typeof candidate.title !== 'string' || typeof candidate.color !== 'string') {
    return null
  }

  const timerSettings = isTimerSettings(candidate.timerSettings)
    ? candidate.timerSettings
    : defaultTimerSettings

  const dailyLog =
    candidate.dailyLog && typeof candidate.dailyLog === 'object'
      ? (candidate.dailyLog as Record<string, number>)
      : {}

  if (typeof candidate.elapsedSeconds === 'number' && typeof candidate.totalSeconds === 'number') {
    return {
      id: candidate.id,
      title: candidate.title,
      elapsedSeconds: candidate.elapsedSeconds,
      totalSeconds: candidate.totalSeconds,
      color: candidate.color,
      timerSettings,
      dailyLog,
    }
  }

  if (isLegacySession(candidate)) {
    return {
      id: candidate.id,
      title: candidate.title,
      elapsedSeconds: parseDurationToSeconds(candidate.elapsed),
      totalSeconds: parseDurationToSeconds(candidate.total),
      color: candidate.color,
      timerSettings,
      dailyLog,
    }
  }

  return null
}

const toPromise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const normalizeSessions = (value: unknown): Session[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => toSession(entry))
    .filter((entry): entry is Session => Boolean(entry))
}

export const indexedDbProjectsRepository: ProjectsRepository = {
  async loadSessions() {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return []
    }

    const db = await openDatabase()

    try {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const result = await toPromise(store.getAll())
      return normalizeSessions(result)
    } finally {
      db.close()
    }
  },

  async saveSessions(sessions) {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return
    }

    const db = await openDatabase()

    try {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)

      store.clear()
      sessions.forEach((session) => {
        store.put(session)
      })

      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
      })
    } finally {
      db.close()
    }
  },
}
