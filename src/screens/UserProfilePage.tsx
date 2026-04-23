/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Pencil, Save, X, Loader2, User, Maximize2 } from "lucide-react";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import { 
  useChangePasswordMutation,
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/redux/features/user/userApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



// Helper to format field labels
const fieldLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone Number",
  address: "Address",
  gender: "Gender",
};

export default function UserProfilePage() {
  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateAvatar, { isLoading: loadingAvatar }] =
    useUpdateAvatarMutation();

  // State for inline editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // State for avatar modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // State for password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = data?.user;

  // Handle avatar upload
  const handleButtonClick = () => fileInputRef.current?.click();

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        if (fileReader.readyState === 2) {
          const avatar = fileReader.result as string;
          try {
            // Pass an object with the avatar property
            await updateAvatar({ avatar }).unwrap();
            toast.success("Avatar updated successfully");
            await refetch(); // Refresh user data
            // Clear the input so the same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = "";
          } catch (err: any) {
            toast.error(err?.data?.message || "Avatar update failed");
          }
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Get user initials for fallback
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return <div className="p-4 text-red-600">Failed to load user data.</div>;
  }

  // Start editing a field
  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || "");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveEdit = async (field: string) => {
    try {
      await updateProfile({ [field]: editValue }).unwrap();
      toast.success(`${fieldLabels[field] || field} updated successfully`);
      await refetch();
      setEditingField(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      await refetch();
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Password change failed");
    }
  };

  const renderField = (field: string) => {
    const value = user[field] || "";
    const isEditing = editingField === field;

    return (
      <div
        key={field}
        className="flex items-start justify-between p-3 border-b last:border-0"
      >
        <div className="flex-1">
          <Label className="text-sm font-medium text-gray-500">
            {fieldLabels[field] || field}
          </Label>
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mt-1"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveEdit(field)}
            />
          ) : (
            <p className="mt-1 text-gray-900">{value || "—"}</p>
          )}
        </div>
        <div className="ml-4 flex gap-1">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => saveEdit(field)}
                disabled={isUpdating}
              >
                <Save className="h-4 w-4 text-blue-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="h-4 w-4 text-blue-600" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => startEdit(field, value)}
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl px-0 py-4 md:px-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      {/* Avatar Card - Improved */}
      <Card className="bg-white/70 rounded-[10px] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with click to enlarge */}
            <Dialog
              open={isAvatarModalOpen}
              onOpenChange={setIsAvatarModalOpen}
            >
              <DialogTrigger asChild>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                    <AvatarImage
                      src={user.avatar?.url}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
                      {getInitials() || <User className="h-12 w-12" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none shadow-none bg-white">
                <div className="relative">
                  <img
                    src={
                      user.avatar?.url ||
                      "/placeholder.svg?height=400&width=400"
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={() => setIsAvatarModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Info and upload button */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{user.role}</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={imageHandler}
                accept="image/*"
                className="hidden"
                aria-label="Upload profile picture"
              />
              <Button
                variant="outline"
                onClick={handleButtonClick}
                disabled={loadingAvatar}
                className="w-full sm:w-auto rounded-[6px] border border-blue-500 text-blue-500 hover:text-blue-600"
              >
                {loadingAvatar ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Change picture"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="bg-white/70 rounded-[10px]">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {renderField("firstName")}
          {renderField("lastName")}
          {renderField("phone")}
          {renderField("gender")}
          {renderField("address")}
        </CardContent>
      </Card>


      {/* Password Change Section */}
      <Card className="bg-white/70 rounded-[10px]">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)}>
              Change Password
            </Button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="text-white bg-[#1969fe] hover:bg-blue-700 rounded-[6px]"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
                <Button
                  className="text-white bg-red-600 hover:bg-red-700 rounded-[6px]"
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
