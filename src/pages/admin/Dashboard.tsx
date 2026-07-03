import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContextCore';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArticleForm from '../../components/ArticleForm';
import { AdminBookingDashboard } from '../../components/admin/AdminBookingDashboard';
import type { Article } from '../../article_types';

// ============================================================
// Dashboard admin — visual na direção "Editorial Orgânico":
// header verde-profundo, abas com filete ouro, cartão branco
// radius 28px e títulos em Lora. Lógica de CRUD intacta.
// ============================================================

const TABS = [
  { id: 'artigos', rotulo: 'Publicações' },
  { id: 'ebooks', rotulo: 'E-books' },
  { id: 'contratos', rotulo: 'Contratos & Bookings' },
] as const;

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
    <div className="min-h-screen bg-background dark:bg-stone-950 font-body transition-colors duration-500">
      <Helmet>
        <title>Painel CMS - NutriJornada 360º</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header admin em verde-profundo */}
      <header className="bg-verde-profundo dark:bg-emerald-950 text-background shadow-float-1 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-[0.6rem] tracking-[0.26em] uppercase font-extrabold text-ouro-suave">NutriJornada 360º</p>
            <h1 className="font-headline font-medium text-xl">Painel restrito</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-background/25 hover:border-ouro-suave px-5 py-2 rounded-full transition-colors font-semibold text-sm"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-sm">logout</span>
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        {/* Abas */}
        <div className="flex gap-6 border-b border-surface-variant dark:border-stone-800 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`pb-3 px-1 text-sm font-semibold tracking-wide transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-ouro text-tertiary dark:text-ouro-suave'
                  : 'border-transparent text-on-surface-variant dark:text-stone-500 hover:text-on-background dark:hover:text-stone-300'
              }`}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'artigos') setShowForm(false); }}
            >
              {tab.rotulo}
            </button>
          ))}
        </div>

        {/* Área de conteúdo */}
        <div className="bg-white dark:bg-stone-900 rounded-[28px] shadow-float-1 p-6 md:p-10">
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
                  <div className="flex justify-between items-center mb-8 gap-4">
                    <div>
                      <p className="text-[0.62rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-1">Conteúdo do site</p>
                      <h2 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100">Artigos</h2>
                    </div>
                    <button
                      onClick={handleNewArticle}
                      className="flex items-center gap-2 bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 px-6 py-3 rounded-full font-semibold text-sm shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-sm">add</span>
                      Novo artigo
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-12 flex justify-center text-on-surface-variant/50">
                      <span className="material-symbols-outlined animate-spin text-3xl" aria-label="Carregando">sync</span>
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-surface-variant dark:border-stone-800 rounded-[20px]">
                      <span aria-hidden="true" className="material-symbols-outlined text-5xl text-ouro-suave/50 mb-3">description</span>
                      <p className="text-on-surface-variant dark:text-stone-400">Nenhuma publicação criada ainda.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-surface-variant dark:border-stone-800 text-on-surface-variant dark:text-stone-400">
                            <th className="pb-3 px-2 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold">Título</th>
                            <th className="pb-3 px-2 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold">Data</th>
                            <th className="pb-3 px-2 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold text-center">Status</th>
                            <th className="pb-3 px-2 text-[0.62rem] tracking-[0.18em] uppercase font-extrabold text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.map((art) => (
                            <tr key={art.id} className="border-b border-surface-variant/50 dark:border-stone-800/50 hover:bg-creme-2/60 dark:hover:bg-stone-800/30 transition-colors">
                              <td className="py-4 px-2 font-medium text-on-background dark:text-stone-200">{art.title}</td>
                              <td className="py-4 px-2 text-sm text-on-surface-variant dark:text-stone-500">{new Date(art.created_at).toLocaleDateString('pt-BR')}</td>
                              <td className="py-4 px-2 text-center">
                                {art.is_published ? (
                                  <span className="bg-verde-nevoa text-primary dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">Publicado</span>
                                ) : (
                                  <span className="bg-creme-2 text-on-surface-variant dark:bg-stone-800 dark:text-stone-400 text-xs px-3 py-1 rounded-full font-bold">Rascunho</span>
                                )}
                              </td>
                              <td className="py-4 px-2 text-right">
                                <button onClick={() => handleEditArticle(art)} className="text-on-surface-variant/60 hover:text-primary transition-colors p-1" title="Editar">
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteArticle(art)} className="text-on-surface-variant/60 hover:text-error transition-colors p-1 ml-2" title="Excluir">
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
              <div className="flex justify-between items-center mb-8 gap-4">
                <div>
                  <p className="text-[0.62rem] tracking-[0.26em] uppercase font-extrabold text-tertiary dark:text-ouro-suave mb-1">Captação de leads</p>
                  <h2 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100">E-books</h2>
                </div>
                <button className="flex items-center gap-2 bg-verde-profundo dark:bg-emerald-500 text-background dark:text-stone-950 px-6 py-3 rounded-full font-semibold text-sm shadow-float-1 hover:shadow-float-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap">
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">add</span>
                  Novo e-book
                </button>
              </div>
              <div className="text-center py-16 border border-dashed border-surface-variant dark:border-stone-800 rounded-[20px]">
                <span aria-hidden="true" className="material-symbols-outlined text-5xl text-ouro-suave/50 mb-3">auto_stories</span>
                <p className="text-on-surface-variant dark:text-stone-400">Nenhum e-book cadastrado para download no site.</p>
              </div>
            </section>
          )}

          {activeTab === 'contratos' && (
            <section className="animate-fade-in-up">
              <AdminBookingDashboard />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
