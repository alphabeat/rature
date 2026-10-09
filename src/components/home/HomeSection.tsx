import type { ReactNode } from 'react';

interface HomeSectionProps {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

// One below-the-fold block of the home page: a heading, an optional intro, then its content.
export function HomeSection({ id, title, intro, children }: HomeSectionProps) {
  return (
    <section aria-labelledby={id} className="w-full flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h2 id={id} className="text-3xl font-extrabold tracking-tight text-fg">{title}</h2>
        {intro && <p className="text-base text-fg-muted leading-relaxed">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
