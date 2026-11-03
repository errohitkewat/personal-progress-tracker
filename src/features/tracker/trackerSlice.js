import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_TASKS = ['DSA', 'Aptitude / Reasoning', 'Frontend', 'Backend', 'Group Drive Personal Project', 'Others']
const load = () => {
  try { return JSON.parse(localStorage.getItem('progress-tracker-v1')) || { weeks: [], taskTemplates: DEFAULT_TASKS } }
  catch { return { weeks: [], taskTemplates: DEFAULT_TASKS } }
}
const initialState = load()
const persist = (state) => localStorage.setItem('progress-tracker-v1', JSON.stringify(state))

const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    createWeek(state, action) {
      const { startDate, tasks } = action.payload
      const start = new Date(`${startDate}T12:00:00`)
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start); d.setDate(start.getDate() + i)
        const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        return { date, entries: tasks.map((name, index) => ({ id: `${date}-${index}-${name}`, name, done: false, note: '' })) }
      })
      const id = startDate
      if (!state.weeks.some(w => w.id === id)) state.weeks.unshift({ id, startDate, days })
      state.taskTemplates = tasks
      persist(state)
    },
    toggleTask(state, action) {
      const { weekId, date, taskId } = action.payload
      const day = state.weeks.find(w => w.id === weekId)?.days.find(d => d.date === date)
      const task = day?.entries.find(e => e.id === taskId)
      if (task) task.done = !task.done
      persist(state)
    },
    updateTask(state, action) {
      const { weekId, date, taskId, name } = action.payload
      const task = state.weeks.find(w => w.id === weekId)?.days.find(d => d.date === date)?.entries.find(e => e.id === taskId)
      if (task) task.name = name
      persist(state)
    },
    addTask(state, action) {
      const { weekId, date, name } = action.payload
      const day = state.weeks.find(w => w.id === weekId)?.days.find(d => d.date === date)
      if (day && name.trim()) day.entries.push({ id: `${date}-${Date.now()}`, name: name.trim(), done: false, note: '' })
      persist(state)
    },
    removeTask(state, action) {
      const { weekId, date, taskId } = action.payload
      const day = state.weeks.find(w => w.id === weekId)?.days.find(d => d.date === date)
      if (day) day.entries = day.entries.filter(e => e.id !== taskId)
      persist(state)
    },
    updateNote(state, action) {
      const { weekId, date, taskId, note } = action.payload
      const task = state.weeks.find(w => w.id === weekId)?.days.find(d => d.date === date)?.entries.find(e => e.id === taskId)
      if (task) task.note = note
      persist(state)
    },
    deleteWeek(state, action) {
      state.weeks = state.weeks.filter(w => w.id !== action.payload)
      persist(state)
    }
  }
})
export const { createWeek, toggleTask, updateTask, addTask, removeTask, updateNote, deleteWeek } = trackerSlice.actions
export default trackerSlice.reducer