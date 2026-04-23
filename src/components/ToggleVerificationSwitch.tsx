// components/ToggleVerificationSwitch.tsx
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useToggleOverallVerificationMutation } from '@/redux/features/user/userApi';
import { Loader2 } from 'lucide-react';

interface ToggleVerificationSwitchProps {
  userId: string;
  currentVerified: boolean;
  onToggleSuccess: () => void;
}

export function ToggleVerificationSwitch({
  userId,
  currentVerified,
  onToggleSuccess,
}: ToggleVerificationSwitchProps) {
  const [toggleVerification, { isLoading }] = useToggleOverallVerificationMutation();
  const [checked, setChecked] = useState(currentVerified);

  console.log(userId)

  const handleToggle = async () => {
    const newValue = !checked;
    setChecked(newValue);
    try {
      await toggleVerification({ userId, verified: newValue }).unwrap();
      onToggleSuccess();
    } catch (error) {
      setChecked(checked);
      console.error('Failed to toggle verification:', error);
      alert('Failed to update verification status. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-full">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      ) : (
        <Switch
          checked={checked}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-white ring"
        />
      )}
      <span className="text-sm text-muted-foreground">
        {checked ? 'Verified' : 'Not Verified'}
      </span>
    </div>
  );
}