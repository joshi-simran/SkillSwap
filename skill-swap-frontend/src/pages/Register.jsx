import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register(){
  const nav = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try{
      await register(name, email, password);
      nav('/dashboard');
    }catch(e){ setErr(e?.response?.data?.msg || 'Registration failed'); }
    finally{ setLoading(false); }
  };

  return (
    <div className="card">
      <h2 style={{marginBottom:12}}>Create Account</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} required/>
        <label style={{marginTop:8}}>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <label style={{marginTop:8}}>Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {err && <div className="meta" style={{color:'crimson', marginTop:8}}>{err}</div>}
        <button className="btn" style={{marginTop:14, fontSize:16}} disabled={loading}>{loading?'Loading...':'Register'}</button>
        <div style={{marginTop:10, fontSize:13}}><Link to="/login">Already have an account?</Link></div>
      </form>
    </div>
  );
}

