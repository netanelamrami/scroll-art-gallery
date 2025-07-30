import { GalleryImage } from "@/types/gallery";

const unsplashBaseUrl = "https://images.unsplash.com";

export const generateGalleryImages = (count: number = 2000): GalleryImage[] => {
  const imageIds = [
    { id: 'photo-1488590528505-98d2b5aba04b', width: 6000, height: 4000 },
    { id: 'photo-1461749280684-dccba630e2f6', width: 3543, height: 2365 },
    { id: 'photo-1581090464777-f3220bbe1b8b', width: 2432, height: 3648 },
    { id: 'photo-1472396961693-142e6e269027', width: 3634, height: 5998 },
    { id: 'photo-1509316975850-ff9c5deb0cd9', width: 3072, height: 4608 },
    { id: 'photo-1500673922987-e212871fec22', width: 6000, height: 4000 },
    { id: 'photo-1488972685288-c3fd157d7c7a', width: 2400, height: 1600 },
    { id: 'photo-1459767129954-1b1c1f9b9ace', width: 5760, height: 3840 },
    { id: 'photo-1433832597046-4f10e10ac764', width: 1942, height: 2913 },
    { id: 'photo-1517022812141-23620dba5c23', width: 2742, height: 1251 },
    { id: 'photo-1582562124811-c09040d0a901', width: 7504, height: 10000 },
    { id: 'photo-1535268647677-300dbf3d78d1', width: 3057, height: 4585 },
  ];

  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  
  return Array.from({ length: count }, (_, index) => {
    const imageData = imageIds[index % imageIds.length];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    // Calculate responsive dimensions based on size
    let displayWidth: number;
    let displayHeight: number;
    
    const aspectRatio = imageData.width / imageData.height;
    
    switch (size) {
      case 'small':
        displayWidth = 300;
        displayHeight = Math.round(displayWidth / aspectRatio);
        break;
      case 'medium':
        displayWidth = 400;
        displayHeight = Math.round(displayWidth / aspectRatio);
        break;
      case 'large':
        displayWidth = 500;
        displayHeight = Math.round(displayWidth / aspectRatio);
        break;
    }

    return {
      id: `${imageData.id}-${index}`,
      src: `${unsplashBaseUrl}/${imageData.id}?w=${displayWidth}&h=${displayHeight}&fit=crop&crop=faces,center`,
      alt: `Gallery image ${index + 1}`,
      size,
      width: displayWidth,
      height: displayHeight,
    };
  });
};

export const galleryImages = generateGalleryImages();