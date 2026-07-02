"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { Sparkles, Heart, Target } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  name: string;
  designation: string;
  content: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon,
  name,
  designation,
  content,
  iconClassName = "text-emerald-600 dark:text-emerald-400",
  titleClassName = "text-primary dark:text-emerald-400",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-52 w-full max-w-[24rem] -skew-y-[4deg] select-none flex-col justify-between rounded-2xl border border-outline-variant/30 dark:border-stone-800/50 bg-surface-container-lowest dark:bg-stone-900/50 backdrop-blur-md p-5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-emerald-500/30 dark:hover:border-emerald-400/30 hover:bg-surface-container dark:hover:bg-stone-900/80 [&>*]:flex [&>*]:items-center [&>*]:gap-2 shadow-lg",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/50 p-1.5", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-bold font-headline", titleClassName)}>{name}</p>
      </div>
      <div className="text-on-surface-variant dark:text-stone-300 text-sm sm:text-base font-body leading-relaxed flex-grow flex items-center mt-2">
        {content}
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t border-outline-variant/30 dark:border-stone-800/50 pt-2 w-full">
        <span className="font-semibold text-tertiary dark:text-amber-400 uppercase tracking-wider">{designation}</span>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  items: Omit<DisplayCardProps, "className">[];
}

export function DisplayCards({ items }: DisplayCardsProps) {
  const getIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("missão") || lowercaseName.includes("missao")) {
      return <Target className="size-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (lowercaseName.includes("valores")) {
      return <Heart className="size-5 text-amber-600 dark:text-amber-400" />;
    }
    return <Sparkles className="size-5 text-blue-600 dark:text-blue-400" />;
  };

  const defaultStyles = [
    {
      className: "[grid-area:stack] hover:-translate-y-20 hover:z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/40 dark:before:bg-stone-950/40 grayscale-[60%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 z-10",
    },
    {
      className: "[grid-area:stack] translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 hover:-translate-y-16 hover:z-50 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/40 dark:before:bg-stone-950/40 grayscale-[40%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 z-20",
    },
    {
      className: "[grid-area:stack] translate-x-8 translate-y-8 sm:translate-x-12 sm:translate-y-12 hover:-translate-y-12 hover:z-50 z-30",
    },
  ];

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 min-h-[15rem] pt-0 pb-12 pr-8 sm:pr-12 w-full max-w-[28rem] mx-auto">
      {items.map((item, index) => {
        const style = defaultStyles[index] || { className: "[grid-area:stack]" };
        const icon = item.icon || getIcon(item.name);
        return (
          <DisplayCard 
            key={index} 
            {...item} 
            icon={icon} 
            className={style.className} 
          />
        );
      })}
    </div>
  );
}
