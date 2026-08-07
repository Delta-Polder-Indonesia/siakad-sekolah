import ShareButtons from '../ShareButtons';

interface ArticleMetadataProps {
  author?: string;
  date?: string;
  dateTime?: string;
  dateText?: string;
  showShareButtons?: boolean;
}

export default function ArticleMetadata({
  author = 'Tim Humas',
  date,
  dateTime,
  dateText,
  showShareButtons = true,
}: ArticleMetadataProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">Oleh: {author}</span>
        {(date || dateText) && (
          <>
            <span className="text-slate-300">•</span>
            <time dateTime={dateTime}>{dateText || date}</time>
          </>
        )}
      </div>

      {showShareButtons && <ShareButtons />}
    </div>
  );
}