import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineApp {
  setBackgroundColor?: (color: string) => void;
  play?: () => void;
  stop?: () => void;
}

interface SplineSafeProps {
  scene: string;
  className?: string;
  onLoad?: (spline: SplineApp) => void;
}

// Fallback exibido apenas se o Spline lançar um erro real durante a renderização
class SplineErrorBoundary extends React.Component<
  SplineSafeProps,
  { hasError: boolean }
> {
  constructor(props: SplineSafeProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error | unknown) {
    console.warn('[SplineSafe] Erro capturado — Spline oculto silenciosamente:', error instanceof Error ? error.message : error);
  }

  render() {
    if (this.state.hasError) {
      // Retorna div com mesmas dimensões para não quebrar o layout
      return <div className={this.props.className} aria-hidden="true" />;
    }

    const { scene, className, onLoad } = this.props;
    return (
      // className vai direto para o Spline, que aplica no seu wrapper interno (canvas container)
      <Spline scene={scene} className={className} onLoad={onLoad} />
    );
  }
}

// Componente público — transparente para quem usa, idêntico ao Spline original
const SplineSafe: React.FC<SplineSafeProps> = (props) => (
  <Suspense fallback={<div className={props.className} />}>
    <SplineErrorBoundary {...props} />
  </Suspense>
);

export default SplineSafe;
