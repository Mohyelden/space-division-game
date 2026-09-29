import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import introVideo from '../assets/سفينة_القسمة_مقدمة.mp4'

export default function IntroPage() {
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [videoEnded, setVideoEnded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const goToMap = () => {
    navigate('/map')
  }

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }

    setVideoEnded(true)
  }

  const toggleVideo = () => {
    const video = videoRef.current

    if (!video) return

    if (video.paused) {
      void video.play().catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <main className="real-intro-page" dir="rtl">
      <div className="real-intro-stars real-intro-stars-one" />
      <div className="real-intro-stars real-intro-stars-two" />

      <section className="real-intro-cockpit">

        {/* TOP BAR */}
        <div className="real-intro-top-bar">

          <div className="real-intro-lights">
            <span />
            <span />
            <span />
          </div>

          <div className="real-intro-title">
            مقدمة رحلة سفينة الفضاء
          </div>

          <button
            className="real-intro-skip-btn"
            onClick={skipIntro}
          >
            تخطي ⏭
          </button>

        </div>

        {/* VIDEO */}
        <div className="real-intro-video-wrapper">

          <video
            ref={videoRef}
            className="real-intro-video"
            src={introVideo}
            autoPlay
            muted
            playsInline
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            onEnded={() => {
              setIsPlaying(false)
              setVideoEnded(true)
            }}
          />

          {/* cinematic border */}
          <div className="real-intro-video-overlay" />

          {videoError && (
            <p className="real-intro-video-error" role="alert">
              تعذر تشغيل الفيديو. تحقق من صيغة الملف أو أعد تحميل الصفحة.
            </p>
          )}

          {/* PLAY / PAUSE */}
          {!videoEnded && (
            <motion.button
              className="real-intro-play-btn"
              onClick={toggleVideo}
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.94,
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </motion.button>
          )}

          {/* WHEN VIDEO FINISHES */}
          {videoEnded && (
            <motion.div
              className="real-intro-finish-overlay"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <motion.div
                className="real-intro-finish-card"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                <div className="real-intro-finish-icon">
                  🚀
                </div>

                <h2>
                  هل أنت جاهز للرحلة؟
                </h2>

                <p>
                  اختر الكوكب الأول وابدأ استكشاف أسرار القسمة.
                </p>

                <motion.button
                  className="real-intro-map-btn"
                  onClick={goToMap}
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
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                >
                  إلى خريطة الكواكب
                  <span>🚀</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

        </div>

        {/* BOTTOM */}
        <div className="real-intro-bottom">

          <div className="real-intro-console-lights">
            <span />
            <span />
            <span />
            <span />
          </div>

          <span className="real-intro-bottom-text">
            شاهد الفيديو لتعرف مهمة الرحلة
          </span>

          <div className="real-intro-console-lights">
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
