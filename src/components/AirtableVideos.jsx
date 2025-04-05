import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import PlayButton from './PlayButton';
import { fetchRandomNewVideo } from '../services/airtable';

const AirtableVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: null, y: null });
  const [touchEnd, setTouchEnd] = useState({ x: null, y: null });

  // Minimum swipe distance in pixels to trigger navigation
  const minSwipeDistance = 50;

  useEffect(() => {
    fetchInitialVideos();
  }, []);

  const handleTouchStart = (e) => {
    setTouchEnd({ x: null, y: null });
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x || !touchStart.y || !touchEnd.y) return;

    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;

    // Determine if the swipe is more horizontal or vertical
    if (Math.abs(xDistance) > Math.abs(yDistance)) {
      // Horizontal swipe
      const isLeftSwipe = xDistance > minSwipeDistance;
      const isRightSwipe = xDistance < -minSwipeDistance;

      if (isLeftSwipe) {
        // Swipe left - next video
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else {
          // At the end, fetch new video
          fetchNextVideo();
          setCurrentVideoIndex(prev => prev + 1);
        }
      } else if (isRightSwipe) {
        // Swipe right - previous video
        if (currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
        }
      }
    } else {
      // Vertical swipe
      const isUpSwipe = yDistance > minSwipeDistance;
      const isDownSwipe = yDistance < -minSwipeDistance;

      if (isUpSwipe) {
        // Swipe up - next video
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else {
          // At the end, fetch new video
          fetchNextVideo();
          setCurrentVideoIndex(prev => prev + 1);
        }
      } else if (isDownSwipe) {
        // Swipe down - previous video
        if (currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
        }
      }
    }
  };

  const fetchInitialVideos = async () => {
    setLoading(true);
    try {
      const video = await fetchRandomNewVideo();
      setVideos([video]);
    } catch (error) {
      console.error('Error fetching initial video:', error);
      setError('Failed to load videos');
    }
    setLoading(false);
  };

  const handlePlayButtonClick = () => {
    setHasInteracted(true);
  };

  const fetchNextVideo = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const nextVideo = await fetchRandomNewVideo();
      setVideos(prev => [...prev, nextVideo]);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
    setLoading(false);
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex === videos.length - 1) {
      // If we're at the last video, fetch a new one
      fetchNextVideo();
    }
    setCurrentVideoIndex(prev => prev + 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') {
      // Next video
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else {
        // At the end, fetch new video
        fetchNextVideo();
        setCurrentVideoIndex(prev => prev + 1);
      }
    } else if (e.key === 'ArrowLeft' && currentVideoIndex > 0) {
      // Previous video
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [videos.length, currentVideoIndex]);

  // Prefetch next video when we're viewing the last one
  useEffect(() => {
    if (currentVideoIndex === videos.length - 1) {
      fetchNextVideo();
    }
  }, [currentVideoIndex, videos.length]);

  // Early return for initial interaction screen
  if (!hasInteracted) {
    return <PlayButton onClick={handlePlayButtonClick} />;
  }

  // Early return if no videos
  if (videos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video container */}
      <div className="video-container">
        <VideoCard 
          video={videos[currentVideoIndex]} 
          isActive={true}
          onVideoEnd={handleVideoEnd}
          hasUserInteracted={hasInteracted}
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default AirtableVideos; 