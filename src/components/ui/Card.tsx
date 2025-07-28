import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'cyber' | 'glass';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true 
}: CardProps) {
  const variantClasses = {
    default: 'bg-gray-900 border border-gray-700',
    cyber: 'bg-black border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10'
  };

  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-cyan-400/60' 
    : '';

  return (
    <div className={`
      rounded-lg p-6 
      ${variantClasses[variant]} 
      ${hoverClasses} 
      ${className}
    `}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-white font-mono ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-gray-300 ${className}`}>
      {children}
    </div>
  );
} 