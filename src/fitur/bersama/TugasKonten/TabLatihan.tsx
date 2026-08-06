import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import type { AuthUser } from '../../../types';
import { getQuizResult, saveQuizResult } from '../../../data/services';
import type { OnlineAssignment } from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { formatDateTime } from './tugasKonten';

interface TabLatihanProps {
  assignment: OnlineAssignment;
  /** Murid yang mengerjakan. Saat null, kuis hanya bisa dibaca (kunci jawaban terkunci). */
  user?: AuthUser | null;
  /** Dipanggil setelah jawaban berhasil disimpan. */
  onSaved?: () => void;
}

export default function TabLatihan({ assignment, user, onSaved }: TabLatihanProps) {
  const storeVersion = useStoreVersion();
  const exercises = assignment.exercises ?? [];

  const [quizAnswers, setQuizAnswers] = useState<number[]>(() =>
    user ? (getQuizResult(assignment.id, user.id)?.answers ?? []) : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const quizResult = useMemo(
    () => (user ? getQuizResult(assignment.id, user.id) : null),
    [assignment.id, user, storeVersion]
  );

  const quizDirty = useMemo(() => {
    if (!quizResult) return false;
    return exercises.some((_, i) => quizAnswers[i] !== (quizResult?.answers?.[i] ?? -1));
  }, [quizResult, quizAnswers, exercises]);

  const allAnswered = useMemo(
    () =>
      exercises.length > 0 &&
      exercises.every((_, i) => quizAnswers[i] !== undefined && quizAnswers[i] !== -1),
    [exercises, quizAnswers]
  );

  if (exercises.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
        <p className="text-xs font-bold text-black italic">
          Belum ada soal latihan untuk modul ini.
        </p>
      </div>
    );
  }

  const handleCheckQuiz = () => {
    if (!user || !allAnswered) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      const total = exercises.length;
      const score = exercises.reduce(
        (acc, ex, i) => acc + (quizAnswers[i] === ex.correctIndex ? 1 : 0),
        0
      );
      saveQuizResult({
        assignmentId: assignment.id,
        studentId: user.id,
        answers: quizAnswers,
        score,
        total,
        submittedAt: Date.now(),
      });
      setSaveMessage(`Skor Anda: ${score}/${total}`);
      onSaved?.();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers(exercises.map(() => -1));
    setSaveMessage('');
  };

  return (
    <div className="space-y-3">
      {quizResult && !quizDirty && (
        <div className="rounded-md border-2 border-blue-600 bg-white p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                Skor Terakhir
              </p>
              <p className="mt-0.5 text-xl font-extrabold text-blue-600">
                {quizResult.score} / {quizResult.total}
              </p>
              <p className="mt-1 text-[10px] font-medium text-black">
                Dikerjakan {formatDateTime(quizResult.submittedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetryQuiz}
              className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
            >
              <RefreshCw className="h-3 w-3" /> Kerjakan Ulang
            </button>
          </div>
        </div>
      )}

      {exercises.map((exercise, eIndex) => (
        <div key={eIndex} className="rounded-md border-2 border-black bg-white p-3.5">
          <p className="text-xs leading-relaxed font-bold text-black">
            {eIndex + 1}. {exercise.question}
          </p>
          <div className="mt-2.5 space-y-1.5">
            {exercise.options.map((option, oIndex) => {
              const isCorrect =
                quizResult &&
                !quizDirty &&
                quizResult.answers[eIndex] === exercise.correctIndex &&
                oIndex === exercise.correctIndex;
              const isWrongPick =
                quizResult &&
                !quizDirty &&
                quizResult.answers[eIndex] === oIndex &&
                oIndex !== exercise.correctIndex;
              return (
                <label
                  key={oIndex}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border-2 px-3 py-2 text-xs font-medium transition-colors ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-900'
                      : isWrongPick
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-black bg-white text-black hover:border-blue-600'
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-${eIndex}`}
                    checked={quizAnswers[eIndex] === oIndex}
                    onChange={() =>
                      setQuizAnswers((prev) => prev.map((a, i) => (i === eIndex ? oIndex : a)))
                    }
                    className="h-3.5 w-3.5 shrink-0 accent-blue-600"
                  />
                  <span className="min-w-0">{option}</span>
                  {isCorrect && (
                    <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-black pt-3">
        <button
          type="button"
          onClick={handleCheckQuiz}
          disabled={!allAnswered || !user || isSaving}
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-blue-600 bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-black"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          <span>{isSaving ? 'Menyimpan...' : 'Periksa Jawaban'}</span>
        </button>
        {!allAnswered && (
          <p className="text-[11px] font-medium text-black italic">
            Jawab semua soal untuk memeriksa hasil.
          </p>
        )}
        {saveMessage && <p className="text-xs font-semibold text-blue-600">{saveMessage}</p>}
      </div>
    </div>
  );
}
