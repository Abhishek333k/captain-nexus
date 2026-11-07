import React from 'react';

interface AdBannerProps {
  slotId?: string;
}

/**
 * Minimalist, Non-invasive Google AdSense responsive ad card.
 * Styled cleanly in dark charcoal to match J1C operations without blocking maps or lists.
 */
export const AdBanner: React.FC<AdBannerProps> = ({ slotId = '1234567890' }) => {
  return (
    <div className="mx-4 my-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 px-1">
        <span>SPONSORED PARTNER</span>
        <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">Ad</span>
      </div>
      <div className="min-h-[60px] flex items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="text-[11px] text-slate-500 py-2">
          <span className="text-amber-400/80 font-medium">Captain Gear & Helmet Deals</span>
          <p className="text-[10px] text-slate-400">Exclusive accessories & service partner offers for registered Captains</p>
        </div>
      </div>
    </div>
  );
};
