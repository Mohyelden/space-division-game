import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Progress, Student } from '../types/game'

const initialProgress: Progress = {
  level: 0,
  stage: 1,
  score: 0,
  attempts: 0,
  hintsUsed: 0,
  completed: false,
  startedAt: Date.now(),
}

type GameContextValue = {
  student: Student | null
  progress: Progress
  setStudent: (student: Student | null) => void
  setProgress: React.Dispatch<React.SetStateAction<Progress>>
  resetRun: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(() => {
    const raw = localStorage.getItem('space-student')
    return raw ? JSON.parse(raw) : null
  })
  const [progress, setProgress] = useState<Progress>(initialProgress)

  const persistStudent = (next: Student | null) => {
    setStudent(next)
    if (next) localStorage.setItem('space-student', JSON.stringify(next))
    else localStorage.removeItem('space-student')
  }

  const value = useMemo(() => ({
    student,
    progress,
    setStudent: persistStudent,
    setProgress,
    resetRun: () => setProgress({ ...initialProgress, startedAt: Date.now() }),
  }), [student, progress])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
