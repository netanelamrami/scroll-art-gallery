// Share utility functions

export const shareImage = async (imageUrl: string, imageName: string) => {
  try {
    // Check if Web Share API is supported and can share files
    if (navigator.share && navigator.canShare) {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const file = new File([blob], `${imageName}`, { type: blob.type });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          // title: 'תמונה מהגלריה',
          // text: 'שתף תמונה זו'
        });
        return { success: true, method: 'native' };
      }
    }
    
    // Fallback - return options for manual selection
    return { success: true, method: 'options', imageUrl, imageName };
  } catch (error) {
    console.error('Error sharing image:', error);
    return { success: false, error };
  }
};

export const shareToWhatsApp = async (imageUrl: string, imageName: string) => {
  try {
    // On mobile, try to open WhatsApp directly with intent
    if (/Android/i.test(navigator.userAgent)) {
      // For Android, try to use intent
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      
      // Create a temporary file URL
      const fileUrl = URL.createObjectURL(blob);
      
      // Try to use Android intent for sharing image
      const intentUrl = `intent://send?type=image/*&extra_stream=${encodeURIComponent(fileUrl)}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
      window.location.href = intentUrl;
      
      // Cleanup after a delay
      setTimeout(() => URL.revokeObjectURL(fileUrl), 5000);
      
      return true;
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // For iOS, open WhatsApp URL scheme
      window.open('whatsapp://send', '_blank');
      return true;
    } else {
      // Desktop fallback - open WhatsApp Web
      window.open('https://web.whatsapp.com/', '_blank');
      return true;
    }
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    return false;
  }
};

export const shareToInstagram = async (imageUrl: string, imageName: string) => {
  try {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS - try Instagram URL scheme for stories
      window.open('instagram://story-camera', '_blank');
      return true;
    } else if (/Android/i.test(navigator.userAgent)) {
      // Android - try Instagram intent
      window.open('intent://instagram.com/_n/story-camera#Intent;package=com.instagram.android;scheme=https;end', '_blank');
      return true;
    } else {
      // Desktop - open Instagram web
      window.open('https://www.instagram.com/', '_blank');
      return true;
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    return false;
  }
};

export const downloadImageForSharing = async (imageUrl: string, imageName: string) => {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${imageName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};