import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CanvasWorkspace from './pages/CanvasWorkspace'
import useAuthStore from './store/authStore'

function App() {
  const { token } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/" />
        } />
        <Route path="/canvas/:id" element={
          token ? <CanvasWorkspace /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App