type ProjectsFooterNavProps = {
  onCreate: () => void
  activeTab: 'projects' | 'stats'
  onNavigate: (tab: 'projects' | 'stats') => void
}

export function ProjectsFooterNav({ onCreate, activeTab, onNavigate }: ProjectsFooterNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="flex-1 flex justify-start">
        <button
          type="button"
          className={`nav-link${activeTab === 'projects' ? ' active' : ''}`}
          onClick={() => onNavigate('projects')}
        >
          Projects
        </button>
      </div>
      <div className="flex-1 flex justify-center">
        <button type="button" className="center-fab" aria-label="Create project" onClick={onCreate}>
          +
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          type="button"
          className={`nav-link${activeTab === 'stats' ? ' active' : ''}`}
          onClick={() => onNavigate('stats')}
        >
          Stats
        </button>
      </div>
    </nav>
  )
}
