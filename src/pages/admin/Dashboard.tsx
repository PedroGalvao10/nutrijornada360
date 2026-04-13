import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContextCore';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleForm from '../../components/ArticleForm';
import type { Article } from '../../article_types';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('artigos');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'artigos') fetchArticles();
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticle(art);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    fetchArticles();
  };

  const handleDeleteArticle = async (art: Article) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o artigo "${art.title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${art.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      } else {
        const error = await res.json();
        alert('Erro ao excluir: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir.');
    }
  };


  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 font-sans">
      <Helmet>
        <title>Painel CMS - NutriJornada 360º</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Admin Header */}
      <header className="bg-[#4a7c59] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            <h1 className="text-xl font-bold font-serif italic">Painel Restrito</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#3d664a] hover:bg-[#2e4d38] px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Tabs Manager */}
        <div className="flex gap-4 border-b border-stone-300 dark:border-stone-800 mb-8">
          <button 
            className={`pb-3 px-2 font-semibold transition-colors border-b-2 ${activeTab === 'artigos' ? 'border-[#705c30] text-[#705c30] dark:text-amber-500' : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'}`}
            onClick={() => { setActiveTab('artigos'); setShowForm(false); }}
          >
            Gestão de Publicações
          </button>
          <button 
            className={`pb-3 px-2 font-semibold transition-colors border-b-2 ${activeTab === 'ebooks' ? 'border-[#705c30] text-[#705c30] dark:text-amber-500' : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'}`}
            onClick={() => setActiveTab('ebooks')}
          >
            Gestão de E-books
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 md:p-8">
          {activeTab === 'artigos' && (
            <section className="animate-fade-in-up">
              {showForm ? (
                <ArticleForm 
                  initialData={editingArticle} 
                  onSaved={handleFormSaved} 
                  onCancel={() => setShowForm(false)} 
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-[#4a7c59] dark:text-emerald-500">Seus Artigos</h2>
                    <button onClick={handleNewArticle} className="flex items-center gap-2 bg-[#705c30] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-opacity whitespace-nowrap">
                      <span className="material-symbols-outlined text-sm">add</span>
                      Novo Artigo
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-12 flex justify-center text-stone-400">
                      <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                      <span className="material-symbols-outlined text-5xl text-stone-300 mb-3">description</span>
                      <p className="text-stone-500">Nenhuma publicação criada ainda.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-sm">
                            <th className="pb-3 px-2 font-medium">Título</th>
                            <th className="pb-3 px-2 font-medium">Data</th>
                            <th className="pb-3 px-2 font-medium text-center">Status</th>
                            <th className="pb-3 px-2 font-medium text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.map((art) => (
                            <tr key={art.id} className="border-b border-stone-100 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                              <td className="py-4 px-2 font-medium text-stone-800 dark:text-stone-200">{art.title}</td>
                              <td className="py-4 px-2 text-sm text-stone-500">{new Date(art.created_at).toLocaleDateString('pt-BR')}</td>
                              <td className="py-4 px-2 text-center">
                                {art.is_published ? (
                                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-2 py-1 rounded-full font-bold">Publicado</span>
                                ) : (
                                  <span className="bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400 text-xs px-2 py-1 rounded-full font-bold">Rascunho</span>
                                )}
                              </td>
                              <td className="py-4 px-2 text-right">
                                <button onClick={() => handleEditArticle(art)} className="text-stone-400 hover:text-[#4a7c59] transition-colors p-1" title="Editar">
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteArticle(art)} className="text-stone-400 hover:text-red-500 transition-colors p-1 ml-2" title="Excluir">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {activeTab === 'ebooks' && (
            <section className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-[#4a7c59] dark:text-emerald-500">Seus E-books (Iscas de Lead)</h2>
                <button className="flex items-center gap-2 bg-[#705c30] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-opacity whitespace-nowrap">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Novo E-book
                </button>
              </div>
              <div className="text-center py-16 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                <span className="material-symbols-outlined text-5xl text-stone-300 mb-3">auto_stories</span>
                <p className="text-stone-500">Nenhum e-book cadastrado para download no site.</p>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

