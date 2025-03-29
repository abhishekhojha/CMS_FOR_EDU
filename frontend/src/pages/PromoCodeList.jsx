import React, { useEffect, useState } from "react";
import { getPromoCodes, deletePromoCode } from "@/services/promoCodeService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

function PromoCodeList() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await getPromoCodes();
        setLoading(false);
        setPromoCodes(response.promoCodes);
      } catch (err) {
        setLoading(false);
        toast.error("Error fetching promo codes:", err);
      }
    };
    fetchPromoCodes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      try {
        await deletePromoCode(id);
        setPromoCodes((prev) => prev.filter((promo) => promo._id !== id));
        toast.success("Promo code deleted successfully");
      } catch (err) {
        toast.error("Error deleting promo code:", err);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">All Promo Codes</h1>
      <Link to="/create-promo">
        <Button className="mb-4">Create New Promo Code</Button>
      </Link>

      {promoCodes.length === 0 ? (
        <p>No promo codes found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Discount (%)</th>
                <th className="p-3 border">Max Discount</th>
                <th className="p-3 border">Expiry Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id} className="hover:bg-gray-50 text-center">
                  <td className="p-3 border">{promo.code}</td>
                  <td className="p-3 border">{promo.discountPercentage}%</td>
                  <td className="p-3 border">{promo.maxDiscount || "N/A"}</td>
                  <td className="p-3 border">
                    {new Date(promo.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {promo.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </td>
                  <td className="p-3 border flex gap-2 justify-center">
                    <Link to={`/edit-promo/${promo._id}`}>
                      <Button>Edit</Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(promo._id)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
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

export default PromoCodeList;
