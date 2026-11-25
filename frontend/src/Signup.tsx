
import { useState, type FormEvent } from 'react'

interface SignupProps {
  onSignup: () => void
  onSwitchLogin: () => void
}

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '')

export default function Signup({ onSignup, onSwitchLogin }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item: { msg?: string }) => item.msg).join(', ')
          : typeof data.detail === 'string'
            ? data.detail
            : 'Signup failed. Please check your information.'

        throw new Error(message)
      }

      onSignup()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
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
            Create your student account
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            Full Name
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

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
              placeholder="Create a password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>

          <p className="text-xs text-slate-500">
            New accounts are registered with the Student role.
          </p>

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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
