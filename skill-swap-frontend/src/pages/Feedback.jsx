import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function Feedback(){
  const { matchId, toUserId } = useParams();
  const nav = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setErr('');
    try{
      await api.post('/feedback', { matchId, to: toUserId, rating: Number(rating), comment });
      nav('/matches');
    }catch(e){ setErr(e?.response?.data?.msg || 'Failed to submit feedback'); }
    finally{ setSubmitting(false); }
  };

  return (
    <div className="card">
      <h2>Leave Feedback</h2>
      <form onSubmit={submit}>
        <label>Rating</label>
        <div role="radiogroup" aria-label="Rating" style={{display:'flex', gap:8, marginBottom:6}}>
          {[1,2,3,4,5].map(n => {
            const display = hoverRating ?? rating;
            const full = display >= n;
            const half = !full && display >= n - 0.5;
            const baseStyle = {
              fontSize:28,
              lineHeight:1,
              background:'transparent',
              border:'none',
              cursor:'pointer',
              padding:0,
            };
            const starStyle = full
              ? { color: '#f6b100' }
              : half
                ? {
                    background: 'linear-gradient(90deg, #f6b100 50%, #c8d0d0 50%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }
                : { color: '#c8d0d0' };
            const onMove = (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const halfSelected = x < rect.width / 2 ? 0.5 : 1;
              setHoverRating(n - 1 + halfSelected);
            };
            const onLeave = () => setHoverRating(null);
            const onClickStar = () => setRating(hoverRating ?? n);
            return (
              <button
                key={n}
                type="button"
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                onClick={onClickStar}
                aria-label={`${display} stars`}
                style={baseStyle}
              >
                <span style={starStyle}>★</span>
              </button>
            );
          })}
        </div>
        <label style={{marginTop:8}}>Comment (optional)</label>
        <textarea className="input" value={comment} onChange={e=>setComment(e.target.value)} />
        {err && <div className="meta" style={{color:'crimson', marginTop:8}}>{err}</div>}
        <button className="btn" style={{marginTop:10}} disabled={submitting}>{submitting?'Submitting...':'Submit'}</button>
      </form>
    </div>
  );
}
