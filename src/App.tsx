import { useState } from "react";
import Auth from "./components/Auth";
import ChatDashboard from "./components/ChatDashboard";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("study-chat-token");
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem("study-chat-user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("study-chat-token");
        localStorage.removeItem("study-chat-user");
        return null;
      }
    }
    return null;
  });

  const handleAuthSuccess = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("study-chat-token");
    localStorage.removeItem("study-chat-user");
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  return <ChatDashboard token={token} user={user} onLogout={handleLogout} />;
}