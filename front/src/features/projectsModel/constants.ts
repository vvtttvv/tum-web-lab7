import type { ProjectFormState, TimerSettings } from './types'

export const durationOptions = ['25m', '45m', '1h 00m', '1h 30m', '2h 00m', '3h 00m']

export const colorOptions = [
  '#ff4d57',
  '#ff7f1f',
  '#ffb114',
  '#91d722',
  '#37d05d',
  '#20c7a5',
  '#1ec8bc',
  '#1eaedb',
  '#1f8fe2',
  '#3e7bea',
  '#6070f0',
  '#8563eb',
  '#a35af0',
  '#c14de2',
  '#df449f',
  '#ff4464',
  '#b09362',
  '#748ea0',
]

export const defaultTimerSettings: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 10,
  cycles: 3,
}

export const defaultProjectForm: ProjectFormState = {
  projectName: '',
  duration: '1h 00m',
  frequency: 'repeating',
  period: 'daily',
  selectedColor: '#1ec8bc',
  timerSettings: defaultTimerSettings,
}

export const buildId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
