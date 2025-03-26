import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showMission, setShowMission] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const whyRef = useRef(null);
  const visionRef = useRef(null);
  const planRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();
          star.alpha += Math.random() * 0.05 - 0.025;
          star.alpha = Math.max(0.5, Math.min(1, star.alpha));
        });
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    const title = titleRef.current;
    if (title) {
      const letters = "Revive America"
        .split('')
        .map((char) => `<span class="letter">${char}</span>`)
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }

    const why = whyRef.current;
    if (why) {
      gsap.from(why.children, { duration: 1, opacity: 0, y: 30, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: why } });
    }

    const vision = visionRef.current;
    if (vision) {
      gsap.from(vision.children, { duration: 1, opacity: 0, x: -50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: vision } });
    }

    const plan = planRef.current;
    if (plan) {
      gsap.from(plan.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: plan } });
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/login', { username, password });
      setUser(res.data.user);
      setUsername('');
      setPassword('');
      setShowAuth(false);
    } catch (err) {
      alert('Login failed—check your credentials!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/signup', { username: signupUsername, password: signupPassword });
      alert('Signup successful! Please log in.');
      setSignupUsername('');
      setSignupPassword('');
      setActiveTab('login');
    } catch (err) {
      alert('Signup failed—username might be taken!');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/.netlify/functions/logout');
      setUser(null);
    } catch (err) {
      alert('Logout failed—try again!');
    }
  };

  const handleDonate = () => {
    window.open('https://reviveamerica.org/donate', '_blank'); // Placeholder URL
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="starry-background" />
      <div className="rotating-text-background">Revive America</div>

      <header className="header">
        <h1 ref={titleRef} className="title">Revive America</h1>
        <p className="subtitle">A Sovereign People’s Journey</p>
        <div className="auth-section">
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="auth-btn">Logout</button>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)} className="auth-btn">Sign Up or Log In</button>
          )}
        </div>
      </header>

      <section className="landing-section">
        <h2 className="landing-title">The Call to Revive</h2>
        <p className="landing-text">
          Join us to restore the America our founders envisioned—a union of sovereign states and tribes, where liberty flows from individuals to communities, not from distant elites.
        </p>
        <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
        <button className="cta-btn" onClick={() => setShowPlan(true)}>Our Plan</button>
        <button className="cta-btn" onClick={handleDonate}>Support the Revival</button>
      </section>

      <section className="why-i-am-section" ref={whyRef}>
        <h2 className="section-title">Why We Fight</h2>
        <p className="section-text">
          Once, we thrived in tight-knit communities—farming, ranching, and standing together. Today, an Elite Ruling Class siphons $4.7 trillion in taxes (IRS 2023), seizes $68 billion through forfeiture (IJ 2024), and jails 10.5 million (FBI 2022), dimming that dream. From the Whiskey Rebellion (1794) to the Cherokee’s stand (1832), states and tribes have resisted. We fight to revive their legacy of sovereignty.
        </p>
      </section>

      <section className="vision-section" ref={visionRef}>
        <h2 className="section-title">Our Vision</h2>
        <p className="section-text">
          By 2040, 50+ states and 574 tribes will nullify federal overreach, sheriffs and tribal leaders will defend our rights, and grand juries will hold elites accountable. We’ll shift to state and tribal economic control, win legal victories, and amend the Constitution to enshrine sovereignty—echoing 1798, 1832, and beyond.
        </p>
      </section>

      <section className="plan-section" ref={planRef}>
        <h2 className="section-title">How We Win</h2>
        <p className="section-text">
          From 2025-2030, we’ll mobilize: pass sovereignty laws, empower sheriffs and tribes, establish juries, and shift taxes. By 2040, we’ll ratify amendments with 38 states and tribes. With $525-725 million—$50 trains a defender, $1,000 nullifies a law—we’ll reclaim our birthright, uniting 94% who see the unfairness (Gallup 2024).
        </p>
        <button className="cta-btn pulse-btn" onClick={handleDonate}>Donate Now</button>
      </section>

      {showAuth && (
        <div className="auth-modal">
          <div className="auth-content">
            <h2 className="auth-title">Join the Revival</h2>
            <div className="auth-tabs">
              <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                Login
              </button>
              <button className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
                Signup
              </button>
            </div>
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="auth-form">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit" className="submit-btn">Login</button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="auth-form">
                <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} placeholder="Choose Username" required />
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Choose Password" required />
                <button type="submit" className="submit-btn">Signup</button>
              </form>
            )}
            <button className="close-btn" onClick={() => setShowAuth(false)}>Close</button>
          </div>
        </div>
      )}

      {showMission && (
        <div className="history-modal">
          <div className="history-content">
            <h2 className="history-title">Our Mission</h2>
            <p className="history-text">
              Revive America restores sovereignty to individuals, states, and tribes—countering an Elite Ruling Class with state nullification, tribal resilience, and community strength. We’re here to reclaim the founders’ vision by 2040.
            </p>
            <button className="close-btn" onClick={() => setShowMission(false)}>Close</button>
          </div>
        </div>
      )}

      {showPlan && (
        <div className="course-modal">
          <div className="course-content">
            <h2 className="course-title">Our Plan</h2>
            <p className="course-text">
              Phase 1 (2025-2030): Laws in 50+ states and 574 tribes, 60+ sheriffs and tribal leaders, 2,500+ juries. Phase 2 (2031-2040): Constitutional amendments with 38 states and tribes, $500M+ from lawsuits. Join us to win.
            </p>
            <button className="close-btn" onClick={() => setShowPlan(false)}>Close</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="footer-text">© 2025 Revive America. All rights reserved.</p>
        <p className="contact-text">Contact: info@reviveamerica.info</p>
        <div className="social-links">
          <a href="https://x.com/ReviveAmerica" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;