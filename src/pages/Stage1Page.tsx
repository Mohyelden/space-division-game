import { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type CardType = {
  id: string
  value: string
  type: 'dividend' | 'divisor'
}

const cards: CardType[] = [
  {
    id: 'dividend-card',
    value: '36',
    type: 'dividend',
  },
  {
    id: 'divisor-card',
    value: '9',
    type: 'divisor',
  },
]

function DraggableCard({
  card,
  disabled,
}: {
  card: CardType
  disabled: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
    disabled,
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.55 : 1,
    cursor: disabled ? 'default' : 'grab',
  }

  return (
    <motion.button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`stage1-number-card ${card.type}`}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.06,
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.96,
            }
      }
    >
      {card.value}
    </motion.button>
  )
}

function DropZone({
  id,
  label,
  value,
  correct,
  hintActive,
}: {
  id: string
  label: string
  value?: string
  correct: boolean
  hintActive: boolean
}) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id,
  })

  return (
    <motion.div
      ref={setNodeRef}
      className={[
        'stage1-drop-zone',
        isOver ? 'over' : '',
        correct ? 'correct' : '',
        hintActive ? 'hint-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      animate={
        hintActive
          ? {
              boxShadow: [
                '0 0 10px rgba(255,220,70,.25)',
                '0 0 26px rgba(255,220,70,.7)',
                '0 0 10px rgba(255,220,70,.25)',
              ],
            }
          : {}
      }
      transition={{
        duration: 1.2,
        repeat: hintActive ? Infinity : 0,
      }}
    >
      <span className="stage1-drop-label">
        {label}
      </span>

      {value ? (
        <strong className="stage1-dropped-value">
          {value}
        </strong>
      ) : (
        <span className="stage1-drop-placeholder">
          اسحب هنا
        </span>
      )}

      {correct && (
        <span className="stage1-correct-icon">
          ✓
        </span>
      )}
    </motion.div>
  )
}

export default function Stage1Page() {
  const navigate = useNavigate()

  const [dividend, setDividend] =
    useState<string | null>(null)

  const [divisor, setDivisor] =
    useState<string | null>(null)

  const [attempts, setAttempts] =
    useState(0)

  const [hintsUsed, setHintsUsed] =
    useState(0)

  const [feedback, setFeedback] =
    useState(
      'اسحب كل بطاقة إلى مكانها الصحيح حول نموذج مساحة المستطيل.'
    )

  const [showHint, setShowHint] =
    useState(false)

  const [completed, setCompleted] =
    useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  )

  const score = useMemo(() => {
    const penalty =
      attempts * 5 + hintsUsed * 10

    return Math.max(0, 100 - penalty)
  }, [attempts, hintsUsed])

  const usedCardIds = useMemo(() => {
    const used: string[] = []

    if (dividend === '36') {
      used.push('dividend-card')
    }

    if (divisor === '9') {
      used.push('divisor-card')
    }

    return used
  }, [dividend, divisor])

  const checkCompletion = (
    nextDividend: string | null,
    nextDivisor: string | null
  ) => {
    if (
      nextDividend === '36' &&
      nextDivisor === '9'
    ) {
      setCompleted(true)

      setFeedback(
        'ممتاز! وضعت المقسوم والمقسوم عليه في المكان الصحيح.'
      )

      const result = {
        attempts,
        hintsUsed,
        score,
        completed: true,
      }

      localStorage.setItem(
        'level0Stage1',
        JSON.stringify(result)
      )
    }
  }

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event

    if (!over || completed) return

    const card = cards.find(
      (item) => item.id === active.id
    )

    if (!card) return

    const target = over.id

    const isCorrectDrop =
      (card.type === 'dividend' &&
        target === 'dividend-zone') ||
      (card.type === 'divisor' &&
        target === 'divisor-zone')

    if (!isCorrectDrop) {
      const nextAttempts =
        attempts + 1

      setAttempts(nextAttempts)

      setFeedback(
        'ليست هنا. حاول مرة أخرى 👀'
      )

      if (
        nextAttempts >= 2 &&
        !showHint
      ) {
        setShowHint(true)
      }

      return
    }

    let nextDividend = dividend
    let nextDivisor = divisor

    if (card.type === 'dividend') {
      nextDividend = card.value

      setDividend(card.value)

      setFeedback(
        'أحسنت! وضعت المقسوم في مكانه الصحيح.'
      )
    }

    if (card.type === 'divisor') {
      nextDivisor = card.value

      setDivisor(card.value)

      setFeedback(
        'رائع! وضعت المقسوم عليه في مكانه الصحيح.'
      )
    }

    checkCompletion(
      nextDividend,
      nextDivisor
    )
  }

  const useHint = () => {
    if (showHint) {
      setHintsUsed((prev) => prev + 1)

      setFeedback(
        'التلميح: 36 هو المقسوم، و9 هو المقسوم عليه.'
      )
    }
  }

  const resetStage = () => {
    setDividend(null)
    setDivisor(null)
    setAttempts(0)
    setHintsUsed(0)
    setFeedback(
      'اسحب كل بطاقة إلى مكانها الصحيح حول نموذج مساحة المستطيل.'
    )
    setShowHint(false)
    setCompleted(false)
  }

  const goNext = () => {
    const finalScore =
      Math.max(
        0,
        100 - attempts * 5 - hintsUsed * 10
      )

    localStorage.setItem(
      'level0Stage1',
      JSON.stringify({
        attempts,
        hintsUsed,
        score: finalScore,
        completed: true,
      })
    )

    navigate('/level/0/stage/2')
  }

  return (
    <main
      className="stage1-space-page"
      dir="rtl"
    >
      <div className="stage1-stars stage1-stars-one" />
      <div className="stage1-stars stage1-stars-two" />

      <section className="stage1-cockpit">
        <div className="stage1-top-bar">
          <button
            className="stage1-back-btn"
            onClick={() =>
              navigate('/tutorial')
            }
          >
            ←
          </button>

          <div className="stage1-top-title">
            المستوى التمهيدي
            <span>
              المرحلة الأولى
            </span>
          </div>

          <div className="stage1-top-stats">
            <div>
              ⭐
              <strong>
                {score}
              </strong>
            </div>

            <div>
              🎯
              <strong>
                {attempts}
              </strong>
            </div>
          </div>
        </div>

        <div className="stage1-window">
          <div className="stage1-window-stars" />

          <motion.div
            className="stage1-astronaut"
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            👨‍🚀
          </motion.div>

          <div className="stage1-heading">
            <span>
              المهمة 1
            </span>

            <h1>
              جهّز نموذج القسمة
            </h1>

            <p>
              ضع المقسوم والمقسوم عليه في المكان الصحيح
            </p>
          </div>

          <div className="stage1-game-layout">
            <div className="stage1-mission-card">
              <div className="stage1-question-label">
                السؤال
              </div>

              <div className="stage1-equation">
                36 ÷ 9
              </div>

              <div className="stage1-mission-text">
                <p>
                  قبل أن نبدأ الحساب، نحتاج لترتيب عناصر القسمة حول نموذج مساحة المستطيل.
                </p>
              </div>

              <div className="stage1-mini-info">
                <div>
                  <span>
                    المقسوم
                  </span>

                  <strong>
                    36
                  </strong>
                </div>

                <div>
                  <span>
                    المقسوم عليه
                  </span>

                  <strong>
                    9
                  </strong>
                </div>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.button
                    className="stage1-hint-btn"
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    onClick={useHint}
                  >
                    💡 استخدم تلميح
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
            >
              <div className="stage1-board">
                <div className="stage1-board-title">
                  نموذج مساحة المستطيل
                </div>

                <div className="stage1-board-content">
                  <DropZone
                    id="divisor-zone"
                    label="المقسوم عليه"
                    value={divisor || undefined}
                    correct={
                      divisor === '9'
                    }
                    hintActive={
                      showHint &&
                      divisor !== '9'
                    }
                  />

                  <div className="stage1-area-model">
                    <div />
                    <div />
                    <div />
                    <div />

                    <div className="stage1-area-center">
                      ?
                    </div>
                  </div>

                  <DropZone
                    id="dividend-zone"
                    label="المقسوم"
                    value={dividend || undefined}
                    correct={
                      dividend === '36'
                    }
                    hintActive={
                      showHint &&
                      dividend !== '36'
                    }
                  />
                </div>

                <div className="stage1-cards-title">
                  اسحب البطاقات
                </div>

                <div className="stage1-cards-row">
                  {cards.map((card) => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      disabled={
                        usedCardIds.includes(
                          card.id
                        ) || completed
                      }
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={feedback}
                    className={`stage1-feedback ${
                      completed
                        ? 'success'
                        : ''
                    }`}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    {feedback}
                  </motion.div>
                </AnimatePresence>
              </div>
            </DndContext>
          </div>

          <div className="stage1-progress-section">
            <div className="stage1-engine-info">
              <span>
                طاقة المحرك
              </span>

              <strong>
                {completed
                  ? '50%'
                  : dividend || divisor
                  ? '30%'
                  : '15%'}
              </strong>
            </div>

            <div className="stage1-engine-bar">
              <motion.div
                animate={{
                  width: completed
                    ? '50%'
                    : dividend || divisor
                    ? '30%'
                    : '15%',
                }}
                transition={{
                  duration: 0.5,
                }}
              />
            </div>
          </div>
        </div>

        <div className="stage1-bottom-panel">
          <button
            className="stage1-reset-btn"
            onClick={resetStage}
          >
            ↻ إعادة المحاولة
          </button>

          <div className="stage1-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <AnimatePresence>
            {completed && (
              <motion.button
                className="stage1-next-btn"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    '0 0 15px rgba(72,255,101,.3)',
                    '0 0 35px rgba(72,255,101,.75)',
                    '0 0 15px rgba(72,255,101,.3)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                onClick={goNext}
              >
                المرحلة الثانية
                <span>
                  🚀
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}