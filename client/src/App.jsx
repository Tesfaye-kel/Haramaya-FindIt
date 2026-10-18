import { useEffect, useState } from 'react'
import './App.css'

const emptyForm = { name: '', email: '', password: '' }

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [result, setResult] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('haramaya-findit-token') || '')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setProfile(null)
      return
    }

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/demo/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Profile request failed')
        }

        setProfile(data.user)
      } catch (error) {
        setResult({ type: 'error', message: error.message })
        setToken('')
        localStorage.removeItem('haramaya-findit-token')
      }
    }

    loadProfile()
  }, [token])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const payload = mode === 'register' ? form : { email: form.email, password: form.password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      const nextToken = data.token
      setToken(nextToken)
      localStorage.setItem('haramaya-findit-token', nextToken)
      setResult({ type: 'success', message: mode === 'register' ? 'Registration successful.' : 'Login successful.' })
      setForm(emptyForm)
    } catch (error) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('haramaya-findit-token')
    setProfile(null)
    setResult({ type: 'success', message: 'Logged out successfully.' })
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Haramaya University</p>
        <h1>Haramaya FindIt</h1>
        <p className="subtitle">
          A secure, mobile-friendly lost-and-found platform for reporting lost items,
          found items, claims, and verified handovers.
        </p>
      </section>

      <section className="auth-layout">
        <div className="feature-panel">
          <h2>Core workflow</h2>
          <p>Register, verify your email, search reports, submit claims, and safely resolve item handovers.</p>
          <ul>
            <li>Student and finder accounts</li>
            <li>Protected claim review</li>
            <li>Audit-friendly handovers</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="toggle-row" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'login' ? 'toggle active' : 'toggle'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'toggle active' : 'toggle'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {token && profile ? (
            <div className="profile-panel">
              <h3>Authenticated user</h3>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <button type="button" className="primary-btn full-width" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                />
              </label>

              {result && <div className={`status ${result.type}`}>{result.message}</div>}

              <button type="submit" className="primary-btn full-width" disabled={loading}>
                {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
