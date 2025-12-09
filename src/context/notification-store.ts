
import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    title: string;
    message?: string;
    type: NotificationType;
    read: boolean;
    createdAt: Date;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message?: string, type?: NotificationType) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (title, message, type = 'info') => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substring(7),
            title,
            message,
            type,
            read: false,
            createdAt: new Date(),
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },
    markAsRead: (id) =>
        set((state) => {
            const newNotifications = state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );
            const newUnreadCount = newNotifications.filter((n) => !n.read).length;
            return { notifications: newNotifications, unreadCount: newUnreadCount };
        }),
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
