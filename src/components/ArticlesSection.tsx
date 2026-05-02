import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArticleCard from './ui/ArticleCard';
import type { Article } from '../article_types';
import { SectionHeading } from './ui/SectionHeading';
import { StaggerReveal, StaggerItem } from './ui/StaggerReveal';

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          // Pegar apenas os 3 mais recentes se houver muitos
          setArticles(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Erro ao buscar artigos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section id="articles" className="py-24 bg-surface dark:bg-stone-950 transition-colors duration-500" aria-labelledby="articles-heading">
      <div className="container mx-auto px-6">
        <StaggerReveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <StaggerItem className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 text-sm font-bold tracking-wider uppercase mb-4">
              Blog & Conhecimento
            </span>
            <SectionHeading id="articles-heading">
              Últimos <span className="text-primary dark:text-emerald-400 italic">Artigos</span>
            </SectionHeading>
            <p className="text-on-surface-variant dark:text-stone-400 text-lg max-w-xl">
              Confira meus últimos textos sobre saúde mental, neurociência e bem-estar emocional.
            </p>
          </StaggerItem>
          <StaggerItem>
            <Link 
              to="/artigos" 
              className="group inline-flex items-center gap-2 text-primary font-bold hover:translate-x-1 transition-transform"
            >
              Ver todos os artigos 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </StaggerItem>
        </StaggerReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-variant/20 dark:bg-stone-800/30 rounded-3xl h-[450px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <ArticleCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
