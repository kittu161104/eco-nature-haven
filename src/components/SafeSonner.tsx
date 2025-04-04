
import React, { Suspense, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Toaster as Sonner } from "./ui/sonner";

const SafeSonner = () => {
  const [hasError, setHasError] = useState(false);
  
  // If the component errors out too many times, stop trying to render it
  useEffect(() => {
    let errorCount = 0;
    
    const handleError = () => {
      errorCount++;
      if (errorCount > 2) {
        setHasError(true);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return null;
  }
  
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <Sonner />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SafeSonner;
