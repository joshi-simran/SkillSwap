import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Browse from './pages/Browse.jsx';
import Offer from './pages/Offer.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Matches from './pages/Matches.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './pages/Profile.jsx';
import Feedback from './pages/Feedback.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

function PrivateRoute({ children }){
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App(){
  const { token, logout } = useAuth();
  return (
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="logo">SS</div>
            <div>
              <h2 style={{margin:0}}>SkillSwap</h2>
              <small style={{color:'#2f5d58'}}>Peer-to-Peer Skill Exchange</small>
            </div>
          </div>
          <nav className="nav" style={{gap:12, alignItems:'center'}}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
            {token && (
              <button className="btn" onClick={logout}>Logout</button>
            )}
          </nav>
        </header>
        {token && (
          <div style={{display:'flex', gap:12, padding:'8px 0', paddingLeft:12, borderBottom:'1px solid #e0e0e0'}}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/offer">Offer</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/profile">My Profile</Link>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/browse" element={<Browse/>} />
          <Route path="/offer" element={<PrivateRoute><Offer/></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path="/matches" element={<PrivateRoute><Matches/></PrivateRoute>} />
          <Route path="/chat/:peerId" element={<PrivateRoute><Chat/></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/feedback/:matchId/:toUserId" element={<PrivateRoute><Feedback/></PrivateRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </div>
  );
}

