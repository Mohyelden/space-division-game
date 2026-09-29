import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage'
import IntroPage from './pages/IntroPage'
import MapPage from './pages/MapPage'
import TutorialPage from './pages/TutorialPage'
import Stage1Page from './pages/Stage1Page'
import Stage2Page from './pages/Stage2Page'
import ResultPage from './pages/ResultPage'
import Level1Page from './pages/Level1Page'
import Level2Page from './pages/Level2Page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/intro" element={<IntroPage />} />
      <Route path="/map" element={<MapPage />} />

      <Route
        path="/tutorial"
        element={<TutorialPage />}
      />

      <Route
        path="/level/0/stage/1"
        element={<Stage1Page />}
      />

      <Route
        path="/level/0/stage/2"
        element={<Stage2Page />}
      />

      <Route
        path="/result"
        element={<ResultPage />}
      />

      <Route
        path="/level/1"
        element={<Level1Page />}
      />

      <Route
        path="/level/2"
        element={<Level2Page />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}