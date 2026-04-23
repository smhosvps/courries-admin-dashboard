/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteAllNotificationsMutation,
  useDeleteAllReadNotificationsMutation,
  useDeleteNotificationMutation,
  useGetUserNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/redux/features/notificationsApi/notificationApi";
import {
  ArrowLeft,
  CheckCircle,
  Info,
  Bell,
  Check,
  X,
  Trash2,
  CheckSquare,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface Notification {
  _id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// ----------------------------------------------------------------------
// Custom Modal Component
// ----------------------------------------------------------------------
interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
}: ConfirmationModalProps) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 w-full"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full w-full px-4 py-2 font-medium text-white ${destructive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; id: string | null }>({
    visible: false,
    id: null,
  });
  const [markAllModal, setMarkAllModal] = useState({ visible: false });
  const [deleteAllModal, setDeleteAllModal] = useState({ visible: false });
  const [deleteReadModal, setDeleteReadModal] = useState({ visible: false });

  // RTK Query hooks
  const { data, isLoading, refetch } = useGetUserNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAll] = useDeleteAllNotificationsMutation();
  const [deleteRead] = useDeleteAllReadNotificationsMutation();

  const notifications: Notification[] = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // ----------------------------------------------------------------------
  // Helper functions
  // ----------------------------------------------------------------------
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "report_resolved":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "report_rejected":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "report_in_progress":
      case "report_updated":
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getItemBackground = (read: boolean) => (read ? "bg-white" : "bg-blue-50");

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  // ----------------------------------------------------------------------
  // Event handlers
  // ----------------------------------------------------------------------
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      await refetch();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteNotification(deleteModal.id).unwrap();
      await refetch();
      setDeleteModal({ visible: false, id: null });
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      setMarkAllModal({ visible: false });
      return;
    }
    try {
      await markAllAsRead().unwrap();
      await refetch();
      setMarkAllModal({ visible: false });
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) {
      setDeleteAllModal({ visible: false });
      return;
    }
    try {
      await deleteAll().unwrap();
      await refetch();
      setDeleteAllModal({ visible: false });
    } catch (error) {
      console.error("Error deleting all:", error);
    }
  };

  const handleDeleteRead = async () => {
    const readCount = notifications.filter((n) => n.read).length;
    if (readCount === 0) {
      setDeleteReadModal({ visible: false });
      return;
    }
    try {
      await deleteRead().unwrap();
      await refetch();
      setDeleteReadModal({ visible: false });
    } catch (error) {
      console.error("Error deleting read:", error);
      alert("Failed to delete read notifications. Please try again.");
    }
  };



  const closeOptions = () => setShowOptions(false);

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  return (
    <div className="flex min-h-screen flex-col">
      {/* Modals */}
      <ConfirmationModal
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        confirmText="Delete"
        destructive
      />
      <ConfirmationModal
        visible={markAllModal.visible}
        onClose={() => setMarkAllModal({ visible: false })}
        onConfirm={handleMarkAllAsRead}
        title="Mark All as Read"
        message={`Mark all ${unreadCount} notifications as read?`}
        confirmText="Mark All"
      />
      <ConfirmationModal
        visible={deleteAllModal.visible}
        onClose={() => setDeleteAllModal({ visible: false })}
        onConfirm={handleDeleteAll}
        title="Delete All Notifications"
        message={`Are you sure you want to delete all ${notifications.length} notifications?`}
        confirmText="Delete All"
        destructive
      />
      <ConfirmationModal
        visible={deleteReadModal.visible}
        onClose={() => setDeleteReadModal({ visible: false })}
        onConfirm={handleDeleteRead}
        title="Delete Read Notifications"
        message={`Delete ${notifications.filter((n) => n.read).length} read notifications?`}
        confirmText="Delete"
        destructive
      />

      {/* Main content – clicking outside closes options menu */}
      <div className="relative flex-1" onClick={closeOptions}>
        {/* Header */}
        <div className="bg-white rounded-xl px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center py-4"
            >
              <ArrowLeft className="h-6 w-6 text-[#242526]" />
              <span className="ml-1 text-lg font-bold text-[#242526]">Back</span>
            </button>

            {notifications.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}
                className="p-2"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold text-black">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mb-2 mt-0.5 text-sm text-blue-600">{unreadCount} unread</p>
          )}

          {/* Options dropdown menu */}
          {showOptions && notifications.length > 0 && (
            <div
              className="absolute right-4 top-16 z-10 w-56 rounded-lg border border-gray-200 bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                <span className="font-semibold text-gray-700">Options</span>
                <button onClick={closeOptions}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <button
                onClick={() => {
                  setMarkAllModal({ visible: true });
                  setShowOptions(false);
                }}
                className="flex w-full items-center border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
              >
                <Check className="h-5 w-5 text-blue-500" />
                <span className="ml-3 text-gray-700">Mark all as read</span>
                {unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setDeleteReadModal({ visible: true });
                  setShowOptions(false);
                }}
                className="flex w-full items-center border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
              >
                <CheckSquare className="h-5 w-5 text-green-500" />
                <span className="ml-3 text-gray-700">Delete read</span>
              </button>

              <button
                onClick={() => {
                  setDeleteAllModal({ visible: true });
                  setShowOptions(false);
                }}
                className="flex w-full items-center px-4 py-3 hover:bg-gray-50"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
                <span className="ml-3 text-red-600">Delete all</span>
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {notifications.length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Bell className="h-12 w-12 text-gray-400" />
              <p className="mt-4 text-center text-lg text-gray-500">
                No notifications yet
              </p>
              <p className="mt-2 text-center text-sm text-gray-400">
                When you get notifications, they'll appear here
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`${getItemBackground(
                    notification.read
                  )} border-b border-gray-100 rounded-[12px] mt-1`}
                >
                  <div className="flex p-4">
                    {/* Icon */}
                    <div className="mr-3 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="flex-1 font-semibold text-gray-900">
                          {notification.type
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </h4>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {notification.content}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex gap-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="flex items-center"
                          >
                            <Check className="h-4 w-4 text-blue-500" />
                            <span className="ml-1 text-xs text-blue-600">
                              Mark read
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setDeleteModal({ visible: true, id: notification._id })
                          }
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="ml-1 text-xs text-red-600">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}