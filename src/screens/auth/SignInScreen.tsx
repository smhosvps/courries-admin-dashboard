/* eslint-disable @typescript-eslint/no-explicit-any */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/api/apiSlice";
import { setCredentials } from "@/redux/features/auth/authSlice";
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/COURIES l.png"

// Security configurations
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const PASSWORD_MIN_LENGTH = 8;

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lockout timer
  useEffect(() => {
    if (lockout) {
      const timer = setTimeout(() => {
        setLockout(false);
        setAttempts(0);
      }, LOCKOUT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [lockout]);

  // Input validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockout) {
      setError("Too many failed attempts. Please try again in 5 minutes.");
      return;
    }

    if (!validateInputs()) return;

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      setAttempts(0);
      navigate("/dashboard-super-admin");
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockout(true);
        setError("Account temporarily locked due to multiple failed attempts");
        return;
      }

      const errorMessage = err?.data?.message || "Invalid email or password";

      if (errorMessage === "Please verify your account before logging in") {
        navigate("/otp-verification", { state: { email } });
      } else {
        setError(errorMessage);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Special Designed Background Elements - Same as RegisterPage */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={`absolute top-1/4 -left-8 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/20 blur-3xl transition-all duration-1000 ${
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-200/20 to-purple-200/20 blur-3xl transition-all duration-1000 delay-300 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/10 to-indigo-100/10 blur-3xl transition-all duration-1000 delay-500 ${
              mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </div>

        {/* Floating Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                             linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header Section */}

          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="relative">
                <Link
                  to="/"
                  className="inline-block mb- transform transition-transform"
                >
                  <img
                    src={logo}
                    alt="MUD Logo"
                    className=" rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
                  />
                </Link>
                {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-ping" />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full" /> */}
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl mb-5 font-bold bg-gradient-to-r from-[#1969fe] to-blue-700 bg-clip-text text-transparent">
                  Admin Database
                </h1>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base sm:text-lg text-foreground/70 max-w-lg mx-auto">
                Sign in to access the database
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in rounded-2xl border border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 !text-red-700" />
                <AlertTitle className="text-red-600">Login Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || lockout}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@courries.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    <span className="flex items-center gap-2">

                      Password
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || lockout}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum {PASSWORD_MIN_LENGTH} characters required
                </p>
              </div>

              {/* Security Status */}
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Warning:</span> {attempts}{" "}
                    failed attempt{attempts > 1 ? "s" : ""}. Account will be
                    locked after {MAX_ATTEMPTS - attempts} more failed attempt
                    {MAX_ATTEMPTS - attempts > 1 ? "s" : ""}.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || lockout}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-semibold rounded-full shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </span>
                ) : lockout ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Account Locked
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Sign In to Admin Dashboard
                  </span>
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
             courries • © {new Date().getFullYear()} All
              rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Background Adjustments - Same as RegisterPage */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}

