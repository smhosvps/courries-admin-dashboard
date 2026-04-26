/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgot_passwordMutation } from "@/redux/features/user/userApi";
import { ChevronLeft, Loader2, Mail, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/COURIES l.png"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgot_password, { isLoading }] = useForgot_passwordMutation();
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const result: any = await forgot_password({
        email: email.toLowerCase().trim(),
      }).unwrap();

      if (result?.success) {
        // Store email in sessionStorage for reset password
        sessionStorage.setItem("resetEmail", email);

        // Navigate to reset password page
        navigate("/reset-password", {
          state: { email },
          replace: true,
        });
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);

      let errorMessage = "Failed to send reset link. Please try again.";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 404) {
        errorMessage = "No account found with this email address.";
      } else if (err?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Special Designed Background Elements */}
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
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Login
            </Link>
          </div>

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
                    className=" rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl"
                  />
                </Link>
                {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full" /> */}
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-2xl mb-5 font-bold bg-gradient-to-r from-[#1969fe] to-blue-700 bg-clip-text text-transparent">
                  Forgot Password
                </h1>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base text-foreground/70 max-w-lg mx-auto">
                Enter your email to receive a password reset link
              </p>
            </div>
          </div>

          {/* Reset Password Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-700 mb-4">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-semibold">Enter Your Email</h3>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground"
                  >
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                       placeholder="your.email@courries.com"
                      className="w-full pl-12 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your staff account
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-blue-900">
                        Security Information
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Reset link will be sent to your email</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Link expires in 30 minutes</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>Check your spam folder if not received</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                     className="w-full bg-[#1969fe] text-white text-base font-semibold rounded-full shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Send Reset Link
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-center space-y-3">
                <p className="text-sm text-foreground/70">
                  Remember your password?{" "}
                  <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Login here
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure password reset process with encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Courries • © {new Date().getFullYear()} All
              rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Background Adjustments */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}
