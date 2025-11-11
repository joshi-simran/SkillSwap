import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try{
      await login(email, password);
      nav('/dashboard');
    }catch(e){ setErr(e?.response?.data?.msg || 'Login failed'); }
    finally{ setLoading(false); }
  };

  return (
    <div className="card">
      <h2 style={{marginBottom:12}}>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={{marginTop:8}}>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="meta" style={{color:'crimson', marginTop:8}}>{err}</div>}
        <button className="btn" style={{marginTop:14, fontSize:16}} disabled={loading}>{loading?'Loading...':'Login'}</button>
        <div style={{marginTop:10, fontSize:13}}><Link to="/register">Create an Account</Link></div>
      </form>
    </div>
  );
}

