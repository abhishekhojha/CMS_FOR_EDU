import React, { useState, useEffect } from "react";
import { createNotification } from "@/services/notificationService";
import { getCourses } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationForm() {
  const [formData, setFormData] = useState({
    courseId: "",
    message: "",
  });

  const [courses, setCourses] = useState([]);

  // Fetch all courses
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

  const handleCourseChange = (value) => {
    setFormData((prev) => ({ ...prev, courseId: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotification(formData);
      toast.success("Notification created successfully!");
      setFormData({ courseId: "", message: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create notification"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Course Select Dropdown */}
      <Select
        onValueChange={handleCourseChange}
        value={formData.courseId}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Course" />
        </SelectTrigger>
        <SelectContent>
          {courses.length > 0 ? (
            courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>No Courses Available</SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Notification Message */}
      <Textarea
        name="message"
        placeholder="Notification Message"
        value={formData.message}
        onChange={handleChange}
        required
      />

      {/* Submit Button */}
      <Button type="submit">Create Notification</Button>
    </form>
  );
}
