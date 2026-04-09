import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Planos from './pages/Planos';
import Sobre from './pages/Sobre';
import Logistica from './pages/Logistica';
import Artigos from './pages/Artigos';
import ArtigoDetalhe from './pages/ArtigoDetalhe';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import PageTransition from './components/ui/PageTransition';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="planos" element={<Planos />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="logistica" element={<Logistica />} />
            <Route path="artigos" element={<Artigos />} />
            <Route path="blog/:slug" element={<ArtigoDetalhe />} />
          </Route>

          {/* Rotas Administrativas CMS */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </PageTransition>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;

