// Download utility functions
export const downloadImage = async (src: string, filename: string) => {
  try {
    const response = await fetch(src, { mode: 'cors' });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};

export const downloadMultipleImages = async (images: Array<{src: string, id: string}>) => {
  const results = await Promise.all(
    images.map(async (image, index) => {
      await new Promise(resolve => setTimeout(resolve, index * 500)); // Delay between downloads
      return downloadImage(image.src, `image-${image.id}.jpg`);
    })
  );
  
  return results.every(result => result);
};

export const getDownloadFormData = () => {
  const saved = localStorage.getItem('downloadFormData');
  return saved ? JSON.parse(saved) : null;
};

export const saveDownloadFormData = (data: any) => {
  localStorage.setItem('downloadFormData', JSON.stringify(data));
};