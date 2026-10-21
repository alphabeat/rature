import { Download } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button.tsx';
import { FIGURES, TEST_PDF_PATH, type FigureName } from '@/guides/assets.ts';
import { parseInline } from '@/guides/inline.ts';
import type { GuideStep } from '@/guides/types.ts';
import { cn } from '@/lib/utils.ts';

const LINK_CLASS = 'text-accent underline underline-offset-4 hover:text-accent-hover';

// Renders the inline markup of a guide string (see `guides/types.ts`).
export function Inline({ text }: { text: string }) {
  return parseInline(text).map((token, index) => {
    switch (token.type) {
      case 'bold':
        return <strong key={index} className="font-bold">{token.value}</strong>;
      case 'code':
        return <code key={index} className="px-1.5 py-0.5 bg-surface-subtle border border-border-theme text-sm">{token.value}</code>;
      case 'link':
        return token.href.startsWith('/') ? (
          <Link key={index} to={token.href} className={LINK_CLASS}>{token.value}</Link>
        ) : (
          <a key={index} href={token.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>{token.value}</a>
        );
      default:
        return token.value;
    }
  });
}

export function P({ children }: { children: string }) {
  return <p><Inline text={children} /></p>;
}

export function Ul({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 pl-6 list-disc marker:text-accent">
      {items.map((item) => <li key={item}><Inline text={item} /></li>)}
    </ul>
  );
}

export function Ol({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-3 pl-6 list-decimal marker:text-accent marker:font-bold">
      {items.map((item) => <li key={item}><Inline text={item} /></li>)}
    </ol>
  );
}

// Numbered step cards, styled like the home page's `VerifySteps`.
export function Steps({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex gap-4 bg-card border border-border-theme shadow-sm p-5 dark:bg-surface-subtle dark:shadow-none"
        >
          <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-accent/10 text-sm font-bold text-accent">
            {index + 1}
          </span>
          <p className="text-base leading-relaxed">
            <strong className="font-bold">{step.title}</strong> <Inline text={step.text} />
          </p>
        </li>
      ))}
    </ol>
  );
}

export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-border-theme bg-card shadow-sm dark:bg-surface-subtle dark:shadow-none">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-border-theme bg-surface-subtle dark:bg-card">
            {head.map((cell, index) => (
              <th key={index} scope="col" className="px-4 py-3 font-bold align-top">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border-theme last:border-b-0">
              {row.map((cell, index) => (
                index === 0
                  ? <th key={index} scope="row" className="px-4 py-3 font-semibold align-top"><Inline text={cell} /></th>
                  : <td key={index} className="px-4 py-3 align-top"><Inline text={cell} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Stats({ items }: { items: { value: string; text: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.value}
          className="flex flex-col gap-1 bg-card border border-border-theme shadow-sm p-5 dark:bg-surface-subtle dark:shadow-none"
        >
          <span className="text-4xl font-extrabold tracking-tight text-accent">{item.value}</span>
          <span className="text-sm text-fg-muted leading-relaxed">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }: { children: string }) {
  return (
    <aside className="border-l-4 border-amber-500 bg-amber-500/10 px-5 py-4 text-base leading-relaxed">
      <Inline text={children} />
    </aside>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return <blockquote className="border-l-4 border-border-strong pl-5 italic text-fg-muted">{children}</blockquote>;
}

export function Figure({ name, alt, caption }: { name: FigureName; alt: string; caption: string }) {
  const size = FIGURES[name];

  return (
    <figure className={cn('flex flex-col gap-2 mx-auto w-full', size.maxWidth)}>
      <img
        src={size.src}
        alt={alt}
        width={size.width}
        height={size.height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto border border-border-theme shadow-sm"
      />
      <figcaption className="text-sm text-fg-muted">{caption}</figcaption>
    </figure>
  );
}

export function PdfDownload({ children }: { children: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 items-start bg-card border border-border-theme shadow-sm p-5 dark:bg-surface-subtle dark:shadow-none">
      <p>{children}</p>
      <Button asChild variant="secondary">
        <a href={TEST_PDF_PATH} download>
          <Download size={16} aria-hidden="true" />
          {t('guides.download')}
        </a>
      </Button>
    </div>
  );
}
