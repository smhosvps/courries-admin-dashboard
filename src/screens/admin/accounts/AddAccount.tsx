/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useAddUserMutation,
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MoveLeftIcon } from "lucide-react";

// Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType: string;
  dateOfBirth: string;
  gender: string;
  adminRiders: string;
}

interface RoleOption {
  value: string;
  label: string;
}

// Options for dropdowns
const roleOptions: RoleOption[] = [
  { value: "customer", label: "Customer" },
  { value: "super admin", label: "Super Admin" },
  { value: "admin", label: "Admin Staff" },
  { value: "delivery_partner", label: "Delivery Partner" },
];

const adminRidersOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const genderOptions = ["Male", "Female"];

export default function AddAccount() {
  const { refetch } = useGetAllUsersQuery({});
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddUserMutation();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    userType: "",
    dateOfBirth: "",
    gender: "",
    adminRiders: ""
  });

  const validateForm = (): boolean => {
    // Required fields check
    const requiredFields: (keyof FormData)[] = [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
      'userType',
      'dateOfBirth',
      'gender',
      'adminRiders'
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        toast.error(`${field.replace(/_/g, " ")} is required`);
        return false;
      }
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Phone number validation (basic)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    // Date of birth validation
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();

    // Check if date is valid
    if (isNaN(dob.getTime())) {
      toast.error("Invalid date of birth");
      return false;
    }

    // Check if date is in the future
    if (dob > today) {
      toast.error("Date of birth cannot be in the future");
      return false;
    }

    // Calculate age (must be at least 18)
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      toast.error("User must be at least 18 years old");
      return false;
    }

    // Max age check (optional, e.g., 100 years)
    if (age > 100) {
      toast.error("Please enter a valid date of birth");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare data for API
      const userData = {
        ...formData,
        // Convert adminRiders to boolean if needed by your API
        // adminRiders: formData.adminRiders === "Yes"
      };

      await addUser(userData).unwrap();
      toast.success("User created successfully");
      refetch();
      navigate(-1);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to create user";
      toast.error(errorMessage);
      console.error("Create user error:", err);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate max date for date of birth (18 years ago)
  const getMaxDate = (): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="container mx-auto p-0 py-4 lg:px-8">
      <Card className="border-blue-100 bg-white/80 rounded-2xl">
        <CardHeader className="border-b border-blue-100 flex flex-row items-center gap-3" >
          <button
                onClick={() => navigate(-1)}
              >
                <MoveLeftIcon className="text-2xl text-blue-600 hover:text-blue-800"/>
              </button>
          <CardTitle className="text-xl text-blue-600">Add New User</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    required
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+2348123456789"
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password * (min 6 chars)</Label>
                  <Input
                    id="password"
                    type="password"
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}

                  >
                    <SelectTrigger id="gender" className="rounded-[12px] border border-gray-300 focus:border-blue-600" >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {genderOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="rounded-[12px] border border-gray-300 focus:border-blue-600"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    max={getMaxDate()}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 18 years old</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Work Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => handleChange("userType", value)}
                  >
                    <SelectTrigger id="role" className="rounded-[12px] border border-gray-300 focus:border-blue-600" >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {roleOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminRiders">Admin Riders? *</Label>
                  <Select
                    value={formData.adminRiders}
                    onValueChange={(value) => handleChange("adminRiders", value)}
                  >
                    <SelectTrigger id="adminRiders" className="rounded-[12px] border border-gray-300 focus:border-blue-600" >
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {adminRidersOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-full"
              >
                Go back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 rounded-full text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}