import type { Session } from './types'

export type CreateSessionPayload = Pick<Session, 'title' | 'totalSeconds' | 'color' | 'timerSettings'>

export type TokenRequestPayload = {
  subject?: string
  permissions: string[]
}

export type TokenResponse = {
  token: string
  expiresAt: string
}

export type ProjectsRepository = {
  loadSessions: (skip?: number, take?: number) => Promise<{ items: Session[]; total: number }>
  createSession: (payload: CreateSessionPayload) => Promise<Session>
  updateSession: (sessionId: string, patch: Partial<Session>) => Promise<Session>
  deleteSession: (sessionId: string) => Promise<void>
  requestToken: (payload: TokenRequestPayload) => Promise<TokenResponse>
  getToken: () => string | null
  setToken: (token: string | null) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5007'
const TOKEN_KEY = 'pomodoro.jwt'

const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY))

const setToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return
  }

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> => {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (withAuth) {
    const token = getToken()
    if (!token) {
      throw new Error('Missing auth token')
    }
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const apiProjectsRepository: ProjectsRepository = {
  async loadSessions(skip = 0, take = 10) {
    return apiFetch<{ items: Session[]; total: number }>(`/api/sessions?skip=${skip}&take=${take}`)
  },

  async createSession(payload) {
    return apiFetch<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updateSession(sessionId, patch) {
    return apiFetch<Session>(`/api/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    })
  },

  async deleteSession(sessionId) {
    await apiFetch<void>(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    })
  },

  async requestToken(payload) {
    return apiFetch<TokenResponse>('/token', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false)
  },

  getToken,
  setToken,
}
