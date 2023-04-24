import { useNavigate } from "react-router-dom";
import { axiosDefault } from "../Axios.js";
import useAuth from "../Hooks/useAuth.js";

export default function Account() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSignOut = async () => {
    try {
      await axiosDefault.get("/auth/sign-out", {
        withCredentials: true,
      });
      setAuth({});
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div onClick={handleSignOut}>Sign out</div>
      </header>
    </div>
  );
}
