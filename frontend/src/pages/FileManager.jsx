import React, { useEffect, useState } from "react";
import {
  createFiles,
  getFiles,
  deleteFiles,
} from "@/services/cloudinaryServices";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch all files
  async function fetchFiles() {
    try {
      const res = await getFiles();
      console.log(res);

      setFiles(res.data);
    } catch (error) {
      toast.error("Failed to fetch files!");
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to server
  async function handleUpload() {
    if (!file) return toast.error("Please select a file!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await createFiles(formData);
      toast.success("File uploaded successfully!");
      setFile(null);
      document.getElementById("imgUpl").value = null;
      fetchFiles(); // Refresh the files
    } catch (error) {
      toast.error(error.response?.data?.error || "File upload failed!");
    } finally {
      setLoading(false);
    }
  }

  // Delete file
  async function handleDelete(id) {
    try {
      setLoading(true);
      await deleteFiles(id);
      toast.success("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.error || "File deletion failed!");
    } finally {
      setLoading(false);
    }
  }
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy URL"));
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">File Manager</h1>

      {/* Upload Section */}
      <div className="mb-6 flex gap-4">
        <Input type="file" id="imgUpl" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Please Wait..." : "Upload File"}
        </Button>
      </div>

      {/* File List Section */}
      {files?.length == 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.images?.map((file) => (
            <Card key={file._id}>
              <CardContent className="p-4">
                {file.imageUrl ? (
                  file.imageUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                    <img
                      src={file.imageUrl}
                      alt="Uploaded"
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ) : file.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={file.imageUrl}
                      controls
                      className="rounded-lg object-cover w-full h-48"
                    />
                  ) : (
                    <p>Unsupported file type</p>
                  )
                ) : (
                  <p>Preview not available</p>
                )}
                <div className="flex gap-2 items-center py-2">
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {file.imageUrl}
                  </p>
                  <button
                    onClick={() => copyToClipboard(file.imageUrl)}
                    className="p-2 text-gray-500 hover:text-gray-800"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleDelete(file._id)}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
