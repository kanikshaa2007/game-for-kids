import type { Metadata } from 'next';
import '../styles/globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { GameProvider } from '@/contexts/GameContext';
import { ScreenTimeProvider } from '@/contexts/ScreenTimeContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Kids Learning Platform - Fun & Educational Games',
  description: 'An interactive AI-powered learning platform for kids ages 5-10. Math games, language games, and more!',
  keywords: ['kids', 'learning', 'education', 'games', 'math', 'language'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-background via-info/10 to-success/10">
        <UserProvider>
          <GameProvider>
            <ScreenTimeProvider>
              {children}
            </ScreenTimeProvider>
          </GameProvider>
        </UserProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '16px',
              background: '#fff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: {
                primary: '#4ECDC4',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF6B6B',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
