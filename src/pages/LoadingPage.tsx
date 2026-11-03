import { BookOpen, CheckCircle, Cpu, ExternalLink, FileText, HardDriveDownload, ScanEye } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnalysisError, type AnalysisFailureStage } from '@/components/workflow/AnalysisError.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useAnonymization } from '@/hooks/useAnonymization.ts';
import { useLocalizedPath } from '@/hooks/useLocalizedPath.ts';
import { useNERWorker } from '@/hooks/useNERWorker.ts';
import { usePdfProcessing } from '@/hooks/usePdfProcessing.ts';
import { failureDetail, pagesBucket, sizeBucket, track } from '@/lib/analytics.ts';
import { isModelCached } from '@/lib/cache.ts';
import { CUSTOM_PAGE_SPLIT_TOKEN, NER_MODELS } from '@/models/utils.ts';
import { Navigate } from 'react-router';

interface LoadingPageProps {
  onComplete: () => void;
  onRetry: () => void;
}

const STEP_ICONS = [Cpu, BookOpen, ScanEye, CheckCircle];

// No progress signal (extraction page, download bytes, NER chunk, worker status) for this long
// counts as stalled: reported once, and the user is offered a retry.
const STALL_MS = 60_000;

const percent = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);

export function LoadingPage({ onComplete, onRetry }: LoadingPageProps) {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedPath();
  const { modelName } = useAnonymization();
  const { downloadProgress, processingProgress, modelTokens, status: workerStatus, error, errorName, initialize, processText, terminate } = useNERWorker();
  const { setModelTokens, setNerEntities } = useAnonymization();
  const { file, pageCount, processFile, reset, setFile } = usePdfProcessing();

  const [progress, setProgress] = useState(10);
  const [stepIndex, setStepIndex] = useState(0);
  const [showSubPanel, setShowSubPanel] = useState(false);
  const [iconStep, setIconStep] = useState(0);
  const [iconPhase, setIconPhase] = useState<'enter' | 'exit'>('enter');
  const [startedAt] = useState(() => performance.now());
  const [failure, setFailure] = useState<{ stage: AnalysisFailureStage; message?: string } | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [extractProgress, setExtractProgress] = useState<{ done: number; total: number } | null>(null);
  const [stalled, setStalled] = useState(false);
  const cachedRef = useRef(false);
  const extractStartedRef = useRef(false);
  const extractAbortRef = useRef<AbortController | null>(null);
  const nerStartedRef = useRef(false);
  // Set once the analysis completes or fails; until then, leaving the page counts as abandoned.
  const outcomeRef = useRef(false);
  const lastActivityRef = useRef(0); // set by the activity effect on mount
  const stallReportedRef = useRef(false);

  // Worker errors outside a job: init (model download) before the worker is ready, a crash after.
  const workerReady = workerStatus === 'ready' || workerStatus === 'processing';
  const workerFailureStage: AnalysisFailureStage = stepIndex === 0 ? 'model-download' : 'ner';
  const failed = failure ?? (error ? { stage: workerFailureStage, message: error } : null);

  // The step the user is waiting on: extraction runs alongside the model load and is reported first.
  const waitingOn = text === null ? 'extract' : !workerReady ? 'model-download' : 'ner';

  // Context for `analysis-stalled` / `analysis-abandoned`, read at the time the event fires.
  const snapshotRef = useRef<() => Record<string, string | number | boolean>>(() => ({}));
  useEffect(() => {
    snapshotRef.current = () => ({
      stage: waitingOn,
      seconds: Math.round((performance.now() - startedAt) / 1000),
      cached: cachedRef.current,
      download: downloadProgress?.percent ?? -1,
      extract: extractProgress ? percent(extractProgress.done, extractProgress.total) : -1,
      ner: processingProgress ? percent(processingProgress.chunksProcessed, processingProgress.totalChunks) : -1,
      pages: pagesBucket(extractProgress?.total ?? pageCount),
      mb: file ? sizeBucket(file.size) : 'unknown',
    });
  });

  useEffect(() => {
    isModelCached(NER_MODELS[modelName].url).then((cached) => {
      cachedRef.current = cached;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // One worker per mount, terminated on unmount whatever the outcome: leaving mid-run must not
  // leave a worker holding the model in memory.
  useEffect(() => {
    if (!file) return;
    initialize(modelName);
    return () => terminate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShowSubPanel = useCallback(() => {
    if (!showSubPanel && downloadProgress && downloadProgress.percent < 100) {
      setShowSubPanel(true);
    }
  }, [downloadProgress, showSubPanel]);

  const updateStep = useCallback((step: number) => {
    if (showSubPanel && step !== 0) {
      setShowSubPanel(false);
    }

    setStepIndex(step);

    if (step === 1) {
      setProgress(30);
    }

    if (step === 2) {
      setProgress(50);
    }

    if (step === 3) {
      setProgress(90);
    }
  }, [showSubPanel]);

  const finalize = useCallback(() => {
    updateStep(3);

    setTimeout(() => setProgress(100), 500);
    setTimeout(onComplete, 1000);
  }, [onComplete, updateStep]);

  const fail = useCallback((stage: AnalysisFailureStage, message: string) => {
    outcomeRef.current = true;
    setFailure({ stage, message });
  }, []);

  const analyzeDocument = useCallback(async (documentText: string) => {
    setTimeout(() => updateStep(2), 500);

    let entities;
    try {
      ({ entities } = await processText(documentText));
    } catch (err) {
      console.error(err);
      track('analysis-failed', { stage: 'ner', ...failureDetail(err, pageCount, documentText.length) });
      fail('ner', err instanceof Error ? err.message : String(err));
      return;
    }

    const labeledEntities = entities.filter((entity) => entity.type !== 'O');

    outcomeRef.current = true;
    track('analysis-completed', {
      seconds: Math.round((performance.now() - startedAt) / 1000),
      entities: labeledEntities.length,
      cached: cachedRef.current,
    });

    setNerEntities(labeledEntities);
    setModelTokens(modelTokens);

    setTimeout(() => finalize(), 500);
  }, [fail, finalize, modelTokens, pageCount, processText, setModelTokens, setNerEntities, startedAt, updateStep]);

  // Extraction starts on mount, in parallel with the model load, so a PDF that cannot be read
  // fails right away instead of after the model download.
  useEffect(() => {
    if (!file || extractStartedRef.current) return;
    extractStartedRef.current = true;
    extractAbortRef.current = new AbortController();
    const { signal } = extractAbortRef.current;

    processFile(file, (done, total) => setExtractProgress({ done, total }), signal)
      .then((extracts) => {
        setText(extracts.map((extract) => extract.text.replaceAll(/\n+/g, ' ')).join(CUSTOM_PAGE_SPLIT_TOKEN));
      })
      .catch((err) => {
        if (signal.aborted) return;
        track('analysis-failed', { stage: 'extract', ...failureDetail(err, pageCount) });
        fail('extract', err instanceof Error ? err.message : String(err));
      });
  }, [fail, file, pageCount, processFile]);

  // Leaving the page cancels the extraction, so it cannot overwrite the next document's state.
  useEffect(() => () => extractAbortRef.current?.abort(), []);

  useEffect(() => {
    if (workerStatus !== 'ready' || nerStartedRef.current || failure) return;

    if (text === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateStep(1);
      return;
    }

    nerStartedRef.current = true;
    analyzeDocument(text);
  }, [analyzeDocument, failure, text, updateStep, workerStatus]);

  useEffect(() => {
    if (!error) return;
    outcomeRef.current = true;
    track('analysis-failed', { stage: workerFailureStage, ...failureDetail({ name: errorName ?? 'Error' }, pageCount) });
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Any progress signal resets the stall timer and hides the notice.
  useEffect(() => {
    lastActivityRef.current = performance.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStalled(false);
  }, [downloadProgress, extractProgress, processingProgress, text, workerStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (outcomeRef.current || performance.now() - lastActivityRef.current < STALL_MS) return;

      const snapshot = snapshotRef.current();
      if (!stallReportedRef.current) {
        stallReportedRef.current = true;
        track('analysis-stalled', snapshot);
      }

      // A download that stops sending bytes never errors on its own: fail it so the user can retry.
      if (snapshot.stage === 'model-download' && typeof snapshot.download === 'number' && snapshot.download >= 0 && snapshot.download < 100) {
        track('analysis-failed', { stage: 'model-download', ...failureDetail({ name: 'DownloadStalled' }, pageCount) });
        fail('model-download', `Model download stalled: no data for ${STALL_MS / 1000} s`);
        return;
      }

      setStalled(true);
    }, 5_000);
    return () => clearInterval(timer);
  }, [fail, pageCount]);

  // Leaving before an outcome (reload, tab close, navigation) is the silent hang we want to count.
  useEffect(() => {
    const reportAbandon = () => {
      // Nothing started when there is no file (e.g. a reload on /processing redirects home).
      if (outcomeRef.current || !extractStartedRef.current) return;
      outcomeRef.current = true;
      track('analysis-abandoned', snapshotRef.current());
    };
    window.addEventListener('pagehide', reportAbandon);
    return () => {
      window.removeEventListener('pagehide', reportAbandon);
      reportAbandon();
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (downloadProgress) handleShowSubPanel();
  }, [downloadProgress, handleShowSubPanel]);

  useEffect(() => {
    const timer = setTimeout(handleShowSubPanel, 750);
    return () => clearTimeout(timer);
  }, [handleShowSubPanel, stepIndex]);

  useEffect(() => {
    if (stepIndex === iconStep) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIconPhase('exit');
    const timer = setTimeout(() => {
      setIconStep(stepIndex);
      setIconPhase('enter');
    }, 200);
    return () => clearTimeout(timer);
  }, [stepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!file) {
    return <Navigate to={localize('/')} />;
  }

  const handleRetry = () => {
    outcomeRef.current = true;
    terminate();
    // Back to 'idle' with the same file, so the remounted page extracts it again.
    reset();
    setFile(file);
    onRetry();
  };

  if (failed) {
    return <AnalysisError stage={failed.stage} message={failed.message} onRetry={handleRetry} />;
  }

  const StepIcon = STEP_ICONS[iconStep];
  const steps = [t('loading.step0'), t('loading.step1'), t('loading.step2'), t('loading.step3')];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-6">
      <div className="relative flex items-center justify-center">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-teal-50 dark:bg-teal-950/30 text-accent">
          <div
            key={iconPhase === 'exit' ? 'icon-exit' : iconStep}
            className={
              iconPhase === 'exit'
                ? 'animate-out fade-out zoom-out-90 slide-out-to-top-2 duration-200 fill-mode-forwards'
                : 'animate-in fade-in zoom-in-90 slide-in-from-bottom-2 duration-300'
            }
          >
            <div style={{ animation: 'icon-spin-pulse 3s ease-in-out infinite' }}>
              <StepIcon size={36} strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-xl font-semibold text-fg">{t('loading.title')}</h2>
        <p
          className="text-sm text-fg-muted truncate max-w-xs mx-auto animate-in fade-in duration-500"
          title={file.name}
        >
          {file.name}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={[
                'block rounded-full transition-all duration-300',
                i < stepIndex
                  ? 'w-2 h-2 bg-accent scale-110'
                  : i === stepIndex
                    ? 'w-2 h-2 bg-accent animate-pulse'
                    : 'w-1.5 h-1.5 bg-border-theme',
              ].join(' ')}
            />
          ))}
        </div>

        <div className="h-1.5 w-full rounded-full bg-border-theme overflow-hidden">
          <div
            className="relative h-full rounded-full bg-linear-to-r from-teal-600 to-teal-400 transition-all duration-300 ease-out overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <span className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        <p
          key={stepIndex}
          className="text-xs text-fg-subtle text-center h-4 animate-in fade-in slide-in-from-bottom-1 duration-300"
        >
          {steps[stepIndex]}
        </p>
      </div>

      {text === null && extractProgress && extractProgress.total > 1 && (
        <div className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="rounded-xl border border-border-theme bg-surface-subtle p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-fg-muted">
              <FileText size={12} strokeWidth={1.5} />
              <span className="text-xs">{t('loading.reading')}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">{t('loading.page')}</span>
              <span className="text-sm font-medium text-fg tabular-nums">
                {extractProgress.done} / {extractProgress.total}
              </span>
            </div>

            <div className="h-1 w-full rounded-full bg-border-theme overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-teal-600 to-teal-400 transition-all duration-200 ease-out"
                style={{ width: `${percent(extractProgress.done, extractProgress.total)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {stepIndex === 2 && pageCount > 1 && (
        <div className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="rounded-xl border border-border-theme bg-surface-subtle p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-fg-muted">
              <ScanEye size={12} strokeWidth={1.5} />
              <span className="text-xs">{t('loading.entityAnalysis')}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">{t('loading.page')}</span>
              <span
                className="text-sm font-medium text-fg tabular-nums animate-in fade-in duration-200"
              >
                {processingProgress
                  ? Math.ceil((processingProgress.chunksProcessed / processingProgress.totalChunks) * processingProgress.totalPages)
                  : 1
                } / {pageCount}
              </span>
            </div>

            <div className="h-1 w-full rounded-full bg-border-theme overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-teal-600 to-teal-400 transition-all duration-200 ease-out"
                style={{ width: `${processingProgress ? Math.round((processingProgress.chunksProcessed / processingProgress.totalChunks) * 100) : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-subtle">
                {t('loading.wordsAnalyzed', { count: processingProgress ? (processingProgress.chunksProcessed * 150).toLocaleString(i18n.language) : '0' })}
              </span>
              <span className="text-xs text-accent font-medium tabular-nums">
                {processingProgress ? Math.round((processingProgress.chunksProcessed / processingProgress.totalChunks) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {showSubPanel && stepIndex === 0 && (
        <div className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="rounded-xl border border-border-theme bg-surface-subtle p-3 space-y-2">
            {downloadProgress !== null ? (
              <>
                <div className="flex items-center gap-1.5 text-fg-muted">
                  <HardDriveDownload size={12} strokeWidth={1.5} />
                  <span className="text-xs">{t('loading.modelDownload')}</span>
                </div>

                <p className="flex items-center gap-2 text-xs font-mono text-fg-subtle" title={downloadProgress.modelName}>
                  <span>{NER_MODELS[downloadProgress.modelName].label}</span>
                  <a href={NER_MODELS[downloadProgress.modelName].url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} />
                  </a>
                </p>

                <div className="h-1 w-full rounded-full bg-border-theme overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-teal-600 to-teal-400 transition-all duration-200 ease-out"
                    style={{ width: `${downloadProgress.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-subtle">
                    {(downloadProgress.loaded / 1024 / 1024).toFixed(1)} Mo / {(downloadProgress.total / 1024 / 1024).toFixed(1)} Mo
                  </span>
                  <span className="text-xs text-accent font-medium tabular-nums">{downloadProgress.percent}%</span>
                </div>

                <p className="text-[10px] text-fg-subtle/60">
                  {t('loading.cachedNote')}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-fg-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                <span className="text-xs">{t('loading.loadingFromCache')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {stalled && (
        <div role="status" className="w-full max-w-xs text-center space-y-3 animate-in fade-in duration-500">
          <p className="text-sm font-medium text-fg">{t('loading.stalled.title')}</p>
          <p className="text-xs text-fg-muted leading-relaxed">{t('loading.stalled.desc')}</p>
          <Button size="sm" variant="secondary" onClick={handleRetry}>{t('loading.error.retry')}</Button>
        </div>
      )}
    </div>
  );
}
