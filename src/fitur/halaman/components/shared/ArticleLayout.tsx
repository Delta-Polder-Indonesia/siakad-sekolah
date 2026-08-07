import type { ReactNode } from 'react';
import ArticleHeader from './ArticleHeader';
import HeroBanner from './HeroBanner';
import ArticleMetadata from './ArticleMetadata';
import FloatingNav from '../FloatingNav';
import ProgramFooter from '../../../../layout/ProgramFooter';
import type { PageProps } from '../../types';

interface ArticleLayoutProps {
  children: ReactNode;
  title: string;
  imageSrc: string;
  imageAlt: string;
  subtitle?: string;
  badge?: string;
  date?: string;
  dateTime?: string;
  dateText?: string;
  author?: string;
  category?: string;
  onNavigate?: PageProps['onNavigate'];
  contentId?: string;
  showFloatingNav?: boolean;
  showShareButtons?: boolean;
  showLogo?: boolean;
  maxHeight?: string;
}

export default function ArticleLayout({
  children,
  title,
  imageSrc,
  imageAlt,
  subtitle,
  badge,
  date,
  dateTime,
  dateText,
  author,
  category,
  onNavigate,
  contentId,
  showFloatingNav = true,
  showShareButtons = true,
  showLogo = true,
  maxHeight,
}: ArticleLayoutProps) {
  return (
    <div
      id="berita-scroll-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-white font-sans text-slate-900"
    >
      {/* Header */}
      <ArticleHeader
        title={category || title}
        subtitle={subtitle}
        category={category}
        showLogo={showLogo}
        onNavigate={onNavigate}
      />

      {/* Hero Banner */}
      <HeroBanner
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        title={title}
        badge={badge}
        date={date}
        subtitle={subtitle}
        maxHeight={maxHeight}
      />

      {/* Article Content */}
      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-8 lg:px-12 lg:pt-10 lg:pb-16">
        {/* Metadata */}
        {(author || date || dateText) && (
          <ArticleMetadata
            author={author}
            date={date}
            dateTime={dateTime}
            dateText={dateText}
            showShareButtons={showShareButtons}
          />
        )}

        {/* Main Content */}
        <div className="space-y-7 text-[16px] leading-relaxed text-slate-700 md:text-[17px] md:leading-loose">
          {children}
        </div>
      </section>

      {/* Footer */}
      {onNavigate && <ProgramFooter onNavigate={onNavigate} />}

      {/* Floating Nav */}
      {showFloatingNav && contentId && <FloatingNav contentId={contentId} />}
    </div>
  );
}