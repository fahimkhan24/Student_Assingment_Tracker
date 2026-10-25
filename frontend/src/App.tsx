
import { useState } from 'react'

type Status = 'Pending' | 'In Progress' | 'Completed'
type Priority = 'Low' | 'Medium' | 'High'

interface Assignment {
  id: number
  title: string
  course: string
  dueDate: string
  priority: Priority
  status: Status
}

const initialAssignments: Assignment[] = [
  { id: 1, title: 'Requirements Analysis Report', course: 'CSE309', dueDate: '2026-10-29', priority: 'High', status: 'In Progress' },
  { id: 2, title: 'Database Design', course: 'CSE311', dueDate: '2026-11-02', priority: 'Medium', status: 'Pending' },
  { id: 3, title: 'Programming Exercise', course: 'CSE221', dueDate: '2026-10-27', priority: 'Low', status: 'Completed' },
]

const buttonClass = 'rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700'
const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const labelClass = 'flex flex-col gap-2 text-sm font-medium text-slate-600'

function App() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')

  const visibleAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.course.toLowerCase().includes(search.toLowerCase())

    return matchesSearch && (filter === 'All' || assignment.status === filter)
  })

  const pending = assignments.filter((a) => a.status === 'Pending').length
  const inProgress = assignments.filter((a) => a.status === 'In Progress').length
  const completed = assignments.filter((a) => a.status === 'Completed').length

  function addAssignment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAssignments((current) => [
      ...current,
      { id: Date.now(), title, course, dueDate, priority, status: 'Pending' },
    ])
    setTitle('')
    setCourse('')
    setDueDate('')
    setPriority('Medium')
    setShowForm(false)
  }

  function updateStatus(id: number, status: Status) {
    setAssignments((current) =>
      current.map((item) => item.id === id ? { ...item, status } : item),
    )
  }

  function deleteAssignment(id: number) {
    setAssignments((current) => current.filter((item) => item.id !== id))
  }

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
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
          <div className="flex items-center gap-3 text-xl font-bold">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white">S</span>
            StudyTrack
          </div>

          <p className="mb-3 mt-12 text-xs font-bold tracking-widest text-slate-400">WORKSPACE</p>
          <div className="rounded-lg bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700">
            ▦ &nbsp; Assignments
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Stay organized. Meet every deadline.
          </p>

          <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="grid size-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">ST</div>
            <div>
              <p className="text-sm font-semibold">Student</p>
              <p className="text-xs text-slate-500">My workspace</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex min-h-[68px] items-center justify-between border-b border-slate-200 bg-white px-5 md:px-9">
            <span className="text-sm text-slate-500">Workspace / Assignments</span>
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString()}</span>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 md:p-9">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-xs font-bold tracking-widest text-indigo-600">YOUR ACADEMIC WORKSPACE</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">My Assignments</h1>
                <p className="mt-2 text-sm text-slate-500">Keep track of coursework and stay ahead of deadlines.</p>
              </div>
              <button className={buttonClass} onClick={() => setShowForm(!showForm)}>
                + New Assignment
              </button>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total Assignments', value: assignments.length, note: 'All your coursework' },
                { label: 'Pending', value: pending, note: 'Waiting to be started' },
                { label: 'In Progress', value: inProgress, note: 'Currently working on' },
                { label: 'Completed', value: completed, note: 'Successfully finished' },
              ].map((stat) => (
                <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="my-3 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.note}</p>
                </article>
              ))}
            </div>

            {showForm && (
              <form onSubmit={addAssignment} className="mb-7 grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
                <h2 className="text-lg font-bold sm:col-span-2">Create an Assignment</h2>

                <label className={labelClass}>
                  Assignment Title
                  <input className={inputClass} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter assignment title" />
                </label>

                <label className={labelClass}>
                  Course
                  <input className={inputClass} required value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. CSE309" />
                </label>

                <label className={labelClass}>
                  Due Date
                  <input className={inputClass} required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </label>

                <label className={labelClass}>
                  Priority
                  <select className={inputClass} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>

                <div className="flex justify-end gap-3 sm:col-span-2">
                  <button type="button" className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={buttonClass}>Save Assignment</button>
                </div>
              </form>
            )}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">All Assignments</h2>
                  <p className="mt-1 text-sm text-slate-500">Manage and track your academic tasks.</p>
                </div>
                <span className="w-fit rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                  {visibleAssignments.length} items
                </span>
              </div>

              <div className="my-5 flex flex-col gap-3 sm:flex-row">
                <input className={inputClass} placeholder="Search assignments or courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className={`${inputClass} sm:max-w-44`} value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option>All</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-[10px] tracking-wider text-slate-500">
                    <tr>
                      <th className="px-3 py-3 font-semibold">ASSIGNMENT</th>
                      <th className="px-3 py-3 font-semibold">COURSE</th>
                      <th className="px-3 py-3 font-semibold">DUE DATE</th>
                      <th className="px-3 py-3 font-semibold">PRIORITY</th>
                      <th className="px-3 py-3 font-semibold">STATUS</th>
                      <th className="px-3 py-3 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {visibleAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-slate-50">
                        <td className="px-3 py-4 font-semibold text-slate-800">{assignment.title}</td>
                        <td className="px-3 py-4 text-slate-500">{assignment.course}</td>
                        <td className="px-3 py-4 text-slate-500">{assignment.dueDate}</td>
                        <td className="px-3 py-4"><span className={badgeClass(assignment.priority)}>{assignment.priority}</span></td>
                        <td className="px-3 py-4">
                          <select
                            className="max-w-32 rounded-md border border-slate-200 bg-white px-2 py-2 text-xs"
                            aria-label={`Status for ${assignment.title}`}
                            value={assignment.status}
                            onChange={(e) => updateStatus(assignment.id, e.target.value as Status)}
                          >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <button className="rounded-md border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50" onClick={() => deleteAssignment(assignment.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {visibleAssignments.length === 0 && (
                <p className="p-8 text-center text-sm text-slate-500">No assignments found. Try another search or add an assignment.</p>
              )}
            </section>

            <footer className="py-7 text-center text-xs text-slate-400">
              Student Assignment Tracker · Keep learning, keep growing.
            </footer>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
