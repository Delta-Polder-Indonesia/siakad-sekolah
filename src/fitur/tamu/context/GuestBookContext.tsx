import { createContext, useContext, useState, ReactNode } from 'react';
import { GuestEntry } from '../types';
import { initialGuestEntries } from '../data/guestData';

interface GuestBookContextType {
  entries: GuestEntry[];
  addEntry: (entry: GuestEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<GuestEntry>) => void;
}

const GuestBookContext = createContext<GuestBookContextType | undefined>(undefined);

export function GuestBookProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<GuestEntry[]>(initialGuestEntries);

  const addEntry = (entry: GuestEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, updatedEntry: Partial<GuestEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry))
    );
  };

  return (
    <GuestBookContext.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </GuestBookContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuestBook() {
  const context = useContext(GuestBookContext);
  if (context === undefined) {
    throw new Error('useGuestBook must be used within a GuestBookProvider');
  }
  return context;
}
