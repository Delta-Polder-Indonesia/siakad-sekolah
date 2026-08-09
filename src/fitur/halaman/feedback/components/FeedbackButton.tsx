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
        className="transition-all duration-200 hover:scale-110 active:scale-95"
        title="Kirim Feedback"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/Dashboard/hubungikami.png`}
          alt="Hubungi Kami"
          className="h-30 w-30 object-contain"
        />
      </button>
    </div>
  );
}
