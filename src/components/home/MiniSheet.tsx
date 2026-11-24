import { cn } from '@/lib/utils.ts';

export type SheetState = 'plain' | 'detected' | 'redacted';

export type Entity = 'per' | 'loc' | 'phone' | 'email';
type Segment = { width: string; entity?: Entity };

// The review colors Rature uses for each kind of detection.
const ENTITY_FILL: Record<Entity, string> = {
  per: 'bg-blue-300',
  loc: 'bg-green-300',
  phone: 'bg-red-300',
  email: 'bg-amber-300',
};

const LINES: Segment[][] = [
  [{ width: '30%' }, { width: '34%', entity: 'per' }, { width: '22%' }],
  [{ width: '20%' }, { width: '52%', entity: 'loc' }, { width: '16%' }],
  [{ width: '42%' }, { width: '36%', entity: 'phone' }],
  [{ width: '90%' }],
  [{ width: '14%' }, { width: '58%', entity: 'email' }, { width: '14%' }],
  [{ width: '26%' }, { width: '30%', entity: 'per' }, { width: '30%' }],
  [{ width: '84%' }],
  [{ width: '62%' }],
];

const SIZES = {
  sm: { sheet: 'w-20 h-28 px-2 pt-3 gap-1.5', title: 'h-1.5 mb-0.5', text: 'h-0.5', entity: 'h-1.5', gap: 'gap-0.5' },
  md: { sheet: 'w-32 h-44 px-3 pt-4 gap-2.5', title: 'h-2 mb-1', text: 'h-1', entity: 'h-2', gap: 'gap-1' },
} as const;

interface MiniSheetProps {
  state: SheetState;
  size?: keyof typeof SIZES;
  // Plays the detection once on first paint: the entities fade from grey to their color.
  animateIn?: boolean;
  // Redacted except this kind, like a subject access request that keeps the requester's name.
  keep?: Entity;
  className?: string;
  style?: React.CSSProperties;
}

// A page of paper in both themes, so the review colors and the black bars read as on a real PDF.
export function MiniSheet({ state, size = 'md', animateIn = false, keep, className, style }: MiniSheetProps) {
  const s = SIZES[size];
  let entityIndex = 0;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'shrink-0 flex flex-col bg-[#fdfcf9] border border-black/5',
        'shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
        s.sheet,
        className,
      )}
      style={style}
    >
      <div className={cn('w-1/2 bg-neutral-700', s.title)} />
      {LINES.map((line, i) => (
        <div key={i} className={cn('flex items-center', s.gap)}>
          {line.map((segment, j) => {
            if (!segment.entity) {
              return <span key={j} className={cn('block bg-neutral-300', s.text)} style={{ width: segment.width }} />;
            }
            const order = entityIndex++;
            const shown = state === 'detected' || (state === 'redacted' && segment.entity === keep);
            return (
              <span
                key={j}
                className={cn(
                  'block transition-colors duration-300',
                  s.entity,
                  state === 'plain' && 'bg-neutral-300',
                  shown && ENTITY_FILL[segment.entity],
                  state === 'redacted' && !shown && 'bg-neutral-900',
                  animateIn && 'mark-in',
                )}
                style={{
                  width: segment.width,
                  transitionDelay: state === 'redacted' ? `${i * 40}ms` : '0ms',
                  animationDelay: animateIn ? `${500 + order * 160}ms` : undefined,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
