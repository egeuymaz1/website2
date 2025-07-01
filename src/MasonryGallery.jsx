// src/MasonryGallery.jsx
import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import './App.css';

const breakpointColumnsObj = {
  default: 10,
  1800: 8,
  1400: 6,
  1000: 4,
  700: 2,
  500: 1
};

const MasonryGallery = () => {
  const [mediaList, setMediaList] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetch('/mediaList.json')
      .then(res => res.json())
      .then(data => setMediaList(data))
      .catch(err => console.error('JSON Load Error', err));
  }, []);

  return (
    <div className="gallery-container">
      {activeVideo !== null && (
        <div className="overlay" onClick={() => setActiveVideo(null)} />
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {mediaList.map((item, index) => {
          if (item.type === 'image') {
            return (
              <div key={index} className={activeVideo !== null ? 'faded' : ''}>
                <img
                  src={item.src}
                  alt={`img-${index}`}
                  className="media-item"
                />
              </div>
            );
          } else if (item.type === 'video') {
            const isActive = activeVideo === index;

            return (
              <div key={index} className={activeVideo !== null && !isActive ? 'faded' : ''}>
                <video
                  src={item.src}
                  loop
                  autoPlay
                  muted={!isActive}
                  playsInline
                  preload="auto"
                  onClick={() => setActiveVideo(index)}
                  className={`media-item video-item ${isActive ? 'fixed-active' : ''}`}
                />
              </div>
            );
          }
          return null;
        })}
      </Masonry>
    </div>
  );
};

export default MasonryGallery;