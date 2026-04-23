/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useAddDeliveryOptionMutation,
  useDeleteDeliveryOptionMutation,
  useGetDeliveryOptionsQuery,
  useUpdateDeliveryOptionMutation,
} from "@/redux/features/deliveryOptionsApi/deliveryOptionsApi";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Loader2, Edit2 } from "lucide-react";

interface DeliveryOption {
  _id?: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  icon: string | null;
  basePrice: number;
  perKm: number;
  speed: number;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  icon: string | null;
  basePrice: number;
  perKm: number;
  speed: number;
}

const colorOptions = [
  { value: "bg-green-100", textColor: "text-green-600", label: "Green" },
  { value: "bg-yellow-100", textColor: "text-yellow-600", label: "Yellow" },
  { value: "bg-blue-100", textColor: "text-blue-600", label: "Blue" },
  { value: "bg-red-100", textColor: "text-red-600", label: "Red" },
  { value: "bg-purple-100", textColor: "text-purple-600", label: "Purple" },
  { value: "bg-pink-100", textColor: "text-pink-600", label: "Pink" },
  { value: "bg-indigo-100", textColor: "text-indigo-600", label: "Indigo" },
  { value: "bg-gray-100", textColor: "text-gray-600", label: "Gray" },
  { value: "bg-orange-100", textColor: "text-orange-600", label: "Orange" },
  { value: "bg-teal-100", textColor: "text-teal-600", label: "Teal" },
];

const DeliveryOptionsAdmin: React.FC = () => {
  const {
    data: options,
    isLoading,
    error,
    refetch,
  } = useGetDeliveryOptionsQuery({});
  const [addOption, { isLoading: isAdding }] = useAddDeliveryOptionMutation();
  const [updateOption, { isLoading: isUpdating }] =
    useUpdateDeliveryOptionMutation();
  const [deleteOption, { isLoading: isDeleting }] =
    useDeleteDeliveryOptionMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | any>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    tag: "",
    tagColor: "bg-gray-100",
    tagTextColor: "text-gray-600",
    icon: null,
    basePrice: 0,
    perKm: 0,
    speed: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "basePrice" || name === "perKm" || name === "speed"
          ? Number(value)
          : value,
    }));
  };

  const handleColorChange = (colorValue: string) => {
    const selectedColor = colorOptions.find((c) => c.value === colorValue);
    setFormData((prev) => ({
      ...prev,
      tagColor: colorValue,
      tagTextColor: selectedColor?.textColor || "text-gray-600",
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOption(formData).unwrap();
      setIsAddModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error("Failed to add option:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    try {
      await updateOption({ id: selectedOption._id, option: formData }).unwrap();
      setIsEditModalOpen(false);
      setSelectedOption(null);
      resetForm();
      refetch();
    } catch (err) {
      console.error("Failed to update option:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOption) return;
    try {
      await deleteOption(selectedOption._id).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedOption(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete option:", err);
    }
  };

  const openEditModal = (option: DeliveryOption) => {
    setSelectedOption(option);
    setFormData({
      title: option.title,
      description: option.description,
      tag: option.tag,
      tagColor: option.tagColor,
      tagTextColor: option.tagTextColor,
      icon: option.icon,
      basePrice: option.basePrice,
      perKm: option.perKm,
      speed: option.speed,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (option: DeliveryOption) => {
    setSelectedOption(option);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tag: "",
      tagColor: "bg-gray-100",
      tagTextColor: "text-gray-600",
      icon: null,
      basePrice: 0,
      perKm: 0,
      speed: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">
            Error loading delivery options
          </p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-0 md:px-4 bg-white rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4 lg:px-0">
        <h1 className="text-2xl font-bold">Delivery Options</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Option
        </button>
      </div>

      {/* Table with borders */}
      <div className="overflow-x-auto">
        <Table className="border-collapse border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="border-r border-gray-200 px-4 py-3 font-semibold">
                Title
              </TableHead>
              <TableHead className="border-r border-gray-200 px-4 py-3 font-semibold">
                Tag
              </TableHead>
              <TableHead className="border-r border-gray-200 px-4 py-3 font-semibold">
                Base Price
              </TableHead>
              <TableHead className="border-r border-gray-200 px-4 py-3 font-semibold">
                Per KM
              </TableHead>
              <TableHead className="border-r border-gray-200 px-4 py-3 font-semibold">
                Speed
              </TableHead>
              <TableHead className="px-4 py-3 font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options?.map((option: any) => (
              <TableRow
                key={option._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  {option.title}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${option.tagColor} ${option.tagTextColor}`}
                  >
                    {option.tag}
                  </span>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  ${option.basePrice}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  ${option.perKm}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  {option.speed} km/h
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => openEditModal(option)}
                         className="text-blue-600 mr-2"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(option)}
                      className="gap-1 rounded-[6px] text-red-600 hover:text-red-700 "
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!options || options.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500 border border-gray-200"
                >
                  No delivery options found. Click "Add New Option" to create
                  one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals and Dialogs (unchanged) */}
      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white !rounded-[12px]">
          <DialogHeader>
            <DialogTitle>Add New Delivery Option</DialogTitle>
            <DialogDescription>
              Create a new delivery option for your service.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Bicycle Delivery"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  className="text-gray-700 border border-gray-300 rounded-[6px]"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Perfect for light parcels..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag">Tag *</Label>
                  <Input
                    id="tag"
                    name="tag"
                    value={formData.tag}
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    onChange={handleInputChange}
                    required
                    placeholder="Best for short trips"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagColor">Tag Color *</Label>
                  <Select
                    value={formData.tagColor}
                    onValueChange={handleColorChange}
                  >
                    <SelectTrigger className="text-gray-700 border border-gray-300 rounded-[6px]">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon || ""}
                  onChange={handleInputChange}
                  className="text-gray-700 border border-gray-300 rounded-[6px]"
                  placeholder="icon-name"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price *</Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perKm">Price per KM *</Label>
                  <Input
                    id="perKm"
                    name="perKm"
                    type="number"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.perKm}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed (km/h) *</Label>
                  <Input
                    id="speed"
                    name="speed"
                    type="number"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.speed}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className=" bg-red-600 hover:bg-red-700 rounded-full text-white w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Option"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white !rounded-[12px]">
          <DialogHeader>
            <DialogTitle>Edit Delivery Option</DialogTitle>
            <DialogDescription>
              Update the delivery option details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  className="text-gray-700 border border-gray-300 rounded-[6px]"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tag">Tag *</Label>
                  <Input
                    id="edit-tag"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tagColor">Tag Color *</Label>
                  <Select
                    value={formData.tagColor}
                    onValueChange={handleColorChange}
                  >
                    <SelectTrigger className="text-gray-700 bg-white border border-gray-300 rounded-[6px]">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (optional)</Label>
                <Input
                  id="edit-icon"
                  name="icon"
                  className="text-gray-700 border border-gray-300 rounded-[6px]"
                  value={formData.icon || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-basePrice">Base Price *</Label>
                  <Input
                    id="edit-basePrice"
                    name="basePrice"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-perKm">Price per KM *</Label>
                  <Input
                    id="edit-perKm"
                    name="perKm"
                    type="number"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    value={formData.perKm}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-speed">Speed (km/h) *</Label>
                  <Input
                    id="edit-speed"
                    name="speed"
                    className="text-gray-700 border border-gray-300 rounded-[6px]"
                    type="number"
                    value={formData.speed}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full bg-red-600 hover:bg-red-700 text-white w-full"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-full"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Option"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className=" bg-white !rounded-[12px] ">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the delivery option "
              {selectedOption?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full text-gray-600 w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 rounded-full text-white w-full"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryOptionsAdmin;
