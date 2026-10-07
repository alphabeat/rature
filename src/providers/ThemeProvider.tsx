import { useEffect, useState, type ReactNode } from 'react';

import { ThemeContext, type Theme } from '@/context/theme.tsx';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in root.tsx sets the `dark` class before hydration.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rature-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}
