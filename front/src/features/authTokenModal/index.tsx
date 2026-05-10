import { type FormEvent, useState } from 'react'

export type TokenFormState = {
  subject: string
  permissions: Array<'READ' | 'WRITE'>
}

type AuthTokenModalProps = {
  open: boolean
  form: TokenFormState
  onChange: (next: TokenFormState) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const togglePermission = (current: TokenFormState, permission: 'READ' | 'WRITE') => {
  const hasPermission = current.permissions.includes(permission)
  const nextPermissions = hasPermission
    ? current.permissions.filter((item) => item !== permission)
    : [...current.permissions, permission]

  return {
    ...current,
    permissions: nextPermissions,
  }
}

export function AuthTokenModal({ open, form, onChange, onClose, onSubmit }: AuthTokenModalProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  if (!open) {
    return null
  }

  return (
    <div className="create-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <form className="create-modal" onSubmit={onSubmit}>
        <header className="create-header">
          <h2 id="auth-title" className="create-title">Auth token</h2>
          <button type="button" className="close-btn" aria-label="Close auth" onClick={onClose}>
            ×
          </button>
        </header>

        <input
          value={form.subject}
          onChange={(event) => onChange({ ...form, subject: event.target.value })}
          className="field-input"
          placeholder="Subject (optional)"
          maxLength={48}
        />

        <section className="form-card compact">
          <p className="field-label">Permissions</p>
          <div className="choice-grid two">
            <button
              type="button"
              className={`choice-item${form.permissions.includes('READ') ? ' active' : ''}`}
              onClick={() => onChange(togglePermission(form, 'READ'))}
            >
              READ
            </button>
            <button
              type="button"
              className={`choice-item${form.permissions.includes('WRITE') ? ' active' : ''}`}
              onClick={() => onChange(togglePermission(form, 'WRITE'))}
            >
              WRITE
            </button>
          </div>
        </section>

        <section className={`form-card compact token-details${detailsOpen ? ' open' : ''}`}>
          <button
            type="button"
            className="form-row token-toggle"
            onClick={() => setDetailsOpen((prev) => !prev)}
            aria-expanded={detailsOpen}
          >
            <div>
              <p className="form-title">Token notes</p>
              <p className="form-hint">JWT expires fast for demo.</p>
            </div>
            <span className="timer-chevron">⌄</span>
          </button>

          {detailsOpen ? (
            <div className="token-details-panel">
              <p className="token-note">Token expires in ~1 minute. Refresh when it expires.</p>
            </div>
          ) : null}
        </section>

        <button className="save-btn" type="submit">Get token</button>
      </form>
    </div>
  )
}
