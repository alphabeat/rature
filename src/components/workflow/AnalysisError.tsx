import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button.tsx';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';

export type AnalysisFailureStage = 'model-download' | 'extract' | 'ner';

interface AnalysisErrorProps {
  stage: AnalysisFailureStage;
  message?: string;
  onRetry: () => void;
}

export function AnalysisError({ stage, message, onRetry }: AnalysisErrorProps) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  // Re-reading the same file fails the same way, so extraction errors only offer another file.
  const canRetry = stage !== 'extract';

  return (
    <div role="alert" className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
        <TriangleAlert size={36} strokeWidth={1.25} />
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-semibold text-fg">{t(`loading.error.${stage}.title`)}</h2>
        <p className="text-sm text-fg-muted leading-relaxed">{t(`loading.error.${stage}.desc`)}</p>
      </div>

      <div className="flex items-center gap-3">
        {canRetry && <Button onClick={onRetry}>{t('loading.error.retry')}</Button>}
        <Button variant={canRetry ? 'secondary' : 'primary'} asChild>
          <Link to={localize('/')}>{t(canRetry ? 'loading.error.home' : 'loading.error.otherFile')}</Link>
        </Button>
      </div>

      {message && (
        <details className="w-full max-w-md text-xs text-fg-subtle">
          <summary className="cursor-pointer text-center">{t('loading.error.details')}</summary>
          <p className="mt-2 font-mono break-all rounded-lg border border-border-theme bg-surface-subtle p-3">{message}</p>
        </details>
      )}
    </div>
  );
}
