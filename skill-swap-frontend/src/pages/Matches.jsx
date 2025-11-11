import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Matches(){
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const { user } = useAuth();
  const [expandedIds, setExpandedIds] = useState([]);

  const titleCase = (s) => {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const load = async () => {
    const res = await api.get('/match/my');
    setList(res.data);
  };

  const complete = async (id, partnerId) => {
    await api.post('/match/complete', { matchId: id });
    nav(`/feedback/${id}/${partnerId}`);
  };

  useEffect(()=>{ load(); }, []);

  const isExpanded = (id) => expandedIds.includes(String(id));
  const toggleExpanded = (id) => {
    const k = String(id);
    setExpandedIds(prev => prev.includes(k) ? prev.filter(x=>x!==k) : [...prev, k]);
  };

  return (
    <div className="card">
      {/* Section 1: Active (connected) */}
      <section style={{marginTop:4, paddingTop:8, borderTop:'1px solid #e0e0e0'}}>
      <h3>Active Matches</h3>
      <div className="skill-grid" style={{marginTop:8}}>
        {list.filter(m=>m.status==='connected').map(m => {
          const aId = m.userA?._id || m.userA;
          const bId = m.userB?._id || m.userB;
          const myId = user?.id;
          const partnerId = String(aId) === String(myId) ? bId : aId;
          const offered = String(aId) === String(myId) ? m.skillAtoB : m.skillBtoA;
          const requested = String(aId) === String(myId) ? m.skillBtoA : m.skillAtoB;
          const detail = ((String(aId) === String(myId)) ? m.detailA : m.detailB) || null;
          const expanded = isExpanded(m._id);
          return (
            <div className="skill" key={m._id} onClick={()=>toggleExpanded(m._id)} style={{cursor:'pointer'}}>
              <h4>{titleCase(m.userA?.name || 'User A')} ↔ {titleCase(m.userB?.name || 'User B')}</h4>
              <div className="meta">Status: {titleCase(m.status)}</div>
              <div className="kv-row"><strong>Skill Offered :</strong> {titleCase(offered || '—')}</div>
              {expanded && detail ? (
                <div className="meta" style={{display:'grid', gap:4}}>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Category: {detail.category || '—'}</span><span aria-hidden="true">·</span><span>Level: {detail.level}</span></div>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Location: {detail.location || '—'}</span></div>
                </div>
              ) : null}
              {expanded && detail?.description ? <div style={{flex:1}}>{detail.description}</div> : null}
              {expanded && <div className="sep" />}
              <div className="kv-row"><strong>Skill Requested :</strong> {titleCase(requested || '—')}</div>
              {expanded && (
                <div style={{display:'flex', gap:8, marginTop:8}} onClick={(e)=>e.stopPropagation()}>
                  <button className="btn" onClick={()=>nav(`/chat/${partnerId}`)}>Chat</button>
                  <button className="btn" onClick={()=>complete(m._id, partnerId)}>Mark Completed</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </section>

      {/* Section 2: Incoming pending (others want to match with me) */}
      <section style={{marginTop:16, paddingTop:8, borderTop:'1px solid #e0e0e0'}}>
      <h3>Incoming Match Requests</h3>
      <div className="skill-grid" style={{marginTop:8}}>
        {list.filter(m=>m.status==='pending' && String(m.requestedBy) !== String(user?.id)).map(m => {
          const aId = m.userA?._id || m.userA;
          const bId = m.userB?._id || m.userB;
          const myId = user?.id;
          const partnerId = String(aId) === String(myId) ? bId : aId;
          const offered = String(aId) === String(myId) ? m.skillAtoB : m.skillBtoA;
          const requested = String(aId) === String(myId) ? m.skillBtoA : m.skillAtoB;
          const respond = async (action) => {
            await api.post('/match/respond', { matchId: m._id, action });
            await load();
          };
          const detail = ((String(aId) === String(myId)) ? m.detailA : m.detailB) || null;
          const expanded = isExpanded(m._id);
          return (
            <div className="skill" key={m._id} onClick={()=>toggleExpanded(m._id)} style={{cursor:'pointer'}}>
              <h4>{titleCase(m.userA?.name || 'User A')} ↔ {titleCase(m.userB?.name || 'User B')}</h4>
              <div className="meta">Status: {titleCase(m.status)} (Incoming)</div>
              <div className="kv-row"><strong>Skill Offered :</strong> {titleCase(offered || '—')}</div>
              {expanded && detail ? (
                <div className="meta" style={{display:'grid', gap:4}}>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Category: {detail.category || '—'}</span><span aria-hidden="true">·</span><span>Level: {detail.level}</span></div>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Location: {detail.location || '—'}</span></div>
                </div>
              ) : null}
              {expanded && detail?.description ? <div style={{flex:1}}>{detail.description}</div> : null}
              {expanded && <div className="sep" />}
              <div className="kv-row"><strong>Skill Requested :</strong> {titleCase(requested || '—')}</div>
              {expanded && (
                <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}} onClick={(e)=>e.stopPropagation()}>
                  <button className="btn" onClick={()=>nav(`/chat/${partnerId}`)}>Chat</button>
                  <button className="btn" onClick={()=>respond('accept')}>Accept</button>
                  <button className="btn" onClick={()=>respond('reject')}>Reject</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </section>

      {/* Section 3: Outgoing pending (I have sent a request) */}
      <section style={{marginTop:16, paddingTop:8, borderTop:'1px solid #e0e0e0'}}>
      <h3>Outgoing Match Requests</h3>
      <div className="skill-grid" style={{marginTop:8}}>
        {list.filter(m=>m.status==='pending' && String(m.requestedBy) === String(user?.id)).map(m => {
          const aId = m.userA?._id || m.userA;
          const bId = m.userB?._id || m.userB;
          const myId = user?.id;
          const partnerId = String(aId) === String(myId) ? bId : aId;
          const offered = String(aId) === String(myId) ? m.skillAtoB : m.skillBtoA;
          const requested = String(aId) === String(myId) ? m.skillBtoA : m.skillAtoB;
          const detail = ((String(aId) === String(myId)) ? m.detailA : m.detailB) || null;
          const expanded = isExpanded(m._id);
          return (
            <div className="skill" key={m._id} onClick={()=>toggleExpanded(m._id)} style={{cursor:'pointer'}}>
              <h4>{titleCase(m.userA?.name || 'User A')} ↔ {titleCase(m.userB?.name || 'User B')}</h4>
              <div className="meta">Status: {titleCase(m.status)} (Outgoing)</div>
              <div className="kv-row"><strong>Skill Offered :</strong> {titleCase(offered || '—')}</div>
              <div className="kv-row"><strong>Skill Requested :</strong> {titleCase(requested || '—')}</div>
              {expanded && (
                <div>
                  {detail ? (
                    <div className="meta" style={{display:'grid', gap:4}}>
                      <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Category: {detail.category || '—'}</span><span aria-hidden="true">·</span><span>Level: {detail.level}</span></div>
                      <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Location: {detail.location || '—'}</span></div>
                    </div>
                  ) : null}
                  {detail?.description ? <div style={{flex:1}}>{detail.description}</div> : null}
                  <div className="sep" />
                  <div style={{display:'flex', gap:8, marginTop:8}} onClick={(e)=>e.stopPropagation()}>
                    <button className="btn" onClick={()=>nav(`/chat/${partnerId}`)}>Chat</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </section>

      {/* Section 4: Completed matches */}
      <section style={{marginTop:16, paddingTop:8, borderTop:'1px solid #e0e0e0', paddingBottom:8, borderBottom:'1px solid #e0e0e0'}}>
      <h3>Completed Matches</h3>
      <div className="skill-grid" style={{marginTop:8}}>
        {list.filter(m=>m.status==='completed').map(m => {
          const aId = m.userA?._id || m.userA;
          const bId = m.userB?._id || m.userB;
          const myId = user?.id;
          const partnerId = String(aId) === String(myId) ? bId : aId;
          const offered = String(aId) === String(myId) ? m.skillAtoB : m.skillBtoA;
          const requested = String(aId) === String(myId) ? m.skillBtoA : m.skillAtoB;
          const detail = ((String(aId) === String(myId)) ? m.detailA : m.detailB) || null;
          const expanded = isExpanded(m._id);
          return (
            <div className="skill" key={m._id} onClick={()=>toggleExpanded(m._id)} style={{cursor:'pointer'}}>
              <h4>{titleCase(m.userA?.name || 'User A')} ↔ {titleCase(m.userB?.name || 'User B')}</h4>
              <div className="meta">Status: Completed</div>
              <div className="kv-row"><strong>Skill Offered :</strong> {titleCase(offered || '—')}</div>
              {expanded && detail ? (
                <div className="meta" style={{display:'grid', gap:4}}>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Category: {detail.category || '—'}</span><span aria-hidden="true">·</span><span>Level: {detail.level}</span></div>
                  <div style={{display:'flex', gap:12, whiteSpace:'nowrap'}}><span>Location: {detail.location || '—'}</span></div>
                </div>
              ) : null}
              {expanded && detail?.description ? <div style={{flex:1}}>{detail.description}</div> : null}
              {expanded && <div className="sep" />}
              <div className="kv-row"><strong>Skill Requested :</strong> {titleCase(requested || '—')}</div>
              {expanded && (
                <div style={{display:'flex', gap:8, marginTop:8}} onClick={(e)=>e.stopPropagation()}>
                  <button className="btn" onClick={()=>nav(`/chat/${partnerId}`)}>Chat</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </section>
    </div>
  );
}

