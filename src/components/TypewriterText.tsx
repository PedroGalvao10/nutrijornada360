import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursorClass?: string;
}

export function TypewriterText({ text, speed = 45, delay = 500, className = "", cursorClass = "" }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasStarted.current) {
        hasStarted.current = true;
        setTimeout(() => setIsTyping(true), delay);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isTyping, text, speed]);

  return (
    <span ref={ref} className={`inline ${className}`}>
      {displayedText}
      {!isDone && (
        <span className={`inline-block w-[3px] h-[1.1em] bg-current ml-1 align-middle animate-pulse ${cursorClass}`} />
      )}
    </span>
  );
}
