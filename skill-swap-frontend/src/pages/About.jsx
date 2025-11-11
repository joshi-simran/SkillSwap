import React from 'react';

export default function About(){
  return (
    <div className="card">
      <h2>About SkillSwap</h2>
      <p>SkillSwap is a peer-to-peer skill exchange platform. Offer what you know and learn what you want—no money, just learning in exchange.</p>
      <div className="sep" />
      <h3 style={{marginTop:12}}>How it works</h3>
      <ul className="meta">
        <li>Create your account</li>
        <li>Offer a skill and list what you want to learn</li>
        <li>Get matched with complementary partners</li>
        <li>Chat, schedule, and complete your session</li>
        <li>Leave feedback and rating</li>
      </ul>
      <div className="sep" />
      <h3>Created By</h3>
      <div className="meta" style={{display:'grid', gap:4}}>
        <div>Shubashitha Gowtham</div>
        <div>Simran Joshi</div>
        <div>Sruthi Vejju</div>
      </div>
    </div>
  );
}
