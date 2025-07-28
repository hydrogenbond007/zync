import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Outer circle */}
        <rect x="8" y="16" width="8" height="8" fill="currentColor" />
        <rect x="16" y="8" width="8" height="8" fill="currentColor" />
        <rect x="24" y="8" width="16" height="8" fill="currentColor" />
        <rect x="40" y="8" width="8" height="8" fill="currentColor" />
        <rect x="48" y="16" width="8" height="8" fill="currentColor" />
        <rect x="56" y="24" width="8" height="16" fill="currentColor" />
        <rect x="48" y="40" width="8" height="8" fill="currentColor" />
        <rect x="40" y="48" width="8" height="8" fill="currentColor" />
        <rect x="24" y="48" width="16" height="8" fill="currentColor" />
        <rect x="16" y="48" width="8" height="8" fill="currentColor" />
        <rect x="8" y="40" width="8" height="8" fill="currentColor" />
        <rect x="0" y="24" width="8" height="16" fill="currentColor" />
        
        {/* Inner Z pattern */}
        <rect x="16" y="20" width="32" height="4" fill="currentColor" />
        <rect x="40" y="24" width="8" height="4" fill="currentColor" />
        <rect x="32" y="28" width="8" height="4" fill="currentColor" />
        <rect x="24" y="32" width="8" height="4" fill="currentColor" />
        <rect x="16" y="36" width="8" height="4" fill="currentColor" />
        <rect x="16" y="40" width="32" height="4" fill="currentColor" />
      </svg>
    </div>
  );
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size="md" className="text-indigo-400" />
      <span className="font-bold text-xl tracking-wider font-mono">ZYNC</span>
    </div>
  );
} 