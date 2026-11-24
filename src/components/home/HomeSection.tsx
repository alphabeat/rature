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
    <section aria-labelledby={id} className="w-full flex flex-col gap-10">
      <div className="flex flex-col gap-3 max-w-2xl">
        <h2 id={id} className="text-3xl font-medium tracking-[-0.01em] text-fg">{title}</h2>
        {intro && <p className="text-base leading-7 text-fg-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
