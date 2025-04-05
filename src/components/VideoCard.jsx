import { useRef, useEffect, useState } from 'react';

const VideoCard = ({ video, isActive, onVideoEnd, hasUserInteracted }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStalled, setIsStalled] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const stallTimeout = useRef(null);
  const playAttemptTimeout = useRef(null);

  // Handle video loading and errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    console.log('VideoCard effect:', {
      isActive,
      videoUrl: video.videoUrl,
      readyState: videoElement.readyState
    });

    const handleLoadedData = () => {
      console.log('Video loaded:', {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState
      });
      setIsLoading(false);
      setError(null);
      setIsStalled(false);
      
      // If this video is active, try to play it
      if (isActive) {
        attemptPlay();
      }
    };

    const handleError = (event) => {
      const videoElement = event.target;
      let errorMessage = 'Unknown error';
      let errorDetails = {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState,
        networkState: videoElement.networkState
      };
      
      if (videoElement.error) {
        switch (videoElement.error.code) {
          case 1:
            errorMessage = 'Video loading aborted';
            break;
          case 2:
            errorMessage = 'Network error while loading video';
            break;
          case 3:
            errorMessage = 'Video decoding failed - the video might be corrupted';
            break;
          case 4:
            const format = video.videoUrl.split('.').pop().toLowerCase();
            const mimeType = `video/${format}`;
            errorMessage = `Video format not supported (${format})`;
            errorDetails.format = format;
            errorDetails.mimeType = mimeType;
            errorDetails.supportLevel = videoElement.canPlayType(mimeType);
            break;
        }
        errorMessage += ` (${videoElement.error.message})`;
      }

      console.warn('Video loading error:', {
        message: errorMessage,
        ...errorDetails,
        errorObject: videoElement.error
      });
      
      setError(errorMessage);
      setIsLoading(false);
      setIsStalled(false);
    };

    const handleStalled = () => {
      console.log('Video stalled:', {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState
      });
      
      // Clear any existing stall timeout
      if (stallTimeout.current) {
        clearTimeout(stallTimeout.current);
      }

      // Only set stalled state if it persists for more than 1 second
      stallTimeout.current = setTimeout(() => {
        if (!isActive) return; // Don't handle stalls for inactive videos
        
        console.warn('Video stalled:', video.videoUrl);
        setIsStalled(true);
        setIsLoading(true);

        // Try to recover from stall
        recoverFromStall();
      }, 1000);
    };

    const handleWaiting = () => {
      console.log('Video waiting:', {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState
      });
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log('Video can play:', {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState
      });
      setIsLoading(false);
      setIsStalled(false);
    };

    const handleProgress = () => {
      // Check if we have enough data to play
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
        const timeRemaining = bufferedEnd - videoElement.currentTime;
        
        // If we have more than 2 seconds buffered, we're good to play
        if (timeRemaining >= 2) {
          setIsStalled(false);
          setIsLoading(false);
        }
      }
    };

    const handlePlaying = () => {
      console.log('Video playing:', {
        videoUrl: video.videoUrl,
        readyState: videoElement.readyState
      });
      setIsLoading(false);
      setIsStalled(false);
      if (stallTimeout.current) {
        clearTimeout(stallTimeout.current);
        stallTimeout.current = null;
      }
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('stalled', handleStalled);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('playing', handlePlaying);

    // Start loading the video
    videoElement.load();

    return () => {
      console.log('Cleaning up video:', {
        videoUrl: video.videoUrl,
        isActive
      });
      if (stallTimeout.current) {
        clearTimeout(stallTimeout.current);
      }
      if (playAttemptTimeout.current) {
        clearTimeout(playAttemptTimeout.current);
      }
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('stalled', handleStalled);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('progress', handleProgress);
      videoElement.removeEventListener('playing', handlePlaying);
    };
  }, [video.videoUrl, isActive]);

  const recoverFromStall = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) return;

    try {
      // Save current time and playback state
      const currentTime = videoElement.currentTime;
      const wasPlaying = !videoElement.paused;
      
      // Reset the video source
      videoElement.src = video.videoUrl;
      await videoElement.load();
      
      // Restore position
      videoElement.currentTime = currentTime;
      
      // If it was playing, try to resume
      if (wasPlaying) {
        await attemptPlay();
      }
      
      setIsStalled(false);
      setIsLoading(false);
    } catch (error) {
      console.warn('Failed to recover from stall:', error);
    }
  };

  const attemptPlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive || !hasUserInteracted) return;

    try {
      await videoElement.play();
      console.log('Video playing successfully');
    } catch (error) {
      console.warn('Play attempt failed:', error);
    }
  };

  // Handle video playback when active state changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      attemptPlay();
    } else {
      videoElement.pause();
    }
  }, [isActive]);

  // Handle video end
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      if (isLooping) {
        videoElement.currentTime = 0;
        attemptPlay();
      } else {
        onVideoEnd();
      }
    };

    videoElement.addEventListener('ended', handleEnded);
    return () => videoElement.removeEventListener('ended', handleEnded);
  }, [onVideoEnd, isLooping]);

  const handleVideoClick = () => {
    const videoElement = videoRef.current;
    if (!videoElement || !hasUserInteracted) return;

    if (videoElement.paused) {
      attemptPlay();
    } else {
      videoElement.pause();
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  return (
    <div className="w-full h-full bg-black relative">
      {/* Loop button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLoop();
        }}
        className={`absolute top-6 right-6 z-50 px-4 py-2 rounded-full 
                   backdrop-blur-md transition-all duration-300 text-lg
                   shadow-lg flex items-center gap-2
                   ${isLooping 
                     ? 'bg-amber-400 text-black font-bold border-2 border-amber-400 shadow-amber-400/30' 
                     : 'bg-black/60 text-white border-2 border-white/50 hover:border-amber-400 hover:text-amber-400 hover:scale-105'
                   }`}
      >
        <span className="text-2xl leading-none">{isLooping ? '🔁' : '🔄'}</span>
        <span className="font-medium">{isLooping ? 'Loop ON' : 'Loop'}</span>
      </button>

      {/* Loading overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-white text-center p-4">
            <p>Failed to load video</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        </div>
      )}
      
      {/* Video container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
          onClick={handleVideoClick}
        />
      </div>
      
      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
        <h3 className="text-xl font-semibold mb-2 text-white">{video.title}</h3>
        <p className="text-gray-200">{video.description}</p>
      </div>

      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer bg-transparent z-10"
        onClick={handleVideoClick}
      />
    </div>
  );
};

export default VideoCard; 