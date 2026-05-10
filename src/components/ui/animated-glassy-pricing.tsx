import React from 'react';
import { RippleButton } from "./multi-type-ripple-buttons";
import { useBooking } from '../../context/BookingContext';

export interface PricingItem {
  text: string;
  highlight?: boolean;
  icon?: string;
}

export interface PricingCardProps {
  id: string;
  title: string;
  tag?: string;
  description: string;
  price: string;
  items: PricingItem[];
  isPopular?: boolean;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  id,
  title,
  tag,
  description,
  price,
  items,
  isPopular,
  className = "",
}) => {
  const { openBooking } = useBooking();

  return (
    <div className={`relative flex flex-col h-full p-8 rounded-[2rem] overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 group ${isPopular ? 'scale-[1.02] border-primary/50 dark:border-emerald-500/50' : ''} ${className}`}>
      
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
      {isPopular && (
        <div className="absolute top-0 right-0 p-4 z-20">
          <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            Popular
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {tag && (
           <span className="text-primary dark:text-emerald-400 font-bold uppercase text-xs tracking-widest mb-2 block">{tag}</span>
        )}
        <h3 className="font-headline text-2xl font-bold text-on-surface dark:text-stone-100 mb-2">{title}</h3>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm leading-relaxed mb-6 min-h-[3rem]">{description}</p>
        
        <div className="text-4xl font-bold text-primary dark:text-emerald-400 mb-8 font-headline flex items-end gap-1">
          {price}
        </div>
        
        <ul className="space-y-4 mb-8 flex-grow">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              {item.icon ? (
                <span className="material-symbols-outlined text-primary dark:text-emerald-500 text-lg shrink-0 mt-0.5">{item.icon}</span>
              ) : (
                <span className="material-symbols-outlined text-primary dark:text-emerald-500 text-lg shrink-0 mt-0.5">check_circle</span>
              )}
              <span className={`text-sm ${item.highlight ? 'font-bold text-on-surface dark:text-stone-200' : 'text-on-surface-variant dark:text-stone-400'}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
          <RippleButton 
            onClick={() => openBooking(id)}
            className={`w-full py-4 font-bold rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${isPopular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-surface-container-high dark:bg-stone-800 text-on-surface dark:text-stone-200 hover:bg-surface-container-highest dark:hover:bg-stone-700'}`}
          >
            Quero este plano
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </RippleButton>
        </div>
      </div>
    </div>
  );
};
