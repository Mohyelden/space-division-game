import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Stage2Page() {
  const navigate = useNavigate()

  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(
    'احسب ناتج القسمة بعد تفكيك العدد.'
  )
  const [completed, setCompleted] = useState(false)

  const score = useMemo(() => {
    return Math.max(
      0,
      100 - attempts * 5 - hintsUsed * 10
    )
  }, [attempts, hintsUsed])

  const checkAnswer = () => {
    if (completed) return

    const numericAnswer = Number(answer)

    if (numericAnswer === 4) {
      setCompleted(true)

      setFeedback(
        'ممتاز! الناتج صحيح وتم تشغيل محرك القسمة بنجاح 🚀'
      )

      localStorage.setItem(
        'level0Stage2',
        JSON.stringify({
          attempts,
          hintsUsed,
          score,
          completed: true,
        })
      )

      localStorage.setItem(
        'level0Complete',
        'true'
      )

      return
    }

    const nextAttempts = attempts + 1

    setAttempts(nextAttempts)

    setFeedback(
      'الإجابة غير صحيحة، جرّب مرة أخرى.'
    )

    if (
      nextAttempts >= 2 &&
      !showHint
    ) {
      setShowHint(true)
    }
  }

  const useHint = () => {
    setHintsUsed((prev) => prev + 1)

    setFeedback(
      'التلميح: 27 ÷ 9 = 3 و 9 ÷ 9 = 1، ثم اجمع الناتجين.'
    )
  }

  const resetStage = () => {
    setAnswer('')
    setAttempts(0)
    setHintsUsed(0)
    setShowHint(false)
    setCompleted(false)

    setFeedback(
      'احسب ناتج القسمة بعد تفكيك العدد.'
    )
  }

  const goToResult = () => {
    navigate('/result')
  }

  return (
    <main
      className="stage2-space-page"
      dir="rtl"
    >
      <div className="stage2-stars stage2-stars-one" />
      <div className="stage2-stars stage2-stars-two" />

      <section className="stage2-cockpit">

        {/* TOP BAR */}
        <div className="stage2-top-bar">

          <button
            className="stage2-back-btn"
            onClick={() =>
              navigate('/level/0/stage/1')
            }
          >
            ←
          </button>

          <div className="stage2-top-title">
            المستوى التمهيدي
            <span>
              المرحلة الثانية
            </span>
          </div>

          <div className="stage2-top-stats">

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

        {/* MAIN WINDOW */}
        <div className="stage2-window">

          <div className="stage2-window-stars" />

          <motion.div
            className="stage2-astronaut"
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

          <div className="stage2-heading">

            <span>
              المهمة 2
            </span>

            <h1>
              فكك العدد واحسب الناتج
            </h1>

            <p>
              استخدم نموذج مساحة المستطيل للوصول إلى الناتج النهائي
            </p>

          </div>

          <div className="stage2-game-layout">

            {/* LEFT SIDE */}

            <div className="stage2-question-card">

              <span className="stage2-question-label">
                السؤال
              </span>

              <div className="stage2-equation">
                36 ÷ 9
              </div>

              <p>
                تم ترتيب عناصر القسمة بنجاح.
                الآن فكك العدد 36 إلى أجزاء يسهل قسمتها على 9.
              </p>

              <div className="stage2-breakdown-summary">

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
                    className="stage2-hint-btn"
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

            {/* RIGHT SIDE */}

            <div className="stage2-board">

              <div className="stage2-board-title">
                نموذج مساحة المستطيل
              </div>

              <div className="stage2-area-model">

                <motion.div
                  className="stage2-area-large"
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  <span>
                    27
                  </span>
                </motion.div>

                <motion.div
                  className="stage2-area-small"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                  }}
                >
                  <span>
                    9
                  </span>
                </motion.div>

              </div>

              <div className="stage2-calculation-steps">

                <motion.div
                  className="stage2-calc-box"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                  }}
                >
                  <small>
                    الجزء الأول
                  </small>

                  <strong>
                    27 ÷ 9 = 3
                  </strong>
                </motion.div>

                <motion.div
                  className="stage2-calc-box"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.7,
                  }}
                >
                  <small>
                    الجزء الثاني
                  </small>

                  <strong>
                    9 ÷ 9 = 1
                  </strong>
                </motion.div>

              </div>

              <div className="stage2-answer-section">

                <label>
                  الناتج النهائي
                </label>

                <input
                  value={answer}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ''
                      )

                    setAnswer(value)
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
                    ) {
                      checkAnswer()
                    }
                  }}
                  disabled={completed}
                  inputMode="numeric"
                  placeholder="؟"
                />

                <motion.button
                  className="stage2-check-btn"
                  onClick={checkAnswer}
                  disabled={
                    !answer || completed
                  }
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                >
                  تحقق من الإجابة
                </motion.button>

              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={feedback}
                  className={`stage2-feedback ${
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

          </div>

          {/* ENGINE */}

          <div className="stage2-engine-section">

            <div className="stage2-engine-label">

              <span>
                طاقة محرك القسمة
              </span>

              <strong>
                {completed
                  ? '100%'
                  : answer
                  ? '70%'
                  : '50%'}
              </strong>

            </div>

            <div className="stage2-engine-bar">

              <motion.div
                animate={{
                  width: completed
                    ? '100%'
                    : answer
                    ? '70%'
                    : '50%',
                }}
                transition={{
                  duration: 0.6,
                }}
              />

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="stage2-bottom-panel">

          <button
            className="stage2-reset-btn"
            onClick={resetStage}
          >
            ↻ إعادة المحاولة
          </button>

          <div className="stage2-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <AnimatePresence>
            {completed && (
              <motion.button
                className="stage2-result-btn"
                onClick={goToResult}
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
              >
                عرض النتيجة
                <span>
                  ⭐
                </span>
              </motion.button>
            )}
          </AnimatePresence>

        </div>

      </section>
    </main>
  )
}