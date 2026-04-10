import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background z-[99999] relative">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-2xl border border-primary/10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">warning</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2 font-serif">Ops! Algo deu errado.</h2>
            <p className="text-stone-500 mb-6">Pedimos desculpas pelo inconveniente. A aplicação encontrou um problema técnico.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Recarregar Site
              </button>
              
              {this.state.error && (
                <details className="text-left mt-4 mb-2">
                  <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600 font-mono">
                    Detalhes técnicos do erro
                  </summary>
                  <div className="mt-2 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-left overflow-auto max-h-48">
                    <p className="text-xs font-mono text-red-500 font-bold mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-[10px] font-mono text-stone-500 whitespace-pre-wrap leading-tight">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <button 
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="text-red-500 font-semibold hover:underline text-sm mb-2"
              >
                Limpar Cache e Reiniciar
              </button>
              <button 
                onClick={() => {
                  window.location.hash = '#/';
                  window.location.href = '/';
                }}
                className="text-primary font-semibold hover:underline"
              >
                Voltar para o Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
