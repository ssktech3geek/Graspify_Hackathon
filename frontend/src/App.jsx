import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginForm from './pages/LoginForm'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import CanvasWorkspace from './pages/CanvasWorkspace'
import useAuthStore from './store/authStore'
import Tracker from './pages/Tracker'
import StudyTimer from './components/StudyTimer'
import UserProfile from './components/UserProfile'

function App() {
  const { token } = useAuthStore()

  return (
    <BrowserRouter>
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1001 }}>
        <UserProfile />
      </div>
      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <Landing />
        } />
        <Route path="/login" element={
          token ? <Navigate to="/dashboard" /> : <LoginForm />
        } />
        <Route path="/signup" element={
          token ? <Navigate to="/dashboard" /> : <SignUp />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/" />
        } />
        <Route path="/canvas/:id" element={
          token ? <CanvasWorkspace /> : <Navigate to="/" />
        } />
        <Route path="/tracker" element={
          token ? <Tracker /> : <Navigate to="/" />
        } />
      </Routes>
      <StudyTimer />
    </BrowserRouter>
  )
}

export default App