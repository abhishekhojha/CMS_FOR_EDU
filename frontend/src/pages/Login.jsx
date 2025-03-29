import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/utils/validation";
import { loginSuccess } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate with Zod
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = {};
      result.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/users/login`, formData);
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));
      toast.success("Login successful!");
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
