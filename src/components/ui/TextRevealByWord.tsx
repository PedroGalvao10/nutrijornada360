import { motion } from 'framer-motion';

interface TextRevealByWordProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TextRevealByWord = ({ text, className = "", delay = 0 }: TextRevealByWordProps) => {
  const words = text.split(" ");
  
  return (
    <motion.p 
      className={className}
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
        hidden: {}
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
            visible: { 
              opacity: 1, 
              y: 0, 
              filter: "blur(0px)",
              transition: { type: 'spring', damping: 12, stiffness: 100 } 
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};
