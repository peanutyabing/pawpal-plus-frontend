import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth.js";
import useUser from "../Hooks/useUser.js";
import useSignOut from "../Hooks/useSignOut.js";

export default function Account() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { user } = useUser();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.username}
            className="profile-sm margin-tb-m"
          />
        )}
        {user?.username ? (
          <h1 className="large bold">{`Welcome, ${user?.username}!`}</h1>
        ) : (
          <h1 className="large bold">Welcome!</h1>
        )}

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
        {auth.token && (
          <div
            className="option"
            onClick={() => {
              navigate("/update-profile");
            }}
          >
            Update profile
          </div>
        )}
      </header>
    </div>
  );
}
