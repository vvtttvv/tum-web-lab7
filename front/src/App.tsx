import { type FormEvent, useEffect, useState } from 'react'
import { AuthTokenModal } from './features/authTokenModal'
import { CreateProjectModal } from './features/createProjectModal'
import { ProjectsFooterNav } from './features/projectsFooterNav'
import { ProjectsHeader } from './features/projectsHeader'
import { defaultProjectForm } from './features/projectsModel/constants'
import type { TokenFormState } from './features/authTokenModal'
import { apiProjectsRepository } from './features/projectsModel/repository'
import { formatHoursMinutes, parseDurationToSeconds } from './features/projectsModel/time'
import type { ProjectFormState, Session, Theme } from './features/projectsModel/types'
import { useProjectsStore } from './features/projectsModel/useProjectsStore'
import { ProjectsList } from './features/projectList'
import { StatsView } from './features/stats'

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  const repository = apiProjectsRepository
  const {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    hydrated,
    loading,
    reloadSessions,
    currentPage,
    totalPages,
    goToPage,
  } = useProjectsStore(repository)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [form, setForm] = useState<ProjectFormState>(defaultProjectForm)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState<'projects' | 'stats'>('projects')
  const [tokenForm, setTokenForm] = useState<TokenFormState>({
    subject: 'demo-user',
    permissions: ['READ', 'WRITE'],
  })
  const [tokenReady, setTokenReady] = useState(() => Boolean(repository.getToken()))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = isCreateOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isCreateOpen])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleCreateSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanName = form.projectName.trim()
    if (!cleanName) {
      return
    }

    const totalSeconds = parseDurationToSeconds(form.duration)
    await addSession({
      title: cleanName,
      totalSeconds,
      color: form.selectedColor,
      timerSettings: form.timerSettings,
    })
    setIsCreateOpen(false)
    setForm(defaultProjectForm)
  }

  const handleUpdateSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingSession) {
      return
    }

    const cleanName = form.projectName.trim()
    if (!cleanName) {
      return
    }

    const totalSeconds = parseDurationToSeconds(form.duration)
    await updateSession(editingSession.id, {
      title: cleanName,
      totalSeconds,
      color: form.selectedColor,
      timerSettings: form.timerSettings,
    })
    setIsCreateOpen(false)
    setEditingSession(null)
    setForm(defaultProjectForm)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm('Delete this session?')) {
      return
    }

    await deleteSession(sessionId)
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setForm({
      projectName: session.title,
      duration: formatHoursMinutes(session.totalSeconds),
      frequency: 'repeating',
      period: 'daily',
      selectedColor: session.color,
      timerSettings: session.timerSettings,
    })
    setIsCreateOpen(true)
  }

  const handleTokenSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      subject: tokenForm.subject.trim() || undefined,
      permissions: tokenForm.permissions,
    }
    const response = await repository.requestToken(payload)
    repository.setToken(response.token)
    setTokenReady(true)
    await reloadSessions()
    setIsAuthOpen(false)
  }

  const patchForm = (patch: Partial<ProjectFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  return (
    <main className="layout-shell">
      <section className="dashboard">
        <div className="dashboard-section">
          <ProjectsHeader
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenAuth={() => setIsAuthOpen(true)}
            tokenReady={tokenReady}
            title={activeTab === 'stats' ? 'Stats overview' : 'All projects'}
          />
        </div>

        <div className="projects-scroll-area">
          {hydrated ? (
            activeTab === 'projects' ? (
              <ProjectsList
                sessions={sessions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onUpdateSession={(sessionId, patch) =>
                  void updateSession(sessionId, patch, { persist: false })
                }
                onEditSession={handleEditSession}
                onDeleteSession={(sessionId) => void handleDeleteSession(sessionId)} 
              />
            ) : (
              <StatsView sessions={sessions} />
            )
          ) : (
            <article className="empty-state">{loading ? 'Loading...' : 'Missing token.'}</article>
          )}
        </div>

        <div className="dashboard-section dashboard-footer">
          <ProjectsFooterNav
            onCreate={() => setIsCreateOpen(true)}
            activeTab={activeTab}
            onNavigate={setActiveTab}
          />
        </div>
      </section>

      <CreateProjectModal
        open={isCreateOpen}
        form={form}
        onChange={patchForm}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
        title={editingSession ? 'Edit session' : 'New project'}
        submitLabel={editingSession ? 'Update' : 'Save'}
      />

      <AuthTokenModal
        open={isAuthOpen}
        form={tokenForm}
        onChange={setTokenForm}
        onClose={() => setIsAuthOpen(false)}
        onSubmit={handleTokenSubmit}
      />
    </main>
  )
}

export default App
