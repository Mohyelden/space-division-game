import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tutorialVideo from '../assets/المستوى_التمهيدي_شرح.mp4'

export default function TutorialPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [playError, setPlayError] = useState(false)

  const startVideo = async () => {
    try {
      await videoRef.current?.play()
      setStarted(true)
      setPlayError(false)
    } catch {
      setPlayError(true)
    }
  }

  const goToStage = () => navigate('/level/0/stage/1')

  return (
    <main className="tutorial-space-page level0-video-page" dir="rtl">
      <div className="tutorial-stars tutorial-stars-one" aria-hidden="true" />
      <div className="tutorial-stars tutorial-stars-two" aria-hidden="true" />

      <section className="tutorial-cockpit level0-video-cockpit">
        <div className="tutorial-top-bar">
          <button className="tutorial-back-btn" onClick={() => navigate('/map')} aria-label="العودة إلى الخريطة">←</button>
          <div className="tutorial-top-title">دليل المستوى التمهيدي</div>
          <div className="tutorial-top-lights" aria-hidden="true"><span /><span /><span /></div>
        </div>

        <div className="level0-video-heading">
          <span>🎬 استعد للرحلة</span>
          <h1>شاهد المهمة ثم ابدأ المرحلة الأولى</h1>
          <p>دليل قصير بصوت عربي يشرح السحب والتلميحات والحساب وشاشة الإنجاز.</p>
        </div>

        <div className="level0-video-frame">
          <video
            ref={videoRef}
            src={tutorialVideo}
            controls={started}
            playsInline
            preload="metadata"
            onEnded={goToStage}
            onError={() => setPlayError(true)}
            aria-label="فيديو شرح المستوى التمهيدي"
          />
          {!started && !playError && (
            <div className="level0-video-start">
              <div className="level0-video-play-icon" aria-hidden="true">▶</div>
              <strong>مستعد تعرف مهمة القسمة؟</strong>
              <button onClick={() => void startVideo()}>شغّل الشرح بالصوت</button>
              <small>المدة: دقيقة واحدة تقريبًا</small>
            </div>
          )}
          {playError && (
            <div className="level0-video-error" role="alert">
              تعذر تشغيل الفيديو. يمكنك إعادة المحاولة أو بدء المرحلة الأولى مباشرة.
              <button onClick={() => void startVideo()}>إعادة المحاولة</button>
            </div>
          )}
        </div>

        <div className="level0-video-actions">
          <span>ينتقل اللعب تلقائيًا إلى المرحلة الأولى بعد انتهاء الفيديو.</span>
          <button onClick={goToStage}>تخطي الفيديو وابدأ المرحلة الأولى ←</button>
        </div>
      </section>
    </main>
  )
}
