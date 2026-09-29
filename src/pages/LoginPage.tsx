import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const [studentCode, setStudentCode] = useState('')
  const [error, setError] = useState('')

  const handleNumberClick = (value: string) => {
    if (studentCode.length >= 12) return

    setStudentCode((prev) => prev + value)
    setError('')
  }

  const handleClear = () => {
    setStudentCode('')
    setError('')
  }

  const handleDelete = () => {
    setStudentCode((prev) => prev.slice(0, -1))
    setError('')
  }

  const handleLogin = () => {
    if (!studentCode.trim()) {
      setError('أدخل كود الطالب أولاً')
      return
    }

    // Temporary local storage.
    // Later we will connect this to Supabase.
    localStorage.setItem('studentCode', studentCode)

    navigate('/intro')
  }

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <main className="login-space-page" dir="rtl">
      <div className="login-stars login-stars-one" />
      <div className="login-stars login-stars-two" />

      <motion.div
        className="login-floating-number login-floating-one"
        animate={{
          y: [0, -12, 0],
          rotate: [-6, 6, -6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        4
      </motion.div>

      <motion.div
        className="login-floating-number login-floating-two"
        animate={{
          y: [0, 12, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ÷
      </motion.div>

      <section className="spaceship-cockpit">
        <div className="cockpit-top-bar">
          <div className="cockpit-lights">
            <span className="cockpit-light red" />
            <span className="cockpit-light blue" />
            <span className="cockpit-light green" />
          </div>

          <div className="cockpit-title-small">
            محطة الدخول الفضائية
          </div>

          <button
            className="cockpit-back-button"
            onClick={() => navigate('/')}
            aria-label="الرجوع"
          >
            ←
          </button>
        </div>

        <div className="cockpit-window">
          <div className="window-stars" />

          <motion.div
            className="mini-space-rocket"
            animate={{
              y: [0, -12, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🚀
          </motion.div>

          <motion.div
            className="login-heading"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <h1>أهلاً بك يا بطل!</h1>

            <p>
              أدخل كودك واضغط دخول لنبدأ رحلتنا
            </p>
          </motion.div>

          <div className="student-display-wrapper">
            <label htmlFor="student-code">
              كود الطالب
            </label>

            <div className="student-display">
              <input
                id="student-code"
                value={studentCode}
                onChange={(event) => {
                  const onlyNumbers =
                    event.target.value.replace(/\D/g, '')

                  setStudentCode(onlyNumbers)
                  setError('')
                }}
                placeholder="أدخل الكود"
                inputMode="numeric"
                autoComplete="off"
              />

              <span className="student-icon">
                👨‍🚀
              </span>
            </div>

            {error && (
              <motion.div
                className="login-error-message"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </div>

          <div className="login-control-area">
            <div className="space-keypad">
              {numbers.map((number) => (
                <motion.button
                  key={number}
                  className="keypad-button"
                  whileHover={{
                    scale: 1.07,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() =>
                    handleNumberClick(number)
                  }
                >
                  {number}
                </motion.button>
              ))}

              <motion.button
                className="keypad-button keypad-delete"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={handleDelete}
              >
                ⌫
              </motion.button>

              <motion.button
                className="keypad-button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() =>
                  handleNumberClick('0')
                }
              >
                0
              </motion.button>

              <motion.button
                className="keypad-button keypad-clear"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={handleClear}
              >
                مسح
              </motion.button>
            </div>

            <div className="login-side-console">
              <div className="console-screen">
                <div className="console-screen-title">
                  بيانات الرحلة
                </div>

                <div className="console-screen-row">
                  <span>الحالة</span>
                  <strong>
                    {studentCode
                      ? 'جاهز ✓'
                      : 'في الانتظار'}
                  </strong>
                </div>

                <div className="console-screen-row">
                  <span>المهمة</span>
                  <strong>
                    استكشاف القسمة
                  </strong>
                </div>

                <div className="console-screen-row">
                  <span>المحرك</span>
                  <strong>
                    يحتاج إصلاح
                  </strong>
                </div>
              </div>

              <div className="console-decoration">
                <span />
                <span />
                <span />
                <span />
              </div>

              <motion.button
                className="space-login-button"
                onClick={handleLogin}
                animate={
                  studentCode
                    ? {
                        boxShadow: [
                          '0 0 16px rgba(75,255,92,.3)',
                          '0 0 34px rgba(75,255,92,.75)',
                          '0 0 16px rgba(75,255,92,.3)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
              >
                دخول
                <span>🚀</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="cockpit-bottom-panel">
          <div className="fake-lever">
            <div className="lever-stick" />
          </div>

          <div className="cockpit-buttons">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="cockpit-radar">
            <div className="radar-line" />
            <div className="radar-dot" />
          </div>
        </div>
      </section>
    </main>
  )
}