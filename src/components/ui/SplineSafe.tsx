import React, { Suspense, useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

interface SplineSafeProps {
  scene: string;
  className?: string;
  onLoad?: (spline: any) => void;
}

class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('Spline WebGL Error captured by SplineSafe:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const SplineSafe: React.FC<SplineSafeProps> = ({ scene, className, onLoad }) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  const fallback = (
    <div 
      className={`spline-fallback flex items-center justify-center bg-transparent ${className}`}
    >
      <div className="text-center p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-violet-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <p className="text-sm text-white/40 font-light max-w-[200px]">
          O conteúdo 3D está desativado no seu navegador para poupar recursos.
        </p>
      </div>
    </div>
  );

  if (webglSupported === false) {
    return fallback;
  }

  return (
    <SplineErrorBoundary fallback={fallback}>
      <Suspense fallback={<div className={className} />}>
        <div className={className}>
          <Spline 
            scene={scene} 
            onLoad={onLoad}
          />
        </div>
      </Suspense>
    </SplineErrorBoundary>
  );
};

export default SplineSafe;
