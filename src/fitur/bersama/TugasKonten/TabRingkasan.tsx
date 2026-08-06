import type { OnlineAssignment } from '../../../data/services';

export default function TabRingkasan({ assignment }: { assignment: OnlineAssignment }) {
  const summaryText =
    assignment.summary?.trim() ||
    assignment.description ||
    'Silakan pelajari materi yang diberikan oleh guru.';

  return (
    <div className="rounded-md border-2 border-black bg-white p-4">
      <h3 className="mb-2 text-xs font-bold tracking-wider text-black uppercase">
        Ringkasan Materi
      </h3>
      <p className="text-xs leading-relaxed font-semibold whitespace-pre-line text-black">
        {summaryText}
      </p>
    </div>
  );
}
