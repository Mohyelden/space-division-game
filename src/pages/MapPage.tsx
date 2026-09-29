import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type StageResult = {
  score?: number
  attempts?: number
  hintsUsed?: number
  completed?: boolean
}

function readResult(key: string): StageResult {
  try {
    const raw = localStorage.getItem(key)

    if (!raw) return {}

    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export default function MapPage() {
  const navigate = useNavigate()

  const level0Complete =
    localStorage.getItem('IsTutorialCompleted') === 'true'

  const level1Complete =
    localStorage.getItem('level1Complete') === 'true'

  const level2Complete =
    localStorage.getItem('level2Complete') === 'true'

  const stage1Result =
    readResult('level0Stage1')

  const stage2Result =
    readResult('level0Stage2')

  const level1Result =
    readResult('level1Result')

  const level2Result =
    readResult('level2Result')

  const level0Score =
    stage1Result.score !== undefined &&
    stage2Result.score !== undefined
      ? Math.round(
          (stage1Result.score +
            stage2Result.score) /
            2
        )
      : 0

  const scores = [
    level0Complete ? level0Score : null,
    level1Complete
      ? level1Result.score ?? 0
      : null,
    level2Complete
      ? level2Result.score ?? 0
      : null,
  ].filter(
    (score): score is number =>
      score !== null
  )

  const totalScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / scores.length
        )
      : 0

  const progress =
    level2Complete
      ? 100
      : level1Complete
      ? 78
      : level0Complete
      ? 52
      : 15

  return (
    <main
      className="map-space-page"
      dir="rtl"
    >
      <div className="map-stars map-stars-one" />
      <div className="map-stars map-stars-two" />

      <div className="map-nebula map-nebula-one" />
      <div className="map-nebula map-nebula-two" />

      <section className="planet-map-cockpit">

        <div className="map-top-bar">

          <div className="map-score">
            <span>⭐</span>
            <strong>
              {totalScore}
            </strong>
          </div>

          <div className="map-title-small">
            خريطة مجرة القسمة
          </div>

          <button
            className="map-settings-btn"
            aria-label="الإعدادات"
          >
            ⚙️
          </button>

        </div>

        <div className="planet-map-window">

          <div className="planet-map-stars" />

          <motion.div
            className="map-floating-rocket"
            animate={{
              y: [0, -12, 0],
              x: [0, 8, 0],
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🚀
          </motion.div>

          <motion.div
            className="map-main-title"
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <h1>
              اختر الكوكب وابدأ رحلتك
            </h1>

            <p>
              ساعد سفينة الفضاء على استعادة طاقة محرك القسمة
            </p>
          </motion.div>

          <svg className="space-route" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 162 267 C 285 267, 355 332, 471 332 S 715 282, 849 282" />
          </svg>

          {/* LEVEL 0 */}

          <motion.button
            className="planet-card planet-level-zero"
            onClick={() =>
              navigate('/tutorial')
            }
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.96,
            }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="planet-surface">

              <div className="planet-shine" />

              <div className="planet-grid-icon">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

            </div>

            <div className="planet-label">

              <small>
                المستوى التمهيدي
              </small>

              <strong>
                نموذج مساحة المستطيل
              </strong>

              <span className="planet-status-open">
                {level0Complete
                  ? `مكتمل • ${level0Score}%`
                  : 'مفتوح'}
              </span>

            </div>
          </motion.button>

          {/* LEVEL 1 */}

          <motion.button
            className={`planet-card planet-level-one ${
              level0Complete
                ? 'unlocked'
                : 'locked'
            }`}
            onClick={() => {
              if (level0Complete) {
                navigate('/level/1')
              }
            }}
            disabled={!level0Complete}
            animate={{
              y: [0, 7, 0],
            }}
            whileHover={
              level0Complete
                ? {
                    scale: 1.05,
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="planet-surface">

              <div className="planet-shine" />

              {!level0Complete ? (
                <div className="planet-lock">
                  🔒
                </div>
              ) : level1Complete ? (
                <div className="planet-unlocked-icon">
                  ✓
                </div>
              ) : (
                <div className="planet-unlocked-icon">
                  1
                </div>
              )}

            </div>

            <div className="planet-label">

              <small>
                المستوى 1
              </small>

              <strong>
                ألغاز القسمة
              </strong>

              <span>
                {!level0Complete
                  ? 'أكمل المستوى التمهيدي'
                  : level1Complete
                  ? `مكتمل • ${
                      level1Result.score ?? 0
                    }%`
                  : 'متاح الآن'}
              </span>

            </div>

          </motion.button>

          {/* LEVEL 2 */}

          <motion.button
            className={`planet-card planet-level-two ${
              level1Complete
                ? 'unlocked'
                : 'locked'
            }`}
            onClick={() => {
              if (level1Complete) {
                navigate('/level/2')
              }
            }}
            disabled={!level1Complete}
            animate={{
              y: [0, -6, 0],
            }}
            whileHover={
              level1Complete
                ? {
                    scale: 1.05,
                  }
                : {}
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="planet-surface">

              <div className="planet-shine" />

              {!level1Complete ? (
                <div className="planet-lock">
                  🔒
                </div>
              ) : level2Complete ? (
                <div className="planet-unlocked-icon">
                  ✓
                </div>
              ) : (
                <div className="planet-unlocked-icon">
                  2
                </div>
              )}

            </div>

            <div className="planet-label">

              <small>
                المستوى 2
              </small>

              <strong>
                تحدي المحرك
              </strong>

              <span>
                {!level1Complete
                  ? 'ما زال مغلقًا'
                  : level2Complete
                  ? `مكتمل • ${
                      level2Result.score ?? 0
                    }%`
                  : 'متاح الآن'}
              </span>

            </div>

          </motion.button>

          <motion.div
            className="map-instruction-box"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            <span>
              👨‍🚀
            </span>

            <p>
              {!level0Complete
                ? 'ابدأ بالمستوى التمهيدي لتتعلم نموذج مساحة المستطيل.'
                : !level1Complete
                ? 'أحسنت! المستوى 1 أصبح مفتوحًا. اضغط عليه لبدء ألغاز القسمة.'
                : !level2Complete
                ? 'رائع! تحدي المحرك أصبح متاحًا الآن.'
                : 'ممتاز! أكملت رحلة مجرة القسمة بنجاح.'}
            </p>

          </motion.div>

        </div>

        <div className="map-bottom-console">

          <div className="map-console-lights">
            <span />
            <span />
            <span />
          </div>

          <div className="map-progress-info">

            <span>
              تقدم الرحلة
            </span>

            <div className="map-progress-bar">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>

          <div className="map-console-lights second">
            <span />
            <span />
            <span />
          </div>

        </div>

      </section>
    </main>
  )
}
