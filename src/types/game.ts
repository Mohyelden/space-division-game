export type Student = {
  id: string
  student_code: string
  student_name: string | null
}

export type Progress = {
  level: number
  stage: number
  score: number
  attempts: number
  hintsUsed: number
  completed: boolean
  startedAt: number
}
