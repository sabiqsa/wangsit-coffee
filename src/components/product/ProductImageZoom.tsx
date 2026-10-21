'use client';

import { useState, useRef, useCallback } from 'react';
import { IconButton } from '@mui/material';
import { ZoomIn, ZoomOut } from '@mui/icons-material';
import styles from './ProductImageZoom.module.scss';

interface Props {
  images: string[];
  alt: string;
}

const ZOOM_STEP = 0.5;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

export default function ProductImageZoom({ images, alt }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLImageElement>(null);

  const currentImage = images[activeIdx] ??
    `https://placehold.co/600x600?text=${encodeURIComponent(alt)}`;

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + ZOOM_STEP, MAX_ZOOM)), []);
  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - ZOOM_STEP, MIN_ZOOM);
      if (next === 1) setOrigin({ x: 50, y: 50 });
      return next;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (scale === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
      setScale(2);
    } else {
      setScale(1);
      setOrigin({ x: 50, y: 50 });
    }
  }, [scale]);

  const handleTouchStart = useRef<{ dist: number; scale: number } | null>(null);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (!handleTouchStart.current) {
      handleTouchStart.current = { dist, scale };
      return;
    }

    const ratio = dist / handleTouchStart.current.dist;
    const newScale = Math.min(Math.max(handleTouchStart.current.scale * ratio, MIN_ZOOM), MAX_ZOOM);
    setScale(newScale);
  }, [scale]);

  const handleTouchEnd = useCallback(() => {
    handleTouchStart.current = null;
  }, []);

  const handleThumbClick = (idx: number) => {
    setActiveIdx(idx);
    setScale(1);
    setOrigin({ x: 50, y: 50 });
  };

  return (
    <div>
      <div className={styles.container}>
        <img
          ref={imgRef}
          src={currentImage}
          alt={alt}
          className={`${styles.mainImage} ${scale > 1 ? styles.zoomed : ''}`}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
          onClick={handleClick}
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          draggable={false}
        />
        <div className={styles.controls}>
          <IconButton className={styles.zoomBtn} onClick={zoomIn} disabled={scale >= MAX_ZOOM} size="small" aria-label="Perbesar gambar">
            <ZoomIn fontSize="small" />
          </IconButton>
          <IconButton className={styles.zoomBtn} onClick={zoomOut} disabled={scale <= MIN_ZOOM} size="small" aria-label="Perkecil gambar">
            <ZoomOut fontSize="small" />
          </IconButton>
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${alt} ${idx + 1}`}
              className={`${styles.thumbnail} ${idx === activeIdx ? styles.active : ''}`}
              onClick={() => handleThumbClick(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
