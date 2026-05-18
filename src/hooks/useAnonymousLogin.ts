import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export function useAnonymousLogin() {
  const { isLoggedIn, isLoading, anonymousLogin } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      anonymousLogin();
    }
  }, []);
}
