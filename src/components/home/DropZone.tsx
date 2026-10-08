import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ExternalLink, FileUp, RotateCcw, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button.tsx';
import { useAnonymization } from '@/hooks/useAnonymization.ts';
import { track } from '@/lib/analytics.ts';
import { validateFile } from '@/lib/pdf/validatePDF.ts';
import { cn } from '@/lib/utils.ts';
import {
  defaultFeatures,
  LANGUAGE_OPTIONS,
  SPEED_OPTIONS,
  FOCUS_OPTIONS,
  resolveModel,
  type ModelFeatures,
  type Language,
  type Speed,
  type Focus,
} from '@/models/nerModelFeatures.ts';
import { NER_MODELS, NER_MODELS_NAMES } from '@/models/utils.ts';

const TEXT_LINES = [
  { width: '85%' },
  { width: '92%' },
  { width: '68%' },
  { width: '96%' },
  { width: '55%' },
  { width: '88%' },
  { width: '73%' },
];

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot < 0) return 'none';
  const ext = name.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,10}$/.test(ext) ? ext : 'other';
}

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

interface FeatureChipProps<T extends string> {
  option: { value: T; labelKey: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  selected: boolean;
  onSelect: (value: T) => void;
}

function FeatureChip<T extends string>({ option, selected, onSelect }: FeatureChipProps<T>) {
  const { t } = useTranslation();
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
        selected
          ? 'bg-accent text-white border-accent shadow-sm'
          : 'bg-transparent text-fg-muted border-border-theme hover:border-accent/60 hover:text-fg',
      )}
    >
      <Icon size={12} />
      {t(option.labelKey)}
    </button>
  );
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const { t, i18n } = useTranslation();
  const { modelName, setModel } = useAnonymization();
  const defaults = defaultFeatures(i18n.language);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [features, setFeatures] = useState<ModelFeatures>(defaults);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedModel = resolveModel(features);
  const modelMeta = NER_MODELS[resolvedModel];

  const isAdvanced =
    features.language !== defaults.language ||
    features.speed !== defaults.speed ||
    features.focus !== defaults.focus;


  const handleFile = useCallback(
    (file: File, method: 'drop' | 'picker') => {
      if (validateFile(file).valid) {
        track('pdf-selected', { method });
        onFileSelect(file);
      } else {
        toast.error(t('dropzone.notPdf'));
        track('file-rejected', { ext: fileExtension(file.name) });
      }
    },
    [onFileSelect, t],
  );

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, 'drop');
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, 'picker');
    e.target.value = '';
  };

  useEffect(() => {
    if (modelName === resolvedModel) return;

    setModel(resolvedModel);
  }, [modelName, resolvedModel, setModel]);

  const setLanguage = (language: Language) => {
    setFeatures(f => ({ ...f, language }));
  };

  const setSpeed = (speed: Speed) => {
    setFeatures(f => ({ ...f, speed }));
  };

  const setFocus = (focus: Focus) => {
    setFeatures(f => ({ ...f, focus }));
  };

  const resetFeatures = () => {
    setModel(NER_MODELS_NAMES[0]);
    setFeatures(defaults);
  };

  const isActive = isDragging || isHovering;

  const openPicker = () => {
    track('picker-opened');
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Mouse users can click anywhere; the button is the keyboard control. */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openPicker}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          'relative flex flex-row items-center gap-8 px-8 py-6 cursor-pointer select-none overflow-hidden',
          'border-2 border-dashed transition-colors duration-300',
          isDragging
            ? 'border-accent bg-accent/10'
            : isHovering
              ? 'border-accent bg-accent/5'
              : 'border-border-strong bg-white/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onInputChange}
        />

        <div style={{ animation: 'doc-float 4.5s ease-in-out infinite' }} aria-hidden="true">
          <div
            style={{
              transform: isActive ? 'scale(1.06) rotate(0deg)' : 'rotate(-3deg)',
              transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className={cn(
                'relative w-28 h-36 border overflow-hidden transition-all duration-300',
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-500 shadow-[0_12px_32px_rgba(13,148,136,0.2)]'
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-[0_6px_24px_rgba(0,0,0,0.10)]',
              )}
            >
              <div className={cn(
                'absolute top-0 left-0 right-0 h-1 transition-colors duration-500',
                isActive ? 'bg-accent' : 'bg-neutral-200 dark:bg-neutral-700',
              )} />

              <div className="px-3 pt-4 pb-3 flex flex-col gap-2">
                <div
                  className={cn(
                    'h-2.5 mb-1 transition-colors duration-300',
                    isActive
                      ? 'bg-neutral-900 dark:bg-neutral-100'
                      : 'bg-neutral-400 dark:bg-neutral-500',
                  )}
                  style={{ width: '55%' }}
                />

                {TEXT_LINES.map((line, i) => (
                  <div key={i} className="relative h-1.5">
                    <div
                      className="absolute inset-y-0 left-0 rounded-sm bg-neutral-200 dark:bg-neutral-600"
                      style={{ width: line.width }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 origin-left rounded-sm bg-neutral-900 dark:bg-neutral-100"
                      style={{
                        width: line.width,
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        transition: `transform 0.38s cubic-bezier(0.4, 0, 0.2, 1) ${
                          isActive ? i * 40 : 0
                        }ms`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <p className="flex items-center gap-2 font-extrabold text-lg tracking-wide text-fg">
            <FileUp size={22} className="text-accent shrink-0" aria-hidden="true" />
            {isDragging ? t('dropzone.drop') : t('dropzone.idle')}
          </p>
          <Button
            type="button"
            size="lg"
            className="h-14 px-8 text-lg"
            onClick={e => {
              e.stopPropagation();
              openPicker();
            }}
          >
            <Upload size={20} aria-hidden="true" />
            {t('dropzone.choose')}
          </Button>
          <p className="text-xs text-fg-muted">{t('dropzone.free')}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsAdvancedOpen(v => !v)}
        aria-expanded={isAdvancedOpen}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 px-4 py-2',
          'border-x-2 border-b-2 border-dashed border-border-strong',
          'bg-black/5 text-xs font-medium text-fg-muted cursor-pointer',
          'hover:text-accent hover:bg-accent/5 transition-all duration-200',
        )}
      >
        {t('dropzone.options')}
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-300', isAdvancedOpen && 'rotate-180')}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isAdvancedOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 px-4 pt-3 pb-4 border-x-2 border-b-2 border-dashed border-border-strong bg-black/5">

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs font-bold text-fg uppercase tracking-wider">
                {t('dropzone.model')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-bold text-fg">{modelMeta.label}</span>
                <span className="text-fg-muted tabular-nums">{modelMeta.size}</span>
                <a
                  href={modelMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('dropzone.learnMore')}
                  className="text-accent hover:text-accent/70 transition-colors duration-200"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs font-bold text-fg uppercase tracking-wider">
                {t('dropzone.language')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {LANGUAGE_OPTIONS.map(opt => (
                  <FeatureChip
                    key={opt.value}
                    option={opt}
                    selected={features.language === opt.value}
                    onSelect={setLanguage}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs font-bold text-fg uppercase tracking-wider">
                {t('dropzone.speed')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SPEED_OPTIONS.map(opt => (
                  <FeatureChip
                    key={opt.value}
                    option={opt}
                    selected={features.speed === opt.value}
                    onSelect={setSpeed}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs font-bold text-fg uppercase tracking-wider">
                {t('dropzone.focus')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {FOCUS_OPTIONS.map(opt => (
                  <FeatureChip
                    key={opt.value}
                    option={opt}
                    selected={features.focus === opt.value}
                    onSelect={setFocus}
                  />
                ))}
              </div>
            </div>

            {isAdvanced && (
              <div className="pt-1 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={resetFeatures}
                >
                  <RotateCcw size={11} />
                  {t('dropzone.reset')}
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
