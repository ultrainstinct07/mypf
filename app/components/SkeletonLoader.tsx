'use client';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'rect';
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export default function SkeletonLoader({
  variant = 'rect',
  className = '',
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-dark-lighter';

  const variantClasses = {
    card: 'rounded-2xl',
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: width || (variant === 'circle' ? height : undefined),
        height: height || undefined,
      }}
    />
  ));

  return <>{skeletons}</>;
}

