import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ExternalLink, Loader2, RotateCcw, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { MiniSheet } from '@/components/home/MiniSheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useAnonymization } from '@/hooks/useAnonymization.ts';
import { sizeBucket, track } from '@/lib/analytics.ts';
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

// Lets the home page's closing call to action open the same file picker.
export const PDF_INPUT_ID = 'pdf-input';

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot < 0) return 'none';
  const ext = name.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,10}$/.test(ext) ? ext : 'other';
}

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: () => Promise<void>;
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
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors duration-150 cursor-pointer select-none whitespace-nowrap',
        selected
          ? 'bg-accent text-accent-foreground border-accent'
          : 'bg-transparent text-fg-muted border-border-theme hover:border-border-strong hover:text-fg',
      )}
    >
      <Icon size={12} />
      {t(option.labelKey)}
    </button>
  );
}

export function DropZone({ onFileSelect, onSampleSelect }: DropZoneProps) {
  const { t, i18n } = useTranslation();
  const { setModel } = useAnonymization();
  const defaults = defaultFeatures(i18n.language);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSampleLoading, setIsSampleLoading] = useState(false);
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
        track('pdf-selected', { method, mb: sizeBucket(file.size) });
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

  // Push the options' model only when they change, so the sample's model is not overwritten.
  useEffect(() => {
    setModel(resolvedModel);
  }, [resolvedModel]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const openSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSampleLoading) return;
    setIsSampleLoading(true);
    await onSampleSelect();
    setIsSampleLoading(false);
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
          'relative flex flex-row items-center gap-8 px-8 py-8 cursor-pointer select-none overflow-hidden',
          'border-2 border-dashed transition-colors duration-150',
          isDragging
            ? 'border-accent bg-accent/5'
            : isHovering
              ? 'border-fg-subtle'
              : 'border-border-strong',
        )}
      >
        <input
          ref={inputRef}
          id={PDF_INPUT_ID}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onInputChange}
        />

        {/* Detects once on load; on hover or drag the entities turn into black bars, like the exported PDF. */}
        <MiniSheet
          state={isActive ? 'redacted' : 'detected'}
          animateIn
          className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: isActive ? 'rotate(0deg) translateY(-2px)' : 'rotate(-2deg)' }}
        />

        <div className="flex flex-col items-start gap-4">
          <p className="text-base font-medium text-fg">
            {isDragging ? t('dropzone.drop') : t('dropzone.idle')}
          </p>
          <Button
            type="button"
            size="lg"
            className="h-12 px-6 text-base"
            onClick={e => {
              e.stopPropagation();
              openPicker();
            }}
          >
            <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
            {t('dropzone.choose')}
          </Button>
          <p className="flex flex-col gap-1 text-sm text-fg-muted">
            {t('dropzone.free')}
            <button
              type="button"
              onClick={openSample}
              disabled={isSampleLoading}
              className="self-start inline-flex items-center gap-1 font-medium text-accent underline underline-offset-4 hover:text-accent-hover transition-colors cursor-pointer disabled:cursor-wait"
            >
              {isSampleLoading && <Loader2 size={12} className="animate-spin" aria-hidden="true" />}
              {t('dropzone.sample')}
            </button>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsAdvancedOpen(v => !v)}
        aria-expanded={isAdvancedOpen}
        className={cn(
          'w-full flex items-center justify-center gap-1.5 px-4 py-2',
          'border-x-2 border-b-2 border-dashed border-border-strong',
          'bg-surface-subtle text-xs font-medium text-fg-muted cursor-pointer',
          'hover:text-fg transition-colors duration-150',
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
          <div className="flex flex-col gap-3 px-4 pt-3 pb-4 border-x-2 border-b-2 border-dashed border-border-strong bg-surface-subtle">

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs text-fg-muted">
                {t('dropzone.model')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-medium text-fg">{modelMeta.label}</span>
                <span className="font-mono text-fg-muted tabular-nums">{modelMeta.size}</span>
                <a
                  href={modelMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('dropzone.learnMore')}
                  className="text-fg-muted hover:text-fg transition-colors duration-150"
                >
                  <ExternalLink size={12} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="w-24 shrink-0 text-right text-xs text-fg-muted">
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
              <p className="w-24 shrink-0 text-right text-xs text-fg-muted">
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
              <p className="w-24 shrink-0 text-right text-xs text-fg-muted">
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
                  <RotateCcw size={12} strokeWidth={1.5} />
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
