import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getCourses,
  deleteCourse,
  unpublishCourseById,
} from "@/services/courseService";
import Loader from "@/components/ui/Loader";

const CourseList = ({ onEdit }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Error fetching courses");
    }
  };

  const handleDelete = async (id) => {
    let CourseDel = confirm("Do you want to delete it");
    if (!CourseDel) return false;
    try {
      // await axios.delete(`http://localhost:5000/api/courses/${id}`);
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting course");
    }
  };
  const unPublishCourse = async (id, status) => {
    let CourseUnpublish = confirm("Do you want to change course status");
    if (!CourseUnpublish) return false;
    try {
      // await axios.delete(`http://localhost:5000/api/courses/${id}`);
      await unpublishCourseById(id, status);
      if (status) {
        toast.success("Course Unpublished successfully");
      } else {
        toast.success("Course Published successfully");
      }

      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error changing status");
    }
  };
  function truncateText(htmlContent, maxLength) {
    // Create a temporary div element to extract plain text from HTML
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    let textContent = div.textContent || div.innerText || "";

    // Truncate the text content if it's too long
    if (textContent.length > maxLength) {
      textContent = textContent.slice(0, maxLength) + "...";
    }

    return textContent;
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mx-auto md:p-6">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <Link to="/create-Courses">
        <Button className="mb-6">Create New Page</Button>
      </Link>

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="shadow-lg">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              )}
              <CardContent>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 line-clamp-3">
                  {truncateText(course.description,100)}
                </p>
                <p className="text-blue-600 font-bold mt-2">₹{course.price}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    <Link to={"/edit-course/" + course._id}>Edit</Link>
                  </Button>
                  <Button
                    onClick={() => handleDelete(course._id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    <Link to={"/orderCourse/" + course._id}>View Students</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      unPublishCourse(
                        course._id,
                        !course.unPublish ? true : false
                      )
                    }
                  >
                    {!course.unPublish ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
