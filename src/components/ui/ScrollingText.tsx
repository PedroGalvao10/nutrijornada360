interface ScrollingTextProps {
  text: string[];
  reverse?: boolean;
}

export function ScrollingText({ text, reverse = false }: ScrollingTextProps) {
  return (
    <div className="overflow-hidden py-12 md:py-20 select-none bg-stone-50 dark:bg-stone-900/20 border-y border-stone-200/50 dark:border-stone-800/50">
      <div className={reverse ? "animate-marquee-reverse" : "animate-marquee"}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            {text.map((item, index) => (
              <div key={index} className="flex items-center gap-12 whitespace-nowrap">
                <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-[#4a7c59] dark:text-emerald-500/80 uppercase">
                  {item}
                </span>
                <span className="w-4 h-4 rounded-full bg-[#705c30] dark:bg-amber-500/50" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
