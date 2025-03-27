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
  const fullCanvasRef = useRef(null);
  const titleRef = useRef(null);
  const whyRef = useRef(null);
  const visionRef = useRef(null);
  const planRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const resizeSideCanvas = () => {
      if (canvas) {
        canvas.width = 50;
        canvas.height = window.innerHeight;
      }
    };
    resizeSideCanvas();
    window.addEventListener('resize', resizeSideCanvas);

    const sideStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 50,
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    const fullCanvas = fullCanvasRef.current;
    const fullCtx = fullCanvas?.getContext('2d');
    const resizeFullCanvas = () => {
      if (fullCanvas) {
        fullCanvas.width = window.innerWidth;
        fullCanvas.height = window.innerHeight;
      }
    };
    resizeFullCanvas();
    window.addEventListener('resize', resizeFullCanvas);

    const fullStars = Array.from({ length: 150 }, () => ({
      x: Math.random() * (fullCanvas?.width || window.innerWidth),
      y: Math.random() * (fullCanvas?.height || window.innerHeight),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    let animationFrameId;
    let frameCount = 0;

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sideStars.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();
          if (frameCount % 5 === 0) {
            star.alpha += Math.random() * 0.05 - 0.025;
            star.alpha = Math.max(0.5, Math.min(1, star.alpha));
          }
        });
      }

      if (fullCtx) {
        fullCtx.clearRect(0, 0, fullCanvas.width, fullCanvas.height);
        fullStars.forEach((star) => {
          fullCtx.beginPath();
          fullCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          fullCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          fullCtx.fill();
          if (frameCount % 5 === 0) {
            star.alpha += Math.random() * 0.05 - 0.025;
            star.alpha = Math.max(0.5, Math.min(1, star.alpha));
          }
        });
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

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
      window.removeEventListener('resize', resizeSideCanvas);
      window.removeEventListener('resize', resizeFullCanvas);
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

  const sectionImages = {
    landing: 'your-landing-image-id',
    why: 'your-why-image-id',
    vision: 'your-vision-image-id',
    plan: 'your-plan-image-id',
  };

  return (
    <div className="app">
      <canvas ref={fullCanvasRef} className="full-starry-background" />
      <canvas ref={canvasRef} className="starry-background" />
      <div className="rotating-text-background">Revive America</div>

      <div className="hero-slogan">
        <span>“Liberty Starts Here.”</span>
      </div>

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
        <nav className="section-nav">
          <a href="#landing-section" title="The Call"></a>
          <a href="#why-i-am-section" title="Why We Fight"></a>
          <a href="#vision-section" title="Our Vision"></a>
          <a href="#plan-section" title="How We Win"></a>
          <a href="#testimonials" title="Voices"></a>
        </nav>
      </header>

      <section id="landing-section" className="landing-section">
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.landing}`}
            alt="Landing"
          />
        </div>
        <div className="section-content">
          <h2 className="landing-title">The Call to Revive</h2>
          <div className="landing-text">
            <p><strong>A Personal Call:</strong> Dear Fellow American, I am a child of this land, raised where neighbors were family, and we lived the promise of “Life, Liberty, and the pursuit of Happiness” (Declaration of Independence, 1776).</p>
            <p><strong>The Fading Dream:</strong> Today, that dream fades under an Elite Ruling Class—<span className="stat">$4.7 trillion in taxes</span> (IRS 2023), <span className="stat">$68 billion seized</span> (IJ 2024), <span className="stat">10.5 million arrests</span> (FBI 2022).</p>
            <p><strong>Our Fight:</strong> Join us to revive the founders’ vision: a union of sovereign states and tribes, where liberty flows from individuals to communities, not distant elites.</p>
          </div>
          <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
          <button className="cta-btn" onClick={() => setShowPlan(true)}>Our Plan</button>
          <button className="cta-btn" onClick={handleDonate}>Support the Revival</button>
        </div>
      </section>

      <section id="why-i-am-section" className="why-i-am-section" ref={whyRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.why}`}
            alt="Why We Fight"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">Why We Fight</h2>
          <div className="section-text">
            <p><strong>Our Roots:</strong> Once, we thrived in tight-knit communities—farming, ranching, hunting together—guided by state and tribal sovereignty, not elite dictates.</p>
            <p><strong>The Struggle:</strong> Now, my hometown and countless others dim under a system that hoards <span className="stat">$44 trillion for the 1%</span> (Federal Reserve 2023), spends <span className="stat">$14.4 billion on elections</span> for millionaires (OpenSecrets 2023), and enforces control with <span className="stat">10.5 million arrests</span> (Vera 2022).</p>
            <p><strong>Our Legacy:</strong> History screams resistance: the Whiskey Rebellion (1794), Virginia and Kentucky’s Resolutions (1798), South Carolina’s Nullification (1832), and the Cherokee’s stand in Worcester v. Georgia (1832). We fight because <span className="stat">94% of us see this unfairness</span> (Gallup 2024).</p>
          </div>
        </div>
      </section>

      <section id="vision-section" className="vision-section" ref={visionRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.vision}`}
            alt="Our Vision"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">Our Vision</h2>
          <div className="section-text">
            <p><strong>By 2040:</strong> 50 states and 574 tribes will break free—nullifying <span className="stat">$4.7 trillion in taxes</span> (IRS 2023), <span className="stat">$1.207 trillion in health overreach</span> (Statista 2025), and <span className="stat">$68 billion in forfeiture</span> (IJ 2024).</p>
            <p><strong>Defenders:</strong> Over 60 sheriffs and tribal leaders will train 30,000-60,000 defenders, echoing the Whiskey Rebellion and Texas border guards (2023-2025).</p>
            <p><strong>Freedom:</strong> 35+ states and tribes shift to sales taxes or gaming, with <span className="stat">40-60 lawsuits</span> and a Constitutional amendment banning elite influence.</p>
          </div>
        </div>
      </section>

      <section id="plan-section" className="plan-section" ref={planRef}>
        <div className="section-image">
          <img
            src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_fill,w_300,h_400,g_auto/${sectionImages.plan}`}
            alt="How We Win"
          />
        </div>
        <div className="section-content">
          <h2 className="section-title">How We Win</h2>
          <div className="section-text">
            <p><strong>Phase 1 (2025-2030):</strong> Launch with rallies in 50 state capitals and tribal lands (<span className="stat">50,000 attendees</span>), pass sovereignty laws, empower 60+ sheriffs with <span className="stat">2,000+ militia units</span>, and establish <span className="stat">2,500+ juries</span>.</p>
            <p><strong>Phase 2 (2031-2040):</strong> Call a convention with 34 states and 50 tribes by 2032, win <span className="stat">45 lawsuits ($500M+)</span>, and ratify amendments by 2040.</p>
            <p><strong>Our Power:</strong> With <span className="stat">$525-725M</span>, we’ll unite the <span className="stat">94%</span> who see the unfairness (Gallup 2024).</p>
          </div>
          <button className="cta-btn pulse-btn" onClick={handleDonate}>Donate Now</button>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2 className="section-title">Voices of Revival</h2>
        <div className="testimonial-text">
          <p>“This is our chance to take back what’s ours.” — John, Texas</p>
          <p>“A movement for the people, by the people.” — Sarah, Montana</p>
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
        <p className="footer-text">© 2025 Revive America. All rights reserved.</p>
        <p className="contact-text">
          <a href="mailto:info@reviveamerica.info">Contact: info@reviveamerica.info</a>
        </p>
        <div className="social-links">
          <a href="https://x.com/ReviveAmerica" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </footer>

      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </div>
  );
}

export default App;