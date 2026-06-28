import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, googleLogin, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
  }

  const handleGoogleLogin = async () => {
    const success = await googleLogin('google-token-placeholder')
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Google login failed')
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#FFFDF4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes particleFloat { 0%{transform:translateY(0) scale(1);opacity:0.8} 100%{transform:translateY(-100px) scale(0.5);opacity:0} }
        @keyframes bgPulse { 0%,100%{transform:scale(1);opacity:0.06} 50%{transform:scale(1.05);opacity:0.1} }
        .btn-primary { padding:14px 32px; background:#F5C842; border:none; border-radius:14px; font-size:15px; font-weight:700; color:#2C2A1E; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 0 #D4A800; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 0 #D4A800; }
        .btn-primary:active { transform:translateY(2px); box-shadow:0 2px 0 #D4A800; }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .btn-secondary { padding:14px 24px; background:transparent; border:1.5px solid #E8E0C8; border-radius:14px; font-size:15px; font-weight:600; color:#2C2A1E; cursor:pointer; transition:all 0.2s; }
        .btn-secondary:hover { background:#F5F0DC; border-color:#D8D0B8; }
        .input-field { width:100%; padding:14px 16px; border:1.5px solid #E8E0C8; border-radius:12px; font-size:14px; margin-bottom:16px; box-sizing:border-box; font-family:inherit; outline:none; transition:border-color 0.2s; }
        .input-field:focus { border-color:#F5C842; }
        .spinner { width:16px; height:16px; border:2px solid rgba(44,42,30,0.25); border-top-color:#2C2A1E; border-radius:50%; animation:spin 0.6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* BG blobs */}
      <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%', background:'#F5C842', top:'-100px', right:'-100px', opacity:0.06, animation:'bgPulse 6s ease-in-out infinite' }}/>
      <div style={{ position:'absolute', width:'250px', height:'250px', borderRadius:'50%', background:'#F5C842', bottom:'-80px', left:'-60px', opacity:0.06, animation:'bgPulse 6s ease-in-out infinite 2s' }}/>

      {/* Particles */}
      {[
        { top:'15%', left:'10%', size:7, dur:'3.2s', delay:'0s' },
        { top:'45%', left:'90%', size:9, dur:'4s', delay:'0.5s' },
        { top:'75%', left:'15%', size:8, dur:'3.8s', delay:'1s' },
      ].map((p, i) => (
        <div key={i} style={{ position:'absolute', top:p.top, left:p.left, width:p.size, height:p.size, borderRadius:'50%', background:'#F5C842', opacity:0.3, animation:`particleFloat linear ${p.dur} ${p.delay} infinite` }}/>
      ))}

      <div style={{ width:'100%', maxWidth:'400px', animation:'fadeInUp 0.5s ease both', position:'relative', zIndex:2 }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            position: 'absolute', 
            top: '-60px', 
            left: '0', 
            background: 'transparent', 
            border: '1.5px solid #E8E0C8', 
            borderRadius: '10px', 
            padding: '10px 16px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#7A7560', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#F5F0DC'
            e.target.style.borderColor = '#D8D0B8'
            e.target.style.color = '#2C2A1E'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.borderColor = '#E8E0C8'
            e.target.style.color = '#7A7560'
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ width:'56px', height:'56px', background:'#F5C842', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', color:'#2C2A1E', fontSize:'24px', margin:'0 auto 20px' }}>G</div>
          <h1 style={{ fontSize:'28px', fontWeight:'800', color:'#2C2A1E', margin:'0 0 8px' }}>Welcome back</h1>
          <p style={{ fontSize:'14px', color:'#7A7560', margin:0 }}>Continue your smarter study journey</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            className="input-field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{ background:'#FCEBEB', border:'1.5px solid #E53E3E', borderRadius:'12px', padding:'14px 16px', fontSize:'13px', color:'#C53030', marginBottom:'16px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
              <span style={{ fontSize:'16px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight:'600', marginBottom:'4px' }}>Login failed</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          <button className="btn-secondary" style={{ width:'100%' }} type="submit" disabled={loading}>
            {loading ? <><div className="spinner"/> Logging in...</> : 'Log in'}
          </button>
        </form>

        <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'24px 0' }}>
          <div style={{ flex:1, height:'1px', background:'#E8E0C8' }}/>
          <span style={{ fontSize:'12px', color:'#B0A890' }}>or</span>
          <div style={{ flex:1, height:'1px', background:'#E8E0C8' }}/>
        </div>

        <button className="btn-secondary" style={{ width:'100%' }} onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <div style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#7A7560' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} style={{ background:'none', border:'none', color:'#F5C842', fontWeight:'600', cursor:'pointer', padding:0, fontSize:'14px' }}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
