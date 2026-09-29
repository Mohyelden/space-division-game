import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type StageResult = {
  attempts: number
  hintsUsed: number
  score: number
  completed: boolean
}

export default function ResultPage() {
  const navigate = useNavigate()

  const stage1 = useMemo<StageResult>(() => {
    const raw = localStorage.getItem('level0Stage1')

    return raw
      ? JSON.parse(raw)
      : {
          attempts: 0,
          hintsUsed: 0,
          score: 0,
          completed: false,
        }
  }, [])

  const stage2 = useMemo<StageResult>(() => {
    const raw = localStorage.getItem('level0Stage2')

    return raw
      ? JSON.parse(raw)
      : {
          attempts: 0,
          hintsUsed: 0,
          score: 0,
          completed: false,
        }
  }, [])

  const studentCode =
    localStorage.getItem('studentCode') || 'بطل'

  const totalAttempts =
    stage1.attempts + stage2.attempts

  const totalHints =
    stage1.hintsUsed + stage2.hintsUsed

  const totalScore =
    Math.round(
      (stage1.score + stage2.score) / 2
    )

  const stars =
    totalScore >= 90
      ? 3
      : totalScore >= 70
      ? 2
      : 1

  const title = totalScore >= 85 ? 'مهندس المحركات' : 'مستكشف الفضاء المبتدئ'
  const startTime = Number(localStorage.getItem('level0StartTime'))
  const endTime = Number(localStorage.getItem('level0EndTime'))
  const elapsedSeconds = startTime > 0 && endTime >= startTime
    ? Math.floor((endTime - startTime) / 1000)
    : 0
  const elapsedTime = `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`

  useEffect(() => {
    if (!stage1.completed || !stage2.completed) {
      navigate('/level/0/stage/1', { replace: true })
      return
    }
    localStorage.setItem('IsTutorialCompleted', 'true')
    localStorage.setItem('level0Complete', 'true')
  }, [navigate, stage1.completed, stage2.completed])

  return (
    <main
      className="result-space-page"
      dir="rtl"
    >
      <div className="result-stars-bg result-stars-one" />
      <div className="result-stars-bg result-stars-two" />

      <section className="result-cockpit">

        <div className="result-top-bar">
          <div className="result-lights">
            <span />
            <span />
            <span />
          </div>

          <div className="result-top-title">
            تقرير الرحلة
          </div>

          <div className="result-status">
            MISSION COMPLETE
          </div>
        </div>

        <div className="result-main-window">

          <div className="result-window-stars" />

          <motion.div
            className="result-trophy"
            initial={{
              scale: 0,
              rotate: -20,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 140,
            }}
          >
            🏆
          </motion.div>

          <motion.div
            className="result-heading"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <h1>
              أحسنت يا بطل!
            </h1>

            <p>
              نجحت في إكمال المستوى التمهيدي وإعادة تشغيل الجزء الأول من محرك القسمة
            </p>
          </motion.div>

          <div className="result-student">
            <span>
              كود الطالب
            </span>

            <strong>
              {studentCode}
            </strong>
          </div>

          <div className="result-stars-rating">
            {[1, 2, 3].map((star) => (
              <motion.span
                key={star}
                className={
                  star <= stars
                    ? 'active'
                    : ''
                }
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  delay: star * 0.2,
                  type: 'spring',
                }}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <div className="level0-earned-title">لقبك الجديد: <strong>{title}</strong></div>

          <div className="result-stats-grid">

            <div className="result-stat-card">
              <span>وقت الرحلة</span>
              <strong dir="ltr">{elapsedTime}</strong>
              <small>دقيقة : ثانية</small>
            </div>

            <div className="result-stat-card">
              <span>
                الدرجة
              </span>

              <strong>
                {totalScore}
              </strong>

              <small>
                من 100
              </small>
            </div>

            <div className="result-stat-card">
              <span>
                المحاولات
              </span>

              <strong>
                {totalAttempts}
              </strong>

              <small>
                محاولة
              </small>
            </div>

            <div className="result-stat-card">
              <span>
                التلميحات
              </span>

              <strong>
                {totalHints}
              </strong>

              <small>
                تلميح
              </small>
            </div>

          </div>

          <div className="result-level-complete">
            <div className="result-check">
              ✓
            </div>

            <div>
              <strong>
                تم فتح المستوى 1
              </strong>

              <span>
                ألغاز القسمة أصبحت متاحة الآن
              </span>
            </div>
          </div>

          <motion.div
            className="result-engine"
            animate={{
              boxShadow: [
                '0 0 12px rgba(70,255,110,.15)',
                '0 0 30px rgba(70,255,110,.45)',
                '0 0 12px rgba(70,255,110,.15)',
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
          >
            <span>
              طاقة محرك القسمة
            </span>

            <div className="result-engine-bar">
              <motion.div
                initial={{
                  width: '50%',
                }}
                animate={{
                  width: '100%',
                }}
                transition={{
                  duration: 1.5,
                }}
              />
            </div>

            <strong>
              100%
            </strong>
          </motion.div>

        </div>

        <div className="result-bottom-panel">

          <button
            className="result-retry-btn"
            onClick={() => {
              localStorage.removeItem(
                'level0Stage1'
              )

              localStorage.removeItem(
                'level0Stage2'
              )

              localStorage.removeItem(
                'level0Complete'
              )

              localStorage.removeItem('IsTutorialCompleted')
              localStorage.removeItem('level0StartTime')
              localStorage.removeItem('level0EndTime')

              navigate('/tutorial')
            }}
          >
            ↻ إعادة المستوى
          </button>

          <div className="result-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <motion.button
            className="result-map-btn"
            onClick={() => navigate('/map')}
            animate={{
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
            العودة إلى خريطة الكواكب
            <span>
              🚀
            </span>
          </motion.button>

        </div>

      </section>
    </main>
  )
}
