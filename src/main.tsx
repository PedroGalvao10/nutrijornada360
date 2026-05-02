import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import './index.css';

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'SUA_CHAVE_AQUI', {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    loaded: (posthog_instance) => {
      // Mock disable in dev or if no real key provided
      if (import.meta.env.VITE_POSTHOG_KEY === 'SUA_CHAVE_AQUI' || import.meta.env.DEV) {
        posthog_instance.opt_out_capturing();
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <HashRouter>
      <PostHogProvider client={posthog}>
        <AuthProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </AuthProvider>
      </PostHogProvider>
    </HashRouter>
  </HelmetProvider>
)

