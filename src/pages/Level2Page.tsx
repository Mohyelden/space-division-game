import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Challenge = {
  id: number
  dividend: number
  divisor: number
  options: [number, number][]
  correctSplit: [number, number]
  partialA: number
  partialB: number
  answer: number
}

const challenges: Challenge[] = [
  {
    id: 1,
    dividend: 96,
    divisor: 24,
    options: [
      [72, 24],
      [60, 36],
      [48, 48],
    ],
    correctSplit: [72, 24],
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
  {
    id: 2,
    dividend: 120,
    divisor: 30,
    options: [
      [60, 60],
      [90, 30],
      [80, 40],
    ],
    correctSplit: [90, 30],
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
  {
    id: 3,
    dividend: 144,
    divisor: 36,
    options: [
      [108, 36],
      [100, 44],
      [72, 72],
    ],
    correctSplit: [108, 36],
    partialA: 3,
    partialB: 1,
    answer: 4,
  },
]

export default function Level2Page() {
  const navigate = useNavigate()

  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selectedSplit, setSelectedSplit] =
    useState<[number, number] | null>(null)

  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [wrongCurrent, setWrongCurrent] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const [feedback, setFeedback] = useState(
    'اختر التفكيك المناسب أولاً.'
  )

  const [splitCorrect, setSplitCorrect] = useState(false)
  const [challengeSolved, setChallengeSolved] = useState(false)
  const [completed, setCompleted] = useState(false)

  const current = challenges[challengeIndex]

  const score = useMemo(() => {
    return Math.max(
      0,
      100 - attempts * 5 - hintsUsed * 10
    )
  }, [attempts, hintsUsed])

  const selectSplit = (option: [number, number]) => {
    if (splitCorrect || challengeSolved) return

    setSelectedSplit(option)

    const correct =
      option[0] === current.correctSplit[0] &&
      option[1] === current.correctSplit[1]

    if (correct) {
      setSplitCorrect(true)
      setFeedback('أحسنت! التفكيك صحيح. الآن احسب الناتج.')
      return
    }

    const nextAttempts = attempts + 1
    const nextWrong = wrongCurrent + 1

    setAttempts(nextAttempts)
    setWrongCurrent(nextWrong)

    setFeedback('التفكيك غير مناسب، حاول مرة أخرى.')

    if (nextWrong >= 2) {
      setShowHint(true)
    }
  }

  const checkAnswer = () => {
    if (!splitCorrect || !answer || challengeSolved) return

    if (Number(answer) === current.answer) {
      setChallengeSolved(true)
      setFeedback('ممتاز! تم شحن جزء جديد من المحرك ⚡')
      return
    }

    const nextAttempts = attempts + 1
    const nextWrong = wrongCurrent + 1

    setAttempts(nextAttempts)
    setWrongCurrent(nextWrong)

    setFeedback('الناتج غير صحيح، حاول مرة أخرى.')

    if (nextWrong >= 2) {
      setShowHint(true)
    }
  }

  const useHint = () => {
    setHintsUsed((prev) => prev + 1)

    setFeedback(
      `التلميح: اختر ${current.correctSplit[0]} + ${current.correctSplit[1]}، ثم ${current.correctSplit[0]} ÷ ${current.divisor} = ${current.partialA} و ${current.correctSplit[1]} ÷ ${current.divisor} = ${current.partialB}.`
    )
  }

  const nextChallenge = () => {
    if (!challengeSolved) return

    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((prev) => prev + 1)
      setSelectedSplit(null)
      setAnswer('')
      setWrongCurrent(0)
      setShowHint(false)
      setSplitCorrect(false)
      setChallengeSolved(false)

      setFeedback('اختر التفكيك المناسب للمسألة الجديدة.')
      return
    }

    finishLevel()
  }

  const finishLevel = () => {
    const finalScore = Math.max(
      0,
      100 - attempts * 5 - hintsUsed * 10
    )

    localStorage.setItem(
      'level2Result',
      JSON.stringify({
        score: finalScore,
        attempts,
        hintsUsed,
        completed: true,
        questions: challenges.length,
      })
    )

    localStorage.setItem('level2Complete', 'true')

    setCompleted(true)
  }

  const restartLevel = () => {
    setChallengeIndex(0)
    setSelectedSplit(null)
    setAnswer('')
    setAttempts(0)
    setHintsUsed(0)
    setWrongCurrent(0)
    setShowHint(false)
    setSplitCorrect(false)
    setChallengeSolved(false)
    setCompleted(false)
    setFeedback('اختر التفكيك المناسب أولاً.')
  }

  if (completed) {
    return (
      <main className="level2-space-page" dir="rtl">
        <div className="level2-stars level2-stars-one" />
        <div className="level2-stars level2-stars-two" />

        <section className="level2-cockpit level2-final-card">
          <motion.div
            className="level2-final-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            🚀
          </motion.div>

          <h1>تم تشغيل المحرك بالكامل!</h1>

          <p>
            أحسنت! أكملت تحدي المحرك وأنهيت رحلة مجرة القسمة بنجاح.
          </p>

          <div className="level2-final-stars">
            ⭐ ⭐ ⭐
          </div>

          <div className="level2-result-grid">
            <div>
              <span>الدرجة</span>
              <strong>{score}</strong>
            </div>

            <div>
              <span>المحاولات</span>
              <strong>{attempts}</strong>
            </div>

            <div>
              <span>التلميحات</span>
              <strong>{hintsUsed}</strong>
            </div>
          </div>

          <div className="level2-engine-complete">
            <span>طاقة المحرك</span>

            <div className="level2-final-bar">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>

            <strong>100%</strong>
          </div>

          <div className="level2-final-actions">
            <button
              className="level2-secondary-btn"
              onClick={restartLevel}
            >
              ↻ إعادة المستوى
            </button>

            <motion.button
              className="level2-main-btn"
              onClick={() => navigate('/map')}
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
    <main className="level2-space-page" dir="rtl">
      <div className="level2-stars level2-stars-one" />
      <div className="level2-stars level2-stars-two" />

      <section className="level2-cockpit">

        <div className="level2-top-bar">
          <button
            className="level2-back-btn"
            onClick={() => navigate('/map')}
          >
            ←
          </button>

          <div className="level2-title">
            <strong>المستوى 2</strong>
            <span>تحدي المحرك</span>
          </div>

          <div className="level2-stats">
            <div>
              ⭐ <strong>{score}</strong>
            </div>

            <div>
              🎯 <strong>{attempts}</strong>
            </div>
          </div>
        </div>

        <div className="level2-window">
          <div className="level2-window-stars" />

          <motion.div
            className="level2-engine-icon"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ⚙️
          </motion.div>

          <div className="level2-heading">
            <span>
              تحدي {challengeIndex + 1} من {challenges.length}
            </span>

            <h1>أعد تشغيل المحرك</h1>

            <p>
              اختر التفكيك الصحيح ثم احسب الناتج
            </p>
          </div>

          <div className="level2-progress-dots">
            {challenges.map((challenge, index) => (
              <span
                key={challenge.id}
                className={
                  index < challengeIndex
                    ? 'done'
                    : index === challengeIndex
                    ? 'active'
                    : ''
                }
              >
                {index < challengeIndex ? '✓' : index + 1}
              </span>
            ))}
          </div>

          <div className="level2-game-layout">

            <div className="level2-question-card">
              <span>المسألة</span>

              <div className="level2-equation" dir="ltr">
                {current.dividend} ÷ {current.divisor}
              </div>

              <p>
                اختر أفضل طريقة لتفكيك العدد {current.dividend}
                {' '}إلى جزأين يقبل كل منهما القسمة على{' '}
                {current.divisor}.
              </p>

              <div className="level2-options">
                {current.options.map((option, index) => {
                  const selected =
                    selectedSplit?.[0] === option[0] &&
                    selectedSplit?.[1] === option[1]

                  const correct =
                    splitCorrect &&
                    option[0] === current.correctSplit[0] &&
                    option[1] === current.correctSplit[1]

                  return (
                    <motion.button
                      key={`${option[0]}-${option[1]}`}
                      className={[
                        'level2-option-btn',
                        selected ? 'selected' : '',
                        correct ? 'correct' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => selectSplit(option)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      disabled={splitCorrect}
                    >
                      {option[0]} + {option[1]}
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.button
                    className="level2-hint-btn"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={useHint}
                  >
                    💡 استخدم تلميح
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="level2-model-card">
              <div className="level2-model-title">
                لوحة المحرك
              </div>

              <div className="level2-area-model">
                <div className="level2-area-left">
                  {splitCorrect
                    ? current.correctSplit[0]
                    : '?'}
                </div>

                <div className="level2-area-right">
                  {splitCorrect
                    ? current.correctSplit[1]
                    : '?'}
                </div>
              </div>

              <AnimatePresence>
                {splitCorrect && (
                  <motion.div
                    className="level2-calculation-boxes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div>
                      <small>الجزء الأول</small>

                      <strong dir="ltr">
                        {current.correctSplit[0]}
                        {' ÷ '}
                        {current.divisor}
                        {' = '}
                        {current.partialA}
                      </strong>
                    </div>

                    <div>
                      <small>الجزء الثاني</small>

                      <strong dir="ltr">
                        {current.correctSplit[1]}
                        {' ÷ '}
                        {current.divisor}
                        {' = '}
                        {current.partialB}
                      </strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="level2-answer-area">
                <label>الناتج النهائي</label>

                <input
                  value={answer}
                  disabled={!splitCorrect || challengeSolved}
                  inputMode="numeric"
                  placeholder="؟"
                  onChange={(event) =>
                    setAnswer(
                      event.target.value.replace(/\D/g, '')
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      checkAnswer()
                    }
                  }}
                />

                {!challengeSolved ? (
                  <button
                    className="level2-check-btn"
                    disabled={!splitCorrect || !answer}
                    onClick={checkAnswer}
                  >
                    تحقق
                  </button>
                ) : (
                  <motion.button
                    className="level2-next-btn"
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    onClick={nextChallenge}
                  >
                    {challengeIndex === challenges.length - 1
                      ? 'تشغيل المحرك 🚀'
                      : 'التحدي التالي ←'}
                  </motion.button>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={feedback}
                  className={`level2-feedback ${
                    challengeSolved ? 'success' : ''
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {feedback}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="level2-energy-section">
            <div className="level2-energy-info">
              <span>طاقة المحرك</span>

              <strong>
                {Math.round(
                  ((challengeIndex +
                    (challengeSolved ? 1 : 0)) /
                    challenges.length) *
                    100
                )}
                %
              </strong>
            </div>

            <div className="level2-energy-bar">
              <motion.div
                animate={{
                  width: `${
                    ((challengeIndex +
                      (challengeSolved ? 1 : 0)) /
                      challenges.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="level2-bottom-panel">
          <div className="level2-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <span>
            آخر محطة في رحلة مجرة القسمة
          </span>

          <div className="level2-console-lights">
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