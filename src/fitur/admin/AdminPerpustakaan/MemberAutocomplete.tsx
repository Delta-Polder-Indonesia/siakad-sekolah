import { useRef, useEffect, useState } from 'react';
import { Search, X, User, Check } from 'lucide-react';
import { useSmartMemberSearch } from './hooks/useSmartSearch';
import { highlightMatch } from './utils/highlightMatch';

interface Student {
  id: string;
  name: string;
  nis: string;
  classId?: string;
}

interface MemberAutocompleteProps {
  students: Student[];
  selectedId: string;
  onSelect: (student: Student) => void;
  onClear: () => void;
  placeholder?: string;
  filter?: (student: Student) => boolean;
  label?: string;
}

export function MemberAutocomplete({
  students,
  selectedId,
  onSelect,
  onClear,
  placeholder = 'Ketik nama atau NIS siswa...',
  filter,
  label = 'Anggota',
}: MemberAutocompleteProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useSmartMemberSearch(students, search, { filter, limit: 30 });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    onClear();
    setShowDropdown(true);
  };

  const handleSelect = (student: Student) => {
    onSelect(student);
    setSearch(`${student.name} (${student.nis})`);
    setShowDropdown(false);
  };

  const selectedStudent = students.find((s) => s.id === selectedId);

  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-4">
      <label className="pt-2 pr-4 text-right text-xs font-bold text-black uppercase">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className={`w-full rounded-md border-2 bg-white py-2 pr-8 pl-9 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600 ${
              selectedId ? 'border-emerald-600' : 'border-black'
            }`}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onClear();
                setShowDropdown(false);
              }}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-black/50 transition-colors hover:text-black"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showDropdown && !selectedId && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border-2 border-black bg-white">
            {filtered.length > 0 ? (
              <>
                <div className="sticky top-0 z-10 border-b-2 border-black bg-neutral-50 px-3 py-1.5">
                  <p className="text-[10px] font-bold text-black/70">
                    {search.trim() ? (
                      <>
                        Menampilkan <strong>{filtered.length}</strong> siswa untuk &quot;
                        <strong>{search}</strong>&quot;
                      </>
                    ) : (
                      <>
                        Ketik untuk mencari atau pilih dari daftar ({filtered.length} ditampilkan)
                      </>
                    )}
                  </p>
                </div>
                {filtered.map(({ item: student, matchType }) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleSelect(student)}
                    className={`flex w-full items-center gap-3 border-b-2 border-black/10 px-3 py-2.5 text-left text-xs transition last:border-0 hover:bg-neutral-100 ${
                      matchType === 'prefix' ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold ${
                        matchType === 'prefix' || matchType === 'word-start'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-black bg-white text-black'
                      }`}
                    >
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-black">
                        {highlightMatch(student.name, search)}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-black/60">
                          NIS: {highlightMatch(student.nis, search)}
                        </span>
                        {student.classId && (
                          <span className="text-[10px] font-bold text-black/40">
                            • Kelas: {student.classId}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center">
                <User className="mx-auto mb-2 h-8 w-8 text-black/30" />
                <p className="text-xs font-bold text-black/70">
                  Tidak ditemukan siswa untuk &quot;{search}&quot;
                </p>
                <p className="mt-1 text-[10px] font-bold text-black/40">
                  Coba ketik huruf awal nama atau nomor NIS
                </p>
              </div>
            )}
          </div>
        )}

        {selectedId && selectedStudent && (
          <div className="mt-2 flex items-center gap-2 rounded-md border-2 border-emerald-600 bg-white p-2">
            <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
            <span className="flex-1 text-xs font-bold text-emerald-700">
              Anggota terpilih: <strong>{selectedStudent.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onClear();
              }}
              className="rounded-md border-2 border-black bg-white p-0.5 text-black transition-colors hover:border-rose-600 hover:text-rose-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
