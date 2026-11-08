import React, { useState, useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  clientId?: string;
}

/**
 * Responsive Google AdSense placement.
 * Automatically collapses and removes itself from the DOM if no ad is served
 * or while in local development/unconfigured state to prevent blank spaces.
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
        // Check if AdSense successfully populated an iframe
        const timer = setTimeout(() => {
          const adContainer = document.getElementById(`ad-slot-${slotId}`);
          const hasIframe = adContainer?.querySelector('iframe');
          if (hasIframe) {
            setAdLoaded(true);
          }
        }, 1500);

        return () => clearTimeout(timer);
      }
    } catch {
      setAdLoaded(false);
    }
  }, [isConfigured, slotId]);

  // If there is no real ad loaded or AdSense is not configured, hide completely
  if (!isConfigured || !adLoaded) {
    return null;
  }

  return (
    <div
      id={`ad-slot-${slotId}`}
      className="mx-4 my-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center transition-all"
    >
      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 px-1">
        <span>SPONSORED</span>
        <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">Ad</span>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
