import React, { useEffect, useState } from "react";
import {
  getAllAnnouncements,
  deleteAnnouncement,
} from "@/services/announcementServices";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/Loader";

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = async () => {
    try {
      const response = await getAllAnnouncements(`?page=${page}&limit=5`);
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch announcements");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await deleteAnnouncement(id);
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      <Link to="/create-announcements">
        <Button className="mb-4">Create New Announcement</Button>
      </Link>

      {/* Announcement List */}
      {announcements.length === 0 ? (
        <p>No announcements found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Content</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Attachments</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement._id} className="hover:bg-gray-50">
                  <td className="p-3 border w-[200px]">{announcement.title}</td>
                  <td className="p-3 border w-[250px]">
                    {announcement.content}
                  </td>
                  <td className="p-3 border">
                    {new Date(announcement.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    {announcement.attachments.length > 0 ? (
                      <ul>
                        {announcement.attachments.map((attachment, index) => (
                          <li key={index}>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {attachment.fileType === "image"
                                ? "📷 Image"
                                : "📄 PDF"}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Attachments"
                    )}
                  </td>
                  <td className="p-3 border flex gap-2">
                    <Button
                      onClick={() => handleDelete(announcement._id)}
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
