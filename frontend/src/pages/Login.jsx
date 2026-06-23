import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Login() {
  const { guestLogin, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token])

  const handleGuest = async () => {
    await guestLogin()
    navigate('/dashboard')
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#FFFDF4', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatDelay { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes particleFloat { 0%{transform:translateY(0) scale(1);opacity:0.8} 100%{transform:translateY(-100px) scale(0.5);opacity:0} }
        @keyframes sweat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes bookShake { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
        @keyframes paperFly1 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-60px,-80px) rotate(-30deg);opacity:0} }
        @keyframes paperFly2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(50px,-60px) rotate(25deg);opacity:0} }
        @keyframes paperFly3 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(-30px,-90px) rotate(-45deg);opacity:0} }
        @keyframes headBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes armWave { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(15deg)} }
        @keyframes eyeMove { 0%,100%{transform:translateX(0)} 25%{transform:translateX(3px)} 75%{transform:translateX(-3px)} }
        @keyframes exclaim { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.3) translateY(-4px)} }
        @keyframes bgPulse { 0%,100%{transform:scale(1);opacity:0.06} 50%{transform:scale(1.05);opacity:0.1} }
        @keyframes slideIn { from{width:0} to{width:100%} }
        .btn-primary { padding:14px 32px; background:#F5C842; border:none; border-radius:14px; font-size:15px; font-weight:700; color:#2C2A1E; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 0 #D4A800; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 0 #D4A800; }
        .btn-primary:active { transform:translateY(2px); box-shadow:0 2px 0 #D4A800; }
        .btn-secondary { padding:14px 24px; background:transparent; border:2px solid #E8E0C8; border-radius:14px; font-size:15px; font-weight:600; color:#2C2A1E; cursor:pointer; transition:all 0.2s; }
        .btn-secondary:hover { background:#F5F0DC; }
        .feature-card { background:#fff; border:1.5px solid #E8E0C8; border-radius:16px; padding:20px 16px; text-align:center; transition:all 0.2s; }
        .feature-card:hover { transform:translateY(-4px); border-color:#F5C842; }
      `}</style>

      {/* Hero Section */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>

        {/* BG blobs */}
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', background:'#F5C842', top:'-150px', right:'-150px', opacity:0.06, animation:'bgPulse 6s ease-in-out infinite' }}/>
        <div style={{ position:'absolute', width:'300px', height:'300px', borderRadius:'50%', background:'#F5C842', bottom:'-100px', left:'-80px', opacity:0.06, animation:'bgPulse 6s ease-in-out infinite 2s' }}/>

        {/* Particles */}
        {[
          { top:'15%', left:'8%', size:7, dur:'3.2s', delay:'0s', color:'#F5C842' },
          { top:'30%', left:'88%', size:9, dur:'4s', delay:'0.5s', color:'#2C2A1E' },
          { top:'65%', left:'12%', size:8, dur:'3.8s', delay:'1s', color:'#F5C842' },
          { top:'55%', left:'82%', size:5, dur:'5s', delay:'1.5s', color:'#F5C842' },
          { top:'80%', left:'50%', size:9, dur:'4.2s', delay:'0.8s', color:'#F5C842' },
        ].map((p, i) => (
          <div key={i} style={{ position:'absolute', top:p.top, left:p.left, width:p.size, height:p.size, borderRadius:'50%', background:p.color, opacity:0.3, animation:`particleFloat linear ${p.dur} ${p.delay} infinite` }}/>
        ))}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'60px', width:'100%', maxWidth:'900px', zIndex:2, flexWrap:'wrap' }}>

          {/* Left text */}
          <div style={{ maxWidth:'420px', animation:'fadeInUp 0.7s ease both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'#F5F0DC', border:'1.5px solid #E8E0C8', borderRadius:'100px', padding:'6px 16px', fontSize:'13px', color:'#7A7560', marginBottom:'24px' }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#F5C842', animation:'pulse 1.5s ease-in-out infinite' }}/>
              AI-powered study canvas
            </div>

            <div style={{ fontSize:'48px', fontWeight:'800', color:'#2C2A1E', lineHeight:1.1, marginBottom:'16px', letterSpacing:'-1.5px' }}>
              Stop panicking.<br/>Start <span style={{ color:'#F5C842' }}>Graspifying.</span>
            </div>

            <p style={{ fontSize:'15px', color:'#7A7560', lineHeight:1.7, marginBottom:'32px' }}>
              One workspace for YouTube, Notes, PDFs and AI. Highlight anything, ask AI instantly. Your smartest study session starts here.
            </p>

            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={handleGuest}>
                Get started free ✨
              </button>
              <button className="btn-secondary" onClick={handleGuest}>
                Continue as guest →
              </button>
            </div>
          </div>

          {/* Right — animated student */}
          <div style={{ position:'relative', width:'320px', height:'380px', animation:'fadeInUp 0.9s ease 0.2s both', flexShrink:0 }}>

            {/* Exclamations */}
            <div style={{ position:'absolute', top:'10px', right:'30px', fontSize:'28px', fontWeight:'900', color:'#E53E3E', animation:'exclaim 0.8s ease-in-out infinite', zIndex:10 }}>!</div>
            <div style={{ position:'absolute', top:'30px', right:'70px', fontSize:'22px', fontWeight:'900', color:'#F5C842', animation:'exclaim 0.8s ease-in-out infinite 0.3s', zIndex:10 }}>?</div>

            {/* Sweat drops */}
            <div style={{ position:'absolute', top:'90px', right:'55px', width:'10px', height:'14px', background:'#60A5FA', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', animation:'sweat 1.2s ease-in-out infinite', zIndex:10 }}/>
            <div style={{ position:'absolute', top:'100px', right:'62px', width:'7px', height:'10px', background:'#93C5FD', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', animation:'sweat 1.2s ease-in-out infinite 0.4s', zIndex:10 }}/>

            {/* Flying papers */}
            {[
              { top:'60px', left:'20px', anim:'paperFly1 3s ease-in-out infinite' },
              { top:'60px', left:'40px', anim:'paperFly2 3s ease-in-out infinite 0.8s' },
              { top:'50px', left:'60px', anim:'paperFly3 3s ease-in-out infinite 1.6s' },
            ].map((p, i) => (
              <div key={i} style={{ position:'absolute', top:p.top, left:p.left, width:'36px', height:'44px', background:'#fff', border:'1.5px solid #E8E0C8', borderRadius:'4px', animation:p.anim, zIndex:9 }}>
                <div style={{ position:'absolute', top:'8px', left:'6px', right:'6px', height:'2px', background:'#E8E0C8', borderRadius:'2px', boxShadow:'0 5px 0 #E8E0C8, 0 10px 0 #E8E0C8, 0 15px 0 #E8E0C8' }}/>
              </div>
            ))}

            {/* AI bubble */}
            <div style={{ position:'absolute', top:'20px', left:'10px', background:'#2C2A1E', color:'#FFFDF4', borderRadius:'12px 12px 12px 0', padding:'8px 12px', fontSize:'11px', maxWidth:'140px', lineHeight:1.5, animation:'float 3s ease-in-out infinite', zIndex:10 }}>
              Photosynthesis converts light to energy
              <span style={{ display:'inline-block', width:'2px', height:'11px', background:'#F5C842', marginLeft:'2px', animation:'blink 1s step-end infinite', verticalAlign:'middle' }}/>
              <div style={{ position:'absolute', bottom:'-8px', left:'12px', width:0, height:0, borderLeft:'8px solid transparent', borderTop:'8px solid #2C2A1E' }}/>
            </div>

            {/* SVG Student */}
            <svg width="320" height="380" viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="160" cy="365" rx="90" ry="10" fill="#2C2A1E" opacity="0.08"/>
              <rect x="40" y="290" width="240" height="16" rx="4" fill="#E8D5A3"/>
              <rect x="60" y="306" width="12" height="50" rx="3" fill="#D4B896"/>
              <rect x="248" y="306" width="12" height="50" rx="3" fill="#D4B896"/>
              <rect x="120" y="220" width="80" height="10" rx="5" fill="#D4B896"/>
              <rect x="130" y="230" width="8" height="60" rx="3" fill="#D4B896"/>
              <rect x="182" y="230" width="8" height="60" rx="3" fill="#D4B896"/>
              <rect x="115" y="258" width="90" height="75" rx="18" fill="#F5C842"/>
              <path d="M148 258 L160 275 L172 258" fill="none" stroke="#E8A800" strokeWidth="2"/>
              <g style={{ animation:'armWave 0.6s ease-in-out infinite', transformOrigin:'125px 270px' }}>
                <rect x="90" y="265" width="38" height="14" rx="7" fill="#FDDCB0" transform="rotate(-40 125 270)"/>
                <circle cx="88" cy="248" r="10" fill="#FDDCB0"/>
                <circle cx="80" cy="242" r="5" fill="#FDDCB0"/>
                <circle cx="87" cy="238" r="5" fill="#FDDCB0"/>
                <circle cx="95" cy="239" r="5" fill="#FDDCB0"/>
                <circle cx="100" cy="245" r="5" fill="#FDDCB0"/>
              </g>
              <g style={{ animation:'bookShake 0.5s ease-in-out infinite', transformOrigin:'195px 280px' }}>
                <rect x="192" y="268" width="38" height="14" rx="7" fill="#FDDCB0" transform="rotate(30 195 275)"/>
                <rect x="205" y="272" width="44" height="56" rx="4" fill="#E53E3E"/>
                <rect x="207" y="272" width="6" height="56" rx="2" fill="#C53030"/>
                <line x1="215" y1="282" x2="244" y2="282" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <line x1="215" y1="290" x2="244" y2="290" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <line x1="215" y1="298" x2="240" y2="298" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <line x1="215" y1="306" x2="244" y2="306" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                <text x="229" y="320" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">EXAM</text>
                <text x="229" y="330" textAnchor="middle" fontSize="7" fill="white" opacity="0.8">PREP</text>
              </g>
              <rect x="148" y="240" width="24" height="22" rx="6" fill="#FDDCB0"/>
              <g style={{ animation:'headBob 0.8s ease-in-out infinite' }}>
                <ellipse cx="160" cy="210" rx="44" ry="46" fill="#FDDCB0"/>
                <ellipse cx="160" cy="172" rx="44" ry="22" fill="#2C2A1E"/>
                <ellipse cx="118" cy="190" rx="12" ry="18" fill="#2C2A1E"/>
                <ellipse cx="202" cy="190" rx="12" ry="18" fill="#2C2A1E"/>
                <rect x="116" y="180" width="88" height="16" rx="8" fill="#2C2A1E"/>
                <path d="M155 168 Q150 145 158 135 Q162 125 165 140 Q168 150 160 168" fill="#2C2A1E"/>
                <path d="M165 166 Q168 145 175 138 Q180 130 178 150 Q176 160 168 166" fill="#2C2A1E"/>
                <g style={{ animation:'eyeMove 2s ease-in-out infinite' }}>
                  <ellipse cx="143" cy="210" rx="9" ry="10" fill="white"/>
                  <ellipse cx="145" cy="212" rx="5" ry="6" fill="#2C2A1E"/>
                  <ellipse cx="147" cy="210" rx="2" ry="2" fill="white"/>
                  <ellipse cx="177" cy="210" rx="9" ry="10" fill="white"/>
                  <ellipse cx="179" cy="212" rx="5" ry="6" fill="#2C2A1E"/>
                  <ellipse cx="181" cy="210" rx="2" ry="2" fill="white"/>
                </g>
                <path d="M134 198 Q143 193 152 197" fill="none" stroke="#2C2A1E" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M168 197 Q177 193 186 198" fill="none" stroke="#2C2A1E" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="160" cy="232" rx="14" ry="10" fill="#C53030"/>
                <ellipse cx="160" cy="228" rx="14" ry="6" fill="#FDDCB0"/>
                <rect x="150" y="228" width="8" height="7" rx="2" fill="white"/>
                <rect x="160" y="228" width="8" height="7" rx="2" fill="white"/>
                <ellipse cx="128" cy="222" rx="10" ry="6" fill="#F4A0A0" opacity="0.5"/>
                <ellipse cx="192" cy="222" rx="10" ry="6" fill="#F4A0A0" opacity="0.5"/>
              </g>
              <rect x="75" y="264" width="100" height="28" rx="4" fill="#E8E0C8"/>
              <rect x="78" y="267" width="94" height="22" rx="2" fill="#2C2A1E"/>
              <rect x="82" y="270" width="30" height="3" rx="1" fill="#F5C842" opacity="0.8"/>
              <rect x="82" y="276" width="50" height="2" rx="1" fill="#7A7560" opacity="0.6"/>
              <rect x="82" y="281" width="40" height="2" rx="1" fill="#7A7560" opacity="0.6"/>
              <text x="148" y="282" textAnchor="middle" fontSize="7" fill="#F5C842" fontWeight="700">G</text>
              <rect x="68" y="290" width="116" height="6" rx="3" fill="#D8D0B8"/>
              <rect x="48" y="270" width="22" height="24" rx="4" fill="#FFFDF4" stroke="#E8E0C8" strokeWidth="1.5"/>
              <path d="M70 278 Q78 278 78 284 Q78 290 70 290" fill="none" stroke="#E8E0C8" strokeWidth="1.5"/>
              <rect x="52" y="266" width="14" height="5" rx="2" fill="#E8E0C8"/>
              <path d="M54 264 Q56 258 54 252" fill="none" stroke="#B0A890" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" style={{ animation:'float 2s ease-in-out infinite' }}/>
              <path d="M60 262 Q62 255 60 248" fill="none" stroke="#B0A890" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" style={{ animation:'float 2s ease-in-out infinite 0.5s' }}/>
            </svg>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:'60px 24px', background:'#F5F0DC', borderTop:'1px solid #E8E0C8' }}>
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ fontSize:'28px', fontWeight:'800', color:'#2C2A1E', marginBottom:'8px' }}>Don't be that student. Use Graspify.</div>
          <div style={{ fontSize:'14px', color:'#7A7560' }}>Everything you need. One canvas. Zero panic.</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'16px', maxWidth:'680px', margin:'0 auto' }}>
          {[
            { icon:'▶', name:'YouTube panels', desc:'Watch lectures without switching tabs' },
            { icon:'📝', name:'Smart notes', desc:'Auto-saved, always there when you need them' },
            { icon:'✨', name:'Highlight & ask AI', desc:'Select any text, get instant explanations' },
            { icon:'📄', name:'PDF viewer', desc:'Read study material right inside your canvas' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize:'28px', marginBottom:'10px' }}>{f.icon}</div>
              <div style={{ fontSize:'13px', fontWeight:'700', color:'#2C2A1E', marginBottom:'4px' }}>{f.name}</div>
              <div style={{ fontSize:'12px', color:'#7A7560', lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'60px 24px', background:'#2C2A1E' }}>
        <div style={{ fontSize:'32px', fontWeight:'800', color:'#F5C842', marginBottom:'8px' }}>Ready to stop panicking? 😅</div>
        <div style={{ fontSize:'15px', color:'#B0A890', marginBottom:'28px' }}>Join students already studying smarter with Graspify.</div>
        <button className="btn-primary" style={{ fontSize:'16px', padding:'16px 40px' }} onClick={handleGuest}>
          Start for free — it's easy ✨
        </button>
      </div>
    </div>
  )
}

export default Login