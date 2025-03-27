import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { updateCourse, getCourseById } from "@/services/courseService";
export default function UpdateCourses() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  async function fetchCourse() {
    try {
      setLoading(true);
      const response = await getCourseById(id);
      setCourseData({
        title: response.data.title,
        description: response.data.description,
        price: response.data.price,
        image: null,
      });
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error getting course");
    }
  }
  useEffect(() => {
    fetchCourse();
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCourseData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCourseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("price", courseData.price);
    if (courseData.image) {
      formData.append("image", courseData.image);
    }

    try {
      setLoading(true);
      const response = await updateCourse(id, formData);
      //   const response = await axios.post(
      //     "http://localhost:4000/api/courses",
      //     formData
      //   );
      toast.success("Course updated successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Error updating course");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl"
      >
        <h2 className="text-2xl font-bold mb-6">Update Course</h2>

        <Label className="my-2" htmlFor="title">
          Course Title
        </Label>
        <Input
          type="text"
          name="title"
          id="title"
          placeholder="Enter course title"
          value={courseData.title}
          onChange={handleChange}
          required
        />

        <Label className="my-2" htmlFor="description">
          Description
        </Label>
        <Textarea
          name="description"
          id="description"
          placeholder="Enter course description"
          value={courseData.description}
          onChange={handleChange}
          required
        />

        <Label className="my-2" htmlFor="price">
          Price (INR)
        </Label>
        <Input
          type="number"
          name="price"
          id="price"
          placeholder="Enter course price"
          value={courseData.price}
          onChange={handleChange}
          required
        />

        <Label className="my-2" htmlFor="image">
          Upload Image
        </Label>
        <Input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleChange}
        />

        {loading ? (
          <Button disabled className="mt-6 w-full">
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="mt-6 w-full">
            Update Course
          </Button>
        )}
      </form>
    </div>
  );
}
