import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { Gallery } from "@/components/gallery/Gallery";
import { NotificationSubscription } from "@/components/notifications/NotificationSubscription";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { LeadGenerationModal } from "@/components/leads/LeadGenerationModal";
import { DownloadModal } from "@/components/gallery/DownloadModal";
import { apiService } from "../data/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMultiUserAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";

type NotificationStep = "collapsed" | "contact" | "otp" | "complete" | "hidden";

const Index = () => {
  const { eventLink } = useParams();
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my' >('all');
  // const [showFloatingNavbar, setShowFloatingNavbar] = useState(true);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [favoriteImages, setFavoriteImages] = useState<Set<string>>(new Set());
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isLoadingAllPhotos, setIsLoadingAllPhotos] = useState(false);
  const [isLoadingMyPhotos, setIsLoadingMyPhotos] = useState(false);
  const [showNotificationSubscription, setShowNotificationSubscription] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(3);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [initialStepNotification, setInitialStepNotification] = useState<NotificationStep>("collapsed");

  const [galleryImages, setGalleryImages] = useState([]);
  const [userImages, setUserImages] = useState([]); 
  
  // Use multi-user auth system
  const { isAuthenticated, addUser,  currentUser, setUsers } = useMultiUserAuth();
  
  // Force re-render when authentication state changes
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const currentEventLink = eventLink ;
    apiService.getEvent(currentEventLink)
      .then(eventData => {        
        if (!eventData) {
          navigate('/event-not-found/' + currentEventLink);
          return null; 
        }
        
        if (eventData.isDeleted === true || eventData.isActive === false) {
          navigate('/event-inactive/' + currentEventLink);
          return null; 
        }
        
        setEvent(eventData);
        
        return apiService.getEventImagesFullData(currentEventLink);
      })
      .then(imagesData => {
        if (!imagesData) return; // אם נעברנו לדף user
        const formattedImages = imagesData.map((imageData: any, index: number) => ({
          id: imageData.name || `image-${index}`,
          src: imageData.smallUrl,
          mediumSrc: imageData.medUrl,
          largeSrc: imageData.largeUrl,
          alt: `Gallery image ${index + 1}`,
          size: `${imageData.size} MB`,
          width: 400,
          height: 300,
          albumId: imageData.albomId?.toString() || 'main',
          photoHeight: imageData.photoHeight || 0 
        }));
        setGalleryImages(formattedImages);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);

        navigate('/event-not-found/' + currentEventLink);
      });
  }, [eventLink, navigate]);

  // Lead generation modal timer - show after 15 seconds if not shown before
  useEffect(() => {
    if (!showGallery || galleryImages.length === 0 || showLeadModal) return;
    
    // Check if modal was already shown in this browser
    const hasSeenLeadModal = localStorage.getItem('hasSeenLeadModal');
    if (hasSeenLeadModal) return;

    // const timer = setTimeout(() => {
    //   setShowLeadModal(true);
    // }, 15000); // 15 seconds

    // return () => clearTimeout(timer);
  }, [showGallery, galleryImages.length, showLeadModal]);

  // Load favorite images from localStorage on mount
  useEffect(() => {
    const savedFavorites = sessionStorage.getItem('favoriteImages');

    if (savedFavorites) {
      setFavoriteImages(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleViewAllPhotos = () => {
    setIsLoadingAllPhotos(true);
    setGalleryType('all');

    // Simulate loading delay for server response
    setTimeout(() => {
      setShowGallery(true);
      setIsLoadingAllPhotos(false);
      // Smooth scroll to gallery
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 300);
    }, 1000);
  };

  const handleViewMyPhotos = () => {
    setIsLoadingMyPhotos(true);
    setTimeout(() => {
      setShowAuthFlow(true);
      setIsLoadingMyPhotos(false);
    }, 300);
  };


  // פונקציה נפרדת לטעינת תמונות המשתמש
  const loadUserImages = async (user) => {
    setIsLoadingMyPhotos(true);
    try {
      const userId = Number(user.id)//parseInt(sessionStorage.getItem('userid') || '0');
      const eventId = event?.id;
    
      if (userId && eventId) {

        const userImagesData = await apiService.getImages(userId, eventId);
        
        // המרת נתוני התמונות למבנה שהאפליקציה מצפה אליו
        const formattedUserImages = userImagesData?.map((imageData: any, index: number) => ({
          id: imageData.name || `user-image-${index}`,
          src: imageData.smallUrl,
          mediumSrc: imageData.medUrl,
          largeSrc: imageData.largeUrl,
          alt: `User image ${index + 1}`,
          size: 'medium' as const,
          width: 400,
          height: 300,
          albumId: imageData.albomId?.toString() || 'main',
           photoHeight: imageData.photoHeight || 0 
        })) || [];
        
        setUserImages(formattedUserImages);
      }
    } catch (error) {
      console.error('Error loading user images:', error);
      setUserImages([]);
    }
    setIsLoadingMyPhotos(false);
  };
  const handleViewFavorites = () => {
    //setGalleryType('favorites');
    setShowGallery(true);
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 300);
  };

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbum(albumId);
    if (albumId === 'favorites') {
      handleViewFavorites();
    } else {
      // For other albums, show all images for now
      //setGalleryType('all');
      setShowGallery(true);
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 300);
    }
  };

const handleToggleFavorite = (imageId: string) => {
  setFavoriteImages(prevFavorites => {
    const newFavorites = new Set(prevFavorites);

    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }

    const arrayFavorites = Array.from(newFavorites);
    // localStorage.setItem('favoriteImages', JSON.stringify(arrayFavorites));
    sessionStorage.setItem('favoriteImages', JSON.stringify(arrayFavorites));
    return newFavorites;
  });
};


const handleAuthComplete = async (user: User) => {
    setShowAuthFlow(false);
    addUser(user);

    
    // Force immediate re-render
    forceUpdate({});
    
    // טוען את התמונות של המשתמש
    await loadUserImages(user);
    
    // Set gallery state
    setGalleryType('my');
    setShowGallery(true);
    
    // Show notification subscription for selfie-only users
  
      setTimeout(() => {
        if (!event.needDetect && !user.sendNotification) {
            setShowNotificationSubscription(true);
          }
      }, 2000);
      
    
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
        });
      }, 300);
 };

    const handleNotificationOpen = (event: CustomEvent) => {
      console.log('Notification open event received:', event.detail);
      setInitialStepNotification(event.detail)
      setShowNotificationSubscription(true);
    };
  // Listen for exit selection mode event and gallery type toggle
  useEffect(() => {
    const handleExitSelectionMode = () => {
      setSelectionMode(false);
      setSelectedImages(new Set());
    };

    const handleSwitchToAllPhotos = (event) => {

        setGalleryType('all');
    };

    const handleSwitchToMyPhotos = async (event) => {
      const user = event.detail;
     if (!isAuthenticated) {
          setShowAuthFlow(true);
          return;
        }

        await loadUserImages(user ?? currentUser);
        setGalleryType('my');
        setShowGallery(true);
      
    };

    // Listen for user switch events
    const handleAuthStateChanged = async () => {
      if (isAuthenticated && galleryType === 'my') {        
        await loadUserImages(currentUser);
      }
    };

    window.addEventListener('exitSelectionMode', handleExitSelectionMode);
    window.addEventListener('switchToAllPhotos', handleSwitchToAllPhotos);
    window.addEventListener('switchToMyPhotos', handleSwitchToMyPhotos);
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    window.addEventListener('notificationOpen', handleNotificationOpen);

    return () => {
      window.removeEventListener('exitSelectionMode', handleExitSelectionMode);
      window.removeEventListener('switchToAllPhotos', handleSwitchToAllPhotos);
      window.removeEventListener('switchToMyPhotos', handleSwitchToMyPhotos);
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
      window.removeEventListener('notificationOpen', handleNotificationOpen);

    };
  }, [isAuthenticated]);

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };

  const handleNotificationSubscribe = (contact: string, notifications: boolean) => {
    setShowNotificationSubscription(false);
  };

  const handleAuthCancel = () => {
    setShowAuthFlow(false);
  };

  const handleLeadModalClose = () => {
    localStorage.setItem('hasSeenLeadModal', 'true');
    setShowLeadModal(false);
  };

  // Track scroll position to hide floating navbar when near hero
  useEffect(() => {
    if (!showGallery) return;

    const handleScroll = () => {
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;

      // const galleryTop = galleryElement.offsetTop;
      // const scrollTop = window.scrollY;
      // const windowHeight = window.innerHeight;
      
      // Hide floating navbar if user scrolled back near the hero section
      // Show it when user is well into the gallery
      // const shouldShow = scrollTop > galleryTop;
      // setShowFloatingNavbar(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGallery]);

  // Filter images based on gallery type and selected album
  const filteredImages = (() => {
    let baseImages = galleryImages;    
    if (galleryType === 'my' && isAuthenticated) {
      baseImages = userImages; // שימוש בתמונות המשתמש שנטענו מהשרת
    }
    if(event?.withPhotos){
      return baseImages;
    }
 
    return []

    // For now, all albums show all images (you can customize this later)
  })();

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <WeddingHero 
        event={event} 
        onViewAllPhotos={handleViewAllPhotos}
        onViewMyPhotos={handleViewMyPhotos}
        isLoadingAllPhotos={isLoadingAllPhotos}
        isLoadingMyPhotos={isLoadingMyPhotos}
      />
      
      {showGallery && (
        <div id="gallery">
          <Gallery 
            event={event} 
            images={filteredImages}
            favoriteImages={favoriteImages}
            onToggleFavorite={handleToggleFavorite}
            galleryType={galleryType}
            onAlbumClick={handleAlbumClick}
            selectedAlbum={selectedAlbum}
            selectionMode={selectionMode}
            selectedImages={selectedImages}
            // onAuthComplete={handleAuthComplete}
            onImageSelect={(imageId) => {
              const newSelected = new Set(selectedImages);
              if (newSelected.has(imageId)) {
                newSelected.delete(imageId);
              } else {
                newSelected.add(imageId);
              }
              setSelectedImages(newSelected);
            }}
            columns={columns}
          />

        </div>
      )}
      
      {/* Auth Flow Modal */}
      {showAuthFlow && event && (
        <>
          <AuthFlow 
            event={event}
            onComplete={handleAuthComplete}
            onCancel={handleAuthCancel}
            setUsers={setUsers}
          />
        </>
      )}

      {/* Lead Generation Modal */}
      <LeadGenerationModal 
        isOpen={showLeadModal}
        onClose={handleLeadModalClose}
      />

      {showNotificationSubscription && (
        <NotificationSubscription
          event={event}
          onSubscribe={handleNotificationSubscribe}
          onClose={() => setShowNotificationSubscription(false)}
          initialStep={initialStepNotification}
        />
      )}
      
  
      {/* Download All Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        imageCount={galleryImages.length}
        images={galleryImages}
        autoDownload={galleryImages.length <= 20}
        albumName={event?.name || "כל התמונות"}
        galleryType={galleryType}
        event={event}
      />

    </div>
  );
};

export default Index;
