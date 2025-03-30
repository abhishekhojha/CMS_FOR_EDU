import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getContactForms } from "@/services/contactServices";
const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async (page = 1) => {
    try {
      const response = await getContactForms(`?page=${page}&limit=10`);
      setContacts(response.data.contacts);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="md:p-6">
      <h2 className="text-xl font-bold mb-4">Contact List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">First Name</th>
              <th className="py-2 px-4 border">Last Name</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Message</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50 text-center">
                  <td className="py-2 px-4 border">{contact.fname}</td>
                  <td className="py-2 px-4 border">{contact.lname}</td>
                  <td className="py-2 px-4 border">{contact.phone}</td>
                  <td className="py-2 px-4 border">{contact.email}</td>
                  <td className="py-2 px-4 border">{contact.message || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ContactList;
