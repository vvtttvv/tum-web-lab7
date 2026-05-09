import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Session } from '../projectsModel/types'
import { formatHoursMinutes } from '../projectsModel/time'

type StatsViewProps = {
  sessions: Session[]
}

type RangeMode = 'week' | 'month'

type DayStat = {
  key: string
  label: string
  valueSeconds: number
}

type ChartPoint = {
  label: string
  seconds: number
}

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split('-').map((part) => Number.parseInt(part, 10))
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

const startOfWeek = (date: Date) => {
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const start = new Date(date)
  start.setDate(date.getDate() + diff)
  start.setHours(0, 0, 0, 0)
  return start
}

const addDays = (date: Date, amount: number) => {
  const next = new Date(date)
  next.setDate(date.getDate() + amount)
  return next
}

const getMonthKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const buildMonthOptions = (count = 12) => {
  const today = new Date()
  const options: { key: string; label: string; date: Date }[] = []

  for (let i = 0; i < count; i += 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const key = getMonthKey(date)
    options.push({
      key,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      date,
    })
  }

  return options
}

const buildWeekOptions = (count = 8) => {
  const today = new Date()
  const options: { key: string; label: string; start: Date }[] = []

  for (let i = 0; i < count; i += 1) {
    const date = addDays(today, -7 * i)
    const start = startOfWeek(date)
    const key = getDateKey(start)
    const end = addDays(start, 6)
    const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    options.push({ key, label, start })
  }

  return options
}

const sumForDay = (sessions: Session[], key: string) =>
  sessions.reduce((total, session) => total + (session.dailyLog[key] ?? 0), 0)

const formatBarLabel = (date: Date, mode: RangeMode, index: number) => {
  if (mode === 'week') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return index % 7 === 0
    ? date.toLocaleDateString('en-US', { day: 'numeric' })
    : ''
}

export function StatsView({ sessions }: StatsViewProps) {
  const monthOptions = useMemo(() => buildMonthOptions(), [])
  const weekOptions = useMemo(() => buildWeekOptions(), [])
  const [rangeMode, setRangeMode] = useState<RangeMode>('week')
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.key ?? getMonthKey(new Date()))
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[0]?.key ?? getDateKey(startOfWeek(new Date())))

  const dayStats = useMemo<DayStat[]>(() => {
    if (rangeMode === 'week') {
      const start = parseDateKey(selectedWeek)
      return Array.from({ length: 7 }).map((_, index) => {
        const date = addDays(start, index)
        const key = getDateKey(date)
        return {
          key,
          label: formatBarLabel(date, rangeMode, index),
          valueSeconds: sumForDay(sessions, key),
        }
      })
    }

    const [year, month] = selectedMonth.split('-').map((part) => Number.parseInt(part, 10))
    const start = new Date(year, (month ?? 1) - 1, 1)
    const daysInMonth = new Date(year, (month ?? 1), 0).getDate()

    return Array.from({ length: daysInMonth }).map((_, index) => {
      const date = addDays(start, index)
      const key = getDateKey(date)
      return {
        key,
        label: formatBarLabel(date, rangeMode, index),
        valueSeconds: sumForDay(sessions, key),
      }
    })
  }, [rangeMode, selectedMonth, selectedWeek, sessions])

  const chartData = dayStats.map<ChartPoint>((stat) => ({
    label: stat.label || stat.key.slice(8),
    seconds: stat.valueSeconds,
  }))

  const totalSeconds = dayStats.reduce((total, stat) => total + stat.valueSeconds, 0)

  return (
    <section className="stats-view">
      <header className="stats-header">
        <div>
          <h2 className="stats-title">Focus stats</h2>
          <p className="stats-subtitle">Track time spent in focus sessions.</p>
        </div>
        <div className="stats-summary">
          <span className="stats-label">Total</span>
          <strong className="stats-value">{formatHoursMinutes(totalSeconds)}</strong>
        </div>
      </header>

      <div className="stats-controls">
        <div className="stats-toggle">
          <button
            type="button"
            className={`chip${rangeMode === 'week' ? ' active' : ''}`}
            onClick={() => setRangeMode('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`chip${rangeMode === 'month' ? ' active' : ''}`}
            onClick={() => setRangeMode('month')}
          >
            Month
          </button>
        </div>

        {rangeMode === 'week' ? (
          <select
            className="field-select compact"
            value={selectedWeek}
            onChange={(event) => setSelectedWeek(event.target.value)}
          >
            {weekOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="field-select compact"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          >
            {monthOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={`stats-chart ${rangeMode}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickFormatter={(value) => (value > 0 ? formatHoursMinutes(value) : '0h 00m')}
              width={70}
            />
            <Tooltip
              formatter={(value) => formatHoursMinutes(Number(value))}
              labelFormatter={(label) => `Day: ${label}`}
              contentStyle={{
                background: 'rgba(16, 18, 28, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#eef6ff',
              }}
            />
            <Bar dataKey="seconds" fill="var(--color-brand)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
