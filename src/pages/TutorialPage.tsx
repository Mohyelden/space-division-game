import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const tutorialSteps = [
  {
    id: 1,
    number: '1',
    title: 'المرحلة الأولى',
    subtitle: 'السحب والإفلات',
    description:
      'اسحب بطاقة المقسوم وبطاقة المقسوم عليه وضع كل بطاقة في المكان الصحيح حول نموذج مساحة المستطيل.',
    icon: '🖐️',
  },
  {
    id: 2,
    number: '2',
    title: 'المرحلة الثانية',
    subtitle: 'التفكيك والحساب',
    description:
      'بعد ترتيب الأعداد، سنفكك المقسوم ونستخدم نموذج مساحة المستطيل حتى نصل إلى ناتج القسمة.',
    icon: '🧠',
  },
  {
    id: 3,
    number: '🚀',
    title: 'مستعد للتحدي؟',
    subtitle: 'ساعدنا في تشغيل المحرك',
    description:
      'كل إجابة صحيحة تعيد جزءًا من طاقة محرك السفينة. حاول أن تستخدم أقل عدد ممكن من التلميحات!',
    icon: '⚡',
  },
]

export default function TutorialPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)

  const currentStep = tutorialSteps[step]

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep((prev) => prev + 1)
      return
    }

    navigate('/level/0/stage/1')
  }

  const previousStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  return (
    <main className="tutorial-space-page" dir="rtl">

      <div className="tutorial-stars tutorial-stars-one" />
      <div className="tutorial-stars tutorial-stars-two" />

      <section className="tutorial-cockpit">

        {/* TOP BAR */}
        <div className="tutorial-top-bar">

          <button
            className="tutorial-back-btn"
            onClick={() => navigate('/map')}
          >
            ←
          </button>

          <div className="tutorial-top-title">
            التدريب قبل الرحلة
          </div>

          <div className="tutorial-top-lights">
            <span />
            <span />
            <span />
          </div>

        </div>

        {/* MAIN WINDOW */}
        <div className="tutorial-window">

          <div className="tutorial-window-stars" />

          {/* ASTRONAUT */}
          <motion.div
            className="tutorial-astronaut"
            animate={{
              y: [0, -8, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            👨‍🚀
          </motion.div>

          {/* TITLE */}
          <div className="tutorial-heading">
            <span>المستوى التمهيدي</span>

            <h1>
              تعال نتعلم المهمة أولاً
            </h1>

            <p>
              هذا المستوى يتكون من مرحلتين
            </p>
          </div>

          {/* CONTENT */}
          <div className="tutorial-content">

            {/* LEFT VISUAL */}
            <div className="tutorial-demo-area">

              <AnimatePresence mode="wait">

                {step === 0 && (
                  <motion.div
                    key="drag-demo"
                    className="tutorial-drag-demo"
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <div className="demo-division-title">
                      36 ÷ 9
                    </div>

                    <div className="demo-drop-layout">

                      <div className="demo-divisor-zone">
                        <span>
                          المقسوم عليه
                        </span>

                        <motion.div
                          className="demo-number-card blue"
                          animate={{
                            x: [0, 35, 35],
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        >
                          9
                        </motion.div>
                      </div>

                      <div className="demo-rectangle">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>

                      <div className="demo-dividend-zone">
                        <span>
                          المقسوم
                        </span>

                        <motion.div
                          className="demo-number-card orange"
                          animate={{
                            x: [0, -35, -35],
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        >
                          36
                        </motion.div>
                      </div>

                    </div>

                    <div className="demo-hand">
                      👆
                    </div>

                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="calculation-demo"
                    className="tutorial-calc-demo"
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <div className="calc-title">
                      نموذج مساحة المستطيل
                    </div>

                    <div className="area-example">

                      <div className="area-left">
                        <span>
                          27
                        </span>
                      </div>

                      <div className="area-right">
                        <span>
                          9
                        </span>
                      </div>

                    </div>

                    <div className="calc-equations">

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 0.4,
                        }}
                      >
                        27 ÷ 9 = 3
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 1,
                        }}
                      >
                        9 ÷ 9 = 1
                      </motion.div>

                      <motion.strong
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay: 1.6,
                        }}
                      >
                        الناتج = 4 ✓
                      </motion.strong>

                    </div>

                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="engine-demo"
                    className="tutorial-engine-demo"
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >

                    <motion.div
                      className="tutorial-engine-icon"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      ⚙️
                    </motion.div>

                    <div className="tutorial-energy-title">
                      طاقة المحرك
                    </div>

                    <div className="tutorial-energy-bar">
                      <motion.div
                        initial={{
                          width: '10%',
                        }}
                        animate={{
                          width: '65%',
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />
                    </div>

                    <strong>
                      أجب بشكل صحيح لاستعادة الطاقة!
                    </strong>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* RIGHT DESCRIPTION */}
            <AnimatePresence mode="wait">

              <motion.div
                key={currentStep.id}
                className="tutorial-step-card"
                initial={{
                  opacity: 0,
                  x: 25,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -25,
                }}
              >

                <div className="tutorial-step-number">
                  {currentStep.number}
                </div>

                <div className="tutorial-step-icon">
                  {currentStep.icon}
                </div>

                <h2>
                  {currentStep.title}
                </h2>

                <h3>
                  {currentStep.subtitle}
                </h3>

                <p>
                  {currentStep.description}
                </p>

                {step === 0 && (
                  <div className="tutorial-tip">
                    💡 إذا أخطأت أكثر من مرة سيظهر لك تلميح يساعدك.
                  </div>
                )}

                {step === 1 && (
                  <div className="tutorial-tip">
                    💡 ركز في تفكيك العدد قبل حساب الناتج النهائي.
                  </div>
                )}

                {step === 2 && (
                  <div className="tutorial-tip success">
                    ⭐ كلما قل عدد محاولاتك زادت نقاطك.
                  </div>
                )}

              </motion.div>

            </AnimatePresence>

          </div>

          {/* PROGRESS */}
          <div className="tutorial-step-progress">

            {tutorialSteps.map((item, index) => (
              <div
                key={item.id}
                className={
                  index <= step
                    ? 'tutorial-progress-item active'
                    : 'tutorial-progress-item'
                }
              >
                <span>
                  {index + 1}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* BOTTOM ACTIONS */}
        <div className="tutorial-bottom-panel">

          <button
            className="tutorial-secondary-btn"
            onClick={previousStep}
            disabled={step === 0}
          >
            السابق
          </button>

          <div className="tutorial-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <motion.button
            className={
              step === tutorialSteps.length - 1
                ? 'tutorial-next-btn start'
                : 'tutorial-next-btn'
            }
            onClick={nextStep}
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            animate={
              step === tutorialSteps.length - 1
                ? {
                    boxShadow: [
                      '0 0 15px rgba(73,255,105,.3)',
                      '0 0 35px rgba(73,255,105,.75)',
                      '0 0 15px rgba(73,255,105,.3)',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            {step === tutorialSteps.length - 1
              ? 'ابدأ التحدي 🚀'
              : 'التالي ←'}
          </motion.button>

        </div>

      </section>

    </main>
  )
}