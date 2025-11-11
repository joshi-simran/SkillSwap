import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Browse(){
  const [skills, setSkills] = useState([]);
  const [qInput, setQInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [requestedInput, setRequestedInput] = useState('');
  const [appliedRequested, setAppliedRequested] = useState('');
  const { token, user } = useAuth();
  const nav = useNavigate();
  const [myProfile, setMyProfile] = useState(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) { setMyProfile(null); return; }
      try{
        const res = await api.get('/profile/me');
        setMyProfile(res.data);
      }catch(e){ /* ignore */ }
    };
    fetchMe();
  }, [token]);

  const load = async () => {
    const params = {};
    if (qInput) params.name = qInput;
    if (categoryInput) params.category = categoryInput;
    if (locationInput) params.location = locationInput;
    const res = await api.get('/skills', { params });
    setSkills(res.data);
    setAppliedRequested(requestedInput);
  };

  const list = skills
    .filter(s => {
      const ownerId = s.owner?._id || s.owner;
      const myId = user?.id;
      return !myId || String(ownerId) !== String(myId);
    })
    .filter(s => {
      if (!appliedRequested) return true;
      const wanted = (s.owner?.skillsWanted || []).map(x => String(x).toLowerCase());
      return wanted.some(w => w.includes(appliedRequested.toLowerCase()));
    });

  const connect = async (ownerId, theyOfferName, ownerWanted=[]) => {
    if (!token) { nav('/login'); return; }
    try{
      // Ensure profile is loaded
      let me = myProfile;
      if (!me) {
        try{ const res = await api.get('/profile/me'); me = res.data; setMyProfile(me); }catch(e){ me = null; }
      }
      const myWanted = (me?.skillsWanted || []).map(s=>String(s).toLowerCase());
      const myOffered = (me?.skillsOffered || []).map(s=>String(s.name).toLowerCase());
      const theyOffer = String(theyOfferName || '').toLowerCase();
      const theyWanted = (ownerWanted || []).map(s=>String(s).toLowerCase());

      const iWantTheirSkill = myWanted.includes(theyOffer);
      const myOfferedMatch = myOffered.find(n => theyWanted.includes(n));

      if (!(iWantTheirSkill && myOfferedMatch)){
        alert('Skills do not match. Offer a new skill or connect with another user whose requested skill matches one you offer.');
        return;
      }

      await api.post('/match/connect', { partnerId: ownerId, skillAtoB: myOfferedMatch, skillBtoA: theyOfferName });
      nav(`/chat/${ownerId}`);
    } finally {
      // no-op
    }
  };

  return (
    <div className="card">
      <h2 style={{marginBottom:14}}>Browse Skills</h2>
      <div className="searchbar" style={{gap:12, marginBottom:18}}>
        <input className="input" placeholder="Skills (e.g. Guitar, Python etc.)" value={qInput} onChange={e=>setQInput(e.target.value)} />
        <input className="input" placeholder="Category (e.g. Tech, Art etc.)" value={categoryInput} onChange={e=>setCategoryInput(e.target.value)} />
        <input className="input" placeholder="Location" value={locationInput} onChange={e=>setLocationInput(e.target.value)} />
        <input className="input" placeholder="Requested Skills (e.g. Java etc.)" value={requestedInput} onChange={e=>setRequestedInput(e.target.value)} />
        <button className="btn" onClick={load}>Apply</button>
      </div>

      <div className="skill-grid">
        {list.map(sk => (
          <div key={sk._id} className="skill">
            <div className="kv-row"><strong>Skill Offered :</strong> {sk.name}</div>
            <div className="meta" style={{display:'grid', gap:4}}>
              <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}>
                <span>Category: {sk.category || '—'}</span>
                <span aria-hidden="true">·</span>
                <span>Level: {sk.level}</span>
              </div>
              <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}>
                <span>Location: {sk.location || '—'}</span>
                <span aria-hidden="true">·</span>
                <span>By {sk.owner?.name || 'Unknown'}</span>
              </div>
            </div>
            <div style={{flex:1}}>{sk.description || 'No description'}</div>
            <div className="sep" />
            <div className="kv-row" style={{marginTop:0}}><strong>Skill Requested :</strong> {(sk.owner?.skillsWanted && sk.owner.skillsWanted.length>0) ? sk.owner.skillsWanted.join(', ') : '—'}</div>
            <div className="actions">
              <button className="btn" onClick={()=>connect(sk.owner?._id || sk.owner, sk.name, sk.owner?.skillsWanted || [])}>
                {token ? 'Connect' : 'Login to Connect'}
              </button>
              <button className="btn" onClick={()=> token ? nav(`/chat/${sk.owner?._id || sk.owner}`) : nav('/login')}>
                {token ? 'Chat' : 'Login to Chat'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

