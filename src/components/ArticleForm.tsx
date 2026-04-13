import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Article } from '../article_types';

// TIPAGEM: Interface para os dados do formulário de artigo (sem ID e datas de sistema)
type ArticleFormData = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'reading_time'>;

// TIPAGEM: Props do componente
interface ArticleFormProps {
  onSaved: () => void;
  onCancel: () => void;
  initialData?: Article | null;
}

export default function ArticleForm({ onSaved, onCancel, initialData = null }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    hat: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_description: '',
    cover_image_url: '',
    image_alt: '',
    published_at: new Date().toISOString().split('T')[0],
    is_published: true
  });

  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      
      // LÓGICA: Auto-gera slug a partir do título, caso seja um novo artigo
      if (name === 'title' && !initialData) {
        updated.slug = value
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
          .replace(/[^a-z0-9]+/g, '-') // substitui não-alfanuméricos por hifens
          .replace(/^-+|-+$/g, ''); // remove hifens no início/fim
      }
      
      return updated;
    });
  };


  // CÁLCULO: Tempo de leitura baseado em 200 palavras por minuto
  const calculateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const reading_time = calculateReadingTime(formData.content);
    // GERAÇÃO: Cria excerpt automaticamente a partir do conteúdo se estiver vazio
    const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';

    const payload = {
      ...formData,
      reading_time,
      excerpt
    };

    try {
      const endpoint = initialData ? `/api/articles/${initialData.id}` : '/api/articles';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSaved();
      } else {
        const error = await res.json();
        alert('Erro ao salvar: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif text-[#4a7c59] dark:text-emerald-500">
          {initialData ? 'Editar Artigo' : 'Novo Artigo'}
        </h3>
        <button onClick={onCancel} className="text-stone-400 hover:text-stone-600 transition-colors" aria-label="Fechar formulário">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Título e Chapéu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hat" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Chapéu (Subtítulo) *
            </label>
            <input 
              id="hat"
              type="text" 
              name="hat" 
              value={formData.hat} 
              onChange={handleChange} 
              maxLength={40}
              required
              placeholder="Ex: Vida Saudável"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
            <div className="text-xs text-stone-500 text-right mt-1">{formData.hat.length}/40</div>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Título *
            </label>
            <input 
              id="title"
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              maxLength={60}
              required
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
            <div className="text-xs text-stone-500 text-right mt-1">{formData.title.length}/60</div>
          </div>
        </div>

        {/* Slug e Data de Publicação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Slug da URL * (ex: /blog/como-emagrecer)
            </label>
            <input 
              id="slug"
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
          </div>
          <div>
            <label htmlFor="published_at" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Data de Publicação *
            </label>
            <input 
              id="published_at"
              type="date" 
              name="published_at" 
              value={formData.published_at} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
          </div>
        </div>

        {/* Corpo do Artigo */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            Corpo do Artigo (suporta tags HTML: &lt;h2&gt;, &lt;strong&gt;, &lt;blockquote&gt;) *
          </label>
          <textarea 
            id="content"
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            rows={10}
            required
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none font-mono text-sm"
            placeholder="<p>Escreva o artigo aqui...</p>"
          />
        </div>

        {/* Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cover_image_url" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              URL da Imagem de Capa (Ideal: 1200x630px) *
            </label>
            <input 
              id="cover_image_url"
              type="url" 
              name="cover_image_url" 
              value={formData.cover_image_url} 
              onChange={handleChange} 
              required
              placeholder="https://..."
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
          </div>
          <div>
            <label htmlFor="image_alt" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Alt Text da Imagem *
            </label>
            <input 
              id="image_alt"
              type="text" 
              name="image_alt" 
              value={formData.image_alt} 
              onChange={handleChange} 
              maxLength={125}
              required
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
            />
            <div className="text-xs text-stone-500 text-right mt-1">{formData.image_alt.length}/125</div>
          </div>
        </div>

        {/* SEO */}
        <div>
          <label htmlFor="meta_description" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            Meta Description *
          </label>
          <textarea 
            id="meta_description"
            name="meta_description" 
            value={formData.meta_description} 
            onChange={handleChange} 
            maxLength={160}
            rows={2}
            required
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-[#4a7c59] outline-none"
          />
          <div className="text-xs text-stone-500 text-right mt-1">{formData.meta_description.length}/160</div>
        </div>

        {/* Status de Publicação */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-800">
           <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                 <input 
                    type="checkbox" 
                    name="is_published"
                    checked={formData.is_published} 
                    onChange={handleChange} 
                    className="peer w-6 h-6 appearance-none border-2 border-stone-300 dark:border-stone-600 rounded-md checked:bg-[#4a7c59] checked:border-[#4a7c59] transition-all cursor-pointer" 
                    disabled={loading} 
                 />
                 <span className="material-symbols-outlined absolute inset-0 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xl leading-none flex items-center justify-center">check</span>
              </div>
              <div>
                 <span className="text-sm font-bold text-stone-800 dark:text-stone-200">Publicar imediatamente</span>
                 <p className="text-xs text-stone-500">Se desmarcado, o artigo será salvo como rascunho e não aparecerá no site público.</p>
              </div>
           </label>
        </div>


        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 rounded-lg font-medium bg-[#4a7c59] hover:bg-[#3d664a] text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">publish</span>
            )}
            {initialData ? 'Salvar Edições' : 'Publicar Artigo'}
          </button>
        </div>

      </form>
    </div>
  );
}
