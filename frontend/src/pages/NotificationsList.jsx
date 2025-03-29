import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      toast.success("Notification marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">Notification</h1>
      <Link to="/create-notifications">
        <Button className="mb-4">Create New Notification</Button>
      </Link>
      {/* Notification List */}
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Message</th>
              <th className="p-3 border">Course ID</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id} className="hover:bg-gray-50">
                <td className="p-3 border">{notification.message}</td>
                <td className="p-3 border">{notification.courseId}</td>
                <td className="p-3 border">
                  {notification.recipients[0]?.isRead ? "Read" : "Unread"}
                </td>
                <td className="p-3 border flex gap-2">
                  {!notification.recipients[0]?.isRead && (
                    <Button onClick={() => handleMarkAsRead(notification._id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(notification._id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
