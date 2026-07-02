import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { SiteProgressProvider } from './context/SiteProgressContext';
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
    <BrowserRouter>
      <PostHogProvider client={posthog}>
        <AuthProvider>
          <BookingProvider>
            <SiteProgressProvider>
              <App />
            </SiteProgressProvider>
          </BookingProvider>
        </AuthProvider>
      </PostHogProvider>
    </BrowserRouter>
  </HelmetProvider>
)

