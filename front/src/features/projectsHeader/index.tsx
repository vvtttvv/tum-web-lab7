import type { Theme } from '../projectsModel/types'

type ProjectsHeaderProps = {
  theme: Theme
  onToggleTheme: () => void
  onOpenAuth: () => void
  tokenReady: boolean
  title?: string
}

export function ProjectsHeader({ theme, onToggleTheme, onOpenAuth, tokenReady, title = 'All projects' }: ProjectsHeaderProps) {
  const tokenLabel = tokenReady ? 'Token OK' : 'Get token'

  return (
    <header className="projects-header">
      <h1 className="projects-title">{title}</h1>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Menu" type="button">
          <span className="icon-line"></span>
          <span className="icon-line"></span>
          <span className="icon-line short"></span>
        </button>
        <button
          className="theme-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button
          className="theme-btn"
          type="button"
          onClick={onOpenAuth}
          aria-label="Open auth token"
        >
          {tokenLabel}
        </button>
      </div>
    </header>
  )
}
