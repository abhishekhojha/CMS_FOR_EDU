import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { createCourse } from "@/services/courseService";
import TiptapEditor from "@/components/TiptapEditor"; // 👈 import

const CreateCourseForm = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCourseData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCourseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value) => {
    setCourseData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.image) return toast.error("Please upload an image.");

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("price", courseData.price);
    formData.append("image", courseData.image);

    try {
      setLoading(true);
      await createCourse(formData);
      toast.success("Course created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto md:p-6 bg-white shadow-lg rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-6">Create New Course</h2>

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
      <TiptapEditor
        value={courseData.description}
        onChange={handleDescriptionChange}
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
        required
      />

      {loading ? (
        <Button disabled className="mt-6 w-full">
          <Loader2 className="animate-spin mr-2" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" className="mt-6 w-full">
          Create Course
        </Button>
      )}
    </form>
  );
};

export default CreateCourseForm;
