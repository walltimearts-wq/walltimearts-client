import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/* Kept in this file to avoid changing Home's existing import path. The former
   WebGL sculpture is intentionally removed: this is an image-first scroll hero. */
const SLIDES = [
  {
    id: 0,
    tag: 'Wall Clock Collection',
    title: 'Time, <br /><span className="italic text-white/90 font-light">Designed Anew.</span>',
    description: 'From minimalist silhouettes to artistic masterpieces — our clocks transform every wall into a story.',
    image: 'https://m.media-amazon.com/images/I/61Z7cwC1cbL._AC_UF894,1000_QL80_.jpg',
    cta: { label: 'Shop Wall Clocks', to: '/products' },
  },
  {
    id: 1,
    tag: 'Minimalist Wall Clocks',
    title: 'Less Is <br /><span className="italic text-white/90 font-light">More.</span>',
    description: 'Clean lines, quiet presence — minimalism reimagined for the modern home.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaoeUmj2O5GnWbT9CY7CWr_vzrA7yYkuC_EFeO0h9bFwNzLvXwSG16nME&s=10',
    cta: { label: 'Explore Minimalist', to: '/products?category=Simple%20Wall%20Clock' },
  },
  {
    id: 2,
    tag: 'Artistic Wall Clocks',
    title: 'Art You <br /><span className="italic text-white/90 font-light">Can Measure.</span>',
    description: 'Gallery-worthy designs that turn every tick into a masterpiece.',
    image: 'https://img5.su-cdn.com/cdn-cgi/image/width=750,height=750/mall/file/2023/09/28/b04c79bce30fd49be344c5e79fb53d26.jpg',
    cta: { label: 'View Artistic', to: '/products?category=Aesthetic%20Wall%20Clock' },
  },
];

interface ScrollHeroSliderProps {
  slides: typeof SLIDES;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** A pinned hero that advances exactly one full image per viewport of scrolling. */
const ScrollHeroSlider: React.FC<ScrollHeroSliderProps> = ({ slides }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const slideCount = Math.max(slides.length, 1);

  useEffect(() => {
    let frame: number | undefined;
    const updateProgress = () => {
      frame = undefined;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const availableScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / availableScroll, 0, 1);
      const nextIndex = Math.min(slideCount - 1, Math.round(nextProgress * (slideCount - 1)));
      setProgress(nextProgress);
      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    };
    const onScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateProgress();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [slideCount]);

  /** Jump to a specific slide via its scroll position */
  const scrollToSlide = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const availableScroll = Math.max(section.offsetHeight - window.innerHeight, 1);
    const target = section.offsetTop + (slideCount > 1 ? (index / (slideCount - 1)) * availableScroll : 0);
    window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  if (!slides.length) return null;
  const activeSlide = slides[activeIndex];
  const imageScale = 1.08 - ((progress * (slideCount - 1)) % 1) * 0.035;

  return (
    <section ref={sectionRef} className="relative bg-[#10110f]" style={{ height: String(slideCount * 100) + 'vh' }} aria-label="Featured collections">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div key={activeSlide.id} className="absolute inset-0" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }} transition={{ duration: reduceMotion ? 0.15 : 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <img src={activeSlide.image} alt="" className="h-full w-full object-cover" style={{ transform: 'scale(' + imageScale + ')' }} draggable={false} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,11,9,.76)_0%,rgba(9,11,9,.42)_50%,rgba(9,11,9,.22)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,11,9,.55)_0%,transparent_45%)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-20 sm:items-center sm:pb-0 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div key={activeSlide.id} className="max-w-2xl text-white" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0.15 : 0.55, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-xs">{activeSlide.tag}</p>
              <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl" dangerouslySetInnerHTML={{ __html: activeSlide.title }} />
              <p className="mb-9 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{activeSlide.description}</p>
              <Link to={activeSlide.cta.to} className="group inline-flex items-center gap-3 bg-white px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors duration-300 hover:bg-sage hover:text-white">
                {activeSlide.cta.label}<span className="text-base transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-6 top-8 z-20 flex items-center gap-3 text-[10px] font-semibold tracking-[0.18em] text-white/75 sm:right-10 sm:top-10">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span><span className="h-px w-10 bg-white/35" /><span>{String(slideCount).padStart(2, '0')}</span>
        </div>
        <div className="absolute bottom-8 left-6 z-20 flex gap-2.5 sm:bottom-10 sm:left-10 sm:gap-3" aria-label={'Slide ' + (activeIndex + 1) + ' of ' + slideCount}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => scrollToSlide(index)}
              aria-label={'Go to slide ' + (index + 1)}
              aria-current={index === activeIndex}
              className={'rounded-full transition-all duration-500 cursor-pointer ' + (index === activeIndex
                ? 'h-3 w-14 sm:h-3.5 sm:w-20 bg-white shadow-[0_0_14px_rgba(255,255,255,0.55)]'
                : 'h-3 w-6 sm:h-3.5 sm:w-9 bg-white/40 hover:bg-white/70')}
            />
          ))}
        </div>
        <p className="absolute bottom-8 right-6 z-20 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65 sm:block sm:bottom-10 sm:right-10">Scroll to explore</p>
      </div>
    </section>
  );
};

export { ScrollHeroSlider, SLIDES };
