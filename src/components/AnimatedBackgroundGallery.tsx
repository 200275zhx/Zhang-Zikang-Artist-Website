// AnimatedBackgroundGallery.tsx
import React, { useMemo } from 'react';
import styles from '../style/AnimatedBackgroundGallery.module.css';

interface Props {
  images: string[];
  /** Total time per image (ms): fade-in + hold + fade-out */
  duration?: number;      // default 5000
  /** How long to fade in (ms) */
  fadeInDuration?: number;  // default 1000
  /** How long to fade out (ms) */
  fadeOutDuration?: number; // default 1000
  /** Vertical start offset (px) above the viewport */
  offset?: number;        // default 100
}

const AnimatedBackgroundGallery: React.FC<Props> = ({
  images,
  duration = 5000,
  fadeInDuration = 1000,
  fadeOutDuration = 1000,
  offset = 100,
}) => {
  // Time between the start of one image’s fade-in and the next image’s fade-in
  const fadeOverlapInterval = duration - fadeOutDuration; // 4000 ms
  // One full loop through all images
  const ringPeriod = images.length * fadeOverlapInterval; // 4 * 4000 = 16000 ms

  // Keyframe percentages (all relative to ringPeriod):
  const slideEndPct      = (duration     / ringPeriod) * 100; // 5000/16000*100 = 31.25%
  const fadeInEndPct     = (fadeInDuration  / ringPeriod) * 100; // 1000/16000*100 = 6.25%
  const fadeOutStartPct  = (fadeOverlapInterval / ringPeriod) * 100; // 4000/16000*100 = 25%
  const fadeOutEndPct    = (duration     / ringPeriod) * 100; // 31.25%

  // Inject dynamic keyframes so percentages adapt if you change durations
  const keyframes = useMemo(() => `
@keyframes slideDown {
  0%                 { transform: translateX(-50%) translateY(calc(-1*var(--offset))); }
  ${slideEndPct}%    { transform: translateX(-50%) translateY(0); }
  100%               { transform: translateX(-50%) translateY(0); }
}
@keyframes fadeInOut {
  0%                 { opacity: 0; }
  ${fadeInEndPct}%   { opacity: 1; }
  ${fadeOutStartPct}%{ opacity: 1; }
  ${fadeOutEndPct}%  { opacity: 0; }
  100%               { opacity: 0; }
}
`, [slideEndPct, fadeInEndPct, fadeOutStartPct, fadeOutEndPct]);

  return (
    <>
      <style>{keyframes}</style>
      <div
        className={styles.container}
        style={{
          '--offset': `${offset}px`,
        } as React.CSSProperties}
      >
        {images.map((src, idx) => {
          const delay = idx * fadeOverlapInterval;
          return (
            <img
              key={idx}
              src={src}
              className={styles.image}
              style={{
                animation: `
                  slideDown ${ringPeriod}ms linear infinite ${delay}ms,
                  fadeInOut ${ringPeriod}ms linear infinite ${delay}ms
                `,
                animationFillMode: 'both',
              } as React.CSSProperties}
              alt=""
              aria-hidden="true"
            />
          );
        })}
      </div>
    </>
  );
};

export default AnimatedBackgroundGallery;
