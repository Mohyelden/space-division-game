import { useEffect, useMemo, useState } from 'react'
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const expected = ['1', '0', '0', '2', '5']

function DigitButton({ digit, onChoose, disabled }: { digit: string; onChoose: (digit: string) => void; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `digit-${digit}`, disabled })
  return (
    <button ref={setNodeRef} {...listeners} {...attributes} type="button"
      className={`stage2-digit${isDragging ? ' dragging' : ''}`}
      onClick={() => onChoose(digit)} disabled={disabled} aria-label={`استخدم الرقم ${digit}`}>
      {digit}
    </button>
  )
}

function DigitSlot({ index, value, selected, onSelect, disabled }: { index: number; value: string; selected: boolean; onSelect: (index: number) => void; disabled: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${index}` })
  return (
    <button ref={setNodeRef} type="button" disabled={disabled} onClick={() => onSelect(index)}
      className={`stage2-digit-slot${selected ? ' selected' : ''}${isOver ? ' over' : ''}`}
      aria-label={`خانة الناتج ${index + 1}${value ? `، القيمة ${value}` : '، فارغة'}`}>
      {value || '؟'}
    </button>
  )
}

export default function Stage2Page() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState<string[]>(['', '', '', '', ''])
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [draggedDigit, setDraggedDigit] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState('اسحب رقمًا إلى الخانة، أو اضغط الخانة ثم الرقم من اللوحة.')
  const [completed, setCompleted] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  )
  const score = useMemo(() => Math.max(0, 100 - attempts * 5 - hintsUsed * 5), [attempts, hintsUsed])
  const filled = digits.filter(Boolean).length

  useEffect(() => {
    if (!localStorage.getItem('level0StartTime')) localStorage.setItem('level0StartTime', String(Date.now()))
  }, [])

  useEffect(() => {
    if (!completed) return
    const timer = window.setTimeout(() => navigate('/result'), 2300)
    return () => window.clearTimeout(timer)
  }, [completed, navigate])

  const fill = (digit: string, index?: number) => {
    if (completed) return
    const target = index ?? selectedSlot ?? digits.findIndex((value) => !value)
    if (target < 0) {
      setFeedback('امسح خانة لتغيير الرقم ثم حاول مرة أخرى.')
      return
    }
    setDigits((previous) => previous.map((value, slot) => slot === target ? digit : value))
    setSelectedSlot(null)
  }

  const checkAnswer = () => {
    if (completed || filled < expected.length) return
    if (digits.every((digit, index) => digit === expected[index])) {
      setCompleted(true)
      setFeedback('ممتاز! 100 + 25 = 125. اكتمل المستوى التمهيدي 🚀')
      localStorage.setItem('level0EndTime', String(Date.now()))
      localStorage.setItem('level0Stage2', JSON.stringify({ attempts, hintsUsed, score, completed: true, answer: '125' }))
      return
    }
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setFeedback(nextAttempts >= 2 ? 'حاول مرة أخرى. يمكنك إظهار تلميح بعد خطأين.' : 'حاول مرة أخرى! راجع ناتج كل جزء من المستطيل.')
  }

  const useHint = () => {
    setHintsUsed((value) => value + 1)
    setFeedback('500 ÷ 5 = 100، و125 ÷ 5 = 25. اجمع 100 و25 لتعرف الناتج.')
  }

  const reset = () => {
    setDigits(['', '', '', '', ''])
    setSelectedSlot(null)
    setAttempts(0)
    setHintsUsed(0)
    setCompleted(false)
    setFeedback('اسحب رقمًا إلى الخانة، أو اضغط الخانة ثم الرقم من اللوحة.')
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggedDigit(null)
    if (over?.id && String(over.id).startsWith('slot-')) {
      fill(String(active.id).replace('digit-', ''), Number(String(over.id).replace('slot-', '')))
    }
  }

  return (
    <main className="stage2-space-page" dir="rtl">
      <div className="stage2-stars stage2-stars-one" />
      <div className="stage2-stars stage2-stars-two" />
      <section className="stage2-cockpit level0-stage2-cockpit">
        <div className="stage2-top-bar">
          <button className="stage2-back-btn" onClick={() => navigate('/level/0/stage/1')} aria-label="العودة للمرحلة الأولى">←</button>
          <div className="stage2-top-title">المستوى التمهيدي <span>المرحلة الثانية • تفكيك المقسوم</span></div>
          <div className="stage2-top-stats"><div>⭐ <strong>{score}</strong></div><div>🎯 <strong>{attempts}</strong></div></div>
        </div>

        <div className="stage2-window level0-stage2-window">
          <div className="stage2-window-stars" />
          <div className="stage2-heading"><span>المهمة 2</span><h1>فكّك 625 واحسب ناتج القسمة</h1><p>املأ خانات الناتجين الجزئيين باستخدام الأرقام من 0 إلى 9</p></div>
          <DndContext sensors={sensors} onDragStart={({ active }: DragStartEvent) => setDraggedDigit(String(active.id).replace('digit-', ''))} onDragCancel={() => setDraggedDigit(null)} onDragEnd={onDragEnd}>
            <div className="level0-stage2-layout">
              <section className="level0-stage2-model" aria-label="نموذج مساحة المستطيل">
                <div className="level0-stage2-equation" dir="ltr">625 ÷ 5 = ?</div>
                <div className="level0-stage2-rectangle" dir="ltr">
                  <div className="level0-stage2-part"><strong>500</strong><span>500 ÷ 5 =</span><div className="level0-stage2-slots" dir="ltr">{[0, 1, 2].map((index) => <DigitSlot key={index} index={index} value={digits[index]} selected={selectedSlot === index} onSelect={(slot) => setSelectedSlot(slot)} disabled={completed} />)}</div></div>
                  <div className="level0-stage2-part"><strong>125</strong><span>125 ÷ 5 =</span><div className="level0-stage2-slots" dir="ltr">{[3, 4].map((index) => <DigitSlot key={index} index={index} value={digits[index]} selected={selectedSlot === index} onSelect={(slot) => setSelectedSlot(slot)} disabled={completed} />)}</div></div>
                </div>
                <div className="level0-stage2-sum" dir="ltr"><span>{digits.slice(0, 3).join('') || '___'}</span> + <span>{digits.slice(3).join('') || '__'}</span> = <strong>{filled === 5 ? Number(digits.slice(0, 3).join('')) + Number(digits.slice(3).join('')) : '؟'}</strong></div>
              </section>

              <aside className="level0-stage2-keypad" aria-label="لوحة الأرقام">
                <strong>لوحة الأرقام</strong>
                <p>اسحب الرقم أو اضغط عليه</p>
                <div className="level0-stage2-keypad-grid">{Array.from({ length: 10 }, (_, digit) => <DigitButton key={digit} digit={String(digit)} onChoose={fill} disabled={completed} />)}</div>
                <button className="level0-stage2-clear" onClick={() => { if (selectedSlot !== null) setDigits((previous) => previous.map((value, index) => index === selectedSlot ? '' : value)); else setDigits(['', '', '', '', '']) }} disabled={completed}>مسح {selectedSlot !== null ? 'الخانة المحددة' : 'الخانات'}</button>
              </aside>
            </div>
            <DragOverlay>{draggedDigit && <div className="stage2-digit drag-overlay">{draggedDigit}</div>}</DragOverlay>
          </DndContext>

          {attempts >= 2 && !completed && <button className="stage2-hint-btn" onClick={useHint}>💡 إظهار تلميح</button>}
          <motion.p className={`stage2-feedback${completed ? ' success' : ''}`} key={feedback} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">{feedback}</motion.p>
          <div className="level0-stage2-action"><button className="stage2-check-btn" onClick={checkAnswer} disabled={filled < 5 || completed}>تحقق من الناتج</button><span>الخانات المكتملة: {filled} / 5</span></div>
          <div className="stage2-engine-section"><div className="stage2-engine-label"><span>طاقة محرك القسمة</span><strong>{completed ? '100%' : `${50 + filled * 8}%`}</strong></div><div className="stage2-engine-bar"><motion.div animate={{ width: `${completed ? 100 : 50 + filled * 8}%` }} /></div></div>
        </div>

        <div className="stage2-bottom-panel"><button className="stage2-reset-btn" onClick={reset}>↻ إعادة المحاولة</button><div className="stage2-console-lights"><span /><span /><span /><span /></div>{completed && <button className="stage2-result-btn" onClick={() => navigate('/result')}>عرض شاشة الإنجاز ⭐</button>}</div>
      </section>
    </main>
  )
}
