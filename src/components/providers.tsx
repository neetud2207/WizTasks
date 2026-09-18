'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#12162a',
            color: '#ece0c3',
            border: '1px solid rgba(198,161,91,0.35)',
          },
        }}
      />
    </SessionProvider>
  );
}
