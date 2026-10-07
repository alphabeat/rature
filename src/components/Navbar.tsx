import { Info, Moon, Settings, Sun, Upload } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import { useTheme } from '@/hooks/useTheme.tsx';
import { RatureLogo } from './RatureLogo.tsx';

export function Navbar() {
  const { toggleTheme } = useTheme();
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 shadow-card">
      <div className="flex items-center gap-2 border border-border-theme bg-surface/30 backdrop-blur-md px-3 py-1.5 shadow-lg">
        <Link
          to={localize('/')}
          className="h-12 flex items-center gap-2 mr-4 shrink-0 group"
        >
          <RatureLogo size="xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to={localize('/')}
            className="group px-3 py-2 h-full flex grow shrink-0 items-center justify-center gap-3 min-w-36 text-sm text-fg-muted hover:text-neutral-100 dark:hover:text-neutral-800 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Upload size="24" className='shrink-0' />
            <span className="relative font-medium hidden md:flex min-w-0 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-[1.5px] after:bg-current after:w-0 group-hover:after:w-full after:transition-[width] after:duration-500">{t('nav.anonymize')}</span>
          </Link>
          <Link
            to="/settings"
            className="group px-3 py-2 h-full flex grow shrink-0 items-center justify-center gap-3 min-w-36 text-sm text-fg-muted hover:text-neutral-100 dark:hover:text-neutral-800 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Settings size="24" className='shrink-0' />
            <span className="relative font-medium hidden md:flex min-w-0 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-[1.5px] after:bg-current after:w-0 group-hover:after:w-full after:transition-[width] after:duration-500">{t('nav.settings')}</span>
          </Link>
          <Link
            to={localize('/about')}
            className="group px-3 py-2 h-full flex grow shrink-0 items-center justify-center gap-3 min-w-36 text-sm text-fg-muted hover:text-neutral-100 dark:hover:text-neutral-800 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Info size="24" className='shrink-0' />
            <span className="relative font-medium hidden md:flex min-w-0 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-[1.5px] after:bg-current after:w-0 group-hover:after:w-full after:transition-[width] after:duration-500">{t('nav.about')}</span>
          </Link>
        </nav>

        <div className="h-10 w-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />

        <div>
          <button
            onClick={toggleTheme}
            aria-label={t('nav.toggleTheme')}
            className="flex items-center justify-center w-12 h-12 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-subtle transition-all duration-200 cursor-pointer"
          >
            {/* CSS picks the icon so the prerendered markup matches for both themes */}
            <Moon size={18} className="dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
