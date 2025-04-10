
import React from 'react';
import { useUser } from '../contexts/UserContext';
import { isTelegramWebAppAvailable } from '../utils/telegramWebApp';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading, error } = useUser();
  const isTelegram = isTelegramWebAppAvailable();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-telegram"></div>
          <div className="h-4 w-48 bg-telegram/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            className="bg-telegram text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`telegram-app min-h-screen bg-background text-foreground ${isTelegram ? 'pb-14' : ''}`}>
      <div className="container mx-auto px-4 py-4 max-w-md">
        {children}
      </div>
    </div>
  );
};

export default Layout;
