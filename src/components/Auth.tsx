import React, { useState } from "react";
import { Mail, Lock, User, UserPlus, LogIn, CheckCircle2, Users, BookOpen, TrendingUp } from "lucide-react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import FeatureItem from "./ui/FeatureItem";

interface AuthProps {
  onSuccess: (token: string, user: { id: string; name: string; email: string }) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Store in localStorage
      localStorage.setItem("study-chat-token", data.token);
      localStorage.setItem("study-chat-user", JSON.stringify(data.user));

      onSuccess(data.token, data.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#06070a] text-slate-100 font-sans overflow-hidden w-full relative">
      {/* Decorative gradient glowing spheres in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

      {/* Left side: branding and features */}
      <div className="hidden lg:flex w-1/2 bg-[#090b10]/40 border-r border-slate-900/60 p-16 flex-col justify-between relative overflow-hidden shrink-0 select-none">
        {/* Top logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wide text-slate-100">
            StudySpace
          </span>
        </div>

        {/* Content Area */}
        <div className="max-w-md my-auto space-y-10 relative z-10">
          {isLogin ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-200">
                Welcome <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Back!</span>
                <br />We missed you.
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Log in to continue your learning journey and connect with your study community.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-200">
                Learn Together.
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Grow</span> Together.
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Join a collaborative study space where ideas connect and knowledge grows.
              </p>
            </div>
          )}

          {/* List bullets */}
          <div className="space-y-5">
            {isLogin ? (
              <>
                <FeatureItem
                  icon={Users}
                  title="Collaborate & Learn"
                  description="Join study rooms and learn together"
                />
                <FeatureItem
                  icon={BookOpen}
                  title="Organized & Efficient"
                  description="Keep all your notes and resources in one place"
                />
                <FeatureItem
                  icon={TrendingUp}
                  title="Track Your Progress"
                  description="Monitor your growth and achieve your goals"
                />
              </>
            ) : (
              <>
                <FeatureItem
                  icon={Users}
                  title="Collaborative Learning"
                  description="Study together and achieve more"
                />
                <FeatureItem
                  icon={BookOpen}
                  title="Organized & Focused"
                  description="Keep your notes and resources in one place"
                />
                <FeatureItem
                  icon={TrendingUp}
                  title="Track Your Progress"
                  description="Set goals and level up your skills"
                />
              </>
            )}
          </div>
        </div>

      </div>

      {/* Right side: Auth Form card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-[420px] bg-[#0c0e15]/40 border border-slate-900/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative">
          <div className="text-center mb-6">
            {/* Header Icon */}
            {isLogin ? (
              <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-5 h-5 text-purple-400" />
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-100">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {isLogin
                ? "Access your course study chatrooms and discuss with peers"
                : "Join our community and start your learning journey"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold text-center leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                icon={User}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isLogin ? "you@example.com" : "Enter your email address"}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              icon={Lock}
              helperText={!isLogin ? "At least 8 characters" : undefined}
              helperIcon={!isLogin ? CheckCircle2 : undefined}
              required
            />

            {isLogin && (
              <div className="text-right -mt-2">
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold transition-all"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                icon={Lock}
                required
              />
            )}

            <Button
              type="submit"
              loading={loading}
              icon={isLogin ? LogIn : UserPlus}
              className="mt-2"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold focus:outline-none transition-all ml-1 cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
