import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(label, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power3.out'
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.7, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    const onMouseEnterTarget = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const labelText = target.getAttribute('data-cursor');
      const isMagnetic = target.hasAttribute('data-magnetic');

      if (labelText) {
        setCursorLabel(labelText);
        gsap.to(follower, { 
          scale: 4, 
          backgroundColor: 'rgba(74, 124, 89, 0.15)', 
          border: 'none',
          duration: 0.4,
          ease: 'back.out(1.7)'
        });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(follower, { 
          scale: 2.2, 
          backgroundColor: 'rgba(74, 124, 89, 0.1)', 
          border: '1px solid rgba(74, 124, 89, 0.3)',
          duration: 0.3 
        });
      }

      if (isMagnetic) {
        // Magnetic effect logic placeholder - removed unused variables to pass TSC
      }
    };

    const onMouseLeaveTarget = () => {
      setCursorLabel('');
      gsap.to(follower, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        border: '1px solid rgba(74, 124, 89, 0.5)',
        duration: 0.3 
      });
      gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Initial setup for existing targets
    const updateTargets = () => {
      const targets = document.querySelectorAll('a, button, [data-cursor], .interactive-target');
      targets.forEach(target => {
        target.addEventListener('mouseenter', onMouseEnterTarget);
        target.addEventListener('mouseleave', onMouseLeaveTarget);
      });
      return targets;
    };

    let targets = updateTargets();

    // Mutation Observer to handle dynamic content
    const observer = new MutationObserver(() => {
      // Remove old listeners to avoid duplicates
      targets.forEach(target => {
        target.removeEventListener('mouseenter', onMouseEnterTarget);
        target.removeEventListener('mouseleave', onMouseLeaveTarget);
      });
      targets = updateTargets();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('custom-cursor-active');
      targets.forEach(target => {
        target.removeEventListener('mouseenter', onMouseEnterTarget);
        target.removeEventListener('mouseleave', onMouseLeaveTarget);
      });
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#4a7c59] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 shadow-sm"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-[#4a7c59]/40 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-50 origin-center flex items-center justify-center pointer-events-none"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a7c59] whitespace-nowrap bg-white/80 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-[#4a7c59]/20">
          {cursorLabel}
        </span>
      </div>
    </>
  );
}
