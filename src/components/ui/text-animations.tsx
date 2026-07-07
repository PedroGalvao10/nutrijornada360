import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { cn } from '../../lib/utils';

// 1. TypingEffect
export function TypingEffect({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.05, delay: delay + index * 0.02 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// 2. TextEffect
export function TextEffect({ text, className, delay = 0, preset = 'slide' }: { text: string; className?: string; delay?: number; preset?: 'fade' | 'blur' | 'slide' }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const words = text.split(' ');
  
  const getVariants = () => {
    switch (preset) {
      case 'blur':
        return { initial: { filter: 'blur(10px)', opacity: 0 }, animate: { filter: 'blur(0px)', opacity: 1 } };
      case 'fade':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      case 'slide':
      default:
        return { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } };
    }
  };
  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={getVariants()}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: delay + i * 0.05 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// 3. TextReveal
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 90%', 'start 40%'],
  });

  const words = text.split(' ');

  return (
    <span ref={targetRef} className={cn('relative flex flex-wrap', className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="mr-[0.25em]">
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

// 4. LiquidText
export function LiquidText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn('inline-flex cursor-pointer overflow-hidden flex-wrap', className)}
      whileHover="hover"
      initial="rest"
    >
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-flex mr-[0.25em]">
          {word.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                rest: { y: 0 },
                hover: {
                  y: [0, -8, 0],
                  transition: { duration: 0.4, delay: i * 0.02, ease: 'easeInOut' },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// 5. TypewriterText (Refactored to be reusable and not conflict with existing)
export function TypewriterTextAnim({ text, className, delay = 0, speed = 50 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const targetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.5 }
    );
    if (targetRef.current) observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed, hasStarted]);

  return (
    <span ref={targetRef} className={cn('inline-block', className)}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[2px] bg-primary ml-[2px] h-[0.8em] align-middle"
      />
    </span>
  );
}

// 6. TextMarquee
export function TextMarquee({ text, className, speed = 30 }: { text: string; className?: string; speed?: number }) {
  return (
    <div className={cn('overflow-hidden whitespace-nowrap flex w-full relative', className)}>
      <motion.div
        className="flex shrink-0 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex px-4 gap-8">
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </motion.div>
    </div>
  );
}

// 7. AnimatedUnderlineText
export function AnimatedUnderlineText({ text, className, underlineColor = 'bg-primary dark:bg-emerald-500' }: { text: string; className?: string; underlineColor?: string }) {
  return (
    <span className={cn('relative inline-block group cursor-pointer', className)}>
      {text}
      <span
        className={cn(
          'absolute left-0 -bottom-1 w-0 h-[2px] transition-all duration-300 ease-out group-hover:w-full',
          underlineColor
        )}
      />
    </span>
  );
}

// 8. RevealText
export function RevealText({ text, className, triggerWords }: { text: string; className?: string; triggerWords: { word: string; imageSrc: string }[] }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const words = text.split(' ');

  return (
    <span className={cn('relative inline-block', className)}>
      {words.map((word, i) => {
        const cleanWord = word.replace(/[.,;!?]/g, '');
        const trigger = triggerWords.find((t) => cleanWord.toLowerCase() === t.word.toLowerCase());
        if (trigger) {
          return (
            <span
              key={i}
              className="inline-block relative text-primary dark:text-emerald-400 font-bold cursor-pointer transition-colors duration-300 mr-[0.25em]"
              onMouseEnter={() => setActiveImage(trigger.imageSrc)}
              onMouseLeave={() => setActiveImage(null)}
            >
              {word}
            </span>
          );
        }
        return <span key={i} className="mr-[0.25em] transition-colors duration-300" style={{ opacity: activeImage ? 0.3 : 1 }}>{word}</span>;
      })}

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10, rotate: 5 }}
            className="absolute z-50 pointer-events-none -top-40 left-1/2 -translate-x-1/2"
          >
            <img
              src={activeImage}
              alt="Nutrição"
              className="w-32 h-32 object-cover rounded-2xl border-4 border-emerald-500 shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// 9. DotPatternQuote
export function DotPatternQuote({ text, author, role, className }: { text: string; author?: string; role?: string; className?: string }) {
  return (
    <div className={cn('relative p-8 md:p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-md overflow-hidden border border-emerald-500/20', className)}>
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
      <blockquote className="relative z-10 text-center md:text-left">
        <p className="text-xl md:text-2xl font-headline italic text-on-surface dark:text-stone-100 leading-relaxed drop-shadow-md">
          &ldquo;{text}&rdquo;
        </p>
        {(author || role) && (
          <footer className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-2">
            <div className="w-12 h-[2px] bg-emerald-500 mt-3 hidden md:block"></div>
            <div>
              {author && <cite className="block font-bold text-lg not-italic text-primary dark:text-emerald-400">{author}</cite>}
              {role && <span className="block text-sm text-on-surface-variant dark:text-stone-400">{role}</span>}
            </div>
          </footer>
        )}
      </blockquote>
    </div>
  );
}

// 10. MixedHeading
export function MixedHeading({ text, sansClass = 'font-body font-bold', serifClass = 'font-headline italic', className = '' }: { text: string, sansClass?: string, serifClass?: string, className?: string }) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <span key={i} className={serifClass}>{part}</span>
          : <span key={i} className={sansClass}>{part}</span>
      )}
    </span>
  );
}
