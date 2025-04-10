
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
    query_id?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  showPopup: (params: { 
    title?: string; 
    message: string; 
    buttons?: Array<{
      id: string;
      type?: "default" | "ok" | "close" | "cancel" | "destructive";
      text: string;
    }>; 
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  MainButton: {
    text: string;
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function initTelegramWebApp() {
  const tg = useTelegramWebApp();
  
  if (tg) {
    // Inform Telegram WebApp that we are ready
    tg.ready();
    
    // Expand the Web App to take the full height
    tg.expand();
  }
  
  return tg;
}

export function getTelegramUser() {
  const tg = useTelegramWebApp();
  
  if (tg && tg.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  
  return null;
}

export function isTelegramWebAppAvailable() {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

export function showTelegramAlert(message: string, callback?: () => void) {
  const tg = useTelegramWebApp();
  if (tg) {
    tg.showAlert(message, callback);
  } else {
    alert(message);
    if (callback) callback();
  }
}

export function setupMainButton(text: string, callback: () => void) {
  const tg = useTelegramWebApp();
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(callback);
    tg.MainButton.show();
  }
}
