import type { StaticImageData } from 'next/image';
import heroEstate from '@/src/assets/images/hero_architecture_estate_1795095226074.jpg';
import penthouseInterior from '@/src/assets/images/property_penthouse_interior_1795095424905.jpg';
import modernVilla from '@/src/assets/images/property_modern_villa_1795095224495.jpg';
import commercialLoft from '@/src/assets/images/property_commercial_loft_1795095223894.jpg';
import coastalResidence from '@/src/assets/images/property_coastal_residence_1795095233148.jpg';

export type PropertyImageKey =
  | 'hero_estate'
  | 'penthouse'
  | 'villa'
  | 'commercial'
  | 'coastal';

export const PROPERTY_IMAGES: Record<
  PropertyImageKey,
  { src: StaticImageData; alt: string; label: string }
> = {
  hero_estate: {
    src: heroEstate,
    alt: 'Contemporary limestone and glass residence with infinity reflecting pool at golden hour',
    label: 'Limestone Estate',
  },
  penthouse: {
    src: penthouseInterior,
    alt: 'Downtown penthouse living room with floor-to-ceiling skyline windows and oak floors',
    label: 'Skyline Penthouse',
  },
  villa: {
    src: modernVilla,
    alt: 'Modern hillside villa with white stucco, cedar soffits, and twilight pool terrace',
    label: 'Hillside Villa',
  },
  commercial: {
    src: commercialLoft,
    alt: 'Boutique mixed-use commercial limestone building with dark steel window frames',
    label: 'Commercial Mixed-Use',
  },
  coastal: {
    src: coastalResidence,
    alt: 'Serene coastal modern home with pale stone courtyard and ocean horizon view',
    label: 'Coastal Residence',
  },
};
