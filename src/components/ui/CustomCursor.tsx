import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.7, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    const onMouseEnterLink = () => {
      gsap.to(follower, { 
        scale: 2.5, 
        backgroundColor: 'rgba(74, 124, 89, 0.2)', 
        border: 'none',
        duration: 0.3 
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(follower, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        border: '1px solid rgba(74, 124, 89, 0.5)',
        duration: 0.3 
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('custom-cursor-active');
      links.forEach(link => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#4a7c59] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 shadow-sm"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-[#4a7c59]/40 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
      />
    </>
  );
}
