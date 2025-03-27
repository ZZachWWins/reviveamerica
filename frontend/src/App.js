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
    // Parallax effect for background
    const handleScroll = () => {
      const background = document.querySelector('.parallax-background');
      const scrollPosition = window.scrollY;
      background.style.transform = `translateY(${scrollPosition * 0.4}px)`; // Slower parallax
    };
    window.addEventListener('scroll', handleScroll);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = 50; // Fixed width for starry band
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 50,
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 2 + 1,
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
      window.removeEventListener('scroll', handleScroll);
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
    window.open('https://reviveamerica.info/donate', '_blank');
  };

  // Cloudinary background image ID
  const backgroundImageId = 'l6njsafrg9lwoct4eeb3'; // Your provided ID
  // Placeholder section image IDs (replace with your actual IDs after upload)
  const sectionImages = {
    landing: 'your-landing-image-id',
    why: 'your-why-image-id',
    vision: 'your-vision-image-id',
    plan: 'your-plan-image-id',
  };

  return (
    <div className="app">
      {/* Parallax Background */}
      <div
        className="parallax-background"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_3840,q_auto/${backgroundImageId})`,
        }}
      ></div>

      <canvas ref={canvasRef} className="starry-background" />
      <div className="rotating-text-background">Revive America</div>

      <header className="header">
        <h1 ref={titleRef} className="title">Revive America</h1>
        <p className="subtitle">A Sovereign People’s Journey to Reclaim Liberty</p>
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
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.landing}`}
            alt="Landing"
          />
        </div>
        <div className="section-content">
          <h2 className="landing-title">The Call to Revive</h2>
          <p className="landing-text">
            Dear Fellow American, I am a child of this land, raised where neighbors were family, and we lived the promise of “Life, Liberty, and the pursuit of Happiness” (Declaration of Independence, 1776). Today, that dream fades under an Elite Ruling Class—$4.7 trillion in taxes (IRS 2023), $68 billion seized (IJ 2024), 10.5 million arrests (FBI 2022)—but we can restore it. Join us to revive the founders’ vision: a union of sovereign states and tribes, where liberty flows from individuals to communities, not distant elites.
          </p>
          <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
          <button className="cta-btn" onClick={() => setShowPlan(true)}>Our Plan</button>
          <button className="cta-btn" onClick={handleDonate}>Support the Revival</button>
        </div>
      </section>

      <section className="why-i-am-section" ref={whyRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.why}`}
            alt="Why We Fight"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">Why We Fight</h2>
          <p className="section-text">
            Once, we thrived in tight-knit communities—farming, ranching, hunting together—guided by state and tribal sovereignty, not elite dictates. Now, my hometown and countless others struggle, dimmed by a system that hoards $44 trillion for the 1% (Federal Reserve 2023), spends $14.4 billion on elections for millionaires (OpenSecrets 2023), and enforces control through 10.5 million arrests (Vera 2022). History screams resistance: the Whiskey Rebellion (1794) crushed for opposing taxes, Virginia and Kentucky’s Resolutions (1798) defying federal overreach, South Carolina’s Nullification (1832) against tariffs, and the Cherokee’s stand in Worcester v. Georgia (1832) betrayed by the Trail of Tears. We fight to revive their legacy—because 94% of us see this unfairness (Gallup 2024) and know it’s not the America our founders built.
          </p>
        </div>
      </section>

      <section className="vision-section" ref={visionRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.vision}`}
            alt="Our Vision"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">Our Vision</h2>
          <p className="section-text">
            By 2040, we’ll rebuild a union of sovereign states and tribes: 50+ states and 574 tribes nullifying federal overreach on taxes ($4.7 trillion, IRS 2023), health ($1.207 trillion Pharma, Statista 2025), and property ($68 billion forfeiture, IJ 2024). Over 60 sheriffs and tribal leaders will train 30,000-60,000 defenders, echoing the Whiskey Rebellion farmers and Texas border guards (2023-2025). Citizen grand juries (2,500+) will judge elite abuses, as in 1798 and 1854. Economic freedom will rise with 35+ states and tribes shifting to sales taxes or gaming compacts, like nine no-income-tax states and the Seminole ($2.5 billion, 2023). Legal victories (40-60 lawsuits, $500M+) and a Constitutional amendment by 38 states and tribes will banish elite influence, fulfilling the Anti-Federalists’ 1787 warnings and treaties like Fort Laramie (1868).
          </p>
        </div>
      </section>

      <section className="plan-section" ref={planRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.plan}`}
            alt="How We Win"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">How We Win</h2>
          <p className="section-text">
            Our 15-year roadmap starts March 2025: Phase 1 (2025-2030) launches with rallies in 50 state capitals and tribal lands (50,000 attendees), passing sovereignty laws in 50+ states and 574 tribes, empowering 60+ sheriffs and tribal leaders with 2,000+ militia units, and establishing 2,500+ juries to probe Pharma ($1.207T), education ($79.6B DOE), and forfeiture ($68B). By 2029, 35+ states and tribes shift to sales taxes or gaming, and 25 lawsuits reclaim $200M+. Phase 2 (2031-2040) calls a convention (34 states and 50 tribes by 2032), wins 45 lawsuits ($500M+), and ratifies amendments with 38 states and tribes by 2040. With $525-725M—$50 trains a defender, $1,000 nullifies a law, $1M secures a win—we’ll unite 94% who see the unfairness (Gallup 2024) and reclaim our birthright, as states and tribes have done from 1798 to Standing Rock (2016-2017).
          </p>
          <button className="cta-btn pulse-btn" onClick={handleDonate}>Donate Now</button>
        </div>
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
              Revive America restores sovereignty to individuals, states, and tribes—countering an Elite Ruling Class that’s turned our systems into tools of control. We expose corruption ($4.7 trillion taxes, IRS 2023; $68 billion forfeiture, IJ 2024), protect liberty through state nullification and tribal resilience, and empower communities to reclaim their rights, as envisioned in 1776 and defended in 1798, 1832, and beyond. By 2040, we’ll breathe new life into the bonds that once made us strong.
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
              Phase 1 (2025-2030): Launch with 50+ state and 574 tribal sovereignty laws by 2027, empower 60+ sheriffs and tribal leaders with 2,500+ militia units by 2030, establish 2,500+ grand juries to judge elite abuses, shift 35+ states and tribes to sales taxes or gaming by 2029, and secure 25 lawsuit wins ($200M+). Phase 2 (2031-2040): Call a convention with 34 states and 50 tribes by 2032, win 45 lawsuits ($500M+), and ratify Constitutional amendments with 38 states and tribes by 2040. Join us to turn 94% outrage (Gallup 2024) into action.
            </p>
            <button className="close-btn" onClick={() => setShowPlan(false)}>Close</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="footer-text">Built By Zachary. © 2025 Revive America. All rights reserved.</p>
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