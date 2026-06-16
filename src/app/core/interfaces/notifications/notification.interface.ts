export interface NotificationResponse {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  referenceUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
