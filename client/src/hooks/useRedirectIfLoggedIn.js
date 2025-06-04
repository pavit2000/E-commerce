import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfLoggedIn(user) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);
}