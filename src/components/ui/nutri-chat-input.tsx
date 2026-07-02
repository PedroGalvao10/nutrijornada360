import React, { useRef, useEffect } from "react";
import { Plus, ArrowUp, Loader2, Sparkles } from "lucide-react";

export interface NutriChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const NutriChatInput: React.FC<NutriChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ex: frango, tomate, cebola, manjericão...",
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className={`relative w-full transition-all duration-300 ${className}`}
    >
      <div className="relative group bg-white/60 backdrop-blur-3xl border border-stone-200/60 rounded-[2rem] shadow-xl shadow-stone-200/20 focus-within:shadow-2xl focus-within:shadow-primary/10 focus-within:border-primary/30 transition-all flex flex-col p-2">
        
        {/* Main Input Area */}
        <div className="flex items-end gap-2 px-3 py-2">
          
          {/* Attachment Button (Visual only for now, adds premium feel) */}
          <button 
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-primary hover:bg-primary/5 transition-colors flex-shrink-0 mb-0.5"
          >
            <Plus className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none text-on-background placeholder-stone-400 font-light text-lg py-2 max-h-[200px] custom-scrollbar"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 mb-0.5 ${
              value.trim() && !isLoading 
                ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95" 
                : "bg-stone-100 text-stone-300"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Footer info inside input container (Claude style) */}
        <div className="flex items-center justify-between px-4 pb-2 pt-2 border-t border-transparent">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary/40" />
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              Nutri Inteligência
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
             Shift + Enter para nova linha
          </span>
        </div>
      </div>
    </form>
  );
};
