import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpgradeUserTypeMutation } from "@/redux/features/user/userApi";
import { toast } from "react-toastify";
import { Loader2, Shield } from "lucide-react";

interface UpgradeUserTypeProps {
  userId: string;
  currentUserType: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function UpgradeUserType({
  userId,
  currentUserType,
  open,
  onOpenChange,
  onSuccess,
}: UpgradeUserTypeProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [upgradeUserType, { isLoading }] = useUpgradeUserTypeMutation();

  const userTypes = [
    { value: "customer", label: "Customer" },
    { value: "delivery_partner", label: "Delivery Partner" },
    { value: "admin", label: "Admin" },
    { value: "super admin", label: "Super Admin" },
  ];

  const handleUpgrade = async () => {
    if (!selectedType) {
      toast.error("Please select a user type");
      return;
    }

    if (selectedType === currentUserType) {
      toast.info("User is already this type");
      return;
    }

    try {
      const result = await upgradeUserType({
        id: userId,
        newUserType: selectedType,
      }).unwrap();

      toast.success(result.message || "User type upgraded successfully");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to upgrade user type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Upgrade User Type
          </DialogTitle>
          <DialogDescription>
            Change the user type for this account. Current type:{" "}
            <span className="font-semibold text-blue-600">
              {currentUserType}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select New User Type</label>
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose user type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {userTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    disabled={type.value === currentUserType}
                  >
                    {type.label}
                    {type.value === currentUserType && " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType === "delivery_partner" && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Note:</span> Upgrading to
                Delivery Partner will initialize delivery partner information.
                The user will need to complete their profile.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-[6px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={isLoading || !selectedType}
            className="bg-blue-600 hover:bg-blue-700 rounded-[6px] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              "Upgrade User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}