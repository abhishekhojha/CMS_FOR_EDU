import React, { useEffect, useState } from "react";
import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    try {
      const response = await getAllNotifications(`?page=${page}&limit=5`);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <Link to="/create-notifications">
        <Button className="mb-4">Create New Notification</Button>
      </Link>

      {/* Notification List */}
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  <td className="p-3 w-[250px]">{notification.message}</td>
                  <td className="p-3 border">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    {notification.recipients[0]?.isRead ? "Read" : "Unread"}
                  </td>
                  <td className="p-3 border flex gap-2">
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

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
