import React, { useEffect, useState } from "react";
import {
  getAllUpdates,
  createUpdate,
  deleteUpdate,
} from "@/services/latestUpdates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const LatestUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Modal State
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "https://placehold.co/600x400",
    link: "",
    isActive: true,
  });

  // ✅ Fetch Updates
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const data = await getAllUpdates();
      setUpdates(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch updates.");
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle Create Update
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUpdate(formData);
      toast.success("Update created successfully!");
      setIsOpen(false);
      fetchUpdates();
    } catch (error) {
      toast.error("Failed to create update.");
    }
  };

  // ✅ Handle Delete Update
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    try {
      await deleteUpdate(id);
      toast.success("Update deleted successfully!");
      fetchUpdates();
    } catch (error) {
      toast.error("Failed to delete update.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Updates</h1>

      {/* ✅ Button to Open Modal */}
      <Button onClick={() => setIsOpen(true)}>Create New Update</Button>

      {/* ✅ ShadCN Dialog (Modal) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Latest Update</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Link (Optional)</Label>
              <Input
                name="link"
                value={formData.link}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />{" "}
                Is Active
              </Label>
            </div>
            <Button type="submit">Create Update</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ List Updates */}
      <h2 className="text-2xl font-bold mt-8 mb-4">All Updates</h2>
      {updates.length === 0 ? (
        <p>No updates available</p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update._id} className="p-4 border rounded-lg">
              <h3 className="text-xl font-bold">{update.title}</h3>
              <p>{update.description}</p>
              {update.imageUrl && (
                <img
                  src={update.imageUrl}
                  alt={update.title}
                  className="w-full max-w-md my-4"
                />
              )}
              {update.link && (
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Visit Link
                </a>
              )}
              <p>Status: {update.isActive ? "Active" : "Inactive"}</p>
              <Button
                variant="destructive"
                onClick={() => handleDelete(update._id)}
                className="mt-2"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestUpdates;
