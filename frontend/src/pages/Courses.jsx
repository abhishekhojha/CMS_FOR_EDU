import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getCourses } from "@/services/courseService";

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
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting course");
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mx-auto p-6">
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
                  {course.description}
                </p>
                <p className="text-blue-600 font-bold mt-2">₹{course.price}</p>
                <div className="flex gap-4 mt-4">
                  <Button onClick={() => onEdit(course)} variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(course._id)}
                    variant="destructive"
                  >
                    Delete
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
