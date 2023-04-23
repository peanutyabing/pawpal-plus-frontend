import { useNavigate } from "react-router-dom";
import useSignOut from "../Hooks/useSignOut.js";

export default function Account() {
  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div onClick={handleSignOut}>Sign out</div>
      </header>
    </div>
  );
}
