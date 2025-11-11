import React, { useState } from 'react';
import api from '../api';

export default function Offer(){
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [want, setWant] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post('/skills', { name, level, description: desc, category, location, availability });
    if (want && want.trim()) {
      // merge into skillsWanted list
      try{
        const me = await api.get('/profile/me');
        const current = me.data?.skillsWanted || [];
        const merged = Array.from(new Set([...current, ...want.split(',').map(s=>s.trim()).filter(Boolean)]));
        await api.put('/profile/me', { skillsWanted: merged });
      }catch(err){ /* non-blocking */ }
    }
    alert('Skill posted!');
    setName(''); setLevel('Beginner'); setDesc(''); setCategory(''); setLocation(''); setAvailability(''); setWant('');
  };

  return (
    <div className="card">
      <h2 style={{marginBottom:12}}>Offer a Skill</h2>
      <form onSubmit={onSubmit}>
        <div className="grid-2">
          <div>
            <label>Skill</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required placeholder="e.g. Guitar Lessons"/>
          </div>
          <div>
            <label>Level</label>
            <select className="input" value={level} onChange={e=>setLevel(e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
        </div>
        <div className="grid-2" style={{marginTop:10}}>
          <div>
            <label>Category</label>
            <input className="input" value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g. Music" />
          </div>
          <div>
            <label>Location</label>
            <input className="input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. New Delhi" />
          </div>
        </div>
        <div style={{marginTop:10}}>
          <label>Description</label>
          <textarea className="input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Session Details And Expectations" />
        </div>
        <div style={{marginTop:10}}>
          <label>Availability</label>
          <input className="input" value={availability} onChange={e=>setAvailability(e.target.value)} placeholder="e.g. Evenings, Weekends" />
        </div>
        <div style={{marginTop:10}}>
          <label>What do you want to learn?</label>
          <input className="input" value={want} onChange={e=>setWant(e.target.value)} placeholder="e.g. Guitar, Cooking" />
        </div>
        <div style={{marginTop:10}}>
          <button className="btn" type="submit">Post Skill</button>
        </div>
      </form>
    </div>
  );
}

