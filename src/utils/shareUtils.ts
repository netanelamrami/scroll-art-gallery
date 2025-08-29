// Share utility functions

export const shareImage = async (imageUrl: string, imageName: string) => {
  try {
    // First, fetch the image and convert to blob
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    
    // Check if Web Share API is supported and can share files
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], `${imageName}.jpg`, { type: blob.type });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'תמונה מהגלריה',
          text: 'שתף תמונה זו'
        });
        return true;
      }
    }
    
    // Fallback: Create downloadable link for manual sharing
    const url = URL.createObjectURL(blob);
    
    // For mobile devices, try to open specific apps
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Try WhatsApp first
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent('שתף תמונה זו')}`;
      window.open(whatsappUrl, '_blank');
      
      // Also provide download option
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Desktop: Download the image
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error sharing image:', error);
    return false;
  }
};

export const shareToWhatsApp = async (imageUrl: string, imageName: string) => {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${imageName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Open WhatsApp with message
    setTimeout(() => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('שתף תמונה זו - הורד מהקישור למעלה')}`;
      window.open(whatsappUrl, '_blank');
    }, 500);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    return false;
  }
};

export const shareToInstagram = async (imageUrl: string, imageName: string) => {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    // Download the image first
    const link = document.createElement('a');
    link.href = url;
    link.download = `${imageName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Try to open Instagram (mobile)
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(() => {
        window.open('instagram://camera', '_blank');
      }, 500);
    }
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    return false;
  }
};