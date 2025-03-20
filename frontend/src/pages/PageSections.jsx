import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Label, Input } from "@/components/ui";
import { getSections} from "@/services/SectionService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
const SectionsManagement = () => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [newSections, setNewSections] = useState([]);
  const [addSection, setAddSection] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);
  console.log("sections:" + sections);

  const fetchSections = async () => {
    console.log("in");

    try {
      const response = await getSections(id);
      //   const response = await axios.get(`/sections/${id}`);
      console.log(response);

      //   setSections(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleAddSection = () => {
    setNewSections([...newSections, { title: "", order: 1, elements: [] }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSections = [...newSections];
    updatedSections[index][field] = value;
    setNewSections(updatedSections);
  };

  const handleSaveSections = async () => {
    try {
      await axios.post(`/api/sections`, { sections: newSections, id });
      setNewSections([]);
      fetchSections();
    } catch (error) {
      console.error("Error saving sections:", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete(`/api/sections/${sectionId}`);
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Sections Management</h2>
      {/* <Dialog>
        <DialogTrigger>
          <Button variant="outline">Add Section</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSections} className="space-y-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </form>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <Button onClick={handleAddSection}>Add Section</Button>
      <Button onClick={handleSaveSections} className="ml-2">
        Save Sections
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Order</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections?.map((section) => (
              <tr key={section._id} className="hover:bg-gray-50 text-center">
                <td className="p-3 border">{section.title}</td>
                <td className="p-3 border">{section.order}</td>
                <td className="p-3 border">
                  <button onClick={() => handleDeleteSection(section._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionsManagement;
