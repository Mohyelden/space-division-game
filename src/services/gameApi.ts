import { supabase } from '../lib/supabase'
import type { Student } from '../types/game'

export async function getOrCreateStudent(studentCode: string, studentName?: string): Promise<Student> {
  if (!supabase) {
    return { id: `local-${studentCode}`, student_code: studentCode, student_name: studentName ?? null }
  }

  const { data: existing, error: findError } = await supabase
    .from('students')
    .select('id,student_code,student_name')
    .eq('student_code', studentCode)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing as Student

  const { data, error } = await supabase
    .from('students')
    .insert({ student_code: studentCode, student_name: studentName ?? null })
    .select('id,student_code,student_name')
    .single()

  if (error) throw error
  return data as Student
}

export async function saveProgress(input: {
  studentId: string
  level: number
  stage: number
  score: number
  attempts: number
  hintsUsed: number
  completed: boolean
  completionTimeSeconds: number
}) {
  if (!supabase) return

  const { error } = await supabase.from('progress').insert({
    student_id: input.studentId,
    level: input.level,
    stage: input.stage,
    score: input.score,
    attempts: input.attempts,
    hints_used: input.hintsUsed,
    completed: input.completed,
    completion_time_seconds: input.completionTimeSeconds,
  })

  if (error) throw error
}
