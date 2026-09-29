import { useMemo, useState } from 'react'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import { useNavigate } from 'react-router-dom'

type ConceptId =
  | 'dividend'
  | 'divisor'
  | 'quotient'
  | 'remainder'

type ConceptCard = {
  id: ConceptId
  label: string
}

type Placements = Partial<
  Record<ConceptId, ConceptId>
>

type WrongCounts = Record<
  ConceptId,
  number
>

const cards: ConceptCard[] = [
  {
    id: 'dividend',
    label: 'المقسوم',
  },
  {
    id: 'divisor',
    label: 'المقسوم عليه',
  },
  {
    id: 'quotient',
    label: 'ناتج القسمة',
  },
  {
    id: 'remainder',
    label: 'الباقي',
  },
]

const initialWrongCounts: WrongCounts = {
  dividend: 0,
  divisor: 0,
  quotient: 0,
  remainder: 0,
}

/* =========================================================
   CARD HINT
   ========================================================= */

function CardHint({
  type,
}: {
  type: ConceptId
}) {
  return (
    <motion.div
      className={[
        'prep1-card-hint',
        `prep1-card-hint-${type}`,
      ].join(' ')}
      initial={{
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
    >
      <div className="prep1-card-hint-rectangle">

        {type === 'dividend' && (
          <motion.span
            className="prep1-card-arrow prep1-card-arrow-dividend"
            animate={{
              x: [0, 5, 0],
              y: [0, 5, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            ↘
          </motion.span>
        )}

        {type === 'divisor' && (
          <motion.span
            className="prep1-card-arrow prep1-card-arrow-divisor"
            animate={{
              x: [0, -6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            ←
          </motion.span>
        )}

        {type === 'quotient' && (
          <motion.span
            className="prep1-card-arrow prep1-card-arrow-quotient"
            animate={{
              x: [0, 6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            →
          </motion.span>
        )}

        {type === 'remainder' && (
          <motion.span
            className="prep1-card-arrow prep1-card-arrow-remainder"
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            ↓
          </motion.span>
        )}

      </div>
    </motion.div>
  )
}

/* =========================================================
   DRAGGABLE LABEL
   ========================================================= */

function DraggableLabel({
  card,
  showHint,
  colorHint,
}: {
  card: ConceptCard
  showHint: boolean
  colorHint: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: card.id,
  })

  return (
    <div className="prep1-drag-card-wrapper">

      <button
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={[
          'prep1-label-card',

          isDragging
            ? 'prep1-drag-source'
            : '',

          showHint
            ? 'prep1-label-card-hinted'
            : '',

          colorHint
            ? 'prep1-label-color-hint'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {card.label}
      </button>

      <AnimatePresence>
        {showHint && (
          <CardHint
            type={card.id}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

/* =========================================================
   DROP ZONE
   ========================================================= */

function ConceptDropZone({
  id,
  value,
}: {
  id: ConceptId
  value?: string
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `zone-${id}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={[
        'prep1-drop-zone',

        isOver
          ? 'prep1-zone-over'
          : '',

        value
          ? 'prep1-zone-correct'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value ? (
        <>
          <motion.strong
            className="prep1-drop-value"
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            {value}
          </motion.strong>

          <span className="prep1-correct-check">
            ✓
          </span>
        </>
      ) : (
        <span className="prep1-empty-text">
          ضع البطاقة هنا
        </span>
      )}
    </div>
  )
}

/* =========================================================
   NUMBER BOX
   ========================================================= */

function NumberBox({
  value,
  colorHint,
}: {
  value: string
  colorHint: boolean
}) {
  return (
    <div
      className={[
        'prep1-number-box',

        colorHint
          ? 'prep1-number-color-hint'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value}
    </div>
  )
}

/* =========================================================
   PAGE
   ========================================================= */

export default function Stage1Page() {
  const navigate = useNavigate()

  const [activeCard, setActiveCard] =
    useState<ConceptCard | null>(
      null
    )

  const [placements, setPlacements] =
    useState<Placements>({})

  const [wrongCounts, setWrongCounts] =
    useState<WrongCounts>(
      initialWrongCounts
    )

  const [attempts, setAttempts] =
    useState(0)

  const [hintsUsed, setHintsUsed] =
    useState(0)

  const [feedback, setFeedback] =
    useState(
      'اسحب كل بطاقة وضعها في المكان المناسب.'
    )

  const [completed, setCompleted] =
    useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    })
  )

  const score = useMemo(() => {
    return Math.max(
      0,
      100 -
        attempts * 5 -
        hintsUsed * 5
    )
  }, [
    attempts,
    hintsUsed,
  ])

  const correctCount =
    Object.keys(placements).length

  const progress =
    (correctCount / 4) * 100

  const cardIsPlaced = (
    id: ConceptId
  ) => {
    return placements[id] === id
  }

  /*
    بعد غلطتين:
    يظهر Hint بالسهم.
  */
  const shouldShowHint = (
    id: ConceptId
  ) => {
    return (
      !cardIsPlaced(id) &&
      wrongCounts[id] >= 2
    )
  }

  /*
    بعد الغلطة الثالثة:
    البطاقة + الرقم الصحيح
    نفس اللون.
  */
  const shouldShowColorMatch = (
    id: ConceptId
  ) => {
    return (
      !cardIsPlaced(id) &&
      wrongCounts[id] >= 3
    )
  }

  const handleDragStart = (
    event: DragStartEvent
  ) => {
    const card =
      cards.find(
        item =>
          item.id ===
          event.active.id
      )

    if (card) {
      setActiveCard(card)
    }
  }

  const handleDragCancel = () => {
    setActiveCard(null)
  }

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event

    const dragged =
      cards.find(
        card =>
          card.id ===
          active.id
      )

    setActiveCard(null)

    if (
      !dragged ||
      !over ||
      completed
    ) {
      return
    }

    const targetId =
      String(over.id).replace(
        'zone-',
        ''
      ) as ConceptId

    /* =====================================================
       CORRECT
       ===================================================== */

    if (
      dragged.id ===
      targetId
    ) {
      const nextPlacements = {
        ...placements,
        [dragged.id]:
          dragged.id,
      }

      setPlacements(
        nextPlacements
      )

      setWrongCounts(
        prev => ({
          ...prev,
          [dragged.id]: 0,
        })
      )

      setFeedback(
        `أحسنت ⭐ وضعت بطاقة «${dragged.label}» في مكانها الصحيح.`
      )

      if (
        Object.keys(
          nextPlacements
        ).length === 4
      ) {
        completeStage(
          nextPlacements
        )
      }

      return
    }

    /* =====================================================
       WRONG
       ===================================================== */

    const nextWrong =
      wrongCounts[
        dragged.id
      ] + 1

    setAttempts(
      prev => prev + 1
    )

    setWrongCounts(
      prev => ({
        ...prev,
        [dragged.id]:
          nextWrong,
      })
    )

    if (
      nextWrong === 1
    ) {
      setFeedback(
        `مكان غير صحيح لبطاقة «${dragged.label}». حاول مرة أخرى.`
      )

      return
    }

    if (
      nextWrong === 2
    ) {
      setHintsUsed(
        prev => prev + 1
      )

      setFeedback(
        `لاحظ الرسم والسهم بجوار بطاقة «${dragged.label}» 👀 وحاول معرفة مكانها.`
      )

      return
    }

    if (
      nextWrong === 3
    ) {
      setHintsUsed(
        prev => prev + 1
      )

      setFeedback(
        `تلميح إضافي 🎨 بطاقة «${dragged.label}» والرقم الصحيح أصبحا بنفس اللون.`
      )

      return
    }

    setFeedback(
      `طابق لون بطاقة «${dragged.label}» مع الرقم الذي يحمل نفس اللون.`
    )
  }

  const completeStage = (
    finalPlacements:
      Placements
  ) => {
    setCompleted(true)

    const finalScore =
      Math.max(
        0,
        100 -
          attempts * 5 -
          hintsUsed * 5
      )

    localStorage.setItem(
      'level0Stage1',
      JSON.stringify({
        attempts,
        hintsUsed,
        score: finalScore,
        completed: true,
        answers:
          finalPlacements,
      })
    )

    setFeedback(
      'ممتاز يا بطل 🎉 تعرفت على المقسوم والمقسوم عليه وناتج القسمة والباقي.'
    )

    try {
      const utterance =
        new SpeechSynthesisUtterance(
          'أحسنت يا بطل. لقد اجتزت المرحلة الأولى بنجاح.'
        )

      utterance.lang =
        'ar-EG'

      window
        .speechSynthesis
        .cancel()

      window
        .speechSynthesis
        .speak(
          utterance
        )
    } catch {
      // ignore
    }
  }

  const resetStage = () => {
    setActiveCard(null)

    setPlacements({})

    setWrongCounts(
      initialWrongCounts
    )

    setAttempts(0)

    setHintsUsed(0)

    setCompleted(false)

    setFeedback(
      'اسحب كل بطاقة وضعها في المكان المناسب.'
    )
  }

  return (
    <main
      className="prep1-page"
      dir="rtl"
    >

      <div className="prep1-stars prep1-stars-a" />
      <div className="prep1-stars prep1-stars-b" />

      <section className="prep1-console">

        {/* HEADER */}

        <header className="prep1-header">

          <button
            className="prep1-back"
            onClick={() =>
              navigate(
                '/tutorial'
              )
            }
          >
            ←
          </button>

          <div className="prep1-header-title">

            <strong>
              المستوى التمهيدي
            </strong>

            <span>
              المرحلة الأولى • التعرف على مكونات القسمة
            </span>

          </div>

          <div className="prep1-stats">

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

        </header>

        {/* MAIN */}

        <section className="prep1-main">

          <div className="prep1-title">

            <span>
              المهمة 1
            </span>

            <h1>
              تعرّف على أجزاء القسمة
            </h1>

            <p>
              اسحب كل بطاقة وضعها في المكان الذي يمثل معناها.
            </p>

          </div>

          <DndContext
            sensors={sensors}
            onDragStart={
              handleDragStart
            }
            onDragCancel={
              handleDragCancel
            }
            onDragEnd={
              handleDragEnd
            }
          >

            <div className="prep1-game">

              {/* INFO */}

              <aside className="prep1-info-panel">

                <div className="prep1-info-icon">
                  👨‍🚀
                </div>

                <h2>
                  تعليمات المهمة
                </h2>

                <p>
                  أمامك نموذج مساحة المستطيل والأرقام موجودة بالفعل في أماكنها.
                </p>

                <p>
                  اسحب اسم كل جزء من أجزاء القسمة وضعه في مكانه الصحيح.
                </p>

                <div className="prep1-mini-progress">

                  <span>
                    تم حل
                  </span>

                  <strong dir="ltr">
                    {correctCount} / 4
                  </strong>

                </div>

                <div className="prep1-auto-hint-note">

                  <strong>
                    💡 نظام المساعدة
                  </strong>

                  <span>
                    بعد خطأين يظهر تلميح بالسهم، وإذا أخطأت مرة أخرى تظهر مطابقة بالألوان.
                  </span>

                </div>

              </aside>

              {/* BOARD */}

              <section className="prep1-board">

                <div className="prep1-board-label">
                  نموذج مساحة المستطيل
                </div>

                <div className="prep1-model-canvas">

                  {/* MAIN RECTANGLE */}

                  <div className="prep1-area-rectangle">

                    {/* DIVIDEND */}

                    <div className="prep1-position prep1-position-dividend">

                      <NumberBox
                        value="1395"
                        colorHint={
                          shouldShowColorMatch(
                            'dividend'
                          )
                        }
                      />

                      <ConceptDropZone
                        id="dividend"
                        value={
                          placements.dividend
                            ? 'المقسوم'
                            : undefined
                        }
                      />

                    </div>

                    {/* REMAINDER */}

                    <div className="prep1-position prep1-position-remainder">

                      <NumberBox
                        value="0"
                        colorHint={
                          shouldShowColorMatch(
                            'remainder'
                          )
                        }
                      />

                      <ConceptDropZone
                        id="remainder"
                        value={
                          placements.remainder
                            ? 'الباقي'
                            : undefined
                        }
                      />

                    </div>

                  </div>

                  {/* DIVISOR */}

                  <div className="prep1-position prep1-position-divisor">

                    <NumberBox
                      value="5"
                      colorHint={
                        shouldShowColorMatch(
                          'divisor'
                        )
                      }
                    />

                    <ConceptDropZone
                      id="divisor"
                      value={
                        placements.divisor
                          ? 'المقسوم عليه'
                          : undefined
                      }
                    />

                  </div>

                  {/* QUOTIENT */}

                  <div className="prep1-position prep1-position-quotient">

                    <NumberBox
                      value="279"
                      colorHint={
                        shouldShowColorMatch(
                          'quotient'
                        )
                      }
                    />

                    <ConceptDropZone
                      id="quotient"
                      value={
                        placements.quotient
                          ? 'ناتج القسمة'
                          : undefined
                      }
                    />

                  </div>

                </div>

              </section>

            </div>

            {/* CARD BANK */}

            <section className="prep1-card-bank">

              <span className="prep1-card-bank-title">
                اسحب البطاقات
              </span>

              <div className="prep1-card-row">

                {cards
                  .filter(
                    card =>
                      !cardIsPlaced(
                        card.id
                      )
                  )
                  .map(
                    card => (
                      <DraggableLabel
                        key={
                          card.id
                        }
                        card={
                          card
                        }
                        showHint={
                          shouldShowHint(
                            card.id
                          )
                        }
                        colorHint={
                          shouldShowColorMatch(
                            card.id
                          )
                        }
                      />
                    )
                  )}

                {completed && (
                  <motion.div
                    className="prep1-all-placed"
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                  >
                    ✓ تم وضع جميع البطاقات
                  </motion.div>
                )}

              </div>

            </section>

            {/* DRAG OVERLAY */}

            <DragOverlay
              dropAnimation={{
                duration: 180,
                easing:
                  'cubic-bezier(0.18,0.67,0.6,1.22)',
              }}
            >

              {activeCard ? (
                <div className="prep1-overlay-wrapper">

                  <div
                    className={[
                      'prep1-drag-overlay',

                      shouldShowColorMatch(
                        activeCard.id
                      )
                        ? 'prep1-label-color-hint'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {
                      activeCard.label
                    }
                  </div>

                  {shouldShowHint(
                    activeCard.id
                  ) && (
                    <CardHint
                      type={
                        activeCard.id
                      }
                    />
                  )}

                </div>
              ) : null}

            </DragOverlay>

          </DndContext>

          {/* FEEDBACK */}

          <AnimatePresence mode="wait">

            <motion.div
              key={feedback}
              className={[
                'prep1-feedback',

                completed
                  ? 'success'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {feedback}
            </motion.div>

          </AnimatePresence>

          {/* PROGRESS */}

          <div className="prep1-progress">

            <span>
              تقدم المرحلة
            </span>

            <div className="prep1-progress-track">

              <motion.div
                animate={{
                  width:
                    `${progress}%`,
                }}
                transition={{
                  duration: 0.4,
                }}
              />

            </div>

            <strong dir="ltr">
              {Math.round(
                progress
              )}
              %
            </strong>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="prep1-footer">

          <button
            className="prep1-reset"
            onClick={
              resetStage
            }
          >
            ↻ إعادة المحاولة
          </button>

          <div className="prep1-footer-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <AnimatePresence>

            {completed && (
              <motion.button
                className="prep1-next"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,

                  boxShadow: [
                    '0 0 15px rgba(73,255,105,.3)',
                    '0 0 35px rgba(73,255,105,.7)',
                    '0 0 15px rgba(73,255,105,.3)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                onClick={() =>
                  navigate(
                    '/level/0/stage/2'
                  )
                }
              >
                المرحلة الثانية 🚀
              </motion.button>
            )}

          </AnimatePresence>

        </footer>

      </section>

    </main>
  )
}