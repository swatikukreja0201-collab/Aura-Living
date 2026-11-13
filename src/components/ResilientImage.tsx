import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#ebe8e1] text-[#4a4640] p-6 text-center ${className}`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
          className="mb-3 opacity-60"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
        <span className="label-caps text-[#7b766f]">AURA Archive Plate</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
