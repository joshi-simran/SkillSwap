import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home(){
  const { token } = useAuth();
  const trending = ['Python', 'Guitar', 'Photoshop', 'Cooking', 'Public Speaking', 'React', 'Photography'];
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % trending.length);
    }, 2000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="card home" style={{textAlign:'center'}}>
      <h2>Welcome to SkillSwap</h2>
      <p>Offer your skills and learn from others. No money, just learning in exchange.</p>

      <div style={{marginTop:16}}>
        <h3>How It Works</h3>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:12, flexWrap:'wrap', marginTop:10}}>
          <div style={{minWidth:140, padding:'10px 12px', background:'#f7faf9', borderRadius:10, boxShadow:'0 2px 8px rgba(17,24,39,0.06)'}}>
            <div style={{fontWeight:600}}>1. Create Account</div>
            <div className="meta">Sign Up/Login</div>
          </div>
          <div className="meta" aria-hidden="true">→</div>
          <div style={{minWidth:140, padding:'10px 12px', background:'#f7faf9', borderRadius:10, boxShadow:'0 2px 8px rgba(17,24,39,0.06)'}}>
            <div style={{fontWeight:600}}>2. Offer & Request</div>
            <div className="meta">List Skills + Wants</div>
          </div>
          <div className="meta" aria-hidden="true">→</div>
          <div style={{minWidth:140, padding:'10px 12px', background:'#f7faf9', borderRadius:10, boxShadow:'0 2px 8px rgba(17,24,39,0.06)'}}>
            <div style={{fontWeight:600}}>3. Get Matched</div>
            <div className="meta">Find Complementary Peers</div>
          </div>
          <div className="meta" aria-hidden="true">→</div>
          <div style={{minWidth:140, padding:'10px 12px', background:'#f7faf9', borderRadius:10, boxShadow:'0 2px 8px rgba(17,24,39,0.06)'}}>
            <div style={{fontWeight:600}}>4. Chat & Schedule</div>
            <div className="meta">Plan Your Swap</div>
          </div>
          <div className="meta" aria-hidden="true">→</div>
          <div style={{minWidth:140, padding:'10px 12px', background:'#f7faf9', borderRadius:10, boxShadow:'0 2px 8px rgba(17,24,39,0.06)'}}>
            <div style={{fontWeight:600}}>5. Swap & Rate</div>
            <div className="meta">Leave Feedback</div>
          </div>
        </div>
      </div>

      <h3 style={{marginTop:20}}>Start Swapping</h3>
      <div style={{display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginTop:8}}>
        <Link className="btn" to="/browse">Browse Skills</Link>
        <Link className="btn" to="/offer">Offer Skill</Link>
        {!token && <Link className="btn" to="/register">Login / Register</Link>}
      </div>

      <div style={{marginTop:28}}>
        <h3>Trending Skills</h3>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:60, overflow:'hidden', position:'relative'}}>
          <div className="meta" style={{fontSize:24, transition:'transform 0.4s ease', willChange:'transform'}}>
            {trending[idx]}
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:6, marginTop:8}}>
          {trending.map((_, i) => (
            <span key={i} style={{width:8, height:8, borderRadius:4, background:i===idx?'#2f5d58':'#cfd8dc', display:'inline-block'}} />
          ))}
        </div>
      </div>
    </div>
  );
}
