import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import PageTransition from './components/ui/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { PlateProvider } from './context/PlateContext';

// Lazy loaded pages for performance
const Home = lazy(() => import('./pages/Home'));
const Planos = lazy(() => import('./pages/Planos'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Artigos = lazy(() => import('./pages/Artigos'));
const ArtigoDetalhe = lazy(() => import('./pages/ArtigoDetalhe'));
const Ferramentas = lazy(() => import('./pages/Ferramentas'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Fallback skeleton loader
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-stone-950">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout />}>
              <Route index element={<PageTransition><Home /></PageTransition>} />
              <Route path="planos" element={<PageTransition><Planos /></PageTransition>} />
              <Route path="sobre" element={<PageTransition><Sobre /></PageTransition>} />
              <Route path="artigos" element={<PageTransition><Artigos /></PageTransition>} />
              <Route path="ferramentas" element={<PageTransition><Ferramentas /></PageTransition>} />
              <Route path="blog/:slug" element={<PageTransition><ArtigoDetalhe /></PageTransition>} />
              {/* Redireciona /login para a home pois o login é um modal */}
              <Route path="login" element={<Navigate to="/" replace />} />
            </Route>

            {/* Rotas Administrativas CMS */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            </Route>

            {/* Rota de Fallback para qualquer URL inexistente */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <PlateProvider>
      <AppContent />
    </PlateProvider>
  );
}

export default App;
