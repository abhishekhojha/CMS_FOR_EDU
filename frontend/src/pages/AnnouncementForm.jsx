import React, { useState, useEffect } from "react";
import { createAnnouncement } from "@/services/announcementServices";
import { getCourses } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

export default function AnnouncementForm() {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    content: "",
    attachments: [],
  });

  const [courses, setCourses] = useState([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [fileType, setFileType] = useState("");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAttachment = () => {
    if (attachmentUrl && fileType) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, { url: attachmentUrl, fileType }],
      }));
      setAttachmentUrl("");
      setFileType("");
    } else {
      toast.error("Please enter a URL and select a file type.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement(formData);
      toast.success("Announcement created successfully!");
      setFormData({ courseId: "", title: "", content: "", attachments: [] });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create announcement"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <label>Course:</label>
      <select
        name="courseId"
        onChange={handleChange}
        value={formData.courseId}
        required
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>

      <label>Title:</label>
      <Input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Content:</label>
      <Textarea
        name="content"
        placeholder="Content"
        value={formData.content}
        onChange={handleChange}
      />

      {/* Attachment URL Input */}
      <label>Attachment URL:</label>
      <Input
        type="url"
        placeholder="Paste file URL (image/pdf)"
        value={attachmentUrl}
        onChange={(e) => setAttachmentUrl(e.target.value)}
      />

      {/* Select File Type */}
      <select onChange={(e) => setFileType(e.target.value)} value={fileType}>
        <option value="">Select File Type</option>
        <option value="image">Image</option>
        <option value="pdf">PDF</option>
      </select>

      <Button type="button" onClick={handleAddAttachment}>
        Add Attachment
      </Button>

      {/* Display Added Attachments */}
      {formData.attachments.length > 0 && (
        <div>
          <h3 className="font-bold">Attachments:</h3>
          <ul>
            {formData.attachments.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileType === "image" ? "📷 Image" : "📄 PDF"}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button type="submit">Create Announcement</Button>
    </form>
  );
}
