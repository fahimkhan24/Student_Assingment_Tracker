
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'

type Role = 'student' | 'teacher' | 'admin'

interface User {
  id: number
  name: string
  email: string
  role: Role
  is_active: boolean
}

interface Props {
  token: string
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>
  onLogout: () => void
}

const API_ROOT = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '')

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500'

const buttonClass =
  'rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50'

export default function AdminDashboard({ token, user, onLogout }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')

  // Keep the latest logout callback without making the loading effect
  // run again whenever the parent creates a new callback.
  const logoutRef = useRef(onLogout)

  useEffect(() => {
    logoutRef.current = onLogout
  }, [onLogout])

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        logoutRef.current()
        return
      }

      if (!response.ok) {
        throw new Error('Could not load users.')
      }

      const data: User[] = await response.json()
      setUsers(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
  let cancelled = false

  async function fetchInitialUsers() {
    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        logoutRef.current()
        return
      }

      if (!response.ok) {
        throw new Error('Could not load users.')
      }

      const data: User[] = await response.json()

      if (!cancelled) {
        setUsers(data)
        setError('')
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error ? err.message : 'Could not load users.',
        )
      }
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }
  }

  void fetchInitialUsers()

  return () => {
    cancelled = true
  }
  }, [token])

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const text = search.toLowerCase()

      const matchesSearch =
        item.name.toLowerCase().includes(text) ||
        item.email.toLowerCase().includes(text)

      const matchesRole =
        roleFilter === 'All' || item.role === roleFilter

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && item.is_active) ||
        (statusFilter === 'Banned' && !item.is_active)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const students = users.filter((item) => item.role === 'student').length
  const teachers = users.filter((item) => item.role === 'teacher').length
  const admins = users.filter((item) => item.role === 'admin').length
  const banned = users.filter((item) => !item.is_active).length

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        logoutRef.current()
        return
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Could not create user.')
      }

      setName('')
      setEmail('')
      setPassword('')
      setRole('student')
      setShowForm(false)

      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create user.')
    } finally {
      setSaving(false)
    }
  }

  async function changeUserStatus(item: User) {
    const action = item.is_active ? 'ban' : 'unban'

    if (!window.confirm(`Are you sure you want to ${action} ${item.name}?`)) {
      return
    }

    setError('')

    try {
      const response = await fetch(
        `${API_ROOT}/admin/users/${item.id}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.status === 401) {
        logoutRef.current()
        return
      }

      if (!response.ok) {
        throw new Error(data.detail || `Could not ${action} user.`)
      }

      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${action} user.`)
    }
  }

  async function deleteUser(item: User) {
    if (!window.confirm(`Permanently delete ${item.name}? This cannot be undone.`)) {
      return
    }

    setError('')

    try {
      const response = await fetch(`${API_ROOT}/admin/users/${item.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.status === 401) {
        logoutRef.current()
        return
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Could not delete user.')
      }

      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete user.')
    }
  }

  function statusBadge(active: boolean) {
    return active
      ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
      : 'rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                StudyTrack Admin
              </h1>
              <p className="text-xs text-slate-500">
                User Management Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-indigo-600">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Workspace / Administration
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              User Management
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add, manage, ban and remove platform users.
            </p>
          </div>

          <button
            className={buttonClass}
            onClick={() => setShowForm((value) => !value)}
          >
            {showForm ? 'Cancel' : '+ Add User'}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              className="ml-3 font-semibold underline"
              onClick={() => {
                setLoading(true)
                void loadUsers()
              }}
            >
              Retry
            </button>
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Total Users', value: users.length, color: 'text-slate-900' },
            { label: 'Students', value: students, color: 'text-blue-600' },
            { label: 'Teachers', value: teachers, color: 'text-indigo-600' },
            { label: 'Admins', value: admins, color: 'text-violet-600' },
            { label: 'Banned Users', value: banned, color: 'text-red-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`mt-3 text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {showForm && (
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-slate-900">
              Create User
            </h3>

            <form
              onSubmit={createUser}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Full name
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Email
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Temporary password
                <input
                  className={inputClass}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  maxLength={128}
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Role
                <select
                  className={inputClass}
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as 'student' | 'teacher')
                  }
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </label>

              <div className="flex justify-end sm:col-span-2">
                <button className={buttonClass} disabled={saving}>
                  {saving ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row">
            <input
              className={`${inputClass} lg:max-w-sm`}
              type="search"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={`${inputClass} lg:w-44`}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>

            <select
              className={`${inputClass} lg:w-44`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>

            <button
              onClick={() => {
                setLoading(true)
                void loadUsers()
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Loading users...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold">{item.name}</td>
                      <td className="px-5 py-4 text-slate-600">{item.email}</td>
                      <td className="px-5 py-4 capitalize">{item.role}</td>
                      <td className="px-5 py-4">
                        <span className={statusBadge(item.is_active)}>
                          {item.is_active ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {item.id === user.id ? (
                          <span className="text-xs text-slate-400">
                            Current account
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => void changeUserStatus(item)}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                item.is_active
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {item.is_active ? 'Ban' : 'Unban'}
                            </button>

                            <button
                              onClick={() => void deleteUser(item)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </section>
      </main>
    </div>
  )
}
