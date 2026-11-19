'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { PROPERTY_IMAGES, type PropertyImageKey } from '@/lib/images';

interface PropertyPhotoProps {
  imageKey: PropertyImageKey;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function PropertyPhoto({
  imageKey,
  alt,
  className = 'object-cover',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: PropertyPhotoProps) {
  const [failed, setFailed] = useState(false);
  const asset = PROPERTY_IMAGES[imageKey] ?? PROPERTY_IMAGES.hero_estate;

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 p-6 text-slate-500">
        <Building2 className="h-8 w-8 stroke-[1.5]" />
        <span className="mt-2 text-xs font-medium text-slate-600">{asset.label}</span>
      </div>
    );
  }

  return (
    <Image
      src={asset.src}
      alt={alt || asset.alt}
      fill
      priority={priority}
      sizes={sizes}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
