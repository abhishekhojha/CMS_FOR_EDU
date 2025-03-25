import React, { useEffect, useState } from 'react';
import { getPages, deletePage } from '@/services/pageService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { toast } from "react-toastify";
import Loader from '@/components/ui/Loader';

function PagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await getPages();
        setLoading(false)
        setPages(response.data);
      } catch (err) {
        setLoading(false)
        toast.error('Error fetching pages:', err);
      }
    };
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await deletePage(id);
      setPages((prev) => prev.filter((page) => page._id !== id));
    }
  };
  if (loading) {
    return <Loader />
  }
  return (
    <div className='mt-4'>
      <h1 className="text-2xl font-bold mb-4">All Pages</h1>
      <Link to="/create-pages">
        <Button className="mb-4">Create New Page</Button>
      </Link>

      {pages.length === 0 ? (
        <p>No pages found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Slug</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Created By</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page._id} className="hover:bg-gray-50 text-center">
                  <td className="p-3 border">{page.title}</td>
                  <td className="p-3 border">{page.slug}</td>
                  <td className="p-3 border">{page.description}</td>
                  <td className="p-3 border">{page.createdBy.name}</td>
                  <td className="p-3 border-t flex gap-2 justify-center">
                    <Link to={`/pages/${page._id}/${page.title}`}>
                      <Button className="">View</Button>
                    </Link>
                    <Link to={`/edit-pages/${page._id}/${page.title}`}>
                      <Button className="">Edit</Button>
                    </Link>
                    {/* <Button onClick={() => handleDelete(page._id)} className="bg-red-500">Delete</Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PagesList;
