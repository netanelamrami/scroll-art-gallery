export interface GalleryImage {
  mediumSrc: string;
  largeSrc: string;
  id: string;
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  width: number;
  height: number;
  albumId?: string;
}

export interface Album {
  id: string;
  name: string;
  imageCount: number;
  thumbnail?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}