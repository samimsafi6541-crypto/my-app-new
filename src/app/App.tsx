import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

export default function App() {
  const { settings } = useStore();

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  return <RouterProvider router={router} />;
}