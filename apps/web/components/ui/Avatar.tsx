import React from 'react';

interface AvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Avatar({ src, size = 'md', hasStory, isOnline, onClick, className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative ${className} flex-shrink-0 cursor-pointer`} onClick={onClick}>
       {hasStory && (
         <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 opacity-80 blur-[2px]" />
       )}
      <img 
        src={src} 
        alt="avatar" 
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-neutral-900 relative z-10 shadow-sm`} 
      />
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full z-20"></div>
      )}
    </div>
  );
}