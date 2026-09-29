import { useMemo, useState } from 'react'
import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Question = {
  id: number
  dividend: number
  divisor: number
  splitA: number
  splitB: number
  partialA: number
  partialB: number
  answer: number
}

const questions: Question[] = [
  {
    id: 1,
    dividend: 48,
    divisor: 12,
    splitA: 36,
    splitB: 12,
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
  {
    id: 2,
    dividend: 72,
    divisor: 18,
    splitA: 54,
    splitB: 18,
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
  {
    id: 3,
    dividend: 84,
    divisor: 21,
    splitA: 63,
    splitB: 21,
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
]

export default function Level1Page() {
  const navigate = useNavigate()

  const [questionIndex, setQuestionIndex] =
    useState(0)

  const [answer, setAnswer] =
    useState('')

  const [attempts, setAttempts] =
    useState(0)

  const [hintsUsed, setHintsUsed] =
    useState(0)

  const [wrongAttemptsCurrent, setWrongAttemptsCurrent] =
    useState(0)

  const [showHint, setShowHint] =
    useState(false)

  const [feedback, setFeedback] =
    useState(
      'استخدم نموذج مساحة المستطيل ثم اكتب الناتج الصحيح.'
    )

  const [questionSolved, setQuestionSolved] =
    useState(false)

  const [completed, setCompleted] =
    useState(false)

  const currentQuestion =
    questions[questionIndex]

  const score = useMemo(() => {
    return Math.max(
      0,
      100 -
        attempts * 5 -
        hintsUsed * 10
    )
  }, [attempts, hintsUsed])

  const checkAnswer = () => {
    if (
      !answer ||
      questionSolved ||
      completed
    ) {
      return
    }

    if (
      Number(answer) ===
      currentQuestion.answer
    ) {
      setQuestionSolved(true)

      setFeedback(
        'أحسنت! الإجابة صحيحة ⭐'
      )

      return
    }

    const nextAttempts =
      attempts + 1

    const nextCurrentWrong =
      wrongAttemptsCurrent + 1

    setAttempts(nextAttempts)

    setWrongAttemptsCurrent(
      nextCurrentWrong
    )

    setFeedback(
      'ليست الإجابة الصحيحة. جرّب مرة أخرى.'
    )

    if (nextCurrentWrong >= 2) {
      setShowHint(true)
    }
  }

  const useHint = () => {
    setHintsUsed(
      (prev) => prev + 1
    )

    setFeedback(
      `${currentQuestion.splitA} ÷ ${currentQuestion.divisor} = ${currentQuestion.partialA}، و ${currentQuestion.splitB} ÷ ${currentQuestion.divisor} = ${currentQuestion.partialB}. اجمع الناتجين.`
    )
  }

  const nextQuestion = () => {
    if (!questionSolved) return

    if (
      questionIndex <
      questions.length - 1
    ) {
      setQuestionIndex(
        (prev) => prev + 1
      )

      setAnswer('')
      setQuestionSolved(false)
      setWrongAttemptsCurrent(0)
      setShowHint(false)

      setFeedback(
        'ممتاز! استعد للغز التالي.'
      )

      return
    }

    finishLevel()
  }

  const finishLevel = () => {
    const finalScore =
      Math.max(
        0,
        100 -
          attempts * 5 -
          hintsUsed * 10
      )

    localStorage.setItem(
      'level1Result',
      JSON.stringify({
        score: finalScore,
        attempts,
        hintsUsed,
        completed: true,
        questions: questions.length,
      })
    )

    localStorage.setItem(
      'level1Complete',
      'true'
    )

    setCompleted(true)
  }

  const restartLevel = () => {
    setQuestionIndex(0)
    setAnswer('')
    setAttempts(0)
    setHintsUsed(0)
    setWrongAttemptsCurrent(0)
    setShowHint(false)
    setQuestionSolved(false)
    setCompleted(false)

    setFeedback(
      'استخدم نموذج مساحة المستطيل ثم اكتب الناتج الصحيح.'
    )
  }

  if (completed) {
    return (
      <main
        className="level1-space-page"
        dir="rtl"
      >
        <div className="level1-stars level1-stars-one" />
        <div className="level1-stars level1-stars-two" />

        <section className="level1-cockpit level1-complete-cockpit">

          <motion.div
            className="level1-complete-trophy"
            initial={{
              scale: 0,
              rotate: -15,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
            }}
          >
            🏆
          </motion.div>

          <h1>
            رائع يا بطل!
          </h1>

          <p>
            أكملت جميع ألغاز المستوى الأول وفتحت تحدي المحرك.
          </p>

          <div className="level1-complete-stars">
            ⭐ ⭐ ⭐
          </div>

          <div className="level1-result-grid">

            <div>
              <span>
                الدرجة
              </span>

              <strong>
                {score}
              </strong>
            </div>

            <div>
              <span>
                المحاولات
              </span>

              <strong>
                {attempts}
              </strong>
            </div>

            <div>
              <span>
                التلميحات
              </span>

              <strong>
                {hintsUsed}
              </strong>
            </div>

          </div>

          <div className="level1-unlocked-message">
            <span>
              🔓
            </span>

            <div>
              <strong>
                تم فتح المستوى 2
              </strong>

              <small>
                تحدي المحرك أصبح متاحًا الآن
              </small>
            </div>
          </div>

          <div className="level1-complete-actions">

            <button
              className="level1-secondary-btn"
              onClick={restartLevel}
            >
              ↻ إعادة المستوى
            </button>

            <motion.button
              className="level1-main-btn"
              onClick={() =>
                navigate('/map')
              }
              animate={{
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
            >
              العودة إلى الخريطة 🚀
            </motion.button>

          </div>

        </section>

      </main>
    )
  }

  return (
    <main
      className="level1-space-page"
      dir="rtl"
    >
      <div className="level1-stars level1-stars-one" />
      <div className="level1-stars level1-stars-two" />

      <section className="level1-cockpit">

        {/* HEADER */}

        <div className="level1-top-bar">

          <button
            className="level1-back-btn"
            onClick={() =>
              navigate('/map')
            }
          >
            ←
          </button>

          <div className="level1-title">

            <strong>
              المستوى 1
            </strong>

            <span>
              ألغاز القسمة
            </span>

          </div>

          <div className="level1-stats">

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

        {/* WINDOW */}

        <div className="level1-window">

          <div className="level1-window-stars" />

          <motion.div
            className="level1-astronaut"
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

          <div className="level1-heading">

            <span>
              لغز{' '}
              {questionIndex + 1}
              {' '}من{' '}
              {questions.length}
            </span>

            <h1>
              حل لغز القسمة
            </h1>

            <p>
              فكك المقسوم إلى أجزاء يسهل قسمتها
            </p>

          </div>

          <div className="level1-progress-dots">

            {questions.map(
              (question, index) => (
                <span
                  key={question.id}
                  className={
                    index <
                    questionIndex
                      ? 'done'
                      : index ===
                        questionIndex
                      ? 'active'
                      : ''
                  }
                >
                  {index <
                  questionIndex
                    ? '✓'
                    : index + 1}
                </span>
              )
            )}

          </div>

          <div className="level1-game-layout">

            {/* QUESTION */}

            <div className="level1-question-card">

              <span>
                المسألة
              </span>

              <div
                className="level1-equation"
                dir="ltr"
              >
                {currentQuestion.dividend}
                {' ÷ '}
                {currentQuestion.divisor}
              </div>

              <p>
                فكك العدد{' '}
                {currentQuestion.dividend}
                {' '}إلى جزأين مناسبين ثم احسب الناتج.
              </p>

              <div className="level1-question-data">

                <div>
                  <small>
                    المقسوم
                  </small>

                  <strong>
                    {currentQuestion.dividend}
                  </strong>
                </div>

                <div>
                  <small>
                    المقسوم عليه
                  </small>

                  <strong>
                    {currentQuestion.divisor}
                  </strong>
                </div>

              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.button
                    className="level1-hint-btn"
                    initial={{
                      opacity: 0,
                      y: 8,
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

            {/* MODEL */}

            <div className="level1-model-card">

              <div className="level1-model-title">
                نموذج مساحة المستطيل
              </div>

              <div className="level1-area-model">

                <motion.div
                  className="level1-area-a"
                  key={`${currentQuestion.id}-a`}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                >
                  {currentQuestion.splitA}
                </motion.div>

                <motion.div
                  className="level1-area-b"
                  key={`${currentQuestion.id}-b`}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                >
                  {currentQuestion.splitB}
                </motion.div>

              </div>

              <div className="level1-calculations">

                <motion.div
                  key={`${currentQuestion.id}-calc-a`}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <small>
                    الجزء الأول
                  </small>

                  <strong dir="ltr">
                    {currentQuestion.splitA}
                    {' ÷ '}
                    {currentQuestion.divisor}
                    {' = '}
                    {currentQuestion.partialA}
                  </strong>
                </motion.div>

                <motion.div
                  key={`${currentQuestion.id}-calc-b`}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <small>
                    الجزء الثاني
                  </small>

                  <strong dir="ltr">
                    {currentQuestion.splitB}
                    {' ÷ '}
                    {currentQuestion.divisor}
                    {' = '}
                    {currentQuestion.partialB}
                  </strong>
                </motion.div>

              </div>

              <div className="level1-answer-area">

                <label>
                  الناتج النهائي
                </label>

                <input
                  value={answer}
                  disabled={
                    questionSolved
                  }
                  inputMode="numeric"
                  placeholder="؟"
                  onChange={(event) => {
                    setAnswer(
                      event.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      'Enter'
                    ) {
                      checkAnswer()
                    }
                  }}
                />

                {!questionSolved ? (
                  <motion.button
                    className="level1-check-btn"
                    onClick={checkAnswer}
                    disabled={!answer}
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                  >
                    تحقق
                  </motion.button>
                ) : (
                  <motion.button
                    className="level1-next-question-btn"
                    onClick={nextQuestion}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                  >
                    {questionIndex ===
                    questions.length - 1
                      ? 'إنهاء المستوى 🚀'
                      : 'اللغز التالي ←'}
                  </motion.button>
                )}

              </div>

              <AnimatePresence mode="wait">

                <motion.div
                  key={feedback}
                  className={`level1-feedback ${
                    questionSolved
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
                >
                  {feedback}
                </motion.div>

              </AnimatePresence>

            </div>

          </div>

          {/* ENGINE */}

          <div className="level1-engine">

            <div className="level1-engine-info">

              <span>
                طاقة المحرك
              </span>

              <strong>
                {Math.round(
                  ((questionIndex +
                    (questionSolved
                      ? 1
                      : 0)) /
                    questions.length) *
                    100
                )}
                %
              </strong>

            </div>

            <div className="level1-engine-bar">
              <motion.div
                animate={{
                  width: `${
                    ((questionIndex +
                      (questionSolved
                        ? 1
                        : 0)) /
                      questions.length) *
                    100
                  }%`,
                }}
                transition={{
                  duration: 0.5,
                }}
              />
            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="level1-bottom-panel">

          <div className="level1-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <span className="level1-bottom-text">
            استخدم أقل عدد من المحاولات لتحصل على أعلى درجة
          </span>

          <div className="level1-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

        </div>

      </section>

    </main>
  )
}