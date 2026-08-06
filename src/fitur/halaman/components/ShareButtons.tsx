import { useState } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      hoverBorder: 'hover:border-emerald-400',
      hoverBg: 'hover:bg-emerald-50',
      hoverText: 'hover:text-emerald-600',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.451 5.42 1.452 5.345 0 9.696-4.35 9.699-9.697.002-2.592-1.001-5.029-2.825-6.855C17.062 2.229 14.621 1 12.008 1 6.666 1 2.317 5.35 2.315 10.694c-.001 2.012.528 3.977 1.533 5.707l-.991 3.616 3.792-.994z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      hoverBorder: 'hover:border-blue-500',
      hoverBg: 'hover:bg-blue-50',
      hoverText: 'hover:text-blue-600',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      hoverBorder: 'hover:border-slate-800',
      hoverBg: 'hover:bg-slate-50',
      hoverText: 'hover:text-slate-900',
      icon: (
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[11px] font-semibold tracking-widest text-slate-400 uppercase sm:inline">
        Bagikan
      </span>
      <Share2 className="h-3.5 w-3.5 text-slate-400 sm:hidden" />

      <div className="flex items-center gap-1">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Bagikan ke ${link.name}`}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-200 ${link.hoverBorder} ${link.hoverBg} ${link.hoverText}`}
          >
            {link.icon}
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Salin tautan"
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 ${
            copied
              ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
              : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
