import { ExternalLink } from 'lucide-react';
import type { OnlineAssignment } from '../../../data/services';
import { getYouTubeEmbedUrl } from './tugasKonten';

export default function TabVideo({ assignment }: { assignment: OnlineAssignment }) {
  const videos = assignment.videos ?? [];

  if (videos.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
        <p className="text-xs font-bold text-black italic">
          Belum ada video pembelajaran untuk modul ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video, index) => {
        const embedUrl = getYouTubeEmbedUrl(video.url);
        return (
          <div key={index} className="rounded-md border-2 border-black bg-white p-3">
            <p className="text-xs font-bold text-black">{video.title}</p>
            {video.description && (
              <p className="mt-0.5 text-[11px] font-medium text-black">{video.description}</p>
            )}
            <div className="mt-2 aspect-video overflow-hidden rounded-md border-2 border-black bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full items-center justify-center bg-white text-center text-xs font-bold text-blue-600"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="h-4 w-4" /> Buka Video di Tab Baru
                  </span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
