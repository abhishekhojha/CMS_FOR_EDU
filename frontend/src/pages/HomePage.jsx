import { Button } from "@/components/ui/button";
import { logout } from "@/redux/authSlice";
import { useSelector, useDispatch } from "react-redux";

function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col py-6 items-center justify-center">
      <p>
        Welcome {isAuthenticated && user?.name} to your dashboard. You are
        logged in!
      </p>
    </div>
  );
}

export default Home;
