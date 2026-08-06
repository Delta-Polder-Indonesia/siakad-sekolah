import { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useToast } from '../../../components/ui';
import { setDendaConfig } from './dendaUtils';

interface DendaSettingsProps {
  dendaPerHari: number;
  onDendaChange: (amount: number) => void;
}

export function DendaSettings({ dendaPerHari, onDendaChange }: DendaSettingsProps) {
  const { showToast } = useToast();
  const [showPanel, setShowPanel] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (!showPanel) return;

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showPanel, updatePosition]);

  useEffect(() => {
    if (!showPanel) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPanel(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPanel]);

  const handleSave = () => {
    setDendaConfig(dendaPerHari);
    setShowPanel(false);
    showToast(
      'success',
      `Tarif denda diperbarui: Rp ${dendaPerHari.toLocaleString('id-ID')} per hari`
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
      >
        <Settings className="h-3.5 w-3.5 text-black" />
        Pengaturan Denda
      </button>

      {showPanel &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'absolute',
              top: panelPos.top,
              right: panelPos.right,
              zIndex: 9999,
              width: '360px',
            }}
            className="rounded-md border-2 border-black bg-white"
          >
            {/* Header Panel */}
            <div className="flex items-center justify-between border-b-2 border-black px-4 py-2.5">
              <p className="text-xs font-bold text-black">Pengaturan Tarif Denda</p>
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                className="text-black transition-colors hover:text-blue-600"
              >
                <X className="h-4 w-4 text-black" />
              </button>
            </div>

            {/* Body Panel */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <label className="flex-shrink-0 text-xs font-bold text-black">Denda/Hari:</label>
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <span className="text-xs font-bold text-black">Rp</span>
                  <input
                    type="number"
                    value={dendaPerHari}
                    onChange={(e) => onDendaChange(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-w-0 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    min="0"
                    step="500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-shrink-0 rounded-md border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
                >
                  Simpan
                </button>
              </div>

              <p className="mt-3 text-[10px] font-bold text-black">
                Tarif saat ini: Rp {dendaPerHari.toLocaleString('id-ID')} / hari / buku. Standar: Rp
                500 – Rp 1.000 per hari.
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
