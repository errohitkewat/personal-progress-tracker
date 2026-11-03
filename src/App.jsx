
import { useState } from 'react'
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  CalendarDays,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  Pencil,
} from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import {
  createWeek,
  toggleTask,
  updateTask,
  addTask,
  removeTask,
  updateNote,
  deleteWeek,
} from './features/tracker/trackerSlice'

// ==================== DATE HELPERS ====================

const todayISO = () => {
  const d = new Date()

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const dateLabel = (
  iso,
  opts = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }
) => {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(
    'en-US',
    opts
  )
}

const weekEnd = (iso) => {
  const d = new Date(`${iso}T12:00:00`)

  d.setDate(d.getDate() + 6)

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ==================== HEADER ====================

function Header() {
  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">P</span>
        progress
        <span className="brand-muted">/log</span>
      </NavLink>

      <span className="top-caption">
        PERSONAL WORKSPACE
      </span>
    </header>
  )
}

// ==================== DASHBOARD ====================

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const weeks = useSelector(
    (state) => state.tracker.weeks
  )

  const templates = useSelector(
    (state) => state.tracker.taskTemplates
  )

  const [startDate, setStartDate] = useState(todayISO())

  const [customTasks, setCustomTasks] = useState(
    templates.join('\n')
  )

  const [showCreator, setShowCreator] = useState(false)

  const total = weeks.reduce(
    (sum, week) =>
      sum +
      week.days.reduce(
        (daySum, day) => daySum + day.entries.length,
        0
      ),
    0
  )

  const done = weeks.reduce(
    (sum, week) =>
      sum +
      week.days.reduce(
        (daySum, day) =>
          daySum +
          day.entries.filter((task) => task.done).length,
        0
      ),
    0
  )

  const handleCreateWeek = () => {
    const tasks = customTasks
      .split('\n')
      .map((task) => task.trim())
      .filter(Boolean)

    dispatch(
      createWeek({
        startDate,
        tasks,
      })
    )

    setShowCreator(false)

    navigate(`/week/${startDate}`)
  }

  return (
    <main className="container">
      {/* Hero section */}

      <section className="hero">
        <div>
          <h1>
            Small steps.
            <br />
            <span>Visible progress.</span>
          </h1>

          <p className="hero-sub">
            A quiet space to track the work you put in every day.
          </p>
        </div>

        <div className="hero-stats">
          <div>
            <strong>{weeks.length}</strong>
            <span>WEEKS LOGGED</span>
          </div>

          <div>
            <strong>
              {done}
              <small>/{total}</small>
            </strong>
            <span>TASKS COMPLETED</span>
          </div>
        </div>
      </section>

      {/* Weekly trackers heading */}

      <section className="section-head">
        <div>
          <h2>Your weekly trackers</h2>
          <p>Review your past weeks or start a fresh one.</p>
        </div>

        <button
          className="button button-dark"
          onClick={() =>
            setShowCreator((prev) => !prev)
          }
        >
          <Plus size={16} />

          {showCreator
            ? 'Close'
            : 'Create weekly tracker'}
        </button>
      </section>

      {/* Weekly tracker creator */}

      {showCreator && (
        <section className="creator panel">
          <div className="creator-head">
            <div>
              <h3>Set up your week</h3>
              <p>
                Choose a starting date and adjust the daily task list.
              </p>
            </div>

            <span className="step-label">
              NEW TRACKER
            </span>
          </div>

          <label className="field-label">
            WEEK STARTING
          </label>

          <input
            className="date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="field-label task-label">
            DAILY TASKS
            <span>One task per line</span>
          </label>

          <textarea
            value={customTasks}
            onChange={(e) => setCustomTasks(e.target.value)}
            rows={6}
            placeholder={`DSA
Frontend
Backend`}
          />

          <div className="creator-footer">
            <span>
              {
                customTasks
                  .split('\n')
                  .filter((task) => task.trim()).length
              } tasks · repeated for 7 days
            </span>

            <button
              className="button button-dark"
              disabled={
                !customTasks.trim() || !startDate
              }
              onClick={handleCreateWeek}
            >
              Generate week
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* Empty state */}

      {weeks.length === 0 ? (
        <div className="empty panel">
          <div className="empty-icon">
            <CalendarDays size={22} />
          </div>

          <h3>Your first week starts here</h3>

          <p>
            Create a weekly tracker to see your tasks laid out day by day.
          </p>

          <button
            className="button button-light"
            onClick={() => setShowCreator(true)}
          >
            Create your first week
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        /* Existing weekly trackers */

        <div className="week-list">
          {weeks.map((week) => {
            const completed = week.days.reduce(
              (sum, day) =>
                sum +
                day.entries.filter((task) => task.done).length,
              0
            )

            const count = week.days.reduce(
              (sum, day) => sum + day.entries.length,
              0
            )

            const percentage = count
              ? Math.round((completed / count) * 100)
              : 0

            return (
              <NavLink
                className="week-card"
                key={week.id}
                to={`/week/${week.id}`}
              >
                <div className="week-icon">
                  <CalendarDays size={18} />
                </div>

                <div className="week-info">
                  <strong>
                    {dateLabel(week.startDate, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}

                    <span> — </span>

                    {dateLabel(weekEnd(week.startDate), {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>

                  <span>
                    {completed} of {count} tasks completed
                  </span>
                </div>

                <div className="progress-wrap">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span>{percentage}%</span>
                </div>

                <ChevronRight
                  size={17}
                  className="card-chevron"
                />
              </NavLink>
            )
          })}
        </div>
      )}

      <footer className="footer-note">
        Your progress is saved automatically on this device.
      </footer>
    </main>
  )
}

// ==================== WEEK VIEW ====================

function WeekView() {
  const { weekId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const week = useSelector((state) =>
    state.tracker.weeks.find(
      (item) => item.id === weekId
    )
  )

  const [adding, setAdding] = useState({})
  const [drafts, setDrafts] = useState({})
  const [editing, setEditing] = useState(null)

  // Tracker not found

  if (!week) {
    return (
      <main className="container">
        <NavLink to="/" className="back-link">
          <ArrowLeft size={15} />
          All weeks
        </NavLink>

        <div className="empty panel">
          <h3>Tracker not found</h3>
          <p>This week may have been removed.</p>
        </div>
      </main>
    )
  }

  // Weekly calculations

  const total = week.days.reduce(
    (sum, day) => sum + day.entries.length,
    0
  )

  const done = week.days.reduce(
    (sum, day) =>
      sum +
      day.entries.filter((task) => task.done).length,
    0
  )

  const percentage = total
    ? Math.round((done / total) * 100)
    : 0

  // Add task

  const saveNewTask = (date) => {
    const taskName = adding[date] || ''

    if (!taskName.trim()) return

    dispatch(
      addTask({
        weekId,
        date,
        name: taskName,
      })
    )

    setAdding((prev) => ({
      ...prev,
      [date]: '',
    }))

    setDrafts((prev) => ({
      ...prev,
      [date]: false,
    }))
  }

  // Delete weekly tracker

  const handleDeleteWeek = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this weekly tracker?'
    )

    if (confirmed) {
      dispatch(deleteWeek(weekId))
      navigate('/')
    }
  }

  return (
    <main className="container week-page">
      <NavLink to="/" className="back-link">
        <ArrowLeft size={15} />
        All weeks
      </NavLink>

      {/* Week heading */}

      <section className="week-title">
        <div>
          <p className="eyebrow">
            WEEKLY OVERVIEW
          </p>

          <h1>
            {dateLabel(week.startDate, {
              month: 'long',
              day: 'numeric',
            })}

            <span> — </span>

            {dateLabel(weekEnd(week.startDate), {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h1>

          <p>
            Check off each task as you complete it.
            Your changes save automatically.
          </p>
        </div>

        <button
          className="button button-outline danger"
          onClick={handleDeleteWeek}
        >
          <Trash2 size={15} />
          Delete week
        </button>
      </section>

      {/* Weekly progress */}

      <div className="week-summary">
        <span>
          <strong>{done}</strong> / {total} completed
        </span>

        <div className="summary-track">
          <div
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <strong>{percentage}%</strong>
      </div>

      {/* Daily trackers */}

      <div className="days">
        {week.days.map((day) => {
          const dayDone = day.entries.filter(
            (task) => task.done
          ).length

          return (
            <section
              className={`day-card ${
                day.date === todayISO() ? 'today' : ''
              }`}
              key={day.date}
            >
              {/* Day header */}

              <div className="day-head">
                <div className="date-badge">
                  <span>
                    {dateLabel(day.date, {
                      month: 'short',
                    }).toUpperCase()}
                  </span>

                  <strong>
                    {dateLabel(day.date, {
                      day: 'numeric',
                    })}
                  </strong>
                </div>

                <div className="day-meta">
                  <strong>
                    {dateLabel(day.date, {
                      weekday: 'long',
                    })}
                  </strong>

                  <span>
                    {day.date === todayISO()
                      ? 'TODAY'
                      : day.date}
                  </span>
                </div>

                <span className="day-count">
                  {dayDone}/{day.entries.length}
                </span>
              </div>

              {/* Task list */}

              <div className="task-list">
                {day.entries.map((task) => (
                  <div
                    className={`task-row ${
                      task.done ? 'is-done' : ''
                    }`}
                    key={task.id}
                  >
                    {/* Checkbox */}

                    <button
                      className="check-button"
                      aria-label={
                        task.done
                          ? 'Mark incomplete'
                          : 'Mark complete'
                      }
                      onClick={() =>
                        dispatch(
                          toggleTask({
                            weekId,
                            date: day.date,
                            taskId: task.id,
                          })
                        )
                      }
                    >
                      {task.done && (
                        <Check
                          size={13}
                          strokeWidth={2.5}
                        />
                      )}
                    </button>

                    {/* Editable task name */}

                    {editing === task.id ? (
                      <input
                        autoFocus
                        className="task-edit"
                        value={task.name}
                        onChange={(e) =>
                          dispatch(
                            updateTask({
                              weekId,
                              date: day.date,
                              taskId: task.id,
                              name: e.target.value,
                            })
                          )
                        }
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditing(null)
                          }
                        }}
                      />
                    ) : (
                      <span
                        className="task-name"
                        onDoubleClick={() =>
                          setEditing(task.id)
                        }
                      >
                        {task.name}
                      </span>
                    )}

                    {/* Edit task */}

                    <button
                      className="icon-button edit-task"
                      title="Rename task"
                      onClick={() =>
                        setEditing(task.id)
                      }
                    >
                      <Pencil size={13} />
                    </button>

                    {/* Others text field */}

                    {['others', 'other'].includes(
                      task.name.toLowerCase()
                    ) && (
                      <input
                        className="other-input"
                        value={task.note || ''}
                        placeholder="What else did you work on?"
                        onChange={(e) =>
                          dispatch(
                            updateNote({
                              weekId,
                              date: day.date,
                              taskId: task.id,
                              note: e.target.value,
                            })
                          )
                        }
                      />
                    )}

                    {/* Remove task */}

                    <button
                      className="icon-button remove-task"
                      title="Remove task for this day"
                      onClick={() =>
                        dispatch(
                          removeTask({
                            weekId,
                            date: day.date,
                            taskId: task.id,
                          })
                        )
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task form */}

              {drafts[day.date] ? (
                <form
                  className="add-task-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    saveNewTask(day.date)
                  }}
                >
                  <input
                    autoFocus
                    value={adding[day.date] || ''}
                    onChange={(e) =>
                      setAdding((prev) => ({
                        ...prev,
                        [day.date]: e.target.value,
                      }))
                    }
                    placeholder="Task name"
                  />

                  <button
                    className="button button-dark button-small"
                    type="submit"
                  >
                    Add
                  </button>

                  <button
                    className="button button-light button-small"
                    type="button"
                    onClick={() =>
                      setDrafts((prev) => ({
                        ...prev,
                        [day.date]: false,
                      }))
                    }
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  className="add-task"
                  onClick={() =>
                    setDrafts((prev) => ({
                      ...prev,
                      [day.date]: true,
                    }))
                  }
                >
                  <Plus size={14} />
                  Add task for this day
                </button>
              )}
            </section>
          )
        })}
      </div>

      <footer className="footer-note">
        Changes are saved automatically · {done} completed this week
      </footer>
    </main>
  )
}

// ==================== MAIN APP ====================

export default function App() {
  return (
    <>
      {/* <Header /> */}

      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/week/:weekId"
          element={<WeekView />}
        />
      </Routes>
    </>
  )
}
