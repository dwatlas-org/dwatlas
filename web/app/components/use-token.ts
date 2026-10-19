import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useToken() {
  const getToken = () => {
    console.log("getToken");
    // get token from local or session storage
    const tokenLocal = localStorage.getItem("token");
    if (!tokenLocal) {
      console.log("No token");
      return null;
    }

    console.log(`tokenLocal: ${tokenLocal}`);

    const token = tokenLocal;

    if (!token) {
      return null;
    }

    // decode to check expiration (UI only, don't trust client!)
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // we want seconds
      // if expired, remove and retun null
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        return null;
      }
      return token;
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  };
  // TODO this is only using localStorage for now
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    removeToken,
  };
}
