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
  const [testimonials, setTestimonials] = useState([]);
  const [isDonating, setIsDonating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sloganText, setSloganText] = useState('');
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const whyRef = useRef(null);
  const visionRef = useRef(null);
  const planRef = useRef(null);

  const fullSlogan = '“Liberty Starts Here.”';

  useEffect(() => {
    // Cosmos Animation
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
    const starCount = isMobile ? 150 : 300;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.05 + 0.02,
      depth: Math.random(),
    }));

    let animationFrameId;
    let frameCount = 0;

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star, i) => {
          const scrollOffset = window.scrollY * star.depth * 0.1;
          const yPos = star.y - scrollOffset;

          ctx.beginPath();
          ctx.arc(star.x, yPos, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();

          stars.slice(i + 1).forEach((other) => {
            const dist = Math.hypot(star.x - other.x, yPos - other.y);
            if (dist < 50) {
              ctx.beginPath();
              ctx.moveTo(star.x, yPos);
              ctx.lineTo(other.x, other.y - scrollOffset);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * star.alpha})`;
              ctx.stroke();
            }
          });

          if (frameCount % 10 === 0) {
            star.alpha += Math.random() * 0.1 - 0.05;
            star.alpha = Math.max(0.3, Math.min(1, star.alpha));
            star.x += star.speed * (Math.random() - 0.5);
            star.y += star.speed;
            if (star.y > canvas.height) star.y = 0;
            if (star.x < 0 || star.x > canvas.width) star.x = Math.random() * canvas.width;
          }
        });
      }
      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    // Title Animation
    const title = titleRef.current;
    if (title) {
      const letters = "Revive America"
        .split('')
        .map((char) => `<span class="letter">${char}</span>`)
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }

    // Section Animations
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

    // Full Text Animation
    gsap.from('.full-text', {
      duration: 0.5,
      opacity: 0,
      y: 20,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.full-text' },
    });

    // Slogan Typewriter
    let i = 0;
    const type = () => {
      if (i < fullSlogan.length) {
        setSloganText(fullSlogan.slice(0, i + 1));
        i++;
        setTimeout(type, 100);
      }
    };
    type();

    // Scroll Progress
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch Testimonials
    axios.get('/.netlify/functions/getTestimonials')
      .then((res) => {
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
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [showCallText, showWhyText, showVisionText, showPlanText, showDonorText]);

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
    plan: 'your-plan-image-id', // Replace with a valid Cloudinary ID
  };

  return (
    <div className="app">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      <canvas ref={canvasRef} className="full-starry-background" />
      <div className="rotating-text-background">Revive America</div>

      <div className="hero-slogan">
        <span>{sloganText}</span>
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
        <LazyLoad height={300} offset={200}>
          <section id="landing-section" className="landing-section">
            <div className="section-image">
              <img
                src={`https://res.cloudinary.com/dhohkn6wl/image/upload/c_scale,w_${window.innerWidth <= 768 ? 300 : 600},f_auto,q_auto/${sectionImages.landing}`}
                alt="The Call"
              />
            </div>
            <div className="section-content">
              <h2 className="landing-title">The Call to Action</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowCallText(!showCallText)}>
                {showCallText ? 'Hide The Call' : 'Read The Call'}
              </button>
              <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
              <button className="cta-btn" onClick={handleDonate} disabled={isDonating}>
                {isDonating ? 'Opening...' : 'Support the Revival'}
              </button>
              <div className="landing-text">
                <p>
                  A heartfelt plea from one of us: the American Dream—built on community and liberty—is slipping away under elite control. With <span className="stat">$4.7 trillion in taxes</span> (IRS 2023) and <span className="stat">94% seeing unfairness</span> (Gallup 2024), it’s time to reclaim our founders’ vision by <span className="stat">2040</span>.
                </p>
              </div>
              {showCallText && (
                <div className="full-text">
                  <h3>Dear Fellow American,</h3>
                  <p>
                    I am a child of this land we call the United States, raised in a small agricultural community where neighbors were family. We farmed, ranched, and hunted together, relying on each other through hard times. Money was scarce, but we had abundance in community and joy in the pursuit of happiness; that was our American Dream, the promise etched in our founders’ words: “We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights; Life, Liberty, and the pursuit of Happiness” (Declaration of Independence, 1776). A decade later, they reinforced this in the Constitution’s preamble: “We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.”
                  </p>
                  <p>
                    I remember a time when we lived these ideals; where hard work and mutual support defined us, guided by the sovereignty of our states and the enduring self-governance of Native tribes, not the dictates of distant elites. But today, I see that dream fading. My hometown, like so many others across this nation of settler communities and tribal lands alike, struggles in isolation, its spirit dimmed by an Elite Ruling Class—politicians, corporate leaders, bureaucrats, and their allies—who have turned federal and state systems into tools of control. The evidence is undeniable: <span className="stat">$4.7 trillion in annual taxes</span> (IRS 2023), <span className="stat">$68 billion seized through civil asset forfeiture since 2000</span> (Institute for Justice 2024), and <span className="stat">10.5 million arrests</span> (FBI 2022) reflect a system that serves the few over the many. This isn’t the America our founders envisioned: a union of sovereign states and tribes, each a guardian of liberty, balancing local will with collective strength.
                  </p>
                  <p>
                    Worse still, asserting state or tribal sovereignty—or defending unalienable rights—has been met with suspicion. For years, the federal government, through its Justice Department, has labeled such advocates as “enemies of the state” or “domestic terrorists,” branding them with terms like “sovereign citizen.” This is not new; it’s a pattern woven through our history: In <span className="stat">1794</span>, the Whiskey Rebellion saw Pennsylvania farmers crushed by federal troops for resisting an oppressive tax, their state’s pleas ignored. In <span className="stat">1798</span>, the Alien and Sedition Acts jailed critics and immigrants, prompting Virginia and Kentucky to issue Resolutions asserting state authority to defy unconstitutional laws. In <span className="stat">1832</span>, South Carolina’s Nullification Crisis challenged federal tariffs favoring northern elites, facing threats of force. In <span className="stat">1832</span>, the Cherokee Nation’s sovereignty was upheld in Worcester v. Georgia, only for federal power to orchestrate the Trail of Tears (1838), displacing thousands. In <span className="stat">1854</span>, Wisconsin defied the Fugitive Slave Act, nullifying federal overreach to protect liberty.
                  </p>
                  <p>
                    These moments prove the urgency of our revival—a revival rooted in the dual pillars of state and tribal sovereignty, as the Anti-Federalists warned in <span className="stat">1787-1788</span> against centralized power eroding local control, and as tribes have defended their inherent rights for centuries. We define sovereignty not as rebellion, but as the founders’ gift of self-governance bestowed upon individuals, states, and tribes by our Creator (Genesis 1:27) and defended by thinkers like John Locke (1689).
                  </p>
                  <p>
                    This is not a tale of defeat—it’s a call to revive what we’ve lost. In <span className="stat">1776</span>, our forefathers resisted tyranny; in <span className="stat">1794, 1798, 1832, and 1854</span>, states defied unjust edicts; in <span className="stat">1832</span> and beyond, tribes fought for their sovereignty; in <span className="stat">1787</span>, they built a union to protect our freedoms through sovereign states and tribal nations. Today, we can restore their vision, breathing new life into the bonds that once made us strong. I’ve spent over <span className="stat">30 years</span> studying this nation’s path, and I’m convinced that the <span className="stat">94% of us who see this unfairness</span> (Gallup 2024)—settlers and Natives alike—can turn frustration into action. This revival unites us: rural and urban, state citizens and tribal members, through states and tribes as our bulwarks against a system that fears our voice. Join me in this journey to revive America by <span className="stat">2040</span>, and read on to see how we’ll restore our sovereign legacy together.
                  </p>
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={300} offset={200}>
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
                <p>
                  The Elite Ruling Class hoards <span className="stat">$44 trillion</span> (Federal Reserve 2023) in a <span className="stat">9.8/10 oligarchy</span> (March 2025), crushing communities with <span className="stat">$4.7 trillion in taxes</span> (IRS 2023) and <span className="stat">10.5 million arrests</span> (FBI 2022). We fight to reclaim state and tribal sovereignty.
                </p>
              </div>
              {showWhyText && (
                <div className="full-text">
                  <h3>Elite Consolidation Threatens Our Communities</h3>
                  <p>
                    The Elite Ruling Class—politicians, corporate tycoons, and bureaucratic enforcers—has engineered a near-certain plenary oligarchy, with a plausibility score of <span className="stat">9.8 out of 10</span> when considering both federal and state mechanisms (March 2025 analyses). This isn’t mere opinion; it’s a conclusion drawn from verified data that reveals how deeply their control threatens the communities I grew up in, the state sovereignty that once protected us, and the tribal sovereignty that has endured despite relentless federal encroachment. History shows this pattern repeating—elites consolidating power, only to face resistance from states and tribes determined to revive their rights. Let’s examine the evidence:
                  </p>
                  <h4>Wealth Concentration</h4>
                  <p>
                    The top <span className="stat">1%</span> now holds <span className="stat">$44 trillion</span>, or <span className="stat">32% of America’s wealth</span> (Federal Reserve 2023), a disparity turbocharged by federal policies like the <span className="stat">$1.9 trillion in tax cuts</span> from the 2017 Tax Cuts and Jobs Act (<span className="stat">83% to the 1%</span>, Tax Policy Center) and state-level giveaways totaling <span className="stat">$80 billion annually</span> (Good Jobs First 2023). Texas handed Tesla <span className="stat">$64 million</span> in 2022 while Elon Musk’s fortune swelled to <span className="stat">$250 billion</span>, and state lotteries (<span className="stat">$91 billion revenue</span>, NASPL 2022) exploit the poor—just as colonial planters (Virginia, 1700s) hoarded tobacco wealth, the Whiskey Rebellion’s farmers (<span className="stat">1794</span>) were taxed into submission by a federal elite overriding state pleas, <span className="stat">1832</span>’s Nullification Crisis saw tariffs enrich northern industrialists at southern states’ expense, and federal policies stripped tribes of <span className="stat">1.3 million acres</span> (1953-1975) to benefit corporate interests.
                  </p>
                  <h4>Political Power</h4>
                  <p>
                    Federal elections cost <span className="stat">$14.4 billion</span> (OpenSecrets 2023), with <span className="stat">50% of Congress</span> being millionaires (Center for Responsive Politics), while state legislatures—<span className="stat">40% millionaires</span> (Ballotpedia 2022)—lock in <span className="stat">90% of seats</span> through gerrymandering (Cook Report 2022). Voter ID laws in <span className="stat">14 states</span> disenfranchise <span className="stat">3 million</span> (Brennan Center 2023), and <span className="stat">$1.6 billion in state lobbying</span> (FollowTheMoney.org 2022) ensures elite agendas prevail. This mirrors the Alien and Sedition Acts (<span className="stat">1798</span>), when federal elites silenced dissent and Virginia and Kentucky responded with state sovereignty resolutions, and the Anti-Federalists’ <span className="stat">1787</span> warnings of a Congress usurping state and tribal authority—prophecies fulfilled as tribes face federal overrides despite treaties like Fort Laramie (1868).
                  </p>
                  <h4>Legal Control</h4>
                  <p>
                    Federal courts, with <span className="stat">80% of judges millionaires</span> (Fix the Court), and state supreme courts, with <span className="stat">70%</span> (National Judicial College 2023), favor the elite—e.g., Texas upheld <span className="stat">$2 billion in oil tax breaks</span> in 2022. Enforcement backs this: <span className="stat">10.5 million federal arrests</span> (Vera 2022) and <span className="stat">2.1 million state incarcerations</span> (Bureau of Justice Statistics 2023) prop up a <span className="stat">$7.4 billion private prison industry</span> (IBISWorld 2023). State preemption laws in <span className="stat">30 states</span> block local minimum wages (EPI 2023)—akin to <span className="stat">1854</span>, when Wisconsin nullified the Fugitive Slave Act, <span className="stat">1832</span>, when the Cherokee won in Worcester v. Georgia only to face federal betrayal, and <span className="stat">1794</span>, when federal troops crushed Pennsylvania’s state-led resistance.
                  </p>
                  <h4>Profit-Driven Vanity</h4>
                  <p>
                    The federal Military-Industrial Complex consumes <span className="stat">$895 billion annually</span> (<span className="stat">$447 billion to contractors</span>, 2023), while state prison contracts (<span className="stat">$7.4 billion</span>) and corporate tax breaks (<span className="stat">$80 billion</span>) glorify CEOs like CoreCivic’s Damon Hininger (<span className="stat">$4 million salary</span>). State lotteries and <span className="stat">$2 billion bail bonds</span> (IBISWorld 2023) profit off desperation—just as Gilded Age tycoons flaunted wealth, <span className="stat">1832</span>’s tariff battles enriched northern elites at state expense, and federal policies post-<span className="stat">1832</span> exploited tribal lands for profit, ignoring their sovereignty.
                  </p>
                  <p>
                    This dual federal-state engine—<span className="stat">$4 trillion IRS revenue</span>, <span className="stat">$13 trillion in bailouts</span> (GAO 2008), <span className="stat">$895 billion MIC</span>, paired with <span className="stat">$80 billion state breaks</span> and <span className="stat">1 million Texas jailings</span> (TDCJ 2023)—is nearly absolute. It’s why my hometown struggles, why <span className="stat">574 tribes</span> fight for rights affirmed in treaties, and why our children face <span className="stat">$34 trillion in debt</span> (Fed 2024). From <span className="stat">1798</span>’s resolutions to Texas’s border security (<span className="stat">$4 billion</span>, 2023-2025) and tribal battles like Standing Rock (2016-2017), states and tribes have resisted—our revival unites their legacies.
                  </p>
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={300} offset={200}>
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
                <p>
                  By <span className="stat">2040</span>, <span className="stat">50+ states</span> and <span className="stat">574 tribes</span> will restore sovereignty, nullifying <span className="stat">$4.7 trillion in taxes</span> (IRS 2023) and forging a future with <span className="stat">90-95% probability</span>, rooted in history’s defiance.
                </p>
              </div>
              {showVisionText && (
                <div className="full-text">
                  <h3>A Revival of Sovereignty</h3>
                  <p>
                    We stand at a crossroads, but Reviving America offers a path forward: a peaceful, powerful restoration of sovereignty flowing from individuals (Genesis 1:27) to states, tribes, and communities, with states and tribes as twin vanguards. By <span className="stat">2040</span>, we aim to rebuild the founders’ vision of a union of sovereign states and tribes, drawing on centuries of their resistance. Here’s what we’re building:
                  </p>
                  <h4>State and Tribal Sovereignty</h4>
                  <p>
                    By <span className="stat">2027</span>, <span className="stat">50+ states</span> and <span className="stat">574 tribes</span> will nullify federal overreach, restoring control over <span className="stat">$4.7 trillion in taxes</span> (IRS 2023), health policies (<span className="stat">$1.207 trillion Pharma</span>, Statista 2025), education (<span className="stat">$79.6 billion DOE</span>, DOE.gov 2023), and property (<span className="stat">$68 billion forfeiture</span>, IJ 2024). This echoes Virginia and Kentucky’s <span className="stat">1798</span> Resolutions, South Carolina’s <span className="stat">1832</span> Nullification, Wisconsin’s <span className="stat">1854</span> defiance, Texas’s <span className="stat">2023-2025</span> border actions, and the Cherokee’s <span className="stat">1832</span> stand in Worcester v. Georgia—state and tribal sovereignty reborn, with <span className="stat">90-95% probability</span>.
                  </p>
                  <h4>Sheriffs and Defenders</h4>
                  <p>
                    By <span className="stat">2030</span>, <span className="stat">60+ sheriffs</span> trusted by <span className="stat">75-85%</span> (Gallup est. 2025) and tribal leaders will train <span className="stat">30,000-60,000 defenders</span> (<span className="stat">90-95% probability</span>). Like Whiskey Rebellion farmers (<span className="stat">1794</span>), Texas’s border guards (<span className="stat">2023-2025</span>), or tribal police enforcing sovereignty (e.g., Navajo Nation), these local forces revive state and tribal authority (<span className="stat">67% Second Amendment support</span>, YouGov 2023).
                  </p>
                  <h4>Grand Juries</h4>
                  <p>
                    By <span className="stat">2030</span>, <span className="stat">50+ states</span> and tribes will establish <span className="stat">2,500+ citizen juries</span> with interstate and intertribal power (<span className="stat">90-95% probability</span>), judging elite abuses like <span className="stat">$500,000+ annual state arrests</span> (FBI 2022). This mirrors <span className="stat">1798</span>’s jury acquittals, Wisconsin’s <span className="stat">1854</span> resistance, and tribal courts upholding self-rule post-<span className="stat">1975</span>’s Indian Self-Determination Act.
                  </p>
                  <h4>Economic Freedom</h4>
                  <p>
                    By <span className="stat">2029</span>, <span className="stat">35+ states</span> and tribal regions will shift to sales taxes or gaming compacts (<span className="stat">90-95% probability</span>), breaking free from federal revenue (<span className="stat">$4.7 trillion IRS</span>), reviving state and tribal economic sovereignty as <span className="stat">1832</span>’s nullifiers, <span className="stat">nine no-income-tax states</span> (Tax Foundation 2024), and tribes like the Seminole (gaming revenue, <span className="stat">$2.5 billion</span>, 2023) have done.
                  </p>
                  <h4>Legal Victories</h4>
                  <p>
                    By <span className="stat">2035</span>, <span className="stat">40-60 lawsuits</span> will recover over <span className="stat">$500 million</span> from the Elite Ruling Class (<span className="stat">85-95% probability</span>), with state and tribal enforcement reversing consolidation as the Montgomery Bus Boycott (<span className="stat">1955-1956</span>) and <span className="stat">1798</span>’s state defiance shifted power.
                  </p>
                  <h4>Constitutional Renewal</h4>
                  <p>
                    By <span className="stat">2040</span>, <span className="stat">38 states</span> and tribes will amend the Constitution (<span className="stat">87-95% probability</span>), engraving state and tribal sovereignty to banish elite influence, fulfilling the Anti-Federalists’ <span className="stat">1787</span> vision, <span className="stat">1787</span>’s pledge, and treaties like Fort Laramie (1868).
                  </p>
                  <p>
                    This vision makes states and tribes the backbone of revival—where sovereignty flows from individuals to tribes (Iroquois Confederacy, circa <span className="stat">1500</span>) and states (Mayflower Compact, <span className="stat">1620</span>), uniting us against tyranny. Tribal inclusion—tapping <span className="stat">90-95% rights support</span> (Pew est.)—aligns Land Back with state nullification, boosting appeal by <span className="stat">1%</span>. Tribes bring cultural richness (community stewardship) and governance models (e.g., <span className="stat">$35 billion tribal gaming industry</span>, NIGC 2023), enhancing our moral and practical strength.
                  </p>
                  <h3>Evidence and Support</h3>
                  <h4>Public Sentiment</h4>
                  <p>
                    <span className="stat">94% see unfairness</span> (Gallup 2024), <span className="stat">62% favor state power</span> (Gallup 2023), <span className="stat">80% support nullification</span> (Cato 2024), and <span className="stat">90-95% back tribal rights</span> (Pew est.)—<span className="stat">72% Republicans</span>, <span className="stat">45% Democrats</span> agree on overreach (Pew 2022)—poised for <span className="stat">96-99% turnout</span>, like Montgomery’s <span className="stat">90%+</span> (1955-1956).
                  </p>
                  <h4>Legal Precedents</h4>
                  <p>
                    West Virginia v. EPA (<span className="stat">2022</span>), Murphy v. NCAA (<span className="stat">2018</span>), Oklahoma v. Castro-Huerta (<span className="stat">2022</span>), and Worcester v. Georgia (<span className="stat">1832</span>) affirm state and tribal rights (<span className="stat">90-95% probability</span>). <span className="stat">Twenty-five states</span> resist gun laws (CSPOA 2024), <span className="stat">nine</span> avoid income tax, Texas spends <span className="stat">$4 billion</span> on borders (2023-2025), and tribes uphold self-rule via the <span className="stat">1975</span> Act.
                  </p>
                  <h4>Comparative Studies</h4>
                  <p>
                    States with fiscal autonomy grow faster (Mercatus), local rules outshine federal ones (NBER), and sheriffs/tribal police earn trust (Brookings)—supporting state-tribal revival (<span className="stat">90-95%</span>), as in <span className="stat">1832</span> and tribal gaming successes.
                  </p>
                  <h4>Historical Successes</h4>
                  <p>
                    Whiskey Rebellion (<span className="stat">1794</span>), Virginia and Kentucky Resolutions (<span className="stat">1798-1799</span>), Cherokee resistance (<span className="stat">1832</span>), Nullification Crisis (<span className="stat">1832</span>), Wisconsin’s stand (<span className="stat">1854</span>), and Montgomery Boycott (<span className="stat">1955-1956</span>) show state and tribal defiance unite. Our justice dimension (Micah 6:8) resonates with <span className="stat">70% believers</span> (Pew 2022) and <span className="stat">91% Founding pride</span> (Gallup 2023). From <span className="stat">1798</span> to Standing Rock, states and tribes have been liberty’s shield—our revival harnesses their power.
                  </p>
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={300} offset={200}>
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
                <p>
                  A <span className="stat">15-year roadmap</span> with <span className="stat">$525-725 million</span>: mobilize by <span className="stat">2030</span> with <span className="stat">2,500+ juries</span> and <span className="stat">2,000+ militia units</span>, win by <span className="stat">2040</span> with <span className="stat">38 states/tribes</span> amending the Constitution.
                </p>
              </div>
              {showPlanText && (
                <div className="full-text">
                  <h3>A 15-Year Roadmap</h3>
                  <p>
                    Here’s our state-and-tribal strategy to revive America by <span className="stat">2040</span>, in two phases with <span className="stat">$525-725 million</span> (expanded for tribal contributions):
                  </p>
                  <h4>Phase 1: Mobilization (March 2025 – December 2030)</h4>
                  <p>
                    <strong>Objectives:</strong> Pass sovereignty laws in <span className="stat">50+ states</span> and <span className="stat">574 tribes</span>, empower <span className="stat">60+ sheriffs</span> and tribal leaders with <span className="stat">2,000+ posse/militia units</span>, establish <span className="stat">2,500+ juries</span>, shift <span className="stat">35+ states</span> and tribes to sales taxes/gaming, secure <span className="stat">25 lawsuit wins</span> (<span className="stat">$200M+</span>).
                  </p>
                  <h5>Timeline and Actions:</h5>
                  <ul>
                    <li>
                      <strong>March-May 2025: Launch</strong> – Rallies in <span className="stat">50 state capitals</span> and tribal lands (<span className="stat">50,000 attendees</span>), draft State and Tribal Sovereignty Act and Sheriff and Tribal Defender Act in <span className="stat">25 states</span> and <span className="stat">50 tribes</span>, X/TikTok blitz (<span className="stat">80%+ engagement</span>), raise <span className="stat">$12 million</span> (<span className="stat">$5M crowdfunding</span> from <span className="stat">100,000 at $50</span>, <span className="stat">$5M rallies</span>, <span className="stat">$2M tribal orgs</span>)—like Whiskey Rebellion and Cherokee resistance.
                    </li>
                    <li>
                      <strong>June-December 2025: Groundwork</strong> – Pass laws in <span className="stat">25 states</span> and <span className="stat">50 tribes</span>, empower <span className="stat">30 sheriffs</span>, <span className="stat">10 tribal leaders</span>, and <span className="stat">50 posse/militia units</span>, establish <span className="stat">250 juries</span> probing Pharma (<span className="stat">$1.207T</span>), DOE (<span className="stat">$79.6B</span>), forfeiture (<span className="stat">$68B</span>), raise <span className="stat">$56.5 million</span> (<span className="stat">$25M crowdfunding</span>, <span className="stat">$15M state partnerships</span> at <span className="stat">$300K/state</span>, <span className="stat">$14.5M operations</span>, <span className="stat">$2M tribal funds</span>)—echoing <span className="stat">1798</span> Resolutions.
                    </li>
                    <li>
                      <strong>2026: Expansion</strong> – Laws in <span className="stat">50+ states</span> and <span className="stat">100 tribes</span>, <span className="stat">60+ sheriffs</span>, <span className="stat">20 tribal leaders</span>, <span className="stat">500 posse/militia units</span>, <span className="stat">750+ juries</span>, <span className="stat">500 rallies</span> (<span className="stat">250,000 attendees</span>), <span className="stat">$69.5 million</span> (<span className="stat">$25M crowdfunding</span>, <span className="stat">$25M major donors</span>, <span className="stat">$17.5M events/posse/militia</span>, <span className="stat">$2M tribal</span>)—as in <span className="stat">1832</span>’s defiance.
                    </li>
                    <li>
                      <strong>2027: Consolidation</strong> – Secure <span className="stat">50+ state</span> and <span className="stat">574 tribal nullifications</span>, maintain <span className="stat">60+ sheriffs</span>, <span className="stat">20 tribal leaders</span>, <span className="stat">750 posse/militia units</span>, <span className="stat">1,000 rallies</span> (<span className="stat">1 million attendees</span>), <span className="stat">$69.5 million</span> (<span className="stat">$30M crowdfunding</span>, <span className="stat">$15M state partnerships</span>, <span className="stat">$22.5M events/posse/militia</span>, <span className="stat">$2M tribal</span>)—like Texas <span className="stat">2023</span> and Standing Rock.
                    </li>
                    <li>
                      <strong>2028-2029: Economic Shift</strong> – Sales Tax and Tribal Gaming Freedom Act in <span className="stat">35 states</span> and tribes, <span className="stat">1,750 posse/militia units</span>, <span className="stat">1,750 juries</span>, <span className="stat">750 rallies</span> (<span className="stat">750,000 attendees</span>), <span className="stat">$98.25 million</span> (<span className="stat">$50M crowdfunding</span>, <span className="stat">$25M state partnerships</span>, <span className="stat">$21.25M events/posse/militia</span>, <span className="stat">$2M tribal</span>)—mirroring <span className="stat">1854</span> and <span className="stat">1975</span> Act.
                    </li>
                    <li>
                      <strong>2030: Legal Push</strong> – Grand Jury Act in <span className="stat">45+ states</span> and tribes, PAG Empowerment Act in <span className="stat">35 states/tribes</span> (<span className="stat">25 wins</span>, <span className="stat">$200M+</span>), <span className="stat">2,500+ juries</span>, <span className="stat">2,000+ posse/militia units</span>, <span className="stat">$89.5 million</span> (<span className="stat">$25M crowdfunding</span>, <span className="stat">$25M major donors</span>, <span className="stat">$25M events/posse/militia</span>, <span className="stat">$12.5M settlements</span>, <span className="stat">$2M tribal</span>)—reviving <span className="stat">1955</span>’s action.
                    </li>
                  </ul>
                  <p>
                    <strong>Resources:</strong> <span className="stat">$453-501 million</span>—<span className="stat">$225-325M crowdfunding</span> (<span className="stat">4.5-6.5M at $50</span>), <span className="stat">$75-125M events/merchandise</span>, <span className="stat">$50-75M state/tribal partnerships</span> (<span className="stat">$1-1.5M/state</span>, <span className="stat">$50K/tribe</span>), <span className="stat">$12.5M settlements</span>, <span className="stat">$10M tribal orgs</span>. <strong>Personnel:</strong> <span className="stat">750 organizers</span>, <span className="stat">5,000 deputies</span>, <span className="stat">500 tribal enforcers</span>, <span className="stat">12,500 jury volunteers</span>, <span className="stat">1,000 posse/militia trainers</span>, <span className="stat">75 digital staff</span>. <strong>Probability:</strong> <span className="stat">90-95%</span>, with tribal synergy.
                  </p>
                  <h4>Phase 2: Victory (January 2031 – December 2040)</h4>
                  <p>
                    <strong>Objectives:</strong> Convention call (<span className="stat">34 states</span> and <span className="stat">50 tribes</span> by <span className="stat">2032</span>), ratify amendments (<span className="stat">38 states</span> and tribes by <span className="stat">2040</span>), <span className="stat">45 lawsuit wins</span> (<span className="stat">$500M+</span>), <span className="stat">2,500+ posse/militia units</span>.
                  </p>
                  <h5>Timeline and Actions:</h5>
                  <ul>
                    <li>
                      <strong>2031-2032: Convention Call</strong> – Constitutional Amendment Call Act in <span className="stat">34 states</span> and <span className="stat">50 tribes</span>, <span className="stat">2,250 posse/militia units</span>, <span className="stat">500 rallies</span> (<span className="stat">500,000 attendees</span>), <span className="stat">$118 million</span> (<span className="stat">$50M crowdfunding</span>, <span className="stat">$25M major donors</span>, <span className="stat">$30M events/posse/militia</span>, <span className="stat">$10M state/tribal partnerships</span>, <span className="stat">$3M tribal</span>)—like <span className="stat">1832</span>’s push.
                    </li>
                    <li>
                      <strong>2033-2035: Legal Triumph</strong> – <span className="stat">45 PAG wins</span> (<span className="stat">$500M+</span>), <span className="stat">2,500+ juries</span>, <span className="stat">2,500+ posse/militia units</span>, <span className="stat">500 rallies</span> (<span className="stat">250,000 attendees</span>), <span className="stat">$105.5-130.5 million</span> (<span className="stat">$25M crowdfunding</span>, <span className="stat">$25M major donors</span>, <span className="stat">$27.5-52.5M events/posse/militia</span>, <span className="stat">$25M settlements</span>, <span className="stat">$3M tribal</span>)—echoing <span className="stat">1956</span>.
                    </li>
                    <li>
                      <strong>2036-2040: Ratification</strong> – Amendments in <span className="stat">38 states</span> and tribes, <span className="stat">2,500+ posse/militia units</span>, <span className="stat">1,000 rallies</span> (<span className="stat">1 million attendees</span>), <span className="stat">$128-285 million</span> (<span className="stat">$25-75M crowdfunding</span>, <span className="stat">$25-50M major donors</span>, <span className="stat">$25-85M events/posse/militia</span>, <span className="stat">$25-50M settlements</span>, <span className="stat">$3-5M tribal</span>)—fulfilling <span className="stat">1787</span> and treaties.
                    </li>
                  </ul>
                  <p>
                    <strong>Resources:</strong> <span className="stat">$351-534 million</span>—<span className="stat">$100-150M major donors</span> (<span className="stat">100-150 at $1M</span>), <span className="stat">$25-85M events/merchandise</span>, <span className="stat">$25-50M settlements</span>, <span className="stat">$11-14M tribal</span>. <strong>Personnel:</strong> <span className="stat">1,000 organizers</span>, <span className="stat">7,500 deputies</span>, <span className="stat">750 tribal enforcers</span>, <span className="stat">15,000 jury volunteers</span>, <span className="stat">1,500 posse/militia trainers</span>, <span className="stat">100 digital staff</span>. <strong>Probability:</strong> <span className="stat">87-95%</span> for amendments, <span className="stat">85-95%</span> for lawsuits.
                  </p>
                  <h4>Contingencies</h4>
                  <ul>
                    <li>
                      <strong>Funding Lag:</strong> Below <span className="stat">$400M</span> by <span className="stat">2030</span>, boost crowdfunding by <span className="stat">$20M</span> (<span className="stat">400,000 donors</span>).
                    </li>
                    <li>
                      <strong>Turnout Dip:</strong> Below <span className="stat">96%</span>, add <span className="stat">$37.5M</span> for <span className="stat">500 rallies</span> (<span className="stat">250,000 attendees</span>).
                    </li>
                    <li>
                      <strong>State/Tribal Shortfall:</strong> Fewer than <span className="stat">50 states/100 tribes</span> by <span className="stat">2027</span>, target <span className="stat">40/50</span> with <span className="stat">$10M campaigns</span>.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </section>
        </LazyLoad>

        <LazyLoad height={300} offset={200}>
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

        <LazyLoad height={300} offset={200}>
          <section id="donor-pitch" className="donor-pitch">
            <div className="section-content">
              <h2 className="section-title">Your Role in Revival</h2>
              <button className="cta-btn pulse-btn" onClick={() => setShowDonorText(!showDonorText)}>
                {showDonorText ? 'Hide Your Role' : 'Read Your Role'}
              </button>
              <div className="section-text">
                <p>
                  Counter an elite plundering <span className="stat">$4.7 trillion</span> (IRS 2023) and unite <span className="stat">50+ states</span> and <span className="stat">574 tribes</span>. Your <span className="stat">$525-725 million</span> fuels a <span className="stat">90-95% probable</span> revival—join us!
                </p>
              </div>
              {showDonorText && (
                <div className="full-text">
                  <p>
                    America is under siege—not from abroad, but from an Elite Ruling Class plundering <span className="stat">$4.7 trillion in taxes</span> (IRS 2023), seizing <span className="stat">$68 billion</span> (IJ 2024), and jailing <span className="stat">10.5 million</span> (FBI 2022)—all while <span className="stat">94% see unfairness</span> (Gallup 2024). This isn’t the state-and-tribal union of <span className="stat">1776, 1798, or 1832</span>. It’s time to revive it.
                  </p>
                  <p>
                    Reviving America unites states and tribes—Virginia <span className="stat">1798</span>, Cherokee <span className="stat">1832</span>, Texas <span className="stat">2025</span>:
                  </p>
                  <ul>
                    <li><span className="stat">50+ States, 574 Tribes Nullify:</span> Your rights, <span className="stat">90-95% probable</span>.</li>
                    <li><span className="stat">60+ Sheriffs/Tribal Leaders, 2,000+ Posse/Militia:</span> State/tribal defenders, <span className="stat">90-95% certain</span>.</li>
                    <li><span className="stat">2,500+ Juries:</span> State/tribal justice, <span className="stat">90-95% likely</span>.</li>
                    <li><span className="stat">35+ States/Tribes Shift Taxes/Gaming:</span> State/tribal control, <span className="stat">90-95% feasible</span>.</li>
                    <li><span className="stat">45 Lawsuit Wins:</span> <span className="stat">$500M+</span> from elites, <span className="stat">85-95% achievable</span>.</li>
                    <li><span className="stat">38 States/Tribes Amend:</span> Sovereignty forever, <span className="stat">87-95% within reach</span>.</li>
                  </ul>
                  <p>
                    Your <span className="stat">$525-725 million</span> fuels this—tribal funds add <span className="stat">$11-14M</span>:
                  </p>
                  <ul>
                    <li><span className="stat">$50:</span> Trains a state/tribal posse/militia member.</li>
                    <li><span className="stat">$100:</span> Funds a state/tribal jury.</li>
                    <li><span className="stat">$1,000:</span> Nullifies a law via state/tribal action.</li>
                    <li><span className="stat">$1 Million:</span> Secures a state/tribal win.</li>
                  </ul>
                  <p>
                    From <span className="stat">1832</span> to tribal gaming, states and tribes win with donors. Act at <a href="https://reviveamerica.org" target="_blank" rel="noopener noreferrer">reviveamerica.org</a>, join <span className="stat">March 2025</span> rallies, share <a href="https://x.com/hashtag/ReviveAmerica" target="_blank" rel="noopener noreferrer">#ReviveAmerica</a> on X (<span className="stat">80%+ engagement</span>).
                  </p>
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