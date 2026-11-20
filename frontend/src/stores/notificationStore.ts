import { create } from "zustand";
import { getUnreadCount } from "../api/notification";

type NotificationState = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  setUnreadCount: (count: number) => void;
  reset: () => void;
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,

  refreshUnreadCount: async () => {
    try {
      const unread = await getUnreadCount();
      set({ unreadCount: unread.count });
    } catch {
      // in caso di errore il contatore resta com'era: non è un motivo per avvisare l'utente
    }
  },
  setUnreadCount: (count) => {
    set({
      unreadCount: count,
    });
  },
  reset: () => {
    set({
      unreadCount: 0,
    });
  },
}));
