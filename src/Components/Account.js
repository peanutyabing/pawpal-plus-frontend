import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth.js";
import useSignOut from "../Hooks/useSignOut.js";

export default function Account() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        {auth.token ? (
          <div className="option" onClick={handleSignOut}>
            Sign out
          </div>
        ) : (
          <div
            className="option"
            onClick={() => {
              navigate("/sign-in");
            }}
          >
            Sign in or register
          </div>
        )}
        {auth.token && <div className="option">Change password</div>}
        {auth.token && <div className="option">Update profile</div>}
      </header>
    </div>
  );
}
