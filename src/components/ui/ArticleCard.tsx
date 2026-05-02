import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTilt } from '../../hooks/useTilt';
import { GlowWrapper } from './GlowWrapper';

import type { Article } from '../../article_types';

export default function ArticleCard({ post }: { post: Article }) {
  const cardRef = useRef<HTMLElement>(null);
  useTilt(cardRef, 12);

  const dateStr = post.published_at || post.created_at || '';
  const dateObj = new Date(dateStr);
  const formattedDate = !isNaN(dateObj.getTime()) 
                         ? dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) 
                         : '';

  return (
    <GlowWrapper 
      as="article"
      ref={cardRef}
      className="group flex flex-col antigravity-glass bg-white/5 dark:bg-black/20 rounded-3xl overflow-hidden parallax-shadow transition-all duration-500 border-white/20 dark:border-white/5 cursor-pointer h-full transform-style-3d shadow-sm hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="relative h-64 overflow-hidden tilt-child tz-20">
        <img 
          src={post.cover_image_url} 
          alt={post.image_alt || `Capa do artigo: ${post.title}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          loading="lazy" 
        />
        <div className="absolute top-4 left-4 bg-surface/90 dark:bg-stone-800/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider text-primary dark:text-emerald-400 shadow-sm border border-white/20 dark:border-stone-700/30 uppercase tilt-child tz-30">
          {post.hat}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow tilt-child tz-10">
        <header>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant dark:text-stone-500 font-medium mb-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span> 
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> 
              {post.reading_time ? `${post.reading_time} min de leitura` : ''}
            </span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface dark:text-stone-100 mb-3 group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors leading-snug">
            <Link to={`/blog/${post.slug}`} className="focus:outline-none focus:underline" aria-label={`Ler artigo: ${post.title}`}>
              {post.title}
            </Link>
          </h2>
        </header>
        <div className="text-on-surface-variant dark:text-stone-400 text-sm flex-grow mb-6 leading-relaxed line-clamp-3">
          <p>{post.excerpt}</p>
        </div>
        <footer className="mt-auto">
          <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform" aria-label={`Ler mais sobre: ${post.title}`}>
            Ler artigo completo <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
          </Link>
        </footer>
      </div>
    </GlowWrapper>
  );
}
