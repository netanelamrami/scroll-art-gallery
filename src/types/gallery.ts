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
  photoHeight?: 0;
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