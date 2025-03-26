import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/services/orderService";
import Loader from '@/components/ui/Loader';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(`?page=${page}&limit=10`);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="ordersDiv grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map((order) => (
          <Card key={order._id}>
            <CardContent>
              <p>
                <strong>User:</strong> {order.user?.name} ({order.user?.email})
              </p>
              <p>
                <strong>Course:</strong> {order.course?.title}
              </p>
              <p>
                <strong>Amount:</strong> ₹{order.amount / 100}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Payment Date:</strong> {order.paymentDate || "N/A"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrdersList;
