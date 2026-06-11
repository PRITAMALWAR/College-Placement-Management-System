import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // Get Logged In User
  const loadUser = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get(
        "/auth/me"
      );

      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (
    email,
    password
  ) => {
    const res = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.user);

    return res.data;
  };

  // Register
  const register = async (
    formData
  ) => {
    const res = await API.post(
      "/auth/register",
      formData
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.user);

    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);