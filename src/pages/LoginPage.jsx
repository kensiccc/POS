import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  {
    key: 'owner',
    label: 'Owner',
    icon: '👑',
    email: 'admin@houseblend.local',
    password: 'Admin123!',
    desc: 'Full access · Admin controls',
    color: '#f59e0b',
  },
  {
    key: 'cashier',
    label: 'Cashier',
    icon: '☕',
    email: 'cashier@houseblend.local',
    password: 'Cashier123!',
    desc: 'POS & order management',
    color: '#2563eb',
  },
]

export default function LoginPage({ onLogin, errorMessage }) {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    let timer
    if (isSubmitting) {
      timer = setTimeout(() => setWakingUp(true), 3000)
    } else {
      setWakingUp(false)
    }
    return () => clearTimeout(timer)
  }, [isSubmitting])

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setPassword('')
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole) return
    setIsSubmitting(true)
    setLocalError('')

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Server is taking too long. Please try again.')), 90000)
    )

    try {
      await Promise.race([onLogin(selectedRole.email, password), timeout])
      navigate('/', { replace: true })
    } catch (err) {
      setLocalError(err.message || 'Incorrect password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayError = localError || errorMessage

  return (
    <div className="lp-view">
      <div className="lp-panel">
        {/* Brand */}
        <div className="lp-brand">
          <div className="lp-logo">☕</div>
          <h1 className="lp-title">House Blend POS</h1>
          <p className="lp-sub">Select your role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="lp-roles">
          {ROLES.map((role) => (
            <button
              key={role.key}
              className={`lp-role-card ${selectedRole?.key === role.key ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role)}
              style={{ '--role-color': role.color }}
              type="button"
            >
              <span className="lp-role-icon">{role.icon}</span>
              <span className="lp-role-label">{role.label}</span>
              <span className="lp-role-desc">{role.desc}</span>
              {selectedRole?.key === role.key && <span className="lp-role-check">✓</span>}
            </button>
          ))}
        </div>

        {/* Password form — only shows after picking a role */}
        <div className={`lp-form-wrap ${selectedRole ? 'visible' : ''}`}>
          <form className="lp-form" onSubmit={handleSubmit}>
            <div className="lp-pwd-label">
              <span>
                Password for <strong>{selectedRole?.label}</strong>
              </span>
            </div>

            <div className="lp-pwd-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
                autoFocus
                className="lp-pwd-input"
              />
              <button
                type="button"
                className="lp-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {displayError && <div className="lp-error">{displayError}</div>}

            {wakingUp && !displayError && (
              <div className="lp-wakeup">
                ☕ Server is waking up… please wait up to 60 sec.
              </div>
            )}

            <button
              type="submit"
              className="lp-submit"
              disabled={isSubmitting || !password}
              style={{ '--role-color': selectedRole?.color || '#2563eb' }}
            >
              {isSubmitting
                ? wakingUp ? 'Waking up server…' : 'Signing in…'
                : `Sign in as ${selectedRole?.label}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
