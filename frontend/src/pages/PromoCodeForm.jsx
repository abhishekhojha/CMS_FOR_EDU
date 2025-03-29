import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui";
import {
  createPromoCode,
  updatePromoCode,
  getPromoCodeById,
} from "@/services/promoCodeService";
import { toast, ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function PromoCodeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    maxDiscount: "",
    expiryDate: "",
    isActive: true,
  });

  const fetchPromoCode = async () => {
    try {
      setLoading(true);
      const { promoCode } = await getPromoCodeById(id);
      setFormData(promoCode);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching promo code data");
    }
  };
  useEffect(() => {
    console.log(id);

    if (id) {
      fetchPromoCode();
    }
  }, []);
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        setLoading(true);
        await updatePromoCode(id, formData);
        setLoading(false);
        toast.success("Promo Code Updated Successfully!");
      } else {
        setLoading(true);
        await createPromoCode(formData);
        setLoading(false);
        toast.success("Promo Code Created Successfully!");
      }
      navigate("/promo-codes");
    } catch (error) {
      setLoading(false);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Promo Code" : "Create Promo Code"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Label className="my-2" htmlFor="title">
          Enter the title
        </Label>
        <Input
          id="title"
          type="text"
          name="code"
          placeholder="Promo Code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <Label className="my-2" htmlFor="discountPercentage">
          Discount Percentage
        </Label>
        <Input
          id="discountPercentage"
          type="number"
          name="discountPercentage"
          placeholder="Discount Percentage"
          value={formData.discountPercentage}
          onChange={handleChange}
          required
        />
        <Label className="my-2" htmlFor="maxDiscount">
          Max Discount (Optional)
        </Label>
        <Input
          id="maxDiscount"
          type="number"
          name="maxDiscount"
          placeholder="Max Discount (Optional)"
          value={formData.maxDiscount}
          onChange={handleChange}
        />
        <Label className="my-2" htmlFor="expiryDate">
          Expiry Date
        </Label>
        <Input
          id="expiryDate"
          type="date"
          name="expiryDate"
          value={formatDate(formData.expiryDate)}
          onChange={handleChange}
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>
        {loading ? (
          <Button disabled >
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">{id ? "Update" : "Create"}Promo Code</Button>
        )}
      </form>
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
