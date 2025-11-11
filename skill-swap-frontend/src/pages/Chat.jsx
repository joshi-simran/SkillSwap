import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Chat(){
  const { peerId } = useParams();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const load = async () => {
    const res = await api.get(`/messages/${peerId}`);
    setMsgs(res.data);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try{
      await api.post('/messages', { to: peerId, content: text.trim() });
      setText('');
      await load();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [peerId]);

  return (
    <div className="card">
      <h2>Chat</h2>
      <div className="chat-box">
        {msgs.map(m => (
          <div key={m._id} className="chat-msg">
            <div className="meta">{new Date(m.createdAt).toLocaleString()}</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{display:'flex', gap:8, marginTop:8}}>
        <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message"/>
        <button className="btn" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
