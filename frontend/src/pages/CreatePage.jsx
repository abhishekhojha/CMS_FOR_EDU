import React, { useState } from "react";
import { createPage } from "@/services/pageService";
import { useNavigate } from "react-router-dom";
import { Input, Button, Textarea } from "@/components/ui";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function CreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    createdBy: "",
  });
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useState(() => {
    setFormData({ ...formData, "createdBy": user?.id });

  }, []);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createPage(formData);
      toast.success("Page created successfully!");
      navigate("/pages");
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0]?.msg || "Something went wrong"
      );
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">Create Page</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Title" onChange={handleChange} />
        <Input name="slug" placeholder="Slug" onChange={handleChange} />
        <Textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <Button type="submit">Create Page</Button>
      </form>
    </div>
  );
}

export default CreatePage;
