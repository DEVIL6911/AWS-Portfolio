import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useScrollRevealGroup(count, threshold = 0.12) {
  const refs = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      refs.current.forEach((el) => el?.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    refs.current.forEach((el, i) => {
      if (el) {
        el.style.transitionDelay = `${i * 0.08}s`;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [count, threshold]);

  return (index) => (el) => {
    refs.current[index] = el;
  };
}
