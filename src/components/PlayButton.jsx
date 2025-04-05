import React from 'react';

const PlayButton = ({ onClick }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        onClick={onClick}
        className="z-40
                   flex items-center justify-center gap-3
                   px-8 py-4 rounded-full
                   bg-black/80 backdrop-blur-sm
                   border-2 border-amber-400
                   text-amber-400 text-lg font-medium
                   hover:bg-amber-400 hover:text-black
                   transition-all duration-300
                   shadow-lg shadow-amber-400/20
                   animate-pulse
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Tap to start with sound</span>
      </button>
    </div>
  );
};

export default PlayButton; 