import React, { useEffect, useState } from "react";
import { getOrdersByCourseId, deleteOrder } from "@/services/orderService";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

function OrderByCourseList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { courseId } = useParams();

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getOrdersByCourseId(courseId, page);
      setOrders(response.data.orders);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [courseId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchOrders(newPage);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">Orders for Course</h1>
      {orders.length === 0 ? (
        <p>No orders found for this course</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">User Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 text-center">
                  <td className="p-3 border">{order.user?.name || "-"}</td>
                  <td className="p-3 border">{order.user?.email || "-"}</td>
                  <td className="p-3 border">₹{order.amount}</td>
                  <td className="p-3 border">{order.status}</td>
                  <td className="p-3 border">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default OrderByCourseList;
