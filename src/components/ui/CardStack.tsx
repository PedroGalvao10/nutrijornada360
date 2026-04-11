/* cspell:disable-file */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CardStack — Cards empilhados que se revezam automaticamente.
 * Cada card se sobrepõe ao anterior com uma leve escala e offset vertical,
 * gerando um efeito de profundidade elegante. Cada 5s, o card de trás
 * sobe para o topo da pilha.
 */

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export function CardStack({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto h-48 w-full my-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-surface-container-lowest h-48 w-full rounded-3xl p-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between"
          style={{ transformOrigin: 'top center' }}
          animate={{
            top: index * -CARD_OFFSET,
            scale: 1 - index * SCALE_FACTOR,
            zIndex: cards.length - index,
          }}
        >
          <div className="font-normal text-on-surface-variant text-sm leading-relaxed">
            {card.content}
          </div>
          <div>
            <p className="text-on-surface font-medium text-sm">{card.name}</p>
            <p className="text-on-surface-variant font-normal text-xs">{card.designation}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
