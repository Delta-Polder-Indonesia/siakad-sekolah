interface FeedbackButtonProps {
  onNavigate: (page: string) => void;
}

export default function FeedbackButton({ onNavigate }: FeedbackButtonProps) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-2">
      {/* Main Button */}
      <button
        type="button"
        onClick={() => onNavigate('feedback')}
        aria-label="Kirim Feedback"
        title="Kirim Feedback"
        className="transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/Dashboard/hubungikami.png`}
          alt=""
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"  loading="lazy" decoding="async" />
      </button>
    </div>
  );
}
