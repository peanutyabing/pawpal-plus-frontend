import { useEffect, useContext } from "react";
import UserContext from "../Context/UserProvider.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth.js";
import useSignOut from "../Hooks/useSignOut.js";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";

export default function Account() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { user, setUser } = useContext(UserContext);
  const signOut = useSignOut();

  useEffect(() => {
    if (auth?.token) {
      loadUserProfile();
    }
  }, [auth]);

  const loadUserProfile = async () => {
    const profile = await axiosPrivate.get("/user-profile", {
      withCredentials: true,
    });
    setUser(profile.data);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        {user.username ? (
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
