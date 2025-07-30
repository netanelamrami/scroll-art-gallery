export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  width: number;
  height: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}