import { useState, useEffect } from "react";

export const useScroll = (scrollRef) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;

    let rafId = null;
    const handleScroll = () => {
      // throttle updates with requestAnimationFrame
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsScrolled(el.scrollTop > 10);
        rafId = null;
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    // sync initial state immediately (so header responds if already scrolled)
    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [scrollRef?.current]); // re-run when the real DOM node attaches

  return isScrolled;
};
