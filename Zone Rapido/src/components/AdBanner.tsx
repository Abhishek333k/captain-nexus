import React, { useState, useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  clientId?: string;
}

/**
 * Responsive Google AdSense cell.
 * Stays completely invisible (0px height, null DOM) unless Google AdSense
 * is configured AND has successfully returned/rendered a live ad.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = import.meta.env.VITE_ADSENSE_SLOT_ID,
  clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const isConfigured = Boolean(clientId && slotId);

  useEffect(() => {
    if (!isConfigured) {
      setAdLoaded(false);
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});

        // Detect if AdSense successfully loaded and rendered inside the container
        const checkFilled = () => {
          const adContainer = document.getElementById(`ad-slot-${slotId}`);
          const ins = adContainer?.querySelector('ins.adsbygoogle');
          const hasIframe = adContainer?.querySelector('iframe');
          const isFilled = ins?.getAttribute('data-ad-status') === 'filled' || Boolean(hasIframe);
          if (isFilled) {
            setAdLoaded(true);
          }
        };

        const timer1 = setTimeout(checkFilled, 1500);
        const timer2 = setTimeout(checkFilled, 3500);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } catch {
      setAdLoaded(false);
    }
  }, [isConfigured, slotId]);

  // Completely invisible until actual live ad content is served by AdSense
  if (!isConfigured || !adLoaded) {
    return null;
  }

  return (
    <div
      id={`ad-slot-${slotId}`}
      className="p-2 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur shrink-0 transition-all select-none"
    >
      <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1 px-1">
        <span>SPONSORED</span>
        <span className="text-[9px] bg-slate-800/80 px-1 py-0.5 rounded text-slate-400">Ad</span>
      </div>
      <div className="w-full overflow-hidden flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', width: '100%', maxHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
