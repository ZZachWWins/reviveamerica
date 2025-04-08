import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyLoad from 'react-lazyload';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showMission, setShowMission] = useState(false);
  const [showCallText, setShowCallText] = useState(false);
  const [showWhyText, setShowWhyText] = useState(false);
  const [showVisionText, setShowVisionText] = useState(false);
  const [showPlanText, setShowPlanText] = useState(false);
  const [showDonorText, setShowDonorText] = useState(false);
  const [error, setError] = useState('');
  const [testimonials, setTestimonials] = useState([]); // Initial empty array
  const [isDonating, setIsDonating] = useState(false);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const whyRef = useRef(null);
  const visionRef = useRef(null);
  const planRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 100 : 150;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    let animationFrameId;
    let frameCount = 0;

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
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

    // Fetch testimonials with safeguards
    axios.get('/.netlify/functions/getTestimonials')
      .then((res) => {
        // Ensure res.data is an array, fallback to empty array if not
        const data = Array.isArray(res.data) ? res.data : [];
        setTestimonials(data);
      })
      .catch((err) => {
        console.error('Testimonials fetch failed:', err);
        setTestimonials([
          { text: "This is our chance to take back what’s ours.", author: "John", location: "Texas" },
          { text: "A movement for the people, by the people.", author: "Sarah", location: "Montana" },
        ]);
      });

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
      setError('');
    } catch (err) {
      setError('Login failed—check your credentials!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/signup', { username: signupUsername, password: signupPassword });
      setError('');
      setSignupUsername('');
      setSignupPassword('');
      setActiveTab('login');
    } catch (err) {
      setError('Signup failed—username might be taken!');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/.netlify/functions/logout');
      setUser(null);
    } catch (err) {
      setError('Logout failed—try again!');
    }
  };

  const handleDonate = () => {
    setIsDonating(true);
    window.open('https://reviveamerica.info/donate', '_blank');
    setTimeout(() => setIsDonating(false), 1000);
  };

  const sectionImages = {
    landing: 'zigrdlmx6xmytcjwakmv',
    why: 'flre65fsephps2ylu6ed',
    vision: 'ggouo80ldyqfveik39g5',
    plan: 'your-plan-image-id', // Replace with a valid ID
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="full-starry-background" />
      <div className="rotating-text-background">Revive America</div>

      <div className="hero-slogan">
        <span>“Liberty Starts Here.”</span>
      </div>

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
        <nav className="section-nav">
          <a href="#landing-section" title="The Call" aria-label="The Call"></a>
          <a href="#why-i-am-section" title="Why We Fight" aria-label="Why We Fight"></a>
          <a href="#vision-section" title="Our Vision" aria-label="Our Vision"></a>
          <a href="#plan-section" title="How We Win" aria-label="How We Win"></a>
          <a href="#testimonials" title="Voices" aria-label="Voices"></a>
          <a href="#donor-pitch" title="Your Role" aria-label="Your Role"></a>
        </nav>
      </header>

      <main>
        <LazyLoad height={200} offset={100}>
          <section id="landing-section" className="landing-section">
            <div className="section-image">
              <img
                src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_${window.innerWidth <= 768 ? 300 : 600},f_auto,q_auto/${sectionImages.landing}`}
                alt="Landing"
              />
            </div>
            <div className="section-content">
              <h2 className="landing-title">Part 1: The Call</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowCallText(!showCallText)}>
                {showCallText ? 'Hide The Call' : 'Read The Call'}
              </button>
              <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
              <button className="cta-btn" onClick={handleDonate} disabled={isDonating}>
                {isDonating ? 'Opening...' : 'Support the Revival'}
              </button>
              <div className="landing-text">
                <p>A personal plea from a child of this land: our American Dream—rooted in community and liberty—is fading under elite control. With <span className="stat">$4.7 trillion in taxes</span> (<a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">IRS 2023</a>) and <span className="stat">94% of us seeing unfairness</span> (<a href="https://www.gallup.com" target="_blank" rel="noopener noreferrer">Gallup 2024</a>), it’s time to revive the founders’ vision by <span className="stat">2040</span>.</p>
              </div>
              {showCallText && (
                <div className="full-text">
                  <h3>Dear Fellow American,</h3>
                  <p>I am a child of this land we call the United States, raised in a small agricultural community where neighbors were family. We farmed, ranched, and hunted together, relying on each other through hard times. Money was scarce, but we had abundance in community and joy in the pursuit of happiness; that was our American Dream, the promise etched in our founders’ words: “We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights; Life, Liberty, and the pursuit of Happiness” (Declaration of Independence, 1776). A decade later, they reinforced this in the Constitution’s preamble: “We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.”</p>
                  {/* ... rest of your content ... */}
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={200} offset={100}>
          <section id="why-i-am-section" className="why-i-am-section" ref={whyRef}>
            <div className="section-image">
              <img
                src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_${window.innerWidth <= 768 ? 300 : 600},f_auto,q_auto/${sectionImages.why}`}
                alt="Why We Fight"
              />
            </div>
            <div className="section-content">
              <h2 className="section-title">Part 1: Why We Fight</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowWhyText(!showWhyText)}>
                {showWhyText ? 'Hide Why We Fight' : 'Read Why We Fight'}
              </button>
              <div className="section-text">
                <p>The Elite Ruling Class hoards <span className="stat">$44 trillion</span> (<a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer">Federal Reserve 2023</a>) while states and tribes resist a <span className="stat">9.8/10</span> oligarchy (March 2025). From <span className="stat">1794</span>’s Whiskey Rebellion to today, we fight for our communities.</p>
              </div>
              {showWhyText && (
                <div className="full-text">
                  <h3>Elite Consolidation Threatens Our Communities</h3>
                  {/* ... rest of your content ... */}
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={200} offset={100}>
          <section id="vision-section" className="vision-section" ref={visionRef}>
            <div className="section-image">
              <img
                src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_${window.innerWidth <= 768 ? 300 : 600},f_auto,q_auto/${sectionImages.vision}`}
                alt="Our Vision"
              />
            </div>
            <div className="section-content">
              <h2 className="section-title">Part 2: The Vision</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowVisionText(!showVisionText)}>
                {showVisionText ? 'Hide Our Vision' : 'Read Our Vision'}
              </button>
              <div className="section-text">
                <p>By <span className="stat">2040</span>, <span className="stat">50+ states</span> and <span className="stat">574 tribes</span> will restore sovereignty, nullifying <span className="stat">$4.7 trillion in taxes</span> (<a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">IRS 2023</a>) and building a future with <span className="stat">90-95% probability</span>.</p>
              </div>
              {showVisionText && (
                <div className="full-text">
                  <h3>A Revival of Sovereignty</h3>
                  {/* ... rest of your content ... */}
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={200} offset={100}>
          <section id="plan-section" className="plan-section" ref={planRef}>
            <div className="section-image">
              <img
                src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_${window.innerWidth <= 768 ? 300 : 600},f_auto,q_auto/${sectionImages.plan}`}
                alt="How We Win"
              />
            </div>
            <div className="section-content">
              <h2 className="section-title">Part 3: The Plan</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowPlanText(!showPlanText)}>
                {showPlanText ? 'Hide How We Win' : 'Read How We Win'}
              </button>
              <button className="cta-btn" onClick={handleDonate} disabled={isDonating}>
                {isDonating ? 'Opening...' : 'Donate Now'}
              </button>
              <div className="section-text">
                <p>A <span className="stat">15-year roadmap</span> with <span className="stat">$525-725 million</span>: mobilize by <span className="stat">2030</span> with <span className="stat">2,500+ juries</span>, win by <span className="stat">2040</span> with <span className="stat">38 states/tribes</span> amending the Constitution.</p>
              </div>
              {showPlanText && (
                <div className="full-text">
                  <h3>A 15-Year Roadmap</h3>
                  {/* ... rest of your content ... */}
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={200} offset={100}>
          <section id="testimonials" className="testimonials">
            <h2 className="section-title">Voices of Revival</h2>
            <div className="testimonial-text">
              {Array.isArray(testimonials) && testimonials.length > 0 ? (
                testimonials.map((t, i) => (
                  <p key={i}>“{t.text}” — {t.author}, {t.location}</p>
                ))
              ) : (
                <p>No testimonials available yet.</p>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={200} offset={100}>
          <section id="donor-pitch" className="donor-pitch">
            <div className="section-content">
              <h2 className="section-title">Your Role in Revival</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowDonorText(!showDonorText)}>
                {showDonorText ? 'Hide Your Role' : 'Read Your Role'}
              </button>
              <div className="section-text">
                <p>Join us to counter an elite controlling <span className="stat">$4.7 trillion</span> (<a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">IRS 2023</a>) and unite <span className="stat">50+ states</span> and <span className="stat">574 tribes</span>. Your support fuels a <span className="stat">90-95% probable</span> revival.</p>
              </div>
              {showDonorText && (
                <div className="full-text">
                  <p>America is under siege—not from abroad, but from an Elite Ruling Class controlling <span className="stat">$4.7 trillion in taxes</span> (<a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">IRS 2023</a>), seizing <span className="stat">$68 billion</span> (<a href="https://ij.org" target="_blank" rel="noopener noreferrer">IJ 2024</a>), and jailing <span className="stat">10.5 million</span> (<a href="https://www.fbi.gov" target="_blank" rel="noopener noreferrer">FBI 2022</a>)—all while <span className="stat">94% see unfairness</span> (<a href="https://www.gallup.com" target="_blank" rel="noopener noreferrer">Gallup 2024</a>). This isn’t the state-and-tribal union of <span className="stat">1776</span>, <span className="stat">1798</span>, or <span className="stat">1832</span>. It’s time to revive it.</p>
                  {/* ... rest of your content ... */}
                </div>
              )}
            </div>
          </section>
        </LazyLoad>
      </main>

      {showAuth && (
        <div className="auth-modal" role="dialog" aria-labelledby="auth-title">
          <div className="auth-content">
            <h2 id="auth-title" className="auth-title">Join the Revival</h2>
            {error && <p className="error-message">{error}</p>}
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
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required aria-label="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required aria-label="Password" />
                <button type="submit" className="submit-btn">Login</button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="auth-form">
                <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} placeholder="Choose Username" required aria-label="Choose Username" />
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Choose Password" required aria-label="Choose Password" />
                <button type="submit" className="submit-btn">Signup</button>
              </form>
            )}
            <button className="close-btn" onClick={() => setShowAuth(false)} aria-label="Close">Close</button>
          </div>
        </div>
      )}

      {showMission && (
        <div className="history-modal" role="dialog" aria-labelledby="history-title">
          <div className="history-content">
            <h2 id="history-title" className="history-title">Our Mission</h2>
            <p className="history-text">
              Revive America restores sovereignty to individuals, states, and tribes, countering elite control and empowering communities to reclaim their rights by <span className="stat">2040</span>. Join us to rebuild the founders’ vision!
            </p>
            <button className="close-btn" onClick={() => setShowMission(false)} aria-label="Close">Close</button>
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
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://reviveamerica.info" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="mailto:?subject=Join Revive America&body=Check out https://reviveamerica.info" className="social-icon">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </footer>

      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to Top">
        ↑
      </button>
    </div>
  );
}

export default App;