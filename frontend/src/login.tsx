
import { useState, type FormEvent } from 'react'

type Role = 'student' | 'teacher' | 'admin'

interface User {
  id: number
  name: string
  email: string
  role: Role
}

interface LoginProps {
  onLogin: (token: string, user: User) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const API_URL = (
        import.meta.env.VITE_API_URL || 'http://localhost:8000'
      ).replace(/\/$/, '')

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      onLogin(data.access_token, data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            S
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            StudyTrack
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Email
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Password
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Student Assignment Tracker
        </p>
      </div>
    </div>
  )
}
