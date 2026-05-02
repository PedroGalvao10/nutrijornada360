import { useEffect } from 'react';

/**
 * Hook to automatically add 'in-view' class to elements with a specific selector
 * when they enter the viewport.
 * 
 * @param selector - CSS selector for elements to observe (default: '.seed-fade-up')
 * @param options - IntersectionObserver options
 */
export function useScrollReveal(
  selector: string = '.seed-fade-up',
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Once it's in view, we can stop observing it
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, options.threshold, options.rootMargin]);
}
