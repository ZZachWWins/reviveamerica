import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ParallaxHeader.css';

const ParallaxHeader = ({ images, title }) => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current;
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 0,
        pin: true,
      },
    });

    const layers = [
      { selector: '.parallax-layer-1', yPercent: 70 },
      { selector: '.parallax-layer-2', yPercent: 55 },
      { selector: '.parallax-layer-3', yPercent: 40 },
      { selector: '.parallax-layer-4', yPercent: 10 },
    ];

    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(layerObj.selector),
        {
          yPercent: layerObj.yPercent,
          ease: 'none',
        },
        idx === 0 ? undefined : '<'
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="parallax-header" ref={parallaxRef}>
      <div className="parallax__visuals">
        <div className="parallax__black-line-overflow"></div>
        <div className="parallax__layers">
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="parallax-layer-img parallax-layer-1"
            loading="eager"
          />
          <img
            src={images[1].src}
            alt={images[1].alt}
            className="parallax-layer-img parallax-layer-2"
            loading="eager"
          />
          <div className="parallax-layer-3 parallax-layer-title">
            <h1 className="parallax-title">{title}</h1>
          </div>
          <img
            src={images[2].src}
            alt={images[2].alt}
            className="parallax-layer-img parallax-layer-4"
            loading="eager"
          />
        </div>
        <div className="parallax__fade"></div>
      </div>
    </div>
  );
};

export default ParallaxHeader;