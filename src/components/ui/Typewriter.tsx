import { useState, useEffect } from 'react';

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBeforeDelete?: number;
  delayBeforeType?: number;
}

export function Typewriter({
  phrases,
  typingSpeed = 40,
  deletingSpeed = 20,
  delayBeforeDelete = 3000,
  delayBeforeType = 500,
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      if (text === '') {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, delayBeforeType);
      } else {
        timer = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentPhrase) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBeforeDelete);
      } else {
        timer = setTimeout(() => {
          setText((prev) => currentPhrase.slice(0, prev.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, delayBeforeDelete, delayBeforeType]);

  return (
    <>
      {text}
      <span className="animate-[pulse_1s_ease-in-out_infinite] font-light ml-[2px] text-ouro-suave">|</span>
    </>
  );
}
