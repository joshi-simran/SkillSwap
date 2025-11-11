import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';

export default function Profile(){
  const { id } = useParams();
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ name:'', bio:'', location:'', avatarUrl:'', skillsWanted:'' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = id ? await api.get(`/profile/${id}`) : await api.get('/profile/me');
    setMe(res.data);
    setForm({
      name: res.data?.name || '',
      bio: res.data?.bio || '',
      location: res.data?.location || '',
      avatarUrl: res.data?.avatarUrl || '',
      skillsWanted: (res.data?.skillsWanted || []).join(', ')
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try{
      const payload = { ...form, skillsWanted: form.skillsWanted };
      const res = await api.put('/profile/me', payload);
      setMe(res.data);
    } finally {
      setSaving(false);
    }
  };

  useEffect(()=>{ load(); }, [id]);

  if (!me) return <div className="card"><div className="meta">Loading...</div></div>;

  return (
    <div className="card">
      <h2>{id ? 'User Profile' : 'My Profile'}</h2>
      <div className="grid-2" style={{alignItems:'flex-start'}}>
        <div>
          <img alt="avatar" src={form.avatarUrl || 'https://via.placeholder.com/120'} style={{width:120, height:120, borderRadius:8, objectFit:'cover'}}/>
          <div className="meta" style={{marginTop:8}}>Rating: {me.rating?.toFixed ? me.rating.toFixed(2) : me.rating} ⭐ ({me.ratingCount || 0})</div>
          <h4 style={{marginTop:12}}>Offered Skills</h4>
          <ul className="meta">
            {(me.skillsOffered || []).map(s => <li key={s._id}>{s.name} · {s.level}</li>)}
          </ul>
          <h4 style={{marginTop:12}}>Requested Skills</h4>
          <ul className="meta">
            {(me.skillsWanted || []).length ? (me.skillsWanted || []).map((s, i) => <li key={i}>{s}</li>) : <li>—</li>}
          </ul>
        </div>
        {!id ? (
        <form onSubmit={save}>
          <label>Name</label>
          <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <label style={{marginTop:8}}>Bio</label>
          <textarea className="input" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} />
          <label style={{marginTop:8}}>Location</label>
          <input className="input" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <label style={{marginTop:8}}>Avatar URL</label>
          <input className="input" value={form.avatarUrl} onChange={e=>setForm({...form, avatarUrl:e.target.value})} />
          <button className="btn" style={{marginTop:10}} disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
        </form>
        ) : (
          <div>
            <h4>About</h4>
            <p className="meta">{form.bio || 'No bio provided'}</p>
            <div className="meta">Location: {form.location || '—'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

