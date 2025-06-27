'use client';
import React, { useState, useEffect, useRef } from 'react';

const FADEIN_ANIMATION_DURATION = 1000; // # seconds duration for fade in effect
const SLIDE_DOWN_ANIMATION_DURATION = 3000; // # seconds duration for slide down effect
const FADEOUT_ANIMATION_DURATION = 1000; // # seconds duration for fade out effect

const ANIMATION_DURATION = FADEIN_ANIMATION_DURATION + SLIDE_DOWN_ANIMATION_DURATION + FADEOUT_ANIMATION_DURATION; // # seconds duration for fade in, slide down, and fade out
const FADEIN_ANIMATION_DELAY = ANIMATION_DURATION - FADEOUT_ANIMATION_DURATION; // after # seconds start the cross fade effect

const DESIRED_IMAGE_HEIGHT_SCALE_OFFSET = 100; // # scale offset for desired image height by px, vh + DESIRED_IMAGE_HEIGHT_SCALE_OFFSET

interface AnimatedBackgroundGalleryProps {
  images: string[];
}
interface Meta { naturalWidth: number; naturalHeight: number; }
interface ActiveItem {
  src: string;
  key: string;
  meta: Meta;
}

const AnimatedBackgroundGallery: React.FC<AnimatedBackgroundGalleryProps> = ({ images }) => {
  const [metaMap, setMetaMap] = useState<Record<string, Meta>>({});
  const [items, setItems] = useState<ActiveItem[]>([]);
  const currentRef = useRef(0);

  // Preload all images
  useEffect(() => {
    const loadAll = async () => {
      const map: Record<string, Meta> = {};
      await Promise.all(
        images.map(
          src =>
            new Promise<void>(resolve => {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                map[src] = { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
                resolve();
              };
            })
        )
      );
      setMetaMap(map);
    };
    loadAll();
  }, [images]);

  // Spawn items every 2s, after preload
  useEffect(() => {
    if (images.length === 0 || Object.keys(metaMap).length !== images.length) return;
    const spawn = (idx: number) => {
      const src = images[idx];
      const key = `${src}-${Date.now()}`;
      const meta = metaMap[src];
      setItems(prev => [{ src, key, meta }, ...prev]); // new behind
      setTimeout(() => setItems(prev => prev.filter(item => item.key !== key)), ANIMATION_DURATION);
    };
    spawn(0);
    const timer = setInterval(() => {
      currentRef.current = (currentRef.current + 1) % images.length;
      spawn(currentRef.current);
    }, FADEIN_ANIMATION_DELAY);
    return () => clearInterval(timer);
  }, [images, metaMap]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {items.map(({ src, key, meta }) => (
        <AnimatedImage key={key} src={src} meta={meta} />
      ))}
    </div>
  );
};

interface AnimatedImageProps {
  src: string;
  meta: Meta;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, meta }) => {
  const ref = useRef<HTMLImageElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // Track viewport size
  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const { naturalWidth, naturalHeight } = meta;
    const vw = viewport.width;
    const vh = viewport.height;
    if (!vw || !vh) return;
    // Scale to fill at least full width and 120% height
    const scale = Math.max(vw / naturalWidth, (vh + DESIRED_IMAGE_HEIGHT_SCALE_OFFSET) / naturalHeight);
    const scaledW = naturalWidth * scale;
    const scaledH = naturalHeight * scale;
    const widthStyle = `${scaledW}px`;
    const heightStyle = `${scaledH}px`;
    // Align bottom then slide to top
    const initialTY = vh - scaledH;
    const finalTY = 0;
    const el = ref.current;
    if (!el) return;
    // Initial positioning
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '50%';
    el.style.width = widthStyle;
    el.style.height = heightStyle;
    el.style.transform = `translate(-50%, ${initialTY}px)`;
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    // Cross-fade & slide over 3s
    const fadeInOffset = FADEIN_ANIMATION_DURATION / ANIMATION_DURATION;
    const fadeOutOffset = FADEIN_ANIMATION_DELAY / ANIMATION_DURATION;
    const keyframes: Keyframe[] = [
      { transform: `translate(-50%, ${initialTY}px)`, opacity: 0, offset: 0 },
      { transform: `translate(-50%, ${initialTY + (finalTY - initialTY) * fadeInOffset}px)`, opacity: 1, offset: fadeInOffset },
      { transform: `translate(-50%, ${initialTY + (finalTY - initialTY) * fadeOutOffset}px)`, opacity: 1, offset: fadeOutOffset },
      { transform: `translate(-50%, ${finalTY}px)`, opacity: 0, offset: 1 },
    ];
    el.animate(keyframes, { duration: ANIMATION_DURATION, easing: 'ease-out', fill: 'forwards' });
  }, [meta, viewport]);

  return <img ref={ref} src={src} alt="" aria-hidden="true" />;
};

export default AnimatedBackgroundGallery;
