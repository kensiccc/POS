import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage({ onLogin, errorMessage }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setLocalError('')

    // Create a 90-second timeout so the button never hangs forever
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Server is taking too long. Please try again.')), 90000)
    )

    try {
      await Promise.race([onLogin(email, password), timeout])
      navigate('/', { replace: true })
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayError = localError || errorMessage

  return (
    <div className="login-view">
      <div className="login-panel">
        <div className="login-brand">
          <h1>House Blend POS</h1>
          <p>Secure access for cashiers and managers.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@houseblend.local"
            required
            disabled={isSubmitting}
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {displayError && <div className="form-error">{displayError}</div>}

          {wakingUp && !displayError && (
            <div className="form-info" style={{
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: '#93c5fd',
              marginTop: '4px'
            }}>
              ☕ Server is waking up from sleep… This may take up to 60 seconds on first login. Please wait.
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? (wakingUp ? 'Waking up server…' : 'Signing in…') : 'Sign in'}
          </button>

          <div className="login-help">
            <p>Use demo credentials:</p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setEmail('admin@houseblend.local'); setPassword('Admin123!') }}>admin@houseblend.local</a> / Admin123!</p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setEmail('cashier@houseblend.local'); setPassword('Cashier123!') }}>cashier@houseblend.local</a> / Cashier123!</p>
          </div>
        </form>
      </div>
    </div>
  )
}
