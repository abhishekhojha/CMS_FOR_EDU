import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Label, Input } from "@/components/ui";
import { getSections, updateSection } from "@/services/SectionService";
import Loader from "@/components/ui/Loader";
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);

    try {
      const response = await getSections(id);
      //   const response = await axios.get(`/sections/${id}`);
      setLoading(false);
      setSections(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching sections:", error);
    }
  };
  // handle form submission
  const handleSaveForm = async (event, sectionId) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      pageId: id,
      sections: [
        {
          _id: sectionId,
        },
      ],
    };
    for (let [key, value] of formData.entries()) {
      if (key === "pageId") {
        // result.pageId = value;
      } else {
        const match = key.match(/elements\[(\d+)\]\.(.+)/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (!data.sections[index]) {
            data.sections[index] = {};
          }
          console.log(field);
          
          data.sections[index][field] = value;
        }
      }
    }

    try {
      let elements = data.sections;
      let sectionData = {
        sectionId: sectionId,
        elements: elements,
      }
      // console.log(elements);
      // return
      const response = await updateSection(sectionData);
      if (response.status === 200) {
        alert("Section saved successfully!");
        fetchSections(); // Refresh the sections
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error saving section:", error);
      alert("An error occurred while saving.");
    }
  };
  //handle form submission end

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Sections Management</h2>

      {/* <Button onClick={handleAddSection}>Add Section</Button>
      <Button onClick={handleSaveSections} className="ml-2">
        Save Sections
      </Button> */}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Title</th>
              {/* <th className="p-3 border">Order</th> */}
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections?.map((section) => (
              <tr key={section._id} className="hover:bg-gray-50 text-center">
                <td className="p-3 border">{section.title}</td>
                {/* <td className="p-3 border">{section.order}</td> */}
                <td className="p-3 border">
                  {/* <button onClick={() => handleDeleteSection(section._id)}>
                    View
                  </button> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit Section</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          Here You Can Edit The Section
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => handleSaveForm(e, section._id)}
                        className="space-y-4"
                      >
                        <Input
                          type="hidden"
                          name="pageId"
                          value={section.pageId}
                        />

                        {section.elements.map((element, index) => (
                          <div
                            key={index}
                            className="space-y-2 border p-4 rounded-lg"
                          >
                            <h3 className="font-bold">{element.html_id}</h3>
                            <Input
                              type="hidden"
                              name={`elements[${index}]._id`}
                              value={element._id || ""}
                            />
                            <Label>{element.type}</Label>

                            {/* Content Input for Button and Link */}
                            {["button", "link"].includes(element.type) && (
                              <>
                                <Label htmlFor={`content-${index}`}>
                                  Content
                                </Label>
                                <Input
                                  type="text"
                                  id={`content-${index}`}
                                  placeholder="Button or Link Text"
                                  name={`elements[${index}].content`}
                                  defaultValue={element.content || ""}
                                />

                                <Label htmlFor={`url-${index}`}>URL</Label>
                                <Input
                                  type="text"
                                  id={`url-${index}`}
                                  placeholder="URL"
                                  name={`elements[${index}].url`}
                                  defaultValue={element.url || ""}
                                />
                              </>
                            )}

                            {/* Content Input */}
                            {[
                              "paragraph",
                              "heading1",
                              "heading2",
                              "heading3",
                              "quote",
                              "code",
                              "preformatted",
                            ].includes(element.type) && (
                              <Input
                                type="text"
                                placeholder="Content"
                                name={`elements[${index}].content`}
                                defaultValue={element.content || ""}
                              />
                            )}

                            {/* URL Input */}
                            {["image", "video"].includes(element.type) &&
                              element.url && (
                                <Input
                                  type="text"
                                  placeholder="URL"
                                  name={`elements[${index}].url`}
                                  defaultValue={element.url || ""}
                                />
                              )}

                            {/* Alt Text Input */}
                            {["image", "video"].includes(element.type) &&
                              element.altText && (
                                <>
                                  <Label htmlFor={`altText-${index}`}>
                                    Alt Text
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`altText-${index}`}
                                    placeholder="Alt Text"
                                    name={`elements[${index}].altText`}
                                    defaultValue={element.altText || ""}
                                  />
                                </>
                              )}

                            {/* List or Table Input */}
                            {["list", "orderedList", "table"].includes(
                              element.type
                            ) &&
                              element.items && (
                                <>
                                  {element.items.map((item, itemIndex) => (
                                    <Input
                                      key={itemIndex}
                                      type="text"
                                      placeholder={`Item ${itemIndex + 1}`}
                                      name={`elements[${index}].items[${itemIndex}]`}
                                      defaultValue={item}
                                    />
                                  ))}
                                </>
                              )}
                          </div>
                        ))}
                        <Button type="submit" className="max-sm:w-full">
                          Save Sections
                        </Button>
                      </form>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
