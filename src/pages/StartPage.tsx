import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function StartPage() {
  const navigate = useNavigate()

  return (
    <main className="space-start-page" dir="rtl">
      <div className="space-nebula space-nebula-one" />
      <div className="space-nebula space-nebula-two" />

      <div className="space-stars stars-layer-one" />
      <div className="space-stars stars-layer-two" />
      <div className="space-stars stars-layer-three" />

      <motion.div
        className="floating-number floating-number-1"
        animate={{
          y: [0, -14, 0],
          rotate: [-8, 8, -8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        2
      </motion.div>

      <motion.div
        className="floating-number floating-number-2"
        animate={{
          y: [0, 12, 0],
          rotate: [8, -8, 8],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        8
      </motion.div>

      <motion.div
        className="floating-number floating-number-3"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.14, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ÷
      </motion.div>

      <section className="start-game-card">
        <div className="top-control-strip">
          <span />
          <span />
          <span />
        </div>

        <motion.div
          className="game-rocket-wrapper"
          animate={{
            y: [0, -15, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="rocket-glow" />

          <div className="cartoon-rocket">
            <div className="rocket-body">
              <div className="rocket-window">
                <div className="rocket-face">
                  <span className="eye eye-left" />
                  <span className="eye eye-right" />
                  <span className="smile" />
                </div>
              </div>

              <div className="rocket-fin rocket-fin-left" />
              <div className="rocket-fin rocket-fin-right" />
              <div className="rocket-flame">
                <span />
              </div>
            </div>

            <motion.span
              className="rocket-star rocket-star-one"
              animate={{ scale: [1, 1.35, 1], rotate: [0, 15, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              ★
            </motion.span>

            <motion.span
              className="rocket-star rocket-star-two"
              animate={{ scale: [1, 1.25, 1], rotate: [0, -15, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              ★
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="start-title-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="game-main-title">لعبة سفينة الفضاء</h1>

          <p className="game-secondary-title">
            رحلة استكشاف القسمة
          </p>

          <p className="game-description">
            استعد لمغامرة تعليمية شيقة لاكتشاف أسرار القسمة
            <br />
            
          </p>
        </motion.div>

        <div className="animated-galaxy">
          <div className="galaxy-core" />
          <div className="galaxy-ring galaxy-ring-one" />
          <div className="galaxy-ring galaxy-ring-two" />
        </div>

        <motion.button
          className="start-journey-button"
          onClick={() => navigate('/login')}
          animate={{
            scale: [1, 1.045, 1],
            boxShadow: [
              '0 0 20px rgba(67,255,87,.45)',
              '0 0 42px rgba(67,255,87,.85)',
              '0 0 20px rgba(67,255,87,.45)',
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.96,
          }}
        >
          <span className="button-rocket-icon">🚀</span>
          ابدأ الرحلة
        </motion.button>

        <p className="start-helper-text">
          اضغط على الزر لبدء المغامرة
        </p>
      </section>
    </main>
  )
}