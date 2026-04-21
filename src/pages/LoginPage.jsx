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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const [localError, setLocalError] = useState('')

  // Show "server waking up" message after 3 seconds of waiting
  useEffect(() => {
    let timer
    if (isSubmitting) {
      timer = setTimeout(() => setWakingUp(true), 3000)
    } else {
      setWakingUp(false)
    }
    return () => clearTimeout(timer)
  }, [isSubmitting])

  const handleRoleSelect = async (role) => {
    setIsSubmitting(true)
    setLocalError('')

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Server is taking too long. Please try again.')), 90000)
    )

    try {
      await Promise.race([onLogin(role.email, role.password), timeout])
      navigate('/', { replace: true })
    } catch (err) {
      setLocalError(role.label + ' login failed. The server might be down.')
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
          <h1 className="lp-title">Sample POS</h1>
          <p className="lp-sub">Select your position to enter</p>
        </div>

        {/* Role Cards */}
        <div className="lp-roles">
          {ROLES.map((role) => (
            <button
              key={role.key}
              className="lp-role-card"
              onClick={() => handleRoleSelect(role)}
              disabled={isSubmitting}
              style={{ '--role-color': role.color }}
              type="button"
            >
              <span className="lp-role-icon">{role.icon}</span>
              <span className="lp-role-label">{role.label}</span>
              <span className="lp-role-desc">{role.desc}</span>
            </button>
          ))}
        </div>

        <div className="lp-status-area">
          {isSubmitting && (
            <div className="lp-loading">
              {wakingUp ? '☕ Server is waking up... Please wait.' : 'Logging in...'}
            </div>
          )}
          
          {displayError && <div className="lp-error">{displayError}</div>}
        </div>

        {/* Footer */}
        <div className="lp-footer">
          Developer: Kensic
        </div>
      </div>
    </div>
  )
}
