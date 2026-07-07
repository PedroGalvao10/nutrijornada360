import { cn } from "../../lib/utils";
import { Sparkles, FileText, MessageCircle, ClipboardCheck, Activity, HeartHandshake } from "lucide-react";
import React from "react";

interface NoteProps {
  id: number;
  name: string;
  designation: string;
  content: string;
  className?: string;
  icon?: React.ReactNode;
}

function NoteCard({ name, designation, content, className, icon }: NoteProps) {
  return (
    <div
      className={cn(
        // Base styling for "polaroid / note"
        "relative flex h-auto min-h-[14rem] w-[18rem] sm:w-[22rem] select-none flex-col justify-between rounded-lg border-2 border-stone-200/50 bg-[#F9F7F3] dark:bg-stone-900 shadow-md p-6 transition-all duration-700",
        // The skew and the physical aesthetic
        "hover:shadow-2xl hover:border-emerald-500/30 hover:bg-[#FFFCF6] dark:hover:bg-stone-800",
        // Hover brings back color from grayscale
        "grayscale hover:grayscale-0",
        // Stacking context
        "[grid-area:stack]",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="relative inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2">
            {icon}
          </span>
          <p className="text-sm font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400">
            {designation}
          </p>
        </div>
        <p className="text-xl font-headline font-medium text-stone-900 dark:text-stone-100 mb-2 leading-tight">
          {name}
        </p>
      </div>
      
      {/* Hand-written content */}
      <p className="font-handwriting text-[1.4rem] leading-snug text-stone-700 dark:text-stone-300 -rotate-1 opacity-90">
        {content}
      </p>
      
      {/* Tape/Pin decoration (optional analog touch) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 dark:bg-stone-800/40 backdrop-blur-sm shadow-sm rotate-2 border border-black/5" />
    </div>
  );
}

interface ScatteredNotesProps {
  items: Array<{
    id: number;
    name: string;
    designation: string;
    content: string;
  }>;
}

export function ScatteredNotes({ items }: ScatteredNotesProps) {
  const getIcon = (id: number) => {
    switch (id) {
      case 1: return <FileText size={18} />;
      case 2: return <MessageCircle size={18} />;
      case 3: return <ClipboardCheck size={18} />;
      case 4: return <Activity size={18} />;
      case 5: return <HeartHandshake size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const getPositionClasses = (index: number) => {
    // 5 cards scattered on a desk, simulating the "DisplayCards" bookmark
    const classes = [
      "z-[1] -rotate-6 md:-translate-x-12 md:translate-y-4 hover:rotate-0 hover:-translate-y-8 hover:z-[10]",
      "z-[2] rotate-3 md:translate-x-8 md:-translate-y-6 hover:rotate-0 hover:-translate-y-10 hover:z-[10]",
      "z-[3] -rotate-2 md:translate-x-20 md:translate-y-12 hover:rotate-0 hover:-translate-y-4 hover:z-[10]",
      "z-[4] rotate-6 md:translate-x-4 md:translate-y-24 hover:rotate-0 hover:-translate-y-2 hover:z-[10]",
      "z-[5] -rotate-3 md:translate-x-28 md:translate-y-6 hover:rotate-0 hover:-translate-y-6 hover:z-[10]"
    ];
    return classes[index % classes.length];
  };

  return (
    <div className="relative grid [grid-template-areas:'stack'] place-items-center w-full min-h-[450px] opacity-100 animate-in fade-in-0 duration-700 pt-8 pb-16">
      {items.map((item, index) => (
        <NoteCard
          key={item.id}
          id={item.id}
          name={item.name}
          designation={item.designation}
          content={item.content}
          icon={getIcon(item.id)}
          className={getPositionClasses(index)}
        />
      ))}
    </div>
  );
}
