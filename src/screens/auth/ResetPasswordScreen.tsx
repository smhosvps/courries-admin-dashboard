/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReset_passwordMutation } from "@/redux/features/user/userApi";
import logo from "../../assets/COURIES l.png"

export default function ResetPasswordScreen() {
  const [resetPassword, { isLoading }] = useReset_passwordMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();
  const storedEmail = location.state?.email;
  const [email, setEmail] = useState(storedEmail || "");
  console.log(setEmail)
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!storedEmail) {
      navigate("/forgot-password");
    }
  }, [navigate, storedEmail]);

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{5}$/.test(otp)) {
      newErrors.otp = "OTP must be exactly 5 digits";
    }

    if (!newPassword) {
      newErrors.password = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) return;

    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword,
      }).unwrap();

      if (result?.success) {
        setSuccess("Password reset successfully! Redirecting to login...");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.status === 400) {
        errorMessage = "Invalid OTP or expired. Please request a new one.";
      } else if (err?.status === 404) {
        errorMessage = "User not found. Please check your email.";
      } else if (err?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Special Designed Background Elements - Same as RegisterPage */}
      <div className="absolute inset-0 overflow-hidden">


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
                <h1 className="text-2xl mb-5 font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                  Password Recovery
                </h1>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base text-foreground/70 max-w-lg mx-auto">
                Enter the OTP sent to your email and create a new secure
                password
              </p>
            </div>
          </div>

          {/* Reset Password Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Go Back
            </button>

            {/* Error/Success Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-blue-300 bg-blue-50/90 animate-in slide-in-from-top">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Display (Read-only) */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/80 text-foreground focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  OTP has been sent to this email address
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-foreground"
                >
                  OTP Code *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Key className="w-4 h-4" />
                  </div>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp)
                        setErrors((prev) => ({ ...prev, otp: "" }));
                    }}
                    placeholder="Enter 5-digit OTP"
                    maxLength={6}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.otp ? "border-red-300" : "border-gray-200"
                      } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Shield className="w-4 h-4" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-300" : "border-gray-200"
                      } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Shield className="w-4 h-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="Re-enter your password"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                      } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must match the new password
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-[#1969fe] text-white text-base font-semibold rounded-full shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </span>
                )}
              </Button>

              {/* Security Note */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    All information is encrypted and secured with 256-bit SSL
                  </span>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-foreground/70">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Login here
                  </button>
                </p>
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
