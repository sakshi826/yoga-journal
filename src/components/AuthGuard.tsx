import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userId = sessionStorage.getItem("user_id");

      if (userId) {
        setIsAuthResolved(true);
        return;
      }

      if (token) {
        try {
          const response = await fetch("https://api.mantracare.com/user/user-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.user_id) {
              sessionStorage.setItem("user_id", data.user_id.toString());
              
              // Initialize user in database
              await fetch("/api/users/init", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: data.user_id }),
              });

              window.history.replaceState({}, "", window.location.pathname);
              setIsAuthResolved(true);
              return;
            }
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
      }

      // If no userId and no token (or failed), redirect
      window.location.href = "/token";
    };

    handleAuth();
  }, [navigate]);

  if (!isAuthResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
