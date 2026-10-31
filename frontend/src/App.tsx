import { useEffect, useState, type FormEvent } from 'react'

type Status = 'Pending' | 'In Progress' | 'Completed'
type Priority = 'Low' | 'Medium' | 'High'

interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  priority: Priority
  status: Status
}

const API_URL = `${import.meta.env.VITE_API_URL}/assignments`

const buttonClass =
  'rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

const labelClass = 'flex flex-col gap-2 text-sm font-medium text-slate-600'

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Load assignments from FastAPI when the page opens.
  useEffect(() => {
    async function loadAssignments() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to load assignments')
        }

        const data: Assignment[] = await response.json()
        setAssignments(data)
        setError('')
      } catch {
        setError(
          'Could not connect to the backend. Make sure FastAPI is running.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [])

  // Search and filter assignments.
  const visibleAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.course.toLowerCase().includes(search.toLowerCase())

    return matchesSearch && (filter === 'All' || assignment.status === filter)
  })

  // Dashboard statistics.
  const pending = assignments.filter(
    (assignment) => assignment.status === 'Pending',
  ).length

  const inProgress = assignments.filter(
    (assignment) => assignment.status === 'In Progress',
  ).length

  const completed = assignments.filter(
    (assignment) => assignment.status === 'Completed',
  ).length

  // Create an assignment using the backend API.
  async function addAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          course: course.trim(),
          dueDate,
          priority,
          status: 'Pending',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create assignment')
      }

      const created: Assignment = await response.json()

      setAssignments((current) => [...current, created])
      setTitle('')
      setCourse('')
      setDueDate('')
      setPriority('Medium')
      setShowForm(false)
    } catch {
      setError(
        'Could not create assignment. Check the backend and make sure all fields are valid.',
      )
    } finally {
      setSaving(false)
    }
  }

  // Update assignment status using the backend API.
  async function updateStatus(id: string, status: Status) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update assignment')
      }

      const updated: Assignment = await response.json()

      setAssignments((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      )
    } catch {
      setError('Could not update assignment status. Please try again.')
    }
  }

  // Delete an assignment using the backend API.
  async function deleteAssignment(id: string) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete assignment')
      }

      setAssignments((current) =>
        current.filter((item) => item.id !== id),
      )
    } catch {
      setError('Could not delete assignment. Please try again.')
    }
  }

  // Style status and priority badges.
  function badgeClass(value: Priority | Status) {
    const styles: Record<Priority | Status, string> = {
      High: 'bg-red-50 text-red-700',
      Medium: 'bg-amber-50 text-amber-700',
      Low: 'bg-emerald-50 text-emerald-700',
      Pending: 'bg-slate-100 text-slate-700',
      'In Progress': 'bg-blue-50 text-blue-700',
      Completed: 'bg-emerald-50 text-emerald-700',
    }

    return `inline-flex rounded-md px-2.5 py-1.5 text-xs font-semibold ${styles[value]}`
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:flex md:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">StudyTrack</h1>
              <p className="text-xs text-slate-500">Student Assignment Tracker</p>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-3 font-semibold text-indigo-700">
              <span>▦</span>
              Dashboard
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500">
              <span>✓</span>
              My Assignments
            </div>
          </nav>

          <div className="mt-auto rounded-xl bg-indigo-50 p-4">
            <p className="mb-2 text-sm font-semibold text-indigo-900">
              Stay on track!
            </p>
            <p className="text-xs leading-5 text-indigo-700">
              Keep your assignments organized and complete your work on time.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm text-slate-500">Workspace / Dashboard</p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Assignment Dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage your coursework and track your progress.
              </p>
            </div>

            <button
              type="button"
              className={buttonClass}
              onClick={() => setShowForm((current) => !current)}
            >
              {showForm ? 'Cancel' : '+ Add Assignment'}
            </button>
          </header>

          {/* Loading and error messages */}
          {loading && (
            <p className="mb-5 rounded-lg bg-white p-4 text-sm text-slate-500">
              Loading assignments...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
              <button
                type="button"
                className="ml-3 font-semibold underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Statistics */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Assignments</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {assignments.length}
              </p>
              <p className="mt-2 text-xs text-slate-400">All assignments</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="mt-3 text-3xl font-bold text-amber-600">{pending}</p>
              <p className="mt-2 text-xs text-slate-400">Waiting to start</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="mt-3 text-3xl font-bold text-blue-600">
                {inProgress}
              </p>
              <p className="mt-2 text-xs text-slate-400">Currently working</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-3 text-3xl font-bold text-emerald-600">
                {completed}
              </p>
              <p className="mt-2 text-xs text-slate-400">Finished assignments</p>
            </div>
          </section>

          {/* Add assignment form */}
          {showForm && (
            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-5 text-lg font-bold text-slate-900">
                Add New Assignment
              </h3>

              <form
                onSubmit={addAssignment}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <label className={labelClass}>
                  Assignment Title
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="e.g. Requirements Analysis Report"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={200}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Course
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="e.g. CSE309"
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                    maxLength={100}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Due Date
                  <input
                    className={inputClass}
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Priority
                  <select
                    className={inputClass}
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as Priority)
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>

                <div className="flex justify-end sm:col-span-2">
                  <button
                    type="submit"
                    className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Assignment'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Assignment list */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  My Assignments
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage your coursework.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  className={`${inputClass} sm:w-56`}
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search assignments"
                />

                <select
                  className={`${inputClass} sm:w-40`}
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Assignment</th>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Due Date</th>
                    <th className="px-5 py-4 font-semibold">Priority</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleAssignments.map((assignment) => (
                    <tr key={assignment.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {assignment.title}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {assignment.course}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {assignment.dueDate}
                      </td>

                      <td className="px-5 py-4">
                        <span className={badgeClass(assignment.priority)}>
                          {assignment.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          className={`${badgeClass(assignment.status)} cursor-pointer border-0 outline-none`}
                          value={assignment.status}
                          onChange={(event) =>
                            updateStatus(
                              assignment.id,
                              event.target.value as Status,
                            )
                          }
                          aria-label={`Status for ${assignment.title}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          onClick={() => deleteAssignment(assignment.id)}
                          aria-label={`Delete ${assignment.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && visibleAssignments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        {assignments.length === 0
                          ? 'No assignments yet. Click “Add Assignment” to create one.'
                          : 'No assignments match your search or filter.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
              Showing {visibleAssignments.length} of {assignments.length}{' '}
              assignments
            </div>
          </section>

          <footer className="mt-8 text-center text-xs text-slate-400">
            StudyTrack — Student Assignment Tracker
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App