import { useState, useCallback, useRef, type ReactNode, type DragEvent } from 'react';
import { Upload, FileText, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';

export interface FileUploadFile {
  file: File;
  dataUrl?: string;
  preview?: string;
}

export interface FileUploadProps {
  /** Label shown above the dropzone */
  label?: string;
  /** Accepted MIME types, e.g. "image/*" or ".pdf,.doc" */
  accept?: string;
  /** Max file size in bytes (default 2MB) */
  maxSize?: number;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Callback when files change (added/removed) */
  onChange?: (files: FileUploadFile[]) => void;
  /** Currently selected files (controlled mode) */
  files?: FileUploadFile[];
  /** Helper text below the dropzone */
  helperText?: string;
  /** Disable the upload */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Show preview thumbnails for images */
  showPreview?: boolean;
  /** Custom class name */
  className?: string;
  /** Render custom preview for a file */
  renderPreview?: (file: FileUploadFile) => ReactNode;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: FileUploadFile) {
  if (file.preview) {
    return (
      <img
        src={file.preview}
        alt={file.file.name}
        className="h-10 w-10 rounded border border-slate-200 object-cover"
      />
    );
  }
  if (file.file.type.startsWith('image/')) {
    return <ImageIcon className="h-8 w-8 text-slate-400" />;
  }
  return <FileText className="h-8 w-8 text-slate-400" />;
}

export default function FileUpload({
  label,
  accept = 'image/*,.pdf',
  maxSize = 2 * 1024 * 1024, // 2MB default
  multiple = false,
  onChange,
  files: controlledFiles,
  helperText,
  disabled = false,
  error,
  showPreview = true,
  className = '',
  renderPreview,
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = useState<FileUploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledFiles !== undefined;
  const currentFiles = isControlled ? controlledFiles : internalFiles;
  const displayError = error || internalError;

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: FileUploadFile[] = [];
      const errors: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Validate size
        if (file.size > maxSize) {
          errors.push(`"${file.name}" melebihi batas ${formatSize(maxSize)}`);
          continue;
        }

        // Validate accept type
        if (accept !== '*') {
          const acceptTypes = accept.split(',');
          const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
          const fileMime = file.type.toLowerCase();
          const accepted = acceptTypes.some((t) => {
            const type = t.trim();
            if (type.endsWith('/*')) {
              return fileMime.startsWith(type.replace('/*', '/'));
            }
            if (type.startsWith('.')) {
              return fileExt === type;
            }
            return fileMime === type;
          });
          if (!accepted) {
            errors.push(`"${file.name}" bukan tipe file yang diizinkan`);
            continue;
          }
        }

        const entry: FileUploadFile = { file };

        // Generate preview for images
        if (showPreview && file.type.startsWith('image/')) {
          try {
            const dataUrl = await bacaFileSebagaiDataUrl(file);
            entry.dataUrl = dataUrl;
            entry.preview = dataUrl;
          } catch {
            // Preview not available
          }
        }

        newFiles.push(entry);
      }

      if (errors.length > 0) {
        setInternalError(errors.join('. '));
        setTimeout(() => setInternalError(''), 5000);
      }

      if (newFiles.length === 0) return;

      if (multiple) {
        const updated = [...currentFiles, ...newFiles];
        if (isControlled) {
          onChange?.(updated);
        } else {
          setInternalFiles(updated);
        }
      } else {
        if (isControlled) {
          onChange?.(newFiles);
        } else {
          setInternalFiles(newFiles);
        }
      }
    },
    [accept, maxSize, multiple, showPreview, currentFiles, isControlled, onChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      e.target.value = '';
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = currentFiles.filter((_, i) => i !== index);
      if (isControlled) {
        onChange?.(updated);
      } else {
        setInternalFiles(updated);
      }
    },
    [currentFiles, isControlled, onChange]
  );

  const clearAll = useCallback(() => {
    if (isControlled) {
      onChange?.([]);
    } else {
      setInternalFiles([]);
    }
  }, [isControlled, onChange]);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="block text-xs font-medium text-slate-700">{label}</label>}

      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 transition-all duration-150 outline-none ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${displayError ? 'border-red-400 bg-red-50' : ''} `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {dragOver ? (
          <div className="flex flex-col items-center gap-1 py-2">
            <Upload className="h-6 w-6 text-blue-500" />
            <p className="text-xs font-medium text-blue-600">Lepaskan file di sini...</p>
          </div>
        ) : currentFiles.length > 0 && !multiple ? (
          <div className="flex w-full items-center gap-3 py-1">
            {getFileIcon(currentFiles[0])}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-800">
                {currentFiles[0].file.name}
              </p>
              <p className="text-[10px] text-slate-500">{formatSize(currentFiles[0].file.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(0);
              }}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
              title="Hapus file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-3">
            <Upload className="h-6 w-6 text-slate-400" />
            <p className="text-xs font-medium text-slate-600">
              Seret file ke sini atau <span className="text-blue-600">klik untuk memilih</span>
            </p>
            <p className="text-[10px] text-slate-400">
              {accept.replace(/,/g, ', ')} · Max {formatSize(maxSize)} per file
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && !displayError && <p className="text-[10px] text-slate-400">{helperText}</p>}

      {/* File list (for multiple mode or custom preview) */}
      {currentFiles.length > 0 && (multiple || renderPreview) && (
        <div className="space-y-1.5 rounded-md border border-slate-200 bg-white p-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <p className="text-[10px] font-medium text-slate-500">
              {currentFiles.length} file dipilih
            </p>
            <button
              onClick={clearAll}
              className="text-[10px] font-medium text-red-500 hover:text-red-600"
            >
              Hapus semua
            </button>
          </div>
          {currentFiles.map((fileEntry, index) => (
            <div
              key={`${fileEntry.file.name}-${index}`}
              className="flex items-center gap-2 rounded p-1.5 transition-colors hover:bg-slate-50"
            >
              {renderPreview ? (
                renderPreview(fileEntry)
              ) : (
                <>
                  {getFileIcon(fileEntry)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {fileEntry.file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatSize(fileEntry.file.size)}
                      {fileEntry.dataUrl && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Siap
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    title="Hapus file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
