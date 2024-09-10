import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium' }) => {
  let sizeClass = '';
  switch (size) {
    case 'small':
      sizeClass = 'w-8 h-8';
      break;
    case 'medium':
      sizeClass = 'w-12 h-12';
      break;
    case 'large':
      sizeClass = 'w-16 h-16';
      break;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ${sizeClass}`}
    />
  );
};

export default Avatar;