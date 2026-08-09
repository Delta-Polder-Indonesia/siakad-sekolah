import { useState } from 'react';

interface FeedbackButtonProps {
  onNavigate: (page: string) => void;
}

export default function FeedbackButton({ onNavigate }: FeedbackButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="mb-2 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black shadow-lg">
          Kirim masukan & keluhan
        </div>
      )}

      {/* Main Button */}
      <button
        type="button"
        onClick={() => onNavigate('feedback')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="transition-all duration-200 hover:scale-110 active:scale-95"
        title="Kirim Feedback"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/Dashboard/hubungikami.png`}
          alt="Hubungi Kami"
          className="h-12 w-12 object-contain"
        />
      </button>
    </div>
  );
}