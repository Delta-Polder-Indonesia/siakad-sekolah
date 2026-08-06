import { Download, Paperclip } from 'lucide-react';
import type { OnlineAssignment } from '../../../data/services';
import { downloadDataUrl } from './tugasKonten';

export default function TabLampiran({ assignment }: { assignment: OnlineAssignment }) {
  const attachments = assignment.attachments ?? [];

  if (attachments.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
        <p className="text-xs font-bold text-black italic">
          Tidak ada lampiran berkas materi untuk bab ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-2 rounded-md border-2 border-black bg-white p-3"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Paperclip className="h-4 w-4 shrink-0 text-black" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-black">{attachment.name}</p>
              {attachment.size !== undefined && (
                <p className="text-[10px] font-medium text-black">
                  {(attachment.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[11px] font-bold text-black transition-colors hover:bg-neutral-100"
          >
            <Download className="h-3 w-3" /> Unduh
          </button>
        </div>
      ))}
    </div>
  );
}
