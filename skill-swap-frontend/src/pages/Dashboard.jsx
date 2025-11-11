import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({}); // cache by partnerId -> { skill }

  const titleCase = (s) => {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const findMatches = async () => {
    const res = await api.post('/match/find', {});
    setSuggestions(res.data.suggestions);
  };

  useEffect(() => { findMatches(); }, []);

  const ensureDetails = async (partnerId, offeredName) => {
    if (details[partnerId]) return details[partnerId];
    try{
      const res = await api.get(`/profile/${partnerId}`);
      const skills = res.data?.skillsOffered || [];
      const sk = skills.find(x => String(x.name).toLowerCase() === String(offeredName || '').toLowerCase()) || null;
      const datum = { skill: sk, ownerName: res.data?.name };
      setDetails(prev => ({ ...prev, [partnerId]: datum }));
      return datum;
    }catch(e){ return null; }
  };

  const connect = async (partnerId, theyOffer, theyWant) => {
    const res = await api.post('/match/connect', { partnerId, skillAtoB: theyWant || null, skillBtoA: theyOffer || null });
    const partner = partnerId;
    nav(`/chat/${partner}`);
  };

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p style={{marginTop:8}}>Welcome, {user?.name}</p>
      <h3 style={{marginTop:12}}>Suggested Matches</h3>
      <div className="skill-grid">
        {suggestions.map((m, idx) => {
          const isExpanded = expanded === idx;
          const offering = titleCase(m.theyOffer);
          const requesting = m.reciprocal && m.theyWant ? titleCase(m.theyWant) : '';
          const onCardClick = async () => {
            if (isExpanded) { setExpanded(null); return; }
            setExpanded(idx);
            await ensureDetails(m.partnerId, m.theyOffer);
          };
          return (
            <div
              key={idx}
              className="skill"
              onClick={onCardClick}
              style={{cursor:'pointer'}}
            >
              <h4>{isExpanded ? titleCase(m.partnerName) : m.partnerName}</h4>
              {!isExpanded && (
                <div style={{display:'grid', gap:6}}>
                  <div className="kv-row"><strong>Skill Offered :</strong> {offering || '—'}</div>
                  {requesting ? <div className="kv-row"><strong>Skill Requested :</strong> {requesting}</div> : null}
                </div>
              )}

              {isExpanded && (
                (() => {
                  const d = details[m.partnerId];
                  const sk = d?.skill;
                  if (!sk) {
                    return <div className="meta">Loading details…</div>;
                  }
                  return (
                    <>
                      <div className="kv-row"><strong>Skill Offered :</strong> {offering || '—'}</div>
                      <div className="meta" style={{display:'grid', gap:4}}>
                        <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}>
                          <span>Category: {sk.category || '—'}</span>
                          <span aria-hidden="true">·</span>
                          <span>Level: {sk.level}</span>
                        </div>
                        <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}>
                          <span>Location: {sk.location || '—'}</span>
                        </div>
                      </div>
                      <div style={{flex:1}}>{sk.description || 'No description'}</div>
                      <div className="sep" />
                      {requesting ? (
                        <div className="kv-row" style={{marginTop:0}}><strong>Skill Requested :</strong> {requesting}</div>
                      ) : null}
                      <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:12}} onClick={(e)=>e.stopPropagation()}>
                        <button className="btn" onClick={()=>connect(m.partnerId, m.theyOffer, m.theyWant)}>Connect</button>
                        <button className="btn" onClick={()=>nav(`/chat/${m.partnerId}`)}>Chat</button>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

